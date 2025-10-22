"use client";

import { useEffect } from 'react';
import { Toast, ToastVariant, useToastStore } from '@/store/useToastStore';
import clsx from 'clsx';

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-neon-green text-neon-green bg-black/80 shadow-[0_0_18px_rgba(57,255,20,0.35)]',
  info: 'border-cyan-400 text-cyan-300 bg-black/80 shadow-[0_0_18px_rgba(34,211,238,0.35)]',
  warning: 'border-amber-400 text-amber-300 bg-black/85 shadow-[0_0_18px_rgba(252,211,77,0.35)]',
  error: 'border-rose-500 text-rose-300 bg-black/85 shadow-[0_0_18px_rgba(244,63,94,0.35)]',
};

const formatTimestamp = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const ToastCard = ({ toast }: { toast: Toast }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        removeToast(toast.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [removeToast, toast.id]);

  return (
    <div
      role="status"
      className={clsx(
        'relative min-w-[240px] max-w-sm rounded-lg border px-4 py-3 font-mono backdrop-blur transition-all duration-300',
        'overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent)]',
        variantStyles[toast.variant],
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] opacity-80">
            <span>{toast.variant}</span>
            <span>{formatTimestamp(toast.createdAt)}</span>
          </div>
          {toast.title && <p className="mt-1 text-sm font-semibold tracking-wide">{toast.title}</p>}
          <p className="mt-1 text-sm leading-relaxed text-gray-200">{toast.message}</p>
        </div>
        <button
          type="button"
          className="ml-auto text-xs uppercase tracking-[0.3em] text-gray-400 hover:text-white"
          onClick={() => removeToast(toast.id)}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
    </div>
  );
};

export const CyberToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-start justify-end px-6 py-8">
      <div className="flex w-full max-w-xs flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto toast-slide-in">
            <ToastCard toast={toast} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberToastContainer;
