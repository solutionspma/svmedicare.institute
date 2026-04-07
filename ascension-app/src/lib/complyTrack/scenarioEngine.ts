import raw from "@/data/complyTrackScenarios.json";
import {
  COMPLIANCE_STEP_IDS,
  type ComplianceStepId,
  isComplianceStepId,
} from "./complianceChecklistEngine";

export type ScenarioType = "inbound" | "outbound" | "event";

export type ComplyTrackScenario = {
  id: string;
  name: string;
  type: ScenarioType;
  requiredComplianceSteps: ComplianceStepId[];
  description?: string;
  callerDisplayName?: string;
  callerSubtitle?: string;
};

type ScenariosFile = {
  version: string;
  scenarios: Array<{
    id: string;
    name: string;
    type: string;
    requiredComplianceSteps: string[];
    description?: string;
    callerDisplayName?: string;
    callerSubtitle?: string;
  }>;
};

function normalizeScenario(row: ScenariosFile["scenarios"][number]): ComplyTrackScenario {
  const steps: ComplianceStepId[] = [];
  for (const s of row.requiredComplianceSteps) {
    if (isComplianceStepId(s)) steps.push(s);
  }
  if (steps.length === 0) {
    steps.push(...COMPLIANCE_STEP_IDS);
  }
  const t = row.type;
  const type: ScenarioType =
    t === "outbound" ? "outbound" : t === "event" ? "event" : "inbound";
  return {
    id: row.id,
    name: row.name,
    type,
    requiredComplianceSteps: steps,
    description: row.description,
    callerDisplayName: row.callerDisplayName,
    callerSubtitle: row.callerSubtitle,
  };
}

const file = raw as ScenariosFile;

const SCENARIOS: ComplyTrackScenario[] = file.scenarios.map(normalizeScenario);
const BY_ID = new Map(SCENARIOS.map((s) => [s.id, s]));

export function loadScenarios(): ComplyTrackScenario[] {
  return [...SCENARIOS];
}

export function getScenarioById(id: string): ComplyTrackScenario | undefined {
  return BY_ID.get(id);
}

export function scenariosVersion(): string {
  return file.version;
}
