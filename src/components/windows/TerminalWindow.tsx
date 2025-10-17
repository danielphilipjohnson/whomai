import React, { useRef, KeyboardEvent } from 'react';
import { useTerminal } from '@/hooks/UseTerminal';
import { useTerminalBehavior } from '@/hooks/useTerminalBehavior';

const TerminalWindow: React.FC = () => {
  const { command, setCommand, history, whoamiData, handleCommand } = useTerminal();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useTerminalBehavior(true, inputRef, scrollRef);

  const onCommandKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(command);
    }
  };

  return (
    <div
      className="w-full h-full bg-black text-green-400 font-mono p-4 overflow-y-auto"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="h-full">
        {history.map((line, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
        {whoamiData && (
          <div className="mt-2 p-2 border border-green-700">
            <h3 className="text-lg text-green-300">System Scan Results:</h3>
            <ul>
              <li><strong>IP Address:</strong> {whoamiData.ipaddress}</li>
              <li><strong>Operating System:</strong> {whoamiData.os}</li>
              <li><strong>Browser:</strong> {whoamiData.browser_name} ({whoamiData.browser_version})</li>
              <li><strong>Language:</strong> {whoamiData.language} ({whoamiData.parsed_language})</li>
              <li><strong>Software:</strong> {whoamiData.software}</li>
              <li><strong>Total Requests:</strong> {whoamiData.total_requests}</li>
            </ul>
          </div>
        )}
        <div className="flex items-center">
          <span className="text-yellow-400">guest@cybercity:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={onCommandKeyDown}
            className="bg-transparent border-none text-green-400 focus:outline-none flex-grow ml-2"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalWindow;
