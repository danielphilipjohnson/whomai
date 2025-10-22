# **Epic: Notes App — Markdown Editor (Cyberpunk OS)**

Goal:

Build a fully functional Markdown-based Notes App that integrates into the Cyberpunk OS environment with window management, autosave, live preview, and terminal commands.

# **1. Notes App: Initial Scaffolding**

Description:

Create the base React component and route for the Notes app. Integrate it into the OS window manager and app launcher.

Acceptance Criteria:

- A NotesApp component exists under /apps/notes/.
- It renders inside a draggable OS window.
- The Notes app can be opened via the app launcher.
- Window title shows “Notes.”
- Component includes placeholder text: “No notes yet.”

# **2. Notes App: Data Model & Storage Layer**

Description:

Define the data model for notes and create a storage service with CRUD operations.

Acceptance Criteria:

- A Note type/interface is defined with id, title, content, tags, pinned, archived, createdAt, updatedAt.
- A NotesRepository provides:
    - createNote(title)
    - updateNote(id, content)
    - deleteNote(id)
    - getAllNotes()
    - getNoteById(id)
- 
- Data is persisted in localStorage.
- Repository methods are tested.

# **3. Notes App: Editor Component**

Description:

Implement the markdown editor component with basic text editing capabilities.

Acceptance Criteria:

- Textarea or CodeMirror-based editor.
- User can edit note content.
- Autosave (debounced) to localStorage.
- Editor updates the note’s updatedAt timestamp.
- Keyboard shortcuts: Cmd/Ctrl + S triggers save.
- Editor uses monospace font and system theme colors.

# **4. Notes App: Live Markdown Preview**

Description:

Add live markdown preview with sanitized rendering and syntax highlighting.

Acceptance Criteria:

- Preview panel shows rendered markdown for the current note.
- Uses markdown parser (remark/markdown-it).
- Code blocks are syntax highlighted.
- External links open in a new tab.
- Toggle button switches between Edit / Preview / Split view.

# **5. Notes App: Notes List & Navigation**

Description:

Add sidebar with a searchable list of notes.

Acceptance Criteria:

- Sidebar displays note titles sorted by updatedAt.
- “New Note” button creates a blank note.
- Clicking a note loads it into the editor.
- Search input filters notes by title/content.
- Highlight active note in sidebar.

# **6. Notes App: Note Metadata & Actions**

Description:

Enable note renaming, pinning, deleting, and archiving.

Acceptance Criteria:

- Rename note inline by clicking the title.
- Pin/unpin notes; pinned appear at the top.
- Delete button soft-deletes to archive.
- Archive section accessible via filter.
- Actions are persisted between sessions.

# **7. Notes App: Export & Import**

Description:

Allow users to export/import markdown notes.

Acceptance Criteria:

- Export current note as .md or .html.
- Import .md file via drag & drop or file selector.
- Imported notes are added to repository.
- Validate imports (max size, safe characters).
- Export preserves note title and metadata.

# **8. Notes App: Keyboard Shortcuts**

Description:

Add productivity shortcuts for common actions.

Acceptance Criteria:

| **Shortcut** | **Action** |
| --- | --- |
| Cmd/Ctrl + N | Create new note |
| Cmd/Ctrl + S | Save |
| Cmd/Ctrl + P | Toggle preview |
| Cmd/Ctrl + B | Bold text insertion |
| Cmd/Ctrl + I | Italic text insertion |
| Cmd/Ctrl + F | Search notes |
| Esc | Deselect or close modals |

# **9. Notes App: Terminal Integration**

Description:

Expose commands in the terminal that interact with the Notes app.

Acceptance Criteria:

| **Command** | **Effect** |
| --- | --- |
| notes open <title> | Opens or creates a note window |
| notes list | Lists all notes |
| notes new "<title>" | Creates a new note |
| notes delete "<title>" | Deletes or archives a note |
| notes search "<query>" | Returns list of matches |
| `notes export “” md | html` |
| notes today | Creates daily note for current date |
- Each command uses the NotesRepository API.
- Terminal prints responses with styled text.

# **10. Notes App: Styling & Theme Integration**

Description:

Match the Cyberpunk OS aesthetic with neon borders, glitch highlights, and responsive layout.

Acceptance Criteria:

- Editor, preview, and sidebar themed via Tailwind variables.
- Neon focus borders on active elements.
- Dark mode default, theme aware (reacts to OS theme).
- CSS grid layout with adjustable panels.
- Smooth transitions between Edit and Preview modes.

# **11. Notes App: Persistence & Recovery**

Description:

Ensure session persistence and autosave recovery.

Acceptance Criteria:

- Notes remain available after refresh.
- If unsaved edits exist, app restores them on reopen.
- LocalStorage cleanup for deleted notes.
- Optional version history (store last 3 autosave snapshots).

# **12. Notes App: Testing & QA**

Description:

Write integration tests and manual QA checklist.

Acceptance Criteria:

- Unit tests for repository functions.
- Integration tests for creating/editing notes.
- Manual test checklist:
    - Create, edit, delete note.
    - Refresh page: note persists.
    - Export/import works.
    - Keyboard shortcuts function.
    - Terminal commands open notes.
    - Styling consistent across themes.









