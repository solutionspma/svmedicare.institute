"use client";

export function CallControls(props: {
  phase: "idle" | "connecting" | "live" | "paused" | "complete";
  canStart: boolean;
  micMuted: boolean;
  transcriptHidden: boolean;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
  onRetry: () => void;
  onToggleMute: () => void;
  onToggleTranscript: () => void;
}) {
  const { phase } = props;
  return (
    <div className="flex flex-wrap gap-2">
      {phase === "idle" || phase === "complete" ? (
        <button
          type="button"
          disabled={!props.canStart}
          onClick={props.onStart}
          className="rounded-sm border border-[var(--border-gold)] bg-[var(--gold-accent)]/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--gold-accent)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start call
        </button>
      ) : null}
      {phase === "live" || phase === "paused" ? (
        <>
          <button
            type="button"
            onClick={props.onPause}
            className="rounded-sm border border-amber-700/45 bg-amber-950/25 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-amber-200/90"
          >
            {phase === "paused" ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={props.onEnd}
            className="rounded-sm border border-red-800/55 bg-red-950/30 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.15em] text-red-200/90"
          >
            End call
          </button>
        </>
      ) : null}
      {phase === "connecting" ? (
        <span className="rounded-sm border border-[var(--border-gold)]/30 px-4 py-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Establishing secure realtime…
        </span>
      ) : null}
      <button
        type="button"
        onClick={props.onToggleMute}
        disabled={phase !== "live" && phase !== "paused"}
        className="rounded-sm border border-[var(--border-gold)]/35 px-3 py-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)] disabled:opacity-40"
      >
        {props.micMuted ? "Unmute" : "Mute"} mic
      </button>
      <button
        type="button"
        onClick={props.onToggleTranscript}
        className="rounded-sm border border-[var(--border-gold)]/35 px-3 py-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
      >
        {props.transcriptHidden ? "Show" : "Hide"} transcript
      </button>
      {phase === "complete" ? (
        <button
          type="button"
          onClick={props.onRetry}
          className="rounded-sm border border-[var(--border-gold)]/35 px-3 py-2 text-[10px] uppercase tracking-wider text-[var(--gold-accent)]"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
