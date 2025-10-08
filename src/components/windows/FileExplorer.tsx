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

const FileExplorer = () => {
	const files = [
		{ name: "system.log", action: "[view]" },
		{ name: "report_final_v3.pdf", action: "[download]" },
		{ name: "secret_script.sh", action: "[execute]" },
		{ name: "notes.md", action: "[edit]" },
		{ name: "error_dump.txt", action: "[analyze]" },
	];

	return (
		<div className="bg-[#0a0a0f] font-mono text-blue-300 text-xs p-5 rounded-md space-y-4 h-full">
			<FileList files={files} />
			<FileExplorerFooter />
		</div>
	);
};

export default FileExplorer;