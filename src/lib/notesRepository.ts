import { v4 as uuidv4 } from 'uuid';
import { Note } from './notes';

const LOCAL_STORAGE_KEY = 'cyberpunk-os-notes';

class NotesRepository {
  private notes: Note[];

  constructor() {
    this.notes = this.loadNotes();
  }

  private loadNotes(): Note[] {
    if (typeof window === 'undefined') {
      return [];
    }
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveNotes(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.notes));
    }
  }

  createNote(title: string): Note {
    const now = Date.now();
    const newNote: Note = {
      id: uuidv4(),
      title,
      content: '',
      tags: [],
      pinned: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(newNote);
    this.saveNotes();
    return newNote;
  }

  updateNote(id: string, content: string): Note | undefined {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex > -1) {
      this.notes[noteIndex] = {
        ...this.notes[noteIndex],
        content,
        updatedAt: Date.now(),
      };
      this.saveNotes();
      return this.notes[noteIndex];
    }
    return undefined;
  }

  renameNote(id: string, newTitle: string): Note | undefined {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex > -1) {
      const updatedNote = {
        ...this.notes[noteIndex],
        title: newTitle,
        updatedAt: Date.now(),
      };
      this.notes[noteIndex] = updatedNote;
      this.saveNotes();
      return updatedNote;
    }
    return undefined;
  }

  togglePin(id: string): Note | undefined {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex > -1) {
      const updatedNote = {
        ...this.notes[noteIndex],
        pinned: !this.notes[noteIndex].pinned,
        updatedAt: Date.now(),
      };
      this.notes[noteIndex] = updatedNote;
      this.saveNotes();
      return updatedNote;
    }
    return undefined;
  }

  toggleArchive(id: string): Note | undefined {
    const noteIndex = this.notes.findIndex((note) => note.id === id);
    if (noteIndex > -1) {
      const updatedNote = {
        ...this.notes[noteIndex],
        archived: !this.notes[noteIndex].archived,
        updatedAt: Date.now(),
      };
      this.notes[noteIndex] = updatedNote;
      this.saveNotes();
      return updatedNote;
    }
    return undefined;
  }

  deleteNote(id: string): boolean {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter((note) => note.id !== id);
    this.saveNotes();
    return this.notes.length < initialLength;
  }

  getAllNotes(): Note[] {
    return this.notes;
  }

  getArchivedNotes(): Note[] {
    return this.notes.filter((note) => note.archived);
  }

  getUnarchivedNotes(): Note[] {
    return this.notes.filter((note) => !note.archived);
  }

  getNoteById(id: string): Note | undefined {
    return this.notes.find((note) => note.id === id);
  }

  reloadNotes(): void {
    this.notes = this.loadNotes();
  }

  private generateTitleFromContent(content: string): string {
    const firstLine = content.split('\n')[0];
    if (firstLine && firstLine.startsWith('#')) {
      return firstLine.replace(/^#+\s*/, '').trim();
    }
    return content.substring(0, 30).trim() || 'Imported Note';
  }

  importNote(content: string): Note {
    const MAX_CONTENT_SIZE = 1024 * 1024; // 1MB
    if (content.length > MAX_CONTENT_SIZE) {
      throw new Error('Imported note content exceeds maximum allowed size (1MB).');
    }

    const title = this.generateTitleFromContent(content);
    const newNote: Note = {
      id: uuidv4(),
      title: title,
      content: content,
      tags: [],
      pinned: false,
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.notes.push(newNote);
    this.saveNotes();
    return newNote;
  }
}

export const notesRepository = new NotesRepository();
