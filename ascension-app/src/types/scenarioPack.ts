/** Types for `scenario-pack.json` (SV Medicare compliance training pack). */

export type ScenarioPackMode = "guided" | "roleplay" | "ai_live";

export type ScenarioPackDisclaimer = {
  global: string;
  script: string;
};

export type ScenarioStep = {
  id: string;
  type?: string;
  rule?: string;
  description?: string;
  expected?: string[];
  failOnMissing?: boolean;
  next?: string;
  branches?: Record<string, string>;
  aiResponse?: string | Record<string, string>;
  failConditions?: string[];
  fields?: string[];
  validation?: string;
  system?: string;
  result?: string;
  feedback?: string;
};

export type ScenarioViolation = {
  code: string;
  severity: string;
  message: string;
};

export type ScenarioDefinition = {
  id: string;
  title: string;
  difficulty?: string;
  personality?: string;
  description?: string;
  steps: ScenarioStep[];
  violations?: ScenarioViolation[];
};

export type AiPersonalityDef = {
  id: string;
  tone: string;
  behavior: string;
};

export type ScenarioPackScoring = {
  compliance_weight: number;
  communication_weight: number;
  accuracy_weight: number;
  pass_threshold: number;
};

export type ScenarioPackRoot = {
  id: string;
  title: string;
  version: string;
  author: string;
  modes: ScenarioPackMode[];
  disclaimer: ScenarioPackDisclaimer;
  scenarios: ScenarioDefinition[];
  aiPersonalities: AiPersonalityDef[];
  scoring: ScenarioPackScoring;
};
