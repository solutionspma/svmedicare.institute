"use client";

import { useMemo, useState } from "react";
import type { AgentSummary } from "@/types/agency";
import Link from "next/link";

type AgentPerformanceTableProps = {
  agents: AgentSummary[];
};

export function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
  const [statusFilter, setStatusFilter] = useState<"" | AgentSummary["certificationStatus"]>("");
  const [riskFilter, setRiskFilter] = useState<"" | AgentSummary["riskLevel"]>("");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return agents.filter((a) => {
      if (statusFilter && a.certificationStatus !== statusFilter) return false;
      if (riskFilter && a.riskLevel !== riskFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.fullName.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [agents, riskFilter, search, statusFilter]);

  const riskCls = (r: AgentSummary["riskLevel"]) =>
    r === "low"
      ? "text-emerald-400/90"
      : r === "medium"
        ? "text-amber-400/85"
        : "text-red-400/85";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name / email"
          className="min-w-[180px] flex-1 rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-3 py-2 text-sm text-[var(--text-primary)]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-3 py-2 text-sm text-[var(--text-primary)]"
        >
          <option value="">All certification states</option>
          <option value="pending">Pending</option>
          <option value="certified">Certified</option>
          <option value="expired">Expired</option>
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value as typeof riskFilter)}
          className="rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-3 py-2 text-sm text-[var(--text-primary)]"
        >
          <option value="">All risk levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-sm border border-[var(--border-gold)]/25">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-gold)]/20 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Progress</th>
              <th className="px-3 py-2">Avg score</th>
              <th className="px-3 py-2">Cert. status</th>
              <th className="px-3 py-2">Last activity</th>
              <th className="px-3 py-2">Risk</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-primary)]/90">
            {rows.map((a) => (
              <tr key={a.userId} className="border-b border-[var(--border-gold)]/10">
                <td className="px-3 py-2">
                  <span className="font-medium">{a.fullName}</span>
                  <span className="mt-0.5 block text-[10px] text-[var(--text-muted)]">{a.email}</span>
                </td>
                <td className="px-3 py-2">{a.rank}</td>
                <td className="px-3 py-2 font-mono tabular-nums">{a.trainingProgress}%</td>
                <td className="px-3 py-2 font-mono tabular-nums">{a.averageComplianceScore}</td>
                <td className="px-3 py-2 uppercase tracking-wide text-[var(--gold-accent)]/90">
                  {a.certificationStatus}
                </td>
                <td className="px-3 py-2 text-[var(--text-muted)]">
                  {new Date(a.lastActivity).toLocaleString()}
                </td>
                <td className={`px-3 py-2 font-semibold uppercase tracking-wide ${riskCls(a.riskLevel)}`}>
                  {a.riskLevel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-[var(--text-muted)]">
        Drill-down:{" "}
        <Link href="/training/call-lab" className="text-[var(--gold-accent)] hover:underline">
          Call Lab
        </Link>{" "}
        ·{" "}
        <Link href="/agency/audit" className="text-[var(--gold-accent)] hover:underline">
          Audit console
        </Link>
      </p>
    </div>
  );
}
