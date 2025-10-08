import { cn } from "@/lib/utils";

export const StartMenuIcon = ({ onClick }: { onClick: () => void }) => {
	return (
		<div
			className={cn(
				"w-12 h-12 md:w-28 md:h-28 mx-2.5 rounded-lg bg-black/60 flex justify-center items-center cursor-pointer transition-all duration-200 border border-transparent hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(5,217,232,0.5)] hover:scale-110"
			)}
			onClick={onClick}
		>
			<svg className="w-24 h-24" width="96" height="96" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none">
				<rect width="64" height="64" rx="8" fill="#0a0a0a" />
				<rect x="6" y="6" width="52" height="52" rx="6" stroke="#00ffe0" strokeWidth="1.5" />
				<g opacity="0.3">
					<path d="M58 6v52M6 6v52" stroke="#00ffe0" strokeDasharray="2 2" />
				</g>
			</svg>
		</div>
	);
};