"use client";

type AICallDebriefProps = {
  score: number;
  violations: string[];
  missedSteps: string[];
  coachingFeedback: string;
  suggestedResponses: string[];
  onRetry: () => void;
  analyzing?: boolean;
  analysisError?: string | null;
};

export function AICallDebrief({
  score,
  violations,
  missedSteps,
  coachingFeedback,
  suggestedResponses,
  onRetry,
  analyzing = false,
  analysisError = null,
}: AICallDebriefProps) {
  const scoreTone =
    score >= 80 ? "text-emerald-500/90" : score >= 60 ? "text-amber-500/85" : "text-red-500/80";

  return (
    <div className="mt-6 rounded-sm border border-[var(--border-gold)]/35 bg-black/40 p-6 shadow-[var(--shadow-layered)]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-gold)]/20 pb-4">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Post-call briefing
          </p>
          <h3 className="font-display text-lg uppercase tracking-wider text-[var(--text-primary)]">
            Compliance coaching
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Score</p>
          <p className={`font-mono text-3xl font-semibold tabular-nums ${scoreTone}`}>
            {analyzing ? "—" : Math.round(score)}
          </p>
        </div>
      </div>

      {analysisError && (
        <p className="mb-4 whitespace-pre-wrap rounded-sm border border-red-500/30 bg-red-950/20 px-3 py-2 text-sm leading-relaxed text-red-200/90">
          {analysisError}
        </p>
      )}

      {analyzing && (
        <p className="mb-4 animate-pulse text-sm text-[var(--text-muted)]">
          Running compliance audit on transcript…
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-500/80">
              Violations
            </h4>
            {violations.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">None flagged in this review.</p>
            ) : (
              <ul className="space-y-2 text-sm text-[var(--text-primary)]/90">
                {violations.map((v, i) => (
                  <li key={i} className="flex gap-2 border-l-2 border-red-500/40 pl-3">
                    {v}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--gold-accent)]">
              Missed steps
            </h4>
            {missedSteps.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No gaps identified.</p>
            ) : (
              <ul className="list-inside list-disc space-y-1 text-sm text-[var(--text-primary)]/85">
                {missedSteps.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <div className="space-y-4">
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Coaching
            </h4>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]/88">
              {coachingFeedback || "—"}
            </p>
          </section>
          <section>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Suggested responses
            </h4>
            {suggestedResponses.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">—</p>
            ) : (
              <ul className="space-y-2 text-sm text-[var(--text-primary)]/85">
                {suggestedResponses.map((s, i) => (
                  <li
                    key={i}
                    className="rounded-sm border border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)]/50 px-3 py-2"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-sm border border-[var(--border-gold)] bg-transparent px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-[var(--gold-accent)] transition-colors hover:bg-[var(--gold-accent)]/10"
        >
          Retry scenario
        </button>
      </div>
    </div>
  );
}
