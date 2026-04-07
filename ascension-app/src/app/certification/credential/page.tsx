"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CertificateViewer } from "@/components/certification/CertificateViewer";
import { FEATURES } from "@/config/features";
import { getCertificateById } from "@/services/certificateEngine";
import type { CertificationRecord } from "@/types/certification";

function CredentialByQueryInner() {
  const searchParams = useSearchParams();
  const credentialId = (searchParams.get("id") ?? "").trim();
  const [record, setRecord] = useState<CertificationRecord | null>(null);

  useEffect(() => {
    if (!credentialId) {
      setRecord(null);
      return;
    }
    setRecord(getCertificateById(credentialId));
  }, [credentialId]);

  if (!FEATURES.PLATFORM_CERTIFICATES) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-[var(--text-muted)]">
        <p>Credentials platform disabled.</p>
        <Link href="/training/comply-track" className="mt-6 inline-block text-[var(--gold-accent)]">
          ComplyTrack
        </Link>
      </div>
    );
  }

  if (!credentialId) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-10 text-[var(--text-primary)]">
        <header className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <Link href="/training/comply-track" className="text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            ← Training
          </Link>
          <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">Credential</p>
        </header>
        <p className="mx-auto max-w-3xl text-sm text-[var(--text-muted)]">
          Add a certificate ID to the URL:{" "}
          <span className="font-mono text-[var(--text-primary)]">/certification/credential?id=…</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-10 text-[var(--text-primary)]">
      <header className="cert-no-print mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-between gap-4">
        <Link href="/training/comply-track" className="text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
          ← Training
        </Link>
        <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">Credential</p>
      </header>

      {!record ? (
        <p className="mx-auto max-w-3xl text-sm text-[var(--text-muted)]">
          Credential not found for ID <span className="font-mono text-[var(--text-primary)]">{credentialId}</span>.
        </p>
      ) : (
        <div className="mx-auto max-w-3xl">
          <CertificateViewer record={record} verifyPagePath="/verify" />
        </div>
      )}
    </div>
  );
}

export default function CredentialLookupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-sm text-[var(--text-muted)]">
          Loading credential…
        </div>
      }
    >
      <CredentialByQueryInner />
    </Suspense>
  );
}
