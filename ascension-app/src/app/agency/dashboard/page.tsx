"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AgencyDashboard } from "@/components/agency/AgencyDashboard";
import { FEATURES } from "@/config/features";
import { useTrainingRole } from "@/hooks/useTrainingRole";
import { buildAgencyDashboardMetrics, buildAgentSummaries } from "@/services/agencyMetrics";

export default function AgencyCommandPage() {
  const { role, mounted, setTrainingRole } = useTrainingRole();
  const [rev, setRev] = useState(0);

  const { agents, metrics } = useMemo(() => {
    void rev;
    const a = buildAgentSummaries();
    return { agents: a, metrics: buildAgencyDashboardMetrics(a) };
  }, [rev]);

  if (!FEATURES.PLATFORM_AGENCY_COMMAND) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-[var(--text-muted)]">
        <p className="text-[var(--text-primary)]">Agency command center disabled.</p>
        <Link href="/dashboard" className="mt-6 inline-block text-[var(--gold-accent)]">
          Dashboard
        </Link>
      </div>
    );
  }

  if (mounted && role === "trainee") {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-[var(--text-primary)]">
        <div className="mx-auto max-w-lg rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/80 p-8">
          <p className="font-display text-sm uppercase tracking-widest text-[var(--gold-accent)]">Restricted</p>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Manager dashboards require an elevated role on this workstation (demo toggle).
          </p>
          <div className="mt-6 flex flex-col gap-3 text-xs uppercase tracking-wider">
            <Link href="/training/comply-track" className="text-[var(--gold-accent)] hover:underline">
              Trainee · ComplyTrack →
            </Link>
            <button
              type="button"
              onClick={() => setTrainingRole("manager")}
              className="rounded-sm border border-[var(--border-gold)]/40 px-4 py-2 text-left text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
            >
              Demo: assume manager view (local only)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-gold)]/20 bg-black/35 px-4 py-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        <div>
          <span className="text-[var(--gold-accent)]">Role:</span> {role}
          <span className="mx-3 opacity-40">|</span>
          <button type="button" onClick={() => setTrainingRole("trainee")} className="hover:text-[var(--gold-accent)]">
            Trainee
          </button>
          <button type="button" onClick={() => setTrainingRole("manager")} className="ml-3 hover:text-[var(--gold-accent)]">
            Manager
          </button>
          <button type="button" onClick={() => setTrainingRole("admin")} className="ml-3 hover:text-[var(--gold-accent)]">
            Admin
          </button>
        </div>
        <button type="button" onClick={() => setRev((n) => n + 1)} className="hover:text-[var(--gold-accent)]">
          Refresh data
        </button>
      </div>
      <AgencyDashboard metrics={metrics} agents={agents} />
    </div>
  );
}
