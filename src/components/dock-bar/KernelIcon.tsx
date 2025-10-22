import { cn } from '@/lib/utils';
import { KernelSvg } from '@/lib/svgIcons';

export const KernelIcon = ({
  showKernel,
  toggleKernel,
}: {
  showKernel: boolean;
  toggleKernel: () => void;
}) => {
  return (
    <div
      className={cn(
        'relative mx-2.5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border bg-black/60 transition-all duration-200 md:h-28 md:w-28',
        showKernel
          ? 'border-cyan-400 shadow-[0_0_15px_rgba(5,217,232,0.5)]'
          : 'border-transparent hover:scale-110 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(5,217,232,0.5)]'
      )}
      onClick={toggleKernel}
    >
      {KernelSvg}

      {showKernel && (
        <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-cyan-400 shadow-[0_0_5px_#00fff7]"></div>
      )}
    </div>
  );
};
