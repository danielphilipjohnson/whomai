import { cn } from "@/lib/utils";

export const LogIcon = ({ showLogs, toggleLogs }: { showLogs: boolean, toggleLogs: () => void }) => {
	return (
		<div
			className={cn(
				"w-12 h-12 md:w-28 md:h-28 mx-2.5 rounded-lg bg-black/60 flex justify-center items-center cursor-pointer transition-all duration-200 border relative",
				showLogs 
					? "border-green-400 shadow-[0_0_15px_rgba(0,255,128,0.5)]" 
					: "border-transparent hover:border-green-400 hover:shadow-[0_0_15px_rgba(0,255,128,0.5)] hover:scale-110"
			)}
			onClick={toggleLogs}
		>
			<svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
				<rect width="64" height="64" rx="8" fill="#0a0a0a" />
				<path d="M16 16h32v4H16v-4zm0 10h24v4H16v-4zm0 10h32v4H16v-4zm0 10h20v4H16v-4z"
					fill="#33FF99" stroke="#33FFCC" strokeWidth="0.5" />
				<rect x="6" y="6" width="52" height="52" rx="6" stroke="#00ffe0" strokeWidth="1.5" />
				<g opacity="0.3">
					<path d="M58 6v52M6 6v52" stroke="#00ffe0" strokeDasharray="2 2" />
				</g>
			</svg>

			{showLogs && (
				<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full shadow-[0_0_5px_#00ff80]"></div>
			)}
		</div>
	);
};