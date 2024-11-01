"use client";

import * as React from "react";
import { addDays, format, parse, startOfWeek, endOfWeek } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  initialDateRange?: {
    from: string;
    to: string;
  };
  onDateChange?: (range: { from: string; to: string }) => void;
}

export function DatePickerWithRange({
  className,
  initialDateRange,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialDateRange
      ? {
          from: parse(initialDateRange.from, "yyyy-MM-dd", new Date()),
          to: parse(initialDateRange.to, "yyyy-MM-dd", new Date()),
        }
      : undefined
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onDateChange && newDate?.from && newDate?.to) {
      onDateChange({
        from: format(newDate.from, "yyyy-MM-dd"),
        to: format(newDate.to, "yyyy-MM-dd"),
      });
    }
  };

  const handleClear = () => {
    const today = new Date();
    const newDate = { from: today, to: today };
    setDate(newDate);
    if (onDateChange) {
      onDateChange({
        from: format(today, "yyyy-MM-dd"),
        to: format(today, "yyyy-MM-dd"),
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex justify-between p-2">
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
