import { cn } from "@/lib/utils";

export const KernelIcon = ({ showKernel, toggleKernel }: { showKernel: boolean, toggleKernel: () => void }) => {
	return (
		<div
			className={cn(
				"w-16 h-12 md:w-28 md:h-28 mx-2.5 rounded-lg bg-black/60 flex justify-center items-center cursor-pointer",
				"transition-all duration-200 border relative",
				showKernel 
					? "border-green-400 shadow-[0_0_15px_rgba(0,255,128,0.5)]" 
					: "border-transparent hover:border-green-400 hover:shadow-[0_0_15px_rgba(0,255,128,0.5)] hover:scale-110"
			)}
			onClick={() => toggleKernel()}
		>
			<svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
				<rect width="64" height="64" rx="8" fill="#0a0a0a" />
				<rect x="16" y="16" width="32" height="32" rx="4" fill="#0f0f0f" stroke="#33FF99" strokeWidth="2" />
				<path d="M24 24h16v16H24V24z" fill="#00FF99" opacity="0.2" />
				<path d="M18 12v4M12 18h4M46 12v4M52 18h-4M46 52v-4M52 46h-4M18 52v-4M12 46h4" stroke="#00FFCC" strokeWidth="2" />
				<path d="M24 32h16M32 24v16" stroke="#33FFCC" strokeWidth="1.5" />
			</svg>

			{showKernel && (
				<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full shadow-[0_0_5px_#00ff80]"></div>
			)}
		</div>
	);
};