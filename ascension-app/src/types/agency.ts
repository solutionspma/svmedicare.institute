export interface AgencyAgentMetrics {
  userId: string;
  displayName: string;
  sessionsLogged: number;
  lastScore: number | null;
  avgScore: number;
  avgResponseTimeSec: number;
  lastActivityAt: number;
}

export interface AgencyDashboardSnapshot {
  agencyId: string;
  agencyName: string;
  updatedAt: number;
  agents: AgencyAgentMetrics[];
}

export interface AgentSummary {
  userId: string;
  fullName: string;
  email: string;
  rank: string;
  trainingProgress: number;
  averageComplianceScore: number;
  certificationsEarned: number;
  riskLevel: "low" | "medium" | "high";
  lastActivity: string;
  /** pending | certified | expired — command center */
  certificationStatus: "pending" | "certified" | "expired";
}

export interface AgencyDashboardMetrics {
  totalAgents: number;
  activeAgents: number;
  averageComplianceScore: number;
  certificatesIssued: number;
  certificatesExpiringSoon: number;
  highRiskAgents: number;
}

