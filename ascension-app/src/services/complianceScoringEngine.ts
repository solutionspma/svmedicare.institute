import { DEFAULT_CHECKLIST, TRANSCRIPT_HINTS } from "@/data/complianceRules";
import type {
  CallAttempt,
  ChecklistItemId,
  ChecklistItemState,
  ChecklistItemStatus,
  CoachingFeedback,
  ComplianceScore,
  ComplianceViolation,
  StepResult,
} from "@/types/compliance";

const PRESSURE = /\b(limited time|today only|act now|urgent|must decide now|last chance)\b/i;
const FALSE_GUARANTEE = /\b(guarantee|always covered|free plan|no risk|secret)\b/i;

export function cloneDefaultChecklist(): ChecklistItemState[] {
  return DEFAULT_CHECKLIST.map((c) => ({ ...c }));
}

export function mergeChecklistFromAgentText(
  text: string,
  checklist: ChecklistItemState[]
): ChecklistItemState[] {
  const t = text.toLowerCase();
  return checklist.map((item) => {
    if (item.status === "violation" || item.status === "completed") return item;
    const hint = TRANSCRIPT_HINTS[item.id];
    if (!hint?.patterns?.length) return item;
    const hit = hint.patterns.some((p) => {
      p.lastIndex = 0;
      return p.test(text) || p.test(t);
    });
    return hit ? { ...item, status: "completed" as const } : item;
  });
}

function countCompleted(checklist: ChecklistItemState[]): number {
  return checklist.filter((c) => c.status === "completed").length;
}

export function detectMissedSteps(checklist: ChecklistItemState[]): string[] {
  return checklist.filter((c) => c.status === "pending" || c.status === "missed").map((c) => c.label);
}

export function detectViolations(
  transcript: string,
  checklist: ChecklistItemState[]
): ComplianceViolation[] {
  const out: ComplianceViolation[] = [];
  const lower = transcript.toLowerCase();
  if (PRESSURE.test(transcript)) {
    out.push({
      code: "PRESSURE_TACTICS",
      message: "Possible high-pressure or urgency language detected.",
      severity: "high",
    });
  }
  if (FALSE_GUARANTEE.test(transcript)) {
    out.push({
      code: "MISLEADING_STATEMENT",
      message: "Language may imply guarantees or hidden terms.",
      severity: "critical",
    });
  }
  const criticalIds: ChecklistItemId[] = [
    "recording_disclosure",
    "recording_consent",
    "multi_plan_disclaimer",
    "scope_appointment",
  ];
  for (const id of criticalIds) {
    const row = checklist.find((c) => c.id === id);
    if (row && (row.status === "pending" || row.status === "missed")) {
      out.push({
        code: `MISSED_${id.toUpperCase()}`,
        message: `Critical checkpoint not evidenced: ${row.label}`,
        severity: "critical",
      });
    }
  }
  void lower;
  return out;
}

export function calculateFinalScore(params: {
  checklist: ChecklistItemState[];
  violations: ComplianceViolation[];
  transcriptLength: number;
}): ComplianceScore {
  const { checklist, violations } = params;
  const total = checklist.length || 1;
  const done = countCompleted(checklist);
  const compliancePct = Math.round((done / total) * 100);
  const hasCriticalRecorded = violations.some((v) => v.severity === "critical");
  const pressure = violations.some((v) => v.code === "PRESSURE_TACTICS");
  const flowPct = hasCriticalRecorded ? 45 : Math.min(100, 60 + Math.floor(done / total * 40));
  const professionalismPct = pressure ? 55 : 88;
  const needsRows = checklist.filter((c) =>
    ["part_ab_status", "current_plan", "medicaid_status"].includes(c.id)
  );
  const needsDone = needsRows.filter((c) => c.status === "completed").length;
  const needsPct = Math.round((needsDone / Math.max(needsRows.length, 1)) * 100);

  let overall = Math.round(
    compliancePct * 0.6 + flowPct * 0.2 + professionalismPct * 0.1 + needsPct * 0.1
  );
  if (hasCriticalRecorded) overall = Math.min(overall, 72);

  let passLabel: ComplianceScore["passLabel"] = "pass";
  if (overall < 70 || hasCriticalRecorded) passLabel = "fail";
  else if (overall < 85 || pressure) passLabel = "conditional";

  return {
    overall,
    compliancePct,
    flowPct,
    professionalismPct,
    needsPct,
    passLabel,
    criticalFailures: violations.filter((v) => v.severity === "critical").map((v) => v.message),
  };
}

export function scoreCall(
  transcript: string,
  _scenarioId: string,
  checklist: ChecklistItemState[]
): ComplianceScore {
  const violations = detectViolations(transcript, checklist);
  return calculateFinalScore({
    checklist,
    violations,
    transcriptLength: transcript.length,
  });
}

export function generateCoachingFeedback(
  checklist: ChecklistItemState[],
  violations: ComplianceViolation[]
): CoachingFeedback {
  const missed = detectMissedSteps(checklist);
  const bullets: string[] = [];
  if (missed.length) bullets.push(`Re-run call focusing on: ${missed.slice(0, 4).join("; ")}.`);
  if (violations.some((v) => v.code === "PRESSURE_TACTICS")) {
    bullets.push("Replace urgency framing with calm, permission-based schedules.");
  }
  if (violations.some((v) => v.severity === "critical")) {
    bullets.push("Critical disclosures must precede needs depth — reset sequencing.");
  }
  return {
    summary: bullets[0] ?? "Maintain disclosures, scope, and measured tone throughout.",
    bullets: bullets.length ? bullets : ["Continue deliberate pacing and confirm consent at each gate."],
    suggestedPhrases: [
      "May I have permission to discuss Medicare health plans, including Medicare Advantage, Medicare Supplement, and Part D?",
      "We don't offer every plan in your area — for a full list you can contact Medicare.gov or 1-800-MEDICARE.",
      "This call may be monitored or recorded for quality — do I have your permission to continue?",
    ],
  };
}

export function checklistToStepResults(checklist: ChecklistItemState[]): StepResult[] {
  return checklist.map((c) => ({
    stepId: c.id,
    label: c.label,
    status: c.status,
  }));
}

export function markChecklistViolations(
  checklist: ChecklistItemState[],
  missedCriticalIds: ChecklistItemId[]
): ChecklistItemState[] {
  return checklist.map((c) =>
    missedCriticalIds.includes(c.id) ? { ...c, status: "violation" as ChecklistItemStatus } : c
  );
}
