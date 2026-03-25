/**
 * Issues an HMAC-signed training credential payload (demo-tier; bind to Supabase for production).
 * Env: CREDENTIAL_SIGNING_SECRET (recommended)
 */

const { signPayload } = require("../lib/credentialCrypto.cjs");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function getSecret() {
  return process.env.CREDENTIAL_SIGNING_SECRET || "dev-credential-secret-change-for-production";
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const holderDisplayName =
    typeof body.holderDisplayName === "string" && body.holderDisplayName.trim()
      ? body.holderDisplayName.trim().slice(0, 120)
      : "Trainee";
  const subjectUserId = typeof body.subjectUserId === "string" ? body.subjectUserId.slice(0, 128) : "unknown";
  const qualifyingScores = Array.isArray(body.qualifyingScores)
    ? body.qualifyingScores
        .map((n) => Number(n))
        .filter((n) => Number.isFinite(n) && n >= 0 && n <= 100)
        .slice(0, 12)
    : [];
  const programVersion =
    typeof body.programVersion === "string" ? body.programVersion.slice(0, 32) : "SVMI-2026.03";

  if (qualifyingScores.length < 3 || qualifyingScores.filter((s) => s >= 90).length < 3) {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Credential requires at least three scored sessions with three scores at or above 90.",
      }),
    };
  }

  const issuedAt = new Date().toISOString();
  const credentialId = `svc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  const payload = {
    v: 1,
    type: "medicare_call_specialist",
    credentialId,
    holderDisplayName,
    subjectUserId,
    issuedAt,
    qualifyingScores,
    programVersion,
  };

  const signature = signPayload(payload, getSecret());
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({
      payload,
      payloadB64,
      signature,
    }),
  };
};
