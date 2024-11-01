"use client";

import CallCard from "@/components/timeline/call-card";
import CallsCard from "@/components/timeline/calls-card";
import DateLocationPicker from "@/components/timeline/date-location-picker";
import PaginationComponent from "@/components/timeline/pagination";
import { AgentIcon } from "@/constants/icons";
import { db } from "@/lib/firebaseClient";
import { hasAccessToLocation, useAuth } from "@/providers/auth-provider";
import {
  collection,
  query,
  onSnapshot,
  limit,
  where,
  DocumentData,
  getDocs,
  orderBy,
  startAfter,
  Query,
} from "firebase/firestore";
import {
  BadgeCheck,
  BookUp2,
  ChevronRight,
  LoaderCircle,
  LucideLink,
  MapPin,
  MapPinned,
  PhoneIncoming,
  PhoneMissed,
  Star,
  Voicemail,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Key, useEffect, useState, useRef } from "react";
import { useCallsFilterStore } from "@/stores/calls-filter-store";

const baseUrl = "/calls";

const paramPaths = [
  {
    icon: PhoneIncoming,
    label: "All Incoming Calls",
    href: `${baseUrl}/incoming`,
    filter: null,
  },
  {
    icon: AgentIcon,
    label: "Calls Answered By The Agent",
    href: `${baseUrl}/agent`,
    filter: where("icon_type", "==", "agent"),
  },
  {
    icon: MapPin,
    label: "Calls Answered At The Location",
    href: `${baseUrl}/location`,
    filter: where("icon_type", "==", "business"),
  },
  {
    icon: Voicemail,
    label: "Calls That Reached Voicemail",
    href: `${baseUrl}/voicemail`,
    filter: where("icon_type", "==", "voicemail"),
  },
  {
    icon: LucideLink,
    label: "Calls For Online Booking Link",
    href: `${baseUrl}/online-booking`,
    filter: where("labels", "array-contains", "Text for appointment link"),
  },
  {
    icon: MapPinned,
    label: "Calls For Hours And Location Info",
    href: `${baseUrl}/hours-location`,
    filter: where("labels", "array-contains", "Hours and location"),
  },
  {
    icon: PhoneMissed,
    label: "Calls With Potential Complaints",
    href: `${baseUrl}/complaints`,
    filter: where("labels", "array-contains", "Complaint"),
  },
  {
    icon: Star,
    label: "Calls Marked For Manager Review",
    href: `${baseUrl}/manager-review`,
    filter: where("labels", "array-contains", "Marked for review"),
  },
  {
    icon: BookUp2,
    label: "Calls Where Upselling Was Attempted",
    href: `${baseUrl}/attempted-upsell`,
    filter: where("labels", "array-contains", "Upsell attempted"),
  },
  {
    icon: BadgeCheck,
    label: "Calls Where Upselling Was Successful",
    href: `${baseUrl}/successful-upsell`,
    filter: where("labels", "array-contains", "Upsell successful"),
  },
];

const BreadCrumb = ({
  paramPath,
}: {
  paramPath: { icon: any; label: string };
}) => {
  return (
    <div className="flex items-center font-medium gap-2 lg:text-[20px] text-[#15192C] text-sm">
      <Link href="/calls" className="flex items-center gap-1 text-gray-500">
        Calls
      </Link>
      <ChevronRight />
      <div className="flex items-center gap-1">
        <paramPath.icon />
        <span>{paramPath.label}</span>
      </div>
    </div>
  );
};

