import { cn } from '@/lib/utils';
import { AppMeta } from '@/lib/appRegistry';
import { useWindowStore } from '@/store/useWindowStore';
import Image from 'next/image';

export const AppIcon = ({ app, onClick }: { app: AppMeta; onClick: () => void }) => {
  const { windows } = useWindowStore();
  const isRunning = windows[app.id as keyof typeof windows]?.visible;

  return (
    <div
      className={cn(
        'relative mx-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border bg-black/60 transition-all duration-200 md:h-28 md:w-28',
        isRunning
          ? 'border-cyan-400 shadow-[0_0_15px_rgba(5,217,232,0.5)]'
          : 'border-transparent hover:scale-110 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(5,217,232,0.5)]'
      )}
      onClick={onClick}
    >
      {typeof app.icon === 'string' ? (
        <Image src={app.icon} alt={app.name} width={96} height={96} className="h-24 w-24" />
      ) : (
        app.icon
      )}
      {isRunning && (
        <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-cyan-400 shadow-[0_0_5px_#00fff7]"></div>
      )}
    </div>
  );
};
