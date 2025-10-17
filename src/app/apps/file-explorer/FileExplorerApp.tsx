'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { shallow } from 'zustand/shallow';
import { FileSystemItem } from '@/lib/fileSystemTypes';
import { Toolbar } from './components/Toolbar';
import { BreadcrumbsBar } from './components/BreadcrumbsBar';
import { Sidebar } from './components/Sidebar';
import { MainPanel } from './components/MainPanel';
import { SearchResultsPanel } from './components/SearchResultsPanel';
import PropertiesPanel from './components/PropertiesPanel';
import { notesRepository } from '@/lib/notesRepository';
import { useWindowStore } from '@/store/useWindowStore';

const ensureMarkdownName = (name: string) => {
	const trimmed = name.trim();
	if (!trimmed) return 'untitled.md';
	if (/\.md$/i.test(trimmed)) {
		return trimmed.replace(/\.md$/i, '.md');
	}
	const withoutExt = trimmed.replace(/\.[^./\\]+$/, '');
	const base = withoutExt.trim() || 'untitled';
	return `${base}.md`;
};

const containerVariants = {
	hidden: { opacity: 0, y: 12, scale: 0.98 },
	visible: { opacity: 1, y: 0, scale: 1 },
	exit: { opacity: 0, y: 20, scale: 0.98 },
};

