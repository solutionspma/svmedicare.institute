import type { DifficultyLevelKey } from "@/config/difficultyLevels";
import type { ScenarioDefinition, ScenarioPackRoot, ScenarioStep } from "@/types/scenarioPack";
import type { AICallerProfileId } from "@/data/aiCallerProfiles";
import raw from "./scenario-pack.json";

export const SCENARIO_PACK = raw.scenarioPack as ScenarioPackRoot;

export function listTrainingScenarios(): ScenarioDefinition[] {
  return SCENARIO_PACK.scenarios;
}

export function getScenarioById(id: string): ScenarioDefinition | undefined {
  return SCENARIO_PACK.scenarios.find((s) => s.id === id);
}

/** Map pack personality id to existing AI caller profile (voice simulation). */
export function mapPackPersonalityToProfileId(personality?: string): AICallerProfileId {
  switch (personality) {
    case "neutral_beneficiary":
      return "cooperative_senior";
    case "frustrated_beneficiary":
      return "hostile_caller";
    case "elderly_confused":
      return "confused_beneficiary";
    default:
      return "cooperative_senior";
  }
}

export function mapPackDifficultyToLab(difficulty?: string): DifficultyLevelKey {
  switch (difficulty) {
    case "hard":
      return "HARD";
    case "advanced":
      return "ELITE";
    case "normal":
    default:
      return "MEDIUM";
  }
}

export function formatStepForDisplay(step: ScenarioStep): string {
  const parts: string[] = [step.id.replace(/_/g, " ")];
  if (step.type) parts.push(`(${step.type})`);
  if (step.rule) parts.push(`— ${step.rule}`);
  if (step.description) parts.push(`— ${step.description}`);
  if (step.expected?.length) {
    const ex = step.expected.slice(0, 5).join("; ");
    parts.push(`Expect: ${ex}${step.expected.length > 5 ? "…" : ""}`);
  }
  return parts.join(" ");
}

export function getPackPassThreshold(): number {
  return SCENARIO_PACK.scoring.pass_threshold;
}
