"use client";

import type { ComplianceScore } from "@/types/compliance";

export function ComplianceScoreCard({ score }: { score: ComplianceScore | null }) {
  if (!score) {
    return (
      <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-4 text-xs text-[var(--text-muted)]">
        Score preview updates after a scored session.
      </div>
    );
  }
  const passColor =
    score.passLabel === "pass" ? "text-emerald-400/90" : score.passLabel === "conditional" ? "text-amber-400/90" : "text-red-400/85";
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/50 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Heuristic preview</p>
      <p className="mt-2 font-mono text-3xl tabular-nums text-[var(--gold-accent)]">{score.overall}</p>
      <p className={`mt-1 text-xs font-medium uppercase tracking-wider ${passColor}`}>{score.passLabel}</p>
      <dl className="mt-3 space-y-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        <div className="flex justify-between gap-2">
          <dt>Compliance</dt>
          <dd className="text-[var(--text-primary)]">{score.compliancePct}%</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Flow</dt>
          <dd className="text-[var(--text-primary)]">{score.flowPct}%</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Professionalism</dt>
          <dd className="text-[var(--text-primary)]">{score.professionalismPct}%</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Needs depth</dt>
          <dd className="text-[var(--text-primary)]">{score.needsPct}%</dd>
        </div>
      </dl>
    </div>
  );
}
