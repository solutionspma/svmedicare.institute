"use client";

export type TranscriptRow = {
  role: "AGENT" | "BENEFICIARY" | "SYSTEM";
  text: string;
  at: number;
};

function formatTs(at: number): string {
  const d = new Date(at);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

export function CallTranscriptPanel({ lines, hidden }: { lines: TranscriptRow[]; hidden?: boolean }) {
  if (hidden) {
    return (
      <div className="rounded-sm border border-[var(--border-gold)]/25 bg-black/30 p-4 text-center text-xs text-[var(--text-muted)]">
        Transcript hidden
      </div>
    );
  }

  return (
    <div className="flex max-h-[min(360px,45vh)] flex-col rounded-sm border border-[var(--border-gold)]/30 bg-black/40">
      <p className="shrink-0 border-b border-[var(--border-gold)]/25 px-3 py-2 font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Transcript log
      </p>
      <div className="min-h-0 flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed">
        {lines.length === 0 ? (
          <p className="text-[var(--text-muted)]">No turns yet.</p>
        ) : (
          <ul className="space-y-3">
            {lines.map((line, i) => (
              <li key={`${line.at}-${i}`} className="border-l-2 border-[var(--border-gold)]/20 pl-2">
                <span className="text-[var(--text-muted)]/80">{formatTs(line.at)}</span>{" "}
                <span
                  className={
                    line.role === "AGENT"
                      ? "text-[var(--gold-accent)]/90"
                      : line.role === "BENEFICIARY"
                        ? "text-emerald-400/85"
                        : "text-amber-400/85"
                  }
                >
                  {line.role}
                </span>
                <span className="text-[var(--text-primary)]/88"> — {line.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
