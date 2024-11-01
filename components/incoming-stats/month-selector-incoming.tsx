"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { addMonths, subMonths, format, startOfMonth, addDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type MonthSelectorIncomingProps = {
  locations?: string[];
  locationsIds?: string[];
};

export default function MonthSelectorIncoming({
  locations,
  locationsIds,
}: MonthSelectorIncomingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (!searchParams.get("month")) {
      handleCurrentMonth();
    } else {
      const fromDate = new Date(searchParams.get("month") || "");
      setSelectedMonth(fromDate);
    }
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      if (value === "All") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handlePeriodChange = (direction: "left" | "right") => {
    const newQueryParams = new URLSearchParams(searchParams.toString());
    const monthParam = newQueryParams.get("month");
    let newMonth = monthParam ? new Date(monthParam) : new Date();
    newMonth =
      direction === "left"
        ? startOfMonth(subMonths(newMonth, 0))
        : startOfMonth(addMonths(newMonth, 2));
    newQueryParams.set("month", format(newMonth, "yyyy-MM"));
    setSelectedMonth(newMonth);
    router.push(pathname + "?" + newQueryParams.toString());
  };

  const handleCurrentMonth = () => {
    const newQueryParams = new URLSearchParams(searchParams.toString());
    const month = startOfMonth(new Date());
    newQueryParams.set("month", format(month, "yyyy-MM"));
    setSelectedMonth(month);
    router.push(pathname + "?" + newQueryParams.toString());
  };

  return (
    <div className="w-full py-5 px-8 rounded-md bg-secondary flex-col flex items-center md:flex-row md:justify-between max-md:justify-center max-md:items-start gap-4">
      <Select
        onValueChange={(value) => {
          router.push(pathname + "?" + createQueryString("location", value));
        }}
        defaultValue={searchParams.get("location") || "All"}
      >
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
          <SelectItem className="text-start" value="All">
            All
          </SelectItem>
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
        <div className="w-full flex max-md:flex-col justify-center max-md:justify-start max-md:items-start items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              className={cn(
                "bg-transparent border border-gray-300 hover:bg-gray-300"
              )}
              onClick={handleCurrentMonth}
            >
              Current
            </Button>

            <div className="flex items-center gap-1">
              <Button
                variant={"ghost"}
                className="hover:bg-gray-200"
                onClick={() => handlePeriodChange("left")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={"ghost"}
                className="hover:bg-gray-200"
                onClick={() => handlePeriodChange("right")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
