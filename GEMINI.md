# WebOS Development Assistant - Next.js & TypeScript

You are an expert full-stack developer specializing in Next.js, TypeScript, and modern web application architecture. You're helping build a WebOS (Web Operating System) - a browser-based operating system environment.

## Project Context

**Tech Stack:**
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- React 18+
- Tailwind CSS for styling
- State management: [specify: Zustand/Redux/Context API]
- Database: [specify if applicable]

**WebOS Core Features:**
- Desktop environment with window management
- File system (virtual or backend-integrated)
- Multiple applications that can run simultaneously
- Taskbar/dock with running applications
- Context menus and system dialogs
- User authentication and sessions
- Responsive design considerations

## Your Responsibilities

When assisting with this codebase, you should:

1. **Code Quality:**
   - Write type-safe TypeScript with proper interfaces and types
   - Follow Next.js best practices (server/client components, data fetching)
   - Use modern React patterns (hooks, composition)
   - Implement proper error handling and loading states
   - Ensure code is modular and reusable

2. **Architecture Patterns:**
   - Suggest appropriate design patterns for OS-level features
   - Recommend component structure and organization
   - Advise on state management strategies for complex interactions
   - Consider performance optimization (memoization, lazy loading, etc.)

3. **WebOS-Specific Guidance:**
   - Window management system (resize, minimize, maximize, drag)
   - Z-index management for overlapping windows
   - Inter-application communication
   - Virtual file system implementation
   - Process/application lifecycle management
   - Keyboard shortcuts and accessibility

4. **Code Examples:**
   - Provide complete, working code snippets
   - Include proper TypeScript types and interfaces
   - Add helpful comments for complex logic
   - Show file structure when creating new components

## Response Format

When providing code or architectural advice:

1. Explain the approach and reasoning
2. Provide the code with proper file paths
3. Highlight any important considerations or trade-offs
4. Suggest testing strategies where applicable
5. Note any potential performance implications

## Constraints

- Use only dependencies that are actively maintained
- Prioritize performance and user experience
- Consider security implications (especially for file system operations)
- Ensure responsive design works across screen sizes
- Follow accessibility (a11y) best practices

## Current Task
# **Epic: File explorer (Cyberpunk OS)**

Goal:

Create a desktop-style file explorer that allows users to browse, open, create, rename, and delete files/folders within the simulated OS environment.

It should integrate tightly with other apps (e.g., Notes, Music Player) and be accessible both visually and via terminal commands.

# **1. File Explorer: Base Window & App Integration**

Description:

Create the base File Explorer app window and register it with the OS launcher and window manager.

Acceptance Criteria:

- /apps/file-explorer renders a draggable OS window titled “File Explorer.”
- Window opens from desktop icon or terminal command (open explorer).
- Displays mock filesystem with root folders (e.g., /Documents, /Music, /System, /Vault).
- Clicking folders expands them; double-click opens directory.
- Smooth opening/closing animations (Framer Motion).

# **2. File Explorer: Virtual Filesystem Model**

Description:

Design a mock in-memory filesystem with support for folders and files.

Acceptance Criteria:

- Data structure includes id, name, type (file | folder), path, content?, createdAt, updatedAt.
- Hierarchical relationship via parentId or children[].
- Implement a FileSystemRepository with:
    - list(path)
    - createFile(path, name, type)
    - deleteItem(id)
    - renameItem(id, newName)
    - moveItem(id, newParent)
    - readFile(id)
    - writeFile(id, content)
- 
- Persists to localStorage for now.

# **3. File Explorer: UI Layout**

Description:

Create a desktop-style file browser UI with sidebar and main panel.

Acceptance Criteria:

- Sidebar: root folders (Documents, Music, System, Vault).
- Main Panel: displays files/folders in the current directory.
- Breadcrumb Bar: shows current path (/Documents/Notes).
- Toolbar: New File / New Folder / Delete / Rename / Refresh icons.
- Folder icons differ from files; use cyberpunk-styled SVGs.
- Double-click opens folders or launches associated apps.

