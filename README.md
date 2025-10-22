# 🚀 Cyberpunk WebOS

> A neon-drenched desktop simulation with a virtual filesystem, multitasking window manager, and hacker-grade productivity apps built on Next.js 15.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-0f172a?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8)
![Zustand](https://img.shields.io/badge/Zustand-121212?style=for-the-badge&logo=react&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix%20UI-111111?style=for-the-badge&logo=radiopublic&logoColor=white)

## 🌟 Features

✔ **Boot-to-desktop immersion** with login terminals, animated boot screen, and theme-aware session handoff.  
✔ **Virtual filesystem** supporting nested folders, drag-and-drop, range selection, trash recovery, and synced terminal commands.  
✔ **Markdown Notes app** with autosave, live preview, keyboard shortcuts, pin/archive filters, and drag-in imports from the explorer.  
✔ **Terminal integration** that exposes OS commands (`list`, `open`, `notes export`, etc.) and orchestrates app windows through the command line.  
✔ **Cyberpunk window manager** delivering draggable, resizable, multi-app windows (File Explorer, Terminal, Music Player, JSON Viewer, Vault, more).  
✔ **Radix-enhanced UI library** of dialogs, context menus, and dropdowns tuned for the neon aesthetic and accessibility.

## 🛠 Tech Stack

| Technology                     | Purpose                                    |
| ------------------------------ | ------------------------------------------ |
| **Next.js 15 (App Router)** ⚙️ | SPA + OS shell, bundling, routing          |
| **React 19** ⚛️                | UI composition for apps and windows        |
| **TypeScript (strict)** ✅     | Type-safe domain models & stores           |
| **Tailwind CSS 4** 🎨          | Cyberpunk styling & responsive layout      |
| **Zustand** 🧠                 | Window manager, filesystem, session stores |
| **Radix UI** 🪟                | Accessible primitives (dialogs, menus)     |
| **Remark + Rehype** 📝         | Markdown parsing & syntax highlighting     |
| **Framer Motion** 🌀           | Micro-interactions for OS polish           |

## 🚀 Getting Started

### Prerequisites

- Node.js **18+** (matches Next.js 15 requirements)
- npm (comes bundled with Node)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cyberpunk-webos.git
   cd cyberpunk-webos
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development environment:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm run start
   ```

### Recommended Scripts

```bash
npm run lint   # ESLint with Next.js rules
npm run test   # Jest + Testing Library suite
npm run test:watch
```

## 📂 Project Structure

```
src/
├── app/                 # App Router entry, boot/login/desktop routes
│   └── apps/            # OS apps (file explorer, notes, etc.)
├── components/          # Shared UI (windows, dock, dialogs, layout)
├── hooks/               # Session, boot sequence, terminal input, shortcuts
├── lib/                 # Domain logic (fs repository, notes repo, registry)
└── store/               # Zustand stores (filesystem, windows, session)
__tests__/               # Jest specs (add alongside new features)
docs/                    # QA guides & architecture notes
public/                  # Static assets (backgrounds, icons)
```

## 🖥 Core Applications

- **File Explorer** – Tree navigation, toolbar actions, search, properties, trash, filesystem ↔ terminal sync.
- **Notes** – Markdown editor with autosave, live preview, keyboard shortcuts, import/export, pin/archive filters.
- **Terminal** – Command history, filesystem operations, app launch automation, `notes` subcommands for power users.
- **Music Player, JSON Viewer, Vault, System Monitor** – Showcase additional windows, payload-driven layouts, and resizable frames.

## 🔍 Quality & Testing

- Lint: `npm run lint`
- Unit/Integration tests: `npm run test`
- Manual QA: follow the checklists in `docs/file-explorer-qa.md` and `docs/notes-app.md` for end-to-end coverage of the explorer + notes workflows.
- Architecture & deployment notes for the Notes app live in `docs/notes-app.md` (design, QA matrix, recording tips).

## 🛣 Roadmap Ideas

- Snapshot syncing for notes + filesystem for improved persistence.
- Live multi-window layouts stored per session profile.
- Exportable desktop themes and shader-driven backgrounds.
- Automated end-to-end tests (Playwright) for boot/login/desktop flows.

## 📸 Portfolio Tips

- Capture a short screen recording showcasing boot → login → desktop multitasking.
- Highlight the Notes ↔ File Explorer import flow in animated GIFs.
- Include terminal command snippets in your portfolio write-up to emphasize depth.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit with conventional messages (`feat:`, `chore:`, etc.).
4. Push and open a pull request.

## 📬 Contact

- Blog: [dev.to/danielphilipjohnson](https://dev.to/danielphilipjohnson)
- Twitter: [@danielpjcodes](https://twitter.com/danielpjcodes)
- Email: hi@danielphilipjohnson.com
