import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppId } from '../lib/appRegistry';

interface RecentAppsState {
  recentApps: AppId[];
  addRecentApp: (appId: AppId) => void;
}

export const useRecentAppsStore = create<RecentAppsState>()(
  persist(
    (set) => ({
      recentApps: [],
      addRecentApp: (appId) => {
        set((state) => {
          const newRecentApps = [appId, ...state.recentApps.filter((id) => id !== appId)].slice(
            0,
            5
          );
          return { recentApps: newRecentApps };
        });
      },
    }),
    {
      name: 'webos-recent-apps', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);
