export type TranscriptEntry = {
  role: "user" | "assistant";
  text: string;
  at: number;
};

export type StoredTranscript = {
  sessionId: string;
  entries: TranscriptEntry[];
  startedAt: number | null;
  endedAt: number | null;
  violationsDetected: string[];
  /** ISO timestamp when trainee acknowledged training / audit logging consent (if captured). */
  trainingConsentAt?: string | null;
};

export type ComplianceResultPayload = {
  complianceScore: number;
  /** Server-derived from model `result` when present; otherwise UI may infer from score. */
  passLabel?: "pass" | "conditional" | "fail";
  summary?: string;
  checklist?: Record<string, string> | null;
  violations: string[];
  missedSteps: string[];
  suggestedResponses: string[];
  coachingFeedback: string;
  rawModelJson?: unknown;
};

const transcriptKey = (sessionId: string) => `ai-call-transcript-${sessionId}`;
const complianceKey = (sessionId: string) => `ai-call-compliance-${sessionId}`;

/**
 * Persists transcript client-side for debrief and future Supabase sync.
 */
export function saveTranscript(data: StoredTranscript): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(transcriptKey(data.sessionId), JSON.stringify(data));
  } catch {
    /* storage full or disabled */
  }
}

export function loadTranscript(sessionId: string): StoredTranscript | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(transcriptKey(sessionId));
    if (!raw) return null;
    return JSON.parse(raw) as StoredTranscript;
  } catch {
    return null;
  }
}

export function saveComplianceResult(sessionId: string, result: ComplianceResultPayload): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(complianceKey(sessionId), JSON.stringify(result));
  } catch {
    /* ignore */
  }
}

export function loadComplianceResult(sessionId: string): ComplianceResultPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(complianceKey(sessionId));
    if (!raw) return null;
    return JSON.parse(raw) as ComplianceResultPayload;
  } catch {
    return null;
  }
}
