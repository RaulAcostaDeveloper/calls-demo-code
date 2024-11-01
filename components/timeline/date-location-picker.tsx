"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  parse,
  isValid,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePickerWithRange } from "./date-range-picker";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-day-picker";
import { useCallsFilterStore } from "@/stores/calls-filter-store";

type DateLocationPickerProps = {
  initialDate?: Date;
  finalDate?: Date;
  locations?: string[];
  locationsIds?: string[];
} & React.HTMLAttributes<HTMLDivElement>;

export default function DateLocationPicker({
  locations,
  locationsIds,
}: DateLocationPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    location,
    fromDate,
    toDate,
    type,
    setLocation,
    setDateRange,
    setType,
  } = useCallsFilterStore();
  const [selectedPeriod, setSelectedPeriod] = useState(type);

  const isThereAreParams = fromDate && toDate;
  const isCustom = type === "Custom";

  useEffect(() => {
    setSelectedPeriod(type);
  }, [type]);

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

  const updateURLParams = (
    fromDate: string,
    toDate: string,
    newType: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("fromDate", fromDate);
    params.set("toDate", toDate);
    params.set("type", newType);
    router.push(pathname + "?" + params.toString());
  };

  const handlePeriodChange = (type: string, direction: "left" | "right") => {
    let newFromDate = new Date(fromDate);
    let newToDate = new Date(toDate);

    switch (type) {
      case "Day":
        newFromDate =
          direction === "left"
            ? subDays(newFromDate, 0)
            : addDays(newFromDate, 2);
        newToDate = newFromDate;
        break;

      case "Week":
        newFromDate =
          direction === "left"
            ? subWeeks(startOfWeek(newFromDate, { weekStartsOn: 6 }), 0)
            : addWeeks(startOfWeek(newFromDate, { weekStartsOn: 6 }), 2);
        newToDate = endOfWeek(newFromDate, { weekStartsOn: 6 });
        break;

      case "Month":
        newFromDate =
          direction === "left"
            ? startOfMonth(subMonths(newFromDate, 0))
            : startOfMonth(addMonths(newFromDate, 2));
        newToDate = endOfMonth(newFromDate);
        break;

      default:
        break;
    }

    const formattedFromDate = format(newFromDate, "yyyy-MM-dd");
    const formattedToDate = format(newToDate, "yyyy-MM-dd");

    setDateRange(formattedFromDate, formattedToDate);
    setType(type as "Day" | "Week" | "Month" | "Custom");
    updateURLParams(formattedFromDate, formattedToDate, type);
  };

  const handleCurrentDayWeekMonth = () => {
    const now = new Date();
    const defaultDate = setHours(
      setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0),
      0
    );

    let newFromDate = defaultDate;
    let newToDate = defaultDate;

    switch (type) {
      case "Day":
        newFromDate = defaultDate;
        newToDate = defaultDate;
        break;

      case "Week":
        newFromDate = startOfWeek(defaultDate, { weekStartsOn: 6 });
        newToDate = endOfWeek(defaultDate, { weekStartsOn: 6 });
        break;

      case "Month":
        newFromDate = startOfMonth(defaultDate);
        newToDate = endOfMonth(defaultDate);
        break;

      case "Custom":
        newFromDate = startOfWeek(defaultDate, { weekStartsOn: 6 });
        newToDate = endOfWeek(defaultDate, { weekStartsOn: 6 });
        break;

      default:
        break;
    }

    const formattedFromDate = format(newFromDate, "yyyy-MM-dd");
    const formattedToDate = format(newToDate, "yyyy-MM-dd");

    setDateRange(formattedFromDate, formattedToDate);
    updateURLParams(formattedFromDate, formattedToDate, type);
  };

  const handleCurrentDayWeekMonthSelector = (value: string) => {
    const now = new Date();
    const defaultDate = setHours(
      setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0),
      0
    );

    let newFromDate = defaultDate;
    let newToDate = defaultDate;

    switch (value) {
      case "Day":
        newFromDate = defaultDate;
        newToDate = defaultDate;
        break;

      case "Week":
        newFromDate = startOfWeek(defaultDate, { weekStartsOn: 6 });
        newToDate = endOfWeek(defaultDate, { weekStartsOn: 6 });
        break;

      case "Month":
        newFromDate = startOfMonth(defaultDate);
        newToDate = endOfMonth(defaultDate);
        break;

      case "Custom":
        newFromDate = startOfWeek(defaultDate, { weekStartsOn: 6 });
        newToDate = endOfWeek(defaultDate, { weekStartsOn: 6 });
        break;

      default:
        break;
    }

    const formattedFromDate = format(newFromDate, "yyyy-MM-dd");
    const formattedToDate = format(newToDate, "yyyy-MM-dd");

    setDateRange(formattedFromDate, formattedToDate);
    setType(value as "Day" | "Week" | "Month" | "Custom");
    updateURLParams(formattedFromDate, formattedToDate, value);
  };

  const handleCustomDateChange = (range: DateRange | undefined) => {
    if (range && range.from && range.to) {
      const formattedFromDate = format(range.from, "yyyy-MM-dd");
      const formattedToDate = format(range.to, "yyyy-MM-dd");
      setDateRange(formattedFromDate, formattedToDate);
      setType("Custom");
      updateURLParams(formattedFromDate, formattedToDate, "Custom");
    }
  };

  const formatDateRange = (type: string, fromDate: string, toDate: string) => {
    const parsedFromDate = parse(fromDate, "yyyy-MM-dd", new Date());
    const parsedToDate = parse(toDate, "yyyy-MM-dd", new Date());

    if (!isValid(parsedFromDate) || !isValid(parsedToDate)) {
      return "Invalid date range";
    }

    switch (type) {
      case "Day":
        return format(parsedFromDate, "MMMM d, yyyy");
      case "Week":
        return `${format(parsedFromDate, "MMM d")} - ${format(
          parsedToDate,
          "MMM d, yyyy"
        )}`;
      case "Month":
        return format(parsedFromDate, "MMMM yyyy");
      case "Custom":
        return `${format(parsedFromDate, "MMM d, yyyy")} - ${format(
          parsedToDate,
          "MMM d, yyyy"
        )}`;
      default:
        return "Invalid date range type";
    }
  };

  return (
    <div className="w-full py-5 px-8 rounded-md bg-secondary flex-col flex md:flex-row md:justify-between max-md:justify-center max-md:items-start gap-4">
      <Select
        onValueChange={(value) => {
          setLocation(value);
          router.push(pathname + "?" + createQueryString("location", value));
        }}
        value={location}
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
          {(locations?.length ?? 0) > 1 && (
            <SelectItem className="text-start" value="All">
              All
            </SelectItem>
          )}
          {locations &&
            locations.map((location, index) => (
              <SelectItem key={index} value={(locationsIds ?? [])[index]}>
                {location}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {isThereAreParams && (
        <p className="mt-4 flex justify-center items-center gap-2">
          <Calendar className="h-4 w-4 inline-block" />
          {formatDateRange(type, fromDate, toDate)}
        </p>
      )}

      <div className="flex flex-col items-start ">
        <Label
          className="flex items-center text-gray-700 mb-2 max-md:mt-4"
          htmlFor="date-picker"
        >
          Date Range
        </Label>
        <div className="w-full flex max-md:flex-col justify-center max-md:justify-start max-md:items-start items-center gap-4">
          <div className="flex items-center gap-2 ">
            {type === "Custom" ? (
              <DatePickerWithRange
                initialDateRange={{
                  from: fromDate,
                  to: toDate,
                }}
                onDateChange={({ from, to }) => {
                  handleCustomDateChange({
                    from: new Date(from),
                    to: new Date(to),
                  });
                }}
              />
            ) : (
              <Button
                variant={"outline"}
                className={cn(
                  "bg-transparent border border-gray-300 hover:bg-gray-300"
                )}
                onClick={handleCurrentDayWeekMonth}
              >
                Current
              </Button>
            )}
            {type !== "Custom" && (
              <div className="flex items-center gap-1">
                <Button
                  variant={"ghost"}
                  className="hover:bg-gray-200"
                  onClick={() => handlePeriodChange(type, "left")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={"ghost"}
                  className="hover:bg-gray-200"
                  onClick={() => handlePeriodChange(type, "right")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Select
            onValueChange={(value) => {
              handleCurrentDayWeekMonthSelector(value);
            }}
            value={type}
          >
            <SelectTrigger className="w-[204px] bg-transparent border border-gray-300 rounded-md shadow-sm flex items-center justify-between p-2">
              <SelectValue
                placeholder="Select Date Range"
                className="text-gray-600"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Day">Day</SelectItem>
              <SelectItem value="Week">Week</SelectItem>
              <SelectItem value="Month">Month</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
