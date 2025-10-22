import { useDebugValue, useRef, useSyncExternalStore } from 'react';
import { createStore, type StateCreator, type StoreApi } from 'zustand/vanilla';
import { fileSystemRepository } from '@/lib/fileSystemRepository';
import { FileSystemItem, FileSystemItemType } from '@/lib/fileSystemTypes';

const identity = <T>(value: T) => value;

function createBoundStore<TState>(initializer: StateCreator<TState, [], [], TState>) {
  const store = createStore<TState>(initializer);
  function useBoundStore<U = TState>(
    selector: (state: TState) => U = identity as (state: TState) => U,
    equalityFn: (a: U, b: U) => boolean = Object.is
  ): U {
    const selectorRef = useRef(selector);
    const equalityRef = useRef(equalityFn);
    const sliceRef = useRef<U | undefined>(undefined);

    selectorRef.current = selector;
    equalityRef.current = equalityFn;

    const state = useSyncExternalStore(
      store.subscribe,
      store.getState,
      store.getInitialState ?? store.getState
    );

    const selectedSlice = selectorRef.current(state);
    const currentSlice = sliceRef.current;
    if (currentSlice === undefined || !equalityRef.current(selectedSlice, currentSlice)) {
      sliceRef.current = selectedSlice;
    }

    useDebugValue(sliceRef.current);
    return sliceRef.current as U;
  }

  Object.assign(useBoundStore, store);
  return useBoundStore as typeof useBoundStore & StoreApi<TState>;
}

const normalizePath = (input: string) => {
  if (!input) return '/';
  const trimmed = input.trim();
  const leadingSlash = trimmed.startsWith('/') ? '' : '/';
  const segments = (leadingSlash + trimmed).split('/').filter(Boolean);
  return '/' + segments.join('/');
};

const sortItems = (items: FileSystemItem[]) =>
  [...items].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });

type SelectionMode = 'single' | 'toggle' | 'range';

type FileSystemStore = {
  initialized: boolean;
  rootId: string;
  trashId: string;
  items: Record<string, FileSystemItem>;
  currentDirectoryId: string;
  currentPath: string;
  searchQuery: string;
  expandedIds: Set<string>;
  selectedIds: string[];
  lastEventType?: string;
  initialize: () => void;
  refresh: () => void;
  setCurrentDirectoryById: (id: string) => void;
  setCurrentPath: (path: string) => void;
  openParentDirectory: () => void;
  setSearchQuery: (query: string) => void;
  setExpanded: (id: string, expanded: boolean) => void;
  getItemById: (id: string) => FileSystemItem | undefined;
  createItemInCurrent: (name: string, type: FileSystemItemType) => FileSystemItem;
  deleteItems: (ids: string[], options?: { soft?: boolean }) => void;
  restoreItem: (id: string, destinationPath?: string) => FileSystemItem;
  renameItem: (id: string, name: string) => FileSystemItem;
  moveItem: (id: string, destinationFolderId: string) => FileSystemItem;
  readFile: (id: string) => string;
  writeFile: (id: string, content: string) => FileSystemItem;
  setSelection: (ids: string[], mode?: SelectionMode) => void;
  clearSelection: () => void;
  isInTrash: (id: string) => boolean;
  searchItems: (query: string) => FileSystemItem[];
  listDirectory: (path?: string) => FileSystemItem[];
};

let isSubscribed = false;

