"use client";

import * as React from "react";
import { useClock } from "@/hooks/useClock";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, RefreshCw, Settings2, SunMoon, User2 } from "lucide-react";
import { useBootSequence } from "@/hooks/useBootSequence";
import { useSession } from "@/hooks/useSession";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const Topbar = () => {
  const currentTime = useClock();
  const { beginBoot } = useBootSequence();
  const { user, logout } = useSession();
  const [themeDialogOpen, setThemeDialogOpen] = React.useState(false);

  const timeString = format(currentTime, "HH:mm");
  const dateString = format(currentTime, "EEE, MMM d");

  const identity = React.useMemo(() => {
    if (!user) {
      return {
        name: "Awaiting Login",
        email: "guest@void.os",
        isGuest: true,
      };
    }
    return {
      name: user.name,
      email: `${user.name.replace(/\s+/g, "").toLowerCase()}@void.os`,
      isGuest: false,
    };
  }, [user]);

  const handleReboot = React.useCallback(() => {
    if (!identity.isGuest) {
      beginBoot();
    }
  }, [beginBoot, identity.isGuest]);

  const handleLogout = React.useCallback(() => {
    logout();
  }, [logout]);

  return (
    <>
      <div className="z-20 flex h-12 items-center justify-between border-b border-cyan-400 bg-black/80 px-4 font-mono text-xs tracking-wide text-cyan-300 shadow-[0_0_6px_#00fff7] backdrop-blur-md md:h-8">
      <div className="flex items-center md:space-x-3">
        <span className="text-green-400 opacity-60">[VOID-OS v2.0.77]</span>
        <span className="animate-pulse text-pink-400">:: ACTIVE</span>
      </div>

      <div className="hidden items-center gap-6 text-cyan-200 md:flex">
        <div className="flex items-center gap-1 border-l border-cyan-500 pl-2">
          <svg className="h-3.5 w-3.5 animate-pulse text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span>100%</span>
        </div>

        <div className="hidden items-center gap-1 border-l border-cyan-500 pl-2 md:flex">
          <svg className="h-3.5 w-3.5 animate-flicker text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>100%</span>
        </div>

        <div className="flex items-center gap-1 border-l border-cyan-500 pl-2">
          <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <span className="text-green-300">Connected</span>
        </div>
      </div>

      <div className="flex items-center gap-3 border-l border-cyan-500 pl-3 text-cyan-400">
        {identity.isGuest ? (
          <GuestBadge label={identity.name} />
        ) : (
          <AccountDropdown
            user={identity}
            onReboot={handleReboot}
            onLogout={handleLogout}
            onOpenThemeSwitcher={() => setThemeDialogOpen(true)}
          />
        )}
        <div className="text-right">
          {timeString} <span className="hidden md:inline">• {dateString}</span>
        </div>
      </div>
      </div>

      <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
        <DialogContent className="max-w-2xl border border-neon-purple/40 bg-black/90 shadow-[0_0_35px_rgba(188,19,254,0.35)]">
          <DialogHeader>
            <DialogTitle className="text-sm uppercase tracking-[0.35em] text-neon-purple">
              Select Environment
            </DialogTitle>
          </DialogHeader>
          <ThemeSwitcher onSelect={() => setThemeDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

type UserSummary = {
  name: string;
  email: string;
  isGuest?: boolean;
};

type AccountDropdownProps = {
  user: UserSummary;
  onReboot: () => void;
  onLogout: () => void;
  onOpenThemeSwitcher: () => void;
};

const AccountDropdown = ({ user, onReboot, onLogout, onOpenThemeSwitcher }: AccountDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        title="Open command menu"
        className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-left font-mono text-[11px] tracking-wide text-cyan-200 transition hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full border border-cyan-500/40 bg-black/60">
          <User2 className="h-3.5 w-3.5" />
        </span>
        <span className="hidden md:block">{user.name}</span>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="bottom" align="end">
      <DropdownMenuLabel>
        <div className="flex flex-col gap-1 text-cyan-200">
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/70">{user.email}</span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          onOpenThemeSwitcher();
        }}
      >
        <SunMoon className="h-3.5 w-3.5" />
        Theme Switcher
        <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          onReboot();
        }}
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Reboot System
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          onLogout();
        }}
      >
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled className="cursor-default opacity-100">
        <Settings2 className="h-3.5 w-3.5 text-cyan-400" />
        <span className="flex flex-col text-left text-[10px] uppercase tracking-[0.3em] text-cyan-400/80">
          <span>System shell</span>
          <span className="text-cyan-500/80">Access privileges: root</span>
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

type GuestBadgeProps = {
  label: string;
};

const GuestBadge = ({ label }: GuestBadgeProps) => (
  <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-400">
    {label}
  </div>
);

export default Topbar;
