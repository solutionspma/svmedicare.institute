"use client";

import Link from "next/link";
import type { CertificationRecord } from "@/types/certification";

type CertificateCardProps = {
  record: CertificationRecord;
};

export function CertificateCard({ record }: CertificateCardProps) {
  const statusColor =
    record.status === "active"
      ? "text-emerald-400/90"
      : record.status === "expired"
        ? "text-amber-400/85"
        : "text-red-400/85";

  return (
    <div className="rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {record.credentialTitle}
          </p>
          <p className="font-display text-sm uppercase tracking-wide text-[var(--text-primary)]">{record.fullName}</p>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${statusColor}`}>{record.status}</span>
      </div>
      <p className="mt-2 font-mono text-xs text-[var(--text-muted)]">{record.certificateNumber}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/certification/credential?id=${encodeURIComponent(record.id)}`}
          className="text-xs uppercase tracking-wider text-[var(--gold-accent)] hover:underline"
        >
          Open credential →
        </Link>
      </div>
    </div>
  );
}
