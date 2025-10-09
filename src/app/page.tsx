"use client";

import CyberpunkDesktop from "@/components/CyberpunkDesktop";
import BootScreen from "@/components/BootScreen";
import { useBootSequence } from "@/hooks/useBootSequence";

export default function Home() {
  const { booting, finishBoot } = useBootSequence();

  if (booting) {
    return <BootScreen onComplete={finishBoot} />;
  }

  return <CyberpunkDesktop />;
}
