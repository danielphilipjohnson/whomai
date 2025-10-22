import React, { useState, useEffect, useCallback, useRef } from 'react';
import { notesRepository } from '@/lib/notesRepository';
import { Note } from '@/lib/notes';
import { useShortcut } from '@/hooks/useShortcut';
import { debounce } from 'lodash';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import rehypeHighlight from 'rehype-highlight';
import MarkdownPreview from './MarkdownPreview';
import NotesSidebar from './NotesSidebar';
import { Menu } from 'lucide-react';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { pushToast } from '@/store/useToastStore';

type ViewMode = 'edit' | 'preview' | 'split';

interface NotesAppProps {
  id: string;
  title: string;
  onNoteChange: (note: Note | null) => void;
}

const NotesApp = ({ id, title, onNoteChange }: NotesAppProps) => {
  const [currentNoteId, setCurrentNoteId] = useState<string>(id);
  const [note, setNote] = useState<Note | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // New state for sidebar visibility
  const [noteChangeCounter, setNoteChangeCounter] = useState<number>(0);
  const lastAutosaveToast = useRef(0);
  const getItemById = useFileSystemStore((state) => state.getItemById);
  const readFile = useFileSystemStore((state) => state.readFile);

  // Load note on initial mount or when currentNoteId changes
  useEffect(() => {
    if (!currentNoteId || currentNoteId === 'notes') {
      setNote(null);
      setEditorContent('');
      onNoteChange(null);
      return;
    }

    let fetchedNote = notesRepository.getNoteById(currentNoteId);
    if (!fetchedNote) {
      console.warn(`Note with ID ${currentNoteId} not found. Creating a new one.`);
      fetchedNote = notesRepository.createNote(title);
      setCurrentNoteId(fetchedNote.id);
    }
    setNote(fetchedNote);
    setEditorContent(fetchedNote.content);
    onNoteChange(fetchedNote);
  }, [currentNoteId, title, onNoteChange]);

  // Debounced autosave
  const debouncedSave = useCallback(
    debounce((updatedContent: string) => {
      if (note) {
        const updated = notesRepository.updateNote(note.id, updatedContent);
        if (updated) {
          setNote(updated);
          onNoteChange(updated);
          setNoteChangeCounter((prev) => prev + 1);
          const now = Date.now();
          if (now - lastAutosaveToast.current > 4500) {
            pushToast({
              title: 'Autosynced',
              message: `Saved "${updated.title || 'Untitled Note'}"`,
              variant: 'success',
              duration: 2200,
            });
            lastAutosaveToast.current = now;
          }
        }
      }
    }, 1000),
    [note, onNoteChange]
  );

  // Handle editor content changes
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    debouncedSave(newContent);
  };

  // Manual save with Cmd/Ctrl + S
  const handleManualSave = useCallback(() => {
    if (note) {
      const updated = notesRepository.updateNote(note.id, editorContent);
      if (updated) {
        setNote(updated);
        onNoteChange(updated);
        setNoteChangeCounter((prev) => prev + 1);
        pushToast({
          title: 'Note Saved',
          message: `Saved "${updated.title || 'Untitled Note'}"`,
          variant: 'success',
        });
      }
    }
  }, [note, editorContent, onNoteChange]);

  useShortcut('s', true, handleManualSave);

  // Toggle preview with Cmd/Ctrl + P
  const togglePreview = useCallback(() => {
    setViewMode((prevMode) => {
      if (prevMode === 'edit') return 'preview';
      if (prevMode === 'preview') return 'split';
      return 'edit';
    });
  }, []);

  useShortcut('p', true, togglePreview);

  const handleCreateNewNoteShortcut = useCallback(() => {
    const newNote = notesRepository.createNote('Untitled Note');
    setCurrentNoteId(newNote.id);
    setNote(newNote);
    setEditorContent('');
    onNoteChange(newNote);
    setNoteChangeCounter((prev) => prev + 1);
    pushToast({
      title: 'New Note',
      message: 'Untitled Note drafted and ready.',
      variant: 'info',
    });
  }, [onNoteChange]);

  useShortcut('n', true, handleCreateNewNoteShortcut);

  const applyMarkdownFormatting = useCallback(
    (prefix: string, suffix: string) => {
      if (note) {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const selectedText = editorContent.substring(start, end);
          const newContent =
            editorContent.substring(0, start) +
            prefix +
            selectedText +
            suffix +
            editorContent.substring(end);
          setEditorContent(newContent);
          debouncedSave(newContent);
          // Restore selection after update
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
          }, 0);
        }
      }
    },
    [note, editorContent, debouncedSave]
  );

  const handleBoldShortcut = useCallback(() => {
    applyMarkdownFormatting('**', '**');
  }, [applyMarkdownFormatting]);

  const handleItalicShortcut = useCallback(() => {
    applyMarkdownFormatting('_', '_');
  }, [applyMarkdownFormatting]);

  useShortcut('b', true, handleBoldShortcut);
  useShortcut('i', true, handleItalicShortcut);

  const handleEscape = useCallback(() => {
    setCurrentNoteId('');
    setNote(null);
    setEditorContent('');
    onNoteChange(null);
    setNoteChangeCounter((prev) => prev + 1);
  }, [onNoteChange]);

  useShortcut('escape', false, handleEscape); // `false` for no meta key (Cmd/Ctrl)

  const handleSelectNote = useCallback((noteId: string) => {
    setCurrentNoteId(noteId);
  }, []);

  const handleCreateNewNote = useCallback(() => {
    const newNote = notesRepository.createNote('Untitled Note');
    setCurrentNoteId(newNote.id);
    setNote(newNote);
    setEditorContent('');
    onNoteChange(newNote);
    setNoteChangeCounter((prev) => prev + 1);
    pushToast({
      title: 'New Note',
      message: 'Untitled Note drafted and ready.',
      variant: 'info',
    });
  }, [onNoteChange]);

  const handleTitleBlur = () => {
    if (note) {
      const renamed = notesRepository.renameNote(note.id, note.title);
      setIsEditingTitle(false);
      if (renamed) {
        setNote(renamed);
        onNoteChange(renamed);
        setNoteChangeCounter((prev) => prev + 1);
        pushToast({
          title: 'Title Updated',
          message: `Now tracking as "${renamed.title || 'Untitled Note'}"`,
          variant: 'info',
        });
      }
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleTogglePin = useCallback(() => {
    if (note) {
      const updatedNote = notesRepository.togglePin(note.id);
      if (updatedNote) {
        setNote(updatedNote);
        onNoteChange(updatedNote);
        setNoteChangeCounter((prev) => prev + 1);
        pushToast({
          title: updatedNote.pinned ? 'Pinned' : 'Unpinned',
          message: updatedNote.pinned
            ? 'Note locked to quick access.'
            : 'Note released from quick access.',
          variant: 'info',
        });
      }
    }
  }, [note, onNoteChange]);

  const handleToggleArchive = useCallback(() => {
    if (note) {
      const updatedNote = notesRepository.toggleArchive(note.id);
      if (updatedNote) {
        setNote(updatedNote);
        onNoteChange(updatedNote);
        setNoteChangeCounter((prev) => prev + 1);
        pushToast({
          title: updatedNote.archived ? 'Archived' : 'Restored',
          message: updatedNote.archived
            ? 'Moved to archive. You can restore it anytime.'
            : 'Returned to active notes.',
          variant: updatedNote.archived ? 'warning' : 'success',
        });
      }
    }
  }, [note, onNoteChange]);

  const handleExportMarkdown = useCallback(() => {
    if (note) {
      const element = document.createElement('a');
      const file = new Blob([note.content], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${note.title}.md`;
      document.body.appendChild(element); // Required for Firefox
      element.click();
      document.body.removeChild(element); // Clean up
    }
  }, [note]);

  const handleExportHtml = useCallback(async () => {
    if (note) {
      const processedContent = await remark()
        .use(remarkHtml, { sanitize: true })
        .use(rehypeHighlight)
        .process(note.content);
      const html = `<!DOCTYPE html>\n<html>\n<head>\n<title>${note.title}</title>\n<meta charset="utf-8">\n</head>\n<body>\n${processedContent.toString()}\n</body>\n</html>`;

      const element = document.createElement('a');
      const file = new Blob([html], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = `${note.title}.html`;
      document.body.appendChild(element); // Required for Firefox
      element.click();
      document.body.removeChild(element); // Clean up
    }
  }, [note]);

  const handleFileDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const fileId = event.dataTransfer.getData('application/x-cyber-item');
      if (!fileId) return;
      const file = getItemById(fileId);
      if (!file || file.type !== 'file') return;
      const extension = file.metadata?.extension?.toLowerCase();
      if (extension !== 'md' && extension !== 'txt') return;

      try {
        const content = readFile(fileId);
        const noteTitle = file.name.replace(/\.(md|txt)$/i, '') || file.name;
        const existing = notesRepository
          .getAllNotes()
          .find((candidate) => candidate.title === noteTitle);
        const target = existing ?? notesRepository.createNote(noteTitle);
        const updated = notesRepository.updateNote(target.id, content);
        setCurrentNoteId(target.id);
        if (updated) {
          setNote(updated);
          setEditorContent(updated.content);
          onNoteChange(updated);
          setNoteChangeCounter((prev) => prev + 1);
          pushToast({
            title: 'Imported',
            message: `Pulled content from ${file.name}.`,
            variant: 'success',
          });
        }
      } catch (error) {
        console.error('Failed to import file into notes', error);
        pushToast({
          title: 'Import Failed',
          message: 'We could not read that file. Try again?',
          variant: 'error',
        });
      }
    },
    [getItemById, readFile, onNoteChange]
  );

  if (!note || currentNoteId === '') {
    return (
      <div
        className="flex h-full bg-gray-900 text-gray-50"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleFileDrop}
      >
        <NotesSidebar
          onSelectNote={handleSelectNote}
          activeNoteId={currentNoteId}
          onCreateNewNote={handleCreateNewNote}
          onNoteChange={noteChangeCounter}
        />
        <div className="flex flex-1 flex-col items-center justify-center text-xl text-gray-400">
          <p>Select a note from the sidebar or create a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full bg-gray-900 text-gray-50"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleFileDrop}
    >
      {isSidebarOpen && (
        <NotesSidebar
          key={noteChangeCounter} // Add key prop to force re-render
          onSelectNote={handleSelectNote}
          activeNoteId={currentNoteId}
          onCreateNewNote={handleCreateNewNote}
          onNoteChange={noteChangeCounter}
        />
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-700 p-2">
          <div className="mb-2 flex w-full items-center md:mb-0 md:w-auto">
            <button
              className="focus:ring-neon-blue focus:filter-neon-glow mr-2 rounded-md bg-gray-700 p-2 text-sm text-gray-300 transition-colors duration-200 hover:bg-gray-600 focus:ring-2 focus:outline-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
            </button>
            {note && currentNoteId !== '' ? (
              isEditingTitle ? (
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) =>
                    setNote((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  className="border-neon-green focus:border-neon-blue focus:filter-neon-glow text-neon-green border-b bg-transparent text-xl font-bold focus:outline-none"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-neon-green cursor-pointer text-xl font-bold"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {note.title}
                </h1>
              )
            ) : (
              <h1 className="text-neon-green text-xl font-bold">Notes</h1>
            )}
          </div>
          <div className="mt-2 flex w-full flex-wrap justify-end gap-2 space-x-2 md:mt-0 md:w-auto">
            <button
              className="focus:ring-neon-blue focus:filter-neon-glow rounded-md bg-gray-700 px-2 py-1 text-sm text-gray-300 transition-colors duration-200 hover:bg-gray-600 focus:ring-2 focus:outline-none"
              onClick={handleTogglePin}
            >
              {note.pinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              className="rounded-md bg-red-700 px-2 py-1 text-sm text-white transition-colors duration-200 hover:bg-red-600"
              onClick={handleToggleArchive}
            >
              {note.archived ? 'Restore' : 'Delete'}
            </button>
            <button
              className="focus:ring-neon-blue focus:filter-neon-glow rounded-md bg-gray-700 px-2 py-1 text-sm text-gray-300 transition-colors duration-200 hover:bg-gray-600 focus:ring-2 focus:outline-none"
              onClick={handleExportMarkdown}
            >
              Export MD
            </button>
            <button
              className="focus:ring-neon-blue focus:filter-neon-glow rounded-md bg-gray-700 px-2 py-1 text-sm text-gray-300 transition-colors duration-200 hover:bg-gray-600 focus:ring-2 focus:outline-none"
              onClick={handleExportHtml}
            >
              Export HTML
            </button>
            <button
              className={`rounded-md px-3 py-1 text-sm ${viewMode === 'edit' ? 'bg-neon-blue filter-neon-glow text-white' : 'bg-gray-700 text-gray-300'} focus:ring-neon-blue focus:filter-neon-glow focus:ring-2 focus:outline-none`}
              onClick={() => setViewMode('edit')}
            >
              Edit
            </button>
            <button
              className={`rounded-md px-3 py-1 text-sm ${viewMode === 'preview' ? 'bg-neon-blue filter-neon-glow text-white' : 'bg-gray-700 text-gray-300'} focus:ring-neon-blue focus:filter-neon-glow focus:ring-2 focus:outline-none`}
              onClick={() => setViewMode('preview')}
            >
              Preview
            </button>
            <button
              className={`hidden rounded-md px-3 py-1 text-sm xl:block ${viewMode === 'split' ? 'bg-neon-blue filter-neon-glow text-white' : 'bg-gray-700 text-gray-300'} focus:ring-neon-blue focus:filter-neon-glow focus:ring-2 focus:outline-none`}
              onClick={() => setViewMode('split')}
            >
              Split
            </button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden transition-all duration-300 ease-in-out">
          {(viewMode === 'edit' || viewMode === 'split') && (
            <textarea
              className={`focus:ring-neon-blue focus:filter-neon-glow flex-1 resize-none border-r border-gray-700 bg-gray-800 p-4 font-mono text-sm focus:ring-2 focus:outline-none ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}
              value={editorContent}
              onChange={handleEditorChange}
              placeholder="Start writing your note..."
            />
          )}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`flex-1 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <MarkdownPreview content={editorContent} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
