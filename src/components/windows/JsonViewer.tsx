'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, Download, ListTree, NotebookPen, RotateCcw } from 'lucide-react';
import { JsonViewerPayload } from '@/lib/windowPayloads';

interface JsonViewerProps {
  payload?: JsonViewerPayload;
}

type ParseState = {
  data: unknown;
  error: string | null;
};

type TreeProps = {
  value: unknown;
  path: string;
  expanded: Set<string>;
  toggle: (path: string) => void;
};

const stringifyPreview = (value: unknown) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `Array(${value.length})`;
  if (typeof value === 'object') return 'Object';
  if (typeof value === 'string') return `"${value.slice(0, 48)}${value.length > 48 ? '…' : ''}"`;
  return String(value);
};

const TreeNode = ({ value, path, expanded, toggle }: TreeProps) => {
  const isObject = value !== null && typeof value === 'object';
  const label = stringifyPreview(value);

  if (!isObject) {
    return (
      <div className="pl-3 text-[11px]">
        <span className="text-neon-green/80">{label}</span>
      </div>
    );
  }

  const entries: [string | number, unknown][] = Array.isArray(value)
    ? value.map((item, index) => [index, item] as const)
    : Object.entries(value as Record<string, unknown>);

  const isExpanded = expanded.has(path);
  const segment = path === '$' ? 'root' : path.split('.').pop();

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => toggle(path)}
        className="hover:border-neon-blue/40 flex w-full items-center gap-2 rounded border border-transparent px-2 py-1 text-left text-[11px] transition hover:bg-cyan-500/5"
      >
        <span className="text-cyan-400">{isExpanded ? '▾' : '▸'}</span>
        <span className="text-neon-blue/80 font-semibold">
          {Array.isArray(value) ? `Array(${entries.length})` : `Object {${entries.length}}`}
        </span>
        <span className="text-[10px] tracking-[0.3em] text-cyan-700/70 uppercase">{segment}</span>
      </button>
      {isExpanded && (
        <div className="border-l border-cyan-900/40 pl-3">
          {entries.map(([childKey, childValue]) => {
            const childPath = `${path}.${childKey}`;
            return (
              <div key={String(childKey)} className="mb-2">
                <div className="flex items-center gap-2 text-[11px] text-cyan-300">
                  <span className="text-cyan-600/80">{childKey}</span>
                  <span className="text-cyan-900/60">{typeof childValue}</span>
                </div>
                <TreeNode value={childValue} path={childPath} expanded={expanded} toggle={toggle} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const JsonViewer = ({ payload }: JsonViewerProps) => {
  const [rawInput, setRawInput] = useState<string>(payload?.content ?? '');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['$']));

  useEffect(() => {
    if (payload?.content) {
      setRawInput(payload.content);
      setExpanded(new Set(['$']));
    }
  }, [payload?.content]);

  const parseState: ParseState = useMemo(() => {
    if (!rawInput.trim()) {
      return { data: null, error: 'No JSON provided.' };
    }
    try {
      return { data: JSON.parse(rawInput), error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  }, [rawInput]);

  const formatted = useMemo(() => {
    if (!parseState.data) {
      return rawInput;
    }
    return JSON.stringify(parseState.data, null, 2);
  }, [parseState.data, rawInput]);

  const handleToggle = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    if (!parseState.data || typeof parseState.data !== 'object') return;
    const collect = new Set<string>();
    const walk = (value: unknown, currentPath: string) => {
      if (value && typeof value === 'object') {
        collect.add(currentPath);
        const childEntries: [string | number, unknown][] = Array.isArray(value)
          ? value.map((item, index) => [index, item] as const)
          : Object.entries(value as Record<string, unknown>);
        childEntries.forEach(([key, child]) => {
          walk(child, `${currentPath}.${key}`);
        });
      }
    };
    walk(parseState.data, '$');
    setExpanded(collect);
  };

  const handleCollapseAll = () => {
    setExpanded(new Set(['$']));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
    } catch (error) {
      console.error('Clipboard write failed', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${payload?.name ?? 'data'}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetInput = () => {
    setRawInput(payload?.content ?? '');
    setExpanded(new Set(['$']));
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-br from-[#060615] via-[#07041b] to-[#030110] font-mono text-[11px] text-cyan-200">
      <header className="border-b border-cyan-900/60 px-4 py-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-neon-green text-sm font-semibold">
              {payload?.name ?? 'Data Inspector'}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-cyan-400/80 uppercase">
              <span className="hidden items-center gap-1 sm:flex">
                <ListTree className="h-3.5 w-3.5" />
                Tree
              </span>
              <span className="hidden items-center gap-1 sm:flex">
                <NotebookPen className="h-3.5 w-3.5" />
                Raw Editor
              </span>
            </div>
          </div>
          <span className="text-[10px] tracking-[0.3em] text-cyan-700/70 uppercase">
            {payload?.path ?? 'unsaved://buffer'}
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section className="flex h-56 min-h-[14rem] flex-1 flex-col border-b border-cyan-900/40 md:h-auto md:border-r md:border-b-0">
          <div className="flex items-center gap-2 border-b border-cyan-900/40 px-3 py-2">
            <button
              type="button"
              onClick={handleExpandAll}
              className="hover:border-neon-blue hover:text-neon-blue rounded border border-cyan-800/60 px-2 py-1 text-[10px] tracking-[0.2em] text-cyan-300 uppercase transition"
            >
              Expand
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="hover:border-neon-blue hover:text-neon-blue rounded border border-cyan-800/60 px-2 py-1 text-[10px] tracking-[0.2em] text-cyan-300 uppercase transition"
            >
              Collapse
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="hover:border-neon-blue hover:text-neon-blue ml-auto flex items-center gap-1 rounded border border-cyan-800/60 px-2 py-1 text-[10px] tracking-[0.2em] text-cyan-300 uppercase transition"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="hover:border-neon-blue hover:text-neon-blue flex items-center gap-1 rounded border border-cyan-800/60 px-2 py-1 text-[10px] tracking-[0.2em] text-cyan-300 uppercase transition"
            >
              <Download className="h-3 w-3" /> Export
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            {parseState.error ? (
              <div className="rounded border border-red-500/40 bg-red-900/20 p-3 text-[11px] text-red-200">
                <div className="font-semibold tracking-[0.3em] text-red-300 uppercase">
                  Parse Error
                </div>
                <p className="mt-1 text-red-200/90">{parseState.error}</p>
              </div>
            ) : (
              <TreeNode
                value={parseState.data}
                path="$"
                expanded={expanded}
                toggle={handleToggle}
              />
            )}
          </div>
        </section>

        <section className="flex min-h-[14rem] flex-1 flex-col bg-[#050211]/70">
          <div className="flex items-center gap-2 border-b border-cyan-900/40 px-3 py-2">
            <button
              type="button"
              onClick={resetInput}
              className="hover:border-neon-blue hover:text-neon-blue flex items-center gap-1 rounded border border-cyan-800/60 px-2 py-1 text-[10px] tracking-[0.2em] text-cyan-300 uppercase transition"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
            <span className="ml-auto flex items-center gap-1 text-[10px] tracking-[0.3em] text-cyan-600/70 uppercase">
              <NotebookPen className="h-3.5 w-3.5" /> Editor Buffer
            </span>
          </div>
          <textarea
            value={rawInput}
            onChange={(event) => setRawInput(event.target.value)}
            spellCheck={false}
            className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3 font-mono text-xs leading-5 text-cyan-100 outline-none"
          />
        </section>
      </div>
    </div>
  );
};

export default JsonViewer;
