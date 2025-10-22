'use client';

import { useEffect, useState } from 'react';

type SystemMetrics = {
  cpuLoad: number;
  memoryUsedMB: number;
  memoryTotalMB: number;
  memoryUsagePct: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const readMemorySnapshot = () => {
  if (typeof window === 'undefined') {
    return { usedMB: 0, totalMB: 0 };
  }

  const performanceAny = window.performance as Performance & {
    memory?: { usedJSHeapSize: number; totalJSHeapSize: number };
  };
  const navigatorAny = navigator as Navigator & { deviceMemory?: number };

  if (performanceAny?.memory) {
    const { usedJSHeapSize, totalJSHeapSize } = performanceAny.memory;
    const usedMB = Math.round(usedJSHeapSize / (1024 * 1024));
    const totalMB = Math.max(Math.round(totalJSHeapSize / (1024 * 1024)), usedMB || 0);
    return { usedMB, totalMB };
  }

  const deviceMemoryGB = navigatorAny?.deviceMemory;
  const totalMB = deviceMemoryGB ? Math.round(deviceMemoryGB * 1024) : 4096;
  const baseline = totalMB * 0.45;
  const jitter = (Math.random() - 0.5) * (totalMB * 0.1);
  const usedMB = clamp(
    Math.round(baseline + jitter),
    Math.round(totalMB * 0.2),
    Math.round(totalMB * 0.85)
  );
  return { usedMB, totalMB };
};

const sampleMetrics = (previous?: SystemMetrics): SystemMetrics => {
  const { usedMB, totalMB } = readMemorySnapshot();
  const memoryUsagePct = totalMB > 0 ? clamp((usedMB / totalMB) * 100, 0, 100) : 0;
  const prevCpu = previous?.cpuLoad ?? 38 + Math.random() * 12;
  const cpuDelta = (Math.random() - 0.5) * 12;
  const cpuLoad = clamp(prevCpu + cpuDelta, 5, 97);

  return {
    cpuLoad,
    memoryUsedMB: usedMB,
    memoryTotalMB: totalMB,
    memoryUsagePct,
  };
};

export const useSystemMetrics = (refreshMs: number = 3000) => {
  const [metrics, setMetrics] = useState<SystemMetrics>(() => sampleMetrics());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      setMetrics((prev) => sampleMetrics(prev));
    };

    update();
    const handle = window.setInterval(update, refreshMs);
    return () => window.clearInterval(handle);
  }, [refreshMs]);

  return metrics;
};

export type { SystemMetrics };
