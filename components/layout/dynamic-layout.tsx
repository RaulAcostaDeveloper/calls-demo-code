// components/layout/dynamic-layout.tsx
"use client";

import Sidebar from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { LoaderIcon } from "lucide-react";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

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
      <div>
        <Sidebar />
      </div>
      <section className={cn("flex-1 my-10 mx-5 lg:my-5 lg:ml-64")}>
        {children}
      </section>
    </section>
  );
}
