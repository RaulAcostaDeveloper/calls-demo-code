"use client";

import { statsProps } from "@/constants/stats";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  DocumentData,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { Skeleton } from "../ui/skeleton";
import StatCard from "./stat-card";
import { hasAccessToLocation, useAuth } from "@/providers/auth-provider";
import { useFilterStore } from "@/stores/filter-store";
import GlobalMonthSelector from "../layout/global-month-selector";

type Stat = {
  label: string;
  total: number;
  tooltip: string;
};

export default function Dashboard() {
  const [locations, setLocations] = useState<string[]>([]);
  const [locationsIds, setLocationsIds] = useState<string[]>([]);
  const [statsLostCustomers, setStatsLostCustomers] = useState<DocumentData[]>(
    []
  );
  const [statsReferrals, setStatsReferrals] = useState<DocumentData[]>([]);
  const [statsReviews, setStatsReviews] = useState<DocumentData[]>([]);
  const [noData, setNoData] = useState(false);
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
        return;
      }

      const collectionRef = collection(
        db,
        process.env.NEXT_PUBLIC_STATS_COLLECTION_NAME || ""
      );

      const filters = [where("location_id", "in", locationsIds)];

      if (location !== "All") {
        filters.push(where("location_id", "==", location));
      }

      if (month) {
        filters.push(where("month", "==", month));
      }

      const q = query(collectionRef, ...filters);

      onSnapshot(q, (snapshot) => {
        const lostCustomers: DocumentData[] = [];
        const referrals: DocumentData[] = [];
        const reviews: DocumentData[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.stats_lost_customers) {
            lostCustomers.push(data.stats_lost_customers);
          }
          if (data.stats_referrals) {
            referrals.push(data.stats_referrals);
          }
          if (data.stats_reviews) {
            reviews.push(data.stats_reviews);
          }
        });

        const lostCustomersStats = lostCustomers.reduce((acc, customer) => {
          Object.keys(customer).forEach((key) => {
            if (!acc[key]) {
              acc[key] = 0;
            }
            acc[key] += customer[key];
          });
          return acc;
        }, {});

        setStatsLostCustomers(lostCustomersStats as any);

        const referralsStats = referrals.reduce((acc, referral) => {
          Object.keys(referral).forEach((key) => {
            if (!acc[key]) {
              acc[key] = 0;
            }
            acc[key] += referral[key];
          });
          return acc;
        }, {});

        setStatsReferrals(referralsStats as any);

        const reviewsStats = reviews.reduce((acc, review) => {
          Object.keys(review).forEach((key) => {
            if (!acc[key]) {
              acc[key] = 0;
            }
            acc[key] += review[key];
          });
          return acc;
        }, {});

        setStatsReviews(reviewsStats as any);
      });
    };

    fetchStats();
  }, [location, month, locationsIds]);

  const customersLabelMapping: { [key: string]: string } = {
    "Number of calls made by our agents": "Calls Made By Our Agents",
    "Number of customers who responded to the agent's call":
      "Customers Who Responded To The Agent's Call",
    "Number of customers who made an appointment after our agent's call":
      "Customers Who Made An Appointment After Our Agent's Call",
    "Total revenue in dollars from these appointments":
      "Revenue Generated From New Appointments",
  };

  const statsLostCustomersArray = Object.keys(statsLostCustomers).map(
    (key: string) => {
      return {
        label:
          customersLabelMapping[key] || key.replace("Number of", "").trim(),
        total: statsLostCustomers[key as keyof typeof statsLostCustomers],
        tooltip: key,
      };
    }
  );

  const customerLabelOrder = [
    "Calls Made By Our Agents",
    "Customers Who Responded To The Agent's Call",
    "Customers Who Made An Appointment After Our Agent's Call",
    "Revenue Generated From New Appointments",
  ];

  statsLostCustomersArray.sort((a, b) => {
    const indexA = customerLabelOrder.indexOf(a.label);
    const indexB = customerLabelOrder.indexOf(b.label);

    // If label is not found in labelOrder, push it to the end by returning a large index
    return (
      (indexA === -1 ? customerLabelOrder.length : indexA) -
      (indexB === -1 ? customerLabelOrder.length : indexB)
    );
  });

  const referralLabelMapping: { [key: string]: string } = {
    "Number of calls made by our agents": "Calls Made By Our Agents",
    "Number of customers who responded to the agent's call":
      "Customers Who Responded To The Agent's Call",
    "Number of customers who offered to refer new customers":
      "Customers Who Offered To Provide Referrals",
    "Number of referred customers who materialized during this month":
      "Previously Referred Customers Who Materialized During This Month",
    "Number of referred customers expected to materialize from the calls made during this month":
      "Referred Customers Expected To Materialize From The Calls Made During This Month",
    "Total revenue in dollars from the referred customers who materialized during this month":
      "Revenue Generated From Referred Customers Who Materialized During This Month",
    "Total revenue in dollars expected to materialize from the calls made during this month":
      "Revenue Expected From The Calls Made During This Month",
  };

  const statsReferralsArray = Object.keys(statsReferrals).map((key: string) => {
    return {
      label: referralLabelMapping[key] || key.replace("Number of", "").trim(),
      total: statsReferrals[key as keyof typeof statsReferrals],
      tooltip: key,
    };
  });

  const referralLabelOrder = [
    "Calls Made By Our Agents",
    "Customers Who Responded To The Agent's Call",
    "Customers Who Offered To Provide Referrals",
    "Previously Referred Customers Who Materialized During This Month",
    "Referred Customers Expected To Materialize From The Calls Made During This Month",
    "Revenue Generated From Referred Customers Who Materialized During This Month",
    "Revenue Expected From The Calls Made During This Month",
  ];

  statsReferralsArray.sort((a, b) => {
    const indexA = referralLabelOrder.indexOf(a.label);
    const indexB = referralLabelOrder.indexOf(b.label);

    // If label is not found in labelOrder, push it to the end by returning a large index
    return (
      (indexA === -1 ? referralLabelOrder.length : indexA) -
      (indexB === -1 ? referralLabelOrder.length : indexB)
    );
  });

  const reviewsLabelMapping: { [key: string]: string } = {
    "Number of calls made by our agents": "Calls Made By Our Agents",
    "Number of customers who responded to the agent's call":
      "Customers Who Responded To The Agent's Call",
    "Number of customers who agreed to leave a review":
      "Customers Who Agreed To Leave A Review",
    "Number of reviews materialized during this month":
      "Reviews Materialized During This Month",
  };

  const statsReviewsArray = Object.keys(statsReviews).map((key: string) => {
    return {
      label: reviewsLabelMapping[key] || key.replace("Number of", "").trim(),
      total: statsReviews[key as keyof typeof statsReviews],
      tooltip: key,
    };
  });

  const reviewsLabelOrder = [
    "Calls Made By Our Agents",
    "Customers Who Responded To The Agent's Call",
    "Customers Who Agreed To Leave A Review",
    "Reviews Materialized During This Month",
  ];

  statsReviewsArray.sort((a, b) => {
    const indexA = reviewsLabelOrder.indexOf(a.label);
    const indexB = reviewsLabelOrder.indexOf(b.label);

    // If label is not found in labelOrder, push it to the end by returning a large index
    return (
      (indexA === -1 ? reviewsLabelOrder.length : indexA) -
      (indexB === -1 ? reviewsLabelOrder.length : indexB)
    );
  });

  useEffect(() => {
    setIsLoading(false);
    if (
      !statsLostCustomersArray.length &&
      !statsReferralsArray.length &&
      !statsReviewsArray.length
    ) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  }, [statsLostCustomersArray, statsReferralsArray, statsReviewsArray]);

  return (
    <div>
      <GlobalMonthSelector locations={locations} locationsIds={locationsIds} />
      <h1 className="my-4 text-[26px] font-semibold">Outgoing Stats</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {statsProps.map((stat) => (
            <Fragment key={stat.title}>
              {stat.title === "Lost Customers" ? (
                <Skeleton className="h-[570px]" />
              ) : stat.title === "Referrals" ? (
                <Skeleton className="h-[900px]" />
              ) : (
                <Skeleton className="h-[550px]" />
              )}
            </Fragment>
          ))}
        </div>
      ) : noData ? (
        <div className="flex items-center justify-center h-[20vh]">
          <p className="text-2xl font-medium">No stats to show 😔</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 animate-fade-in">
          {statsProps.map((stat) => (
            <div className="flex flex-col gap-5" key={stat.title}>
              <StatCard
                key={stat.title}
                {...stat}
                stats={
                  stat.title === "Lost Customers"
                    ? (statsLostCustomersArray as Stat[])
                    : stat.title === "Referrals"
                    ? (statsReferralsArray as Stat[])
                    : stat.title === "Reviews"
                    ? (statsReviewsArray as Stat[])
                    : []
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
