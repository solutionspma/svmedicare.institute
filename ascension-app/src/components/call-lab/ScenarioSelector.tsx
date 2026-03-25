"use client";

import type { ScenarioDefinition } from "@/types/scenarioPack";

export function ScenarioSelector({
  scenarios,
  value,
  onChange,
}: {
  scenarios: ScenarioDefinition[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {scenarios.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          className={`rounded-sm border p-3 text-left transition-colors ${
            value === s.id
              ? "border-[var(--gold-accent)]/55 bg-[var(--gold-accent)]/8"
              : "border-[var(--border-gold)]/35 bg-black/25 hover:border-[var(--border-gold)]/55"
          }`}
        >
          <p className="font-display text-[9px] uppercase tracking-[0.15em] text-[var(--gold-accent)]">
            {s.difficulty ?? "scenario"} · {s.personality?.replace(/_/g, " ") ?? "persona"}
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--text-primary)]">{s.title}</p>
        </button>
      ))}
    </div>
  );
}
