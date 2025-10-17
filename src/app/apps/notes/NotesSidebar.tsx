import React, { useState, useEffect } from 'react';
import { notesRepository } from '@/lib/notesRepository';
import { Note } from '@/lib/notes';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type NoteFilter = 'all' | 'active' | 'archived';

interface NotesSidebarProps {
  onSelectNote: (id: string) => void;
  activeNoteId: string;
  onCreateNewNote: () => void;
  onNoteChange: number; // Counter to trigger useEffect
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({
  onSelectNote,
  activeNoteId,
  onCreateNewNote,
  onNoteChange,
}) => {
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<NoteFilter>('active');
  const [notePendingDeletion, setNotePendingDeletion] = useState<Note | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const fetchNotes = () => {
    let notes: Note[] = [];
    if (filter === 'all') {
      notes = notesRepository.getAllNotes();
    } else if (filter === 'active') {
      notes = notesRepository.getUnarchivedNotes();
    } else if (filter === 'archived') {
      notes = notesRepository.getArchivedNotes();
    }

    console.log('NotesSidebar: Fetched notes:', notes);

    // Sort by pinned status (pinned first), then by updatedAt (newest first)
    notes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
    setAllNotes(notes);
  };

  useEffect(() => {
    fetchNotes();
    // Re-fetch notes whenever the filter changes or onNoteChange key updates
  }, [filter, onNoteChange]); // Add onNoteChange to dependencies

  // Re-fetch notes when a note is updated (e.g., pinned, archived, renamed)
  // This is a simple way to ensure the sidebar is always up-to-date.
  // A more sophisticated solution might involve a global event bus or Zustand subscription.
  useEffect(() => {
    const handleStorageChange = () => {
      fetchNotes();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // No dependencies here, as fetchNotes is now dependent on onNoteChange

  const handleImportNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const newNote = notesRepository.importNote(content);
          onSelectNote(newNote.id); // Select the newly imported note
          // No need to call onNoteChange here, as the parent will handle it
          fetchNotes(); // Refresh the list
        } catch (error) {
          console.error("Error importing note:", error);
          alert(`Error importing note: ${(error as Error).message}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredNotes = allNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmDelete = () => {
    if (!notePendingDeletion) return;
    const { id } = notePendingDeletion;
    notesRepository.deleteNote(id);
    fetchNotes();
    if (activeNoteId === id) {
      onSelectNote('');
    }
    setNotePendingDeletion(null);
  };

  const noteTitle = notePendingDeletion?.title || 'Untitled Note';

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-2 border-b border-gray-700">
        <button
          className="w-full bg-neon-blue text-white py-2 rounded-md hover:bg-neon-blue-dark focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow transition-colors duration-200"
          onClick={onCreateNewNote}
        >
          + New Note
        </button>
        <input
          type="file"
          accept=".md"
          className="hidden"
          id="import-note-file-input"
          onChange={handleImportNote}
        />
        <button
          className="w-full bg-gray-700 text-gray-300 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow transition-colors duration-200 mt-2"
          onClick={() => document.getElementById('import-note-file-input')?.click()}
        >
          Import MD
        </button>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search notes..."
          className="w-full mt-2 p-2 rounded-md bg-gray-700 text-gray-50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex mt-2 space-x-2">
          <button
            className={`flex-1 px-3 py-1 rounded-md text-sm ${filter === 'active' ? 'bg-neon-blue text-white filter-neon-glow' : 'bg-gray-700 text-gray-300'} focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`flex-1 px-3 py-1 rounded-md text-sm ${filter === 'archived' ? 'bg-neon-blue text-white filter-neon-glow' : 'bg-gray-700 text-gray-300'} focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow`}
            onClick={() => setFilter('archived')}
          >
            Archived
          </button>
          <button
            className={`flex-1 px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-neon-blue text-white filter-neon-glow' : 'bg-gray-700 text-gray-300'} focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-16">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`relative p-3 flex justify-between items-center cursor-pointer border-b border-gray-700 hover:bg-gray-700 ${note.id === activeNoteId ? 'bg-gray-700 text-neon-green filter-neon-glow' : 'text-gray-300'}`}
            onClick={() => onSelectNote(note.id)}
          > <div className="flex flex-col">
            <h3 className="font-bold text-sm truncate">{note.title || 'Untitled Note'} {note.pinned && '📌'}</h3>
            <p className="text-xs text-gray-400 truncate">
              {new Date(note.updatedAt).toLocaleString()}
            </p>
            </div>
            {filter === 'archived' && (
              <button
                className="text-red-500 hover:text-red-400 text-xs ml-2 p-1 rounded-full hover:bg-gray-700 absolute"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting the note when clicking delete
                  setNotePendingDeletion(note);
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
            {filter === 'active' && (
              <button
                className="text-red-500 hover:text-red-400 text-xs ml-2 p-1 rounded-full hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting the note when clicking delete
                  setNotePendingDeletion(note);
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      <Dialog open={!!notePendingDeletion} onOpenChange={(open) => !open && setNotePendingDeletion(null)}>
        <DialogContent className="bg-black/90 border border-fuchsia-500 shadow-[0_0_35px_rgba(188,19,254,0.45)] text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-neon-purple uppercase tracking-[0.2em] text-sm">Purge Confirmation</DialogTitle>
            <DialogDescription className="text-gray-300">
              You are about to erase <span className="text-neon-blue font-semibold">{noteTitle}</span>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 rounded-md border border-fuchsia-600/40 bg-gradient-to-br from-fuchsia-900/20 via-black to-slate-900/50 p-4 text-xs text-gray-300">
            <p className="font-mono text-[13px] leading-relaxed">
              ↳ Confirm purge to reclaim memory sectors. Cancel to keep the note intact.
            </p>
          </div>
          <DialogFooter className="mt-6 flex-row gap-3">
            <button
              className="flex-1 rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm uppercase tracking-wide text-gray-300 transition hover:border-neon-blue hover:text-neon-blue"
              onClick={() => setNotePendingDeletion(null)}
            >
              Abort
            </button>
            <button
              className="flex-1 rounded-md border border-fuchsia-500 bg-fuchsia-900/40 px-3 py-2 text-sm uppercase tracking-wide text-fuchsia-200 transition hover:bg-fuchsia-700/40 hover:text-white hover:shadow-[0_0_20px_rgba(255,7,58,0.6)]"
              onClick={handleConfirmDelete}
            >
              Confirm Purge
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesSidebar;
