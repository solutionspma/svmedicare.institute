"use client";

import { LiveStatusBadge } from "./LiveStatusBadge";

export type HeaderPhase = "idle" | "connecting" | "live" | "paused" | "complete";

export function CallHeader(props: {
  scenarioTitle: string;
  elapsedLabel: string;
  modeLabel: string;
  callerLabel: string;
  difficultyLabel: string;
  phase: HeaderPhase;
}) {
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">Active scenario</p>
          <h2 className="font-display text-base uppercase tracking-wide text-[var(--text-primary)]">{props.scenarioTitle}</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            <span className="rounded border border-[var(--border-gold)]/35 px-2 py-0.5 text-[var(--text-primary)]/90">
              Mode: {props.modeLabel}
            </span>
            <span className="rounded border border-[var(--border-gold)]/35 px-2 py-0.5">{props.callerLabel}</span>
            <span className="rounded border border-[var(--border-gold)]/35 px-2 py-0.5">{props.difficultyLabel}</span>
          </div>
        </div>
        <div className="text-right">
          <LiveStatusBadge
            phase={props.phase === "paused" ? "paused" : props.phase === "complete" ? "complete" : props.phase}
          />
          <p className="mt-2 font-mono text-2xl tabular-nums text-[var(--gold-accent)]">{props.elapsedLabel}</p>
        </div>
      </div>
    </div>
  );
}
