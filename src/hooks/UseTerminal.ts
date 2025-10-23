import { useEffect, useState } from 'react';
import { generateWhoAmIData } from '@/lib/generateWhoAmIData';
import { notesRepository } from '@/lib/notesRepository';

import { useWindowStore } from '@/store/useWindowStore';
import { useSession } from '@/hooks/useSession';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppRegistry } from '@/hooks/useAppRegistry';

import { useFileSystemStore } from '@/store/useFileSystemStore';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import rehypeHighlight from 'rehype-highlight';
import { FileSystemItem } from '@/lib/fileSystemTypes';

interface WhoAmIData {
  ipaddress: string;
  os: string;
  browser_name: string;
  browser_version: string;
  language: string;
  parsed_language: string;
  software: string;
  total_requests: number;
}

export const useTerminal = () => {
  const [command, setCommand] = useState('');

  const [history, setHistory] = useState<string[]>([
    'Welcome to CyberOS v2.0.77',

    'Type "whoami" to view system information',

    'Type "help" for available commands',
  ]);

  const [whoamiData, setWhoamiData] = useState<WhoAmIData | null>(null);

  const [glitchEffect, setGlitchEffect] = useState(false);

  const { openWindow, closeWindow } = useWindowStore();

  const { launchApp, listApps } = useAppRegistry();

  useEffect(() => {
    if (glitchEffect) {
      document.body.classList.add('glitch-effect');
    } else {
      document.body.classList.remove('glitch-effect');
    }

    return () => {
      document.body.classList.remove('glitch-effect');
    };
  }, [glitchEffect]);

  const handleCommand = async (input: string) => {
    const fs = useFileSystemStore.getState();
    const cwd = fs.currentPath || '/';
    const promptPath = cwd === '/' ? '~' : cwd;
    const trimmed = input.trim();
    const normalizePath = (raw: string) => {
      if (!raw) return '/';
      const replaced = raw.replace(/\\/g, '/');
      const withLeading = replaced.startsWith('/') ? replaced : `/${replaced}`;
      return withLeading.replace(/\/+/g, '/');
    };
    const findItemByPath = (raw: string) => {
      const normalized = normalizePath(raw);
      return Object.values(fs.items).find((item) => item.path === normalized);
    };
    const baseHistory = [...history, `guest@cybercity:${promptPath}$ ${input}`];
    const [cmdRaw, ...args] = trimmed.split(/\s+/);
    const cmd = cmdRaw.toLowerCase();

    const resolvePath = (target = '.') => {
      const segments = target.split('/');
      const baseSegments = cwd.split('/').filter(Boolean);
      const resultSegments = target.startsWith('/') ? [] : [...baseSegments];
      segments.forEach((segment) => {
        if (!segment || segment === '.') return;
        if (segment === '..') {
          resultSegments.pop();
          return;
        }
        resultSegments.push(segment);
      });
      return '/' + resultSegments.join('/');
    };

    const openFile = (item: FileSystemItem) => {
      if (item.type !== 'file') return;
      const extension = item.metadata?.extension?.toLowerCase();
      try {
        switch (extension) {
          case 'md': {
            const content = fs.readFile(item.id);
            const noteTitle = item.name.replace(/\.md$/i, '') || item.name;
            const existing = notesRepository.getAllNotes().find((note) => note.title === noteTitle);
            const target = existing ?? notesRepository.createNote(noteTitle);
            notesRepository.updateNote(target.id, content);
            openWindow('notes', { id: target.id, title: target.title });
            break;
          }
          case 'mp3':
          case 'wav':
            openWindow('music', { fileId: item.id, name: item.name, path: item.path });
            break;
          case 'json': {
            const content = fs.readFile(item.id);
            openWindow('jsonViewer', {
              fileId: item.id,
              name: item.name,
              content,
              path: item.path,
            });
            break;
          }
          case 'sys':
            openWindow('systemAlert', {
              title: 'ACCESS RESTRICTED',
              message: `Security kernel blocked ${item.name}.`,
              severity: 'error',
            });
            break;
          default:
            openWindow('systemAlert', {
              title: 'UNSUPPORTED FILE',
              message: `${item.name} has no associated app yet.`,
              severity: 'warning',
            });
        }
      } catch (error) {
        openWindow('systemAlert', {
          title: 'OPEN FAILED',
          message: `Could not open ${item.name}. ${(error as Error).message}`,
          severity: 'error',
        });
      }
    };

    if (!trimmed) {
      setHistory(baseHistory);
      setCommand('');
      return;
    }

    if (cmd === 'whoami') {
      setHistory([...baseHistory, 'Scanning system...']);
      setTimeout(() => {
        const data: WhoAmIData = generateWhoAmIData();
        setWhoamiData(data);
        setHistory([
          ...baseHistory,
          'Scanning system...',
          'Scan complete. Identity information retrieved.',
        ]);
      }, 1500);
      setCommand('');
      return;
    }

    if (cmd === 'clear') {
      setHistory([]);
      setWhoamiData(null);
      setCommand('');
      return;
    }

    if (cmd === 'notes') {
      const [notesSubcommand, ...notesArgs] = args;
      switch (notesSubcommand?.toLowerCase()) {
        case 'help':
          setHistory([
            ...baseHistory,
            'Notes app commands:',
            '  notes open <title>       - Opens or creates a note window',
            '  notes list               - Lists all notes',
            '  notes new "<title>"      - Creates a new note',
            '  notes delete "<title>"   - Deletes or archives a note',
            '  notes search "<query>"    - Returns list of matches',
            '  notes export "<title>" md|html - Exports the current note',
            '  notes today              - Creates daily note for current date',
          ]);
          break;
        case 'list':
          const allNotes = notesRepository.getAllNotes();
          if (allNotes.length === 0) {
            setHistory([...baseHistory, 'No notes found.']);
          } else {
            const noteList = allNotes.map(
              (note) => `- ${note.title} (ID: ${note.id.substring(0, 8)}...)`
            );
            setHistory([...baseHistory, 'Your notes:', ...noteList]);
          }
          break;
        case 'new':
          const newTitle = notesArgs.join(' ').replace(/^"|"$/g, '');
          if (!newTitle) {
            setHistory([...baseHistory, 'Usage: notes new "<title>"']);
            break;
          }
          const createdNote = notesRepository.createNote(newTitle);
          openWindow('notes', { id: createdNote.id, title: createdNote.title });
          setHistory([...baseHistory, `Note "${createdNote.title}" created and opened.`]);
          break;
        case 'open':
          const openTitle = notesArgs.join(' ').replace(/^"|"$/g, '');
          if (!openTitle) {
            setHistory([...baseHistory, 'Usage: notes open <title>']);
            break;
          }
          const noteToOpen = notesRepository
            .getAllNotes()
            .find((n) => n.title.toLowerCase() === openTitle.toLowerCase());
          if (noteToOpen) {
            openWindow('notes', { id: noteToOpen.id, title: noteToOpen.title });
            setHistory([...baseHistory, `Note "${noteToOpen.title}" opened.`]);
          } else {
            setHistory([...baseHistory, `Note "${openTitle}" not found. Creating new note.`]);
            const newNote = notesRepository.createNote(openTitle);
            openWindow('notes', { id: newNote.id, title: newNote.title });
          }
          break;
        case 'delete':
          const deleteTitle = notesArgs.join(' ').replace(/^"|"$/g, '');
          if (!deleteTitle) {
            setHistory([...baseHistory, 'Usage: notes delete "<title>"']);
            break;
          }
          const noteToDelete = notesRepository
            .getAllNotes()
            .find((n) => n.title.toLowerCase() === deleteTitle.toLowerCase());
          if (noteToDelete) {
            notesRepository.toggleArchive(noteToDelete.id); // Soft delete
            setHistory([...baseHistory, `Note "${noteToDelete.title}" moved to archive.`]);
          } else {
            setHistory([...baseHistory, `Note "${deleteTitle}" not found.`]);
          }
          break;
        case 'search':
          const searchQuery = notesArgs.join(' ').replace(/^"|"$/g, '');
          if (!searchQuery) {
            setHistory([...baseHistory, 'Usage: notes search "<query>"']);
            break;
          }
          const matchingNotes = notesRepository
            .getAllNotes()
            .filter(
              (note) =>
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
          if (matchingNotes.length === 0) {
            setHistory([...baseHistory, `No notes found matching "${searchQuery}".`]);
          } else {
            const searchResults = matchingNotes.map(
              (note) => `- ${note.title} (ID: ${note.id.substring(0, 8)}...)`
            );
            setHistory([...baseHistory, `Notes matching "${searchQuery}":`, ...searchResults]);
          }
          break;
        case 'export':
          const exportTitle = notesArgs[0]?.replace(/^"|"$/g, '');
          const exportFormat = notesArgs[1]?.toLowerCase();

          if (!exportTitle || !(exportFormat === 'md' || exportFormat === 'html')) {
            setHistory([...baseHistory, 'Usage: notes export "<title>" md|html']);
            break;
          }

          const noteToExport = notesRepository
            .getAllNotes()
            .find((n) => n.title.toLowerCase() === exportTitle.toLowerCase());
          if (!noteToExport) {
            setHistory([...baseHistory, `Note "${exportTitle}" not found.`]);
            break;
          }

          let fileContent = '';
          let fileName = '';
          let fileType = '';

          if (exportFormat === 'md') {
            fileContent = noteToExport.content;
            fileName = `${noteToExport.title}.md`;
            fileType = 'text/markdown';
          } else if (exportFormat === 'html') {
            const processedContent = await remark()
              .use(remarkHtml, { sanitize: true })
              .use(rehypeHighlight)
              .process(noteToExport.content);
            fileContent = `<!DOCTYPE html>\n<html>\n<head>\n<title>${noteToExport.title}</title>\n<meta charset="utf-8">\n</head>\n<body>\n${processedContent.toString()}\n</body>\n</html>`;
            fileName = `${noteToExport.title}.html`;
            fileType = 'text/html';
          }

          const element = document.createElement('a');
          const file = new Blob([fileContent], { type: fileType });
          element.href = URL.createObjectURL(file);
          element.download = fileName;
          document.body.appendChild(element); // Required for Firefox
          element.click();
          document.body.removeChild(element); // Clean up
          setHistory([...baseHistory, `Note "${noteToExport.title}" exported as ${fileName}.`]);
          break;
        case 'today':
          const today = new Date();
          const todayTitle = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} Daily Note`;
          let dailyNote = notesRepository.getAllNotes().find((n) => n.title === todayTitle);

          if (!dailyNote) {
            dailyNote = notesRepository.createNote(todayTitle);
            setHistory([...baseHistory, `Created daily note: "${todayTitle}".`]);
          } else {
            setHistory([...baseHistory, `Opening existing daily note: "${todayTitle}".`]);
          }
          openWindow('notes', { id: dailyNote.id, title: dailyNote.title });
          break;
        default:
          setHistory([
            ...baseHistory,
            `Unknown notes subcommand: ${notesSubcommand}. Type "notes help" for more info.`,
          ]);
          break;
      }
      setCommand('');
      return;
    }

    const output: string[] = [];
    try {
      switch (cmd) {
        case 'help':
          output.push(
            'Available commands:',
            '  whoami       - Display your browser information',
            '  clear        - Clear the terminal',
            '  pwd          - Print current directory',
            '  list [path]  - List directory contents',
            '  list apps    - List all available applications',
            '  cd <path>    - Change directory',
            '  mkdir <name> - Create a directory',
            '  touch <name> - Create an empty file',
            '  rm <name>    - Delete file or folder',
            '  open <file>  - Open file with associated app',
            '  cat <file>   - Display file contents',
            '  tree [path]  - ASCII tree view',
            '  notes        - Notes app commands',
            '  reboot       - Reboot the system',
            '  theme <name> - Change the system theme (dark, neon, light)',
            '  system info  - Display system information',
            '  exit         - Close the terminal'
          );
          break;
        case 'pwd':
          output.push(cwd);
          break;
        case 'list': {
          if (args[0] === 'apps') {
            const apps = listApps();
            output.push('Available applications:');
            apps.forEach((app) => {
              output.push(`  ${app.name}`);
            });
          } else {
            const targetPath = args[0] ? resolvePath(args[0]) : cwd;
            const directory = findItemByPath(targetPath);
            if (!directory || directory.type !== 'folder') {
              output.push(`list: no such directory: ${args[0] ?? targetPath}`);
              break;
            }
            const entries = fs.listDirectory(directory.id);
            if (!entries.length) {
              output.push('(empty)');
              break;
            }
            const formatted = entries.map((entry) =>
              entry.type === 'folder' ? `${entry.name}/` : entry.name
            );
            output.push(formatted.join('  '));
          }
          break;
        }
        case 'cd': {
          const target = resolvePath(args[0] ?? '/');
          const destination = findItemByPath(target);
          if (!destination || destination.type !== 'folder') {
            output.push(`cd: no such directory: ${args[0] ?? target}`);
            break;
          }
          fs.setCurrentPath(target);
          output.push(`Now in ${target}`);
          break;
        }
        case 'mkdir': {
          const name = args[0];
          if (!name) {
            output.push('Usage: mkdir <name>');
            break;
          }
          if (name.includes('/')) {
            output.push('mkdir: path separators are not supported.');
            break;
          }
          const created = fs.createItemInCurrent(name, 'folder');
          output.push(`Directory created: ${created.name}`);
          break;
        }
        case 'touch': {
          const filename = args[0];
          if (!filename) {
            output.push('Usage: touch <name>');
            break;
          }
          const currentDir = findItemByPath(cwd);
          if (!currentDir || currentDir.type !== 'folder') {
            output.push('touch: current directory invalid');
            break;
          }
          const existing = fs.listDirectory(currentDir.id).find((entry) => entry.name === filename);
          if (existing && existing.type === 'file') {
            const content = fs.readFile(existing.id);
            fs.writeFile(existing.id, content);
            output.push(`Updated timestamp for ${existing.name}`);
          } else if (existing) {
            output.push('touch: cannot overwrite directory');
          } else {
            const created = fs.createItemInCurrent(filename, 'file');
            output.push(`File created: ${created.name}`);
          }
          break;
        }
        case 'rm': {
          const targetName = args[0];
          if (!targetName) {
            output.push('Usage: rm <name>');
            break;
          }
          const currentDir = findItemByPath(cwd);
          if (!currentDir || currentDir.type !== 'folder') {
            output.push('rm: current directory invalid');
            break;
          }
          const entries = fs.listDirectory(currentDir.id);
          const targetItem = entries.find((entry) => entry.name === targetName);
          if (!targetItem) {
            output.push(`rm: cannot remove '${targetName}': No such file or directory`);
            break;
          }
          const soft = !fs.isInTrash(targetItem.id);
          fs.deleteItems([targetItem.id], { soft });
          output.push(soft ? `Moved ${targetItem.name} to Trash` : `Deleted ${targetItem.name}`);
          break;
        }
        case 'open': {
          const targetRaw = args.join(' ').trim();
          if (!targetRaw) {
            output.push('Usage: open <app_name> or open <file>');
            break;
          }

          const normalizedTarget = targetRaw.toLowerCase();
          const compactTarget = normalizedTarget.replace(/\s+/g, '');
          const app = listApps().find((app) => {
            const appName = app.name.toLowerCase();
            const appId = app.id.toLowerCase();
            return (
              appName === normalizedTarget ||
              appId === normalizedTarget ||
              appName.replace(/\s+/g, '') === compactTarget
            );
          });

          if (app) {
            launchApp(app.id);
            output.push(`Opened ${app.name}`);
          } else {
            const fullPath = resolvePath(targetRaw);
            const file = findItemByPath(fullPath);
            if (!file || file.type !== 'file') {
              output.push(`open: file not found: ${targetRaw}`);
              break;
            }
            openFile(file);
            output.push(`Opened ${file.name}`);
          }
          break;
        }
        case 'list': {
          if (args[0] === 'apps') {
            const apps = listApps();
            output.push('Available applications:');
            apps.forEach((app) => {
              output.push(`  ${app.name}`);
            });
          } else {
            const targetPath = args[0] ? resolvePath(args[0]) : cwd;
            const directory = findItemByPath(targetPath);
            if (!directory || directory.type !== 'folder') {
              output.push(`ls: no such directory: ${args[0] ?? targetPath}`);
              break;
            }
            const entries = fs.listDirectory(directory.id);
            if (!entries.length) {
              output.push('(empty)');
              break;
            }
            const formatted = entries.map((entry) =>
              entry.type === 'folder' ? `${entry.name}/` : entry.name
            );
            output.push(formatted.join('  '));
          }
          break;
        }
        case 'cat': {
          const target = args[0];
          if (!target) {
            output.push('Usage: cat <file>');
            break;
          }
          const fullPath = resolvePath(target);
          const file = findItemByPath(fullPath);
          if (!file || file.type !== 'file') {
            output.push(`cat: file not found: ${target}`);
            break;
          }
          const content = fs.readFile(file.id);
          output.push(...(content ? content.split('\n') : ['']));
          break;
        }
        case 'tree': {
          const startPath = args[0] ? resolvePath(args[0]) : cwd;
          const root = findItemByPath(startPath);
          if (!root || root.type !== 'folder') {
            output.push(`tree: no such directory: ${args[0] ?? startPath}`);
            break;
          }
          const buildTree = (folderId: string, prefix = ''): string[] => {
            const children = fs.listDirectory(folderId);
            return children.flatMap((child, index) => {
              const isLast = index === children.length - 1;
              const connector = `${prefix}${isLast ? '└── ' : '├── '}${child.type === 'folder' ? child.name + '/' : child.name}`;
              const childPrefix = `${prefix}${isLast ? '    ' : '│   '}`;
              return child.type === 'folder'
                ? [connector, ...buildTree(child.id, childPrefix)]
                : [connector];
            });
          };
          output.push(root.path);
          output.push(...buildTree(root.id));
          break;
        }
        case 'reboot':
          output.push('Rebooting system...');
          setTimeout(() => {
            useSession.getState().logout();
          }, 1000);
          break;
        case 'theme': {
          const themeName = args[0];
          if (!themeName) {
            output.push('Usage: theme <name>');
            output.push('Available themes: dark, neon, light');
            break;
          }
          if (['dark', 'neon', 'light'].includes(themeName)) {
            useThemeStore.getState().setTheme(themeName);
            output.push(`Theme changed to ${themeName}`);
          } else {
            output.push(`Theme not found: ${themeName}`);
          }
          break;
        }
        case 'system': {
          if (args[0] === 'info') {
            const uptime = Math.floor(process.uptime());
            const memoryUsage = Math.floor(Math.random() * (80 - 40) + 40);
            output.push('System Information:');
            output.push(`  OS Version: CyberOS v2.0.77`);
            output.push(`  Uptime: ${uptime} seconds`);
            output.push(`  Memory Usage: ${memoryUsage}%`);
          } else {
            output.push(`Unknown system command: ${args[0]}`);
          }
          break;
        }
        case 'unlock': {
          if (args[0] === 'vault') {
            launchApp('vault');
            output.push('Vault unlocked.');
          } else {
            output.push(`Unknown unlock command: ${args[0]}`);
          }
          break;
        }
        case 'mira.connect': {
          launchApp('mira');
          output.push('Connecting to MIRA...');
          break;
        }
        case 'sudo': {
          if (input === 'sudo echo "Wake up, Daniel."') {
            setGlitchEffect(true);
            output.push('>>> Initiating system override... Wake up, Daniel.');
            setTimeout(() => setGlitchEffect(false), 1000);
          } else {
            output.push(`sudo: command not found: ${args.join(' ')}`);
          }
          break;
        }
        case 'exit':
          closeWindow('terminal');
          output.push('Closing terminal...');
          break;
        default:
          output.push(`Command not found: ${input}. Type 'help' for available commands.`);
      }
    } catch (error) {
      output.push(`Error: ${(error as Error).message}`);
    }

    setHistory([...baseHistory, ...output]);
    setCommand('');
  };

  return {
    command,
    setCommand,
    history,
    whoamiData,
    glitchEffect,
    handleCommand,
  };
};