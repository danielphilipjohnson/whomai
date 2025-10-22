import { create } from "zustand";
import { MusicPlayerPayload, JsonViewerPayload, SystemAlertPayload } from "@/lib/windowPayloads";

export type WindowType = "logs" | "kernel" | "terminal" | "fileExplorer" | "notes" | "music" | "jsonViewer" | "systemAlert" | "vault" | "mira" | "monitor";

export type NotesAppPayload = {
	id: string;
	title: string;
};

export type WindowPayloadMap = {
	logs: undefined;
	kernel: undefined;
	terminal: undefined;
	fileExplorer: undefined;
	notes: NotesAppPayload;
	music: MusicPlayerPayload;
	jsonViewer: JsonViewerPayload;
	systemAlert: SystemAlertPayload;
	vault: undefined;
	mira: undefined;
	monitor: undefined;
};

export type WindowState<T extends WindowType = WindowType> = {
	id: T;
	visible: boolean;
	zIndex: number;
	minimized: boolean;
	maximized: boolean;
	payload?: WindowPayloadMap[T];
};

type Store = {
	windows: { [K in WindowType]: WindowState<K> };
	topZ: number;
	startMenuOpen: boolean;
	toggleStartMenu: () => void;
	setStartMenuOpen: (open: boolean) => void;
	openWindow: <T extends WindowType>(id: T, payload?: WindowPayloadMap[T]) => void;
	closeWindow: (id: WindowType) => void;
	bringToFront: (id: WindowType) => void;
	toggleWindow: (id: WindowType) => void;
	minimizeWindow: (id: WindowType) => void;
	maximizeWindow: (id: WindowType) => void;
	isAnyWindowMaximized: () => boolean;
	updateWindowPayload: <T extends WindowType>(id: T, payload?: WindowPayloadMap[T]) => void;
};

export const useWindowStore = create<Store>((set, get) => ({
	topZ: 100,
	startMenuOpen: false,
	toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),
	setStartMenuOpen: (open) => {
		if (get().startMenuOpen === open) {
			return;
		}
		set({ startMenuOpen: open });
	},
	windows: {
		terminal: { id: "terminal", visible: false, zIndex: 0, minimized: false, maximized: false },
		logs: { id: "logs", visible: false, zIndex: 0, minimized: false, maximized: false },
		kernel: { id: "kernel", visible: false, zIndex: 0, minimized: false, maximized: false },
		fileExplorer: { id: "fileExplorer", visible: false, zIndex: 0, minimized: false, maximized: false },
		notes: { id: "notes", visible: false, zIndex: 0, minimized: false, maximized: false },
		music: { id: "music", visible: false, zIndex: 0, minimized: false, maximized: false },
		jsonViewer: { id: "jsonViewer", visible: false, zIndex: 0, minimized: false, maximized: false },
	systemAlert: { id: "systemAlert", visible: false, zIndex: 0, minimized: false, maximized: false },
	vault: { id: "vault", visible: false, zIndex: 0, minimized: false, maximized: false },
	mira: { id: "mira", visible: false, zIndex: 0, minimized: false, maximized: false },
	monitor: { id: "monitor", visible: false, zIndex: 0, minimized: false, maximized: false },
	},

	openWindow: (id, payload) => {
		const { topZ } = get();
		set((state) => ({
			windows: {
				...state.windows,
				[id]: {
					...state.windows[id],
					visible: true,
					minimized: false,
					maximized: false,
					zIndex: topZ + 1,
					...(payload && { payload }),
				},
			},
			topZ: topZ + 1,
		}));
	},

	closeWindow: (id) => {
		set((state) => ({
			windows: {
				...state.windows,
				[id]: { ...state.windows[id], visible: false },
			},
		}));
	},

	bringToFront: (id) => {
		const { topZ, windows } = get();
		const nextZ = topZ + 1;

		set({
			windows: {
				...windows,
				[id]: {
					...windows[id],
					zIndex: nextZ,
				},
			},
			topZ: nextZ,
		});
	},

	minimizeWindow: (id) => {
		set((state) => ({
			windows: {
				...state.windows,
				[id]: {
					...state.windows[id],
					minimized: true,
				},
			},
		}));
	},

	toggleWindow: (id) => {
		const state = get();
		const win = state.windows[id];

		if (!win.visible) {
			state.openWindow(id);
		} else if (win.minimized) {
			set({
				windows: {
					...state.windows,
					[id]: {
						...win,
						minimized: false,
						zIndex: state.topZ + 1,
					},
				},
				topZ: state.topZ + 1,
			});
		} else {
			// Bring to front or minimize if already top-most
			if (win.zIndex < state.topZ) {
				state.bringToFront(id);
			} else {
				state.minimizeWindow(id);
			}
		}
	},

	maximizeWindow: (id) => {
		const { topZ, windows } = get();
		const current = windows[id];
		const isMaxing = !current.maximized;

		set({
			windows: {
				...windows,
				[id]: {
					...current,
					maximized: isMaxing,
					zIndex: topZ + 1,
				},
			},
			topZ: topZ + 1,
		});
	},
	isAnyWindowMaximized: () => {
		const { windows } = get();
		return Object.values(windows).some((w) => w.visible && w.maximized);
	},
	updateWindowPayload: (id, payload) => {
		set((state) => ({
			windows: {
				...state.windows,
				[id]: {
					...state.windows[id],
					payload,
				},
			},
		}));
	},
}));
