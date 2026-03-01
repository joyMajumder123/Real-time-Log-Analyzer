import { create } from "zustand";
import type { FilterOptions } from "@/types";

interface FilterStore {
  filters: Partial<FilterOptions>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  addService: (service: string) => void;
  removeService: (service: string) => void;
  addLevel: (level: FilterOptions["levels"][number]) => void;
  removeLevel: (level: FilterOptions["levels"][number]) => void;
}

const defaultFilters: Partial<FilterOptions> = {
  services: [],
  levels: [],
  statusCodes: [],
  searchQuery: "",
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  addService: (service) =>
    set((state) => ({
      filters: {
        ...state.filters,
        services: [...(state.filters.services || []), service],
      },
    })),
  removeService: (service) =>
    set((state) => ({
      filters: {
        ...state.filters,
        services: (state.filters.services || []).filter((s) => s !== service),
      },
    })),
  addLevel: (level) =>
    set((state) => ({
      filters: {
        ...state.filters,
        levels: [...(state.filters.levels || []), level],
      },
    })),
  removeLevel: (level) =>
    set((state) => ({
      filters: {
        ...state.filters,
        levels: (state.filters.levels || []).filter((l) => l !== level),
      },
    })),
}));

interface UIStore {
  sidebarOpen: boolean;
  themeMode: "dark" | "light";
  toggleSidebar: () => void;
  setThemeMode: (mode: "dark" | "light") => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  themeMode: "dark",
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setThemeMode: (mode) => set({ themeMode: mode }),
}));
