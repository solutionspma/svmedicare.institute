"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CertificateViewer } from "@/components/certification/CertificateViewer";
import { FEATURES } from "@/config/features";
import { getCertificateById } from "@/services/certificateEngine";
import type { CertificationRecord } from "@/types/certification";

export default function CredentialPageClient() {
  const params = useParams();
  const credentialId = decodeURIComponent(String(params.credentialId ?? ""));
  const [record, setRecord] = useState<CertificationRecord | null>(null);

  useEffect(() => {
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
          <span className="mt-2 block text-xs">
            If this credential was issued in this browser, open it from{" "}
            <Link className="text-[var(--gold-accent)] underline-offset-2 hover:underline" href="/training/comply-track">
              ComplyTrack
            </Link>{" "}
            or use{" "}
            <Link className="text-[var(--gold-accent)] underline-offset-2 hover:underline" href={`/certification/credential?id=${encodeURIComponent(credentialId)}`}>
              /certification/credential?id=…
            </Link>
            .
          </span>
        </p>
      ) : (
        <div className="mx-auto max-w-3xl">
          <CertificateViewer record={record} verifyPagePath="/verify" />
        </div>
      )}
    </div>
  );
}
