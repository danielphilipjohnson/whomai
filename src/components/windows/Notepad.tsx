'use client';
import { Rnd } from 'react-rnd';
import { useState } from 'react';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { WindowState } from '@/types/window';

interface NotepadProps {
	windowState: WindowState;
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
	onBringToFront: () => void;
}

interface NotepadWindowProps {
	onClose: () => void;
	onMinimize: () => void;
	onMaximize: () => void;
	windowState?: WindowState;
	onBringToFront?: () => void;
}

const NotepadHeader = ({ onClose, onMinimize, onMaximize }: NotepadWindowProps) => (
	<div className="h-8 bg-[#1b1b2f] flex items-center justify-between px-3 border-b border-yellow-400">
		<div className="text-yellow-400 font-mono text-sm tracking-wide">Notepad :: Thoughts.txt</div>
		<div className="flex gap-2">
			<div className="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer" onClick={onMinimize} />
			<div className="w-3 h-3 rounded-full bg-green-400 cursor-pointer" onClick={onMaximize} />
			<div className="w-3 h-3 rounded-full bg-pink-500 cursor-pointer" onClick={onClose} />
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
		setText(e.target.value);
		localStorage.setItem('notepad-text', e.target.value);
	};

	return (
		<textarea
			value={text}
			onChange={handleChange}
			className="w-full h-full resize-none bg-black/70 text-yellow-300 p-4 font-mono text-sm outline-none"
			placeholder="Begin typing your encrypted thoughts..."
		/>
	);
};

const NotepadWindow = ({ onClose, onMinimize, onMaximize }: NotepadWindowProps) => (
	<div className="bg-[#0e0e1c] border-2 border-yellow-400 shadow-[0_0_20px_rgba(255,255,0,0.3)] flex flex-col h-full"
		style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
	>
		<NotepadHeader onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
		<NotepadEditor />
	</div>
);

const Notepad = ({ windowState, onClose, onMinimize, onMaximize, onBringToFront }: NotepadProps) => {
	const dimensions = useWindowDimensions();

	if (!windowState.visible || windowState.minimized) return null;

	if (windowState.maximized) {
		return (
			<div
				style={{ zIndex: windowState.zIndex }}
				className="absolute w-full h-full top-0 left-0"
				onMouseDown={onBringToFront}
			>
				<NotepadWindow onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
			</div>
		);
	}

	return (
		<Rnd
			default={dimensions}
			minWidth={300}
			minHeight={200}
			bounds="parent"
			onDragStart={onBringToFront}
			style={{ zIndex: windowState.zIndex }}
			className="absolute"
			disableDragging={window.innerWidth < 768}
		>
			<div onMouseDown={onBringToFront} className="w-full h-full">
				<NotepadWindow onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} />
			</div>
		</Rnd>
	);
};

export default Notepad;
