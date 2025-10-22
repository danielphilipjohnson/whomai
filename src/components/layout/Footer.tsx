'use client';

import { useWindowStore } from '@/store/useWindowStore';
import { StartMenuIcon } from '../dock-bar/StartMenuIcon';
import { useAppRegistry } from '@/hooks/useAppRegistry';
import { AppIcon } from '../dock-bar/AppIcon';
import { usePinnedAppsStore } from '@/store/usePinnedAppsStore';

const Footer = () => {
  const { toggleStartMenu } = useWindowStore();
  const { getApp, launchApp } = useAppRegistry();
  const { pinnedApps } = usePinnedAppsStore();

  return (
    <div className="z-10 flex h-14 items-center justify-center border-t border-cyan-400 bg-black/70 backdrop-blur-md md:h-32">
      <div className="flex w-full items-center px-2 py-2 md:w-auto md:max-w-screen-lg">
        <StartMenuIcon onClick={toggleStartMenu} />

        <div className="flex flex-grow items-center overflow-x-auto whitespace-nowrap md:overflow-x-hidden">
          <div className="mx-1 h-16 w-px flex-shrink-0 bg-cyan-400"></div>
          {pinnedApps.map((appId) => {
            const app = getApp(appId);
            if (!app) return null; // Handle cases where app might not be found
            return (
              <AppIcon key={app.id} app={app} onClick={() => launchApp(app.id, undefined, false)} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;
