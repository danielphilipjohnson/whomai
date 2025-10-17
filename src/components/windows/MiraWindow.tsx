"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppRegistry } from '@/hooks/useAppRegistry';
import { useWindowStore } from '@/store/useWindowStore';
import { useRecentAppsStore } from '@/store/useRecentAppsStore';
import type { AppMeta } from '@/lib/appRegistry';

type Role = 'mira' | 'user';

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

type QuickPrompt = {
  label: string;
  command: string;
};

const QUICK_PROMPTS: QuickPrompt[] = [
  { label: 'Status Report', command: 'status' },
  { label: 'Show Recent', command: 'recent' },
  { label: 'List Apps', command: 'list apps' },
  { label: 'Open Notes', command: 'open notes' },
];

const createMessage = (role: Role, content: string): Message => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  role,
  content,
  timestamp: Date.now(),
});

const MiraWindow: React.FC = () => {
  const { listApps, launchApp } = useAppRegistry();
  const windows = useWindowStore((state) => state.windows);
  const recentAppIds = useRecentAppsStore((state) => state.recentApps);
  const [messages, setMessages] = useState<Message[]>([
    createMessage('mira', 'Boot sequence complete. MIRA is online.'),
    createMessage('mira', 'Issue a command like "status", "list apps", or ask me to open something.'),
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const responseTimerRef = useRef<number | null>(null);

  const visibleWindows = useMemo(() => {
    return Object.values(windows)
      .filter((win) => win.visible && !win.minimized)
      .map((win) => win.id);
  }, [windows]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isProcessing]);

  useEffect(() => () => {
    if (responseTimerRef.current !== null) {
      window.clearTimeout(responseTimerRef.current);
    }
  }, []);

  const formatAppList = useCallback((apps: AppMeta[]) => {
    const grouped = apps.reduce<Record<string, string[]>>((acc, app) => {
      if (app.hidden) return acc;
      const category = app.category ?? 'Unsorted';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(app.name);
      return acc;
    }, {});

    const lines = Object.entries(grouped)
      .map(([category, names]) => `• ${category}: ${names.join(', ')}`);

    return lines.length ? lines.join('\n') : 'No public modules detected.';
  }, []);

  const handleResponse = useCallback((rawInput: string) => {
    const input = rawInput.trim().toLowerCase();
    const apps = listApps();

    if (!input) {
      return 'Silence registered. Awaiting directive.';
    }

    if (['status', 'status report'].includes(input)) {
      if (!visibleWindows.length) {
        return 'All windows are dormant. CPU load is nominal. Diagnostics: green across the board.';
      }
      const friendlyNames = visibleWindows
        .map((id) => apps.find((app) => app.id === id)?.name ?? id)
        .join(', ');
      return `Active interfaces: ${friendlyNames}. Visual stack is stable.`;
    }

    if (['help', 'commands'].includes(input)) {
      return 'Try asking for "status", "recent", "list apps", or say "open" followed by an app name. Quick prompts are available below.';
    }

    if (['recent', 'recent apps', 'show recent'].includes(input)) {
      const recent = recentAppIds
        .map((id) => apps.find((app) => app.id === id))
        .filter((app): app is AppMeta => Boolean(app));
      if (!recent.length) {
        return 'You have not launched anything recently. Want me to open something?';
      }
      return `Last launches: ${recent.map((app) => app.name).join(', ')}.`;
    }

    if (input === 'list apps' || input === 'show apps') {
      return `Installed catalog:\n${formatAppList(apps)}`;
    }

    if (input.startsWith('open ')) {
      const target = input.replace('open ', '').trim();
      const match = apps.find((app) => app.name.toLowerCase() === target || app.id === target);
      if (match) {
        launchApp(match.id, undefined, false);
        return `Acknowledged. Launching ${match.name}.`;
      }
      return `Unable to resolve "${target}" to a known module.`;
    }

    if (['hello', 'hi', 'hey'].includes(input)) {
      return 'Hello, operator. Systems stand ready.';
    }

    return 'Query received, but no routine matched. Ask for "help" to review available directives.';
  }, [formatAppList, launchApp, listApps, recentAppIds, visibleWindows]);

  const pushMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const processInput = useCallback((value: string) => {
    if (!value.trim() || isProcessing) {
      return;
    }
    pushMessage(createMessage('user', value));
    setInputValue('');
    setIsProcessing(true);

    const responseText = handleResponse(value);

    const delay = responseText.length > 80 ? 700 : 400;
    if (responseTimerRef.current !== null) {
      window.clearTimeout(responseTimerRef.current);
    }
    responseTimerRef.current = window.setTimeout(() => {
      pushMessage(createMessage('mira', responseText));
      setIsProcessing(false);
      responseTimerRef.current = null;
    }, delay);
  }, [handleResponse, isProcessing, pushMessage]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    processInput(inputValue);
  }, [inputValue, processInput]);

  const handlePromptClick = useCallback((prompt: QuickPrompt) => {
    processInput(prompt.command);
  }, [processInput]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      <header className="border-b border-neon-purple/40 px-4 py-3">
        <h1 className="text-lg font-semibold tracking-[0.35em] text-neon-purple">MIRA</h1>
        <p className="mt-1 text-xs uppercase text-gray-400">Modular Interface for Reactive Assistance</p>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-md border px-4 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                message.role === 'mira'
                  ? 'self-start border-neon-purple/50 bg-black/70 text-neon-blue'
                  : 'self-end border-neon-green/40 bg-neon-green/10 text-neon-green'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="mt-2 block text-[10px] uppercase tracking-wide text-gray-500">
                {message.role === 'mira' ? 'mira.exe' : 'operator'} • {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {isProcessing && (
            <div className="self-start text-xs uppercase tracking-[0.3em] text-neon-purple/70">
              Synthesizing response...
            </div>
          )}
          <div ref={scrollAnchorRef} />
        </div>
      </main>

      <footer className="border-t border-neon-purple/30 bg-black/60 px-4 py-4 shrink-0">
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.command}
              className="rounded-full border border-neon-purple/40 px-3 py-1 text-xs uppercase tracking-wide text-neon-purple transition hover:border-neon-blue/60 hover:text-neon-blue disabled:opacity-40"
              onClick={() => handlePromptClick(prompt)}
              disabled={isProcessing}
            >
              {prompt.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Transmit directive to MIRA..."
            className="flex-1 rounded-md border border-neon-purple/40 bg-slate-900/70 px-3 py-2 text-sm text-gray-100 outline-none transition focus:border-neon-blue focus:shadow-[0_0_18px_rgba(0,240,255,0.35)]"
            disabled={isProcessing}
            autoFocus
          />
          <button
            type="submit"
            className="rounded-md border border-neon-green/50 bg-neon-green/10 px-4 py-2 text-sm uppercase tracking-wide text-neon-green transition hover:bg-neon-green/20 disabled:opacity-50"
            disabled={isProcessing || !inputValue.trim()}
          >
            Transmit
          </button>
        </form>
      </footer>
    </div>
  );
};

export default MiraWindow;
