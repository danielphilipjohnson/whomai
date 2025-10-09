import { v4 as uuidv4 } from 'uuid';
import {
	CreateItemOptions,
	FILE_SYSTEM_STORAGE_KEY,
	FILE_SYSTEM_STORAGE_VERSION,
	FileSystemEvent,
	FileSystemItem,
	FileSystemSnapshot,
	FileSystemEventType,
	FileSystemItemMetadata,
} from './fileSystemTypes';

const DEFAULT_FOLDERS = ['Documents', 'Music', 'System', 'Vault', 'Trash'] as const;

type Listener = (event: FileSystemEvent) => void;

const isBrowser = () => typeof window !== 'undefined';

const normalizePath = (input: string) => {
	if (!input) return '/';
	const segments = input.split('/').filter(Boolean);
	return '/' + segments.join('/');
};

const joinPath = (parentPath: string, name: string) => {
	if (parentPath === '/' || parentPath === '') {
		return normalizePath(`/${name}`);
	}
	return normalizePath(`${parentPath}/${name}`);
};

const splitNameAndExtension = (name: string) => {
	const trimmed = name.trim();
	if (!trimmed) return { base: 'untitled', extension: undefined };
	const lastDot = trimmed.lastIndexOf('.');
	if (lastDot <= 0 || lastDot === trimmed.length - 1) {
		return { base: trimmed, extension: undefined };
	}
	return {
		base: trimmed.substring(0, lastDot),
		extension: trimmed.substring(lastDot + 1),
	};
};

const buildMetadata = (name: string, metadata?: FileSystemItemMetadata): FileSystemItemMetadata => {
	const { extension } = splitNameAndExtension(name);
	return {
		extension,
		...metadata,
	};
};

const copyItem = (item: FileSystemItem): FileSystemItem => ({
	...item,
	metadata: item.metadata ? { ...item.metadata } : undefined,
});

const createDefaultSnapshot = (): FileSystemSnapshot => {
	const rootId = uuidv4();
	const now = Date.now();
	const items: Record<string, FileSystemItem> = {};

	const root: FileSystemItem = {
		id: rootId,
		name: '/',
		type: 'folder',
		parentId: null,
		path: '/',
		createdAt: now,
		updatedAt: now,
	};
	items[rootId] = root;

	const folders: Record<string, string> = {};

	DEFAULT_FOLDERS.forEach((folderName) => {
		const id = uuidv4();
		const path = joinPath(root.path, folderName);
		items[id] = {
			id,
			name: folderName,
			type: 'folder',
			parentId: rootId,
			path,
			createdAt: now,
			updatedAt: now,
		};
		folders[folderName] = id;
	});

	const trashId = folders['Trash'];
	const systemId = folders['System'];
	const documentsId = folders['Documents'];
	const musicId = folders['Music'];

	const seedFile = (parentId: string, name: string, content?: string, metadata?: FileSystemItemMetadata, system = false) => {
		const id = uuidv4();
		const parent = items[parentId];
		const path = joinPath(parent.path, name);
		items[id] = {
			id,
			name,
			type: 'file',
			parentId,
			path,
			content,
			metadata: buildMetadata(name, metadata),
			createdAt: now,
			updatedAt: now,
			system,
		};
		return id;
	};

	seedFile(documentsId, 'readme.md', '# Welcome to Cyberpunk OS\n\nYour digital playground awaits.', { appHint: 'notes' });
	seedFile(musicId, 'neon-drive.mp3', undefined, { appHint: 'music' });
	seedFile(systemId, 'kernel.sys', undefined, { appHint: 'system' }, true);

	return {
		version: FILE_SYSTEM_STORAGE_VERSION,
		rootId,
		trashId,
		items,
	};
};

class FileSystemRepository {
	private snapshot: FileSystemSnapshot;
	private listeners = new Set<Listener>();
	private memoizedSnapshot: FileSystemSnapshot | null = null;

	constructor() {
		this.snapshot = this.loadSnapshot();
	}

