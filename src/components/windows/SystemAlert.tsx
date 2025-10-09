import { SystemAlertPayload } from '@/lib/windowPayloads';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SystemAlertProps {
	payload?: SystemAlertPayload;
}

const severityStyles: Record<SystemAlertPayload['severity'] | undefined, string> = {
	error: 'border-rose-500/70 text-rose-200',
	warning: 'border-amber-400/70 text-amber-200',
	info: 'border-emerald-400/70 text-emerald-200',
	undefined: 'border-rose-500/60 text-rose-200',
};

export const SystemAlert = ({ payload }: SystemAlertProps) => {
	const message = payload?.message ?? 'System access denied.';
	const title = payload?.title ?? 'ACCESS DENIED';
	const severity = payload?.severity;

	return (
		<div className="h-full bg-[#0d0313] text-[11px] font-mono flex flex-col">
			<motion.div
				className={clsx('mx-6 mt-6 rounded-lg border px-4 py-3 shadow-[0_0_18px_rgba(255,64,128,0.35)]', severityStyles[severity])}
				initial={{ opacity: 0.6, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
			>
				<div className="text-xs font-semibold tracking-[0.3em]">{title}</div>
				<div className="mt-2 text-[11px] leading-relaxed">{message}</div>
			</motion.div>
			<div className="mt-auto px-6 py-4 text-[#f05aad]/70 text-[10px] uppercase tracking-[0.3em]">
				Security protocol VX-77 engaged
			</div>
		</div>
	);
};

export default SystemAlert;
