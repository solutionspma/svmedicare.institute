"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { FEATURES } from "@/config/features";
import {
  exportCarrierAuditCsv,
  getCarrierAuditEntries,
} from "@/services/carrierAuditLog";
import type { CarrierAuditEntry } from "@/types/carrierAudit";

export default function CarrierAuditPage() {
  const [revision, setRevision] = useState(0);

  const entries = useMemo((): CarrierAuditEntry[] => {
    void revision;
    return getCarrierAuditEntries({ limit: 250 });
  }, [revision]);

  const downloadCsv = useCallback(() => {
    const csv = exportCarrierAuditCsv(entries);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carrier-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  if (!FEATURES.CARRIER_AUDIT_LOG) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-[var(--text-muted)]">
        <p className="text-[var(--text-primary)]">Carrier audit log disabled.</p>
        <Link href="/training/call-lab" className="mt-6 inline-block text-[var(--gold-accent)]">
          Call Lab
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">
              Carrier compliance
            </p>
            <h1 className="font-display text-xl uppercase tracking-widest">Audit log export</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setRevision((n) => n + 1)}
              className="text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              className="text-xs uppercase tracking-wider text-[var(--gold-accent)] hover:underline"
            >
              Download CSV
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

      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          Immutable-style append-only ledger on-device for pilots. Ship to SIEM or data warehouse via scheduled export
          in production.
        </p>
        <div className="overflow-x-auto rounded-sm border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/60">
          <table className="w-full min-w-[800px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-gold)]/25 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Carrier</th>
                <th className="px-3 py-2">Event</th>
                <th className="px-3 py-2">Severity</th>
                <th className="px-3 py-2">Agent ref</th>
                <th className="px-3 py-2">Summary</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-[var(--text-muted)]">
                    No events recorded yet. Complete a scored lab session to populate.
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e.id} className="border-b border-[var(--border-gold)]/10">
                    <td className="whitespace-nowrap px-3 py-2 text-[var(--text-muted)]">
                      {new Date(e.at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 font-mono text-[10px]">{e.carrierId}</td>
                    <td className="px-3 py-2">{e.eventType}</td>
                    <td className="px-3 py-2">{e.severity}</td>
                    <td className="max-w-[140px] truncate px-3 py-2 font-mono text-[10px]">{e.agentRef}</td>
                    <td className="px-3 py-2 text-[var(--text-primary)]/85">{e.summary}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
