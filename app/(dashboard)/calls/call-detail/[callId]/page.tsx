import { WithPermissions } from "@/components/with-permissions";
import { LoaderCircle } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "FAB CALLS | Timeline",
    description: "This is just a demo of the timeline page",
};

interface PageProps {
    params: {
        callId: string;
    };
}

export default function TimelinePage({ params }: PageProps) {
    const { callId } = params;
    return (
        <WithPermissions requiredPermission="calls_tab_enabled">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-screen">
                        <LoaderCircle size={48} />
                    </div>
                }
            >
                <p>hello</p>
                <p>Call id: {callId}</p>
            </Suspense>
        </WithPermissions>
    );
}
