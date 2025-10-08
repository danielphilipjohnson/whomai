"use client";
import Logs from './windows/Logs';
import Kernel from './windows/Kernel';
import FileExplorer from './windows/FileExplorer';
import Folder from './Folder';
import { useWindowStore } from '@/store/useWindowStore';
import TerminalWindow from './windows/TerminalWindow';
import { StartMenu } from './StartMenu';
import { useShortcut } from "@/hooks/useShortcut";

const CyberpunkDesktop = () => {
	const { windows, openWindow, closeWindow, bringToFront, minimizeWindow, maximizeWindow, toggleStartMenu } = useWindowStore();
	const kernelState = useWindowStore((state) => state.windows.kernel);

	useShortcut(' ', true, toggleStartMenu);

	return (
		<>
			<StartMenu />
			<Folder onOpen={() => openWindow("fileExplorer")} />

			<div className="flex-1 relative">
				<FileExplorer
					windowState={windows.fileExplorer}
					onClose={() => closeWindow("fileExplorer")}
					onMinimize={() => minimizeWindow("fileExplorer")}
					onMaximize={() => maximizeWindow("fileExplorer")}
					onBringToFront={() => bringToFront("fileExplorer")}
				/>
	
				<TerminalWindow
					windowState={windows.terminal}
					onClose={() => closeWindow("terminal")}
					onMinimize={() => minimizeWindow("terminal")}
					onMaximize={() => maximizeWindow("terminal")}
					onBringToFront={() => bringToFront("terminal")}
				/>
			
				<Logs
					windowState={windows.logs}
					onClose={() => closeWindow("logs")}
					onMinimize={() => minimizeWindow("logs")}
					onMaximize={() => maximizeWindow("logs")}
					onBringToFront={() => bringToFront("logs")}
				/>
	
				{kernelState.visible && (
					<Kernel
						windowState={windows.kernel}
						onClose={() => closeWindow("kernel")}
						onMinimize={() => minimizeWindow("kernel")}
						onMaximize={() => maximizeWindow("kernel")}
						onBringToFront={() => bringToFront("kernel")}
					/>
				)}
			</div>
		</>
	);
};

export default CyberpunkDesktop;