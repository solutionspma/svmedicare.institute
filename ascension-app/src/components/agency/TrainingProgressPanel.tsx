"use client";

type TrainingProgressPanelProps = {
  averageCompletion: number;
  moduleCompleteHint?: string;
};

export function TrainingProgressPanel({ averageCompletion, moduleCompleteHint }: TrainingProgressPanelProps) {
  const trend = [62, 68, 74, 79, 84, averageCompletion || 82];
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/25 p-4">
      <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
        Training progress
      </h3>
      <p className="mt-1 text-2xl font-mono tabular-nums text-[var(--text-primary)]">{averageCompletion}%</p>
      <p className="text-[11px] text-[var(--text-muted)]">Blended completion index (modules + simulations)</p>
      <div className="mt-4 flex h-24 items-end gap-1">
        {trend.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gradient-to-t from-emerald-900/40 to-emerald-500/50"
            style={{ height: `${Math.max(6, Math.round((v / 100) * 96))}px` }}
            title={`${v}%`}
          />
        ))}
      </div>
      <p className="mt-3 text-[10px] text-[var(--text-muted)]">
        {moduleCompleteHint ??
          "Trends reflect command rollup; connect LMS feeds for module-level truth."}
      </p>
    </div>
  );
}
