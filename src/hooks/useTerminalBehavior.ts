import { useEffect, RefObject } from 'react';

export const useTerminalBehavior = (
	showTerminal: boolean,
	inputRef: RefObject<HTMLInputElement | null>,
	scrollRef: RefObject<HTMLDivElement | null>
) => {
	useEffect(() => {
		if (showTerminal && inputRef.current) {
			inputRef.current.focus();
		}
	}, [showTerminal, inputRef]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [scrollRef.current?.scrollHeight, scrollRef]);
};
