import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: true, // Default to collapsed
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
    }),
    {
      name: "sidebar-state", // unique name for localStorage
    }
  )
);
