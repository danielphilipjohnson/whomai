import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileExplorerApp from '@/components/apps/file-explorer/FileExplorerApp';
import { notesRepository } from '@/lib/notesRepository';

const STORAGE_KEY = 'cyberpunk-os-notes';

const { openWindowMock, fileSystemState, resetFileSystemState } = vi.hoisted(() => {
  const createRoot = () => ({
    id: 'root',
    name: '/',
    type: 'folder' as const,
    parentId: null,
    path: '/',
    createdAt: 0,
    updatedAt: 0,
  });

  const createMarkdownFile = () => ({
    id: 'file-1',
    name: 'note.md',
    type: 'file' as const,
    parentId: 'root',
    path: '/note.md',
    createdAt: 0,
    updatedAt: 0,
    metadata: { extension: 'md' },
  });

  const state = {
    initialize: vi.fn(),
    items: {
      root: createRoot(),
      'file-1': createMarkdownFile(),
    },
    currentDirectoryId: 'root',
    currentPath: '/',
    expandedIds: new Set<string>(),
    setExpanded: vi.fn(),
    setCurrentDirectoryById: vi.fn(),
    setSelection: vi.fn(),
    selectedIds: [] as string[],
    clearSelection: vi.fn(),
    createItemInCurrent: vi.fn(),
    deleteItems: vi.fn(),
    renameItem: vi.fn(),
    moveItem: vi.fn(),
    refresh: vi.fn(),
    setSearchQuery: vi.fn(),
    searchItems: vi.fn().mockReturnValue([] as unknown[]),
    readFile: vi.fn().mockReturnValue('# Heading\nBody'),
    restoreItem: vi.fn(),
    isInTrash: vi.fn().mockReturnValue(false),
    searchQuery: '',
  };

  const reset = () => {
    state.initialize.mockClear();
    state.setExpanded.mockClear();
    state.setCurrentDirectoryById.mockClear();
    state.setSelection.mockClear();
    state.clearSelection.mockClear();
    state.createItemInCurrent.mockClear();
    state.deleteItems.mockClear();
    state.renameItem.mockClear();
    state.moveItem.mockClear();
    state.refresh.mockClear();
    state.setSearchQuery.mockClear();
    state.searchItems.mockReset();
    state.searchItems.mockReturnValue([]);
    state.readFile.mockReset();
    state.readFile.mockReturnValue('# Heading\nBody');
    state.restoreItem.mockClear();
    state.isInTrash.mockReset();
    state.isInTrash.mockReturnValue(false);
    state.items = {
      root: createRoot(),
      'file-1': createMarkdownFile(),
    };
    state.currentDirectoryId = 'root';
    state.currentPath = '/';
    state.expandedIds = new Set<string>();
    state.selectedIds = [];
    state.searchQuery = '';
  };

  return {
    openWindowMock: vi.fn(),
    fileSystemState: state,
    resetFileSystemState: reset,
  };
});

vi.mock('framer-motion', () => ({
  __esModule: true,
  AnimatePresence: ({ children }: { children: any }) => <>{children}</>,
  motion: {
    div: ({ children, ...rest }: { children: any }) => <div {...rest}>{children}</div>,
  },
}));

vi.mock('@/store/useWindowStore', () => ({
  useWindowStore: (selector: (state: { openWindow: typeof openWindowMock }) => unknown) =>
    selector({ openWindow: openWindowMock }),
}));

vi.mock('@/store/useFileSystemStore', () => ({
  useFileSystemStore: (
    selector: (state: typeof fileSystemState) => unknown,
    _equalityFn?: unknown
  ) => selector(fileSystemState),
}));

vi.mock('@/components/apps/file-explorer/components/Toolbar', () => ({
  Toolbar: () => <div data-testid="toolbar" />,
}));

vi.mock('@/components/apps/file-explorer/components/BreadcrumbsBar', () => ({
  BreadcrumbsBar: () => <div data-testid="breadcrumbs" />,
}));

vi.mock('@/components/apps/file-explorer/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar" />,
}));

vi.mock('@/components/apps/file-explorer/components/SearchResultsPanel', () => ({
  SearchResultsPanel: () => <div data-testid="search-results" />,
}));

vi.mock('@/components/apps/file-explorer/components/PropertiesPanel', () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock('@/components/apps/file-explorer/components/MainPanel', () => ({
  MainPanel: (props: any) => (
    <div data-testid="main-panel">
      {props.items.map((item: any) => (
        <button key={item.id} onClick={() => props.onOpen(item)}>
          open-{item.name}
        </button>
      ))}
    </div>
  ),
}));

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
let consoleLogSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  window.localStorage.removeItem(STORAGE_KEY);
  notesRepository.reloadNotes();
  openWindowMock.mockReset();
  resetFileSystemState();
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
  consoleLogSpy.mockRestore();
});

describe('FileExplorerApp window/file-system sync', () => {
  it('opens a markdown file in the notes window and syncs content', async () => {
    const fileContent = '# Imported\nCyber note';
    fileSystemState.readFile.mockReturnValue(fileContent);

    const user = userEvent.setup();

    render(<FileExplorerApp />);

    await user.click(screen.getByText('open-note.md'));

    const notes = notesRepository.getAllNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe('note');
    expect(notes[0].content).toBe(fileContent);

    expect(openWindowMock).toHaveBeenCalledWith(
      'notes',
      expect.objectContaining({
        id: notes[0].id,
        title: 'note',
      })
    );
  });

  it('shows an alert for unsupported file types without mutating notes', async () => {
    fileSystemState.items = {
      root: fileSystemState.items.root,
      'file-2': {
        ...fileSystemState.items['file-1'],
        id: 'file-2',
        name: 'log.txt',
        path: '/log.txt',
        metadata: { extension: 'txt' },
      },
    } as any;

    const user = userEvent.setup();

    render(<FileExplorerApp />);

    await user.click(screen.getByText('open-log.txt'));

    expect(notesRepository.getAllNotes()).toHaveLength(0);
    expect(openWindowMock).toHaveBeenCalledWith(
      'systemAlert',
      expect.objectContaining({
        severity: 'warning',
      })
    );
  });

  it('surfaces read failures via system alert', async () => {
    fileSystemState.readFile.mockImplementation(() => {
      throw new Error('boom');
    });

    const user = userEvent.setup();

    render(<FileExplorerApp />);

    await user.click(screen.getByText('open-note.md'));

    expect(openWindowMock).toHaveBeenCalledWith(
      'systemAlert',
      expect.objectContaining({
        severity: 'error',
      })
    );
  });
});
