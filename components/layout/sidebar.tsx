"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebaseClient";
import { useAuth } from "@/providers/auth-provider";
import { useFilterStore } from "@/stores/filter-store";
import { getPaths } from "@/constants/path";
import { useCallsFilterStore } from "@/stores/calls-filter-store";
import { removeUserToken } from "@/app/(auth)/sign-in/page";

type SidebarProps = {
  setOpen?: (open: boolean) => void;
};

export default function Sidebar() {
  const pathName = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const router = useRouter();
  const { userDetails, user } = useAuth();
  const { location, month } = useFilterStore();
  const { fromDate, toDate, type } = useCallsFilterStore();

  async function handleLogout() {
    removeUserToken();
    await signOut(getAuth(app));
    await fetch("/api/logout");
    router.push("/sign-in");
  }

  const paths = getPaths(location, month, fromDate, toDate, type);

  const filteredPaths = paths.filter((path: { name: string }) => {
    if (!userDetails) return false;
    if (path.name === "outgoing-stats")
      return userDetails.outgoing_stats_tab_enabled;
    if (path.name === "incoming-stats")
      return userDetails.incoming_stats_tab_enabled;
    if (path.name === "calls") return userDetails.calls_tab_enabled;
    return false;
  });

  const renderNavLinks = ({ setOpen }: SidebarProps) =>
    filteredPaths.map(
      ({
        name,
        label,
        icon: Icon,
        href,
      }: {
        name: string;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        href: string;
      }) => (
        <button
          className="w-full"
          key={name}
          onClick={() => setOpen && setOpen(false)}
        >
          <Link
            href={href}
            className={cn(
              "flex items-center justify-start text-start gap-2 rounded-lg bg-gray-100 p-4 duration-200 ease-in-out group",
              {
                "bg-black text-white hover:bg-black":
                  pathName === href.split("?")[0] || pathName.includes(name),
              }
            )}
          >
            <Icon className="h-4 w-4 group-hover:translate-x-1 transition duration-200 ease-in-out" />
            <span className="group-hover:translate-x-1 transition duration-200 ease-in-out">
              {label}
            </span>
          </Link>
        </button>
      )
    );

  const LogoutPopover = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="rounded-full" variant="outline" size="icon">
          <User className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="ml-4 w-52">
        <div className="flex flex-col space-y-4">
          <p className="text-sm font-semibold">{user?.email}</p>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      {/* Mobile view */}
      <header className="flex items-center justify-between p-4 bg-secondary lg:hidden">
        <div className="flex items-center gap-1.5">
          <Image width={50} height={50} src={"/fablogo.png"} alt="Fab Logo" />
          <span className="font-extrabold text-xl">FAB CALLS</span>
        </div>
        <Sheet
          onOpenChange={(isOpen) => setIsSheetOpen(isOpen)}
          open={isSheetOpen}
        >
          <div className="flex items-center gap-4">
            <LogoutPopover />
            <SheetTrigger asChild>
              <Button
                onClick={() => setIsSheetOpen((prev) => !prev)}
                variant="ghost"
                size="icon"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="my-6">
              <SheetTitle>
                <div className="flex items-center gap-1.5">
                  <Image
                    width={50}
                    height={50}
                    src={"/fablogo.png"}
                    alt="Fab Logo"
                  />
                  <span className="font-extrabold text-xl">FAB CALLS</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col h-full space-y-4">
              {renderNavLinks({
                setOpen: setIsSheetOpen,
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop view */}
      <aside className="hidden lg:flex flex-col w-60 h-screen bg-secondary fixed top-0 left-0">
        <div className="flex items-center gap-1.5 p-4 mt-6">
          <Image width={50} height={50} src={"/fablogo.png"} alt="Fab Logo" />
          <span className="font-extrabold text-xl">FAB CALLS</span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          {renderNavLinks(pathName === "/" ? { setOpen: setIsSheetOpen } : {})}
        </nav>
        <div className="p-4">
          <LogoutPopover />
        </div>
      </aside>
    </>
  );
}
