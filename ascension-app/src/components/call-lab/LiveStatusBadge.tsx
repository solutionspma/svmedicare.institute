"use client";

type SessionPhase = "idle" | "connecting" | "live" | "paused" | "complete";

export function LiveStatusBadge({ phase }: { phase: SessionPhase }) {
  const tone =
    phase === "live"
      ? "bg-emerald-600/90 shadow-[0_0_12px_rgba(34,197,94,0.35)]"
      : phase === "connecting"
        ? "bg-amber-500/90 animate-pulse"
        : phase === "paused"
          ? "bg-amber-600/70"
          : phase === "complete"
            ? "bg-[var(--text-muted)]/50"
            : "bg-[var(--text-muted)]/35";

  const label =
    phase === "live"
      ? "Live"
      : phase === "connecting"
        ? "Connecting"
        : phase === "paused"
          ? "Paused"
          : phase === "complete"
            ? "Complete"
            : "Standby";

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${tone}`} />
      <span className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</span>
    </div>
  );
}
