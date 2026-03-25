"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FEATURES } from "@/config/features";
import type { VerifyCredentialResponse } from "@/types/trainingCredential";

export function VerifyClient() {
  const params = useSearchParams();
  const [result, setResult] = useState<VerifyCredentialResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const run = useCallback(async () => {
    if (!FEATURES.CREDENTIAL_VERIFICATION) {
      setLoading(false);
      return;
    }
    const p = params.get("p");
    const sig = params.get("sig");
    if (!p || !sig) {
      setResult({ valid: false, credential: null, error: "Missing verification parameters." });
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `/.netlify/functions/verifyCredential?p=${encodeURIComponent(p)}&sig=${encodeURIComponent(sig)}`
      );
      const data = (await res.json()) as VerifyCredentialResponse;
      setResult(data);
    } catch {
      setResult({ valid: false, credential: null, error: "Verification request failed." });
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void run();
  }, [run]);

  if (!FEATURES.CREDENTIAL_VERIFICATION) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-[var(--text-muted)]">
        <p className="text-[var(--text-primary)]">Verification is disabled.</p>
        <Link href="/" className="mt-6 inline-block text-[var(--gold-accent)]">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-12 text-[var(--text-primary)]">
      <div className="mx-auto max-w-lg rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/80 p-8">
        <h1 className="font-display text-lg uppercase tracking-widest text-[var(--gold-accent)]">
          Credential verification
        </h1>
        {loading ? (
          <p className="mt-4 text-sm text-[var(--text-muted)]">Checking signature…</p>
        ) : result?.valid && result.credential ? (
          <div className="mt-6 space-y-3 text-sm">
            <p className="rounded-sm border border-emerald-900/40 bg-emerald-950/25 px-3 py-2 text-emerald-200/90">
              Valid training credential.
            </p>
            <dl className="space-y-2 font-mono text-xs">
              <div>
                <dt className="text-[var(--text-muted)]">ID</dt>
                <dd>{result.credential.credentialId}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Holder</dt>
                <dd>{result.credential.holderDisplayName}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Issued</dt>
                <dd>{new Date(result.credential.issuedAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Program</dt>
                <dd>{result.credential.programVersion}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)]">Scores</dt>
                <dd>{result.credential.qualifyingScores.join(", ")}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="mt-4 rounded-sm border border-red-900/35 bg-red-950/20 px-3 py-2 text-sm text-red-200/90">
            {result?.error || "Invalid or tampered credential."}
          </p>
        )}
        <Link
          href="/training/call-lab"
          className="mt-8 inline-block text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
        >
          ← Training home
        </Link>
      </div>
    </div>
  );
}
