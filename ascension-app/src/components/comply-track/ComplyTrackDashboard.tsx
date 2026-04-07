"use client";

import Link from "next/link";

type SessionPreview = {
  scenarioName: string;
  at: string;
  percentage: number;
  passed: boolean;
} | null;

type Props = {
  lastSession: SessionPreview;
  onStart: () => void;
};

export function ComplyTrackDashboard({ lastSession, onStart }: Props) {
  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/50 p-6 md:p-8">
        <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">ComplyTrack</p>
        <h1 className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-[var(--text-primary)] md:text-3xl">
          Static compliance practice
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
          Walk through scripted scenarios with a simulated call shell and a fixed checklist. There is no voice, no AI, and no
          external services—only local rules and your confirmations.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-8 rounded-sm bg-[var(--gold-accent)]/90 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-95"
        >
          Choose scenario
        </button>
      </div>

      {lastSession ? (
        <div className="rounded-sm border border-[var(--border-gold)]/25 bg-black/30 p-5">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Last session</p>
          <p className="mt-2 text-sm text-[var(--text-primary)]">
            <span className="text-[var(--gold-accent)]">{lastSession.scenarioName}</span>
            <span className="text-[var(--text-muted)]"> · {new Date(lastSession.at).toLocaleString()}</span>
          </p>
          <p className="mt-1 font-mono text-sm">
            {lastSession.percentage}% · {lastSession.passed ? "Pass" : "Fail"}
          </p>
        </div>
      ) : (
        <p className="text-xs text-[var(--text-muted)]">Complete a session to see history here (stored in this browser only).</p>
      )}

      <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wider text-[var(--text-muted)]">
        <Link href="/dashboard" className="text-[var(--gold-accent)] hover:underline">
          ← Command deck
        </Link>
      </div>
    </div>
  );
}