export const FileExplorerApp = () => {
	const {
		initialize,
		items: allItems,
		currentDirectoryId,
		currentPath,
		expandedIds,
		setExpanded,
		setCurrentDirectoryById,
		setSelection,
		selectedIds,
		clearSelection,
		createItemInCurrent,
		deleteItems,
		renameItem,
		moveItem,
		refresh,
		setSearchQuery,
		searchItems,
		readFile,
		restoreItem,
		isInTrash,
	} = useFileSystemStore(
		(state) => ({
			initialize: state.initialize,
			items: state.items,
			currentDirectoryId: state.currentDirectoryId,
			currentPath: state.currentPath,
			expandedIds: state.expandedIds,
			setExpanded: state.setExpanded,
			setCurrentDirectoryById: state.setCurrentDirectoryById,
			setSelection: state.setSelection,
			selectedIds: state.selectedIds,
			clearSelection: state.clearSelection,
			createItemInCurrent: state.createItemInCurrent,
			deleteItems: state.deleteItems,
			renameItem: state.renameItem,
			moveItem: state.moveItem,
			refresh: state.refresh,
			setSearchQuery: state.setSearchQuery,
			searchItems: state.searchItems,
			readFile: state.readFile,
			restoreItem: state.restoreItem,
			isInTrash: state.isInTrash,
		}),
		shallow
	);

	const searchQuery = useFileSystemStore((state) => state.searchQuery);
	const openWindow = useWindowStore((state) => state.openWindow);

	const items = useMemo(() => {
		const currentItems = Object.values(allItems).filter(
			(item) => item.parentId === currentDirectoryId
		);
		return [...currentItems].sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === 'folder' ? -1 : 1;
			}
			return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
		});
	}, [allItems, currentDirectoryId]);

	const breadcrumbs = useMemo(() => {
		const crumbs: FileSystemItem[] = [];
		let cursor: FileSystemItem | undefined = allItems[currentDirectoryId];
		while (cursor) {
			crumbs.unshift(cursor);
			cursor = cursor.parentId ? allItems[cursor.parentId] : undefined;
		}
		return crumbs;
	}, [allItems, currentDirectoryId]);
	const isTrashView = useMemo(() => currentPath.startsWith('/Trash'), [currentPath]);
	const searchResults = useMemo(() => (searchQuery.trim() ? searchItems(searchQuery) : []), [searchItems, searchQuery]);
	const isSearching = searchQuery.trim().length > 0;
	const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
	const [draggingId, setDraggingId] = useState<string | null>(null);
	const [propertiesItem, setPropertiesItem] = useState<FileSystemItem | null>(null);

	useEffect(() => {
		initialize();
	}, [initialize]);

	useEffect(() => {
		if (renameTargetId && !items.some((item) => item.id === renameTargetId)) {
			setRenameTargetId(null);
		}
		if (propertiesItem && !items.some((item) => item.id === propertiesItem.id)) {
			setPropertiesItem(null);
		}
	}, [renameTargetId, propertiesItem, items]);

	const handleFileOpen = useCallback((item: FileSystemItem) => {
		if (item.type !== 'file') return;
		const extension = item.metadata?.extension?.toLowerCase();
		try {
			switch (extension) {
				case 'md': {
					const content = readFile(item.id);
					const noteTitle = item.name.replace(/\.md$/i, '') || item.name;
					const existing = notesRepository.getAllNotes().find((note) => note.title === noteTitle);
					const targetNote = existing ?? notesRepository.createNote(noteTitle);
					notesRepository.updateNote(targetNote.id, content);
					openWindow('notes', { id: targetNote.id, title: targetNote.title });
					break;
				}
				case 'mp3':
				case 'wav': {
					openWindow('music', { fileId: item.id, name: item.name, path: item.path });
					break;
				}
				case 'json': {
					const content = readFile(item.id);
					openWindow('jsonViewer', { fileId: item.id, name: item.name, content, path: item.path });
					break;
				}
				case 'sys': {
					openWindow('systemAlert', {
						title: 'ACCESS RESTRICTED',
						message: `Security kernel blocked ${item.name}. Administrator clearance required.`,
						severity: 'error',
					});
					break;
				}
				default: {
					openWindow('systemAlert', {
						title: 'UNSUPPORTED FILE',
						message: `${item.name} has no associated app yet.`,
						severity: 'warning',
					});
				}
			}
		} catch (error) {
			console.error('Failed to open file', error);
			openWindow('systemAlert', {
				title: 'OPEN FAILED',
				message: `Could not open ${item.name}.`,
				severity: 'error',
			});
		}
	}, [readFile, openWindow]);

	const handleItemOpen = useCallback((item: FileSystemItem) => {
		if (item.type === 'folder') {
			setCurrentDirectoryById(item.id);
		} else {
			handleFileOpen(item);
		}
	}, [setCurrentDirectoryById, handleFileOpen]);

	const handleCreate = useCallback((type: 'file' | 'folder') => {
		try {
			const defaultName = type === 'file' ? ensureMarkdownName('untitled') : 'New Folder';
			const newItem = createItemInCurrent(defaultName, type);
			setSelection([newItem.id], 'single');
			setRenameTargetId(newItem.id);
		} catch (error) {
			console.error('Failed to create item', error);
		}
	}, [createItemInCurrent, setSelection]);

	const hasSelection = selectedIds.length > 0;
	const isSingleSelection = selectedIds.length === 1;

	const handleDelete = useCallback(() => {
		if (!selectedIds.length) return;
		deleteItems(selectedIds, { soft: !isTrashView });
		setRenameTargetId(null);
	}, [deleteItems, selectedIds, isTrashView]);

	const handleRename = useCallback(() => {
		if (!isSingleSelection) return;
		setRenameTargetId(selectedIds[0]);
	}, [isSingleSelection, selectedIds]);

	const handleRenameCommit = useCallback((id: string, nextName: string) => {
		try {
			const target = allItems[id];
			const finalName = target?.type === 'file' ? ensureMarkdownName(nextName) : nextName;
			renameItem(id, finalName);
		} catch (error) {
			console.error('Rename failed', error);
		} finally {
			setRenameTargetId(null);
		}
	}, [allItems, renameItem]);

	const handleMove = useCallback((id: string, destinationId: string) => {
		try {
			moveItem(id, destinationId);
			setRenameTargetId(null);
		} catch (error) {
			console.error('Move failed', error);
		}
	}, [moveItem]);

	const handleRefresh = useCallback(() => {
		refresh();
	}, [refresh]);

	const handleRestore = useCallback(() => {
		if (!isTrashView || !selectedIds.length) return;
		selectedIds.forEach((id) => {
			try {
				restoreItem(id);
			} catch (error) {
				console.error('Restore failed', error);
			}
		});
		clearSelection();
		setPropertiesItem(null);
	}, [isTrashView, selectedIds, restoreItem, clearSelection, setPropertiesItem]);

	const handleDragStart = useCallback((item: FileSystemItem) => {
		setDraggingId(item.id);
	}, []);

	const handleDragEnd = useCallback(() => {
		setDraggingId(null);
	}, []);

	const handleDropOnFolder = useCallback((targetFolderId: string) => {
		if (draggingId && draggingId !== targetFolderId) {
			handleMove(draggingId, targetFolderId);
		}
	}, [draggingId, handleMove]);

	const handleDropOnCurrent = useCallback(() => {
		if (draggingId && currentDirectoryId) {
			handleMove(draggingId, currentDirectoryId);
		}
	}, [draggingId, currentDirectoryId, handleMove]);

	const selectionSummary = useMemo(
		() => ({ hasSelection, isSingleSelection }),
		[hasSelection, isSingleSelection]
	);

	const handleRevealResult = useCallback((item: FileSystemItem) => {
		if (item.type === 'folder') {
			setCurrentDirectoryById(item.id);
		} else if (item.parentId) {
			setCurrentDirectoryById(item.parentId);
			setSelection([item.id], 'single');
		}
		setSearchQuery('');
	}, [setCurrentDirectoryById, setSelection, setSearchQuery]);

	const handleOpenSearchResult = useCallback((item: FileSystemItem) => {
		if (item.type === 'folder') {
			setCurrentDirectoryById(item.id);
		} else {
			handleFileOpen(item);
		}
		setSearchQuery('');
	}, [setCurrentDirectoryById, handleFileOpen, setSearchQuery]);

	const handleSearchSubmit = useCallback(() => {
		if (searchResults.length) {
			handleOpenSearchResult(searchResults[0]);
		}
	}, [searchResults, handleOpenSearchResult]);

	const handleContextAction = useCallback((item: FileSystemItem, action: 'open' | 'rename' | 'delete' | 'copyPath' | 'properties') => {
		setPropertiesItem(action === 'properties' ? item : null);
		switch (action) {
			case 'open':
				handleItemOpen(item);
				break;
			case 'rename':
				setSearchQuery('');
				setSelection([item.id], 'single');
				setRenameTargetId(item.id);
				break;
			case 'delete': {
				const soft = !isInTrash(item.id);
				deleteItems([item.id], { soft });
				setRenameTargetId(null);
				break;
			}
			case 'copyPath': {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					navigator.clipboard.writeText(item.path).catch((error) => console.error('Clipboard error', error));
				}
				openWindow('systemAlert', {
					title: 'PATH COPIED',
					message: item.path,
					severity: 'info',
				});
				break;
			}
			case 'properties':
				break;
		}
	}, [deleteItems, handleItemOpen, isInTrash, openWindow, setRenameTargetId, setSearchQuery, setSelection, setPropertiesItem]);

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={currentDirectoryId}
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				exit="exit"
				transition={{ duration: 0.2, ease: 'easeOut' }}
				className="relative h-full w-full bg-[#05040a]/95 text-cyan-200 font-mono text-xs backdrop-blur-sm border border-[#1b1a2d] shadow-[0_0_20px_rgba(0,255,255,0.15)] rounded-lg overflow-hidden"
			>
				<div className="flex flex-col h-full">
					<Toolbar
						currentPath={currentPath}
						onCreateFile={() => handleCreate('file')}
						onCreateFolder={() => handleCreate('folder')}
						onDelete={handleDelete}
						onRename={handleRename}
						onRefresh={handleRefresh}
						onClearSelection={() => {
							clearSelection();
							setRenameTargetId(null);
						}}
						selectionState={selectionSummary}
						onRestore={isTrashView ? handleRestore : undefined}
						showRestore={isTrashView}
						onSearchSubmit={handleSearchSubmit}
					/>
					<BreadcrumbsBar breadcrumbs={breadcrumbs} onNavigate={setCurrentDirectoryById} />
					<div className="flex flex-1 overflow-hidden divide-x divide-[#111020]">
						<Sidebar
							expandedIds={expandedIds}
							onToggle={setExpanded}
							onOpen={setCurrentDirectoryById}
							onDrop={handleDropOnFolder}
							draggingId={draggingId}
						/> 

						{isSearching ? (
							<SearchResultsPanel
								query={searchQuery}
								results={searchResults}
								onReveal={handleRevealResult}
								onOpen={handleOpenSearchResult}
							/>
						) : (
							<MainPanel
								items={items}
								selectedIds={selectedIds}
								onSelect={setSelection}
								onOpen={handleItemOpen}
								onRename={handleRenameCommit}
								renameTargetId={renameTargetId}
								onRenameCancel={() => setRenameTargetId(null)}
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}
								onDropOnFolder={handleDropOnFolder}
								onDropOnCurrent={handleDropOnCurrent}
								draggingId={draggingId}
								onContextAction={handleContextAction}
							/>
						)}
					</div>
				</div>
				<PropertiesPanel item={propertiesItem} onClose={() => setPropertiesItem(null)} />
			</motion.div>
		</AnimatePresence>
	);
};

export default FileExplorerApp;
