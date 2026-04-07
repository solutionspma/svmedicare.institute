"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MOCK_ADMIN_SNAPSHOT } from "@/data/mockAdminMetrics";
import { buildAdminDashboardSnapshot } from "@/services/adminMetrics";
import type { AdminAgentRow, AdminSessionSummary } from "@/types/adminMetrics";
import { AgentDetailDrawer } from "./AgentDetailDrawer";
import { AgentPerformanceTable } from "./AgentPerformanceTable";
import { ComplianceTrendChart } from "./ComplianceTrendChart";
import { PremiumFeatureStatusPanel } from "./PremiumFeatureStatusPanel";
import { ScenarioPerformanceChart } from "./ScenarioPerformanceChart";
import { SessionReviewPanel } from "./SessionReviewPanel";
import { ViolationSummaryPanel } from "./ViolationSummaryPanel";

export function AdminComplyTrackDashboard() {
  const snap = useMemo(() => buildAdminDashboardSnapshot(), []);
  const [agent, setAgent] = useState<AdminAgentRow | null>(null);
  const [sessionNote, setSessionNote] = useState<AdminSessionSummary | null>(null);

  const trend = MOCK_ADMIN_SNAPSHOT.recentSessions.map((s, i) => ({
    label: `S${i + 1}`,
    score: s.score,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(
          [
            ["Trainees", snap.totalTrainees],
            ["Completed calls", snap.completedCalls],
            ["Avg score", snap.avgComplianceScore],
            ["Pass rate", `${snap.passRatePct}%`],
            ["Critical flags (period)", snap.criticalViolationsPeriod],
            ["Cert-ready", snap.certificationReadyCount],
          ] as const
        ).map(([label, val]) => (
          <div key={label} className="rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-4 py-3">
            <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</p>
            <p className="mt-1 font-mono text-2xl text-[var(--gold-accent)]">{val}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <AgentPerformanceTable rows={snap.agents} onSelect={(r) => setAgent(r)} />
          <ComplianceTrendChart points={trend.length ? trend : [{ label: "—", score: snap.avgComplianceScore }]} />
        </div>
        <div className="space-y-4">
          <ViolationSummaryPanel items={snap.violationTop} />
          <ScenarioPerformanceChart scenarios={snap.scenarioMetrics} />
          <PremiumFeatureStatusPanel />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SessionReviewPanel
          sessions={snap.recentSessions}
          onPick={(s) => {
            setSessionNote(s);
          }}
        />
        <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-4 text-xs text-[var(--text-muted)]">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
            Session detail
          </p>
          {sessionNote ? (
            <div className="mt-3 space-y-2 text-[var(--text-primary)]/88">
              <p>
                <span className="text-[var(--gold-accent)]">{sessionNote.agentName}</span> ·{" "}
                {sessionNote.scenarioTitle}
              </p>
              <p className="font-mono">
                Score {sessionNote.score} · {sessionNote.passLabel}
              </p>
              <p className="text-[var(--text-muted)]">{sessionNote.transcriptPreview}</p>
              <p className="text-[10px] uppercase text-[var(--text-muted)]">
                Demo metrics — ComplyTrack trainee sessions are local-only.
              </p>
            </div>
          ) : (
            <p className="mt-3">Select a session to preview.</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-wider">
        <Link href="/training/comply-track" className="text-[var(--gold-accent)] hover:underline">
          ← ComplyTrack
        </Link>
        <Link href="/agency/dashboard" className="text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
          Command
        </Link>
      </div>

      <AgentDetailDrawer agent={agent} onClose={() => setAgent(null)} />
    </div>
  );
}
