import { useEffect, useMemo, useState, MouseEvent as ReactMouseEvent } from 'react';
import { FileSystemItem } from '@/lib/fileSystemTypes';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import * as ContextMenu from '@radix-ui/react-context-menu';

interface MainPanelProps {
  items: FileSystemItem[];
  selectedIds: string[];
  onSelect: (ids: string[], mode?: 'single' | 'toggle' | 'range') => void;
  onOpen: (item: FileSystemItem) => void;
  onRename: (id: string, name: string) => void;
  onRenameCancel: () => void;
  renameTargetId: string | null;
  onDragStart: (item: FileSystemItem) => void;
  onDragEnd: () => void;
  onDropOnFolder: (folderId: string) => void;
  onDropOnCurrent: () => void;
  draggingId: string | null;
  onContextAction: (
    item: FileSystemItem,
    action: 'open' | 'rename' | 'delete' | 'copyPath' | 'properties'
  ) => void;
}

const iconForItem = (item: FileSystemItem) => {
  if (item.type === 'folder') {
    return '🗀';
  }
  const extension = item.metadata?.extension?.toLowerCase();
  switch (extension) {
    case 'md':
    case 'txt':
      return '📝';
    case 'mp3':
    case 'wav':
      return '🎶';
    case 'json':
      return '🧾';
    case 'sys':
      return '⚠️';
    default:
      return '📄';
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

let menuAudioCtx: AudioContext | null = null;

const playMenuSound = async () => {
  if (typeof window === 'undefined') return;
  try {
    menuAudioCtx = menuAudioCtx ?? new AudioContext();
    const ctx = menuAudioCtx;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = 640;
    gain.gain.value = 0.025;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.08);
  } catch (error) {
    console.error('Menu audio error', error);
  }
};

const isDragEvent = (
  event: MouseEvent | PointerEvent | TouchEvent | DragEvent
): event is DragEvent => {
  return 'dataTransfer' in event;
};

export const MainPanel = ({
  items,

  selectedIds,

  onSelect,

  onOpen,

  onRename,

  onRenameCancel,

  renameTargetId,

  onDragStart,

  onDragEnd,

  onDropOnFolder,

  onDropOnCurrent,

  draggingId,

  onContextAction,
}: MainPanelProps) => {
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const [renameDraft, setRenameDraft] = useState('');

  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (!renameTargetId) {
      setRenameDraft('');

      return;
    }

    const target = items.find((item) => item.id === renameTargetId);

    if (target) {
      setRenameDraft(target.name);
    }
  }, [renameTargetId, items]);

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>, item: FileSystemItem) => {
    event.preventDefault();

    if (event.detail === 2 && renameTargetId !== item.id) {
      onOpen(item);

      return;
    }

    if (event.metaKey || event.ctrlKey) {
      onSelect([item.id], 'toggle');
    } else {
      onSelect([item.id], 'single');
    }
  };

  const handleRenameSubmit = (item: FileSystemItem) => {
    const trimmed = renameDraft.trim();

    if (!trimmed) {
      onRenameCancel();

      return;
    }

    if (trimmed !== item.name) {
      onRename(item.id, trimmed);
    } else {
      onRenameCancel();
    }
  };

  const handleDropBackground = (event: React.DragEvent<HTMLDivElement>) => {
    if (!draggingId) return;

    event.preventDefault();

    onDropOnCurrent();

    setDropTargetId(null);

    onDragEnd();
  };

  return (
    <section
      className="flex-1 overflow-hidden bg-dark-primary/80"
      onDragOver={(event) => {
        if (draggingId) {
          event.preventDefault();
        }
      }}
      onDrop={handleDropBackground}
    >
      <div className="custom-scrollbar h-full overflow-auto p-4">
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(120px,_1fr))] gap-4">
          {items.map((item) => {
            const isSelected = selectedSet.has(item.id);

            const isRenaming = renameTargetId === item.id;

            const isDropTarget = dropTargetId === item.id;

            return (
              <ContextMenu.Root
                key={item.id}
                onOpenChange={(open) => {
                  if (open) {
                    void playMenuSound();
                  }
                }}
              >
                <ContextMenu.Trigger asChild>
                  <motion.div
                    className={clsx(
                      'group cursor-pointer rounded-lg border border-transparent bg-[#08071a]/60 p-3 text-center text-[11px] text-cyan-200 transition',

                      isSelected
                        ? 'border-emerald-400/60 bg-[#0d1b1c]/80 text-emerald-200 shadow-[0_0_12px_rgba(0,255,200,0.3)]'
                        : 'hover:border-emerald-400/30 hover:bg-[#0a0919]/80 hover:text-emerald-100 hover:shadow-[0_0_10px_rgba(0,255,200,0.2)]',

                      isDropTarget && 'border-emerald-500/70 bg-[#11231f]/80'
                    )}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    draggable={!isRenaming}
                    onDragStart={(event: MouseEvent | PointerEvent | TouchEvent) => {
                      if (isRenaming) return;

                      onDragStart(item);

                      if (isDragEvent(event) && event.dataTransfer) {
                        event.dataTransfer.clearData();

                        event.dataTransfer.setData('application/x-cyber-item', item.id);

                        event.dataTransfer.setData('text/plain', item.path);

                        event.dataTransfer.effectAllowed = 'move';
                      }
                    }}
                    onDragEnd={(event) => {
                      event.preventDefault();
                      onDragEnd();
                      setDropTargetId(null);
                    }}
                    onDragOver={(event) => {
                      if (draggingId && draggingId !== item.id && item.type === 'folder') {
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
                      if (draggingId && draggingId !== item.id && item.type === 'folder') {
                        onDropOnFolder(item.id);
                      }
                      setDropTargetId(null);
                    }}
                    onClick={(event) => handleClick(event, item)}
                    onDoubleClick={(event) => {
                      event.preventDefault();
                      if (!isRenaming) {
                        onOpen(item);
                      }
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="mb-2 text-2xl" aria-hidden>
                      {iconForItem(item)}
                    </div>
                    {isRenaming ? (
                      <input
                        autoFocus
                        value={renameDraft}
                        onChange={(event) => setRenameDraft(event.target.value)}
                        onBlur={() => handleRenameSubmit(item)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            handleRenameSubmit(item);
                          }
                          if (event.key === 'Escape') {
                            event.preventDefault();
                            onRenameCancel();
                          }
                        }}
                        className="w-full rounded border border-emerald-500/50 bg-dark-primary px-2 py-1 text-center text-[11px] text-emerald-100 focus:border-emerald-400 focus:outline-none"
                      />
                    ) : (
                      <>
                        <div className="truncate" title={item.name}>
                          {item.name}
                        </div>
                        {item.metadata?.extension && (
                          <div className="text-[10px] text-[#3e3c5d]">
                            .{item.metadata.extension}
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                  <ContextMenu.Content className="min-w-[160px] rounded-md border border-emerald-500/40 bg-[#040312]/95 p-1 text-[11px] text-emerald-100 shadow-[0_0_18px_rgba(0,255,200,0.25)] backdrop-blur-sm">
                    <ContextMenu.Item
                      onSelect={(event) => {
                        event.preventDefault();
                        onContextAction(item, 'open');
                      }}
                      className="flex items-center gap-2 rounded px-2 py-1 outline-none focus:bg-emerald-500/15"
                    >
                      Open
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      onSelect={(event) => {
                        event.preventDefault();
                        onContextAction(item, 'rename');
                      }}
                      className="flex items-center gap-2 rounded px-2 py-1 outline-none focus:bg-emerald-500/15"
                    >
                      Rename
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      onSelect={(event) => {
                        event.preventDefault();
                        onContextAction(item, 'delete');
                      }}
                      className="flex items-center gap-2 rounded px-2 py-1 text-rose-300 outline-none focus:bg-rose-500/15"
                    >
                      Delete
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      onSelect={(event) => {
                        event.preventDefault();
                        onContextAction(item, 'copyPath');
                      }}
                      className="flex items-center gap-2 rounded px-2 py-1 outline-none focus:bg-emerald-500/15"
                    >
                      Copy Path
                    </ContextMenu.Item>
                    <ContextMenu.Item
                      onSelect={(event) => {
                        event.preventDefault();
                        onContextAction(item, 'properties');
                      }}
                      className="flex items-center gap-2 rounded px-2 py-1 outline-none focus:bg-emerald-500/15"
                    >
                      Properties
                    </ContextMenu.Item>
                  </ContextMenu.Content>
                </ContextMenu.Portal>
              </ContextMenu.Root>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-[#1c1a33] bg-[#060513]/70 text-[11px] text-[#34325a]">
              <div className="mb-1 text-cyan-300/60">Directory Empty</div>
              <div className="text-[10px]">Use the toolbar to create files or folders</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
