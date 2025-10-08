import { cn } from "@/lib/utils";
import { KernelSvg } from "@/lib/svgIcons";

export const KernelIcon = ({ showKernel, toggleKernel }: { showKernel: boolean, toggleKernel: () => void }) => {
	return (
		<div
			className={cn(
				"w-12 h-12 md:w-28 md:h-28 mx-2.5 rounded-lg bg-black/60 flex justify-center items-center cursor-pointer transition-all duration-200 border relative",
				showKernel 
					? "border-cyan-400 shadow-[0_0_15px_rgba(5,217,232,0.5)]" 
					: "border-transparent hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(5,217,232,0.5)] hover:scale-110"
			)}
			onClick={toggleKernel}
		>
			{KernelSvg}

			{showKernel && (
				<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_#00fff7]"></div>
			)}
		</div>
	);
};