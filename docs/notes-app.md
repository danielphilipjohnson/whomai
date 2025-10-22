# Notes App Architecture & QA Guide

## Overview
The Notes workspace is a windowed React experience that integrates tightly with the Cyberpunk OS shell. Notes are persisted to `localStorage` via the singleton `notesRepository`, surfaced through the `NotesApp` window, and can be created or opened from auxiliary surfaces such as the File Explorer or terminal commands.

## Architecture
- **Data layer**: `notesRepository` encapsulates CRUD operations, import/export logic, and persistence. It exposes synchronous helpers so window and terminal flows remain deterministic during autosave.
- **Window payloads**: The window store keeps the active note’s `id`/`title`. `NotesApp` reports every mutation via `onNoteChange`, and the desktop uses `updateWindowPayload` to keep window metadata aligned.
- **UI composition**: `NotesApp` orchestrates the sidebar, markdown editor, and preview. Shared store hooks (`useFileSystemStore`, `useShortcut`) drive drag-and-drop imports, keyboard shortcuts, and cross-window automation.
- **Feedback loop**: Console logging has been replaced by the `useToastStore` neon notifications. Autosaves, manual saves, imports, and archive actions emit contextual toasts so users get immediate reassurance.
- **Integrations**:
  - File Explorer pipes markdown files through the repository before opening a Notes window.
  - Terminal commands (`notes open`, `notes new`, etc.) reuse the same repository to ensure consistent state.

## Testing Strategy
- Unit coverage for repository behaviors: create/update/import, pin/archive, delete, and reload flows.
- Integration coverage for `NotesApp`: autosave, manual save shortcut, sidebar creation, view toggles, rename/pin/archive interactions.
- File Explorer integration test: markdown import success, unsupported extension alert, and read failures.
- `npm run test` executes all Vitest suites with jsdom and mocked peripheral hooks.

## QA Checklist
- [ ] Launch Notes from the desktop and confirm a toast appears when creating a note.
- [ ] Type content and wait for the autosave toast; refresh the window to confirm persistence.
- [ ] Use Cmd/Ctrl + S to trigger the manual save toast.
- [ ] Rename a note, then pin and archive it; ensure window title and toast feedback update accordingly.
- [ ] Drag an `.md` file from File Explorer into Notes; contents should import and toast.
- [ ] Run `notes open "<title>"` in the terminal; the window should focus the matching note.
- [ ] Export markdown and HTML; verify the downloads contain current content.

## Deployment & Demo Tips
1. **Install dependencies**: `npm install`
2. **Run tests**: `npm run test`
3. **Lint**: `npm run lint`
4. **Build**: `npm run build`
5. **Serve production bits**: `npm run start`
