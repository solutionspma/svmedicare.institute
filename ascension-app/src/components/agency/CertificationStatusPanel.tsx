"use client";

import { useMemo } from "react";
import type { AgentSummary } from "@/types/agency";

type CertificationStatusPanelProps = {
  agents: AgentSummary[];
};

export function CertificationStatusPanel({ agents }: CertificationStatusPanelProps) {
  const counts = useMemo(() => {
    const certified = agents.filter((a) => a.certificationStatus === "certified").length;
    const pending = agents.filter((a) => a.certificationStatus === "pending").length;
    const expired = agents.filter((a) => a.certificationStatus === "expired").length;
    return { certified, pending, expired };
  }, [agents]);

  return (
    <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/25 p-4">
      <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
        Certification posture
      </h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-[var(--border-gold)]/10 pb-2">
          <dt className="text-[var(--text-muted)]">Certified</dt>
          <dd className="font-mono text-emerald-400/90">{counts.certified}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[var(--border-gold)]/10 pb-2">
          <dt className="text-[var(--text-muted)]">Pending</dt>
          <dd className="font-mono text-amber-400/85">{counts.pending}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--text-muted)]">Expired / renewal</dt>
          <dd className="font-mono text-red-400/80">{counts.expired}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[10px] text-[var(--text-muted)]">
        Renewal workflows integrate with carrier calendars in production builds.
      </p>
    </div>
  );
}
