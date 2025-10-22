import React from 'react';
import { AppMeta } from '@/lib/appRegistry';
import { cn } from '@/lib/utils';
import { usePinnedAppsStore } from '@/store/usePinnedAppsStore';
import Image from 'next/image';

interface StartMenuAppTileProps {
  app: AppMeta;
  onClick: (appId: string) => void;
}

export const StartMenuAppTile = ({ app, onClick }: StartMenuAppTileProps) => {
  const { pinnedApps, pinApp, unpinApp } = usePinnedAppsStore();
  const isPinned = pinnedApps.includes(app.id);

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPinned) {
      unpinApp(app.id);
    } else {
      pinApp(app.id);
    }
  };

  return (
    <div
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-lg p-2 transition-colors duration-200',
        'hover:bg-cyan-700/30 hover:shadow-[0_0_10px_rgba(5,217,232,0.3)]'
      )}
      onClick={() => onClick(app.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        // TODO: Implement context menu here
        console.log(`Context menu for ${app.name}`);
        handlePinToggle(e); // For now, just toggle pin on right click
      }}
    >
      {typeof app.icon === 'string' ? (
        <Image src={app.icon} alt={app.name} width={40} height={40} className="mb-1 h-10 w-10" />
      ) : (
        <div className="mb-1 flex h-10 w-10 items-center justify-center">{app.icon}</div>
      )}
      <span className="w-full truncate text-center text-xs text-white">{app.name}</span>
      {isPinned && (
        <span className="absolute top-1 right-1 text-xs text-cyan-400">&#9733;</span> // Star icon for pinned
      )}
    </div>
  );
};
