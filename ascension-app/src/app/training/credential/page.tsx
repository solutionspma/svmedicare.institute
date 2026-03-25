"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FEATURES } from "@/config/features";
import { CredentialPrintSheet } from "@/components/credentials/CredentialPrintSheet";
import { loadCertScoreHistory } from "@/services/callLabCertHistory";
import { getOrCreateLocalUserId } from "@/services/callLabLeaderboard";
import {
  loadStoredCredential,
  requestIssueCredential,
  saveStoredCredential,
  verifyCredentialQuery,
} from "@/services/trainingCredentialClient";
import type { SignedTrainingCredential } from "@/types/trainingCredential";
import { checkCertification } from "@/services/certificationEngine";
import { appendCarrierAuditEntry } from "@/services/carrierAuditLog";

export default function TrainingCredentialPage() {
  const [holderName, setHolderName] = useState("Trainee");
  const [record, setRecord] = useState<SignedTrainingCredential | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [onlineCheck, setOnlineCheck] = useState<"idle" | "ok" | "fail">("idle");

  const enabled = FEATURES.PRINTABLE_CREDENTIALS;

  useEffect(() => {
    setRecord(loadStoredCredential());
  }, []);

  const runVerify = useCallback(async (r: SignedTrainingCredential) => {
    setOnlineCheck("idle");
    try {
      const res = await verifyCredentialQuery(r);
      setOnlineCheck(res.valid ? "ok" : "fail");
    } catch {
      setOnlineCheck("fail");
    }
  }, []);

  const issue = useCallback(async () => {
    if (!enabled) return;
    setBusy(true);
    setError(null);
    try {
      const history = loadCertScoreHistory();
      if (!checkCertification(history)) {
        throw new Error("Certification not complete — need three calls scored 90 or higher.");
      }
      const qualifyingScores = history.map((h) => h.score);
      const issued = await requestIssueCredential({
        holderDisplayName: holderName,
        subjectUserId: getOrCreateLocalUserId(),
        qualifyingScores,
      });
      saveStoredCredential(issued);
      setRecord(issued);
      void runVerify(issued);
      if (FEATURES.CARRIER_AUDIT_LOG) {
        appendCarrierAuditEntry({
          eventType: "credential_issued",
          severity: "notice",
          agentRef: getOrCreateLocalUserId(),
          summary: `Issued credential ${issued.payload.credentialId}`,
          metadata: {
            holder: holderName,
            programVersion: issued.payload.programVersion,
          },
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Issue failed");
    } finally {
      setBusy(false);
    }
  }, [enabled, holderName, runVerify]);

  if (!enabled) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-16 text-center text-[var(--text-muted)]">
        <p className="font-display text-sm uppercase tracking-widest text-[var(--text-primary)]">
          Printable credentials disabled
        </p>
        <Link href="/training/call-lab" className="mt-6 inline-block text-[var(--gold-accent)]">
          ← Return to Call Lab
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; color: #111 !important; }
          .credential-print { box-shadow: none !important; border-color: #ccc !important; }
        }
      `}</style>

      <header className="no-print border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4">
          <Link
            href="/training/call-lab"
            className="text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
          >
            ← Call Lab
          </Link>
          <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">
            Verifiable credential
          </p>
        </div>
      </header>

      <main className="no-print mx-auto max-w-3xl px-6 py-8">
        <h1 className="font-display text-xl uppercase tracking-widest">Issue &amp; print</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Server-signed credential (HMAC). Scores are attested for training/demo; production should bind to your CRM
          or LMS.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <input
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            placeholder="Legal / display name"
            className="min-w-[200px] flex-1 rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => void issue()}
            className="rounded-sm border border-[var(--gold-accent)] bg-[var(--gold-accent)]/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--gold-accent)] disabled:opacity-40"
          >
            Issue / refresh signature
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!record}
            className="rounded-sm border border-[var(--border-gold)]/50 px-4 py-2 text-xs uppercase tracking-wider text-[var(--text-primary)] disabled:opacity-40"
          >
            Print
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-sm border border-red-900/40 bg-red-950/20 px-3 py-2 text-sm text-red-200/90">
            {error}
          </p>
        ) : null}

        {record ? (
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Online check:{" "}
            {onlineCheck === "idle"
              ? "—"
              : onlineCheck === "ok"
                ? "signature valid"
                : "could not validate (deploy verify function + secret)"}
            {record ? (
              <button
                type="button"
                className="ml-2 text-[var(--gold-accent)] underline"
                onClick={() => void runVerify(record)}
              >
                Re-check
              </button>
            ) : null}
          </p>
        ) : null}
      </main>

      {record ? (
        <div className="mx-auto max-w-3xl px-6 pb-16">
          <CredentialPrintSheet record={record} />
        </div>
      ) : (
        <p className="no-print mx-auto max-w-3xl px-6 pb-8 text-sm text-[var(--text-muted)]">
          Complete certification in Call Lab, then return here to mint a credential.
        </p>
      )}
    </div>
  );
}
