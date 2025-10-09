import { JsonViewerPayload } from '@/lib/windowPayloads';
import { useMemo } from 'react';

interface JsonViewerProps {
	payload?: JsonViewerPayload;
}

const formatJson = (content: string) => {
	try {
		const parsed = JSON.parse(content);
		return JSON.stringify(parsed, null, 2);
	} catch {
		return `/* Invalid JSON */\n${content}`;
	}
};

export const JsonViewer = ({ payload }: JsonViewerProps) => {
	const pretty = useMemo(() => formatJson(payload?.content ?? ''), [payload?.content]);

	return (
		<div className="h-full bg-[#06040f] text-[11px] text-cyan-200 font-mono flex flex-col">
			<div className="border-b border-[#14142a] px-4 py-3">
				<div className="text-sm font-semibold text-emerald-100">{payload?.name ?? 'JSON Preview'}</div>
				<div className="text-[10px] text-[#3d3a62]">{payload?.path}</div>
			</div>
			<pre className="flex-1 overflow-auto p-4 bg-[#070512]/80 leading-5 text-cyan-100">
				{pretty}
			</pre>
		</div>
	);
};

export default JsonViewer;
