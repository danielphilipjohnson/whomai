import { useWindowStore } from '@/store/useWindowStore';
import { useState, useEffect } from 'react';

interface FolderProps {
	onOpen: () => void;
}

const Folder = ({ onOpen }: FolderProps) => {
	const { isAnyWindowMaximized } = useWindowStore();
	const [isDragging, setIsDragging] = useState(false);


	useEffect(() => {
		const handleDragStart = () => setIsDragging(true);
		const handleDragEnd = () => setIsDragging(false);

		window.addEventListener('mousedown', handleDragStart);
		window.addEventListener('mouseup', handleDragEnd);

		return () => {
			window.removeEventListener('mousedown', handleDragStart);
			window.removeEventListener('mouseup', handleDragEnd);
		};
	}, []);

	const handleClick = () => {

		if (!isAnyWindowMaximized()) {
			onOpen();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isAnyWindowMaximized() && (e.key === 'Enter' || e.key === ' ')) {
			onOpen();
		}
	};

	if (isAnyWindowMaximized()) return null;


	return (
		<button 
			type='button'
			className={`absolute top-20 left-8 text-center transition-opacity ${isDragging ? 'pointer-events-none' : ''} ${isAnyWindowMaximized() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
			style={{ 
				zIndex: isDragging ? 10 : 1000,
				pointerEvents: 'auto'
			}}
			aria-label="Open file explorer"
		>
			<svg className="w-16 h-16 folder-icon" width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M3 4H9L11 6H21V20H3V4Z" fill="#0a0a0a" stroke="#33ffcc" strokeWidth="1.5" />
				<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</svg>

			<div className="text-xs text-cyan-400 mt-1 font-mono">~/datavault</div>
		</button>
	);
};

export default Folder;