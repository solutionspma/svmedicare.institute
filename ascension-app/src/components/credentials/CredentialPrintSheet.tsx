"use client";

import type { SignedTrainingCredential } from "@/types/trainingCredential";
import { buildPublicVerifyUrl } from "@/services/trainingCredentialClient";

type CredentialPrintSheetProps = {
  record: SignedTrainingCredential;
};

export function CredentialPrintSheet({ record }: CredentialPrintSheetProps) {
  const { payload } = record;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const verifyUrl = origin ? buildPublicVerifyUrl(origin, record) : "";

  return (
    <div className="credential-print sheet border border-[var(--border-gold)]/45 bg-[var(--bg-matte-elevated)] p-10 text-[var(--text-primary)] shadow-[var(--shadow-layered)]">
      <div className="border-b border-[var(--border-gold)]/25 pb-6 text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.35em] text-[var(--gold-accent)]">
          SV Medicare Institute
        </p>
        <h1 className="mt-2 font-display text-2xl uppercase tracking-[0.12em]">Certificate of completion</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Medicare Call Compliance Laboratory</p>
      </div>

      <div className="mt-8 space-y-4 text-sm leading-relaxed">
        <p>
          This certifies that{" "}
          <span className="font-semibold text-[var(--gold-accent)]">{payload.holderDisplayName}</span> has satisfied
          training requirements for the role titled{" "}
          <span className="font-semibold">Certified Medicare Call Specialist</span> under program {payload.programVersion}.
        </p>
        <dl className="grid grid-cols-1 gap-3 border border-[var(--border-gold)]/20 bg-black/20 p-4 font-mono text-xs sm:grid-cols-2">
          <div>
            <dt className="text-[var(--text-muted)]">Credential ID</dt>
            <dd className="mt-1 text-[var(--text-primary)]">{payload.credentialId}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Issued</dt>
            <dd className="mt-1 text-[var(--text-primary)]">{new Date(payload.issuedAt).toLocaleString()}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[var(--text-muted)]">Qualifying scores (≥90 required ×3)</dt>
            <dd className="mt-1 text-[var(--text-primary)]">{payload.qualifyingScores.join(", ")}</dd>
          </div>
        </dl>
        {verifyUrl ? (
          <div className="flex flex-col items-center gap-3 border border-dashed border-[var(--border-gold)]/30 p-4 text-center">
            <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">Verification</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- external QR data URL for print fidelity */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(verifyUrl)}`}
              alt=""
              width={140}
              height={140}
              className="border border-[var(--border-gold)]/20 bg-white p-1"
            />
            <p className="max-w-md break-all text-[10px] text-[var(--text-muted)]">{verifyUrl}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-10 flex justify-between border-t border-[var(--border-gold)]/20 pt-6 text-xs text-[var(--text-muted)]">
        <div>
          <p className="uppercase tracking-wider">Training integrity</p>
          <p className="mt-2 font-mono">HMAC-SHA256 • Netlify verify</p>
        </div>
        <div className="text-right">
          <p className="uppercase tracking-wider">Subject reference</p>
          <p className="mt-2 font-mono break-all">{payload.subjectUserId}</p>
        </div>
      </div>
    </div>
  );
}
