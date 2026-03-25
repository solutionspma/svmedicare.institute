/**
 * Verifies HMAC-signed credential payloads (query or JSON body).
 */

const { verifyPayload } = require("../lib/credentialCrypto.cjs");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function getSecret() {
  return process.env.CREDENTIAL_SIGNING_SECRET || "dev-credential-secret-change-for-production";
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let payload;
  let signature;

  if (event.httpMethod === "GET") {
    const qs = event.queryStringParameters || {};
    const sig = qs.sig || "";
    const pB64 = qs.p || "";
    try {
      signature = sig;
      const raw = Buffer.from(pB64, "base64url").toString("utf8");
      payload = JSON.parse(raw);
    } catch {
      return {
        statusCode: 400,
        headers: { ...cors, "Content-Type": "application/json" },
        body: JSON.stringify({ valid: false, error: "Malformed query parameters" }),
      };
    }
  } else {
    try {
      const body = JSON.parse(event.body || "{}");
      payload = body.payload;
      signature = body.signature;
    } catch {
      return {
        statusCode: 400,
        headers: { ...cors, "Content-Type": "application/json" },
        body: JSON.stringify({ valid: false, error: "Invalid JSON" }),
      };
    }
  }

  if (!payload || typeof payload !== "object" || typeof signature !== "string") {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ valid: false, error: "Missing payload or signature" }),
    };
  }

  const ok = verifyPayload(payload, signature, getSecret());

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({
      valid: ok,
      credential: ok
        ? {
            credentialId: payload.credentialId,
            type: payload.type,
            holderDisplayName: payload.holderDisplayName,
            issuedAt: payload.issuedAt,
            programVersion: payload.programVersion,
            qualifyingScores: payload.qualifyingScores,
          }
        : null,
    }),
  };
};
