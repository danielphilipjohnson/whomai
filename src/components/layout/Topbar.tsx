'use client'

import { useClock } from "@/hooks/useClock";
import { format } from "date-fns";

export const Topbar = ()=>{
	const currentTime = useClock();

	const timeString = format(currentTime, 'HH:mm');
	const dateString = format(currentTime, 'EEE, MMM d');
	return(
		<div className="h-12 md:h-8 bg-black/80 backdrop-blur-md flex justify-between items-center px-4 text-xs border-b border-cyan-400 font-mono text-cyan-300 tracking-wide shadow-[0_0_6px_#00fff7] z-20">

			<div className="flex items-center md:space-x-3">
				<span className="text-green-400 opacity-60">[VOID-OS v2.0.77]</span>
				<span className="text-pink-400 animate-pulse">:: ACTIVE</span>
			</div>

			<div className="hidden md:flex gap-6 items-center text-cyan-200">
				<div className="flex items-center gap-1 border-l border-cyan-500 pl-2">
					<svg className="w-3.5 h-3.5 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
					</svg>
					<span>100%</span>
				</div>

				<div className="hidden md:flex items-center gap-1 border-l border-cyan-500 pl-2">
					<svg className="w-3.5 h-3.5 text-cyan-400 animate-flicker" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
					<span>100%</span>
				</div>

				<div className="flex items-center gap-1 border-l border-cyan-500 pl-2">
					<svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
					</svg>
					<span className="text-green-300">Connected</span>
				</div>
			</div>

			<div className="text-cyan-400 text-right border-l border-cyan-500 pl-3">
				{timeString} <span className="hidden md:inline">• {dateString}</span>
			</div>
		</div>

	)
}