const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const {
  MEDICARE_AUDITOR_SYSTEM_PROMPT,
  normalizeMedicareAuditJson,
} = require("../lib/medicareAuditorPrompt.js");

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
      temperature: 0.12,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: MEDICARE_AUDITOR_SYSTEM_PROMPT },
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

  const norm = normalizeMedicareAuditJson(parsed);

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({
      complianceScore: norm.complianceScore,
      score: norm.score,
      result: norm.result,
      passLabel: norm.passLabel,
      summary: norm.summary,
      checklist: norm.checklist,
      violations: norm.violations,
      violationsDetailed: norm.violationsDetailed,
      missedSteps: norm.missedSteps,
      coaching: norm.coaching,
      coachingFeedback: norm.coachingFeedback,
      suggestedResponses: norm.suggestedResponses,
    }),
  };
};
