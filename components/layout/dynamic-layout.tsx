// components/layout/dynamic-layout.tsx
"use client";

import Sidebar from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCallDetailsPage, setIsCallDetailsPage] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (pathName.includes('/calls/call-detail')) {
        setIsCallDetailsPage(true);
      } else {
        setIsCallDetailsPage(false);
      }
    }
  }, [pathName]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon className="animate-spin h-12 w-12" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <main>{children}</main>;
  }

  return (
    <section className="block lg:flex">
      <div className={`${isCallDetailsPage ? 'sidebarDetailsPage' : ''}`}>
        <Sidebar />
      </div>
      <section className={`${cn("flex-1 my-10 mx-5 lg:my-5 lg:ml-64")} ${isCallDetailsPage ? 'callDetailsPageLayout' : ''}`}>
        {children}
      </section>
    </section>
  );
}
