"use client";

import type { AdminSessionSummary } from "@/types/adminMetrics";

export function SessionReviewPanel({
  sessions,
  onPick,
}: {
  sessions: AdminSessionSummary[];
  onPick?: (s: AdminSessionSummary) => void;
}) {
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Recent sessions
      </p>
      <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-xs">
        {sessions.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onPick?.(s)}
              className="w-full rounded-sm border border-[var(--border-gold)]/20 bg-black/25 px-2 py-2 text-left transition-colors hover:border-[var(--gold-accent)]/35"
            >
              <span className="font-medium text-[var(--text-primary)]">{s.agentName}</span>
              <span className="text-[var(--text-muted)]"> · {s.scenarioTitle}</span>
              <span className="mt-1 block tabular-nums text-[var(--gold-accent)]">
                {s.score} · {s.passLabel}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">{s.transcriptPreview}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
