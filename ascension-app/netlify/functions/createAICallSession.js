/**
 * Mints an ephemeral Realtime client secret for browser WebRTC.
 * Uses OPENAI_API_KEY only on the server — never sent to the client.
 *
 * Browser flow: POST SDP to https://api.openai.com/v1/realtime/calls with Bearer <ephemeral>.
 *
 * Optional POST JSON: { profileId, difficultyKey } — validated server-side for session instructions.
 */

const { buildRealtimeInstructions } = require("../lib/buildRealtimeInstructions.js");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = typeof process.env.OPENAI_API_KEY === "string" ? process.env.OPENAI_API_KEY.trim() : "";
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
          "Apply to Production (and Preview if you test deploy previews).",
          "Redeploy the site after saving so serverless functions load the key.",
        ],
      }),
    };
  }

  let profileId;
  let difficultyKey;
  let scenarioId;
  if (event.httpMethod === "POST" && event.body) {
    try {
      const body = JSON.parse(event.body);
      if (body && typeof body === "object") {
        profileId = body.profileId;
        difficultyKey = body.difficultyKey;
        scenarioId = typeof body.scenarioId === "string" ? body.scenarioId : undefined;
      }
    } catch {
      /* ignore invalid JSON — defaults apply */
    }
  }

  const instructions = buildRealtimeInstructions(profileId, difficultyKey, scenarioId);

  /** GA realtime model; override with OPENAI_REALTIME_MODEL on Netlify if needed. */
  const realtimeModel = process.env.OPENAI_REALTIME_MODEL?.trim() || "gpt-realtime";

  const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: {
        type: "realtime",
        model: realtimeModel,
        instructions,
        audio: {
          input: {
            transcription: { model: "whisper-1" },
            noise_reduction: { type: "near_field" },
          },
          output: { voice: "alloy" },
        },
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      statusCode: response.status,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify(data.error ? data : { error: "Failed to create session", data }),
    };
  }

  /**
   * OpenAI returns either:
   * - { value, expires_at, session } (current client_secrets docs), or
   * - { client_secret: { value, expires_at } | string, ... } (older / nested shapes).
   */
  let secretValue;
  let secretExpires;
  if (typeof data.value === "string" && data.value.length > 0) {
    secretValue = data.value;
    secretExpires = data.expires_at;
  } else if (data.client_secret != null) {
    if (typeof data.client_secret === "string") {
      secretValue = data.client_secret;
      secretExpires = data.expires_at;
    } else if (typeof data.client_secret === "object" && typeof data.client_secret.value === "string") {
      secretValue = data.client_secret.value;
      secretExpires = data.client_secret.expires_at;
    }
  }

  if (!secretValue) {
    return {
      statusCode: 502,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "EPHEMERAL_KEY_MISSING",
        error:
          "OpenAI returned 200 but no client secret in the expected shape. If your project still uses gpt-4o-realtime-preview, set Netlify env OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview and redeploy.",
        raw_keys: data && typeof data === "object" ? Object.keys(data) : [],
      }),
    };
  }

  const sessionModel =
    data.session && typeof data.session === "object" && typeof data.session.model === "string"
      ? data.session.model
      : realtimeModel;

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({
      client_secret: { value: secretValue, expires_at: secretExpires },
      model: sessionModel,
    }),
  };
};
