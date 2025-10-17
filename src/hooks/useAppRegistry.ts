"use client";

import { AppMeta } from "@/lib/appRegistry";
import { NotesAppPayload, useWindowStore } from "@/store/useWindowStore";
import { useRecentAppsStore } from "@/store/useRecentAppsStore";
import Fuse from "fuse.js";
import { useCallback, useState } from "react";
import { TerminalSvg, LogSvg, KernelSvg, FileExplorerSvg, NotesSvg, MusicSvg, DataSvg, LockSvg, MiraSvg } from "@/lib/svgIcons";

const initialApps: AppMeta[] = [
  {
    id: "terminal",
    name: "Terminal",
    description: "A command-line interface for the OS.",
    category: "System",
    keywords: ["cli", "command line", "prompt"],
    icon: TerminalSvg,
  },
  {
    id: "logs",
    name: "Logs",
    description: "View system logs.",
    category: "System",
    keywords: ["logs", "events", "debug"],
    icon: LogSvg,
  },
  {
    id: "kernel",
    name: "Kernel",
    description: "View kernel information.",
    category: "System",
    keywords: ["kernel", "system", "info"],
    icon: KernelSvg,
  },
  {
    id: "notes",
    name: "Notes",
    description: "A simple note-taking app.",
    category: "Productivity",
    keywords: ["text", "editor", "notepad"],
    icon: NotesSvg,
  },
  {
    id: "explorer",
    name: "File Explorer",
    description: "Browse the file system.",
    category: "System",
    keywords: ["files", "finder", "browser"],
    icon: FileExplorerSvg,
  },
  {
    id: "music",
    name: "Music Player",
    description: "Queue neon soundscapes and mp3 files.",
    category: "Media",
    keywords: ["audio", "mp3", "player"],
    icon: MusicSvg,
  },
  {
    id: "jsonViewer",
    name: "Data Inspector",
    description: "Visualise JSON payloads with structure.",
    category: "Utilities",
    keywords: ["json", "data", "inspector"],
    icon: DataSvg,
    beta: true,
  },
  {
    id: "vault",
    name: "Vault",
    description: "Access restricted files.",
    category: "System",
    keywords: ["files", "secrets", "vault"],
    icon: LockSvg,
    hidden: true,
  },
  {
    id: "mira",
    name: "MIRA",
    description: "Connect to the AI companion.",
    category: "System",
    keywords: ["ai", "assistant", "mira"],
    icon: MiraSvg,
    hidden: true,
  },
];

const fuse = new Fuse(initialApps, {
  keys: ["name", "description", "keywords"],
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.4,
});

export const useAppRegistry = () => {
  const [apps] = useState<AppMeta[]>(initialApps);
  const { openWindow, setStartMenuOpen } = useWindowStore();
  const { addRecentApp } = useRecentAppsStore();

  const listApps = useCallback(() => apps, [apps]);

  const getApp = useCallback((id: string) => apps.find((app) => app.id === id), [apps]);

  const searchApps = useCallback((query: string) => {
    if (!query) return apps.map(app => ({ item: app }));
    return fuse.search(query);
  }, [apps]);

  const launchApp = (id: string, payload?: Record<string, unknown>, shouldToggleStartMenu: boolean = true) => {
    const app = getApp(id);
    if (app) {
      // Map app IDs to window types
      const windowTypeMap: Record<string, "logs" | "kernel" | "terminal" | "fileExplorer" | "notes" | "music" | "jsonViewer" | "vault" | "mira"> = {
        terminal: "terminal",
        logs: "logs", 
        kernel: "kernel",
        explorer: "fileExplorer",
        notes: "notes",
        music: "music",
        jsonViewer: "jsonViewer",
        vault: "vault",
        mira: "mira",
      };
      
      const windowType = windowTypeMap[id];
      if (windowType) {
        openWindow(windowType, payload as NotesAppPayload);
        addRecentApp(id);
        if (shouldToggleStartMenu) {
          setStartMenuOpen(false);
        }
      }
    }
  };

  return { listApps, getApp, searchApps, launchApp };
};
