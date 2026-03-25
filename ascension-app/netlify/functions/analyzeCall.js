const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const AUDITOR_PROMPT =
  "You are a Medicare compliance auditor. " +
  "Review this call transcript and evaluate whether the agent followed CMS regulations. " +
  "Respond with JSON only, no markdown, using this shape:\n" +
  '{"complianceScore":number,"violations":string[],"missedSteps":string[],"suggestedResponses":string[],"coachingFeedback":string}\n' +
  "complianceScore must be 0-100. " +
  "violations: specific issues. " +
  "missedSteps: CMS steps the agent skipped. " +
  "suggestedResponses: concrete improved phrases. " +
  "coachingFeedback: 2-4 short paragraphs of narrative feedback.";

export async function handler(event) {
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
        error:
          "OPENAI_API_KEY is not set on Netlify. Add it under Site configuration → Environment variables, then redeploy.",
        remediation: [
          "Variable name: OPENAI_API_KEY",
          "Redeploy after saving so analyzeCall can reach OpenAI.",
        ],
      }),
    };
  }

  let transcript = "";
  try {
    const body = JSON.parse(event.body || "{}");
    transcript = typeof body.transcript === "string" ? body.transcript : "";
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
        { role: "system", content: AUDITOR_PROMPT },
        { role: "user", content: `Transcript:\n\n${transcript}` },
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
      body: JSON.stringify({ error: "Model returned non-JSON", raw: content }),
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
}
