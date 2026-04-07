import type { ChecklistState, ComplianceStepId } from "./complianceChecklistEngine";
import { completedRequiredCount } from "./complianceChecklistEngine";

export type ScoreResult = {
  percentage: number;
  passed: boolean;
  completed: number;
  total: number;
};

/** Pass only when every required step is completed (100% of required). */
export function computeScore(
  state: ChecklistState,
  requiredSteps: ComplianceStepId[]
): ScoreResult {
  const total = requiredSteps.length;
  if (total === 0) {
    return { percentage: 100, passed: true, completed: 0, total: 0 };
  }
  const completed = completedRequiredCount(state, requiredSteps);
  const percentage = Math.round((completed / total) * 100);
  const passed = completed === total;
  return { percentage, passed, completed, total };
}
