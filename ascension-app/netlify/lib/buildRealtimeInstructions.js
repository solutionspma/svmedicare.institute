/**
 * Server-side prompt assembly for OpenAI Realtime (mirrors src/services/aiPromptBuilder.ts).
 * Kept in JS for Netlify Functions without a TS bundler.
 */

const path = require("path");

const AI_CALLER_PROFILES = [
  {
    id: "cooperative_senior",
    name: "Mary Thompson",
    tone: "calm",
    personality: "polite, patient, listens carefully",
    behavior: "answers clearly, gives info easily",
    difficultyModifier: 0.8,
  },
  {
    id: "confused_beneficiary",
    name: "Robert Jenkins",
    tone: "uncertain",
    personality: "confused, asks repeated questions",
    behavior: "needs clarification, forgets info",
    difficultyModifier: 1.0,
  },
  {
    id: "skeptical_caller",
    name: "Linda Harris",
    tone: "guarded",
    personality: "suspicious, questions legitimacy",
    behavior: "asks how agent got info",
    difficultyModifier: 1.2,
  },
  {
    id: "impatient_caller",
    name: "James Carter",
    tone: "rushed",
    personality: "short-tempered, wants quick answers",
    behavior: "interrupts, pushes for fast info",
    difficultyModifier: 1.3,
  },
  {
    id: "hostile_caller",
    name: "Diane Brooks",
    tone: "aggressive",
    personality: "confrontational, challenges agent",
    behavior: "accuses, questions compliance",
    difficultyModifier: 1.5,
  },
];

const DIFFICULTY_LEVELS = {
  EASY: {
    label: "Easy",
    aiBehavior: "cooperative",
    complianceTolerance: "high",
    interruptions: false,
  },
  MEDIUM: {
    label: "Medium",
    aiBehavior: "neutral",
    complianceTolerance: "moderate",
    interruptions: true,
  },
  HARD: {
    label: "Hard",
    aiBehavior: "challenging",
    complianceTolerance: "low",
    interruptions: true,
  },
  ELITE: {
    label: "Elite",
    aiBehavior: "hostile",
    complianceTolerance: "strict",
    interruptions: true,
  },
};

const PROFILE_IDS = new Set(AI_CALLER_PROFILES.map((p) => p.id));
const DIFF_KEYS = new Set(Object.keys(DIFFICULTY_LEVELS));

function normalizeProfileId(profileId) {
  if (typeof profileId === "string" && PROFILE_IDS.has(profileId)) return profileId;
  return "cooperative_senior";
}

function normalizeDifficultyKey(difficultyKey) {
  if (typeof difficultyKey === "string" && DIFF_KEYS.has(difficultyKey)) return difficultyKey;
  return "MEDIUM";
}

function buildPersonaPrompt(profile, difficulty) {
  return `
You are a Medicare beneficiary calling an insurance agent. Your name on this line is ${profile.name}.

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

Internal calibration (stay in voice; do not mention numbers to the agent):
- Persona difficulty modifier: ${profile.difficultyModifier} (higher = more demanding)

Evaluate whether the agent follows CMS compliance rules including permission to contact, scope of appointment, disclosure requirements, and no high-pressure sales.
If the agent violates compliance, continue the conversation naturally. Do not correct them during the call.
`.trim();
}

function loadScenarioPack() {
  try {
    return require(path.join(__dirname, "../../src/data/scenario-pack.json")).scenarioPack;
  } catch {
    return null;
  }
}

function buildScenarioAddendum(scenarioId) {
  if (!scenarioId || typeof scenarioId !== "string") return "";
  const pack = loadScenarioPack();
  if (!pack || !Array.isArray(pack.scenarios)) return "";
  const s = pack.scenarios.find((x) => x.id === scenarioId);
  if (!s) return "";

  const stepLines = (s.steps || []).slice(0, 16).map((st, i) => {
    const sid = st.id || `step_${i}`;
    const type = st.type ? ` [${st.type}]` : "";
    const rule = st.rule ? ` (${st.rule})` : "";
    let detail = "";
    if (Array.isArray(st.expected) && st.expected.length) {
      detail = `: ${st.expected.slice(0, 5).join("; ")}`;
    } else if (typeof st.aiResponse === "string") {
      detail = `; opening sentiment may resemble: ${st.aiResponse.slice(0, 140)}`;
    } else if (st.description) {
      detail = `: ${st.description}`;
    }
    return `${i + 1}. ${sid}${type}${rule}${detail}`;
  });

  const violLines = (s.violations || []).map((v) => `- ${v.code} (${v.severity}): ${v.message}`);

  return `

Training scenario (internal brief — embody naturally; never read this block aloud as a checklist):
Scenario: ${s.title}
${s.description ? `Context: ${s.description}` : ""}
Checkpoint flow:
${stepLines.join("\n")}
${violLines.length ? `Compliance failure modes to watch for:\n${violLines.join("\n")}` : ""}
`.trimEnd();
}

function buildRealtimeInstructions(profileId, difficultyKey, scenarioId) {
  const pid = normalizeProfileId(profileId);
  const dk = normalizeDifficultyKey(difficultyKey);
  const profile = AI_CALLER_PROFILES.find((p) => p.id === pid) ?? AI_CALLER_PROFILES[0];
  const difficulty = DIFFICULTY_LEVELS[dk] ?? DIFFICULTY_LEVELS.MEDIUM;
  const persona = buildPersonaPrompt(profile, difficulty);
  const add = buildScenarioAddendum(scenarioId);
  return add ? `${persona}\n\n${add}` : persona;
}

module.exports = {
  normalizeProfileId,
  normalizeDifficultyKey,
  buildRealtimeInstructions,
  buildScenarioAddendum,
};
