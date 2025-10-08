"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAppRegistry } from "@/hooks/useAppRegistry";
import { useWindowStore } from "@/store/useWindowStore";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { StartMenuAppTile } from "./StartMenuAppTile";
import { usePinnedAppsStore } from "@/store/usePinnedAppsStore";
import { useRecentAppsStore } from "@/store/useRecentAppsStore";

export function StartMenu() {
  const { startMenuOpen, toggleStartMenu } = useWindowStore();
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
    <Dialog open={startMenuOpen} onOpenChange={toggleStartMenu}>
      <DialogContent onKeyDown={handleKeyDown}>
        <DialogTitle className="sr-only">Start Menu</DialogTitle>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
          <input
            type="text"
            placeholder="Search apps..."
            className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="mt-4">
            <h2 className="text-gray-400 text-sm">Pinned</h2>
            <motion.div layout className="grid grid-cols-4 gap-4 mt-2">
              {pinnedAppsList.map((app) => (
                <StartMenuAppTile
                  key={app.id}
                  app={app}
                  onClick={launchApp}
                />
              ))}
            </motion.div>
          </div>
          <div className="mt-4">
            <h2 className="text-gray-400 text-sm">Recent</h2>
            <motion.div layout className="grid grid-cols-4 gap-4 mt-2">
              {recentAppsList.map((app) => (
                <StartMenuAppTile
                  key={app.id}
                  app={app}
                  onClick={launchApp}
                />
              ))}
            </motion.div>
          </div>
          <div className="mt-4">
            <h2 className="text-gray-400 text-sm">All Apps</h2>
            <motion.div layout className="grid grid-cols-4 gap-4 mt-2">
              {apps.map(({ item: app }) => (
                <StartMenuAppTile
                  key={app.id}
                  app={app}
                  onClick={launchApp}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
