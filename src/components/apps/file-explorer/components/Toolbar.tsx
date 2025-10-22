import { useMemo } from 'react';
import { Plus, FolderPlus, Trash2, PencilLine, RefreshCcw, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import clsx from 'clsx';

interface ToolbarProps {
	currentPath: string;
	onCreateFile: () => void;
	onCreateFolder: () => void;
	onDelete: () => void;
	onRename: () => void;
	onRefresh: () => void;
	onClearSelection: () => void;
	selectionState: {
		hasSelection: boolean;
		isSingleSelection: boolean;
	};
	onRestore?: () => void;
	showRestore?: boolean;
	onSearchSubmit?: () => void;
}

const buttonBase =
	'flex items-center gap-2 rounded-md border border-[#1f1c3b] bg-[#0b0a16]/80 px-3 py-1 text-emerald-200 transition hover:border-emerald-400/60 hover:text-emerald-100 hover:shadow-[0_0_12px_rgba(0,255,200,0.25)] focus:outline-none focus:ring-2 focus:ring-emerald-400/70 disabled:opacity-40 disabled:hover:border-[#1f1c3b] disabled:hover:text-emerald-200 disabled:cursor-not-allowed';

export const Toolbar = ({
	currentPath,
	onCreateFile,
	onCreateFolder,
	onDelete,
	onRename,
	onRefresh,
	onClearSelection,
	selectionState,
	onRestore,
	showRestore,
	onSearchSubmit,
}: ToolbarProps) => {
	const { searchQuery, setSearchQuery, selectedIds } = useFileSystemStore((state) => ({
		searchQuery: state.searchQuery,
		setSearchQuery: state.setSearchQuery,
		selectedIds: state.selectedIds,
	}));

	const selectionLabel = useMemo(() => {
		if (!selectedIds.length) return 'No selection';
		if (selectedIds.length === 1) return '1 item selected';
		return `${selectedIds.length} items selected`;
	}, [selectedIds]);

	return (
		<div className="flex items-center justify-between border-b border-[#15142a] bg-[#080712]/90 px-4 py-2">
			<motion.div
				className="flex items-center gap-3"
				initial={{ opacity: 0, x: -8 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
			>
				<button type="button" className={buttonBase} aria-label="New file" onClick={onCreateFile}>
					<Plus size={14} />
					<span>New File</span>
				</button>
				<button type="button" className={buttonBase} aria-label="New folder" onClick={onCreateFolder}>
					<FolderPlus size={14} />
					<span>New Folder</span>
				</button>
				<button
					type="button"
					className={clsx(buttonBase, 'text-rose-300 hover:text-rose-100 hover:border-rose-500/60 focus:ring-rose-400/70')}
					aria-label="Delete"
					onClick={onDelete}
					disabled={!selectionState.hasSelection}
				>
					<Trash2 size={14} />
					<span>Delete</span>
				</button>
				{showRestore && (
					<button
						type="button"
						onClick={onRestore}
						disabled={!selectionState.hasSelection}
						className={buttonBase}
						aria-label="Restore"
					>
						<RotateCcw size={14} />
						<span>Restore</span>
					</button>
				)}
				<button
					type="button"
					className={buttonBase}
					aria-label="Rename"
					onClick={onRename}
					disabled={!selectionState.isSingleSelection}
				>
					<PencilLine size={14} />
					<span>Rename</span>
				</button>
				<button type="button" className={buttonBase} aria-label="Refresh" onClick={onRefresh}>
					<RefreshCcw size={14} />
				</button>
			</motion.div>

			<motion.div
				className="flex items-center gap-3"
				initial={{ opacity: 0, x: 8 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
			>
				<div className="text-[10px] tracking-wide text-cyan-500/80">
					{currentPath}
				</div>
				<div className="text-[10px] text-slate-400/80">{selectionLabel}</div>
				<button
					type="button"
					onClick={onClearSelection}
					className="text-[10px] text-emerald-300/70 hover:text-emerald-200"
				>
					Clear
				</button>
				<input
					type="search"
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							event.preventDefault();
							onSearchSubmit?.();
						}
					}}
					placeholder="Search"
					className="w-40 rounded-md border border-[#1f1c3b] bg-[#05040a]/70 px-2 py-1 text-[11px] text-cyan-100 placeholder:text-[#3f3e5f] focus:border-emerald-400/70 focus:outline-none focus:ring-1 focus:ring-emerald-400/50"
				/>
			</motion.div>
		</div>
	);
};
