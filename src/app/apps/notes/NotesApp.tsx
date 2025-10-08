import React, { useState, useEffect, useCallback } from 'react';
import { notesRepository } from '@/lib/notesRepository';
import { Note } from '@/lib/notes';
import { useShortcut } from '@/hooks/useShortcut';
import { debounce } from 'lodash';
import MarkdownPreview from './MarkdownPreview';
import NotesSidebar from './NotesSidebar';

type ViewMode = 'edit' | 'preview' | 'split';

interface NotesAppProps {
  id: string;
  title: string;
  onNoteChange: () => void; // New prop
}

const NotesApp: React.FC<NotesAppProps> = ({ id, title, onNoteChange }) => {
  const [currentNoteId, setCurrentNoteId] = useState<string>(id);
  const [note, setNote] = useState<Note | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [shouldFocusSearch, setShouldFocusSearch] = useState<boolean>(false);

  // Load note on initial mount or when currentNoteId changes
  useEffect(() => {
    let fetchedNote = notesRepository.getNoteById(currentNoteId);
    if (!fetchedNote) {
      // If no note exists for this ID, create a new one (this might happen if the window is opened for a new note)
      fetchedNote = notesRepository.createNote(title);
      setCurrentNoteId(fetchedNote.id); // Update the currentNoteId to the new note's ID
    }
    setNote(fetchedNote);
    setEditorContent(fetchedNote.content);
  }, [currentNoteId, title]);

  // Debounced autosave
  const debouncedSave = useCallback(
    debounce((updatedContent: string) => {
      if (note) {
        notesRepository.updateNote(note.id, updatedContent);
        setNote((prevNote) => prevNote ? { ...prevNote, content: updatedContent, updatedAt: Date.now() } : null);
        onNoteChange(); // Notify parent of change
        console.log('Note autosaved!', note.id);
      }
    }, 1000), // Save after 1 second of inactivity
    [note]
  );

  // Handle editor content changes
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditorContent(newContent);
    debouncedSave(newContent);
  };

  // Manual save with Cmd/Ctrl + S
  const handleManualSave = useCallback(() => {
    if (note && editorContent) {
      notesRepository.updateNote(note.id, editorContent);
      setNote((prevNote) => prevNote ? { ...prevNote, content: editorContent, updatedAt: Date.now() } : null);
      onNoteChange(); // Notify parent of change
      console.log('Note manually saved!', note.id);
    }
  }, [note, editorContent]);

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
    onNoteChange(); // Notify parent of change
  }, []);

  useShortcut('n', true, handleCreateNewNoteShortcut);

  const applyMarkdownFormatting = useCallback((prefix: string, suffix: string) => {
    if (note) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = editorContent.substring(start, end);
        const newContent = editorContent.substring(0, start) + prefix + selectedText + suffix + editorContent.substring(end);
        setEditorContent(newContent);
        debouncedSave(newContent);
        // Restore selection after update
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
      }
    }
  }, [note, editorContent, debouncedSave]);

  const handleBoldShortcut = useCallback(() => {
    applyMarkdownFormatting('**', '**');
  }, [applyMarkdownFormatting]);

  const handleItalicShortcut = useCallback(() => {
    applyMarkdownFormatting('_', '_');
  }, [applyMarkdownFormatting]);

  useShortcut('b', true, handleBoldShortcut);
  useShortcut('i', true, handleItalicShortcut);

  const handleFocusSearch = useCallback(() => {
    setShouldFocusSearch(true);
    setTimeout(() => setShouldFocusSearch(false), 100);
  }, []);

  useShortcut('f', true, handleFocusSearch);

  const handleEscape = useCallback(() => {
    setCurrentNoteId(''); // Deselect the current note
    onNoteChange(); // Notify parent of change
  }, []);

  useShortcut('escape', false, handleEscape); // `false` for no meta key (Cmd/Ctrl)

  const handleSelectNote = useCallback((noteId: string) => {
    setCurrentNoteId(noteId);
  }, []);

  const handleCreateNewNote = useCallback(() => {
    const newNote = notesRepository.createNote('Untitled Note');
    setCurrentNoteId(newNote.id);
    onNoteChange(); // Notify parent of change
  }, []);

  const handleTitleBlur = () => {
    if (note) {
      notesRepository.renameNote(note.id, note.title);
      setIsEditingTitle(false);
      onNoteChange(); // Notify parent of change
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
        onNoteChange(); // Notify parent of change
      }
    }
  }, [note]);

  const handleToggleArchive = useCallback(() => {
    if (note) {
      const updatedNote = notesRepository.toggleArchive(note.id);
      if (updatedNote) {
        setNote(updatedNote);
        onNoteChange(); // Notify parent of change
      }
    }
  }, [note]);

  const handleExportMarkdown = useCallback(() => {
    if (note) {
      const element = document.createElement("a");
      const file = new Blob([note.content], { type: "text/markdown" });
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

      const element = document.createElement("a");
      const file = new Blob([html], { type: "text/html" });
      element.href = URL.createObjectURL(file);
      element.download = `${note.title}.html`;
      document.body.appendChild(element); // Required for Firefox
      element.click();
      document.body.removeChild(element); // Clean up
    }
  }, [note]);

  if (!note) {
    return <div className="p-4 text-gray-400">Loading note...</div>;
  }

  return (
    <div className="flex h-full bg-gray-900 text-gray-50">
      <NotesSidebar
        onSelectNote={handleSelectNote}
        activeNoteId={currentNoteId}
        onCreateNewNote={handleCreateNewNote}
        focusSearchInput={shouldFocusSearch}
        onNoteChange={onNoteChange} // Pass the callback to NotesSidebar
      />
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center p-2 border-b border-gray-700">
          {isEditingTitle ? (
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote((prev) => prev ? { ...prev, title: e.target.value } : null)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="bg-transparent border-b border-neon-green focus:outline-none focus:border-neon-blue focus:filter-neon-glow text-xl font-bold text-neon-green"
              autoFocus
            />
          ) : (
            <h1 className="text-xl font-bold text-neon-green cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              {note.title}
            </h1>
          )}
          <div className="flex space-x-2">
            <button
              className="px-2 py-1 rounded-md text-sm bg-red-700 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-neon-red focus:filter-neon-glow transition-colors duration-200"
              onClick={handleToggleArchive}
            >
              {note.archived ? 'Restore' : 'Delete'}
            </button>
            <button
              className="px-2 py-1 rounded-md text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow transition-colors duration-200"
              onClick={handleExportMarkdown}
            >
              Export MD
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'edit' ? 'bg-neon-blue text-white filter-neon-glow' : 'bg-gray-700 text-gray-300'} focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow`}
              onClick={() => setViewMode('edit')}
            >
              Edit
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'preview' ? 'bg-neon-blue text-white filter-neon-glow' : 'bg-gray-700 text-gray-300'} focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow`}
              onClick={() => setViewMode('preview')}
            >
              Preview
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${viewMode === 'split' ? 'bg-neon-blue text-white filter-neon-glow' : 'bg-gray-700 text-gray-300'} focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow`}
              onClick={() => setViewMode('split')}
            >
              Split
            </button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden transition-all duration-300 ease-in-out">
          {(viewMode === 'edit' || viewMode === 'split') && (
            <textarea
              className={`flex-1 p-4 bg-gray-800 border-r border-gray-700 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:filter-neon-glow font-mono text-sm resize-none ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}
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