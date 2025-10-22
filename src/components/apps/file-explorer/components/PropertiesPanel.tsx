import { FileSystemItem } from '@/lib/fileSystemTypes';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertiesPanelProps {
  item: FileSystemItem | null;
  onClose: () => void;
}

const formatTimestamp = (value?: number) => {
  if (!value) return 'Unknown';
  try {
    return format(value, 'yyyy-MM-dd HH:mm:ss');
  } catch {
    return new Date(value).toISOString();
  }
};

export const PropertiesPanel = ({ item, onClose }: PropertiesPanelProps) => {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="pointer-events-auto absolute right-4 bottom-4 w-72 rounded-lg border border-emerald-500/40 bg-[#05040d]/95 p-4 text-[11px] text-emerald-100 shadow-[0_0_18px_rgba(0,255,200,0.25)]"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-[0.2em] text-emerald-200 uppercase">
              Properties
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-emerald-300/70 hover:text-emerald-100"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 space-y-1 text-cyan-200">
            <div>
              <span className="text-[#488a86]">Name:</span> {item.name}
            </div>
            <div>
              <span className="text-[#488a86]">Type:</span>{' '}
              {item.type === 'folder' ? 'Folder' : `${item.metadata?.extension || 'File'}`}
            </div>
            <div className="break-all">
              <span className="text-[#488a86]">Path:</span> {item.path}
            </div>
            <div>
              <span className="text-[#488a86]">Created:</span> {formatTimestamp(item.createdAt)}
            </div>
            <div>
              <span className="text-[#488a86]">Updated:</span> {formatTimestamp(item.updatedAt)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PropertiesPanel;
