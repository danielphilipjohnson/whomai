"use client";

import { useWindowStore } from "@/store/useWindowStore";
import { TerminalIcon } from '../dock-bar/TerminalIcon';
import { LogIcon } from '../dock-bar/LogIcon';
import { KernelIcon } from '../dock-bar/KernelIcon';

const Footer = () => {
  const { windows, toggleWindow } = useWindowStore();

  return (
    <div className="h-16 md:h-32 bg-black/70 backdrop-blur-md border-t border-cyan-400 flex justify-center items-center z-10">
      <div className="flex py-2 px-5">
        <TerminalIcon 
          showTerminal={windows.terminal.visible} 
          toggleTerminal={() => toggleWindow("terminal")} 
        />
        <LogIcon 
          showLogs={windows.logs.visible} 
          toggleLogs={() => toggleWindow("logs")} 
        />
        <KernelIcon 
          showKernel={windows.kernel.visible} 
          toggleKernel={() => toggleWindow("kernel")} 
        />
      </div>
    </div>
  );
};

export default Footer; 