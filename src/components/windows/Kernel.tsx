import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface SystemInfoProps {
  uptime: string;
}

const SystemInfo = ({ uptime }: SystemInfoProps) => (
  <div className="grid gap-4 overflow-scroll md:grid-cols-2 md:overflow-hidden">
    {/* SYSTEM STATUS */}
    <div className="space-y-1 rounded border border-green-400 bg-black/60 p-3">
      <div className="text-lime-400">┌─ SYSTEM STATUS ───────┐</div>
      <div>HOSTNAME&nbsp;&nbsp;&nbsp; cyberos.void.local</div>
      <div>KERNEL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CyberVoid v3.14.77-lts</div>
      <div>
        OS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VOIDUX Core 9.3
        (DarkBuild)
      </div>
      <div>ARCH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; x86_64</div>
      <div>UPTIME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {uptime}</div>
    </div>

    {/* STACK CONFIG */}
    <div className="space-y-1 rounded border border-green-400 bg-black/60 p-3">
      <div className="text-lime-400">┌─ STACK CONFIG ────────┐</div>
      <div>FRONTEND&nbsp;&nbsp;&nbsp; Nuxt 3 / Vue / Tailwind</div>
      <div>BACKEND&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Go / Node / Firebase</div>
      <div>INFRA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Kubernetes / GCP / ELK</div>
      <div>PAYMENT&nbsp;&nbsp;&nbsp;&nbsp; Stripe SDK v11.4</div>
    </div>

    {/* RUNTIME METRICS */}
    <div className="space-y-1 rounded border border-green-400 bg-black/60 p-3 md:col-span-2">
      <div className="text-lime-400">┌─ RUNTIME METRICS ─────┐</div>
      <div>CPU&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 22% @ 3.4GHz</div>
      <div>MEMORY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2.3 GB / 8 GB</div>
      <div>THREADS&nbsp;&nbsp;&nbsp;&nbsp; 86 active</div>
      <div>TEMP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 58°C</div>
    </div>
  </div>
);

const KernelPrompt = () => (
  <div className="animate-blink pt-2 text-pink-400">{'>'} _ SYSTEM NOMINAL</div>
);

const Kernel = () => {
  const [uptime, setUptime] = useState('0 hours, 0 minutes');

  useEffect(() => {
    const start = new Date();
    const timer = setInterval(() => {
      const duration = formatDistanceToNow(start, { addSuffix: false });
      setUptime(duration);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full flex-col rounded-md border-2 border-lime-400 bg-[#0a0a0a] font-mono text-xs text-lime-300 shadow-[0_0_20px_rgba(0,255,128,0.4)]">
      <div className="flex-1 space-y-5 overflow-auto p-5 md:p-2">
        <SystemInfo uptime={uptime} />
        <KernelPrompt />
      </div>
    </div>
  );
};

export default Kernel;
