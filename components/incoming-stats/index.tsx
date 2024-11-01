"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { Card, CardContent } from "@/components/ui/card";
import {
  BadgeCheck,
  BadgeDollarSign,
  BookUp2,
  Link,
  Loader2Icon,
  LucideIcon,
  MapPin,
  MapPinned,
  PhoneIncoming,
  PhoneMissed,
  Star,
  Voicemail,
} from "lucide-react";
import { AgentIcon } from "@/constants/icons";
import { hasAccessToLocation, useAuth } from "@/providers/auth-provider";
import { useFilterStore } from "@/stores/filter-store";
import GlobalMonthSelector from "../layout/global-month-selector";
interface Stats {
  totalIncomingCalls?: number;
  callsAnsweredByAgent?: number;
  callsAnsweredAtLocation?: number;
  callsReachedVoicemail?: number;
  callsForBooking?: number;
  callsForHoursLocation?: number;
  callsWithComplaints?: number;
  callsForManagerReview?: number;
  upsellAttempts?: number;
  upsellSuccesses?: number;
  upsellAmount?: number;
}

interface StatCardProps {
  icon: LucideIcon | React.FC;
  value: number | string;
  label: string;
}

const StatCard = ({ icon: Icon, value, label }: StatCardProps) => (
  <Card className="shadow-sm">
    <CardContent className="p-6 flex items-center space-x-4">
      <div className="bg-gray-100 p-3 rounded-lg">
        {label === "Calls Answered By The Agent" ? (
          <Icon
            width={32}
            height={32}
            className="w-96 h-96 stroke-black text-black"
          />
        ) : (
          <Icon className="w-8 h-8 stroke-black text-black" />
        )}
      </div>
      <div>
        <div className="text-2xl text-[#15192C] font-semibold">{value}</div>
        <div className="text-base text-[#15192C]">{label}</div>
      </div>
    </CardContent>
  </Card>
);

export default function IncomingStats() {
  const [stats, setStats] = useState<Stats>({});
  const [locations, setLocations] = useState<string[]>([]);
  const [locationsIds, setLocationsIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { location, month } = useFilterStore();

  const { userDetails } = useAuth();

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

      setLocations(locationsList);
      setLocationsIds(locationsIdsList);
    };

    fetchLocations();
  }, [userDetails]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!locationsIds || locationsIds.length === 0) {
        console.log("No permitted locations available");
        setStats({});
        return;
      }

      setIsLoading(true);
      const collectionRef = collection(
        db,
        process.env.NEXT_PUBLIC_CALLS_COLLECTION_NAME || ""
      );

      let baseQuery = query(
        collectionRef,
        where("location_id", "in", locationsIds)
      );

      if (location !== "All") {
        baseQuery = query(baseQuery, where("location_id", "==", location));
      }
      if (month) {
        const startDate = `${month}-01`;
        const endDate = `${month}-31`;
        baseQuery = query(
          baseQuery,
          where("call_date", ">=", startDate),
          where("call_date", "<=", endDate)
        );
      }

      const fetchCount = async (q: any) => {
        const snapshot = await getDocs(q);
        return snapshot.size;
      };

      try {
        const newStats: Stats = {
          totalIncomingCalls: await fetchCount(baseQuery),
          callsAnsweredByAgent: await fetchCount(
            query(baseQuery, where("icon_type", "==", "agent"))
          ),
          callsAnsweredAtLocation: await fetchCount(
            query(baseQuery, where("icon_type", "==", "business"))
          ),
          callsReachedVoicemail: await fetchCount(
            query(baseQuery, where("icon_type", "==", "voicemail"))
          ),
          callsForBooking: await fetchCount(
            query(
              baseQuery,
              where("labels", "array-contains", "Text for appointment link")
            )
          ),
          callsForHoursLocation: await fetchCount(
            query(
              baseQuery,
              where("labels", "array-contains", "Hours and location")
            )
          ),
          callsWithComplaints: await fetchCount(
            query(baseQuery, where("labels", "array-contains", "Complaint"))
          ),
          callsForManagerReview: await fetchCount(
            query(
              baseQuery,
              where("labels", "array-contains", "Marked for review")
            )
          ),
          upsellAttempts: await fetchCount(
            query(
              baseQuery,
              where("labels", "array-contains", "Upsell attempted")
            )
          ),
          upsellSuccesses: await fetchCount(
            query(
              baseQuery,
              where("labels", "array-contains", "Upsell successful")
            )
          ),
        };

        const upsellSuccessfulQuery = query(
          baseQuery,
          where("labels", "array-contains", "Upsell successful")
        );
        const upsellSnapshot = await getDocs(upsellSuccessfulQuery);
        const upsellTotal = upsellSnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().upsell_in_dollars || 0),
          0
        );
        newStats.upsellAmount = upsellTotal;

        setStats(newStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (month && locationsIds && locationsIds.length > 0) {
      fetchStats();
    }
  }, [location, month, locationsIds]);

  const statCategories = [
    {
      title: "Incoming Calls",
      stats: [
        {
          icon: PhoneIncoming,
          value: stats.totalIncomingCalls || 0,
          label: "Total Incoming Calls",
        },
      ],
    },
    {
      title: "Calls With Guest Interaction",
      stats: [
        {
          icon: AgentIcon,
          value: stats.callsAnsweredByAgent || 0,
          label: "Calls Answered By The Agent",
        },
        {
          icon: MapPin,
          value: stats.callsAnsweredAtLocation || 0,
          label: "Calls Answered At The Location",
        },
        {
          icon: Voicemail,
          value: stats.callsReachedVoicemail || 0,
          label: "Calls That Reached Voicemail",
        },
      ],
    },
    {
      title: "Calls For Information",
      stats: [
        {
          icon: Link,
          value: stats.callsForBooking || 0,
          label: "Calls For Online Booking Link",
        },
        {
          icon: MapPinned,
          value: stats.callsForHoursLocation || 0,
          label: "Calls For Hours And Location Info",
        },
      ],
    },
    {
      title: "Highlighted Calls",
      stats: [
        {
          icon: PhoneMissed,
          value: stats.callsWithComplaints || 0,
          label: "Calls With Potential Complaints",
        },
        {
          icon: Star,
          value: stats.callsForManagerReview || 0,
          label: "Calls Marked For Manager Review",
        },
      ],
    },
    {
      title: "Upsells",
      stats: [
        {
          icon: BookUp2,
          value: stats.upsellAttempts || 0,
          label: "Calls Where Upselling Was Attempted",
        },
        {
          icon: BadgeCheck,
          value: stats.upsellSuccesses || 0,
          label: "Calls Where Upselling Was Successful",
        },
        {
          icon: BadgeDollarSign,
          value: `$${stats.upsellAmount || 0}`,
          label: "Total Dollar Amount Of Upsells Achieved",
        },
      ],
    },
  ];

  const hasNoStats = Object.values(stats).every(
    (value) => value === 0 || value === undefined
  );

  return (
    <div className="space-y-8">
      <GlobalMonthSelector locations={locations} locationsIds={locationsIds} />
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2Icon className="h-8 w-8 animate-spin" />
        </div>
      ) : hasNoStats ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-2xl font-medium">No stats to show 😔</p>
        </div>
      ) : (
        statCategories.map((category, index) => (
          <div key={index} className="space-y-4">
            <h2 className="text-2xl font-semibold">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.stats.map((stat, statIndex) => (
                <StatCard key={statIndex} {...stat} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
