"use client";

import React, { useMemo, useState } from "react";
import {
  AlarmClockCheck,
  Copy,
  DatabaseZap,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Unlock,
} from "lucide-react";

type VaultModule = {
  id: string;
  title: string;
  summary: string;
  payload: string;
  sensitivity: "classified" | "restricted" | "internal";
};

type AccessAttempt = {
  timestamp: number;
  success: boolean;
  input: string;
};

const EXPECTED_PASSCODE = "SYNAPSE-9:BIOLOCK";

const modules: VaultModule[] = [
  {
    id: "neural-map",
    title: "Neural Map Archives",
    summary: "Schema describing Daniel's memory clusters and AI checkpoints.",
    payload: `{
  "subject": "Daniel",
  "neuralClusters": 12,
  "lastSync": "2039-10-07T04:22:11Z",
  "checkpoints": [
    { "id": "alpha", "status": "stable" },
    { "id": "delta", "status": "drifting" },
    { "id": "omega", "status": "sealed" }
  ]
}`,
    sensitivity: "classified",
  },
  {
    id: "signal-relay",
    title: "Quantum Signal Relay",
    summary: "Encrypted frequency handoffs for off-world couriers.",
    payload: `Relay Chain: CY-77 → HELIOS → MIRAGE
Passphrase Seed: ion://flux-144
Window: 23:57 - 00:09 UTC only
Fallback Node: disabled`,
    sensitivity: "restricted",
  },
  {
    id: "blackbox",
    title: "Black Box Fragments",
    summary: "Telemetry recovered after the Kernel breach incident.",
    payload: `EVENT-ID: KRN-BLK-442
TIMESTAMP: 2039-09-18T19:44:05Z
RUNTIME: 731s
ANOMALIES:
- unauthorized root escalation
- synthetic user 'mira.exe' spawned 12 threads
- vault integrity dipped to 71% for 4.8s`,
    sensitivity: "restricted",
  },
  {
    id: "failsafe",
    title: "Failsafe Directives",
    summary: "Emergency procedures if Vault integrity drops below 60%.",
    payload: `Failover ladder:
1. Trigger quantum mirror & snapshot filesystem state.
2. Broadcast distress pulse on channel 9C-VOID.
3. Revoke all session keys except root.
4. Queue Mira for containment sandbox.
5. Await manual override.`,
    sensitivity: "internal",
  },
];

const sensitivityBadge: Record<VaultModule["sensitivity"], string> = {
  classified: "bg-neon-red/20 text-neon-red border-neon-red/50",
  restricted: "bg-neon-purple/15 text-neon-purple border-neon-purple/50",
  internal: "bg-neon-green/15 text-neon-green border-neon-green/50",
};

const formatTimestamp = (value?: number) =>
  value ? new Date(value).toLocaleTimeString() : "--";