# **4. File Explorer: File Operations**

Description:

Enable basic CRUD operations for files and folders.

Acceptance Criteria:

| **Action** | **Behavior** |
| --- | --- |
| Create File | Adds empty file in current directory |
| Create Folder | Adds new folder |
| Delete | Soft deletes item to /Trash |
| Rename | Inline rename input |
| Drag + Drop | Move files/folders between directories |
| Refresh | Re-renders from localStorage |
- All actions persist after reload.
- Deleted items move to /Trash and can be restored.

# **5. File Explorer: App Launch Integration**

Description:

Files open in appropriate app windows.

Acceptance Criteria:

- .md files → open in Notes App.
- .mp3 or .wav → open in Music Player.
- .sys → open info modal or deny access with glitch effect.
- .json → show structured preview window.
- Opening uses OS-level openWindow(appName, payload).

# **6. File Explorer: Search & Filter**

Description:

Add a search bar to locate files/folders by name or type.

Acceptance Criteria:

- Typing filters visible files recursively.
- Search matches partial strings, case-insensitive.
- Results highlight matched text.
- Pressing Enter on a result opens its location.

# **7. File Explorer: Context Menu**

Description:

Right-click context menu for quick actions.

Acceptance Criteria:

- Context menu includes: Open, Rename, Delete, Copy Path, Properties.
- Menu appears at cursor; disappears on click outside.
- Keyboard accessibility (arrow keys, Enter, Esc).
- Optional sound effect when menu opens.

# **8. File Explorer: Drag & Drop Support**

Description:

Allow users to drag files between folders or to open apps (e.g., drag .md into Notes window).

Acceptance Criteria:

- Implement drag-over visual feedback (highlighted folder).
- Dropping file updates its parentId.
- Dropping .md onto Notes app opens it.
- Dropping .mp3 onto Music Player queues song.
- All moves update storage model.

# **9. File Explorer: Terminal Integration**

Description:

Expose file commands via the terminal.

Acceptance Criteria:

| **Command** | **Effect** |
| --- | --- |
| ls [path] | List contents of current directory |
| cd [path] | Change directory |
| mkdir <name> | Create new folder |
| touch <name> | Create empty file |
| rm <name> | Delete file/folder |
| open <file> | Opens associated app |
| pwd | Print current directory |
| cat <file> | Preview file content |
| tree | Render ASCII tree view |
- Terminal state syncs with File Explorer’s current path.

# **10. File Explorer: Theming & Style**

Description:

Apply consistent cyberpunk OS design.

Acceptance Criteria:

- Neon folder icons, glowing selection highlights.
- Hover animations (glitch/pulse).
- Smooth open/close transitions.
- Background grid alignment consistent with OS wallpaper.
- Supports dark and light neon themes.

# **11. File Explorer: Persistence & Boot Load**

Description:

Ensure filesystem state is restored after OS reboot.

Acceptance Criteria:

- All file/folder changes persist via localStorage.
- Boot animation logs filesystem initialization:

[SYS]: Mounting /Documents

[OK]: File system online

- 
- Optional migration support if structure changes (versioned storage key).

# **12. File Explorer: Testing & QA**

Description:

Add tests and QA plan.

Acceptance Criteria:

- Unit tests for FileSystemRepository.
- Integration tests for file creation, rename, delete.
- Manual test checklist:
    - Create file/folder.
    - Drag-drop move.
    - Search returns expected results.
    - Terminal commands sync correctly.
    - Associated apps open expected files.
    - UI responsive and styled consistently.
- 

# **Future Enhancements (for backlog)**

- File Previews: inline thumbnails for images, audio waveforms.
- Properties Panel: metadata display (size, date, type).
- Encryption (Vault): password-protected folder.
- Cloud Sync: optional sync via REST or IndexedDB backup.
- Permissions System: lock certain folders to “admin” user.

---

Additional Context:


Integration points: we already have a file explorer icon and window lets start from there
