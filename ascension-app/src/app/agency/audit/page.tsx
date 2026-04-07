"use client";

import Link from "next/link";
import { ComplianceAuditLog } from "@/components/audit/ComplianceAuditLog";
import { FEATURES } from "@/config/features";
import { useTrainingRole } from "@/hooks/useTrainingRole";

export default function AgencyAuditPage() {
  const { role, mounted, setTrainingRole } = useTrainingRole();

  if (!FEATURES.PLATFORM_AUDIT_CONSOLE) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-[var(--text-muted)]">
        <p className="text-[var(--text-primary)]">Audit console disabled.</p>
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
          <p className="mt-3 text-sm text-[var(--text-muted)]">Audit logs are manager / admin visibility.</p>
          <button
            type="button"
            onClick={() => setTrainingRole("manager")}
            className="mt-6 rounded-sm border border-[var(--border-gold)]/40 px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
          >
            Demo: open as manager
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">
              Compliance audit
            </p>
            <h1 className="font-display text-xl uppercase tracking-widest">Agency console</h1>
          </div>
          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wider">
            <Link href="/agency/dashboard" className="text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
              Command deck
            </Link>
            <Link href="/training/comply-track" className="text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
              ComplyTrack
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <ComplianceAuditLog />
      </main>
    </div>
  );
}
