# 🧠 CyberOS - Cyberpunk Terminal Desktop

A retro-futuristic, cyberpunk-inspired interactive desktop UI.  
Built with **Next.js**, **Tailwind CSS**, and `react-rnd`, CyberOS simulates a terminal-based operating system environment with draggable, resizable, and maximizable windows — including modules like `whoami`, logs, and system diagnostics.

---

## ⚡️ Features

- 🖥️ Window system with drag, resize, minimize, maximize
- 🧪 Fake terminal with `whoami`, `help`, `clear`, `exit` commands
- 📟 Modular components: `Logs`, `Kernel`, `File Explorer`, `Terminal`
- 🌀 Neon glow aesthetics and scanline effects
- 🟢 Zustand-powered window state management
- 💡 Responsive and mobile-optimized fallback behavior

---

## 🧱 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), CSS clip-path, neon effects
- **Fonts:** [Geist Sans / Mono](https://vercel.com/font)
- **State:** [Zustand](https://github.com/pmndrs/zustand)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Drag + Resize:** [react-rnd](https://github.com/bokuweb/react-rnd)

---

## 📦 Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/cyberos-desktop.git
cd cyberos-desktop

# Install dependencies
npm install

# Run the dev server
npm run dev
