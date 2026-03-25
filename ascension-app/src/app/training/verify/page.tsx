import { Suspense } from "react";
import { VerifyClient } from "./VerifyClient";

export default function VerifyCredentialPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-matte)] px-6 py-12 text-[var(--text-muted)]">
          Loading verification…
        </div>
      }
    >
      <VerifyClient />
    </Suspense>
  );
}
