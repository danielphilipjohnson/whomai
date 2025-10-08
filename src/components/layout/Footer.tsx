"use client";

import { useWindowStore } from "@/store/useWindowStore";
import { StartMenuIcon } from "../dock-bar/StartMenuIcon";
import { useAppRegistry } from "@/hooks/useAppRegistry";
import { AppIcon } from "../dock-bar/AppIcon";
import { usePinnedAppsStore } from "@/store/usePinnedAppsStore";

const Footer = () => {
  const { toggleStartMenu } = useWindowStore();
  const { getApp, launchApp } = useAppRegistry();
  const { pinnedApps } = usePinnedAppsStore();


  return (
    <div className="h-14 md:h-32 bg-black/70 backdrop-blur-md border-t border-cyan-400 flex justify-center items-center z-10">
      <div className="flex py-2 px-2 items-center w-full md:w-auto md:max-w-screen-lg">
        <StartMenuIcon onClick={toggleStartMenu}/>

        <div className="flex flex-grow overflow-x-auto md:overflow-x-hidden whitespace-nowrap items-center">
 

          <div className="w-px h-16 bg-cyan-400 mx-1 flex-shrink-0"></div>
          {pinnedApps.map((appId) => {
            const app = getApp(appId);
            if (!app) return null; // Handle cases where app might not be found
            return <AppIcon key={app.id} app={app} onClick={() => launchApp(app.id, undefined, false)} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;