// stores/filter-store.ts
import { format } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  location: string;
  month: string;
  setLocation: (location: string) => void;
  setMonth: (month: string) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      location: "All",
      month: format(new Date(), "yyyy-MM"),
      setLocation: (location) => set({ location }),
      setMonth: (month) => set({ month }),
    }),
    {
      name: "filter-storage",
    }
  )
);
