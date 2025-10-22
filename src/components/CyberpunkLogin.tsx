'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export type CyberpunkLoginProps = {
  onSubmit: (name: string) => void;
};

export const CyberpunkLogin = ({ onSubmit }: CyberpunkLoginProps) => {
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Identifier required');
      return;
    }
    setError(null);
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        className="w-[min(90vw,420px)] rounded-2xl border border-cyan-500/50 bg-neutral-900/90 p-8 text-cyan-100 shadow-[0_0_50px_rgba(0,255,255,0.25)] backdrop-blur"
      >
        <div className="flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-xl border border-cyan-500/40 bg-cyan-500/10">
            <span className="text-xl text-cyan-200">◎</span>
            <div className="pointer-events-none absolute inset-0 rounded-xl border border-cyan-500/20 shadow-[0_0_18px_rgba(0,255,255,0.3)]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-[0.25em] text-cyan-200">CYBERPUNK OS</h1>
            <p className="text-xs text-cyan-400/70">Enter your handle to jack in</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-[11px] tracking-[0.3em] text-cyan-400 uppercase">
            Operator ID
            <input
              ref={inputRef}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. NeonGhost"
              className="mt-2 w-full rounded-lg border border-cyan-500/40 bg-black/60 px-3 py-2 font-mono text-sm text-cyan-100 transition outline-none focus:border-cyan-300 focus:shadow-[0_0_12px_rgba(0,255,255,0.3)]"
            />
          </label>

          {error && <p className="text-xs text-pink-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg border border-cyan-500/60 bg-gradient-to-r from-cyan-500/40 to-fuchsia-500/40 px-3 py-2 text-sm font-semibold tracking-[0.2em] text-cyan-100 uppercase shadow-[0_12px_24px_rgba(0,255,255,0.2)] transition hover:shadow-[0_16px_30px_rgba(0,255,255,0.4)] focus:ring-2 focus:ring-cyan-400/70 focus:outline-none"
          >
            Enter System
          </button>
        </form>

        <div className="mt-6 border-t border-cyan-500/20 pt-4 text-[10px] tracking-[0.3em] text-cyan-500/60 uppercase">
          Access granted for demonstration build. No credentials required.
        </div>
      </motion.div>
    </div>
  );
};

export default CyberpunkLogin;
