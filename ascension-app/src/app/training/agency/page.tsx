"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { FEATURES } from "@/config/features";
import { getAgencyDashboardSnapshot } from "@/services/agencyMetricsStore";
import type { AgencyDashboardSnapshot } from "@/types/agency";

export default function AgencyDashboardPage() {
  const [refresh, setRefresh] = useState(0);

  const snapshot = useMemo((): AgencyDashboardSnapshot => {
    void refresh;
    return getAgencyDashboardSnapshot();
  }, [refresh]);

  const reload = useCallback(() => setRefresh((n) => n + 1), []);

  if (!FEATURES.AGENCY_DASHBOARD) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-[var(--text-muted)]">
        <p className="text-[var(--text-primary)]">Agency dashboard disabled.</p>
        <Link href="/training/call-lab" className="mt-6 inline-block text-[var(--gold-accent)]">
          Call Lab
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">
              Manager overview
            </p>
            <h1 className="font-display text-xl uppercase tracking-widest">{snapshot.agencyName}</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={reload}
              className="text-xs uppercase tracking-wider text-[var(--gold-accent)] hover:underline"
            >
              Refresh
            </button>
            <Link
              href="/training/call-lab"
              className="text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
            >
              ← Call Lab
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          Roll-up of AI lab sessions for this workstation (local ledger). Connect Supabase for multi-device manager
          views.
        </p>
        <div className="overflow-x-auto rounded-sm border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/60">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-gold)]/25 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Sessions</th>
                <th className="px-4 py-3">Avg score</th>
                <th className="px-4 py-3">Last score</th>
                <th className="px-4 py-3">Avg RT (s)</th>
                <th className="px-4 py-3">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.agents.map((a) => (
                <tr key={a.userId} className="border-b border-[var(--border-gold)]/10">
                  <td className="px-4 py-3">
                    <span className="font-medium">{a.displayName}</span>
                    <span className="mt-1 block font-mono text-[10px] text-[var(--text-muted)]">{a.userId}</span>
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums">{a.sessionsLogged}</td>
                  <td className="px-4 py-3 font-mono tabular-nums">{a.avgScore}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-[var(--text-muted)]">
                    {a.lastScore ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums text-[var(--text-muted)]">
                    {a.avgResponseTimeSec}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                    {a.lastActivityAt ? new Date(a.lastActivityAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
