import React, { useRef, useEffect, useState } from 'react';
import { WindowState } from '@/store/useWindowStore';
import { Resizable } from 're-resizable';
import Draggable from 'react-draggable';

interface WindowFrameProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onBringToFront: () => void;
  title: string;
  children: React.ReactNode;
}

const WindowFrame = ({
  windowState,
  onClose,
  onMinimize,
  onMaximize,
  onBringToFront,
  title,
  children,
}: WindowFrameProps) => {
  const nodeRef = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (windowState.maximized) {
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    } else if (windowState.minimized) {
      // Handle minimized state (e.g., hide or move off-screen)
    } else {
      // Restore previous size/position if not maximized/minimized
    }
  }, [windowState.maximized, windowState.minimized]);

  if (!windowState.visible || windowState.minimized) {
    return null; // Don't render if not visible or minimized
  }

  return (
    <Draggable
      handle=".window-header"
      nodeRef={nodeRef}
      onStart={onBringToFront}
      position={windowState.maximized ? { x: 0, y: 0 } : undefined} // Disable dragging when maximized
      onStop={(e, data) => {
        if (!windowState.maximized) {
          setPosition({ x: data.x, y: data.y });
        }
      }}
    >
      <div
        ref={nodeRef}
        className={`border-neon-blue shadow-neon-blue-glow absolute overflow-hidden rounded-lg border bg-gray-900 ${windowState.maximized ? '!top-0 !left-0 !h-full !w-full' : ''}`}
        style={{
          zIndex: windowState.zIndex,
          ...(!windowState.maximized && {
            transform: `translate(${position.x}px, ${position.y}px)`,
          }),
        }}
      >
        <Resizable
          size={size}
          onResizeStop={(e, direction, ref, d) => {
            setSize((prevSize) => ({
              width: prevSize.width + d.width,
              height: prevSize.height + d.height,
            }));
          }}
          minWidth={300}
          minHeight={200}
          enable={
            !windowState.maximized
              ? {
                  top: true,
                  right: true,
                  bottom: true,
                  left: true,
                  topRight: true,
                  bottomRight: true,
                  bottomLeft: true,
                  topLeft: true,
                }
              : {}
          }
          className="flex h-full w-full flex-col"
        >
          <div className="window-header border-neon-blue flex cursor-grab items-center justify-between border-b bg-gray-800 p-2">
            <span className="text-neon-green font-bold">{title}</span>
            <div className="flex space-x-2">
              <button onClick={onMinimize} className="hover:text-neon-blue text-gray-400">
                —
              </button>
              <button onClick={onMaximize} className="hover:text-neon-green text-gray-400">
                {windowState.maximized ? '▢' : '☐'}
              </button>
              <button onClick={onClose} className="hover:text-neon-red text-gray-400">
                ✕
              </button>
            </div>
          </div>
          <div className="window-content flex flex-1 flex-col overflow-hidden">{children}</div>
        </Resizable>
      </div>
    </Draggable>
  );
};

export default WindowFrame;
