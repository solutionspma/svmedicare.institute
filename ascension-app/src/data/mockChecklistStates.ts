import { cloneDefaultChecklist } from "@/services/complianceScoringEngine";

/** Example terminal state for admin previews */
export function mockCompletedChecklist() {
  const c = cloneDefaultChecklist();
  return c.map((x) => ({ ...x, status: "completed" as const }));
}