const VaultWindow: React.FC = () => {
  const [passcode, setPasscode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [attempts, setAttempts] = useState<AccessAttempt[]>([]);
  const [selectedModule, setSelectedModule] = useState<VaultModule | null>(modules[0]);

  const failedAttempts = attempts.filter((attempt) => !attempt.success).length;
  const isLocked = !authorized && failedAttempts >= 5;
  const lastOverrideTs = attempts.find((attempt) => attempt.success)?.timestamp;

  const statusMessage = useMemo(() => {
    if (authorized) return "Access level: Root. Vault lattice stabilized.";
    if (isLocked) return "Vault sealed. Too many invalid strikes.";
    if (attempts.length) return "Awaiting valid passphrase.";
    return "Reactor latent. Provide passphrase to begin handshake.";
  }, [authorized, isLocked, attempts.length]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLocked || authorized) return;

    const sanitized = passcode.trim();
    const success = sanitized.toUpperCase() === EXPECTED_PASSCODE;

    setAttempts((prev) => [
      { timestamp: Date.now(), success, input: sanitized },
      ...prev.slice(0, 9),
    ]);

    if (success) {
      setAuthorized(true);
      setPasscode("");
    } else {
      setPasscode("");
    }
  };

  const handleCopyPayload = async (payload: string) => {
    try {
      await navigator.clipboard.writeText(payload);
    } catch (error) {
      console.error("Unable to copy payload", error);
    }
  };

  const maskedInput = (value: string) =>
    value ? `${value.slice(0, 2).toUpperCase()}${"•".repeat(Math.max(value.length - 2, 0))}` : "";

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#04020a] text-[11px] font-mono text-cyan-200">
      <header className="border-b border-neon-green/40 bg-gradient-to-r from-black/80 via-black/60 to-black/80 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-neon-green">
              <ShieldCheck className="h-4 w-4" /> Vault Core
            </div>
            <h1 className="mt-2 text-lg font-semibold text-neon-green">ACCESS CONTROL INTERFACE</h1>
            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-cyan-500/80">
              {statusMessage}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-[10px]">
            <span className="text-cyan-400/80">Strikes: {failedAttempts}/5</span>
            <span className="text-cyan-500/60">Session key: {authorized ? "ACTIVE" : "PENDING"}</span>
          </div>
        </div>
      </header>

      {!authorized ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
          <div className="max-w-md space-y-4">
            <p className="text-sm text-cyan-200/90">
              Enter the biolock passphrase to unseal high-security sectors. Five failed attempts will trigger a quantum lock.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  disabled={isLocked}
                  placeholder="EX: SYNAPSE-9:BIOLOCK"
                  className="w-full rounded border border-neon-green/40 bg-black/60 px-3 py-2 text-center text-sm text-neon-green outline-none transition focus:border-neon-blue focus:shadow-[0_0_12px_rgba(57,255,20,0.45)] disabled:cursor-not-allowed"
                  autoFocus
                />
                <KeyRound className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neon-green/60" />
              </div>
              <button
                type="submit"
                disabled={isLocked || !passcode.trim()}
                className="w-full rounded border border-neon-green/40 bg-neon-green/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-neon-green transition hover:bg-neon-green/30 disabled:opacity-40"
              >
                Initiate Handshake
              </button>
            </form>
            <div className="rounded border border-cyan-700/40 bg-black/50 p-3 text-left text-[10px] text-cyan-400/80">
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-3.5 w-3.5" />
                <span className="uppercase tracking-[0.3em]">Audit Trail</span>
              </div>
              <ul className="mt-2 space-y-1">
                {attempts.map((attempt) => (
                  <li
                    key={attempt.timestamp}
                    className={`flex items-center justify-between ${attempt.success ? "text-neon-green" : "text-red-400/90"}`}
                  >
                    <span>{formatTimestamp(attempt.timestamp)}</span>
                    <span>{attempt.success ? "override" : maskedInput(attempt.input)}</span>
                  </li>
                ))}
                {!attempts.length && <li className="text-cyan-700/70">no attempts logged</li>}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 flex-col gap-4 p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded border border-neon-green/40 bg-black/40 p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-neon-green">
                <Unlock className="h-3.5 w-3.5" />
                Status
              </div>
              <p className="mt-2 text-xs text-neon-green/90">Vault lattice synced. Decryption mesh stable.</p>
            </div>
            <div className="rounded border border-neon-purple/40 bg-black/40 p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-neon-purple">
                <DatabaseZap className="h-3.5 w-3.5" />
                Modules
              </div>
              <p className="mt-2 text-xs text-neon-purple/90">{modules.length} encrypted sectors mounted.</p>
            </div>
            <div className="rounded border border-cyan-500/40 bg-black/40 p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan-400">
                <AlarmClockCheck className="h-3.5 w-3.5" />
                Last override
              </div>
              <p className="mt-2 text-xs text-cyan-200/90">{formatTimestamp(lastOverrideTs)}</p>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
            <aside className="flex w-full min-h-[16rem] flex-col gap-3 rounded border border-cyan-800/50 bg-black/30 p-3 md:w-72">
              <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/70">Secure sectors</div>
              <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setSelectedModule(module)}
                    className={`w-full rounded border px-3 py-2 text-left transition ${
                      selectedModule?.id === module.id
                        ? "border-neon-blue/60 bg-neon-blue/10"
                        : "border-cyan-800/50 bg-black/30 hover:border-neon-blue/40 hover:bg-neon-blue/5"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-cyan-500/70">
                      <span>{module.title}</span>
                      <span className={`rounded border px-2 py-px text-[9px] uppercase ${sensitivityBadge[module.sensitivity]}`}>
                        {module.sensitivity}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-cyan-200/90">{module.summary}</p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="flex min-h-[16rem] flex-1 flex-col rounded border border-cyan-800/50 bg-black/30">
              <div className="flex items-center gap-2 border-b border-cyan-800/50 px-4 py-3">
                <div className="flex flex-col text-[10px] uppercase tracking-[0.3em] text-cyan-500/70">
                  <span>{selectedModule?.title ?? "Select a module"}</span>
                  <span className="text-cyan-700/70">Vault entry #{selectedModule?.id ?? "--"}</span>
                </div>
                <span className={`ml-auto rounded border px-2 py-1 text-[9px] uppercase ${selectedModule ? sensitivityBadge[selectedModule.sensitivity] : "border-cyan-800/40 text-cyan-500/60"}`}>
                  {selectedModule?.sensitivity ?? "-"}
                </span>
                {selectedModule && (
                  <button
                    type="button"
                    onClick={() => handleCopyPayload(selectedModule.payload)}
                    className="ml-2 flex items-center gap-1 rounded border border-cyan-700/50 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-cyan-200 transition hover:border-neon-blue hover:text-neon-blue"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                )}
              </div>
              <pre className="flex-1 min-h-0 overflow-y-auto whitespace-pre-wrap bg-black/50 px-4 py-4 text-[11px] leading-relaxed text-neon-green/90">
                {selectedModule?.payload ?? "Select a module to inspect its payload."}
              </pre>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultWindow;
