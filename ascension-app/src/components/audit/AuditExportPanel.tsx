"use client";

import type { AuditEvent } from "@/types/audit";
import { exportAuditEvents } from "@/services/auditLogger";

type AuditExportPanelProps = {
  filtered: AuditEvent[];
  all: AuditEvent[];
  singleAgentUserId?: string;
};

function download(content: string, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AuditExportPanel({ filtered, all, singleAgentUserId }: AuditExportPanelProps) {
  const csvAll = () => {
    const r = exportAuditEvents(all, "csv");
    download(r.body, r.mime, r.filename);
  };
  const csvFiltered = () => {
    const r = exportAuditEvents(filtered, "csv");
    download(r.body, r.mime, `filtered-${r.filename}`);
  };
  const pdfPlaceholder = (label: string) => () => alert(`${label}: wire PDF renderer (server) in production.`);

  return (
    <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/25 p-4">
      <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
        Export
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={csvAll}
          className="rounded-sm border border-[var(--border-gold)]/45 px-3 py-2 text-[11px] uppercase tracking-wider text-[var(--text-primary)]"
        >
          CSV · all
        </button>
        <button
          type="button"
          onClick={csvFiltered}
          className="rounded-sm border border-[var(--border-gold)]/45 px-3 py-2 text-[11px] uppercase tracking-wider text-[var(--text-primary)]"
        >
          CSV · filtered
        </button>
        <button
          type="button"
          disabled={!singleAgentUserId}
          onClick={pdfPlaceholder("Agent PDF")}
          className="rounded-sm border border-[var(--border-gold)]/25 px-3 py-2 text-[11px] uppercase tracking-wider text-[var(--text-muted)] disabled:opacity-40"
        >
          PDF · agent (soon)
        </button>
        <button
          type="button"
          onClick={pdfPlaceholder("Executive PDF")}
          className="rounded-sm border border-[var(--border-gold)]/25 px-3 py-2 text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
        >
          PDF · exec (soon)
        </button>
      </div>
    </div>
  );
}
