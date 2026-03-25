/** User-facing copy for AI Call Lab / Netlify function failures (no secrets). */

export const NETLIFY_OPENAI_REMEDIATION = [
  "Netlify → Site configuration → Environment variables → add OPENAI_API_KEY for the production (and preview) scopes you use.",
  "Trigger a new deploy after saving variables so functions pick up the key.",
  "Confirm Functions are deployed: repo should include `netlify/functions` and `netlify.toml` build settings match this app.",
];

export const LOCAL_DEV_REMEDIATION = [
  "From the project root, run `netlify dev` (or deploy to Netlify) so `/.netlify/functions/*` resolves.",
];

export function isOpenAiNotConfiguredMessage(msg: string): boolean {
  const m = msg.toLowerCase();
  return m.includes("openai_api_key") || m.includes("not configured") || m.includes("openai not");
}

type ErrorJson = {
  error?: string | { message?: string };
  message?: string;
  code?: string;
  remediation?: string[];
};

function pickMessage(json: ErrorJson, fallback: string): string {
  const e = json.error;
  const m = json.message;
  if (typeof e === "string" && e.trim()) return e.trim();
  if (e && typeof e === "object" && e !== null && "message" in e) {
    const im = (e as { message?: string }).message;
    if (typeof im === "string" && im.trim()) return im.trim();
  }
  if (typeof m === "string" && m.trim()) return m.trim();
  return fallback;
}

export function formatCreateSessionFailure(params: {
  status: number;
  json: unknown;
  bodyText: string;
  fetchFailed?: boolean;
}): string {
  if (params.fetchFailed) {
    return [
      "Could not reach the session service (network offline or request blocked).",
      "",
      "• Check your connection and try again.",
      ...LOCAL_DEV_REMEDIATION.map((b) => `• ${b}`),
    ].join("\n");
  }

  const j = (params.json && typeof params.json === "object" ? params.json : {}) as ErrorJson;
  const base = pickMessage(j, params.bodyText.slice(0, 240) || `Session request failed (${params.status}).`);

  if (params.status === 404) {
    return [
      "The create-session function was not found (404).",
      "",
      ...LOCAL_DEV_REMEDIATION.map((b) => `• ${b}`),
      `• Expected path: /.netlify/functions/createAICallSession`,
    ].join("\n");
  }

  if (j.code === "OPENAI_NOT_CONFIGURED" || isOpenAiNotConfiguredMessage(base)) {
    return [base, "", ...NETLIFY_OPENAI_REMEDIATION.map((b) => `• ${b}`)].join("\n");
  }

  const extra =
    Array.isArray(j.remediation) && j.remediation.length > 0
      ? ["", ...j.remediation.map((b: string) => `• ${b}`)].join("\n")
      : "";

  if (params.status >= 500 && !extra) {
    return [base, "", ...NETLIFY_OPENAI_REMEDIATION.map((b) => `• ${b}`)].join("\n");
  }

  return base + extra;
}

export function formatRealtimeHandshakeFailure(status: number, bodySnippet: string): string {
  if (status === 401 || status === 403) {
    return [
      "OpenAI rejected the realtime handshake (authentication).",
      "",
      "• Ephemeral key may be expired — start the call again.",
      "• If this persists, verify `OPENAI_API_KEY` on Netlify has realtime access for your account.",
      bodySnippet ? `• Detail: ${bodySnippet.slice(0, 200)}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }
  return [
    "Realtime connection to OpenAI failed before audio could flow.",
    bodySnippet ? `Detail: ${bodySnippet.slice(0, 280)}` : "",
    "",
    ...NETLIFY_OPENAI_REMEDIATION.map((b) => `• ${b}`),
  ].join("\n");
}

export function formatAnalyzeCallFailure(params: {
  status: number;
  json: unknown;
  bodyText: string;
  fetchFailed?: boolean;
}): string {
  if (params.fetchFailed) {
    return [
      "Could not reach the compliance analysis service.",
      "",
      ...LOCAL_DEV_REMEDIATION.map((b) => `• ${b}`),
    ].join("\n");
  }

  const j = (params.json && typeof params.json === "object" ? params.json : {}) as ErrorJson;
  const base = pickMessage(j, params.bodyText.slice(0, 240) || `Analysis failed (${params.status}).`);

  if (params.status === 404) {
    return [
      "The analyze function was not found (404).",
      "",
      ...LOCAL_DEV_REMEDIATION.map((b) => `• ${b}`),
      `• Expected path: /.netlify/functions/analyzeCall`,
    ].join("\n");
  }

  if (j.code === "OPENAI_NOT_CONFIGURED" || isOpenAiNotConfiguredMessage(base)) {
    return [base, "", ...NETLIFY_OPENAI_REMEDIATION.map((b) => `• ${b}`)].join("\n");
  }

  const extra =
    Array.isArray(j.remediation) && j.remediation.length > 0
      ? ["", ...j.remediation.map((b: string) => `• ${b}`)].join("\n")
      : "";

  if (params.status >= 500 && !extra) {
    return [base, "", ...NETLIFY_OPENAI_REMEDIATION.map((b) => `• ${b}`)].join("\n");
  }

  return base + extra;
}

export function formatGetUserMediaError(e: unknown): string {
  if (!(e instanceof Error)) return "Microphone access failed. Check browser permissions and try again.";
  const name = e.name;
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return [
      "Microphone permission was denied.",
      "",
      "• Allow microphone access for this site in your browser settings, then tap Start again.",
      "• On shared devices, use a profile that permits media access.",
    ].join("\n");
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return [
      "No microphone was found.",
      "",
      "• Plug in a headset or USB mic, or enable the built-in microphone in system settings.",
    ].join("\n");
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return [
      "The microphone is in use or could not be opened.",
      "",
      "• Close other apps using the mic (e.g. Zoom, dictation), then retry.",
    ].join("\n");
  }
  return [e.message || "Microphone error", "", "• Check browser and OS microphone settings."].join("\n");
}
