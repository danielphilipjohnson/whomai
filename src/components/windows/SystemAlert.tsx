import { SystemAlertPayload } from '@/lib/windowPayloads';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SystemAlertProps {
  payload?: SystemAlertPayload;
}

const severityStyles: Record<NonNullable<SystemAlertPayload['severity']>, string> = {
  error: 'border-rose-500/70 text-rose-200',
  warning: 'border-amber-400/70 text-amber-200',
  info: 'border-emerald-400/70 text-emerald-200',
};

export const SystemAlert = ({ payload }: SystemAlertProps) => {
  const message = payload?.message ?? 'System access denied.';
  const title = payload?.title ?? 'ACCESS DENIED';
  const severity = payload?.severity ?? 'error';

  return (
    <div className="flex h-full flex-col bg-[#0d0313] font-mono text-[11px]">
      <motion.div
        className={clsx(
          'mx-6 mt-6 rounded-lg border px-4 py-3 shadow-[0_0_18px_rgba(255,64,128,0.35)]',
          severityStyles[severity]
        )}
        initial={{ opacity: 0.6, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="text-xs font-semibold tracking-[0.3em]">{title}</div>
        <div className="mt-2 text-[11px] leading-relaxed">{message}</div>
      </motion.div>
      <div className="mt-auto px-6 py-4 text-[10px] tracking-[0.3em] text-[#f05aad]/70 uppercase">
        Security protocol VX-77 engaged
      </div>
    </div>
  );
};

export default SystemAlert;
