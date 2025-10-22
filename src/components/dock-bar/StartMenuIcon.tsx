import { cn } from '@/lib/utils';

export const StartMenuIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className={cn(
        'mx-2.5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-black/60 transition-all duration-200 hover:scale-110 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(5,217,232,0.5)] md:h-28 md:w-28'
      )}
      onClick={onClick}
    >
      <svg
        className="h-24 w-24"
        width="96"
        height="96"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <rect width="64" height="64" rx="8" fill="#0a0a0a" />
        <rect x="6" y="6" width="52" height="52" rx="6" stroke="#00ffe0" strokeWidth="1.5" />
        <g opacity="0.3">
          <path d="M58 6v52M6 6v52" stroke="#00ffe0" strokeDasharray="2 2" />
        </g>
      </svg>
    </div>
  );
};
