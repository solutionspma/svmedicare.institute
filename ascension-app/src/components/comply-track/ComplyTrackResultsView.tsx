"use client";

import type { ComplianceStepId } from "@/lib/complyTrack/complianceChecklistEngine";
import { coachingLinesForMissedSteps } from "@/lib/complyTrack/coachingEngine";
import { STEP_LABELS } from "@/lib/complyTrack/stepLabels";

type Props = {
  scenarioName: string;
  percentage: number;
  passed: boolean;
  completed: number;
  total: number;
  missedSteps: ComplianceStepId[];
  onAgain: () => void;
  onHome: () => void;
};

export function ComplyTrackResultsView({
  scenarioName,
  percentage,
  passed,
  completed,
  total,
  missedSteps,
  onAgain,
  onHome,
}: Props) {
  const coaching = coachingLinesForMissedSteps(missedSteps);

  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/60 p-6 md:p-8">
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">Results</p>
        <h2 className="mt-2 font-display text-xl uppercase tracking-[0.1em] text-[var(--text-primary)]">{scenarioName}</h2>
        <div className="mt-6 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Score</p>
            <p className="font-mono text-4xl text-[var(--gold-accent)] tabular-nums">{percentage}%</p>
            <p className="text-sm text-[var(--text-muted)]">
              {completed} / {total} steps
            </p>
          </div>
          <div
            className={`rounded-sm border px-4 py-2 text-sm font-semibold uppercase tracking-wider ${
              passed
                ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-200"
                : "border-amber-500/45 bg-amber-500/10 text-amber-100"
            }`}
          >
            {passed ? "Pass" : "Fail"}
          </div>
        </div>
      </div>

      {coaching.length ? (
        <div className="rounded-sm border border-[var(--border-gold)]/25 bg-black/30 p-5">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">Coaching (static)</p>
          <ul className="mt-3 space-y-3 text-sm text-[var(--text-primary)]/88">
            {missedSteps.map((id, i) => (
              <li key={id}>
                <span className="font-medium text-[var(--gold-accent)]">{STEP_LABELS[id]}:</span> {coaching[i]}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-[var(--text-muted)]">All required steps completed.</p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAgain}
          className="rounded-sm border border-[var(--gold-accent)]/45 bg-[var(--gold-accent)]/10 px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-[var(--gold-accent)] hover:bg-[var(--gold-accent)]/18"
        >
          Another scenario
        </button>
        <button
          type="button"
          onClick={onHome}
          className="rounded-sm border border-[var(--border-gold)]/40 px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-[var(--text-muted)] hover:border-[var(--border-gold)]/60 hover:text-[var(--text-primary)]"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
