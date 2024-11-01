import {
  format,
  startOfWeek,
  endOfWeek,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CallsFilterState {
  location: string;
  fromDate: string;
  toDate: string;
  type: "Day" | "Week" | "Month" | "Custom";
  setLocation: (location: string) => void;
  setDateRange: (fromDate: string, toDate: string) => void;
  setType: (type: "Day" | "Week" | "Month" | "Custom") => void;
}

const now = new Date();
const defaultDate = setHours(
  setMinutes(setSeconds(setMilliseconds(now, 0), 0), 0),
  0
);
const startOfWeekDate = startOfWeek(defaultDate, { weekStartsOn: 6 });
const endOfWeekDate = endOfWeek(defaultDate, { weekStartsOn: 6 });

export const useCallsFilterStore = create<CallsFilterState>()(
  persist(
    (set) => ({
      location: "All",
      fromDate: format(startOfWeekDate, "yyyy-MM-dd"),
      toDate: format(endOfWeekDate, "yyyy-MM-dd"),
      type: "Week",
      setLocation: (location) => set({ location }),
      setDateRange: (fromDate, toDate) => set({ fromDate, toDate }),
      setType: (type) => set({ type }),
    }),
    {
      name: "calls-filter-storage",
    }
  )
);
