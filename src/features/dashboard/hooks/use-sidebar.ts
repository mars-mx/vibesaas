'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setMobile: (mobile: boolean) => void;
  close: () => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      isMobile: false,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
      setMobile: (mobile) => set({ isMobile: mobile }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({ isOpen: state.isOpen }),
    }
  )
);