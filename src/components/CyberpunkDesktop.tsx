"use client";
import Logs from './windows/Logs';
import Kernel from './windows/Kernel';
import FileExplorer from './windows/FileExplorer';
import NotesApp from '@/app/apps/notes/NotesApp';
import Folder from './Folder';
import { useWindowStore } from '@/store/useWindowStore';
import TerminalWindow from './windows/TerminalWindow';
import { StartMenu } from './StartMenu';
import { useShortcut } from "@/hooks/useShortcut";
import { useAppRegistry } from "@/hooks/useAppRegistry";
import WindowFrame from "./windows/WindowFrame";

const CyberpunkDesktop = () => {
	const { windows, openWindow, closeWindow, bringToFront, minimizeWindow, maximizeWindow, toggleStartMenu } = useWindowStore();
	const { getApp } = useAppRegistry();
	const notesAppMeta = getApp("notes");
	const terminalAppMeta = getApp("terminal");
	const logsAppMeta = getApp("logs");
	const kernelAppMeta = getApp("kernel");
	const fileExplorerAppMeta = getApp("explorer");


	const handleNotesChange = () => {
	};

	useShortcut(' ', true, toggleStartMenu);

	return (
		<>
			<StartMenu />
			<Folder onOpen={() => openWindow("fileExplorer")} />

			<div className="flex-1 relative">
				{fileExplorerAppMeta && (
					<WindowFrame
						windowState={windows.fileExplorer}
						onClose={() => closeWindow("fileExplorer")}
						onMinimize={() => minimizeWindow("fileExplorer")}
						onMaximize={() => maximizeWindow("fileExplorer")}
						onBringToFront={() => bringToFront("fileExplorer")}
						title={fileExplorerAppMeta.name}
					>
						<FileExplorer />
					</WindowFrame>
				)}
	
				{terminalAppMeta && (
					<WindowFrame
						windowState={windows.terminal}
						onClose={() => closeWindow("terminal")}
						onMinimize={() => minimizeWindow("terminal")}
						onMaximize={() => maximizeWindow("terminal")}
						onBringToFront={() => bringToFront("terminal")}
						title={terminalAppMeta.name}
					>
						<TerminalWindow />
					</WindowFrame>
				)}
			
				{logsAppMeta && (
					<WindowFrame
						windowState={windows.logs}
						onClose={() => closeWindow("logs")}
						onMinimize={() => minimizeWindow("logs")}
						onMaximize={() => maximizeWindow("logs")}
						onBringToFront={() => bringToFront("logs")}
						title={logsAppMeta.name}
					>
						<Logs />
					</WindowFrame>
				)}
	
				{notesAppMeta && (
					<WindowFrame
						windowState={windows.notes}
						onClose={() => closeWindow("notes")}
						onMinimize={() => minimizeWindow("notes")}
						onMaximize={() => maximizeWindow("notes")}
						onBringToFront={() => bringToFront("notes")}
						title={notesAppMeta.name}
					>
						<NotesApp
							id={windows.notes.payload?.id || notesAppMeta.id}
							title={windows.notes.payload?.title || notesAppMeta.name}
							onNoteChange={handleNotesChange}
						/>
					</WindowFrame>
				)}

				{kernelAppMeta && windows.kernel.visible && (
					<WindowFrame
						windowState={windows.kernel}
						onClose={() => closeWindow("kernel")}
						onMinimize={() => minimizeWindow("kernel")}
						onMaximize={() => maximizeWindow("kernel")}
						onBringToFront={() => bringToFront("kernel")}
						title={kernelAppMeta.name}
					>
						<Kernel />
					</WindowFrame>
				)}
			</div>
		</>
	);
};

export default CyberpunkDesktop;