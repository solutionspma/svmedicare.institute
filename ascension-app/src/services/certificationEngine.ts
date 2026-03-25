export type ScoreRecord = { score: number };

export function checkCertification(scoreHistory: ScoreRecord[]): boolean {
  const passedCalls = scoreHistory.filter((s) => s.score >= 90);
  return passedCalls.length >= 3;
}
