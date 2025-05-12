import { Rnd } from 'react-rnd';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';

type WindowState = {
	id: "logs" | "kernel" | "terminal" | "fileExplorer";
	visible: boolean;
	zIndex: number;
	minimized: boolean;
	maximized: boolean;
};

interface FileExplorerProps {
	windowState: WindowState;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
	onBringToFront: () => void;
}

interface FileExplorerHeaderProps {
	onMinimize: () => void;
	onMaximize: () => void;
	onClose: () => void;
}

const FileExplorerHeader = ({ onMinimize, onMaximize, onClose }: FileExplorerHeaderProps) => (
	<div className="flex justify-between items-center border-b border-blue-400 pb-2">
		<div className="uppercase tracking-widest animate-pulse">[ FILE EXPLORER ]</div>
		<div className="flex gap-2">
			<div 
				className="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer hover:bg-yellow-300 transition-colors"
				onClick={onMinimize}
				aria-label="Minimize file explorer"
			/>
			<div 
				className="w-3 h-3 rounded-full bg-green-400 cursor-pointer hover:bg-green-300 transition-colors"
				onClick={onMaximize}
				aria-label="Maximize file explorer"
			/>
			<div 
				className="w-3 h-3 rounded-full bg-pink-500 cursor-pointer hover:bg-pink-400 transition-colors" 
				onClick={onClose}
				aria-label="Close file explorer"
			/>
		</div>
	</div>
);

interface FileListProps {
	files: Array<{ name: string; action: string }>;
}

const FileList = ({ files }: FileListProps) => (
	<div className="space-y-2 h-[calc(100%-4rem)] overflow-y-auto">
		{files.map((file, index) => (
			<div
				key={index}
				className="flex justify-between border-b border-blue-400 pb-1 hover:text-white"
			>
				<span className="text-blue-300">{file.name}</span>
				<span className="text-blue-500 cursor-pointer">{file.action}</span>
			</div>
		))}
	</div>
);

const FileExplorerFooter = () => (
	<div className="pb-3 text-blue-400 text-xs animate-blink">&gt; /root/datavault/files</div>
);

interface FileExplorerContentProps {
	onMinimize: () => void;
	onMaximize: () => void;
	onClose: () => void;
	files: Array<{ name: string; action: string }>;
}

const FileExplorerContent = ({ onMinimize, onMaximize, onClose, files }: FileExplorerContentProps) => (
	<div className="bg-[#0a0a0f] border-2 border-blue-500 shadow-[0_0_20px_rgba(0,128,255,0.4)] font-mono text-blue-300 text-xs p-5 rounded-md space-y-4 h-full">
		<FileExplorerHeader onMinimize={onMinimize} onMaximize={onMaximize} onClose={onClose} />
		<FileList files={files} />
		<FileExplorerFooter />
	</div>
);

const FileExplorer = ({ 
	windowState,	
	onClose, 
	onMinimize, 
	onMaximize,
	onBringToFront 
}: FileExplorerProps) => {
	const dimensions = useWindowDimensions();
	
	if (!windowState.visible || windowState.minimized) {
		return null;
	}

	const files = [
		{ name: "system.log", action: "[view]" },
		{ name: "report_final_v3.pdf", action: "[download]" },
		{ name: "secret_script.sh", action: "[execute]" },
		{ name: "notes.md", action: "[edit]" },
		{ name: "error_dump.txt", action: "[analyze]" },
	];

	if (windowState.maximized) {
		return (
			<div 
				style={{ zIndex: windowState.zIndex }}
				className="absolute w-full h-full top-0 left-0"
				onMouseDown={onBringToFront}
			>
				<div className="w-full h-full">
					<FileExplorerContent
						onMinimize={onMinimize}
						onMaximize={onMaximize}
						onClose={onClose}
						files={files}
					/>
				</div>
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
		>
			<div onMouseDown={onBringToFront} className="w-full h-full">
				<FileExplorerContent
					onMinimize={onMinimize}
					onMaximize={onMaximize}
					onClose={onClose}
					files={files}
				/>
			</div>
		</Rnd>
	);
};

export default FileExplorer;
