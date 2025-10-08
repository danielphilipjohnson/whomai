import { useState } from 'react';
import { generateWhoAmIData } from "@/lib/generateWhoAmIData";
import { notesRepository } from "@/lib/notesRepository";
import { useWindowStore } from "@/store/useWindowStore";
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import rehypeHighlight from 'rehype-highlight';

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
		'Type "help" for available commands'
	]);
	const [whoamiData, setWhoamiData] = useState<WhoAmIData | null>(null);
	const { openWindow } = useWindowStore();

	const handleCommand = async (input: string) => {
		const trimmed = input.trim();
		const newHistory = [...history, `guest@cybercity:~$ ${input}`];
		const [cmd, ...args] = trimmed.split(' ');

		switch (cmd.toLowerCase()) {
			case 'whoami':
				setHistory([...newHistory, 'Scanning system...']);
				setTimeout(() => {
					const data: WhoAmIData = generateWhoAmIData();
					setWhoamiData(data);
					setHistory([...newHistory, 'Scanning system...', 'Scan complete. Identity information retrieved.']);
				}, 1500);
				break;
			case 'clear':
				setHistory([]);
				setWhoamiData(null);
				break;
			case 'help':
				setHistory([
					...newHistory,
					'Available commands:',
					'  whoami   - Display your browser information',
					'  clear    - Clear the terminal',
					'  help     - Show this help message',
					'  notes    - Interact with the Notes app (type "notes help" for more info)',
					'  exit     - Close the terminal'
				]);
				break;
			case 'notes':
				const [notesSubcommand, ...notesArgs] = args;
				switch (notesSubcommand?.toLowerCase()) {
					case 'help':
						setHistory([
							...newHistory,
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
							setHistory([...newHistory, 'No notes found.']);
						} else {
							const noteList = allNotes.map(note => `- ${note.title} (ID: ${note.id.substring(0, 8)}...)`);
							setHistory([...newHistory, 'Your notes:', ...noteList]);
						}
						break;
					case 'new':
						const newTitle = notesArgs.join(' ').replace(/^"|"$/g, '');
							if (!newTitle) {
							setHistory([...newHistory, 'Usage: notes new "<title>"']);
							break;
						}
						const createdNote = notesRepository.createNote(newTitle);
						openWindow('notes', { id: createdNote.id, title: createdNote.title });
						setHistory([...newHistory, `Note "${createdNote.title}" created and opened.`]);
						break;
					case 'open':
						const openTitle = notesArgs.join(' ').replace(/^"|"$/g, '');
							if (!openTitle) {
							setHistory([...newHistory, 'Usage: notes open <title>']);
							break;
						}
						const noteToOpen = notesRepository.getAllNotes().find(n => n.title.toLowerCase() === openTitle.toLowerCase());
							if (noteToOpen) {
							openWindow('notes', { id: noteToOpen.id, title: noteToOpen.title });
							setHistory([...newHistory, `Note "${noteToOpen.title}" opened.`]);
						} else {
							setHistory([...newHistory, `Note "${openTitle}" not found. Creating new note.`]);
							const newNote = notesRepository.createNote(openTitle);
							openWindow('notes', { id: newNote.id, title: newNote.title });
						}
						break;
					case 'delete':
						const deleteTitle = notesArgs.join(' ').replace(/^"|"$/g, '');
							if (!deleteTitle) {
							setHistory([...newHistory, 'Usage: notes delete "<title>"']);
							break;
						}
						const noteToDelete = notesRepository.getAllNotes().find(n => n.title.toLowerCase() === deleteTitle.toLowerCase());
							if (noteToDelete) {
							notesRepository.toggleArchive(noteToDelete.id); // Soft delete
							setHistory([...newHistory, `Note "${noteToDelete.title}" moved to archive.`]);
						} else {
							setHistory([...newHistory, `Note "${deleteTitle}" not found.`]);
						}
						break;
					case 'search':
						const searchQuery = notesArgs.join(' ').replace(/^"|"$/g, '');
							if (!searchQuery) {
							setHistory([...newHistory, 'Usage: notes search "<query>"']);
							break;
						}
						const matchingNotes = notesRepository.getAllNotes().filter(
							note => note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
															note.content.toLowerCase().includes(searchQuery.toLowerCase())
						);
							if (matchingNotes.length === 0) {
							setHistory([...newHistory, `No notes found matching "${searchQuery}".`]);
						} else {
							const searchResults = matchingNotes.map(note => `- ${note.title} (ID: ${note.id.substring(0, 8)}...)`);
							setHistory([...newHistory, `Notes matching "${searchQuery}":`, ...searchResults]);
						}
						break;
					case 'export':
						const exportTitle = notesArgs[0]?.replace(/^"|"$/g, '');
						const exportFormat = notesArgs[1]?.toLowerCase();

						if (!exportTitle || !(exportFormat === 'md' || exportFormat === 'html')) {
							setHistory([...newHistory, 'Usage: notes export "<title>" md|html']);
							break;
						}

						const noteToExport = notesRepository.getAllNotes().find(n => n.title.toLowerCase() === exportTitle.toLowerCase());
							if (!noteToExport) {
							setHistory([...newHistory, `Note "${exportTitle}" not found.`]);
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

						const element = document.createElement("a");
						const file = new Blob([fileContent], { type: fileType });
						element.href = URL.createObjectURL(file);
						element.download = fileName;
						document.body.appendChild(element); // Required for Firefox
						element.click();
						document.body.removeChild(element); // Clean up
						setHistory([...newHistory, `Note "${noteToExport.title}" exported as ${fileName}.`]);
																	break;
											case 'today':
												const today = new Date();
												const todayTitle = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')} Daily Note`;
												let dailyNote = notesRepository.getAllNotes().find(n => n.title === todayTitle);
						
												if (!dailyNote) {
													dailyNote = notesRepository.createNote(todayTitle);
													setHistory([...newHistory, `Created daily note: "${todayTitle}".`]);
												} else {
													setHistory([...newHistory, `Opening existing daily note: "${todayTitle}".`]);
												}
												openWindow('notes', { id: dailyNote.id, title: dailyNote.title });
												break;
											default:
												setHistory([...newHistory, `Unknown notes subcommand: ${notesSubcommand}. Type "notes help" for more info.`]);
												break;				}
				break;
			default:
				setHistory([
					...newHistory,
					`Command not found: ${input}. Type 'help' for available commands.`
				]);
				break;
		}

		setCommand('');
	};

	return {
		command,
		setCommand,
		history,
		whoamiData,
		handleCommand,
	};
};
