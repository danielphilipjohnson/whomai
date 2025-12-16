import { useState } from "react";

interface NotepadWindowProps {
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
}

const NotepadHeader = ({
	onClose,
	onMinimize,
	onMaximize,
}: NotepadWindowProps) => (
	<div className="h-8 bg-[#1b1b2f] flex items-center justify-between px-3 border-b border-yellow-400">
		<div className="text-yellow-300 font-mono text-sm tracking-wide uppercase">
			Notepad :: memory.log
		</div>
		<div className="flex gap-1.5">
			<div
				className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 cursor-pointer transition"
				onClick={onMinimize}
				aria-label="Minimize notepad"
			/>
			<div
				className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-300 cursor-pointer transition"
				onClick={onMaximize}
				aria-label="Maximize notepad"
			/>
			<div
				className="w-3 h-3 rounded-full bg-pink-500 hover:bg-pink-400 cursor-pointer transition"
				onClick={onClose}
				aria-label="Close notepad"
			/>
		</div>
	</div>
);

const NotepadEditor = () => {
	const [text, setText] = useState(() => {
		if (typeof window !== 'undefined') {
			return localStorage.getItem('notepad-text') || '';
		}
		return '';
	});

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setText(value);
		localStorage.setItem('notepad-text', value);
	};

	return (
		<textarea
			className="w-full h-full bg-black/70 text-yellow-200 p-4 font-mono text-sm resize-none outline-none"
			value={text}
			onChange={handleChange}
			placeholder="Type your thoughts... auto-saved to memory."
		/>
	);
};

export const NotepadWindow = ({
	onClose,
	onMinimize,
	onMaximize,
}: NotepadWindowProps) => {
	return (
		<div
			className="bg-[#0e0e1c] border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,255,0,0.3)] flex flex-col h-full"
			style={{
				clipPath:
					'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
			}}
		>
			<NotepadHeader
				onClose={onClose}
				onMinimize={onMinimize}
				onMaximize={onMaximize}
			/>
			<NotepadEditor />
		</div>
	);
};

export default NotepadWindow;
