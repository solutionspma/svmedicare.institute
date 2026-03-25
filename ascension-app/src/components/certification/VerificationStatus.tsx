"use client";

import type { CertificationRecord } from "@/types/certification";

type VerificationStatusProps = {
  record: CertificationRecord | null;
  invalid?: boolean;
  message?: string;
};

export function VerificationStatus({ record, invalid, message }: VerificationStatusProps) {
  if (invalid || !record) {
    return (
      <div className="rounded-sm border border-red-900/40 bg-red-950/25 p-4">
        <p className="font-display text-xs uppercase tracking-wider text-red-300/95">Invalid</p>
        <p className="mt-2 text-sm text-red-200/85">{message || "Certificate ID and verification code could not be validated."}</p>
      </div>
    );
  }

  const ok = record.status === "active";
  return (
    <div
      className={`rounded-sm border p-4 ${
        ok
          ? "border-emerald-900/35 bg-emerald-950/20"
          : "border-amber-900/30 bg-amber-950/15"
      }`}
    >
      <p className="font-display text-xs uppercase tracking-wider text-emerald-300/90">Valid record</p>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Holder</dt>
          <dd className="text-[var(--text-primary)]">{record.fullName}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Credential</dt>
          <dd className="text-[var(--text-primary)]">{record.credentialTitle}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Status</dt>
          <dd className="uppercase tracking-wide text-[var(--gold-accent)]">{record.status}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Issued</dt>
          <dd className="font-mono text-xs text-[var(--text-muted)]">
            {new Date(record.issueDate).toLocaleString()}
          </dd>
        </div>
        {record.expirationDate ? (
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Expiration</dt>
            <dd className="font-mono text-xs text-[var(--text-muted)]">
              {new Date(record.expirationDate).toLocaleString()}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
