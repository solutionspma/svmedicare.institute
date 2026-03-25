"use client";

import type { AICallerProfileId } from "@/data/aiCallerProfiles";
import { aiCallerProfiles } from "@/data/aiCallerProfiles";

export function CallerProfileCard({ profileId }: { profileId: AICallerProfileId }) {
  const p = aiCallerProfiles.find((x) => x.id === profileId) ?? aiCallerProfiles[0];
  return (
    <div className="rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/55 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
        Synthetic caller
      </p>
      <p className="mt-2 font-display text-sm uppercase tracking-wide text-[var(--text-primary)]">{p.name}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">
        Tone: <span className="text-[var(--text-primary)]/90">{p.tone}</span>
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{p.personality}</p>
      <p className="mt-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        Modifier {(p.difficultyModifier * 100).toFixed(0)}%
      </p>
    </div>
  );
}
