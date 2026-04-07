"use client";

import Link from "next/link";

type CertificationBadgeProps = {
  certified: boolean;
  qualifyingScoresCount?: number;
  /** When set and certified, links to printable credential flow */
  printCredentialHref?: string;
  /** Institution certificate viewer (/certification/credential?id=…) */
  platformCredentialHref?: string;
};

export function CertificationBadge({
  certified,
  qualifyingScoresCount = 0,
  printCredentialHref,
  platformCredentialHref,
}: CertificationBadgeProps) {
  return (
    <div
      className={`rounded-sm border p-4 transition-shadow duration-500 ${
        certified
          ? "border-[var(--border-gold)] bg-[var(--gold-accent)]/8 shadow-[0_0_24px_rgba(61,165,255,0.2)] [animation:gold-pulse_2.8s_ease-in-out_infinite]"
          : "border-[var(--border-gold)]/25 bg-black/25"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full border text-[10px] font-bold uppercase ${
            certified
              ? "border-[var(--gold-accent)] text-[var(--gold-accent)]"
              : "border-[var(--border-gold)]/35 text-[var(--text-muted)]"
          }`}
          aria-hidden
        >
          CMS
        </div>
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Certification status
          </p>
          <p className="font-display text-sm uppercase tracking-wide text-[var(--text-primary)]">
            Certified Medicare Call Specialist
          </p>
          {certified ? (
            <p className="mt-1 text-xs text-[var(--gold-accent)]/90">Credential unlocked — maintain cadence.</p>
          ) : (
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {qualifyingScoresCount}/3 completed calls at 90+ compliance to unlock.
            </p>
          )}
          {certified && printCredentialHref ? (
            <Link
              href={printCredentialHref}
              className="mt-2 inline-block text-xs font-medium uppercase tracking-wider text-[var(--gold-accent)] hover:underline"
            >
              Print &amp; verify credential →
            </Link>
          ) : null}
          {certified && platformCredentialHref ? (
            <Link
              href={platformCredentialHref}
              className="mt-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)] hover:underline"
            >
              Institution certificate →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
