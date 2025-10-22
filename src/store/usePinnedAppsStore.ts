import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppId } from '../lib/appRegistry'; // Assuming AppId is defined here

interface PinnedAppsState {
  pinnedApps: AppId[];
  pinApp: (appId: AppId) => void;
  unpinApp: (appId: AppId) => void;
  reorderPinnedApps: (newOrder: AppId[]) => void;
}

export const usePinnedAppsStore = create<PinnedAppsState>()(
  persist(
    (set, get) => ({
      pinnedApps: [],
      pinApp: (appId) => {
        if (!get().pinnedApps.includes(appId)) {
          set((state) => ({ pinnedApps: [...state.pinnedApps, appId] }));
        }
      },
      unpinApp: (appId) => {
        set((state) => ({ pinnedApps: state.pinnedApps.filter((id) => id !== appId) }));
      },
      reorderPinnedApps: (newOrder) => {
        set({ pinnedApps: newOrder });
      },
    }),
    {
      name: 'webos-pinned-apps', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);
