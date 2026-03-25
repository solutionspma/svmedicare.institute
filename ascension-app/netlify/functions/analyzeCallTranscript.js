/**
 * Extended transcript analysis: optional checklist + scenario metadata in the audit prompt.
 * API key server-side only.
 */
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BASE_AUDITOR =
  "You are a Medicare compliance auditor. Review the call transcript. " +
  "Respond with JSON only, no markdown: " +
  '{"complianceScore":number,"violations":string[],"missedSteps":string[],"suggestedResponses":string[],"coachingFeedback":string} ' +
  "complianceScore 0-100. Penalize heavily if recording disclosure, recording consent, multi-plan disclaimer, or scope of appointment " +
  "appear missing or out of sequence before detailed plan discussion.";

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "OPENAI_NOT_CONFIGURED",
        error: "OPENAI_API_KEY is not set on Netlify.",
      }),
    };
  }

  let transcript = "";
  let checklistState = null;
  let scenarioMeta = null;
  try {
    const body = JSON.parse(event.body || "{}");
    transcript = typeof body.transcript === "string" ? body.transcript : "";
    checklistState = body.checklistState ?? null;
    scenarioMeta = body.scenario ?? body.scenarioMeta ?? null;
  } catch {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!transcript.trim()) {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "transcript is required" }),
    };
  }

  const userBlock = [
    scenarioMeta ? `Scenario metadata:\n${JSON.stringify(scenarioMeta).slice(0, 1500)}` : "",
    checklistState ? `Trainee checklist state (client heuristic):\n${JSON.stringify(checklistState).slice(0, 2000)}` : "",
    `Transcript:\n\n${transcript}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: BASE_AUDITOR },
        { role: "user", content: userBlock },
      ],
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      statusCode: response.status,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify(data.error ? data : { error: "Analysis request failed", data }),
    };
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    return {
      statusCode: 502,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Empty model response" }),
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    return {
      statusCode: 502,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Model returned non-JSON", raw: content.slice(0, 400) }),
    };
  }

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({
      complianceScore: Number(parsed.complianceScore) || 0,
      violations: Array.isArray(parsed.violations) ? parsed.violations : [],
      missedSteps: Array.isArray(parsed.missedSteps) ? parsed.missedSteps : [],
      suggestedResponses: Array.isArray(parsed.suggestedResponses) ? parsed.suggestedResponses : [],
      coachingFeedback: typeof parsed.coachingFeedback === "string" ? parsed.coachingFeedback : "",
    }),
  };
};
