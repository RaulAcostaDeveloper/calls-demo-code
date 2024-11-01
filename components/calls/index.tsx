"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BadgeCheck,
  BookUp2,
  Link as LucideLink,
  LucideIcon,
  MapPin,
  MapPinned,
  PhoneIncoming,
  PhoneMissed,
  Star,
  Voicemail,
} from "lucide-react";
import { AgentIcon } from "@/constants/icons";
import Link from "next/link";
import DateLocationPicker from "../timeline/date-location-picker";
import { useCallsFilterStore } from "@/stores/calls-filter-store";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { hasAccessToLocation, useAuth } from "@/providers/auth-provider";

interface StatCardProps {
  icon: LucideIcon | React.FC;
  label: string;
  href?: string;
}

const StatCard = ({ icon: Icon, label, href }: StatCardProps) => (
  <Link href={href || ""}>
    <Card className="shadow-sm hover:shadow-lg transition duration-300 ease-in-out">
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
          <p>Hello</p>
          <div className="text-base text-[#15192C]">{label}</div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const baseUrl = "/calls";

export default function Calls() {
  const { location, fromDate, toDate, type } = useCallsFilterStore();
  const [locations, setLocations] = useState<string[]>([]);
  const [locationsIds, setLocationsIds] = useState<string[]>([]);
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

      setLocations(locationsList.sort());
      setLocationsIds(locationsIdsList.sort());
    };

    if (userDetails) {
      fetchLocations();
    }
  }, [userDetails]);

  const baseDate = `?type=${type}&fromDate=${fromDate}&toDate=${toDate}`;

  const callCategories = [
    {
      title: "Incoming Calls",
      stats: [
        {
          icon: PhoneIncoming,
          label: "All incoming calls",
          href: `${baseUrl}/incoming${baseDate}`,
        },
      ],
    },
    {
      title: "Calls With Guest Interaction",
      stats: [
        {
          icon: AgentIcon,
          label: "Calls Answered By The Agent",
          href: `${baseUrl}/agent${baseDate}`,
        },
        {
          icon: MapPin,
          label: "Calls Answered At The Location",
          href: `${baseUrl}/location${baseDate}`,
        },
        {
          icon: Voicemail,
          label: "Calls That Reached Voicemail",
          href: `${baseUrl}/voicemail${baseDate}`,
        },
      ],
    },
    {
      title: "Calls For Information",
      stats: [
        {
          icon: LucideLink,
          label: "Calls For Online Booking Link",
          href: `${baseUrl}/online-booking${baseDate}`,
        },
        {
          icon: MapPinned,
          label: "Calls For Hours And Location Info",
          href: `${baseUrl}/hours-location${baseDate}`,
        },
      ],
    },
    {
      title: "Highlighted Calls",
      stats: [
        {
          icon: PhoneMissed,
          label: "Calls With Potential Complaints",
          href: `${baseUrl}/complaints${baseDate}`,
        },
        {
          icon: Star,
          label: "Calls Marked For Manager Review",
          href: `${baseUrl}/manager-review${baseDate}`,
        },
      ],
    },
    {
      title: "Upsells",
      stats: [
        {
          icon: BookUp2,
          label: "Calls Where Upselling Was Attempted",
          href: `${baseUrl}/attempted-upsell${baseDate}`,
        },
        {
          icon: BadgeCheck,
          label: "Calls Where Upselling Was Successful",
          href: `${baseUrl}/successful-upsell${baseDate}`,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 mb-4 mt-0">
      <DateLocationPicker
        initialDate={new Date(fromDate)}
        finalDate={new Date(toDate)}
        locations={locations}
        locationsIds={locationsIds}
      />
      {callCategories.map((category, index) => (
        <div key={index} className="space-y-4">
          <h2 className="text-[26px] font-semibold">{category.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.stats.map((stat, statIndex) => (
              <StatCard key={statIndex} {...stat} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
