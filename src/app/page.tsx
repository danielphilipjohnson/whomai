"use client";

import CyberpunkDesktop from "@/components/CyberpunkDesktop";
import BootScreen from "@/components/BootScreen";
import CyberpunkLogin from "@/components/CyberpunkLogin";
import { useBootSequence } from "@/hooks/useBootSequence";
import { useSession } from "@/hooks/useSession";

export default function Home() {
  const { user, login } = useSession();
  const { booting, beginBoot, finishBoot } = useBootSequence();

  const handleLogin = (name: string) => {
    login({ name });
    beginBoot();
  };

  if (!user) {
    return <CyberpunkLogin onSubmit={handleLogin} />;
  }

  if (booting) {
    return <BootScreen onComplete={finishBoot} />;
  }

  return <CyberpunkDesktop />;
}
