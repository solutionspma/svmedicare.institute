"use client";

import type { AuditEvent } from "@/types/audit";

export type AuditFilterState = {
  dateFrom: string;
  dateTo: string;
  userQuery: string;
  severity: AuditEvent["severity"] | "";
  category: AuditEvent["category"] | "";
  eventType: string;
  search: string;
};

type AuditFiltersProps = {
  value: AuditFilterState;
  onChange: (next: AuditFilterState) => void;
};

export function AuditFilters({ value, onChange }: AuditFiltersProps) {
  const patch = (partial: Partial<AuditFilterState>) => onChange({ ...value, ...partial });

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="date"
        value={value.dateFrom}
        onChange={(e) => patch({ dateFrom: e.target.value })}
        className="rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-2 py-2 text-xs text-[var(--text-primary)]"
      />
      <input
        type="date"
        value={value.dateTo}
        onChange={(e) => patch({ dateTo: e.target.value })}
        className="rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-2 py-2 text-xs text-[var(--text-primary)]"
      />
      <input
        value={value.userQuery}
        onChange={(e) => patch({ userQuery: e.target.value })}
        placeholder="Agent name / ID"
        className="min-w-[140px] rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-3 py-2 text-xs text-[var(--text-primary)]"
      />
      <select
        value={value.severity}
        onChange={(e) => patch({ severity: e.target.value as AuditFilterState["severity"] })}
        className="rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-2 py-2 text-xs text-[var(--text-primary)]"
      >
        <option value="">Severity</option>
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="critical">Critical</option>
      </select>
      <select
        value={value.category}
        onChange={(e) => patch({ category: e.target.value as AuditFilterState["category"] })}
        className="rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-2 py-2 text-xs text-[var(--text-primary)]"
      >
        <option value="">Category</option>
        <option value="call-simulation">Call simulation</option>
        <option value="quiz">Quiz</option>
        <option value="certification">Certification</option>
        <option value="live-class">Live class</option>
        <option value="admin-action">Admin</option>
      </select>
      <input
        value={value.eventType}
        onChange={(e) => patch({ eventType: e.target.value })}
        placeholder="Event type"
        className="min-w-[120px] rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-3 py-2 text-xs text-[var(--text-primary)]"
      />
      <input
        value={value.search}
        onChange={(e) => patch({ search: e.target.value })}
        placeholder="Search description"
        className="min-w-[160px] flex-1 rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-3 py-2 text-xs text-[var(--text-primary)]"
      />
    </div>
  );
}
