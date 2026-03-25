"use client";

import { useMemo } from "react";
import type { CertificationRecord } from "@/types/certification";

type CertificateViewerProps = {
  record: CertificationRecord;
  verifyPagePath?: string;
};

export function CertificateViewer({ record, verifyPagePath = "/verify" }: CertificateViewerProps) {
  const verifyUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}${verifyPagePath}`;
  }, [verifyPagePath]);

  return (
    <div>
      <style>{`
        @media print {
          .cert-no-print { display: none !important; }
          .cert-sheet {
            box-shadow: none !important;
            border: 1px solid #c9a227 !important;
            background: #faf9f6 !important;
            color: #1a1a18 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="cert-sheet rounded-sm border border-[#c9a227]/55 bg-[#faf9f6] p-10 text-[#1a1a18] shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
        <header className="border-b border-[#c9a227]/35 pb-6 text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-[#8b7220]">SV Medicare Institute</p>
          <h1 className="mt-3 font-display text-2xl uppercase tracking-[0.15em] text-[#1a1a18]">
            Certificate of achievement
          </h1>
          <p className="mt-2 text-sm text-neutral-600">Official training credential · Medicare compliance program</p>
        </header>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-neutral-800">
          <p className="text-center text-base">
            This certifies that{" "}
            <span className="font-semibold text-[#6b5a1e]">{record.fullName}</span> has completed requirements for
          </p>
          <p className="text-center font-display text-lg uppercase tracking-[0.12em] text-[#1a1a18]">
            {record.credentialTitle}
          </p>

          <div className="mx-auto grid max-w-lg gap-3 border border-[#c9a227]/25 bg-white/80 p-4 text-left font-mono text-xs">
            <div className="flex justify-between gap-4 border-b border-neutral-200/80 pb-2">
              <span className="text-neutral-500">Certificate no.</span>
              <span className="text-neutral-900">{record.certificateNumber}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-200/80 pb-2">
              <span className="text-neutral-500">Verification code</span>
              <span className="tracking-[0.2em] text-neutral-900">{record.verificationCode}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-200/80 pb-2">
              <span className="text-neutral-500">Credential ID</span>
              <span className="break-all text-right text-[11px] text-neutral-900">{record.id}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-neutral-200/80 pb-2">
              <span className="text-neutral-500">Issue date</span>
              <span className="text-neutral-900">{new Date(record.issueDate).toLocaleDateString()}</span>
            </div>
            {record.expirationDate ? (
              <div className="flex justify-between gap-4 border-b border-neutral-200/80 pb-2">
                <span className="text-neutral-500">Expiration</span>
                <span className="text-neutral-900">{new Date(record.expirationDate).toLocaleDateString()}</span>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <span className="text-neutral-500">Assessment score</span>
              <span className="text-neutral-900">{record.score}</span>
            </div>
            <div className="flex justify-between gap-4 pt-1">
              <span className="text-neutral-500">Status</span>
              <span className="uppercase tracking-wide text-[#6b5a1e]">{record.status}</span>
            </div>
          </div>

          {verifyUrl ? (
            <p className="text-center text-xs text-neutral-500">
              Verify at{" "}
              <span className="font-mono text-[11px] text-neutral-700">{verifyUrl}</span>
            </p>
          ) : null}

          <div className="mx-auto flex max-w-xs justify-center border-2 border-[#c9a227]/40 p-4 text-center font-display text-[10px] uppercase tracking-[0.35em] text-[#8b7220]">
            Official seal
          </div>
        </div>

        <div className="cert-no-print mt-10 flex flex-wrap justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-sm border border-[#c9a227] bg-[#c9a227]/15 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-[#6b5a1e]"
          >
            Print certificate
          </button>
          <button
            type="button"
            onClick={() =>
              alert("PDF export will connect to a server-side renderer. Placeholder only in this build.")
            }
            className="rounded-sm border border-neutral-400/50 px-5 py-2.5 text-xs uppercase tracking-wider text-neutral-600"
          >
            Download PDF (soon)
          </button>
        </div>
      </div>
    </div>
  );
}
