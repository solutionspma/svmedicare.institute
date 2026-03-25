"use client";

import type { ViolationAggregate } from "@/types/adminMetrics";

export function ViolationSummaryPanel({ items }: { items: ViolationAggregate[] }) {
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Top violations
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-4 text-xs text-[var(--text-primary)]/88">
        {items.map((v, i) => (
          <li key={i}>
            {v.label} <span className="text-[var(--gold-accent)]">({v.count})</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
