import type { SignedTrainingCredential, TrainingCredentialPayload, VerifyCredentialResponse } from "@/types/trainingCredential";

const STORAGE_KEY = "svmi-signed-credential-v1";

export function loadStoredCredential(): SignedTrainingCredential | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SignedTrainingCredential;
  } catch {
    return null;
  }
}

export function saveStoredCredential(record: SignedTrainingCredential): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* ignore */
  }
}

export async function requestIssueCredential(args: {
  holderDisplayName: string;
  subjectUserId: string;
  qualifyingScores: number[];
  programVersion?: string;
}): Promise<SignedTrainingCredential> {
  const res = await fetch("/.netlify/functions/issueCredential", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      holderDisplayName: args.holderDisplayName,
      subjectUserId: args.subjectUserId,
      qualifyingScores: args.qualifyingScores,
      programVersion: args.programVersion ?? "SVMI-2026.03",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || "Issue failed");
  }
  const payload = data.payload as TrainingCredentialPayload;
  const payloadB64 = data.payloadB64 as string;
  const signature = data.signature as string;
  if (!payload || !payloadB64 || !signature) {
    throw new Error("Invalid issue response");
  }
  return { payload, payloadB64, signature };
}

export function buildVerifyQuery(record: SignedTrainingCredential): string {
  const p = encodeURIComponent(record.payloadB64);
  const sig = encodeURIComponent(record.signature);
  return `p=${p}&sig=${sig}`;
}

export async function verifyCredentialQuery(record: SignedTrainingCredential): Promise<VerifyCredentialResponse> {
  const res = await fetch(`/.netlify/functions/verifyCredential?${buildVerifyQuery(record)}`);
  return (await res.json()) as VerifyCredentialResponse;
}

/** Absolute verification URL for QR / sharing (client origin). */
export function buildPublicVerifyUrl(origin: string, record: SignedTrainingCredential): string {
  return `${origin.replace(/\/$/, "")}/training/verify?${buildVerifyQuery(record)}`;
}
