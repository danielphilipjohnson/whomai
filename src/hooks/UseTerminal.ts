import { useState } from 'react';
import { generateWhoAmIData } from "@/lib/generateWhoAmIData";

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
	

	const handleCommand = (input: string) => {
		const trimmed = input.trim().toLowerCase();
		const newHistory = [...history, `guest@cybercity:~$ ${input}`];

		switch (trimmed) {
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
					'  exit     - Close the terminal'
				]);
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
