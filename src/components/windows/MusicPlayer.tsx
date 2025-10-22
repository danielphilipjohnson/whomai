import { MusicPlayerPayload } from '@/lib/windowPayloads';
import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { useWindowStore } from '@/store/useWindowStore';

interface MusicPlayerProps {
  payload?: MusicPlayerPayload;
}

const bars = Array.from({ length: 16 }, (_, index) => index);

export const MusicPlayer = ({ payload }: MusicPlayerProps) => {
  const title = payload?.name ?? 'No track loaded';
  const path = payload?.path ?? '';
  const getItemById = useFileSystemStore((state) => state.getItemById);
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const fileId = event.dataTransfer.getData('application/x-cyber-item');
      if (!fileId) return;
      const file = getItemById(fileId);
      if (!file || file.type !== 'file') return;
      const extension = file.metadata?.extension?.toLowerCase();
      if (extension !== 'mp3' && extension !== 'wav') return;
      openWindow('music', { fileId: file.id, name: file.name, path: file.path });
    },
    [getItemById, openWindow]
  );

  const waveform = useMemo(
    () =>
      bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 rounded bg-emerald-400"
          initial={{ height: 8 + (bar % 4) * 6 }}
          animate={{ height: [12, 28, 16, 24, 10][bar % 5] }}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: 1.4,
            delay: bar * 0.05,
            ease: 'easeInOut',
          }}
        />
      )),
    []
  );

  return (
    <div
      className="flex h-full flex-col bg-dark-primary font-mono text-xs text-emerald-200"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="border-b border-[#14232a] px-4 py-3">
        <div className="text-sm font-semibold text-emerald-100">{title}</div>
        {path && <div className="text-[10px] text-[#3a5e61]">{path}</div>}
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="flex h-16 items-end gap-1">{waveform}</div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-emerald-400/60 px-4 py-1 text-[11px] tracking-[0.2em] uppercase hover:bg-emerald-500/10"
          >
            Play
          </button>
          <button
            type="button"
            className="rounded-full border border-emerald-400/40 px-4 py-1 text-[11px] tracking-[0.2em] uppercase hover:bg-emerald-500/5"
          >
            Pause
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
