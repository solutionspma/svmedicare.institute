"use client";

import type { ScenarioMetric } from "@/types/adminMetrics";

export function ScenarioPerformanceChart({ scenarios }: { scenarios: ScenarioMetric[] }) {
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Scenario difficulty
      </p>
      <ul className="mt-3 space-y-2 text-xs">
        {scenarios.map((s) => (
          <li key={s.scenarioId} className="flex items-center justify-between gap-2">
            <span className="truncate text-[var(--text-primary)]/88">{s.title}</span>
            <span className="shrink-0 tabular-nums text-amber-400/85">{s.failRatePct}% fail</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
