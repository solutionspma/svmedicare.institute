const crypto = require("crypto");

function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map((x) => stableStringify(x)).join(",")}]`;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

function signPayload(payload, secret) {
  const body = stableStringify(payload);
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

function timingSafeEqualHex(a, b) {
  try {
    const ba = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function verifyPayload(payload, signatureHex, secret) {
  const expected = signPayload(payload, secret);
  return timingSafeEqualHex(expected, signatureHex);
}

module.exports = { stableStringify, signPayload, verifyPayload };