	subscribe(listener: Listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private emit(type: FileSystemEventType, payload?: unknown) {
		this.memoizedSnapshot = null;
		const event: FileSystemEvent = { type, payload, timestamp: Date.now() };
		this.listeners.forEach((listener) => listener(event));
	}

	getSnapshot(): FileSystemSnapshot {
		if (this.memoizedSnapshot) {
			return this.memoizedSnapshot;
		}
		this.memoizedSnapshot = {
			version: this.snapshot.version,
			rootId: this.snapshot.rootId,
			trashId: this.snapshot.trashId,
			items: Object.fromEntries(
				Object.entries(this.snapshot.items).map(([id, item]) => [id, copyItem(item)])
			),
		};
		return this.memoizedSnapshot;
	}

	private loadSnapshot(): FileSystemSnapshot {
		if (!isBrowser()) {
			return createDefaultSnapshot();
		}

		try {
			const raw = window.localStorage.getItem(FILE_SYSTEM_STORAGE_KEY);
			if (!raw) {
				const snapshot = createDefaultSnapshot();
				this.persist(snapshot);
				return snapshot;
			}
			const parsed = JSON.parse(raw) as FileSystemSnapshot;
			if (parsed.version !== FILE_SYSTEM_STORAGE_VERSION) {
				const migrated = this.migrate(parsed);
				this.persist(migrated);
				return migrated;
			}
			return parsed;
		} catch (error) {
			console.error('Failed to load filesystem from storage. Resetting.', error);
			const snapshot = createDefaultSnapshot();
			this.persist(snapshot);
			return snapshot;
		}
	}

	private migrate(_snapshot: FileSystemSnapshot): FileSystemSnapshot {
		void _snapshot; // Placeholder hook for future migrations
		return createDefaultSnapshot();
	}

	private persist(snapshot: FileSystemSnapshot = this.snapshot) {
		if (!isBrowser()) return;
		window.localStorage.setItem(FILE_SYSTEM_STORAGE_KEY, JSON.stringify(snapshot));
	}

	private updateItem(item: FileSystemItem) {
		this.snapshot.items[item.id] = item;
		this.snapshot.version = FILE_SYSTEM_STORAGE_VERSION;
		this.persist();
	}

	private getParent(item: FileSystemItem) {
		return item.parentId ? this.snapshot.items[item.parentId] : null;
	}

	private generateUniqueName(parentId: string, desiredName: string): string {
		const parent = this.snapshot.items[parentId];
		if (!parent || parent.type !== 'folder') return desiredName;

		const siblings = Object.values(this.snapshot.items).filter((item) => item.parentId === parentId);
		const existingNames = new Set(siblings.map((item) => item.name.toLowerCase()));

		if (!existingNames.has(desiredName.toLowerCase())) {
			return desiredName;
		}

		const { base, extension } = splitNameAndExtension(desiredName);
		let counter = 1;
		while (true) {
			const candidate = extension ? `${base} (${counter}).${extension}` : `${base} (${counter})`;
			if (!existingNames.has(candidate.toLowerCase())) {
				return candidate;
			}
			counter += 1;
		}
	}

	private applyPathRecursively(itemId: string, newParentPath: string) {
		const item = this.snapshot.items[itemId];
		if (!item) return;
		const updatedPath = item.parentId ? joinPath(newParentPath, item.name) : '/';
		item.path = updatedPath;
		item.updatedAt = Date.now();
		if (item.type === 'folder') {
			Object.values(this.snapshot.items)
				.filter((child) => child.parentId === item.id)
				.forEach((child) => this.applyPathRecursively(child.id, updatedPath));
		}
	}

	private assertParentIsFolder(parentId: string) {
		const parent = this.snapshot.items[parentId];
		if (!parent) throw new Error(`Parent not found: ${parentId}`);
		if (parent.type !== 'folder') throw new Error('Parent must be a folder');
	}

	private ensureNotDescendant(targetId: string, potentialParentId: string) {
		let current = this.snapshot.items[potentialParentId];
		while (current) {
			if (current.id === targetId) {
				throw new Error('Cannot move folder into its own descendant');
			}
			current = current.parentId ? this.snapshot.items[current.parentId] : undefined;
		}
	}

	private resolveParentId(options: CreateItemOptions): string {
		if (options.parentId) return options.parentId;
		const targetPath = options.parentPath ? normalizePath(options.parentPath) : '/';
		const target = Object.values(this.snapshot.items).find((item) => item.path === targetPath && item.type === 'folder');
		if (!target) throw new Error(`Directory not found: ${targetPath}`);
		return target.id;
	}

	list(path: string) {
		const normalized = normalizePath(path);
		const directory = Object.values(this.snapshot.items).find((item) => item.path === normalized && item.type === 'folder');
		if (!directory) throw new Error(`Directory not found: ${path}`);
		return Object.values(this.snapshot.items)
			.filter((item) => item.parentId === directory.id)
			.map(copyItem)
			.sort((a, b) => {
				if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
				return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
			});
	}

	listByParentId(parentId: string) {
		return Object.values(this.snapshot.items)
			.filter((item) => item.parentId === parentId)
			.map(copyItem)
			.sort((a, b) => {
				if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
				return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
			});
	}

	getItemById(id: string) {
		const item = this.snapshot.items[id];
		return item ? copyItem(item) : undefined;
	}

	createItem(options: CreateItemOptions) {
		const parentId = this.resolveParentId(options);
		this.assertParentIsFolder(parentId);

		const parent = this.snapshot.items[parentId];
		const now = Date.now();
		const uniqueName = this.generateUniqueName(parentId, options.name.trim() || (options.type === 'folder' ? 'New Folder' : 'New File'));
		const id = uuidv4();
		const path = joinPath(parent.path, uniqueName);

		const item: FileSystemItem = {
			id,
			name: uniqueName,
			type: options.type,
			parentId,
			path,
			content: options.type === 'file' ? options.content ?? '' : undefined,
			metadata: options.type === 'file' ? buildMetadata(uniqueName, options.metadata) : options.metadata,
			createdAt: now,
			updatedAt: now,
			deletedAt: null,
		};

		this.snapshot.items[id] = item;
		this.persist();
		this.emit('create', copyItem(item));
		return copyItem(item);
	}

	createFile(path: string, name: string, type: 'file' | 'folder') {
		return this.createItem({ type, name, parentPath: path });
	}

	deleteItem(id: string, { soft = true }: { soft?: boolean } = { soft: true }) {
		const item = this.snapshot.items[id];
		if (!item) throw new Error(`Item not found: ${id}`);

		if (soft) {
			const trashId = this.snapshot.trashId;
			if (!trashId) throw new Error('Trash not initialized');
			if (item.parentId === trashId) {
				// Already in trash, perform hard delete to avoid duplicates
				return this.deleteItem(id, { soft: false });
			}
			this.assertParentIsFolder(trashId);
			const originalParentId = item.parentId;
			const originalParent = originalParentId ? this.snapshot.items[originalParentId] : null;
			item.parentId = trashId;
			item.deletedAt = Date.now();
			item.metadata = {
				...item.metadata,
				lastParentId: originalParent?.id,
				lastParentPath: originalParent?.path ?? '/',
			};
			const trash = this.snapshot.items[trashId];
			item.path = joinPath(trash.path, item.name);
			item.updatedAt = Date.now();
			this.applyPathRecursively(item.id, trash.path);
			this.persist();
			this.emit('delete', copyItem(item));
			return;
		}

		// Hard delete (remove recursively)
		const removeRecursive = (itemId: string) => {
			Object.values(this.snapshot.items)
				.filter((child) => child.parentId === itemId)
				.forEach((child) => removeRecursive(child.id));
			delete this.snapshot.items[itemId];
		};
		removeRecursive(id);
		this.persist();
		this.emit('delete', { id });
	}

	restoreItem(id: string, destinationPath?: string) {
		const item = this.snapshot.items[id];
		if (!item) throw new Error(`Item not found: ${id}`);
		if (!item.deletedAt) return copyItem(item);

		const preferredPath = destinationPath
			? normalizePath(destinationPath)
			: item.metadata?.lastParentPath
				? normalizePath(item.metadata.lastParentPath)
				: '/';
		const targetFolder = Object.values(this.snapshot.items).find((entry) => entry.path === preferredPath && entry.type === 'folder')
			|| this.snapshot.items[this.snapshot.rootId];
		if (!targetFolder) throw new Error('Restore destination unavailable');
		const parentId = targetFolder.id;
		this.assertParentIsFolder(parentId);

		const restoredName = this.generateUniqueName(parentId, item.name);
		item.name = restoredName;
		item.parentId = parentId;
		item.deletedAt = null;
		item.updatedAt = Date.now();
		item.path = joinPath(targetFolder.path, restoredName);
		if (item.metadata) {
			delete item.metadata.lastParentId;
			delete item.metadata.lastParentPath;
		}
		this.applyPathRecursively(item.id, targetFolder.path);
		this.persist();
		this.emit('restore', copyItem(item));
		return copyItem(item);
	}

	renameItem(id: string, newName: string) {
		const item = this.snapshot.items[id];
		if (!item) throw new Error(`Item not found: ${id}`);
		const trimmed = newName.trim();
		if (!trimmed) throw new Error('Name cannot be empty');
		if (!item.parentId) throw new Error('Cannot rename root');
		const parentId = item.parentId;
		const uniqueName = this.generateUniqueName(parentId, trimmed);
		item.name = uniqueName;
		item.metadata = buildMetadata(uniqueName, item.metadata);
		const parent = this.snapshot.items[parentId];
		item.path = joinPath(parent.path, uniqueName);
		item.updatedAt = Date.now();
		this.applyPathRecursively(item.id, parent.path);
		this.persist();
		this.emit('rename', copyItem(item));
		return copyItem(item);
	}

	moveItem(id: string, destinationId: string) {
		const item = this.snapshot.items[id];
		const destination = this.snapshot.items[destinationId];
		if (!item) throw new Error(`Item not found: ${id}`);
		if (!destination) throw new Error(`Destination not found: ${destinationId}`);
		if (destination.type !== 'folder') throw new Error('Destination must be a folder');
		if (item.id === destination.id) throw new Error('Cannot move item into itself');
		this.ensureNotDescendant(item.id, destination.id);

		const newName = this.generateUniqueName(destination.id, item.name);
		item.name = newName;
		item.parentId = destination.id;
		item.path = joinPath(destination.path, newName);
		item.updatedAt = Date.now();
		item.deletedAt = null;
		if (item.metadata) {
			delete item.metadata.lastParentId;
			delete item.metadata.lastParentPath;
		}
		this.applyPathRecursively(item.id, destination.path);
		this.persist();
		this.emit('move', copyItem(item));
		return copyItem(item);
	}

	readFile(id: string) {
		const item = this.snapshot.items[id];
		if (!item) throw new Error(`File not found: ${id}`);
		if (item.type !== 'file') throw new Error('Cannot read a folder');
		this.emit('read', copyItem(item));
		return item.content ?? '';
	}

	writeFile(id: string, content: string) {
		const item = this.snapshot.items[id];
		if (!item) throw new Error(`File not found: ${id}`);
		if (item.type !== 'file') throw new Error('Cannot write to a folder');
		item.content = content;
		item.updatedAt = Date.now();
		item.metadata = {
			...item.metadata,
			size: content.length,
		};
		this.persist();
		this.emit('write', copyItem(item));
		return copyItem(item);
	}

	refresh() {
		this.snapshot = this.loadSnapshot();
		this.emit('refresh', this.getSnapshot());
		return this.getSnapshot();
	}

	reset() {
		this.snapshot = createDefaultSnapshot();
		this.persist();
		this.emit('refresh', this.getSnapshot());
	}
}

export const fileSystemRepository = new FileSystemRepository();
