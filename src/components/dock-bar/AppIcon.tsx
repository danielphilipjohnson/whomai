import { cn } from "@/lib/utils";
import { AppMeta } from "@/lib/appRegistry";
import { useWindowStore } from "@/store/useWindowStore";

export const AppIcon = ({ app, onClick }: { app: AppMeta; onClick: () => void }) => {
  const { windows } = useWindowStore();
  const isRunning = windows[app.id as keyof typeof windows]?.visible;

  return (
    <div
      className={cn(
        "w-10 h-10 mx-1 md:w-28 md:h-28 rounded-lg bg-black/60 flex justify-center items-center cursor-pointer transition-all duration-200 border relative",
        isRunning
          ? "border-cyan-400 shadow-[0_0_15px_rgba(5,217,232,0.5)]"
          : "border-transparent hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(5,217,232,0.5)] hover:scale-110"
      )}
      onClick={onClick}
    >
      {typeof app.icon === "string" ? (
        <img src={app.icon} alt={app.name} className="w-24 h-24" />
      ) : (
        app.icon
      )}
      {isRunning && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_#00fff7]"></div>
      )}
    </div>
  );
};