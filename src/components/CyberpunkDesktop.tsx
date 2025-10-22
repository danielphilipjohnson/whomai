'use client';
import Logs from './windows/Logs';
import Kernel from './windows/Kernel';
import FileExplorer from './windows/FileExplorer';
import NotesApp from '@/components/apps/notes/NotesApp';
import Folder from './Folder';
import { useWindowStore } from '@/store/useWindowStore';
import { useCallback } from 'react';
import { Note } from '@/lib/notes';
import TerminalWindow from './windows/TerminalWindow';
import { StartMenu } from './StartMenu';
import { useShortcut } from '@/hooks/useShortcut';
import { useAppRegistry } from '@/hooks/useAppRegistry';
import WindowFrame from './windows/WindowFrame';
import MusicPlayer from './windows/MusicPlayer';
import JsonViewer from './windows/JsonViewer';
import SystemAlert from './windows/SystemAlert';
import Vault from './windows/Vault';
import Mira from './windows/Mira';
import SystemMonitor from './windows/SystemMonitor';

const CyberpunkDesktop = () => {
  const {
    windows,
    openWindow,
    closeWindow,
    bringToFront,
    minimizeWindow,
    maximizeWindow,
    toggleStartMenu,
    updateWindowPayload,
  } = useWindowStore();
  const { getApp } = useAppRegistry();
  const notesAppMeta = getApp('notes');
  const terminalAppMeta = getApp('terminal');
  const logsAppMeta = getApp('logs');
  const kernelAppMeta = getApp('kernel');
  const fileExplorerAppMeta = getApp('explorer');
  const musicAppMeta = getApp('music');
  const jsonViewerMeta = getApp('jsonViewer');
  const vaultAppMeta = getApp('vault');
  const miraAppMeta = getApp('mira');
  const monitorAppMeta = getApp('monitor');

  const handleNotesChange = useCallback(
    (next: Note | null) => {
      if (!next) {
        updateWindowPayload('notes');
        return;
      }
      updateWindowPayload('notes', { id: next.id, title: next.title });
    },
    [updateWindowPayload]
  );

  useShortcut(' ', true, toggleStartMenu);

  return (
    <>
      <StartMenu />
      <Folder onOpen={() => openWindow('fileExplorer')} />

      <div className="relative flex-1">
        {fileExplorerAppMeta && (
          <WindowFrame
            windowState={windows.fileExplorer}
            onClose={() => closeWindow('fileExplorer')}
            onMinimize={() => minimizeWindow('fileExplorer')}
            onMaximize={() => maximizeWindow('fileExplorer')}
            onBringToFront={() => bringToFront('fileExplorer')}
            title={fileExplorerAppMeta.name}
          >
            <FileExplorer />
          </WindowFrame>
        )}

        {terminalAppMeta && (
          <WindowFrame
            windowState={windows.terminal}
            onClose={() => closeWindow('terminal')}
            onMinimize={() => minimizeWindow('terminal')}
            onMaximize={() => maximizeWindow('terminal')}
            onBringToFront={() => bringToFront('terminal')}
            title={terminalAppMeta.name}
          >
            <TerminalWindow />
          </WindowFrame>
        )}

        {logsAppMeta && (
          <WindowFrame
            windowState={windows.logs}
            onClose={() => closeWindow('logs')}
            onMinimize={() => minimizeWindow('logs')}
            onMaximize={() => maximizeWindow('logs')}
            onBringToFront={() => bringToFront('logs')}
            title={logsAppMeta.name}
          >
            <Logs />
          </WindowFrame>
        )}

        {notesAppMeta && (
          <WindowFrame
            windowState={windows.notes}
            onClose={() => closeWindow('notes')}
            onMinimize={() => minimizeWindow('notes')}
            onMaximize={() => maximizeWindow('notes')}
            onBringToFront={() => bringToFront('notes')}
            title={notesAppMeta.name}
          >
            <NotesApp
              id={windows.notes.payload?.id || notesAppMeta.id}
              title={windows.notes.payload?.title || notesAppMeta.name}
              onNoteChange={handleNotesChange}
            />
          </WindowFrame>
        )}

        {musicAppMeta && (
          <WindowFrame
            windowState={windows.music}
            onClose={() => closeWindow('music')}
            onMinimize={() => minimizeWindow('music')}
            onMaximize={() => maximizeWindow('music')}
            onBringToFront={() => bringToFront('music')}
            title={musicAppMeta.name}
          >
            <MusicPlayer payload={windows.music.payload} />
          </WindowFrame>
        )}

        {jsonViewerMeta && (
          <WindowFrame
            windowState={windows.jsonViewer}
            onClose={() => closeWindow('jsonViewer')}
            onMinimize={() => minimizeWindow('jsonViewer')}
            onMaximize={() => maximizeWindow('jsonViewer')}
            onBringToFront={() => bringToFront('jsonViewer')}
            title={jsonViewerMeta.name}
          >
            <JsonViewer payload={windows.jsonViewer.payload} />
          </WindowFrame>
        )}

        {kernelAppMeta && windows.kernel.visible && (
          <WindowFrame
            windowState={windows.kernel}
            onClose={() => closeWindow('kernel')}
            onMinimize={() => minimizeWindow('kernel')}
            onMaximize={() => maximizeWindow('kernel')}
            onBringToFront={() => bringToFront('kernel')}
            title={kernelAppMeta.name}
          >
            <Kernel />
          </WindowFrame>
        )}

        {monitorAppMeta && windows.monitor.visible && (
          <WindowFrame
            windowState={windows.monitor}
            onClose={() => closeWindow('monitor')}
            onMinimize={() => minimizeWindow('monitor')}
            onMaximize={() => maximizeWindow('monitor')}
            onBringToFront={() => bringToFront('monitor')}
            title={monitorAppMeta.name}
          >
            <SystemMonitor />
          </WindowFrame>
        )}

        {windows.systemAlert.visible && (
          <WindowFrame
            windowState={windows.systemAlert}
            onClose={() => closeWindow('systemAlert')}
            onMinimize={() => minimizeWindow('systemAlert')}
            onMaximize={() => maximizeWindow('systemAlert')}
            onBringToFront={() => bringToFront('systemAlert')}
            title="System Alert"
          >
            <SystemAlert payload={windows.systemAlert.payload} />
          </WindowFrame>
        )}

        {vaultAppMeta && windows.vault.visible && (
          <WindowFrame
            windowState={windows.vault}
            onClose={() => closeWindow('vault')}
            onMinimize={() => minimizeWindow('vault')}
            onMaximize={() => maximizeWindow('vault')}
            onBringToFront={() => bringToFront('vault')}
            title={vaultAppMeta.name}
          >
            <Vault />
          </WindowFrame>
        )}

        {miraAppMeta && windows.mira.visible && (
          <WindowFrame
            windowState={windows.mira}
            onClose={() => closeWindow('mira')}
            onMinimize={() => minimizeWindow('mira')}
            onMaximize={() => maximizeWindow('mira')}
            onBringToFront={() => bringToFront('mira')}
            title={miraAppMeta.name}
          >
            <Mira />
          </WindowFrame>
        )}
      </div>
    </>
  );
};

export default CyberpunkDesktop;
