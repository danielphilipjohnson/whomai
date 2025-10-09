import { useTerminal } from "@/hooks/UseTerminal";
import { useTerminalBehavior } from "@/hooks/useTerminalBehavior";
import { useFileSystemStore } from "@/store/useFileSystemStore";
import { useRef } from "react";

export const WhoAmI = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const terminalContentRef = useRef<HTMLDivElement>(null);
	const {
		command,
		setCommand,
		history,
		whoamiData,
		handleCommand
	} = useTerminal();
	const currentPath = useFileSystemStore((state) => state.currentPath);
	const promptPath = currentPath === '/' ? '~' : currentPath;
	
	useTerminalBehavior(true, inputRef, terminalContentRef); // Always show terminal when rendered inside WindowFrame

	return (
		<div
			className="bg-[#0d0221] font-mono text-cyan-400 h-full overflow-hidden flex flex-col relative"
			style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)" }}
		>
			{/* Terminal Content */}
			<div
				ref={terminalContentRef}
				className="flex-1 pl-4 pt-3 md:p-3 font-mono text-cyan-400 overflow-y-auto relative"
			>
				{/* Scanlines effect */}
				<div
					className="absolute inset-0 pointer-events-none z-10 opacity-10"
					style={{
						backgroundImage: "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%)",
						backgroundSize: "100% 4px"
					}}
				></div>

				{/* Animated scan line */}
				<div
					className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 opacity-20 z-10"
					style={{
						animation: "scanline 5s linear infinite"
					}}
				></div>
				{/* Command history */}
				{history?.map((line: string, index: number) => (
					<div key={`history-${index}`} className="mb-2">
						{line}
					</div>
				))}

				{/* WHOAMI Response Data Display */}
				{whoamiData && (
					<div className="mt-4 pl-3 border-l-2 border-lime-400">
						<div className="text-pink-500 mb-4">
							=== USER IDENTITY SCAN COMPLETE ===
						</div>

						<div className="mb-2 flex">
							<div className="w-40 text-lime-400 mr-4">IP ADDRESS</div>
							<div className="text-white">
								{whoamiData.ipaddress}
							</div>
						</div>

						<div className="mb-2 flex">
							<div className="w-40 text-lime-400 mr-4">OPERATING SYSTEM</div>
							<div className="text-white">
								{whoamiData.os || 'Unknown'}
							</div>
						</div>

						<div className="mb-2 flex">
							<div className="w-40 text-lime-400 mr-4">BROWSER</div>
							<div className="text-white">
								{whoamiData.browser_name || 'Unknown'} {whoamiData.browser_version || ''}
							</div>
						</div>

						<div className="mb-2 flex">
							<div className="w-40 text-lime-400 mr-4">LANGUAGE</div>
							<div className="text-white">
								{whoamiData.parsed_language || 'Unknown'}
							</div>
						</div>

						<div className="mb-2 flex">
							<div className="w-40 text-lime-400 mr-4">USER AGENT</div>
							<div className="text-white text-xs">
								{whoamiData.software || 'Unknown'}
							</div>
						</div>

						<div className="mb-2 flex">
							<div className="w-40 text-lime-400 mr-4">SYSTEM ACCESS</div>
							<div className="text-white">
								Request #{whoamiData.total_requests}
							</div>
						</div>
					</div>
				)}

				{/* Command input field */}
				<form onSubmit={(e) => {
					e.preventDefault();
					handleCommand(command);
				}} className="flex items-center">
					<span className="text-lime-400 mr-1">{`guest@cybercity:${promptPath}$`}</span>
					<input
						ref={inputRef}
						type="text"
						value={command}
						onChange={(e) => setCommand(e.target.value)}
						className="flex-1 bg-transparent border-none outline-none text-white caret-pink-500 max-w-42"
						autoComplete="off"
						spellCheck="false"
						aria-label="Terminal command input"
						placeholder="Enter command..."
					/>
					{!command && (
						<div className="w-2 h-4 bg-pink-500 animate-blink ml-0.5"></div>
					)}
				</form>
			</div>
		</div>
	);
};

export default WhoAmI;
