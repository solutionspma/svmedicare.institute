import type { ComplianceStepId } from "./complianceChecklistEngine";

const STATIC_COACHING: Record<ComplianceStepId, string> = {
  permission_confirmed:
    "Open with permission to continue the Medicare discussion. Without clear consent, do not proceed to needs or plan content.",
  callback_number_captured:
    "Capture and confirm a callback number (or documented preference) so the contact can be reached compliantly if the session drops.",
  scope_confirmed:
    "Confirm the scope of appointment: which product types (MA/MAPD, PDP, Medigap, etc.) are in scope before tailored benefit talk.",
  disclaimer_provided:
    "Deliver required disclaimers (e.g., not government, plan availability, recording where applicable) before deep plan discussion.",
};

export function coachingLinesForMissedSteps(missed: ComplianceStepId[]): string[] {
  return missed.map((id) => STATIC_COACHING[id]);
}
