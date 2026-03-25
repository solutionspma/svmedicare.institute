"use client";

import { useMemo } from "react";
import type { AgentSummary } from "@/types/agency";
import { getAuditEvents } from "@/services/auditLogger";

type ComplianceRiskPanelProps = {
  agents: AgentSummary[];
};

export function ComplianceRiskPanel({ agents }: ComplianceRiskPanelProps) {
  const violations = useMemo(() => {
    return getAuditEvents({ category: "call-simulation", severity: "warning" }).slice(0, 6);
  }, []);

  const topTypes = useMemo(() => {
    const map = new Map<string, number>();
    getAuditEvents({ category: "call-simulation" }).forEach((e) => {
      map.set(e.eventType, (map.get(e.eventType) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, []);

  const remediation = agents.filter((a) => a.riskLevel === "high" || a.averageComplianceScore < 82);

  return (
    <div className="space-y-4">
      <div className="rounded-sm border border-[var(--border-gold)]/35 bg-black/30 p-4">
        <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-red-300/85">
          Violation signals
        </h3>
        <ul className="mt-3 space-y-2 text-[11px] text-[var(--text-primary)]/85">
          {violations.length === 0 ? (
            <li className="text-[var(--text-muted)]">No recent simulation flags in ledger.</li>
          ) : (
            violations.map((v) => (
              <li key={v.id} className="border-l-2 border-amber-600/50 pl-2">
                {v.description}
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/25 p-4">
        <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Top event types
        </h3>
        <ul className="mt-2 space-y-1 font-mono text-[10px] text-[var(--gold-accent)]/90">
          {topTypes.map(([k, n]) => (
            <li key={k}>
              {k} · {n}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-sm border border-red-900/25 bg-red-950/15 p-4">
        <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-red-300/85">
          Remediation queue
        </h3>
        <ul className="mt-2 space-y-2 text-xs">
          {remediation.length === 0 ? (
            <li className="text-[var(--text-muted)]">No agents flagged for mandatory review.</li>
          ) : (
            remediation.map((a) => (
              <li key={a.userId} className="flex flex-wrap items-center gap-2">
                <span className="text-[var(--text-primary)]">{a.fullName}</span>
                <span className="rounded border border-red-800/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-red-300/90">
                  At-risk
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
