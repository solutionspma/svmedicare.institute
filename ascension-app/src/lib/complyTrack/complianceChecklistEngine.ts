export const COMPLIANCE_STEP_IDS = [
  "permission_confirmed",
  "callback_number_captured",
  "scope_confirmed",
  "disclaimer_provided",
] as const;

export type ComplianceStepId = (typeof COMPLIANCE_STEP_IDS)[number];

const STEP_SET = new Set<string>(COMPLIANCE_STEP_IDS);

export function isComplianceStepId(v: string): v is ComplianceStepId {
  return STEP_SET.has(v);
}

export type ChecklistState = Record<ComplianceStepId, boolean>;

export function createChecklistForScenario(required: ComplianceStepId[]): ChecklistState {
  const next = {} as ChecklistState;
  for (const id of COMPLIANCE_STEP_IDS) {
    next[id] = false;
  }
  for (const id of required) {
    if (STEP_SET.has(id)) next[id] = false;
  }
  return next;
}

/** Only keys in `required` are scored; others stay false and are ignored by scoring. */
export function setStep(state: ChecklistState, id: ComplianceStepId, done: boolean): ChecklistState {
  return { ...state, [id]: done };
}

export function toggleStep(state: ChecklistState, id: ComplianceStepId): ChecklistState {
  return { ...state, [id]: !state[id] };
}

export function completedRequiredCount(state: ChecklistState, required: ComplianceStepId[]): number {
  return required.filter((id) => state[id]).length;
}
