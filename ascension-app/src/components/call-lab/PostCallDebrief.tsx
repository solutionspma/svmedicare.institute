"use client";

export function PostCallDebrief(props: {
  score: number;
  passLabel: string;
  violations: string[];
  missedSteps: string[];
  coaching: string;
  suggestions: string[];
  analyzing: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const tone =
    props.passLabel === "pass" ? "text-emerald-400/90" : props.passLabel === "conditional" ? "text-amber-400/90" : "text-red-400/85";
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/35 bg-black/45 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-gold)]/20 pb-3">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Post-call debrief</p>
          <p className="font-display text-sm uppercase tracking-wide text-[var(--text-primary)]">Compliance review</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Model score</p>
          <p className="font-mono text-2xl tabular-nums text-[var(--gold-accent)]">{props.analyzing ? "—" : props.score}</p>
          <p className={`text-[10px] uppercase tracking-wider ${tone}`}>{props.passLabel}</p>
        </div>
      </div>
      {props.error ? (
        <p className="mt-3 whitespace-pre-wrap text-xs text-red-300/90">{props.error}</p>
      ) : null}
      {props.analyzing ? <p className="mt-3 animate-pulse text-xs text-[var(--text-muted)]">Auditing transcript…</p> : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section>
          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-red-400/85">Violations</h4>
          {props.violations.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)]">None flagged.</p>
          ) : (
            <ul className="space-y-1 text-xs text-[var(--text-primary)]/90">
              {props.violations.map((v, i) => (
                <li key={i} className="border-l-2 border-red-500/35 pl-2">
                  {v}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-amber-400/85">Missed steps</h4>
          {props.missedSteps.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)]">None listed.</p>
          ) : (
            <ul className="list-inside list-disc text-xs text-[var(--text-primary)]/85">
              {props.missedSteps.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <section className="mt-4">
        <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Coaching</h4>
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-[var(--text-primary)]/88">{props.coaching || "—"}</p>
      </section>
      {props.suggestions.length ? (
        <section className="mt-3">
          <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Better phrasing</h4>
          <ul className="space-y-1 text-xs text-[var(--text-primary)]/85">
            {props.suggestions.map((s, i) => (
              <li key={i} className="rounded-sm border border-[var(--border-gold)]/20 bg-black/25 px-2 py-1">
                {s}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <button
        type="button"
        onClick={props.onRetry}
        className="mt-4 rounded-sm border border-[var(--border-gold)]/40 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--gold-accent)]"
      >
        Retry scenario
      </button>
    </div>
  );
}
