import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { FileSystemItem } from '@/lib/fileSystemTypes';
import { shallow } from 'zustand/shallow';
import clsx from 'clsx';

interface SidebarProps {
  expandedIds: Set<string>;
  onToggle: (id: string, expanded: boolean) => void;
  onOpen: (id: string) => void;
  onDrop: (folderId: string) => void;
  draggingId: string | null;
}

interface TreeNode {
  item: FileSystemItem;
  children: TreeNode[];
}

const containerClasses =
  'w-60 bg-sidebar/80 text-[11px] overflow-y-auto custom-scrollbar shadow-[inset_-2px_0_12px_rgba(0,0,0,0.25)]';

const iconForFolder = (item: FileSystemItem) => {
  switch (item.name.toLowerCase()) {
    case 'documents':
      return '📂';
    case 'music':
      return '🎵';
    case 'system':
      return '⚙️';
    case 'vault':
      return '🔒';
    case 'trash':
      return '🗑️';
    default:
      return '📁';
  }
};

export const Sidebar = ({ expandedIds, onToggle, onOpen, onDrop, draggingId }: SidebarProps) => {
  const { items, rootId, currentDirectoryId } = useFileSystemStore(
    (state) => ({
      items: state.items,
      rootId: state.rootId,
      currentDirectoryId: state.currentDirectoryId,
    }),
    shallow
  );
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (!draggingId) {
      setDropTargetId(null);
    }
  }, [draggingId]);

  const buildTree = useCallback(
    (folderId: string): TreeNode => {
      const node = items[folderId];
      const children = Object.values(items)
        .filter((item) => item.parentId === folderId && item.type === 'folder')
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
        .map((child) => buildTree(child.id));
      return { item: node, children };
    },
    [items]
  );

  const tree = useMemo(() => {
    if (!rootId || !items[rootId]) return null;
    return buildTree(rootId);
  }, [items, rootId, buildTree]);

  if (!tree) return null;

  const renderNode = (node: TreeNode, depth = 0) => {
    const { item, children } = node;
    const isExpanded = expandedIds.has(item.id);
    const isActive = item.id === currentDirectoryId;
    const isDropTarget = dropTargetId === item.id;

    return (
      <div key={item.id} className="select-none">
        <button
          type="button"
          onClick={() => {
            onToggle(item.id, !isExpanded);
            onOpen(item.id);
          }}
          onDoubleClick={(event) => {
            event.preventDefault();
            onOpen(item.id);
          }}
          className={clsx(
            'flex w-full items-center gap-2 px-2 py-1 text-left transition',
            isActive
              ? 'bg-[rgba(0,255,170,0.12)] text-emerald-300 shadow-[inset_0_0_8px_rgba(0,255,200,0.12)]'
              : 'hover:bg-[#101026] hover:text-emerald-200',
            isDropTarget
              ? 'border border-emerald-500/60 bg-active-item/60'
              : 'border border-transparent'
          )}
          style={{ paddingLeft: 12 + depth * 12 }}
          onDragOver={(event) => {
            if (draggingId && draggingId !== item.id) {
              event.preventDefault();
              setDropTargetId(item.id);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (dropTargetId === item.id) {
              setDropTargetId(null);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            if (draggingId && draggingId !== item.id) {
              onDrop(item.id);
            }
            setDropTargetId(null);
          }}
        >
          <ChevronRight
            size={10}
            className={clsx(
              'transition-transform duration-200',
              isExpanded ? 'rotate-90 text-emerald-300' : 'text-[#2b2846]'
            )}
          />
          <span className="text-xs" aria-hidden>
            {iconForFolder(item)}
          </span>
          <span className="truncate">{item.name}</span>
        </button>

        {children.length > 0 && (
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                {children.map((child) => renderNode(child, depth + 1))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  const rootChildren = tree.children;
  const rootActive = currentDirectoryId === tree.item.id;
  const isRootDropTarget = dropTargetId === tree.item.id;

  return (
    <aside className={containerClasses} aria-label="File explorer sidebar">
      <div className="space-y-1 p-2">
        <button
          type="button"
          onClick={() => onOpen(tree.item.id)}
          onDragOver={(event) => {
            if (draggingId) {
              event.preventDefault();
              setDropTargetId(tree.item.id);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (dropTargetId === tree.item.id) {
              setDropTargetId(null);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            if (draggingId) {
              onDrop(tree.item.id);
            }
            setDropTargetId(null);
          }}
          className={clsx(
            'flex w-full items-center gap-2 px-2 py-1 text-left text-[10px] tracking-[0.2em] uppercase transition',
            rootActive
              ? 'bg-[rgba(0,255,170,0.12)] text-emerald-300 shadow-[inset_0_0_8px_rgba(0,255,200,0.12)]'
              : 'hover:bg-[#101026] hover:text-emerald-200',
            isRootDropTarget
              ? 'border border-emerald-500/60 bg-active-item/60'
              : 'border border-transparent'
          )}
        >
          <span className="text-xs" aria-hidden>
            ⛬
          </span>
          Root Directory
        </button>

        <div className="space-y-1">{rootChildren.map((child) => renderNode(child, 0))}</div>
      </div>
    </aside>
  );
};
