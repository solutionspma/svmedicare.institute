/**
 * Premium entry alias for realtime session minting — same secure flow as createAICallSession.
 * OPENAI_API_KEY stays server-side only.
 */
const mod = require("./createAICallSession.js");
exports.handler = mod.handler;
