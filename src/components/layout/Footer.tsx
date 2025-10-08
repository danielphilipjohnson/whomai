"use client";

import { useWindowStore } from "@/store/useWindowStore";
import { StartMenuIcon } from "../dock-bar/StartMenuIcon";
import { useAppRegistry } from "@/hooks/useAppRegistry";
import { AppIcon } from "../dock-bar/AppIcon";
import { usePinnedAppsStore } from "@/store/usePinnedAppsStore";

const Footer = () => {
  const { toggleStartMenu, toggleWindow } = useWindowStore();
  const { getApp, launchApp } = useAppRegistry();
  const { pinnedApps } = usePinnedAppsStore();

  const terminalApp = getApp("terminal");
  const logsApp = getApp("logs");
  const kernelApp = getApp("kernel");

  return (
    <div className="h-14 md:h-32 bg-black/70 backdrop-blur-md border-t border-cyan-400 flex justify-center items-center z-10">
      <div className="flex py-2 px-2 items-center w-full md:w-auto md:max-w-screen-lg">
        <StartMenuIcon onClick={toggleStartMenu}/>
        <div className="w-px h-16 bg-cyan-400 mx-1 flex-shrink-0"></div>

        <div className="flex flex-grow overflow-x-auto md:overflow-x-hidden whitespace-nowrap items-center">
          {terminalApp && (
            <AppIcon
              app={terminalApp}
              onClick={() => {
                launchApp(terminalApp.id);
                toggleWindow("terminal");
              }}
            />
          )}
          {logsApp && (
            <AppIcon
              app={logsApp}
              onClick={() => {
                launchApp(logsApp.id);
                toggleWindow("logs");
              }}
            />
          )}
          {kernelApp && (
            <AppIcon
              app={kernelApp}
              onClick={() => {
                launchApp(kernelApp.id);
                toggleWindow("kernel");
              }}
            />
          )}

          <div className="w-px h-16 bg-cyan-400 mx-1 flex-shrink-0"></div>
          {pinnedApps.map((appId) => {
            const app = getApp(appId);
            if (!app) return null; // Handle cases where app might not be found
            return <AppIcon key={app.id} app={app} onClick={() => launchApp(app.id)} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;