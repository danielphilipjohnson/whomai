import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { notesRepository } from '@/lib/notesRepository';

const STORAGE_KEY = 'cyberpunk-os-notes';

const getPersistedNotes = () => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

let consoleLogSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  window.localStorage.removeItem(STORAGE_KEY);
  notesRepository.reloadNotes();
});

afterEach(() => {
  consoleLogSpy.mockRestore();
});

describe('notesRepository', () => {
  it('creates a note and persists it to storage', () => {
    const note = notesRepository.createNote('Test Note');

    expect(note.title).toBe('Test Note');
    expect(note.content).toBe('');

    const persisted = getPersistedNotes();
    expect(persisted).toHaveLength(1);
    expect(persisted[0].title).toBe('Test Note');
  });

  it('updates note content and updates the timestamp', () => {
    const note = notesRepository.createNote('Editable Note');
    const initialUpdatedAt = note.updatedAt;

    const updated = notesRepository.updateNote(note.id, 'Updated content');

    expect(updated).toBeDefined();
    expect(updated?.content).toBe('Updated content');
    expect(updated?.updatedAt).toBeGreaterThanOrEqual(initialUpdatedAt);

    const persisted = getPersistedNotes()[0];
    expect(persisted.content).toBe('Updated content');
  });

  it('imports markdown, deriving the title from the first heading', () => {
    const imported = notesRepository.importNote('# Heading\nBody text');

    expect(imported.title).toBe('Heading');
    expect(imported.content).toBe('# Heading\nBody text');

    const persisted = getPersistedNotes();
    expect(persisted).toHaveLength(1);
    expect(persisted[0].title).toBe('Heading');
  });

  it('rejects files larger than 1MB on import', () => {
    const oversized = 'a'.repeat(1024 * 1024 + 1);

    expect(() => notesRepository.importNote(oversized)).toThrow(/exceeds maximum/);
  });

  it('renames, pins, and archives notes while persisting changes', () => {
    const note = notesRepository.createNote('Original');

    const renamed = notesRepository.renameNote(note.id, 'Renamed');
    expect(renamed?.title).toBe('Renamed');

    const pinned = notesRepository.togglePin(note.id);
    expect(pinned?.pinned).toBe(true);

    const archived = notesRepository.toggleArchive(note.id);
    expect(archived?.archived).toBe(true);

    const persisted = getPersistedNotes()[0];
    expect(persisted.title).toBe('Renamed');
    expect(persisted.pinned).toBe(true);
    expect(persisted.archived).toBe(true);
  });

  it('deletes notes and surfaces filtered collections', () => {
    const a = notesRepository.createNote('A');
    const b = notesRepository.createNote('B');
    notesRepository.toggleArchive(b.id);

    const deleted = notesRepository.deleteNote(a.id);
    expect(deleted).toBe(true);

    expect(notesRepository.getAllNotes()).toHaveLength(1);
    expect(notesRepository.getArchivedNotes()).toHaveLength(1);
    expect(notesRepository.getUnarchivedNotes()).toHaveLength(0);
  });

  it('reloads notes from storage snapshot', () => {
    const snapshot = [
      {
        id: 'seed',
        title: 'Seed Note',
        content: 'hello',
        tags: [],
        pinned: false,
        archived: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    notesRepository.reloadNotes();

    const notes = notesRepository.getAllNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe('Seed Note');
  });
});
