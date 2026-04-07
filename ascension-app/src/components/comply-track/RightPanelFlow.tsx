"use client";

import type { ChecklistState, ComplianceStepId } from "@/lib/complyTrack/complianceChecklistEngine";
import { orderedStepsForScenario, STEP_LABELS } from "@/lib/complyTrack/stepLabels";

type Props = {
  requiredSteps: ComplianceStepId[];
  checklist: ChecklistState;
  onToggle: (id: ComplianceStepId) => void;
  onMarkComplete: (id: ComplianceStepId) => void;
  disabled?: boolean;
  readOnly?: boolean;
};

export function RightPanelFlow({
  requiredSteps,
  checklist,
  onToggle,
  onMarkComplete,
  disabled,
  readOnly,
}: Props) {
  const ordered = orderedStepsForScenario(requiredSteps);

  return (
    <aside
      className="flex h-full min-h-[320px] flex-col rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/80"
      aria-label="Required compliance steps"
    >
      <div className="border-b border-[var(--border-gold)]/25 px-4 py-3">
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
          Required steps
        </p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Complete in order—tap to check or use Mark complete.
        </p>
      </div>
      <ol className="flex-1 list-none space-y-2 overflow-y-auto p-4">
        {ordered.length === 0 ? (
          <li className="text-sm text-[var(--text-muted)]">Select a scenario to load required steps.</li>
        ) : null}
        {ordered.map((id, index) => {
          const done = checklist[id];
          return (
            <li
              key={id}
              className={`rounded-sm border px-3 py-2.5 transition-colors ${
                done
                  ? "border-emerald-500/35 bg-emerald-500/5"
                  : "border-[var(--border-gold)]/30 bg-black/25"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-[10px] text-[var(--text-muted)]">{index + 1}.</span>
                <div className="min-w-0 flex-1">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={done}
                      disabled={disabled || readOnly}
                      onChange={() => onToggle(id)}
                      className="h-4 w-4 shrink-0 rounded border-[var(--border-gold)]/50 bg-black/40 text-[var(--gold-accent)] focus:ring-[var(--gold-accent)] disabled:cursor-not-allowed"
                    />
                    <span
                      className={`text-sm font-medium leading-snug ${
                        done ? "text-[var(--text-primary)]/75 line-through" : "text-[var(--text-primary)]"
                      }`}
                    >
                      {STEP_LABELS[id]}
                    </span>
                  </label>
                  {!readOnly ? (
                    <button
                      type="button"
                      disabled={disabled || done}
                      onClick={() => onMarkComplete(id)}
                      className="mt-2 rounded-sm border border-[var(--border-gold)]/40 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:border-[var(--gold-accent)]/45 hover:text-[var(--gold-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Mark complete
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
