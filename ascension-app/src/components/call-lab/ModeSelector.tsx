"use client";

export type CallLabUiMode = "guided" | "roleplay" | "ai-live";

export function ModeSelector({
  mode,
  onChange,
}: {
  mode: CallLabUiMode;
  onChange: (m: CallLabUiMode) => void;
}) {
  const opts: [CallLabUiMode, string][] = [
    ["guided", "Guided"],
    ["roleplay", "Roleplay"],
    ["ai-live", "AI Live Call"],
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {opts.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`rounded-sm border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
            mode === id
              ? "border-[var(--gold-accent)] bg-[var(--gold-accent)]/10 text-[var(--gold-accent)]"
              : "border-[var(--border-gold)]/35 text-[var(--text-muted)] hover:border-[var(--border-gold)]/55 hover:text-[var(--text-primary)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
