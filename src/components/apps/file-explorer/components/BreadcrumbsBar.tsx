import { ChevronRight } from 'lucide-react';
import { FileSystemItem } from '@/lib/fileSystemTypes';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface BreadcrumbsBarProps {
  breadcrumbs: FileSystemItem[];
  onNavigate: (id: string) => void;
}

export const BreadcrumbsBar = ({ breadcrumbs, onNavigate }: BreadcrumbsBarProps) => {
  return (
    <motion.nav
      className="flex items-center gap-1 border-b border-[#15142a] bg-bg-dark-2/80 px-4 py-2"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <div key={crumb.id} className="flex items-center">
            <button
              type="button"
              onClick={() => onNavigate(crumb.id)}
              className={clsx(
                'rounded px-2 py-1 text-[11px] transition',
                isLast
                  ? 'bg-neon-aqua-low-opacity text-emerald-200'
                  : 'text-cyan-200/80 hover:text-emerald-200'
              )}
              disabled={isLast}
            >
              {index === 0 ? 'Root' : crumb.name}
            </button>
            {!isLast && <ChevronRight size={12} className="mx-1 text-[#2d2950]" />}
          </div>
        );
      })}
    </motion.nav>
  );
};
