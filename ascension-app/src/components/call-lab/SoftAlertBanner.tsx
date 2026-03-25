"use client";

export function SoftAlertBanner({
  level,
  children,
}: {
  level: "info" | "warn" | "violation";
  children: React.ReactNode;
}) {
  const cls =
    level === "violation"
      ? "border-red-500/40 bg-red-950/25 text-red-100/90"
      : level === "warn"
        ? "border-amber-500/35 bg-amber-950/20 text-amber-100/85"
        : "border-[var(--border-gold)]/30 bg-black/30 text-[var(--text-muted)]";

  return (
    <div className={`rounded-sm border px-3 py-2 text-xs leading-snug ${cls}`} role="status">
      {children}
    </div>
  );
}
