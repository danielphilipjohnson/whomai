import { useState, useRef } from 'react';
import { generateWhoAmIData } from '@/lib/generateWhoAmIData';

interface TerminalOutput {
	type: 'info' | 'error' | 'command' | 'system' | 'block';
	content: string | string[];
	label?: string;
}


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

export const useTerminalEngine = (onCloseTerminal?: () => void) => {
	const [input, setInput] = useState('');
	const [history, setHistory] = useState<TerminalOutput[]>([
		{ type: 'system', content: 'Welcome to CyberOS v2.0.77' },
		{ type: 'system', content: 'Type "whoami" to view system information' },
		{ type: 'system', content: 'Type "help" for available commands' },
	]);
	const [whoamiData, setWhoamiData] = useState<WhoAmIData | null>(null);
	const queueRef = useRef<Promise<void>>(Promise.resolve());

	const append = (entry: TerminalOutput | TerminalOutput[]) => {
		setHistory(prev => [...prev, ...(Array.isArray(entry) ? entry : [entry])]);
	};

	const commands: Record<string, () => Promise<void>> = {
		async whoami() {
			append({ type: 'info', content: 'Scanning system...' });
			await new Promise(r => setTimeout(r, 1500));
			const data = generateWhoAmIData();
			setWhoamiData(data);
			append([
				{ type: 'system', content: '=== USER IDENTITY SCAN COMPLETE ===' },
				{ type: 'block', label: 'IP ADDRESS', content: data.ipaddress },
				{ type: 'block', label: 'OPERATING SYSTEM', content: data.os },
				{ type: 'block', label: 'BROWSER', content: `${data.browser_name} ${data.browser_version}` },
				{ type: 'block', label: 'LANGUAGE', content: data.parsed_language },
				{ type: 'block', label: 'USER AGENT', content: data.software },
				{ type: 'block', label: 'SYSTEM ACCESS', content: `Request #${data.total_requests}` },
			]);

		},

		async help() {
			append([
				{ type: 'info', content: 'Available commands:' },
				{ type: 'info', content: '  whoami   - Display your browser information' },
				{ type: 'info', content: '  clear    - Clear the terminal' },
				{ type: 'info', content: '  help     - Show this help message' },
				{ type: 'info', content: '  exit     - Close the terminal' },
			]);
		},

		async clear() {
			setHistory([]);
			setWhoamiData(null);
		},

		async exit() {
			append({ type: 'system', content: 'Closing terminal...' });
			if (onCloseTerminal) {
				setTimeout(onCloseTerminal, 300); // slight delay for UX
			}
		},
	};

	const handleCommand = (raw: string) => {
		setInput('');
		queueRef.current = queueRef.current.then(async () => {
			const cmd = raw.trim();
			if (!cmd) return;

			append({ type: 'command', content: `guest@cybercity:~$ ${cmd}` });

			const action = commands[cmd.toLowerCase()];
			if (action) {
				await action();
			} else {
				append({
					type: 'error',
					content: `Command not found: ${cmd}. Type 'help' for available commands.`,
				});
			}
		});
	};

	return {
		command: input,
		setCommand: setInput,
		history,
		whoamiData,
		handleCommand,
	};
};