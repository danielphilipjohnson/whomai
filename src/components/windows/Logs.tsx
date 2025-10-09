import React from 'react';

const Logs = () => {
	const logEntries = [
		"[07:21:02] [SYS]: Mounting /Documents",
		"[07:21:03] [OK]: File system online",
		"[07:23:44] [SYS] Kernel wake event received",
		"[07:23:48] [AUTH] guest accessed /datavault",
		"[07:24:01] [NET] Link to GitHub resolved",
		"[07:25:15] [MOD] Component 'whoami' initialized",
		"[07:26:04] [UI] Dock interaction detected",
	];

	return (
		<div className="bg-[#0c0c1a] flex flex-col relative h-full"
			style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
		>
			<div className="flex-1 overflow-y-auto p-4 font-mono text-green-300 text-sm relative">
				<div className="absolute inset-0 pointer-events-none z-10 opacity-5"
					style={{
						backgroundImage: "linear-gradient(transparent 50%, rgba(0,255,0,0.1) 50%)",
						backgroundSize: "100% 6px"
					}}
				></div>
				{logEntries.map((log, index) => (
					<div key={index} className="mb-2">{log}</div>
				))}
			</div>
		</div>
	);
};

export default Logs;
