"use client";

import type { ScenarioType } from "@/lib/complyTrack/scenarioEngine";

function formatMmSs(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function typeLabel(t: ScenarioType): string {
  if (t === "outbound") return "Outbound";
  if (t === "event") return "Event";
  return "Inbound";
}

type Props = {
  callerName: string;
  callerSubtitle: string;
  scenarioType: ScenarioType;
  callActive: boolean;
  elapsedMs: number;
  onAccept: () => void;
  onDecline: () => void;
  onEndSession: () => void;
};

export function CallSimulationView({
  callerName,
  callerSubtitle,
  scenarioType,
  callActive,
  elapsedMs,
  onAccept,
  onDecline,
  onEndSession,
}: Props) {
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/35 bg-black/35 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
            Simulated session
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{typeLabel(scenarioType)} · no audio · rule-based only</p>
        </div>
        <div
          className="rounded-sm border border-[var(--border-gold)]/40 bg-[var(--bg-matte-elevated)] px-4 py-2 font-mono text-lg tabular-nums text-[var(--gold-accent)]"
          aria-live="polite"
        >
          {formatMmSs(elapsedMs)}
        </div>
      </div>

      <div className="mx-auto max-w-md flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--border-gold)]/45 bg-[var(--bg-matte-elevated)]/60 text-[var(--gold-accent)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <p className="font-display text-lg uppercase tracking-[0.12em] text-[var(--text-primary)]">{callerName}</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{callerSubtitle}</p>
        <p className="mt-4 text-sm text-[var(--text-primary)]/85">Incoming simulated call — practice your opening and checklist.</p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {!callActive ? (
          <>
            <button
              type="button"
              onClick={onAccept}
              className="rounded-sm bg-emerald-600/90 px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-95"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={onDecline}
              className="rounded-sm border border-red-500/50 bg-red-500/10 px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-red-200/90 transition-colors hover:border-red-400/60"
            >
              Decline
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onEndSession}
            className="rounded-sm border border-[var(--gold-accent)]/50 bg-[var(--gold-accent)]/15 px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-[var(--gold-accent)] transition-colors hover:bg-[var(--gold-accent)]/25"
          >
            End session &amp; score
          </button>
        )}
      </div>
    </div>
  );
}
