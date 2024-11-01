import { PhoneCall, PhoneIncoming, PhoneOutgoing } from "lucide-react";

export const getPaths = (
  currentLocation: string,
  month: string,
  fromDate: string,
  toDate: string,
  type: string
) => {
  const statsParams = new URLSearchParams();
  const callsParams = new URLSearchParams();

  // Handle location parameter
  if (currentLocation && currentLocation !== "All") {
    statsParams.set("location", currentLocation);
    callsParams.set("location", currentLocation);
  }

  // Handle month parameter for stats
  if (month) {
    statsParams.set("month", month);
  }

  // Handle date range parameters for calls
  if (fromDate) {
    callsParams.set("fromDate", fromDate);
  }
  if (toDate) {
    callsParams.set("toDate", toDate);
  }

  // Handle type parameter for calls
  if (type) {
    callsParams.set("type", type);
  }

  // Generate query strings
  const statsQueryString = statsParams.toString();
  const callsQueryString = callsParams.toString();

  return [
    {
      name: "outgoing-stats",
      label: "Outgoing Stats",
      icon: PhoneOutgoing,
      href: `/${statsQueryString ? `?${statsQueryString}` : ""}`,
    },
    {
      name: "incoming-stats",
      label: "Incoming Stats",
      icon: PhoneIncoming,
      href: `/incoming-stats${statsQueryString ? `?${statsQueryString}` : ""}`,
    },
    {
      name: "calls",
      label: "Calls",
      href: `/calls${callsQueryString ? `?${callsQueryString}` : ""}`,
      icon: PhoneCall,
    },
  ];
};
