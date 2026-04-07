"use client";

import Link from "next/link";
import type { AgencyDashboardMetrics, AgentSummary } from "@/types/agency";
import { AgentPerformanceTable } from "@/components/agency/AgentPerformanceTable";
import { TrainingProgressPanel } from "@/components/agency/TrainingProgressPanel";
import { ComplianceRiskPanel } from "@/components/agency/ComplianceRiskPanel";
import { CertificationStatusPanel } from "@/components/agency/CertificationStatusPanel";

type AgencyDashboardProps = {
  metrics: AgencyDashboardMetrics;
  agents: AgentSummary[];
};

export function AgencyDashboard({ metrics, agents }: AgencyDashboardProps) {
  const avgProgress =
    agents.length > 0 ? Math.round(agents.reduce((s, a) => s + a.trainingProgress, 0) / agents.length) : 0;

  return (
    <div className="flex min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      <aside className="no-print hidden w-52 shrink-0 border-r border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)]/90 p-4 lg:block">
        <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">Command</p>
        <nav className="mt-6 flex flex-col gap-3 text-xs uppercase tracking-wider">
          <span className="text-[var(--gold-accent)]">Overview</span>
          <Link href="/agency/audit" className="text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            Audit console
          </Link>
          <Link href="/training/comply-track" className="text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            ComplyTrack
          </Link>
          <Link href="/verify" className="text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            Verify credential
          </Link>
        </nav>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <div className="border-b border-[var(--border-gold)]/15 bg-black/20 px-6 py-6">
          <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ["Total agents", metrics.totalAgents, "text-[var(--text-primary)]"],
                ["Active trainees", metrics.activeAgents, "text-emerald-400/90"],
                ["Avg compliance", `${metrics.averageComplianceScore}`, "text-[var(--gold-accent)]"],
                ["Certificates issued", metrics.certificatesIssued, "text-[var(--text-primary)]"],
                ["Expiring ≤45d", metrics.certificatesExpiringSoon, "text-amber-400/85"],
                ["High risk", metrics.highRiskAgents, "text-red-400/85"],
              ] as const
            ).map(([label, val, cls]) => (
              <div
                key={label}
                className="rounded-sm border border-[var(--border-gold)]/25 bg-[var(--bg-matte-elevated)]/50 px-4 py-3"
              >
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
                <p className={`mt-1 font-mono text-2xl tabular-nums ${cls}`}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 font-display text-sm uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  Agent performance
                </h2>
                <AgentPerformanceTable agents={agents} />
              </section>
              <section>
                <h2 className="mb-3 font-display text-sm uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  Training velocity
                </h2>
                <TrainingProgressPanel averageCompletion={avgProgress} />
              </section>
            </div>
            <div className="space-y-6">
              <CertificationStatusPanel agents={agents} />
              <ComplianceRiskPanel agents={agents} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
