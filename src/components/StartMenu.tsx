"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAppRegistry } from "@/hooks/useAppRegistry";
import { useWindowStore } from "@/store/useWindowStore";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { StartMenuAppTile } from "./StartMenuAppTile";
import { usePinnedAppsStore } from "@/store/usePinnedAppsStore";
import { useRecentAppsStore } from "@/store/useRecentAppsStore";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function StartMenu() {
  const { startMenuOpen, setStartMenuOpen } = useWindowStore();
  const { searchApps, launchApp, getApp } = useAppRegistry();
  const { pinnedApps } = usePinnedAppsStore();
  const { recentApps } = useRecentAppsStore();
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const appRefs = useRef<(HTMLDivElement | null)[]>([]);

  const apps = searchApps(search);
  const pinnedAppsList = pinnedApps.map(id => getApp(id)).filter((app): app is NonNullable<typeof app> => app !== undefined);
  const recentAppsList = recentApps.map(id => getApp(id)).filter((app): app is NonNullable<typeof app> => app !== undefined);

  const allApps = [...pinnedAppsList, ...recentAppsList, ...apps.map(({ item }) => item)];

  useEffect(() => {
    if (startMenuOpen) {
      appRefs.current[focusedIndex]?.focus();
    }
  }, [startMenuOpen, focusedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prev) => (prev + 1) % allApps.length);
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prev) => (prev - 1 + allApps.length) % allApps.length);
    } else if (e.key === "Enter") {
      const app = allApps[focusedIndex];
      if (app) {
        launchApp(app.id);
      }
    }
  };

  return (
    <Dialog open={startMenuOpen} onOpenChange={setStartMenuOpen}>
      <DialogContent
        onKeyDown={handleKeyDown}
        className="w-[min(92vw,700px)] max-h-[85vh] overflow-y-auto border border-cyan-500/40 bg-black/90 p-4 sm:p-6"
      >
        <DialogTitle className="sr-only">Start Menu</DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Search apps..."
            className="w-full rounded-lg border border-cyan-500/30 bg-[#0b0a16] p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400">Pinned</h2>
            <motion.div layout className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {pinnedAppsList.map((app) => (
                <StartMenuAppTile
                  key={app.id}
                  app={app}
                  onClick={launchApp}
                />
              ))}
            </motion.div>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400">Recent</h2>
            <motion.div layout className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {recentAppsList.map((app) => (
                <StartMenuAppTile
                  key={app.id}
                  app={app}
                  onClick={launchApp}
                />
              ))}
            </motion.div>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-gray-400">All Apps</h2>
            <motion.div layout className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {apps.map(({ item: app }) => (
                <StartMenuAppTile
                  key={app.id}
                  app={app}
                  onClick={launchApp}
                />
              ))}
            </motion.div>
          </div>
          <ThemeSwitcher />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
