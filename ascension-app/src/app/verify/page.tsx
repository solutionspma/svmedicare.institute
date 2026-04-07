"use client";

import { useState } from "react";
import Link from "next/link";
import { VerificationStatus } from "@/components/certification/VerificationStatus";
import { FEATURES } from "@/config/features";
import { verifyCertificate } from "@/services/certificateEngine";
import type { CertificationRecord } from "@/types/certification";

export default function PublicVerifyPage() {
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [checked, setChecked] = useState(false);
  const [record, setRecord] = useState<CertificationRecord | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!FEATURES.CREDENTIAL_VERIFICATION && !FEATURES.PLATFORM_CERTIFICATES) return;
    setRecord(verifyCertificate(id.trim(), code.trim()));
    setChecked(true);
  };

  if (!FEATURES.CREDENTIAL_VERIFICATION && !FEATURES.PLATFORM_CERTIFICATES) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-[var(--text-muted)]">
        <p className="text-[var(--text-primary)]">Verification offline.</p>
        <Link href="/" className="mt-6 inline-block text-[var(--gold-accent)]">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-12 text-[var(--text-primary)]">
      <div className="mx-auto max-w-lg rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/85 p-8 shadow-[var(--shadow-layered)]">
        <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">
          Public gate
        </p>
        <h1 className="mt-2 font-display text-xl uppercase tracking-widest">Credential verification</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Validates records stored on this deployment (local ledger demo). Production pairs with Supabase + carrier
          portals.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Certificate ID
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-3 py-2 font-mono text-sm text-[var(--text-primary)]"
              autoComplete="off"
            />
          </label>
          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Verification code
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/35 bg-black/35 px-3 py-2 font-mono text-sm text-[var(--text-primary)]"
              autoComplete="off"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-sm border border-[var(--gold-accent)] bg-[var(--gold-accent)]/10 py-2.5 text-xs font-medium uppercase tracking-wider text-[var(--gold-accent)]"
          >
            Validate
          </button>
        </form>

        {checked ? (
          <div className="mt-8">
            <VerificationStatus
              record={record}
              invalid={!record}
              message="No matching credential for this device’s registry."
            />
          </div>
        ) : null}

        <Link
          href="/training/comply-track"
          className="mt-8 inline-block text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
        >
          ← ComplyTrack
        </Link>
      </div>
    </div>
  );
}
