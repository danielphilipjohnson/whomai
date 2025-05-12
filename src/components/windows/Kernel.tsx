import { useEffect, useState } from "react";
import { Rnd } from 'react-rnd';
import { formatDistanceToNow } from 'date-fns';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { WindowState } from '@/types/window';

interface KernelProps {
	windowState: WindowState;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
	onBringToFront: () => void;
}

interface KernelHeaderProps {
	onMinimize: () => void;
	onMaximize: () => void;
	onClose: () => void;
}

const KernelHeader = ({ onMinimize, onMaximize, onClose }: KernelHeaderProps) => (
	<div className="absolute top-0 left-0 w-full flex justify-between items-center pb-2 bg-transparent py-2 px-2">
		<div className="text-lime-300 uppercase tracking-widest animate-pulse">
			[ KERNEL DIAGNOSTIC PANEL ]
		</div>
		<div className="flex gap-2">
			<button 
				type="button"
				className="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer hover:bg-yellow-300 transition-colors"
				onClick={onMinimize}
				aria-label="Minimize kernel"
			/>
			<button 
				type="button"
				className="w-3 h-3 rounded-full bg-green-400 cursor-pointer hover:bg-green-300 transition-colors"
				onClick={onMaximize}
				aria-label="Maximize kernel"
			/>
			<button 
				type="button"
				className="w-3 h-3 rounded-full bg-pink-500 cursor-pointer hover:bg-pink-400 transition-colors" 
				onClick={onClose}
				aria-label="Close kernel"
			/>
		</div>
	</div>
);

interface SystemInfoProps {
	uptime: string;
}

const SystemInfo = ({ uptime }: SystemInfoProps) => (
	<div className="grid md:grid-cols-2 gap-4 overflow-scroll md:overflow-hidden">
		{/* SYSTEM STATUS */}
		<div className="bg-black/60 border border-green-400 rounded p-3 space-y-1">
			<div className="text-lime-400">┌─ SYSTEM STATUS ───────┐</div>
			<div>HOSTNAME&nbsp;&nbsp;&nbsp; cyberos.void.local</div>
			<div>KERNEL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CyberVoid v3.14.77-lts</div>
			<div>OS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; VOIDUX Core 9.3 (DarkBuild)</div>
			<div>ARCH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; x86_64</div>
			<div>UPTIME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {uptime}</div>
		</div>

		{/* STACK CONFIG */}
		<div className="bg-black/60 border border-green-400 rounded p-3 space-y-1">
			<div className="text-lime-400">┌─ STACK CONFIG :: VOID-NET ─┐</div>
			<div>FRONTEND&nbsp;&nbsp;&nbsp; HexUI / NeonJS / Tailwind 5</div>
			<div>BACKEND&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; GhostNode / RustWarp / Firebase Quantum</div>
			<div>INFRA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KubeVoid / Edgeflare / ELK v9</div>
			<div>PAYMENT&nbsp;&nbsp;&nbsp;&nbsp; NanoStripe SDK vX.42</div>
			<div>AUTH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ZeroID Protocol / CipherSig v3</div>
			<div>AI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Oracle Core / LLM-9</div>
		</div>


		{/* RUNTIME METRICS */}
		<div className="md:col-span-2 bg-black/60 border border-green-400 rounded p-3 space-y-1">
			<div className="text-lime-400">┌─ RUNTIME METRICS ─────┐</div>
			<div>CPU&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 22% @ 3.4GHz</div>
			<div>MEMORY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2.3 GB / 8 GB</div>
			<div>THREADS&nbsp;&nbsp;&nbsp;&nbsp; 86 active</div>
			<div>TEMP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 58°C</div>
		</div>
	</div>
);

const KernelPrompt = () => (
	<div className="pt-2 text-pink-400 animate-blink">{'>'} _ SYSTEM NOMINAL</div>
);

interface KernelWindowProps {
	onMinimize: () => void;
	onMaximize: () => void;
	onClose: () => void;
	uptime: string;
}

const KernelWindow = ({ onMinimize, onMaximize, onClose, uptime }: KernelWindowProps) => (
	<div className="bg-[#0a0a0a] border-2 border-lime-400 shadow-[0_0_20px_rgba(0,255,128,0.4)] font-mono text-lime-300 text-xs rounded-md h-full flex flex-col">
		<div className="p-4 border-b border-lime-400">
			<KernelHeader onMinimize={onMinimize} onMaximize={onMaximize} onClose={onClose} />
		</div>

		<div className="flex-1 overflow-auto p-5 md:p-2 space-y-5">
			<SystemInfo uptime={uptime} />
			<KernelPrompt />
		</div>
	</div>
);

const Kernel = ({ 
	windowState,
	onClose,
	onMinimize,
	onMaximize,
	onBringToFront 
}: KernelProps) => {
	const dimensions = useWindowDimensions();
	const [uptime, setUptime] = useState("0 hours, 0 minutes");

	useEffect(() => {
		const start = new Date();
		const timer = setInterval(() => {
			const duration = formatDistanceToNow(start, { addSuffix: false });
			setUptime(duration);
		}, 60000);
		return () => clearInterval(timer);
	}, []);

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
				<KernelWindow 
					onMinimize={onMinimize}
					onMaximize={onMaximize}
					onClose={onClose}
					uptime={uptime}
				/>
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
			style={{ zIndex: windowState.zIndex, touchAction: 'none' }}
			className="absolute"
			disableDragging={window.innerWidth < 768}

		>
			<div onMouseDown={onBringToFront} className="w-full h-full overflow-hidden">
				<KernelWindow 
					onMinimize={onMinimize}
					onMaximize={onMaximize}
					onClose={onClose}
					uptime={uptime}
				/>
			</div>
		</Rnd>
	);
};

export default Kernel;
