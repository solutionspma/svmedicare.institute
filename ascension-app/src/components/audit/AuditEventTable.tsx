"use client";

import type { AuditEvent } from "@/types/audit";

type AuditEventTableProps = {
  events: AuditEvent[];
  onSelect: (e: AuditEvent) => void;
};

const sev = (s: AuditEvent["severity"]) =>
  s === "critical"
    ? "text-red-400/90"
    : s === "warning"
      ? "text-amber-400/85"
      : "text-emerald-400/80";

export function AuditEventTable({ events, onSelect }: AuditEventTableProps) {
  return (
    <div className="overflow-x-auto rounded-sm border border-[var(--border-gold)]/25">
      <table className="w-full min-w-[960px] border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-[var(--border-gold)]/20 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            <th className="px-3 py-2">Time</th>
            <th className="px-3 py-2">Agent</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Severity</th>
            <th className="px-3 py-2">Description</th>
            <th className="px-3 py-2">Rule</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr
              key={e.id}
              onClick={() => onSelect(e)}
              className="cursor-pointer border-b border-[var(--border-gold)]/10 hover:bg-[var(--gold-accent)]/5"
            >
              <td className="whitespace-nowrap px-3 py-2 text-[var(--text-muted)]">
                {new Date(e.timestamp).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                <span className="text-[var(--text-primary)]">{e.userName}</span>
                <span className="mt-0.5 block font-mono text-[10px] text-[var(--text-muted)]">{e.userId}</span>
              </td>
              <td className="px-3 py-2">{e.category}</td>
              <td className="font-mono text-[10px] text-[var(--gold-accent)]/90">{e.eventType}</td>
              <td className={`px-3 py-2 font-semibold uppercase tracking-wide ${sev(e.severity)}`}>
                {e.severity}
              </td>
              <td className="max-w-xs px-3 py-2 text-[var(--text-primary)]/85">{e.description}</td>
              <td className="max-w-[140px] truncate px-3 py-2 text-[10px] text-[var(--text-muted)]">
                {e.relatedRule ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
