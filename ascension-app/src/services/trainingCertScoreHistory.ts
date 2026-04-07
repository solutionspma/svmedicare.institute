import type { ScoreRecord } from "@/services/certificationEngine";

const CERT_KEY = "comply-track-cert-score-history-v1";

export function loadCertScoreHistory(): ScoreRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CERT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is ScoreRecord => typeof x === "object" && x != null && typeof (x as ScoreRecord).score === "number")
      .map((x) => ({ score: Math.round((x as ScoreRecord).score) }));
  } catch {
    return [];
  }
}

export function appendCertScore(score: number): ScoreRecord[] {
  const prev = loadCertScoreHistory();
  const next = [...prev, { score: Math.round(score) }];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CERT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  return next;
}
