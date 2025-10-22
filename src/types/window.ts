export type WindowType = "logs" | "kernel" | "terminal" | "fileExplorer" | "notepad";

export type WindowState = {
	id: WindowType;
	visible: boolean;
	zIndex: number;
	minimized: boolean;
	maximized: boolean;
	content?: string;
}; 