export const useFileSystemStore = createBoundStore<FileSystemStore>((set, get) => ({
  initialized: false,
  rootId: '',
  trashId: '',
  items: {},
  currentDirectoryId: '',
  currentPath: '/',
  searchQuery: '',
  expandedIds: new Set<string>(),
  selectedIds: [],
  lastEventType: undefined,

  initialize: () => {
    if (get().initialized) return;
    const snapshot = fileSystemRepository.getSnapshot();
    const preferredPath = '/Documents';
    const preferred = Object.values(snapshot.items).find(
      (item) => item.path === preferredPath && item.type === 'folder'
    );
    const currentDirectory = preferred ?? snapshot.items[snapshot.rootId];
    const expanded = new Set<string>();
    let parentCursor: FileSystemItem | undefined = currentDirectory;
    while (parentCursor) {
      expanded.add(parentCursor.id);
      parentCursor = parentCursor.parentId ? snapshot.items[parentCursor.parentId] : undefined;
    }

    set({
      initialized: true,
      rootId: snapshot.rootId,
      trashId: snapshot.trashId,
      items: snapshot.items,
      currentDirectoryId: currentDirectory.id,
      currentPath: currentDirectory.path,
      expandedIds: expanded,
    });

    if (!isSubscribed && typeof window !== 'undefined') {
      fileSystemRepository.subscribe((event) => {
        const latest = fileSystemRepository.getSnapshot();
        set((state) => {
          const next: Partial<FileSystemStore> = {
            items: latest.items,
            rootId: latest.rootId,
            trashId: latest.trashId,
            lastEventType: event.type,
          };
          if (!latest.items[state.currentDirectoryId]) {
            const fallback = latest.items[latest.rootId];
            next.currentDirectoryId = fallback.id;
            next.currentPath = fallback.path;
          }
          return next;
        });
      });
      isSubscribed = true;
    }
  },

  refresh: () => {
    const snapshot = fileSystemRepository.refresh();
    set({
      items: snapshot.items,
      rootId: snapshot.rootId,
      trashId: snapshot.trashId,
    });
  },

  setCurrentDirectoryById: (id: string) => {
    const state = get();
    const item = state.items[id];
    if (!item || item.type !== 'folder') return;
    const expanded = new Set(state.expandedIds);
    const beforeSize = expanded.size;
    expanded.add(id);
    const expandedChanged = expanded.size !== beforeSize;
    const alreadyCurrent = state.currentDirectoryId === id;
    const alreadyPath = state.currentPath === item.path;
    if (alreadyCurrent && alreadyPath && !expandedChanged) return;
    set({ currentDirectoryId: id, currentPath: item.path, expandedIds: expanded });
  },

  setCurrentPath: (path: string) => {
    const normalized = normalizePath(path);
    const items = get().items;
    const item = Object.values(items).find(
      (entry) => entry.path === normalized && entry.type === 'folder'
    );
    if (item) {
      set((state) => {
        const expanded = new Set(state.expandedIds);
        let cursor: FileSystemItem | undefined = item;
        while (cursor) {
          expanded.add(cursor.id);
          cursor = cursor.parentId ? state.items[cursor.parentId] : undefined;
        }
        return {
          currentDirectoryId: item.id,
          currentPath: item.path,
          expandedIds: expanded,
        };
      });
    }
  },

  openParentDirectory: () => {
    const { currentDirectoryId, items } = get();
    const current = items[currentDirectoryId];
    if (current && current.parentId) {
      const parent = items[current.parentId];
      if (parent && parent.type === 'folder') {
        set({
          currentDirectoryId: parent.id,
          currentPath: parent.path,
        });
      }
    }
  },

  setSearchQuery: (query: string) => {
    if (get().searchQuery === query) return;
    set({ searchQuery: query });
  },

  setExpanded: (id: string, expanded: boolean) => {
    const state = get();
    const next = new Set(state.expandedIds);
    const had = next.has(id);
    if (expanded) {
      next.add(id);
    } else {
      next.delete(id);
    }
    if (had === expanded) return;
    set({ expandedIds: next });
  },

  getItemById: (id: string) => get().items[id],

  createItemInCurrent: (name, type) => {
    const { currentPath } = get();
    const item = fileSystemRepository.createFile(currentPath, name, type);
    set({ currentDirectoryId: item.parentId ?? '', currentPath });
    return item;
  },

  deleteItems: (ids, options) => {
    ids.forEach((id) => {
      try {
        fileSystemRepository.deleteItem(id, options);
      } catch (error) {
        console.error(error);
      }
    });
    if (get().selectedIds.length) {
      set({ selectedIds: [] });
    }
  },

  restoreItem: (id, destinationPath) => fileSystemRepository.restoreItem(id, destinationPath),

  renameItem: (id, name) => {
    const renamed = fileSystemRepository.renameItem(id, name);
    if (renamed.type === 'folder' && renamed.id === get().currentDirectoryId) {
      set({ currentPath: renamed.path });
    }
    return renamed;
  },

  moveItem: (id, destinationFolderId) => {
    const { items } = get();
    const current = items[id];
    if (current && current.parentId === destinationFolderId) {
      return current;
    }
    const moved = fileSystemRepository.moveItem(id, destinationFolderId);
    if (moved.id === get().currentDirectoryId) {
      set({
        currentDirectoryId: moved.id,
        currentPath: moved.path,
      });
    }
    return moved;
  },

  readFile: (id) => fileSystemRepository.readFile(id),

  writeFile: (id, content) => fileSystemRepository.writeFile(id, content),

  searchItems: (query) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    const state = get();
    const { items, rootId } = state;
    return Object.values(items)
      .filter((item) => item.id !== rootId)
      .filter((item) => !item.deletedAt && !state.isInTrash(item.id))
      .filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(normalized);
        const extensionMatch =
          item.type === 'file' &&
          item.metadata?.extension &&
          item.metadata.extension.toLowerCase().includes(normalized.replace(/^\./, ''));
        const typeMatch =
          normalized === 'folder'
            ? item.type === 'folder'
            : normalized === 'file'
              ? item.type === 'file'
              : false;
        return nameMatch || extensionMatch || typeMatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  },

  setSelection: (ids, mode = 'single') => {
    const state = get();
    let nextSelection: string[];
    if (mode === 'single') {
      nextSelection = ids.slice(0, 1);
    } else if (mode === 'toggle') {
      const next = new Set(state.selectedIds);
      ids.forEach((id) => {
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      });
      nextSelection = Array.from(next);
    } else if (mode === 'range' && ids.length) {
      nextSelection = ids;
    } else {
      nextSelection = ids;
    }

    const previous = state.selectedIds;
    const unchanged =
      nextSelection.length === previous.length &&
      nextSelection.every((value, index) => previous[index] === value);
    if (unchanged) return;
    set({ selectedIds: nextSelection });
  },

  clearSelection: () => {
    if (get().selectedIds.length === 0) return;
    set({ selectedIds: [] });
  },

  isInTrash: (id: string) => {
    const { items, trashId } = get();
    let cursor: FileSystemItem | undefined = items[id];
    while (cursor) {
      if (cursor.parentId === trashId) return true;
      cursor = cursor.parentId ? items[cursor.parentId] : undefined;
    }
    return false;
  },

  listDirectory: (path) => {
    const targetPath = normalizePath(path ?? get().currentPath);
    const items = get().items;
    const directory = Object.values(items).find(
      (item) => item.path === targetPath && item.type === 'folder'
    );
    if (!directory) return [];
    return sortItems(Object.values(items).filter((item) => item.parentId === directory.id));
  },
}));
