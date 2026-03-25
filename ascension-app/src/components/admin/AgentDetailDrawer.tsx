"use client";

import type { AdminAgentRow } from "@/types/adminMetrics";

export function AgentDetailDrawer({
  agent,
  onClose,
}: {
  agent: AdminAgentRow | null;
  onClose: () => void;
}) {
  if (!agent) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" role="dialog" aria-modal>
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close" />
      <div className="relative h-full w-full max-w-md border-l border-[var(--border-gold)]/35 bg-[var(--bg-matte)] p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="mb-4 text-[10px] uppercase tracking-wider text-[var(--gold-accent)]"
        >
          Close
        </button>
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Agent file</p>
        <h2 className="font-display text-lg uppercase tracking-wide text-[var(--text-primary)]">{agent.displayName}</h2>
        <dl className="mt-4 space-y-2 text-xs text-[var(--text-muted)]">
          <div>
            <dt className="text-[10px] uppercase tracking-wider">User ID</dt>
            <dd className="mt-1 font-mono text-[var(--text-primary)]">{agent.userId}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider">Certification-ready</dt>
            <dd className="mt-1">{agent.certificationReady ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wider">Risk</dt>
            <dd className="mt-1 uppercase">{agent.riskLevel}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
