# File Explorer QA Checklist

Use this checklist to validate the File Explorer experience across UI and terminal flows.

## Manual Tests

- [ ] Create a new file and folder from the toolbar; verify items persist after page reload.
- [ ] Drag and drop a file from one folder to another and confirm the path updates.
- [ ] Search for an item by partial name and open the first result via Enter.
- [ ] Open a `.md` file and confirm the Notes app displays the content.
- [ ] Play an `.mp3` or `.wav` file in the Music Player (drag-and-drop and double-click).
- [ ] Delete an item and confirm it appears in `/Trash`, then restore it back to its source directory.
- [ ] Trigger the context menu (Right-click) and exercise Open, Rename, Delete, Copy Path, and Properties actions.
- [ ] Execute terminal commands (`pwd`, `ls`, `cd`, `mkdir`, `touch`, `rm`, `open`, `cat`, `tree`) and verify state stays in sync with the File Explorer UI.
- [ ] Drag a `.md` file onto the Notes window to import its content.
- [ ] Confirm cyberpunk theming: hover states, neon accents, and window animations remain consistent in dark and light modes.
