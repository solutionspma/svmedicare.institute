"use client";

import { useMemo, useState } from "react";
import type { AuditEvent } from "@/types/audit";
import { getAuditEvents } from "@/services/auditLogger";
import { AuditFilters, type AuditFilterState } from "@/components/audit/AuditFilters";
import { AuditEventTable } from "@/components/audit/AuditEventTable";
import { AuditExportPanel } from "@/components/audit/AuditExportPanel";

const initialFilters: AuditFilterState = {
  dateFrom: "",
  dateTo: "",
  userQuery: "",
  severity: "",
  category: "",
  eventType: "",
  search: "",
};

export function ComplianceAuditLog() {
  const [filters, setFilters] = useState<AuditFilterState>(initialFilters);
  const [detail, setDetail] = useState<AuditEvent | null>(null);

  const all = getAuditEvents();

  const filtered = useMemo(
    () =>
      getAuditEvents({
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        userQuery: filters.userQuery || undefined,
        severity: filters.severity || undefined,
        category: filters.category || undefined,
        eventType: filters.eventType || undefined,
        search: filters.search || undefined,
      }),
    [filters]
  );

  return (
    <div className="space-y-6">
      <AuditFilters value={filters} onChange={setFilters} />
      <AuditExportPanel
        filtered={filtered}
        all={all}
        singleAgentUserId={filters.userQuery || undefined}
      />
      <AuditEventTable events={filtered} onSelect={setDetail} />

      {detail ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal
          onClick={() => setDetail(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-sm border border-[var(--border-gold)]/40 bg-[var(--bg-matte-elevated)] p-6 text-sm text-[var(--text-primary)] shadow-[var(--shadow-deep)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-sm uppercase tracking-wider text-[var(--gold-accent)]">
                Event detail
              </h3>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-xs">
              <div>
                <dt className="text-[var(--text-muted)]">ID</dt>
                <dd className="font-mono">{detail.id}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Timestamp</dt>
                <dd>{new Date(detail.timestamp).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Agent</dt>
                <dd>
                  {detail.userName} ({detail.userId})
                </dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Description</dt>
                <dd className="leading-relaxed">{detail.description}</dd>
              </div>
              {detail.relatedRule ? (
                <div>
                  <dt className="text-[var(--text-muted)]">Rule</dt>
                  <dd>{detail.relatedRule}</dd>
                </div>
              ) : null}
              {detail.scoreImpact != null ? (
                <div>
                  <dt className="text-[var(--text-muted)]">Score impact</dt>
                  <dd>{detail.scoreImpact}</dd>
                </div>
              ) : null}
              {detail.sessionId ? (
                <div>
                  <dt className="text-[var(--text-muted)]">Session</dt>
                  <dd className="font-mono text-[10px]">{detail.sessionId}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      ) : null}
    </div>
  );
}
