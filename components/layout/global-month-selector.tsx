// components/global-month-selector.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { addMonths, subMonths, format, startOfMonth, addDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/stores/filter-store";

type GlobalMonthSelectorProps = {
  locations: string[];
  locationsIds: string[];
};

export default function GlobalMonthSelector({
  locations,
  locationsIds,
}: GlobalMonthSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { location, month, setLocation, setMonth } = useFilterStore();

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date(month));

  useEffect(() => {
    setSelectedMonth(new Date(month));
  }, [month]);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    updateURL(value, month);
  };

  const handlePeriodChange = (direction: "left" | "right") => {
    const newMonth =
      direction === "left"
        ? startOfMonth(subMonths(selectedMonth, 0))
        : startOfMonth(addMonths(selectedMonth, 2));
    const formattedMonth = format(newMonth, "yyyy-MM");
    setMonth(formattedMonth);
    setSelectedMonth(newMonth);
    updateURL(location, formattedMonth);
  };

  const handleCurrentMonth = () => {
    const currentMonth = startOfMonth(new Date());
    const formattedMonth = format(currentMonth, "yyyy-MM");
    setMonth(formattedMonth);
    setSelectedMonth(currentMonth);
    updateURL(location, formattedMonth);
  };

  const updateURL = (loc: string, mon: string) => {
    const params = new URLSearchParams();
    if (loc !== "All") params.set("location", loc);
    params.set("month", mon);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full py-5 px-8 rounded-md bg-secondary flex-col flex items-center md:flex-row md:justify-between max-md:justify-center max-md:items-start gap-4">
      <Select onValueChange={handleLocationChange} value={location}>
        <div className="flex flex-col items-start">
          <Label
            className="flex items-center text-gray-700 mb-2"
            htmlFor="location"
          >
            Location
          </Label>
          <SelectTrigger className="w-[204px] bg-transparent border border-gray-300 rounded-md shadow-sm flex items-center justify-between p-2">
            <SelectValue
              placeholder="Select Location"
              className="text-gray-600"
            />
          </SelectTrigger>
        </div>

        <SelectContent>
          {locations.length > 1 && (
            <SelectItem className="text-start" value="All">
              All
            </SelectItem>
          )}
          {locations &&
            locationsIds &&
            locations.map((location, index) => (
              <SelectItem key={locationsIds[index]} value={locationsIds[index]}>
                {location}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <p className="flex justify-center items-center gap-2">
        <Calendar className="h-4 w-4 inline-block" />
        {format(addDays(selectedMonth, 1), "MMMM yyyy")}
      </p>

      <div className="flex flex-col items-start">
        <Label
          className="flex items-center text-gray-700 mb-2 max-md:mt-4"
          htmlFor="date-picker"
        >
          Date Range
        </Label>
        <div className="w-full flex max-md:flex-col justify-center max-md:justify-start max-md:items-start items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className={cn(
                "bg-transparent border border-gray-300 hover:bg-gray-300"
              )}
              onClick={handleCurrentMonth}
            >
              Current
            </Button>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                className="hover:bg-gray-200"
                onClick={() => handlePeriodChange("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-gray-200"
                onClick={() => handlePeriodChange("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Select value="Month" onValueChange={() => {}}>
            <SelectTrigger className="w-[204px] bg-transparent border border-gray-300 rounded-md shadow-sm flex items-center justify-between p-2">
              <SelectValue className="text-gray-600" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
