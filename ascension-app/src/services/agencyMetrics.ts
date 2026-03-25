import { MOCK_AGENT_SUMMARIES, MOCK_AGENCY_DASHBOARD_METRICS } from "@/data/mockAgencyMetrics";
import type { AgencyDashboardMetrics, AgentSummary } from "@/types/agency";
import { getAgencyDashboardSnapshot } from "@/services/agencyMetricsStore";
import { listAllCertificates } from "@/services/certificateEngine";

function mergeAgentRow(mock: AgentSummary, liveAvg?: number, liveSessions?: number, liveLast?: number): AgentSummary {
  let avg = mock.averageComplianceScore;
  if (liveAvg != null && liveSessions != null && liveSessions > 0) {
    avg = Math.round((mock.averageComplianceScore * 0.4 + liveAvg * 0.6) * 10) / 10;
  }
  const progress = mock.trainingProgress;
  const risk: AgentSummary["riskLevel"] =
    avg >= 88 ? "low" : avg >= 80 ? "medium" : "high";
  const lastIso =
    liveLast != null
      ? new Date(liveLast).toISOString()
      : mock.lastActivity;
  const certs = listAllCertificates().filter((c) => c.userId === mock.userId);
  const earned = Math.max(mock.certificationsEarned, certs.filter((c) => c.status === "active").length);
  let certStatus: AgentSummary["certificationStatus"] = mock.certificationStatus;
  if (certs.some((c) => c.status === "active")) certStatus = "certified";
  else if (certs.some((c) => c.status === "expired")) certStatus = "expired";

  return {
    ...mock,
    averageComplianceScore: avg,
    riskLevel: risk,
    lastActivity: lastIso,
    certificationsEarned: Math.max(mock.certificationsEarned, earned),
    certificationStatus: certStatus,
    trainingProgress: liveSessions != null && liveSessions > 0 ? Math.min(100, progress + 5) : progress,
  };
}

export function buildAgentSummaries(): AgentSummary[] {
  const snapshot = typeof window !== "undefined" ? getAgencyDashboardSnapshot() : null;
  return MOCK_AGENT_SUMMARIES.map((mock) => {
    const live = snapshot?.agents.find((a) => a.userId === mock.userId);
    return mergeAgentRow(mock, live?.avgScore, live?.sessionsLogged, live?.lastActivityAt);
  });
}

export function buildAgencyDashboardMetrics(summaries: AgentSummary[]): AgencyDashboardMetrics {
  const certs = listAllCertificates();
  const activeCerts = certs.filter((c) => c.status === "active").length;
  const expSoon = certs.filter((c) => {
    if (c.status !== "active" || !c.expirationDate) return false;
    const t = new Date(c.expirationDate).getTime();
    const days = (t - Date.now()) / 86400000;
    return days > 0 && days <= 45;
  }).length;

  const highRisk = summaries.filter((a) => a.riskLevel === "high").length;
  const avgScore =
    summaries.length > 0
      ? Math.round(summaries.reduce((s, a) => s + a.averageComplianceScore, 0) / summaries.length)
      : MOCK_AGENCY_DASHBOARD_METRICS.averageComplianceScore;

  return {
    totalAgents: MOCK_AGENCY_DASHBOARD_METRICS.totalAgents,
    activeAgents: MOCK_AGENCY_DASHBOARD_METRICS.activeAgents,
    averageComplianceScore: avgScore,
    certificatesIssued: Math.max(MOCK_AGENCY_DASHBOARD_METRICS.certificatesIssued, activeCerts),
    certificatesExpiringSoon: Math.max(MOCK_AGENCY_DASHBOARD_METRICS.certificatesExpiringSoon, expSoon),
    highRiskAgents: Math.max(highRisk, MOCK_AGENCY_DASHBOARD_METRICS.highRiskAgents),
  };
}

export function getMergedDashboardMetrics(): AgencyDashboardMetrics {
  const summaries = buildAgentSummaries();
  return buildAgencyDashboardMetrics(summaries);
}
