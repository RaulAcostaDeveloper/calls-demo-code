import IncomingStats from "@/components/incoming-stats";
import { WithPermissions } from "@/components/with-permissions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAB CALLS | Incoming Stats",
  description: "This is just a demo of the dashboard page",
};

export default function IncomingStatsPage() {
  return (
    <WithPermissions requiredPermission="incoming_stats_tab_enabled">
      <IncomingStats />
    </WithPermissions>
  );
}
