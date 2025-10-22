'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type BootScreenProps = {
  onComplete: () => void;
  progress?: number;
  Icon?: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  bootLines?: string[];
  durationMs?: number;
  bootChimeSrc?: string;
  soundMuted?: boolean;
};

const MIN_STEP = 1.8;
const MAX_STEP = 3.2;

export const BootScreen = ({
  onComplete,
  progress: externalProgress,
  Icon,
  bootLines,
  durationMs = 3800,
  bootChimeSrc,
  soundMuted = true,
}: BootScreenProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = React.useState(() => Math.max(0, externalProgress ?? 0));
  const [lines, setLines] = React.useState<string[]>([]);
  const doneRef = React.useRef(false);
  const shellRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const script = React.useMemo(
    () =>
      bootLines?.length
        ? bootLines
        : [
            '[BOOT] Initialising subsystem…',
            '[OK] Window Manager online',
            '[OK] Input Router locked',
            '[OK] Theme Engine loaded',
            '[OK] Audio Synth warmed',
            '[OK] File Indexer idle',
            '[READY] Cyberpunk OS kernel standing by',
          ],
    [bootLines]
  );

  const stamp = React.useCallback((line: string) => {
    const d = new Date();
    const time = d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return `[${time}] ${line}`;
  }, []);

  React.useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    shellRef.current?.focus({ preventScroll: true });

    const trap = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        event.preventDefault();
      }
      if (event.key === 'Tab' && shellRef.current) {
        const focusable = Array.from(
          shellRef.current.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'));
        if (!focusable.length) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', trap, true);
    return () => {
      document.removeEventListener('keydown', trap, true);
      previouslyFocused.current?.focus?.();
    };
  }, []);

  React.useEffect(() => {
    if (externalProgress == null) {
      const minSteps = Math.ceil(100 / MAX_STEP);
      const steps = Math.max(minSteps, Math.ceil(durationMs / 180));
      const interval = durationMs / steps;
      let currentStep = 0;

      const intervalId = window.setInterval(() => {
        currentStep += 1;
        const incrementRange = MAX_STEP - MIN_STEP;
        const deterministic = MIN_STEP + ((currentStep % 9) / 8) * incrementRange;

        setProgress((prev) => {
          const next = Math.min(100, prev + deterministic);
          return next;
        });

        if (currentStep <= script.length) {
          setLines((prev) => [...prev, stamp(script[currentStep - 1])]);
        }

        if (currentStep >= steps) {
          window.clearInterval(intervalId);
          setProgress(100);
          setTimeout(() => {
            setLines((prev) =>
              prev.at(-1)?.includes('READY') ? prev : [...prev, stamp('[SYSTEM] READY')]
            );
          }, 140);
        }
      }, interval);

      return () => window.clearInterval(intervalId);
    }
  }, [durationMs, externalProgress, script, stamp]);

  React.useEffect(() => {
    if (externalProgress == null) return;
    setProgress((prev) => (prev === externalProgress ? prev : externalProgress));

    const threshold = Math.min(
      script.length,
      Math.max(0, Math.floor((externalProgress / 100) * script.length))
    );
    setLines(script.slice(0, threshold).map(stamp));
    if (externalProgress >= 100) {
      setLines((prev) =>
        prev.at(-1)?.includes('READY') ? prev : [...prev, stamp('[SYSTEM] READY')]
      );
    }
  }, [externalProgress, script, stamp]);

  React.useEffect(() => {
    if (!doneRef.current && progress >= 100) {
      doneRef.current = true;
      if (!soundMuted && bootChimeSrc && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => void 0);
      }
      const readyId = window.setTimeout(onComplete, 520);
      return () => window.clearTimeout(readyId);
    }
  }, [progress, onComplete, bootChimeSrc, soundMuted]);

  const clamped = Math.min(100, Math.round(progress));

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      tabIndex={-1}
      aria-label="System boot"
      aria-modal="true"
      ref={shellRef}
    >
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0 boot-scanlines motion-reduce:animate-none" />
      )}

      <motion.div
        initial={{ scale: prefersReducedMotion ? 1 : 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        className="relative w-[min(92vw,720px)] overflow-hidden rounded-2xl border border-cyan-400/40 bg-neutral-900/85 p-6 shadow-[0_0_60px_rgba(0,255,255,0.18)]"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_38px_rgba(0,255,255,0.22)] ring-1 ring-cyan-400/40" />

        <header className="flex items-center gap-4">
          <motion.div
            aria-hidden
            className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-xl border border-cyan-400/40 bg-cyan-500/10"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    rotateX: [0, 6, 0],
                    rotateY: [0, -6, 0],
                  }
            }
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 boot-holo-mask motion-reduce:animate-none" />
            {Icon ? (
              <Icon className="h-10 w-10 text-cyan-200" />
            ) : (
              <CyberEyeIcon className="h-10 w-10 text-cyan-200" />
            )}
            {!prefersReducedMotion && <div className="boot-glitch absolute inset-0 motion-reduce:animate-none" />}
          </motion.div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-wide text-cyan-200">
              CYBERPUNK OS • BOOT SEQUENCE
            </h2>
            <p className="text-sm text-cyan-300/70">Initialising subsystems… please stand by</p>
          </div>

          <div aria-live="polite" aria-atomic="true" className="text-right leading-tight">
            <div className="text-2xl font-bold text-cyan-100 tabular-nums">{clamped}%</div>
            <div className="text-xs text-cyan-400/60">progress</div>
          </div>
        </header>

        <section
          className="mt-6 grid grid-cols-3 gap-6"
          aria-live="polite"
          aria-label="Boot progress"
        >
          <div className="col-span-1 grid place-items-center">
            <ProgressRing value={clamped} size={128} stroke={8} />
          </div>
          <div className="col-span-2">
            <div
              className="flex h-2 w-full items-center overflow-hidden rounded-full bg-cyan-500/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={clamped}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clamped}%` }}
                transition={{ ease: 'easeOut', duration: 0.28 }}
                className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              />
            </div>
            <div className="mt-4 h-36 overflow-hidden rounded-lg border border-cyan-400/30 bg-black/45 p-3 font-mono text-xs text-cyan-100/90">
              <LogList lines={lines} reduced={prefersReducedMotion ?? false} />
            </div>
          </div>
        </section>

        <footer className="mt-4 flex items-center justify-between text-xs text-cyan-400/70">
          <span>v1.0 • kernel id: N3-0N</span>
          <span>
            Tip: press{' '}
            <kbd className="rounded border border-cyan-400/30 bg-cyan-500/10 px-1 py-0.5">Ctrl</kbd>{' '}
            +{' '}
            <kbd className="rounded border border-cyan-400/30 bg-cyan-500/10 px-1 py-0.5">
              Space
            </kbd>{' '}
            for Start Menu
          </span>
        </footer>
      </motion.div>

      {bootChimeSrc && (
        <audio
          ref={audioRef}
          src={bootChimeSrc}
          preload="auto"
          muted={soundMuted}
          className="hidden"
        />
      )}
    </div>
  );
};

export default BootScreen;

function LogList({ lines, reduced }: { lines: string[]; reduced: boolean }) {
  return (
    <div className="space-y-1" aria-live="polite" aria-atomic="false">
      {lines.map((line, index) => (
        <motion.div
          key={line + index}
          initial={reduced ? undefined : { opacity: 0, x: -6 }}
          animate={reduced ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="whitespace-pre"
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

function ProgressRing({
  value,
  size = 120,
  stroke = 8,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const dash = (clamped / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="text-cyan-900"
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#boot-ring)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${circumference - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <defs>
        <linearGradient id="boot-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CyberEyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <path
        d="M8 32c8-12 24-12 32 0-8 12-24 12-32 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="24" cy="32" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="32" r="3" fill="currentColor" />
      <path d="M44 14l8 8M52 14l-8 8M44 42l8 8M52 42l-8 8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
