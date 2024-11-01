import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

interface WithPermissionsProps {
  children: ReactNode;
  requiredPermission:
    | "outgoing_stats_tab_enabled"
    | "incoming_stats_tab_enabled"
    | "calls_tab_enabled";
  locationId?: string;
}

const hasAccessToLocation = (
  userACL: string[],
  locationACL: string[]
): boolean => {
  return userACL.some((userItem) => locationACL.includes(userItem));
};

export async function WithPermissions({
  children,
  requiredPermission,
  locationId,
}: WithPermissionsProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!user[requiredPermission]) {
    // Redirect to the first allowed route
    if (user.outgoing_stats_tab_enabled) redirect("/");
    if (user.incoming_stats_tab_enabled) redirect("/incoming-stats");
    if (user.calls_tab_enabled) redirect("/calls");
    redirect("/no-access");
  }

  if (locationId) {
    const locationRef = doc(
      db,
      process.env.NEXT_PUBLIC_LOCATIONS_COLLECTION_NAME || "",
      locationId
    );
    const locationDoc = await getDoc(locationRef);

    if (!locationDoc.exists()) {
      redirect("/no-access");
    }

    const locationData = locationDoc.data();
    const locationACL = locationData?.access_control_list || [];

    const hasAccess = hasAccessToLocation(
      user.access_control_list,
      locationACL
    );

    if (!hasAccess) {
      redirect("/no-access");
    }
  }

  return <div>{children}</div>;
}
