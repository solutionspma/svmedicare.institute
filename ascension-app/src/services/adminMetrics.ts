import { MOCK_ADMIN_SNAPSHOT } from "@/data/mockAdminMetrics";
import { MOCK_CALL_ATTEMPTS } from "@/data/mockCallAttempts";
import type { AdminDashboardSnapshot, AdminSessionSummary, ScenarioMetric } from "@/types/adminMetrics";
import { getCallAttempts } from "@/services/callAttemptStore";

function riskFromAvg(avg: number, criticalish: boolean): "low" | "medium" | "high" {
  if (avg < 80 || criticalish) return "high";
  if (avg < 90) return "medium";
  return "low";
}

function aggregateFromAttempts(
  attempts: ReturnType<typeof getCallAttempts>
): Omit<AdminDashboardSnapshot, "agents" | "scenarioMetrics" | "violationTop" | "recentSessions"> & {
  agents: AdminDashboardSnapshot["agents"];
  scenarioMetrics: ScenarioMetric[];
  violationTop: AdminDashboardSnapshot["violationTop"];
  recentSessions: AdminSessionSummary[];
} {
  const byAgent = new Map<
    string,
    { name: string; scores: number[]; passes: number; violations: number; last: string }
  >();
  const byScenario = new Map<string, { title: string; scores: number[]; fails: number }>();
  const violBuckets = new Map<string, number>();

  for (const a of attempts) {
    const ag = byAgent.get(a.agentUserId) ?? {
      name: a.agentDisplayName,
      scores: [] as number[],
      passes: 0,
      violations: 0,
      last: a.endedAt,
    };
    ag.scores.push(a.score);
    if (a.passLabel === "pass") ag.passes += 1;
    ag.violations += a.violations.length;
    if (new Date(a.endedAt) > new Date(ag.last)) ag.last = a.endedAt;
    byAgent.set(a.agentUserId, ag);

    const sc = byScenario.get(a.scenarioId) ?? { title: a.scenarioTitle, scores: [] as number[], fails: 0 };
    sc.scores.push(a.score);
    if (a.passLabel === "fail") sc.fails += 1;
    byScenario.set(a.scenarioId, sc);

    for (const v of a.violations) {
      violBuckets.set(v, (violBuckets.get(v) ?? 0) + 1);
    }
  }

  const agents: AdminDashboardSnapshot["agents"] = [...byAgent.entries()].map(([userId, v]) => {
    const avg = v.scores.length ? Math.round(v.scores.reduce((s, x) => s + x, 0) / v.scores.length) : 0;
    const passRatePct = v.scores.length ? Math.round((v.passes / v.scores.length) * 100) : 0;
    return {
      userId,
      displayName: v.name,
      callsCompleted: v.scores.length,
      avgScore: avg,
      passRatePct,
      lastActivity: v.last,
      riskLevel: riskFromAvg(avg, v.violations >= 3),
      certificationReady: avg >= 90 && v.violations === 0,
    };
  });

  const scenarioMetrics: ScenarioMetric[] = [...byScenario.entries()].map(([scenarioId, v]) => {
    const avg = v.scores.length ? Math.round(v.scores.reduce((s, x) => s + x, 0) / v.scores.length) : 0;
    const failRatePct = v.scores.length ? Math.round((v.fails / v.scores.length) * 100) : 0;
    return {
      scenarioId,
      title: v.title,
      attempts: v.scores.length,
      avgScore: avg,
      failRatePct,
    };
  });

  const violationTop = [...violBuckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label: label.slice(0, 80), count }));

  const recentSessions: AdminSessionSummary[] = attempts.slice(0, 12).map((a) => ({
    id: a.id,
    agentName: a.agentDisplayName,
    scenarioTitle: a.scenarioTitle,
    score: a.score,
    passLabel: a.passLabel,
    endedAt: a.endedAt,
    transcriptPreview: a.transcriptPreview,
  }));

  const scores = attempts.map((a) => a.score);
  const passes = attempts.filter((a) => a.passLabel === "pass").length;
  const avgComplianceScore = scores.length
    ? Math.round(scores.reduce((s, x) => s + x, 0) / scores.length)
    : 0;

  return {
    totalTrainees: agents.length || MOCK_ADMIN_SNAPSHOT.totalTrainees,
    completedCalls: attempts.length,
    avgComplianceScore: avgComplianceScore || MOCK_ADMIN_SNAPSHOT.avgComplianceScore,
    passRatePct: attempts.length ? Math.round((passes / attempts.length) * 100) : MOCK_ADMIN_SNAPSHOT.passRatePct,
    criticalViolationsPeriod: attempts.reduce((n, a) => n + a.violations.length, 0),
    certificationReadyCount: agents.filter((x) => x.certificationReady).length,
    agents,
    scenarioMetrics,
    violationTop: violationTop.length ? violationTop : MOCK_ADMIN_SNAPSHOT.violationTop,
    recentSessions,
  };
}

export function getAgentMetrics(): AdminDashboardSnapshot["agents"] {
  const attempts = [...MOCK_CALL_ATTEMPTS, ...getCallAttempts()].filter(
    (a, i, arr) => arr.findIndex((x) => x.id === a.id) === i
  );
  const snap = aggregateFromAttempts(attempts);
  return snap.agents.length ? snap.agents : MOCK_ADMIN_SNAPSHOT.agents;
}

export function getRecentSessions(): AdminSessionSummary[] {
  const attempts = [...MOCK_CALL_ATTEMPTS, ...getCallAttempts()].filter(
    (a, i, arr) => arr.findIndex((x) => x.id === a.id) === i
  );
  if (!attempts.length) return MOCK_ADMIN_SNAPSHOT.recentSessions;
  return aggregateFromAttempts(attempts).recentSessions;
}

export function getScenarioMetrics(): ScenarioMetric[] {
  const attempts = [...MOCK_CALL_ATTEMPTS, ...getCallAttempts()].filter(
    (a, i, arr) => arr.findIndex((x) => x.id === a.id) === i
  );
  if (!attempts.length) return MOCK_ADMIN_SNAPSHOT.scenarioMetrics;
  return aggregateFromAttempts(attempts).scenarioMetrics;
}

export function buildAdminDashboardSnapshot(): AdminDashboardSnapshot {
  const attempts = [...MOCK_CALL_ATTEMPTS, ...getCallAttempts()].filter(
    (a, i, arr) => arr.findIndex((x) => x.id === a.id) === i
  );
  if (!attempts.length) return MOCK_ADMIN_SNAPSHOT;
  const live = aggregateFromAttempts(attempts);
  return {
    ...MOCK_ADMIN_SNAPSHOT,
    ...live,
    agents: live.agents.length ? live.agents : MOCK_ADMIN_SNAPSHOT.agents,
    scenarioMetrics: live.scenarioMetrics.length ? live.scenarioMetrics : MOCK_ADMIN_SNAPSHOT.scenarioMetrics,
    recentSessions: live.recentSessions.length ? live.recentSessions : MOCK_ADMIN_SNAPSHOT.recentSessions,
  };
}
