"use client";

import { create } from "zustand";

type BootState = {
  booting: boolean;
  beginBoot: () => void;
  finishBoot: () => void;
};

export const useBootSequence = create<BootState>((set) => ({
  booting: true,
  beginBoot: () => set({ booting: true }),
  finishBoot: () => set({ booting: false }),
}));
