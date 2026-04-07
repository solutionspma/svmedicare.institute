import type { ComplianceStepId } from "./complianceChecklistEngine";
import { COMPLIANCE_STEP_IDS } from "./complianceChecklistEngine";

export const STEP_LABELS: Record<ComplianceStepId, string> = {
  permission_confirmed: "Permission confirmed",
  callback_number_captured: "Callback number captured",
  scope_confirmed: "Scope confirmed",
  disclaimer_provided: "Disclaimer provided",
};

export function orderedStepsForScenario(required: ComplianceStepId[]): ComplianceStepId[] {
  return COMPLIANCE_STEP_IDS.filter((id) => required.includes(id));
}
