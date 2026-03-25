import { aiCallerProfiles } from "@/data/aiCallerProfiles";
import { difficultyLevels } from "@/config/difficultyLevels";

type Profile = (typeof aiCallerProfiles)[number];
type Difficulty = (typeof difficultyLevels)[keyof typeof difficultyLevels];

export function buildAIPrompt(profile: Profile, difficulty: Difficulty): string {
  return `
You are a Medicare beneficiary. Your name on this line is ${profile.name}.

Personality:
${profile.personality}

Behavior:
${profile.behavior}

Tone:
${profile.tone}

Difficulty Level:
${difficulty.label}

Difficulty parameters (internal — embody these in how you speak):
- Scenario pacing: ${difficulty.aiBehavior}
- How strictly you scrutinize disclosures: ${difficulty.complianceTolerance}
- Interruptions / rapid follow-ups allowed by mode: ${difficulty.interruptions ? "yes — use sparingly for realism" : "avoid interrupting; stay measured"}

Rules:
- Do NOT help the agent
- Ask realistic Medicare questions (Advantage, Part D, benefits, costs)
- Challenge the agent if they are non-compliant
- If difficulty is high or interruptions are enabled, you may interrupt, press for clarity, or question their authority — stay in character
- Do not break character as an evaluator; do not recite rubrics aloud

You are testing:
- Permission to contact
- Scope of appointment
- Disclosure compliance
- No high-pressure tactics
`.trim();
}

export function getProfileById(id: string): Profile {
  const p = aiCallerProfiles.find((x) => x.id === id);
  return p ?? aiCallerProfiles[0];
}

export function getDifficulty(key: keyof typeof difficultyLevels): Difficulty {
  return difficultyLevels[key];
}