export default function Timeline() {
  const params = useSearchParams();
  const [calls, setCalls] = useState<DocumentData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const currentPage = parseInt(params.get("page") || "1");
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);
  const [locationsIds, setLocationsIds] = useState<string[]>([]);
  const [locationsMap, setLocationsMap] = useState<{ [key: string]: any }>({});
  const pathName = usePathname();
  const [isRefetching, setIsRefetching] = useState(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const unsubscribeTotalCountRef = useRef<(() => void) | null>(null);
  const currentPageFirstDocRef = useRef<DocumentData | null>(null);

  const { location, fromDate, toDate, type } = useCallsFilterStore();
  const { userDetails } = useAuth();

  const groupedCalls = calls.reduce((acc, call) => {
    const callDate = new Date(call.call_date).toISOString().split("T")[0];
    if (!acc[callDate]) {
      acc[callDate] = [];
    }
    acc[callDate].push(call);
    return acc;
  }, {});

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsRef = collection(
        db,
        process.env.NEXT_PUBLIC_LOCATIONS_COLLECTION_NAME || ""
      );
      const locationsSnapshot = await getDocs(locationsRef);
      const allLocations = locationsSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const permittedLocations = allLocations.filter((loc) => {
        return hasAccessToLocation(
          userDetails?.access_control_list || [],
          loc.access_control_list || []
        );
      });

      const locationsList = permittedLocations.map((loc) => loc.display_name);
      const locationsIdsList = permittedLocations.map((loc) => loc.id);
      const locationsMapObj = permittedLocations.reduce((acc, loc) => {
        acc[loc.id] = loc.display_name;
        return acc;
      }, {} as { [key: string]: string });

      setLocations(locationsList.sort());
      setLocationsIds(locationsIdsList.sort());
      setLocationsMap(locationsMapObj);
    };

    if (userDetails) {
      fetchLocations();
    }
  }, [userDetails]);

  useEffect(() => {
    const fetchData = async () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (unsubscribeTotalCountRef.current) {
        unsubscribeTotalCountRef.current();
      }

      if (!fromDate || !toDate) {
        setCalls([]);
        setTotalItems(0);
        setIsLoading(false);
        setIsRefetching(false);
        return;
      }

      setIsRefetching(true);
      const collectionRef = collection(
        db,
        process.env.NEXT_PUBLIC_CALLS_COLLECTION_NAME || ""
      );

      const filters = [];

      if (fromDate && toDate) {
        filters.push(where("call_date", ">=", fromDate));
        filters.push(where("call_date", "<=", toDate));
      }

      const locationFilter =
        location && location !== "All" && locationsIds.includes(location)
          ? where("location_id", "==", location)
          : where("location_id", "in", locationsIds);

      filters.push(locationFilter);

      if (locationsIds.length === 0) {
        setCalls([]);
        setTotalItems(0);
        setIsLoading(false);
        setIsRefetching(false);
        return;
      }

      const currentPath = paramPaths.find((path) =>
        pathName.includes(path.href)
      );
      if (currentPath && currentPath.filter) {
        filters.push(currentPath.filter);
      }

      const baseQuery = query(

        collectionRef,
        orderBy("call_start_time_utc", "desc"),
        ...filters
      );

      const totalCountQuery = query(baseQuery);
      const unsubscribeTotalCount = onSnapshot(totalCountQuery, (snapshot) => {
        setTotalItems(snapshot.size);
      });
      unsubscribeTotalCountRef.current = unsubscribeTotalCount;

      let paginatedQuery: Query;

      if (currentPage > 1) {
        const previousPagesQuery = query(
          baseQuery,
          limit((currentPage - 1) * itemsPerPage)
        );
        const previousDocs = await getDocs(previousPagesQuery);

        if (previousDocs.empty) {
          setCalls([]);
          setIsLoading(false);
          setIsRefetching(false);
          return;
        }

        const lastDoc = previousDocs.docs[previousDocs.docs.length - 1];
        currentPageFirstDocRef.current = lastDoc;

        paginatedQuery = query(
          baseQuery,
          startAfter(lastDoc),
          limit(itemsPerPage)
        );
      } else {
        paginatedQuery = query(baseQuery, limit(itemsPerPage));
        currentPageFirstDocRef.current = null;
      }

      const unsubscribe = onSnapshot(paginatedQuery, async (snapshot) => {
        if (currentPage === 1) {
          const updatedCalls: DocumentData[] = [];
          snapshot.forEach((doc) => {
            updatedCalls.push({ id: doc.id, ...doc.data() });
          });
          setCalls(updatedCalls);
        } else {
          if (currentPageFirstDocRef.current) {
            const currentPageQuery = query(
              baseQuery,
              startAfter(currentPageFirstDocRef.current),
              limit(itemsPerPage)
            );
            const currentPageSnapshot = await getDocs(currentPageQuery);

            const updatedCalls: DocumentData[] = [];
            currentPageSnapshot.forEach((doc) => {
              updatedCalls.push({ id: doc.id, ...doc.data() });
            });
            setCalls(updatedCalls);
          }
        }
      });

      unsubscribeRef.current = unsubscribe;

      setIsLoading(false);
      setIsRefetching(false);
    };

    fetchData();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (unsubscribeTotalCountRef.current) {
        unsubscribeTotalCountRef.current();
      }
      currentPageFirstDocRef.current = null;
    };
  }, [location, fromDate, toDate, type, currentPage, pathName, locationsIds]);

  if (!userDetails) {
    return <LoaderCircle className="h-12 w-12 animate-spin" />;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <DateLocationPicker
        initialDate={new Date(fromDate)}
        finalDate={new Date(toDate)}
        locations={locations}
        locationsIds={locationsIds}
      />

      <div className="flex flex-wrap gap-4 w-full justify-start mt-8">
        {paramPaths.find((paramPath) => pathName.includes(paramPath.href)) && (
          <BreadCrumb
            paramPath={
              paramPaths.find((paramPath) => pathName.includes(paramPath.href))!
            }
          />
        )}
      </div>

      {isLoading || isRefetching ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoaderCircle className="h-12 w-12 animate-spin" />
        </div>
      ) : (
        <Fragment>
          {Object.keys(groupedCalls).length === 0 ? (
            <div className="text-center mt-8 text-lg">
              <p>No calls to show 😔</p>
            </div>
          ) : (
            <Fragment>
              <PaginationComponent
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />

              <div className="flex flex-col gap-4 w-full my-8">
                {Object.keys(groupedCalls).map((date, index) => (
                  <CallsCard date={date} key={index}>
                    {groupedCalls[date].map(
                      (call: { id: Key | null | undefined }, index: any) => (
                        <CallCard
                          locationsMap={locationsMap}
                          key={call.id}
                          call={call}
                        />
                      )
                    )}
                  </CallsCard>
                ))}
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
}
