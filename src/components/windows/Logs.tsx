import { Rnd } from 'react-rnd';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { WindowState } from '@/types/window';

interface LogsProps {
	windowState: WindowState;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
	onBringToFront: () => void;
}

interface LogsHeaderProps {
	onMinimize: () => void;
	onMaximize: () => void;
	onClose: () => void;
}

const LogsHeader = ({ onMinimize, onMaximize, onClose }: LogsHeaderProps) => (
	<div className="h-8 bg-[#101020] flex items-center justify-between px-3 border-b border-green-500">
		<div className="text-green-400 font-mono text-sm tracking-wide">
			Logs :: Event Feed
		</div>
		<div className="flex gap-2">
			<div 
				className="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer hover:bg-yellow-300 transition-colors"
				onClick={onMinimize}
				aria-label="Minimize logs"
			/>
			<div 
				className="w-3 h-3 rounded-full bg-green-400 cursor-pointer hover:bg-green-300 transition-colors"
				onClick={onMaximize}
				aria-label="Maximize logs"
			/>
			<div 
				className="w-3 h-3 rounded-full bg-pink-500 cursor-pointer hover:bg-pink-400 transition-colors" 
				onClick={onClose}
				aria-label="Close logs"
			/>
		</div>
	</div>
);

const LogsContent = () => {
	const logEntries = [
		"[07:23:44] [SYS] Kernel wake event received",
		"[07:23:48] [AUTH] guest accessed /datavault",
		"[07:24:01] [NET] Link to GitHub resolved",
		"[07:25:15] [MOD] Component 'whoami' initialized",
		"[07:26:04] [UI] Dock interaction detected",
	];

	return (
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
	);
};

interface LogsWindowProps {
	onMinimize: () => void;
	onMaximize: () => void;
	onClose: () => void;
}

const LogsWindow = ({ onMinimize, onMaximize, onClose }: LogsWindowProps) => (
	<div className="bg-[#0c0c1a] border-2 border-green-400 shadow-[0_0_20px_rgba(0,255,128,0.3)] flex flex-col relative h-full"
		style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
	>
		<LogsHeader onMinimize={onMinimize} onMaximize={onMaximize} onClose={onClose} />
		<LogsContent />
	</div>
);

const Logs = ({ 
	windowState,
	onClose, 
	onMinimize, 
	onMaximize,
	onBringToFront 
}: LogsProps) => {
	const dimensions = useWindowDimensions();

	if (!windowState.visible || windowState.minimized) {
		return null;
	}

	if (windowState.maximized) {
		return (
			<div
				style={{ zIndex: windowState.zIndex }}
				className="absolute w-full h-full top-0 left-0"
				onMouseDown={onBringToFront}
			>
				<LogsWindow onMinimize={onMinimize} onMaximize={onMaximize} onClose={onClose} />
			</div>
		);
	}

	return (
		<Rnd
			default={dimensions}
			minWidth={Math.min(window.innerWidth - 32, 300)}
			minHeight={Math.min(window.innerHeight - 32, 200)}
			bounds="parent"
			onDragStart={onBringToFront}
			style={{ zIndex: windowState.zIndex }}
			className="absolute"
			disableDragging={window.innerWidth < 768}
		>
			<div onMouseDown={onBringToFront} className="w-full h-full">
				<LogsWindow onMinimize={onMinimize} onMaximize={onMaximize} onClose={onClose} />
			</div>
		</Rnd>
	);
};

export default Logs;
