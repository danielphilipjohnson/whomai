export type FileSystemItemType = 'file' | 'folder';

export interface FileSystemItemMetadata {
	extension?: string;
	size?: number;
	icon?: string;
	appHint?: string;
	lastParentId?: string;
	lastParentPath?: string;
	[k: string]: unknown;
}

export interface FileSystemItem {
	id: string;
	name: string;
	type: FileSystemItemType;
	parentId: string | null;
	path: string;
	content?: string;
	createdAt: number;
	updatedAt: number;
	deletedAt?: number | null;
	metadata?: FileSystemItemMetadata;
	system?: boolean;
}

export interface FileSystemSnapshot {
	version: number;
	rootId: string;
	items: Record<string, FileSystemItem>;
	trashId: string;
}

export interface CreateItemOptions {
	type: FileSystemItemType;
	name: string;
	parentPath?: string;
	parentId?: string;
	content?: string;
	metadata?: FileSystemItemMetadata;
	silent?: boolean;
}

export type FileSystemEventType =
	| 'create'
	| 'update'
	| 'delete'
	| 'move'
	| 'rename'
	| 'write'
	| 'read'
	| 'restore'
	| 'refresh';

export interface FileSystemEvent<T = unknown> {
	type: FileSystemEventType;
	payload?: T;
	timestamp: number;
}

export const FILE_SYSTEM_STORAGE_KEY = 'cyberpunk-os-filesystem';
export const FILE_SYSTEM_STORAGE_VERSION = 1;
