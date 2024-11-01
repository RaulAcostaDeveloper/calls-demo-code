import Dashboard from "@/components/outgoing-stats";
import { WithPermissions } from "@/components/with-permissions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAB CALLS",
  description: "This is just a demo of the dashboard page",
};

export default async function Home() {
  return (
    <WithPermissions requiredPermission="outgoing_stats_tab_enabled">
      <Dashboard />
    </WithPermissions>
  );
}
