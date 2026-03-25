"use client";

import type { AdminAgentRow } from "@/types/adminMetrics";

export function AgentPerformanceTable({
  rows,
  onSelect,
}: {
  rows: AdminAgentRow[];
  onSelect?: (row: AdminAgentRow) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-sm border border-[var(--border-gold)]/30">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-[var(--border-gold)]/25 bg-black/40 font-display text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          <tr>
            <th className="px-3 py-2">Agent</th>
            <th className="px-3 py-2">Calls</th>
            <th className="px-3 py-2">Avg</th>
            <th className="px-3 py-2">Pass %</th>
            <th className="px-3 py-2">Last</th>
            <th className="px-3 py-2">Risk</th>
          </tr>
        </thead>
        <tbody className="text-[var(--text-primary)]/90">
          {rows.map((r) => (
            <tr
              key={r.userId}
              className="cursor-pointer border-b border-[var(--border-gold)]/15 hover:bg-black/25"
              onClick={() => onSelect?.(r)}
            >
              <td className="px-3 py-2 font-medium">{r.displayName}</td>
              <td className="px-3 py-2 tabular-nums">{r.callsCompleted}</td>
              <td className="px-3 py-2 tabular-nums text-[var(--gold-accent)]">{r.avgScore}</td>
              <td className="px-3 py-2 tabular-nums">{r.passRatePct}</td>
              <td className="px-3 py-2 text-[var(--text-muted)]">
                {new Date(r.lastActivity).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 uppercase tracking-wider">
                <span
                  className={
                    r.riskLevel === "high"
                      ? "text-red-400/90"
                      : r.riskLevel === "medium"
                        ? "text-amber-400/85"
                        : "text-emerald-400/85"
                  }
                >
                  {r.riskLevel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
