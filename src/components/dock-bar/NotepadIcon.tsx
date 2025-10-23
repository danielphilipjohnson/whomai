import { cn } from "@/lib/utils";

interface NotepadIconProps {
  showNotepad: boolean;
  toggleNotepad: () => void;
}

const NotepadIcon = ({ showNotepad, toggleNotepad }: NotepadIconProps) => {
  return (
    <button
      onClick={toggleNotepad}
      className={cn(
        "w-12 h-12 md:w-28 md:h-28 mx-2.5 rounded-lg bg-black/60 flex justify-center items-center cursor-pointer transition-all duration-200 border relative",
        showNotepad
          ? "border-green-400 shadow-[0_0_15px_rgba(0,255,128,0.5)]"
          : "border-transparent hover:border-green-400 hover:shadow-[0_0_15px_rgba(0,255,128,0.5)] hover:scale-110"
      )}
      aria-label="Toggle Notepad"
    >
      <svg
        className="w-16 h-16"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="8" fill="#0a0a0a" />
        <path
          d="M18 16h28v4H18v-4zm0 10h28v4H18v-4zm0 10h28v4H18v-4zm0 10h20v4H18v-4z"
          fill="#33FF99"
          stroke="#33FF99"
          strokeWidth="0.5"
        />
        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="6"
          stroke="#ffee33"
          strokeWidth="1.5"
        />
        <g opacity="0.3">
          <path d="M58 6v52M6 6v52" stroke="#ffee33" strokeDasharray="2 2" />
        </g>
      </svg>
    </button>
  );
};

export default NotepadIcon;
