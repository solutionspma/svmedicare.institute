"use client";

import { useMemo } from "react";
import type { LeaderboardRow } from "@/services/trainingLeaderboardStore";
import { getLeaderboardRows } from "@/services/trainingLeaderboardStore";

type LeaderboardProps = {
  currentUserId: string;
};

export function Leaderboard({ currentUserId }: LeaderboardProps) {
  const rows = useMemo((): LeaderboardRow[] => getLeaderboardRows(), []);

  const top = useMemo(() => rows.slice(0, 8), [rows]);

  return (
    <aside className="rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/70 p-4 lg:sticky lg:top-6">
      <h2 className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-[var(--gold-accent)]">
        Top agents
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[240px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-gold)]/20 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              <th className="py-2 pr-2 font-medium">Rank</th>
              <th className="py-2 pr-2 font-medium">Agent</th>
              <th className="py-2 pr-2 font-medium">Score</th>
              <th className="py-2 font-medium">Avg RT</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-primary)]/90">
            {top.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-[var(--text-muted)]">
                  No sessions logged yet.
                </td>
              </tr>
            ) : (
              top.map((r) => {
                const self = r.userId === currentUserId;
                return (
                  <tr
                    key={r.userId}
                    className={`border-b border-[var(--border-gold)]/10 ${self ? "bg-[var(--gold-accent)]/5" : ""}`}
                  >
                    <td className="py-2 pr-2 font-mono tabular-nums text-[var(--gold-accent)]">{r.rank}</td>
                    <td className="py-2 pr-2">
                      {r.displayName}
                      {self ? (
                        <span className="ml-1 text-[10px] uppercase tracking-wider text-[var(--gold-accent)]">You</span>
                      ) : null}
                    </td>
                    <td className="py-2 pr-2 font-mono tabular-nums">{r.score}</td>
                    <td className="py-2 font-mono tabular-nums text-[var(--text-muted)]">{r.avgResponseTimeSec}s</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[10px] leading-snug text-[var(--text-muted)]">
        Rankings use average compliance score; ties broken by faster average agent response time (local training
        ledger).
      </p>
    </aside>
  );
}
