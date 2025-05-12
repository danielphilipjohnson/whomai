import React from 'react';
import { Rnd } from 'react-rnd';
import WhoAmI from './WhoAmI';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';

type WindowState = {
  id: "logs" | "kernel" | "terminal" | "fileExplorer";
  visible: boolean;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
};

interface TerminalWindowProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onBringToFront: () => void;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onBringToFront,
}) => {
  const dimensions = useWindowDimensions();

  if (!windowState.visible || windowState.minimized) {
    return null;
  }

  const whoAmIProps = {
    onClose,
    showTerminal: true,
    setShowTerminal: (show: boolean) => show ? onBringToFront() : onClose(),
    onMinimize,
    onMaximize,
  };

  if (windowState.maximized) {
    return (
      <div
        style={{ zIndex: windowState.zIndex }}
        className="absolute w-full h-full top-0 left-0"
        onMouseDown={onBringToFront}
      >
        <WhoAmI {...whoAmIProps} />
      </div>
    );
  }

  return (
    <Rnd
      default={dimensions}
      minWidth={Math.min(window.innerWidth - 32, 300)}
      minHeight={Math.min(window.innerHeight - 32, 200)}
      bounds="parent"
      onDragStart={onBringToFront}
      style={{ zIndex: windowState.zIndex }}
      className="absolute"
    >
      <div onMouseDown={onBringToFront} className="w-full h-full">
        <WhoAmI {...whoAmIProps} />
      </div>
    </Rnd>
  );
};

export default TerminalWindow; 