export type AdminAgentRow = {
  userId: string;
  displayName: string;
  callsCompleted: number;
  avgScore: number;
  passRatePct: number;
  lastActivity: string;
  riskLevel: "low" | "medium" | "high";
  certificationReady: boolean;
};

export type ScenarioMetric = {
  scenarioId: string;
  title: string;
  attempts: number;
  avgScore: number;
  failRatePct: number;
};

export type ViolationAggregate = {
  label: string;
  count: number;
};

export type AdminSessionSummary = {
  id: string;
  agentName: string;
  scenarioTitle: string;
  score: number;
  passLabel: string;
  endedAt: string;
  transcriptPreview: string;
};

export type AdminDashboardSnapshot = {
  totalTrainees: number;
  completedCalls: number;
  avgComplianceScore: number;
  passRatePct: number;
  criticalViolationsPeriod: number;
  certificationReadyCount: number;
  agents: AdminAgentRow[];
  scenarioMetrics: ScenarioMetric[];
  violationTop: ViolationAggregate[];
  recentSessions: AdminSessionSummary[];
};
