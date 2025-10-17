"use client";

import React, { useMemo } from "react";
import { Activity, Eye, PauseCircle, XCircle } from "lucide-react";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";
import { useWindowStore, WindowType, WindowState } from "@/store/useWindowStore";
import { useAppRegistry } from "@/hooks/useAppRegistry";

const windowToAppId: Partial<Record<WindowType, string>> = {
  terminal: "terminal",
  logs: "logs",
  kernel: "kernel",
  fileExplorer: "explorer",
  notes: "notes",
  music: "music",
  jsonViewer: "jsonViewer",
  vault: "vault",
  mira: "mira",
  monitor: "monitor",
};

const fallbackNames: Partial<Record<WindowType, string>> = {
  systemAlert: "System Alert",
  music: "Music Player",
  jsonViewer: "Data Inspector",
  fileExplorer: "File Explorer",
};

const statusLabel = (window: WindowState) => {
  if (!window.visible) return "Closed";
  if (window.minimized) return "Sleeping";
  if (window.maximized) return "Maximized";
  return "Active";
};

const SystemMonitor: React.FC = () => {
  const metrics = useSystemMetrics(2500);
  const { getApp } = useAppRegistry();
  const windows = useWindowStore((state) => state.windows);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const bringToFront = useWindowStore((state) => state.bringToFront);
  const toggleWindow = useWindowStore((state) => state.toggleWindow);

  const allWindows = useMemo(() => Object.values(windows) as WindowState[], [windows]);

  const visibleWindows = useMemo(
    () => allWindows.filter((entry) => entry.visible),
    [allWindows]
  );

  const activeWindows = useMemo(
    () => visibleWindows.filter((entry) => !entry.minimized),
    [visibleWindows]
  );

  const sleepingWindows = useMemo(
    () => visibleWindows.filter((entry) => entry.minimized),
    [visibleWindows]
  );

  const resolveName = (windowId: WindowType) => {
    const appId = windowToAppId[windowId];
    if (appId) {
      return getApp(appId)?.name ?? fallbackNames[windowId] ?? appId;
    }
    return fallbackNames[windowId] ?? windowId;
  };

  const renderWindowCard = (entry: WindowState) => {
    const name = resolveName(entry.id);
    const status = statusLabel(entry);
    const isSleeping = entry.minimized;

    return (
      <div
        key={entry.id}
        className="flex items-center justify-between rounded-md border border-cyan-800/50 bg-black/30 px-3 py-3 text-[11px] text-cyan-200"
      >
        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold text-neon-blue">{name}</div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cyan-500/70">
            <span className="flex items-center gap-1">
              {isSleeping ? <PauseCircle className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {status}
            </span>
            <span>Z-Index {entry.zIndex}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded border border-cyan-700/50 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-cyan-200 transition hover:border-neon-blue hover:text-neon-blue"
            onClick={() => (isSleeping ? toggleWindow(entry.id) : bringToFront(entry.id))}
          >
            {isSleeping ? "Wake" : "Focus"}
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded border border-rose-500/40 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-rose-300 transition hover:border-rose-500 hover:text-rose-200"
            onClick={() => closeWindow(entry.id)}
          >
            <XCircle className="h-3 w-3" /> Force Quit
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-br from-[#050214] via-[#07061d] to-[#02000c] font-mono text-cyan-200">
      <header className="border-b border-cyan-900/50 px-5 py-4">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-neon-purple">
          <Activity className="h-4 w-4" /> Process grid
        </div>
        <h1 className="mt-2 text-lg font-semibold text-neon-blue">System Monitor</h1>
        <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-cyan-500/70">
          Live insight into active windows and resource consumption.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-neon-purple/40 bg-black/40 p-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-cyan-400/80">
              <span>CPU Load</span>
              <span>{metrics.cpuLoad.toFixed(0)}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#0a0820]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-green"
                style={{ width: `${metrics.cpuLoad}%` }}
              />
            </div>
          </div>
          <div className="rounded border border-neon-blue/40 bg-black/40 p-3">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-cyan-400/80">
              <span>Memory</span>
              <span>
                {metrics.memoryUsedMB} / {metrics.memoryTotalMB} MB
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#0a0820]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple"
                style={{ width: `${metrics.memoryUsagePct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 space-y-6 overflow-y-auto px-5 py-5">
        <section>
          <h2 className="text-xs uppercase tracking-[0.35em] text-cyan-500/80">Active Windows</h2>
          <div className="mt-3 flex flex-col gap-3">
            {activeWindows.length ? activeWindows.map(renderWindowCard) : (
              <div className="rounded border border-cyan-800/40 bg-black/30 px-3 py-4 text-center text-[11px] text-cyan-500/70">
                No active windows detected.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.35em] text-cyan-500/80">Sleeping / Minimized</h2>
          <div className="mt-3 flex flex-col gap-3">
            {sleepingWindows.length ? sleepingWindows.map(renderWindowCard) : (
              <div className="rounded border border-cyan-800/40 bg-black/30 px-3 py-4 text-center text-[11px] text-cyan-500/70">
                No minimized windows.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SystemMonitor;
