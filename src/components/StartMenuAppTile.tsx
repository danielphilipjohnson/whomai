import React from 'react';
import { AppMeta } from '@/lib/appRegistry';
import { cn } from '@/lib/utils';
import { usePinnedAppsStore } from '@/store/usePinnedAppsStore';

interface StartMenuAppTileProps {
  app: AppMeta;
  onClick: (appId: string) => void;
}

export const StartMenuAppTile: React.FC<StartMenuAppTileProps> = ({ app, onClick }) => {
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
        "flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-colors duration-200",
        "hover:bg-cyan-700/30 hover:shadow-[0_0_10px_rgba(5,217,232,0.3)]"
      )}
      onClick={() => onClick(app.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        // TODO: Implement context menu here
        console.log(`Context menu for ${app.name}`);
        handlePinToggle(e); // For now, just toggle pin on right click
      }}
    >
      {typeof app.icon === "string" ? (
        <img src={app.icon} alt={app.name} className="w-10 h-10 mb-1" />
      ) : (
        <div className="w-10 h-10 mb-1 flex items-center justify-center">{app.icon}</div>
      )}
      <span className="text-xs text-white text-center truncate w-full">{app.name}</span>
      {isPinned && (
        <span className="absolute top-1 right-1 text-cyan-400 text-xs">&#9733;</span> // Star icon for pinned
      )}
    </div>
  );
};
