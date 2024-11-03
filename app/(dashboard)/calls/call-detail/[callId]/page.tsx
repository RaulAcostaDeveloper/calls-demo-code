import CallDetailConnector from "@/components/calls/call-detail";
import { WithPermissions } from "@/components/with-permissions";
import { LoaderCircle } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "FAB CALLS | Timeline",
    description: "This is just a demo of the timeline page",
};

export default function TimelinePage() {
    return (
        <WithPermissions requiredPermission="calls_tab_enabled">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-screen">
                        <LoaderCircle size={48} />
                    </div>
                }
            >
                <CallDetailConnector />
            </Suspense>
        </WithPermissions>
    );
}
