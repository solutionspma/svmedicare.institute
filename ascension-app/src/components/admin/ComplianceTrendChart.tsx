"use client";

export function ComplianceTrendChart({ points }: { points: { label: string; score: number }[] }) {
  const max = Math.max(...points.map((p) => p.score), 1);
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Score trend (mock)
      </p>
      <div className="mt-4 flex h-28 items-end gap-2">
        {points.map((p) => (
          <div key={p.label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-gradient-to-t from-emerald-900/40 to-emerald-500/70"
              style={{ height: `${(p.score / max) * 100}%`, minHeight: "8px" }}
            />
            <span className="text-[9px] text-[var(--text-muted)]">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
