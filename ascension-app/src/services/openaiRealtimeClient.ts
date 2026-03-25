import {
  formatCreateSessionFailure,
  formatRealtimeHandshakeFailure,
} from "@/lib/aiCallSupport";
import { createCallAudioManager } from "@/services/callAudioManager";

export type TranscriptRole = "user" | "assistant";

export type RealtimeHooks = {
  onTranscriptUpdate?: (role: TranscriptRole, text: string, isPartial: boolean) => void;
  onAgentResponse?: (text: string) => void;
  onComplianceHint?: (hint: string) => void;
};

export type RealtimeSessionHandle = {
  disconnect: () => void;
  sendSessionInstructions: (text: string) => void;
};

const SESSION_FN = "/.netlify/functions/createRealtimeSession";

/**
 * Opens mic if needed, negotiates WebRTC with OpenAI Realtime via ephemeral token from Netlify.
 */
export async function startRealtimeVoiceSession(args: {
  profileId: string;
  difficultyKey: string;
  scenarioId?: string;
  audio: ReturnType<typeof createCallAudioManager>;
  remoteAudioEl: HTMLAudioElement | null;
  hooks?: RealtimeHooks;
}): Promise<RealtimeSessionHandle> {
  const { profileId, difficultyKey, scenarioId, audio, remoteAudioEl, hooks } = args;

  let tokenRes: Response;
  try {
    tokenRes = await fetch(SESSION_FN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId,
        difficultyKey,
        ...(scenarioId ? { scenarioId } : {}),
      }),
    });
  } catch {
    throw new Error(formatCreateSessionFailure({ status: 0, json: {}, bodyText: "", fetchFailed: true }));
  }

  const rawBody = await tokenRes.text();
  let tokenJson: unknown = {};
  try {
    tokenJson = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    tokenJson = {};
  }

  if (!tokenRes.ok) {
    throw new Error(formatCreateSessionFailure({ status: tokenRes.status, json: tokenJson, bodyText: rawBody }));
  }

  const ephemeralKey = (tokenJson as { client_secret?: { value?: string } }).client_secret?.value;
  if (!ephemeralKey) {
    throw new Error(
      formatCreateSessionFailure({ status: 502, json: tokenJson, bodyText: rawBody })
    );
  }

  const stream = await audio.getMic();

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  const audioEl = remoteAudioEl;
  if (audioEl) {
    pc.ontrack = (e) => {
      audioEl.srcObject = e.streams[0];
      void audioEl.play().catch(() => {});
    };
  }

  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  const dc = pc.createDataChannel("oai-events");
  let assistantBuf = "";

  const flushAssistant = () => {
    const t = assistantBuf.trim();
    assistantBuf = "";
    if (t) {
      hooks?.onAgentResponse?.(t);
      hooks?.onTranscriptUpdate?.("assistant", t, false);
    }
  };

  dc.addEventListener("message", (e) => {
    if (typeof e.data !== "string") return;
    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }
    const type = typeof msg.type === "string" ? msg.type : "";

    if (type.includes("input_audio_transcription") && typeof msg.transcript === "string" && msg.transcript) {
      hooks?.onTranscriptUpdate?.("user", msg.transcript, false);
      return;
    }
    if (type.includes("input_audio_transcription") && typeof msg.delta === "string") {
      hooks?.onTranscriptUpdate?.("user", msg.delta, true);
      return;
    }
    if (type.includes("output_audio_transcript") && typeof msg.delta === "string") {
      assistantBuf += msg.delta;
      hooks?.onTranscriptUpdate?.("assistant", assistantBuf, true);
      return;
    }

    if (type === "response.done" || type.endsWith("response.done") || type.includes("output_audio_transcript.done")) {
      flushAssistant();
    }
  });

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  let sdpRes: Response;
  try {
    sdpRes = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      body: offer.sdp ?? "",
      headers: {
        Authorization: `Bearer ${ephemeralKey}`,
        "Content-Type": "application/sdp",
      },
    });
  } catch {
    pc.close();
    throw new Error(formatRealtimeHandshakeFailure(0, "Network error."));
  }

  if (!sdpRes.ok) {
    const errText = await sdpRes.text();
    pc.close();
    throw new Error(formatRealtimeHandshakeFailure(sdpRes.status, errText));
  }

  const answerSdp = await sdpRes.text();
  await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

  const disconnect = () => {
    try {
      dc.close();
    } catch {
      /* ignore */
    }
    try {
      pc.getSenders().forEach((s) => s.track?.stop());
      pc.close();
    } catch {
      /* ignore */
    }
    audio.stop();
    if (audioEl) audioEl.srcObject = null;
  };

  const sendSessionInstructions = (text: string) => {
    if (dc.readyState !== "open") return;
    try {
      dc.send(JSON.stringify({ type: "session.update", session: { instructions: text } }));
    } catch {
      hooks?.onComplianceHint?.("Could not push instruction update (channel busy).");
    }
  };

  return { disconnect, sendSessionInstructions };
}

export async function stopRealtimeVoiceSession(handle: RealtimeSessionHandle | null): Promise<void> {
  handle?.disconnect();
}

export function attachMicrophone(audio: ReturnType<typeof createCallAudioManager>): Promise<MediaStream> {
  return audio.getMic();
}

export function attachRemoteAudio(el: HTMLAudioElement | null, stream: MediaStream | null): void {
  if (!el) return;
  el.srcObject = stream;
  void el.play().catch(() => {});
}

export const openaiRealtimeClient = {
  startRealtimeVoiceSession,
  stopRealtimeVoiceSession,
  sendSessionInstructions: (h: RealtimeSessionHandle | null, text: string) => h?.sendSessionInstructions(text),
  attachMicrophone,
  attachRemoteAudio,
  onTranscriptUpdate: (_cb: RealtimeHooks["onTranscriptUpdate"]) => {
    /* use hooks bag on start */
  },
  onAgentResponse: (_cb: RealtimeHooks["onAgentResponse"]) => {},
  onComplianceHint: (_cb: RealtimeHooks["onComplianceHint"]) => {},
};
