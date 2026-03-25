import type { AgencyDashboardMetrics, AgentSummary } from "@/types/agency";

export const MOCK_AGENT_SUMMARIES: AgentSummary[] = [
  {
    userId: "npc-vex",
    fullName: "M. Ortega",
    email: "m.ortega@demo.agency",
    rank: "Senior Advisor",
    trainingProgress: 88,
    averageComplianceScore: 91,
    certificationsEarned: 2,
    riskLevel: "low",
    lastActivity: new Date(Date.now() - 86400000 * 2).toISOString(),
    certificationStatus: "certified",
  },
  {
    userId: "npc-lynx",
    fullName: "T. Okonkwo",
    email: "t.okonkwo@demo.agency",
    rank: "Certified",
    trainingProgress: 72,
    averageComplianceScore: 86,
    certificationsEarned: 1,
    riskLevel: "medium",
    lastActivity: new Date(Date.now() - 86400000 * 5).toISOString(),
    certificationStatus: "expired",
  },
  {
    userId: "npc-hale",
    fullName: "R. Hale",
    email: "r.hale@demo.agency",
    rank: "Trainee",
    trainingProgress: 45,
    averageComplianceScore: 78,
    certificationsEarned: 0,
    riskLevel: "high",
    lastActivity: new Date(Date.now() - 86400000 * 1).toISOString(),
    certificationStatus: "pending",
  },
];

export const MOCK_AGENCY_DASHBOARD_METRICS: AgencyDashboardMetrics = {
  totalAgents: 24,
  activeAgents: 19,
  averageComplianceScore: 87,
  certificatesIssued: 31,
  certificatesExpiringSoon: 4,
  highRiskAgents: 3,
};
