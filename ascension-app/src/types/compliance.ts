export type ChecklistItemStatus = "pending" | "completed" | "missed" | "violation";

export type ChecklistItemId =
  | "greeting"
  | "name_collected"
  | "zip_collected"
  | "recording_disclosure"
  | "recording_consent"
  | "multi_plan_disclaimer"
  | "scope_appointment"
  | "callback_number"
  | "part_ab_status"
  | "current_plan"
  | "medicaid_status";

export type ChecklistItemState = {
  id: ChecklistItemId;
  label: string;
  status: ChecklistItemStatus;
};

export type ComplianceRule = {
  id: string;
  label: string;
  category: "greeting" | "recording" | "scope" | "disclosure" | "needs" | "conduct";
  weight: number;
  critical?: boolean;
  keywords?: string[];
};

export type ComplianceViolation = {
  code: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
};

export type StepResult = {
  stepId: string;
  label: string;
  status: ChecklistItemStatus;
  note?: string;
};

export type ComplianceScore = {
  overall: number;
  compliancePct: number;
  flowPct: number;
  professionalismPct: number;
  needsPct: number;
  passLabel: "pass" | "conditional" | "fail";
  criticalFailures: string[];
};

export type CoachingFeedback = {
  summary: string;
  bullets: string[];
  suggestedPhrases: string[];
};

export type CallAttempt = {
  id: string;
  agentUserId: string;
  agentDisplayName: string;
  scenarioId: string;
  scenarioTitle: string;
  mode: string;
  profileId: string;
  difficultyKey: string;
  score: number;
  passLabel: ComplianceScore["passLabel"];
  violations: string[];
  missedSteps: string[];
  startedAt: string | null;
  endedAt: string;
  transcriptPreview: string;
};
