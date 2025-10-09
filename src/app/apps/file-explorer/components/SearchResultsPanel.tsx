import { useMemo } from 'react';
import { FileSystemItem } from '@/lib/fileSystemTypes';
import clsx from 'clsx';

interface SearchResultsPanelProps {
	query: string;
	results: FileSystemItem[];
	onReveal: (item: FileSystemItem) => void;
	onOpen: (item: FileSystemItem) => void;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const iconForResult = (item: FileSystemItem) => {
	if (item.type === 'folder') return '📁';
	const extension = item.metadata?.extension?.toLowerCase();
	switch (extension) {
		case 'md':
			return '📝';
		case 'mp3':
		case 'wav':
			return '🎶';
		case 'json':
			return '🧾';
		default:
			return '📄';
	}
};

const highlight = (text: string, query: string) => {
	if (!query) return text;
	const regex = new RegExp(escapeRegExp(query), 'ig');
	const segments: Array<string | JSX.Element> = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;
	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			segments.push(text.slice(lastIndex, match.index));
		}
		const matchedText = match[0];
		segments.push(
			<span key={`${match.index}-${matchedText}`} className="text-emerald-300">
				{matchedText}
			</span>
		);
		lastIndex = match.index + matchedText.length;
	}
	if (lastIndex < text.length) {
		segments.push(text.slice(lastIndex));
	}
	return segments;
};

export const SearchResultsPanel = ({ query, results, onReveal, onOpen }: SearchResultsPanelProps) => {
	const normalizedQuery = query.trim();
	const total = results.length;
	const summary = useMemo(() => {
		if (!normalizedQuery) return 'Start typing to search';
		if (!total) return 'No matches found';
		return `${total} match${total === 1 ? '' : 'es'} for "${normalizedQuery}"`;
	}, [normalizedQuery, total]);

	return (
		<section className="flex-1 overflow-hidden bg-[#05040d]/80">
			<div className="h-full overflow-auto custom-scrollbar">
				<div className="border-b border-[#13122a] bg-[#08071a]/80 px-4 py-2 text-[11px] text-cyan-300">
					{summary}
				</div>
				<ul className="divide-y divide-[#15142a]">
					{results.map((item) => (
						<li key={item.id} className="flex items-center justify-between px-4 py-3 text-[11px] text-cyan-100 hover:bg-[#0a0920]/80">
							<div className="flex items-center gap-3">
								<span className="text-lg" aria-hidden>{iconForResult(item)}</span>
								<div>
									<button
										type="button"
										onClick={() => onOpen(item)}
										className="text-left font-medium text-emerald-200 hover:text-emerald-100"
									>
										{highlight(item.name, normalizedQuery)}
									</button>
									<div className="text-[10px] text-[#4c4a6a]">{item.path}</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => onReveal(item)}
									className={clsx('rounded border border-emerald-400/40 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-emerald-200 hover:bg-emerald-500/10')}
								>
									Reveal
								</button>
							</div>
						</li>
					))}
					{results.length === 0 && (
						<li className="px-4 py-6 text-center text-[11px] text-[#3d3b5a]">
							No matching files or folders.
						</li>
					)}
				</ul>
			</div>
		</section>
	);
};

export default SearchResultsPanel;
