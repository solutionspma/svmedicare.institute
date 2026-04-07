"use client";

import Link from "next/link";
import { AdminComplyTrackDashboard } from "@/components/admin/AdminComplyTrackDashboard";
import { useTrainingRole } from "@/hooks/useTrainingRole";
import { canAccessAdminComplyTrack } from "@/lib/complyTrackAccess";

export default function AdminComplyTrackPage() {
  const { role, mounted } = useTrainingRole();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-[var(--text-muted)]">
        Loading…
      </div>
    );
  }

  if (!canAccessAdminComplyTrack(role)) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-[var(--text-muted)]">
        <p>Manager or admin role required.</p>
        <p className="mt-2 text-xs">
          Set role in localStorage key <span className="font-mono">svmi-training-role-v1</span> to{" "}
          <span className="font-mono">manager</span> or <span className="font-mono">admin</span> for demo access.
        </p>
        <Link href="/training/comply-track" className="mt-6 inline-block text-[var(--gold-accent)]">
          ← ComplyTrack
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">
          Operations
        </p>
        <h1 className="font-display text-xl uppercase tracking-widest">ComplyTrack · Admin</h1>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <AdminComplyTrackDashboard />
      </main>
    </div>
  );
}
