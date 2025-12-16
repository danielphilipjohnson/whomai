import { useTerminal } from '@/hooks/UseTerminal';
import { useTerminalBehavior } from '@/hooks/useTerminalBehavior';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { useRef } from 'react';

export const WhoAmI = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const { command, setCommand, history, whoamiData, handleCommand } = useTerminal();
  const currentPath = useFileSystemStore((state) => state.currentPath);
  const promptPath = currentPath === '/' ? '~' : currentPath;

  useTerminalBehavior(true, inputRef, terminalContentRef);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden bg-dark-tertiary font-mono text-cyan-400"
      style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)' }}
    >
      {/* Terminal Content */}
      <div
        ref={terminalContentRef}
        className="relative flex-1 overflow-y-auto pt-3 pl-4 font-mono text-cyan-400 md:p-3"
      >
        {/* Scanlines effect */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%)',
            backgroundSize: '100% 4px',
          }}
        ></div>

        {/* Animated scan line */}
        <div
          className="absolute top-0 right-0 left-0 z-10 h-1 bg-cyan-400 opacity-20"
          style={{
            animation: 'scanline 5s linear infinite',
          }}
        ></div>
        {/* Command history */}
        {history?.map((line: string, index: number) => (
          <div key={`history-${index}`} className="mb-2">
            {line}
          </div>
        ))}

        {/* WHOAMI Response Data Display */}
        {whoamiData && (
          <div className="mt-4 border-l-2 border-lime-400 pl-3">
            <div className="mb-4 text-pink-500">=== USER IDENTITY SCAN COMPLETE ===</div>

            <div className="mb-2 flex">
              <div className="mr-4 w-40 text-lime-400">IP ADDRESS</div>
              <div className="text-white">{whoamiData.ipaddress}</div>
            </div>

            <div className="mb-2 flex">
              <div className="mr-4 w-40 text-lime-400">OPERATING SYSTEM</div>
              <div className="text-white">{whoamiData.os || 'Unknown'}</div>
            </div>

            <div className="mb-2 flex">
              <div className="mr-4 w-40 text-lime-400">BROWSER</div>
              <div className="text-white">
                {whoamiData.browser_name || 'Unknown'} {whoamiData.browser_version || ''}
              </div>
            </div>

            <div className="mb-2 flex">
              <div className="mr-4 w-40 text-lime-400">LANGUAGE</div>
              <div className="text-white">{whoamiData.parsed_language || 'Unknown'}</div>
            </div>

            <div className="mb-2 flex">
              <div className="mr-4 w-40 text-lime-400">USER AGENT</div>
              <div className="text-xs text-white">{whoamiData.software || 'Unknown'}</div>
            </div>

            <div className="mb-2 flex">
              <div className="mr-4 w-40 text-lime-400">SYSTEM ACCESS</div>
              <div className="text-white">Request #{whoamiData.total_requests}</div>
            </div>
          </div>
        )}

        {/* Command input field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(command);
          }}
          className="flex items-center"
        >
          <span className="mr-1 text-lime-400">{`guest@cybercity:${promptPath}$`}</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="max-w-42 flex-1 border-none bg-transparent text-white caret-pink-500 outline-none"
            autoComplete="off"
            spellCheck="false"
            aria-label="Terminal command input"
            placeholder="Enter command..."
          />
          {!command && <div className="animate-blink ml-0.5 h-4 w-2 bg-pink-500"></div>}
        </form>
      </div>
    </div>
  );
};

export default WhoAmI;
