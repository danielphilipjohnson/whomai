import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotesApp from '@/components/apps/notes/NotesApp';
import { notesRepository } from '@/lib/notesRepository';

type ShortcutRegistration = {
  key: string;
  metaKey: boolean;
  callback: () => void;
};

const { getItemByIdMock, readFileMock, shortcutRegistry } = vi.hoisted(() => ({
  getItemByIdMock: vi.fn(),
  readFileMock: vi.fn(),
  shortcutRegistry: [] as ShortcutRegistration[],
}));

vi.mock('@/hooks/useShortcut', () => ({
  useShortcut: (key: string, metaKey: boolean, callback: () => void) => {
    shortcutRegistry.push({ key, metaKey, callback });
  },
}));

vi.mock('lodash', () => ({
  debounce: (fn: any) => {
    const wrapped: any = (...args: any[]) => fn(...args);
    wrapped.cancel = () => {};
    wrapped.flush = () => {};
    return wrapped;
  },
}));

vi.mock('@/components/apps/notes/MarkdownPreview', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => (
    <div data-testid="markdown-preview">{content}</div>
  ),
}));

vi.mock('@/components/apps/notes/NotesSidebar', () => ({
  __esModule: true,
  default: ({
    onCreateNewNote,
    onSelectNote,
  }: {
    onCreateNewNote: () => void;
    onSelectNote: (id: string) => void;
  }) => (
    <aside data-testid="notes-sidebar">
      <button onClick={onCreateNewNote}>New Note</button>
      <button onClick={() => onSelectNote('sidebar-note-id')}>Select Existing</button>
    </aside>
  ),
}));

vi.mock('@/store/useFileSystemStore', () => ({
  useFileSystemStore: (
    selector: (state: {
      getItemById: typeof getItemByIdMock;
      readFile: typeof readFileMock;
    }) => unknown
  ) => {
    const state = {
      getItemById: getItemByIdMock,
      readFile: readFileMock,
    };
    return selector(state);
  },
}));

const STORAGE_KEY = 'cyberpunk-os-notes';

let consoleLogSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  window.localStorage.removeItem(STORAGE_KEY);
  notesRepository.reloadNotes();
  getItemByIdMock.mockReset();
  readFileMock.mockReset();
  shortcutRegistry.length = 0;
});

afterEach(() => {
  consoleLogSpy.mockRestore();
});

describe('NotesApp workspace', () => {
  it('loads the current note and auto-saves edits', async () => {
    const note = notesRepository.createNote('Existing Note');
    notesRepository.updateNote(note.id, 'Original content');
    const onNoteChange = vi.fn();

    const user = userEvent.setup();

    render(<NotesApp id={note.id} title={note.title} onNoteChange={onNoteChange} />);

    const editor = await screen.findByPlaceholderText('Start writing your note...');
    expect(editor).toHaveValue('Original content');

    const initialCall = onNoteChange.mock.calls.at(-1)?.[0];
    expect(initialCall).toMatchObject({ id: note.id, content: 'Original content' });

    await user.type(editor, ' updated');

    const saved = notesRepository.getNoteById(note.id);
    expect(saved?.content).toBe('Original content updated');
    const finalCall = onNoteChange.mock.calls.at(-1)?.[0];
    expect(finalCall).toMatchObject({ id: note.id, content: 'Original content updated' });
  });

  it('registers manual save shortcut and persists on invocation', async () => {
    const note = notesRepository.createNote('Shortcut Note');
    const onNoteChange = vi.fn();
    const updateSpy = vi.spyOn(notesRepository, 'updateNote');

    const user = userEvent.setup();

    render(<NotesApp id={note.id} title={note.title} onNoteChange={onNoteChange} />);

    const editor = await screen.findByPlaceholderText('Start writing your note...');
    await user.clear(editor);
    await user.type(editor, 'Keyboard save content');

    onNoteChange.mockClear();
    updateSpy.mockClear();

    const shortcut = [...shortcutRegistry]
      .reverse()
      .find((entry) => entry.key === 's' && entry.metaKey);
    expect(shortcut).toBeDefined();
    act(() => {
      shortcut?.callback();
    });

    expect(updateSpy).toHaveBeenCalledWith(note.id, 'Keyboard save content');
    const manualCall = onNoteChange.mock.calls.at(-1)?.[0];
    expect(manualCall).toMatchObject({ id: note.id, content: 'Keyboard save content' });

    updateSpy.mockRestore();
  });

  it('creates a new note through the sidebar action', async () => {
    const onNoteChange = vi.fn();

    const user = userEvent.setup();

    render(<NotesApp id="notes" title="Notes" onNoteChange={onNoteChange} />);

    expect(onNoteChange.mock.calls[0]?.[0]).toBeNull();
    onNoteChange.mockClear();

    await user.click(screen.getByText('New Note'));

    const notes = notesRepository.getAllNotes();
    expect(notes).toHaveLength(1);
    const created = onNoteChange.mock.calls.at(-1)?.[0];
    expect(created).toMatchObject({ title: 'Untitled Note' });

    const editor = await screen.findByPlaceholderText('Start writing your note...');
    expect(editor).toHaveValue('');
    expect(screen.getByText('Untitled Note')).toBeInTheDocument();
  });

  it('switches between editor and preview modes via toolbar buttons', async () => {
    const note = notesRepository.createNote('View Modes');
    notesRepository.updateNote(note.id, 'Content');

    const onNoteChange = vi.fn();
    const user = userEvent.setup();

    render(<NotesApp id={note.id} title={note.title} onNoteChange={onNoteChange} />);

    expect(await screen.findByPlaceholderText('Start writing your note...')).toBeInTheDocument();
    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();

    await user.click(screen.getByText('Preview'));
    expect(screen.queryByPlaceholderText('Start writing your note...')).not.toBeInTheDocument();
    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();

    await user.click(screen.getByText('Edit'));
    expect(screen.getByPlaceholderText('Start writing your note...')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-preview')).not.toBeInTheDocument();
  });

  it('renames notes inline and toggles pin/archive state', async () => {
    const note = notesRepository.createNote('Inline Title');
    const onNoteChange = vi.fn();
    const user = userEvent.setup();

    render(<NotesApp id={note.id} title={note.title} onNoteChange={onNoteChange} />);

    onNoteChange.mockClear();

    const titleHeading = await screen.findByText('Inline Title');
    await user.click(titleHeading);

    const titleInput = screen.getByDisplayValue('Inline Title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');
    fireEvent.blur(titleInput);

    expect(notesRepository.getNoteById(note.id)?.title).toBe('Updated Title');
    expect(screen.getByText('Updated Title')).toBeInTheDocument();

    const pinButton = screen.getByText('Pin');
    await user.click(pinButton);
    expect(screen.getByText('Unpin')).toBeInTheDocument();
    expect(notesRepository.getNoteById(note.id)?.pinned).toBe(true);

    const archiveButton = screen.getByText('Delete');
    await user.click(archiveButton);
    expect(screen.getByText('Restore')).toBeInTheDocument();
    expect(notesRepository.getNoteById(note.id)?.archived).toBe(true);

    const calls = onNoteChange.mock.calls.map(([payload]) => payload);
    expect(calls[0]).toMatchObject({ title: 'Updated Title' });
    expect(calls[1]).toMatchObject({ pinned: true });
    expect(calls[2]).toMatchObject({ archived: true });
  });
});
