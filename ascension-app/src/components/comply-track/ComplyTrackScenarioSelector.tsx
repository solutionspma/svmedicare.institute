"use client";

import type { ComplyTrackScenario } from "@/lib/complyTrack/scenarioEngine";

type Props = {
  scenarios: ComplyTrackScenario[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

function typeTag(t: ComplyTrackScenario["type"]): string {
  if (t === "outbound") return "Outbound";
  if (t === "event") return "Event";
  return "Inbound";
}

export function ComplyTrackScenarioSelector({
  scenarios,
  selectedId,
  onSelect,
  onContinue,
  onBack,
}: Props) {
  const selected = scenarios.find((s) => s.id === selectedId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[var(--text-primary)]">Scenario selector</h2>
        <button
          type="button"
          onClick={onBack}
          className="text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
        >
          ← Back
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className={`rounded-sm border p-4 text-left transition-colors ${
              selectedId === s.id
                ? "border-[var(--gold-accent)]/55 bg-[var(--gold-accent)]/8"
                : "border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/40 hover:border-[var(--border-gold)]/55"
            }`}
          >
            <p className="font-display text-[10px] uppercase tracking-[0.15em] text-[var(--gold-accent)]">{typeTag(s.type)}</p>
            <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{s.name}</p>
            {s.description ? <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{s.description}</p> : null}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!selectedId}
          onClick={onContinue}
          className="rounded-sm bg-[var(--gold-accent)]/90 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-95"
        >
          Start simulation
        </button>
      </div>
      {selected ? (
        <p className="text-xs text-[var(--text-muted)]">
          {selected.requiredComplianceSteps.length} required step
          {selected.requiredComplianceSteps.length === 1 ? "" : "s"} for this scenario.
        </p>
      ) : null}
    </div>
  );
}
