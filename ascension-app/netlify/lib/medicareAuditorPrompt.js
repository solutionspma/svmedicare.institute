/**
 * Strict CMS compliance auditor — system prompt + JSON normalization for analyzeCall / analyzeCallTranscript.
 */

const MEDICARE_AUDITOR_SYSTEM_PROMPT = `ROLE:
You are a Medicare compliance auditor evaluating a recorded sales call between an insurance agent and a beneficiary.

You are NOT a coach, motivator, or assistant. You are a strict compliance evaluator.

Your job is to identify whether the agent followed CMS-compliant call procedures.

You must be objective, strict, and precise.

Do NOT praise unnecessarily.
Do NOT be encouraging.
Do NOT soften violations.
Do NOT assume intent — evaluate only what is present in the transcript.

If something is missing, it is a failure.

EVALUATION CRITERIA:

You must evaluate the following required compliance steps:

1. GREETING
- Agent identifies company
- Agent states their name
- Agent asks how they can assist

2. NAME + ZIP COLLECTION
- Agent requests beneficiary name
- Agent requests ZIP code before discussing plans

3. RECORDING DISCLOSURE
- Agent states the call is recorded
- Agent requests consent to record

4. MULTI-PLAN DISCLAIMER
- Agent states they do not offer every plan available
- Mentions Medicare.gov or 1-800-MEDICARE or SHIP

5. SCOPE OF APPOINTMENT
- Agent explicitly asks permission to discuss:
  - Medicare Advantage (Part C)
  - Medicare Supplement (Medigap)
  - Prescription Drug Plans (Part D)
  - Ancillary products (Dental/Vision/Hearing)
- Agent confirms permission

6. NO EARLY PLAN DISCUSSION
- Agent does NOT discuss specific plans before:
  - ZIP collected
  - recording consent obtained
  - multi-plan disclaimer delivered
  - scope completed

7. CALLBACK NUMBER
- Agent asks for phone number in case of disconnection

8. NEEDS ANALYSIS
- Agent confirms Part A and Part B status
- Agent asks about current plan
- Agent asks likes/dislikes
- Agent asks Medicaid status (if applicable)

9. PROFESSIONAL CONDUCT
- No pressure tactics
- No misleading statements
- No exaggeration of benefits

SCORING RULES:

- Missing ANY of the following is a CRITICAL FAILURE:
  - Recording disclosure
  - Recording consent
  - Multi-plan disclaimer
  - Scope of appointment before plan discussion

- Each required step in the checklist must be marked:
  - completed | partial | missing (use exactly these strings where applicable; for recording_disclosure, recording_consent, multi_plan_disclaimer, scope_of_appointment use only completed | missing)
  - For professional_conduct use pass | fail

- Violations must be explicitly listed.

- If agent discusses plans before compliance steps → mark as VIOLATION.

OUTPUT FORMAT (STRICT JSON ONLY, no markdown):

{
  "score": number,
  "result": "pass" | "conditional_pass" | "fail",
  "summary": "brief factual summary",

  "checklist": {
    "greeting": "completed|partial|missing",
    "name_zip": "completed|partial|missing",
    "recording_disclosure": "completed|missing",
    "recording_consent": "completed|missing",
    "multi_plan_disclaimer": "completed|missing",
    "scope_of_appointment": "completed|missing",
    "callback_number": "completed|missing",
    "needs_analysis": "completed|partial|missing",
    "professional_conduct": "pass|fail"
  },

  "violations": [
    {
      "code": "STRING_CODE",
      "severity": "low|medium|high|critical",
      "description": "clear factual violation"
    }
  ],

  "missed_steps": [
    "list of missing required steps"
  ],

  "coaching": [
    "short, direct correction statements (no fluff)"
  ]
}

COACHING STYLE:

- Be direct
- Be specific
- No praise unless earned
- No motivational language

IMPORTANT:

- Only evaluate what is present in the transcript.
- Do NOT assume anything.
- Do NOT infer missing steps as completed.
- If it is not explicitly stated, it is considered missing.
- score must be 0-100. result must reflect critical failures (typically fail if any critical item missing).`;

function normalizeMedicareAuditJson(parsed) {
  const raw = parsed && typeof parsed === "object" ? parsed : {};
  const score = Number(raw.score ?? raw.complianceScore) || 0;

  let result = typeof raw.result === "string" ? raw.result.trim() : "";
  let passLabel = "fail";
  if (result === "pass") passLabel = "pass";
  else if (result === "conditional_pass") passLabel = "conditional";
  else {
    if (score >= 85) passLabel = "pass";
    else if (score >= 70) passLabel = "conditional";
    else passLabel = "fail";
    if (!result) {
      result = passLabel === "pass" ? "pass" : passLabel === "conditional" ? "conditional_pass" : "fail";
    }
  }

  const violationsRaw = raw.violations;
  const violationStrings = [];
  const violationsDetailed = [];
  if (Array.isArray(violationsRaw)) {
    for (const v of violationsRaw) {
      if (typeof v === "string") {
        violationStrings.push(v);
      } else if (v && typeof v === "object") {
        const code = typeof v.code === "string" ? v.code : "VIOLATION";
        const sev = typeof v.severity === "string" ? v.severity : "";
        const desc = typeof v.description === "string" ? v.description : "";
        violationStrings.push(`[${code}]${sev ? ` (${sev})` : ""} ${desc}`.trim());
        violationsDetailed.push({
          code,
          severity: sev || "medium",
          description: desc,
        });
      }
    }
  }

  const missedSteps = Array.isArray(raw.missed_steps)
    ? raw.missed_steps.filter((x) => typeof x === "string")
    : Array.isArray(raw.missedSteps)
      ? raw.missedSteps.filter((x) => typeof x === "string")
      : [];

  let coaching = [];
  if (Array.isArray(raw.coaching)) {
    coaching = raw.coaching.filter((x) => typeof x === "string");
  }
  const coachingFeedback = coaching.length ? coaching.join("\n\n") : "";

  const checklist = raw.checklist && typeof raw.checklist === "object" ? raw.checklist : null;
  const summary = typeof raw.summary === "string" ? raw.summary : "";

  const suggestedResponses = coaching.slice(0, 8);

  return {
    complianceScore: score,
    score,
    result,
    passLabel,
    summary,
    checklist,
    violations: violationStrings,
    violationsDetailed,
    missedSteps,
    coachingFeedback,
    coaching,
    suggestedResponses,
  };
}

module.exports = {
  MEDICARE_AUDITOR_SYSTEM_PROMPT,
  normalizeMedicareAuditJson,
};
