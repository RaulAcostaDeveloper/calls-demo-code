import Calls from "@/components/calls";
import { WithPermissions } from "@/components/with-permissions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAB CALLS | Calls",
  description: "This is just a demo of the calls page",
};

export default function CallsPage() {
  return (
    <WithPermissions requiredPermission="calls_tab_enabled">
      <Calls />
    </WithPermissions>
  );
}
