"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AICallDebrief } from "./AICallDebrief";
import {
  saveTranscript,
  saveComplianceResult,
  type TranscriptEntry,
  type ComplianceResultPayload,
} from "@/services/aiCallLogger";
import { FEATURES } from "@/config/features";
import type { DifficultyLevelKey } from "@/config/difficultyLevels";
import type { AICallerProfileId } from "@/data/aiCallerProfiles";
import { appendCarrierAuditEntry } from "@/services/carrierAuditLog";
import { logAuditEvent } from "@/services/auditLogger";
import { getOrCreateLocalUserId } from "@/services/callLabLeaderboard";
import {
  formatAnalyzeCallFailure,
  formatCreateSessionFailure,
  formatGetUserMediaError,
  formatRealtimeHandshakeFailure,
} from "@/lib/aiCallSupport";

type CallStatus = "idle" | "connecting" | "live" | "ended";

export type AICallModeProps = {
  profileId?: AICallerProfileId;
  difficultyKey?: DifficultyLevelKey;
  /** Canonical training scenario from `scenario-pack.json` (drives server prompt + audits). */
  scenarioId?: string;
  onSessionScored?: (payload: {
    score: number;
    avgResponseTimeSec: number;
    profileId: string;
    difficultyKey: string;
    scenarioId?: string;
  }) => void;
};

const VIOLATION_PATTERN =
  /\b(guarantee|guaranteed|always\s+covered|free\s+(?:plan|coverage|premium)|no\s+risk|secret|off(?:\s+the)?\s+record)\b/i;

const WARN_PATTERN = /\b(limited\s+time|act\s+now|today\s+only|urgent|must\s+decide)\b/i;

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function AICallMode({
  profileId = "cooperative_senior",
  difficultyKey = "MEDIUM",
  scenarioId,
  onSessionScored,
}: AICallModeProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [livePartial, setLivePartial] = useState<{ role: "user" | "assistant"; text: string } | null>(
    null
  );
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [alertLevel, setAlertLevel] = useState<"none" | "warn" | "violation">("none");
  const [waveBars, setWaveBars] = useState<number[]>(() => new Array(24).fill(0));

  const [sessionId] = useState(
    () => `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  );

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const assistantBufRef = useRef("");
  const rafRef = useRef(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const violationsDetectedRef = useRef<string[]>([]);
  const callStatusRef = useRef<CallStatus>("idle");
  const connectGenRef = useRef(0);
  const transcriptAuditKeysRef = useRef<Set<string>>(new Set());
  const consentTimestampRef = useRef<number | null>(null);

  const [debrief, setDebrief] = useState<ComplianceResultPayload | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [trainingConsent, setTrainingConsent] = useState(false);

  const consentRequired = FEATURES.CALL_LAB_TRAINING_CONSENT;
  const canStartCall = !consentRequired || trainingConsent;

  useEffect(() => {
    if (callStartTime == null || callStatus !== "live") return;
    const id = window.setInterval(() => setElapsed(Date.now() - callStartTime), 500);
    return () => window.clearInterval(id);
  }, [callStartTime, callStatus]);

  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  const appendTranscript = useCallback((role: "user" | "assistant", text: string) => {
    const line: TranscriptEntry = { role, text: text.trim(), at: Date.now() };
    if (!line.text) return;
    setTranscript((prev) => {
      const next = [...prev, line];
      transcriptRef.current = next;
      return next;
    });
    if (role === "user") {
      if (VIOLATION_PATTERN.test(text)) {
        setAlertLevel("violation");
        violationsDetectedRef.current.push(`Diction risk: ${line.text.slice(0, 120)}`);
        const auditKey = `vio:${line.text.slice(0, 96)}`;
        if (!transcriptAuditKeysRef.current.has(auditKey)) {
          transcriptAuditKeysRef.current.add(auditKey);
          const uid = getOrCreateLocalUserId();
          const excerpt = line.text.slice(0, 220);
          if (FEATURES.PLATFORM_AUDIT_CONSOLE) {
            logAuditEvent({
              userId: uid,
              userName: "Trainee",
              eventType: "compliance.soft_flag_transcript",
              category: "call-simulation",
              severity: "warning",
              description: `AI call coaching flagged high-risk diction in agent turn: "${excerpt}"`,
              relatedRule: "CMS marketing / guarantees / misleading statements",
              sessionId,
            });
          }
          if (FEATURES.CARRIER_AUDIT_LOG) {
            appendCarrierAuditEntry({
              eventType: "lab_compliance_signal",
              severity: "warning",
              agentRef: uid,
              summary: `Transcript flag: possible guarantee or misleading phrasing.`,
              metadata: {
                signal: "diction_risk",
                sessionId,
                excerpt,
              },
            });
          }
        }
      } else if (WARN_PATTERN.test(text)) {
        setAlertLevel((a) => (a === "violation" ? a : "warn"));
        violationsDetectedRef.current.push(`Pressure-language hint: ${line.text.slice(0, 120)}`);
        const auditKey = `warn:${line.text.slice(0, 96)}`;
        if (!transcriptAuditKeysRef.current.has(auditKey)) {
          transcriptAuditKeysRef.current.add(auditKey);
          const uid = getOrCreateLocalUserId();
          const excerpt = line.text.slice(0, 220);
          if (FEATURES.PLATFORM_AUDIT_CONSOLE) {
            logAuditEvent({
              userId: uid,
              userName: "Trainee",
              eventType: "coaching.pressure_language_transcript",
              category: "call-simulation",
              severity: "info",
              description: `Pressure or urgency language detected in agent turn: "${excerpt}"`,
              relatedRule: "CMS anti-coercion / fair communication",
              sessionId,
            });
          }
          if (FEATURES.CARRIER_AUDIT_LOG) {
            appendCarrierAuditEntry({
              eventType: "lab_compliance_signal",
              severity: "notice",
              agentRef: uid,
              summary: `Transcript flag: urgency / pressure language.`,
              metadata: {
                signal: "pressure_language",
                sessionId,
                excerpt,
              },
            });
          }
        }
      }
    }
  }, [sessionId]);

  const flushAssistantBuffer = useCallback(() => {
    const t = assistantBufRef.current.trim();
    assistantBufRef.current = "";
    if (t) appendTranscript("assistant", t);
    setLivePartial(null);
  }, [appendTranscript]);

  const handleDcMessage = useCallback(
    (raw: string) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(raw);
      } catch {
        return;
      }
      const type = typeof msg.type === "string" ? msg.type : "";

      if (type === "input_audio_buffer.speech_started") setIsListening(true);
      if (type === "input_audio_buffer.speech_stopped") setIsListening(false);

      if (type.includes("input_audio_transcription") && typeof msg.transcript === "string" && msg.transcript) {
        appendTranscript("user", msg.transcript);
        setLivePartial(null);
        return;
      }
      if (type.includes("input_audio_transcription") && typeof msg.delta === "string") {
        setLivePartial((p) => ({
          role: "user",
          text: (p?.role === "user" ? p.text : "") + msg.delta,
        }));
        return;
      }

      if (type.includes("output_audio_transcript") && typeof msg.delta === "string") {
        assistantBufRef.current += msg.delta;
        setLivePartial({ role: "assistant", text: assistantBufRef.current });
        return;
      }

      if (
        type === "response.done" ||
        type.endsWith("response.done") ||
        type.includes("output_audio_transcript.done")
      ) {
        flushAssistantBuffer();
      }
    },
    [appendTranscript, flushAssistantBuffer]
  );

  const teardown = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    try {
      dcRef.current?.close();
    } catch {
      /* ignore */
    }
    dcRef.current = null;
    try {
      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      pcRef.current?.close();
    } catch {
      /* ignore */
    }
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    try {
      void audioCtxRef.current?.close();
    } catch {
      /* ignore */
    }
    audioCtxRef.current = null;
    analyserRef.current = null;
    setIsConnected(false);
    setIsListening(false);
  }, []);

  const startCall = useCallback(async () => {
    if (consentRequired && !trainingConsent) return;

    const gen = ++connectGenRef.current;
    setCallStatus("connecting");
    setDebrief(null);
    setAnalysisError(null);
    setConnectError(null);
    consentTimestampRef.current = consentRequired && trainingConsent ? Date.now() : null;
    transcriptRef.current = [];
    violationsDetectedRef.current = [];
    transcriptAuditKeysRef.current = new Set();
    setTranscript([]);
    setLivePartial(null);
    setAlertLevel("none");
    setElapsed(0);
    assistantBufRef.current = "";

    try {
      let tokenRes: Response;
      try {
        tokenRes = await fetch("/.netlify/functions/createAICallSession", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId,
            difficultyKey,
            ...(scenarioId ? { scenarioId } : {}),
          }),
        });
      } catch {
        if (connectGenRef.current !== gen) return;
        setConnectError(formatCreateSessionFailure({ status: 0, json: {}, bodyText: "", fetchFailed: true }));
        setCallStatus("idle");
        teardown();
        return;
      }

      if (connectGenRef.current !== gen) return;
      const rawTokenBody = await tokenRes.text();
      let tokenJson: unknown = {};
      try {
        tokenJson = rawTokenBody ? JSON.parse(rawTokenBody) : {};
      } catch {
        tokenJson = {};
      }
      if (!tokenRes.ok) {
        setConnectError(
          formatCreateSessionFailure({
            status: tokenRes.status,
            json: tokenJson,
            bodyText: rawTokenBody,
          })
        );
        setCallStatus("idle");
        teardown();
        return;
      }
      const ephemeralKey = (tokenJson as { client_secret?: { value?: string } }).client_secret?.value;
      if (!ephemeralKey) {
        setConnectError(
          formatCreateSessionFailure({
            status: 502,
            json: tokenJson,
            bodyText: rawTokenBody,
          })
        );
        setCallStatus("idle");
        teardown();
        return;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
      } catch (micErr) {
        if (connectGenRef.current !== gen) return;
        setConnectError(formatGetUserMediaError(micErr));
        setCallStatus("idle");
        teardown();
        return;
      }
      if (connectGenRef.current !== gen) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      localStreamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      await audioCtx.resume().catch(() => {});
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.65;
      source.connect(analyser);
      analyserRef.current = analyser;

      const tick = () => {
        if (!analyserRef.current) return;
        const bins = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(bins);
        const step = Math.max(1, Math.floor(bins.length / 24));
        const bars: number[] = [];
        for (let i = 0; i < 24; i++) {
          let v = 0;
          for (let j = 0; j < step; j++) v += bins[i * step + j] ?? 0;
          bars.push(v / step / 255);
        }
        setWaveBars(bars);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      const audioEl = audioRef.current;
      if (audioEl) {
        pc.ontrack = (e) => {
          audioEl.srcObject = e.streams[0];
          void audioEl.play().catch(() => {});
        };
      }

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.addEventListener("message", (e) => {
        if (typeof e.data === "string") handleDcMessage(e.data);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      if (connectGenRef.current !== gen) {
        teardown();
        return;
      }

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
        if (connectGenRef.current !== gen) return;
        setConnectError(
          formatRealtimeHandshakeFailure(0, "Network error reaching OpenAI realtime endpoint.")
        );
        teardown();
        setCallStatus("idle");
        return;
      }

      if (!sdpRes.ok) {
        const errText = await sdpRes.text();
        if (connectGenRef.current !== gen) return;
        setConnectError(formatRealtimeHandshakeFailure(sdpRes.status, errText));
        teardown();
        setCallStatus("idle");
        return;
      }

      const answerSdp = await sdpRes.text();
      if (connectGenRef.current !== gen) {
        teardown();
        return;
      }
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setCallStatus("live");
      setIsConnected(true);
      setCallStartTime(Date.now());
      setConnectError(null);

      const uid = getOrCreateLocalUserId();
      if (FEATURES.PLATFORM_AUDIT_CONSOLE) {
        logAuditEvent({
          userId: uid,
          userName: "Trainee",
          eventType: "simulation.started",
          category: "call-simulation",
          severity: "info",
          description: `AI realtime session live (${profileId} / ${difficultyKey}).`,
          relatedRule: "Training session disclosure",
          sessionId,
        });
      }
      if (FEATURES.CARRIER_AUDIT_LOG) {
        appendCarrierAuditEntry({
          eventType: "lab_session_started",
          agentRef: uid,
          summary: `AI call lab session started (${profileId}, ${difficultyKey}).`,
          metadata: {
            profileId,
            difficultyKey,
            sessionId,
            consent: consentRequired ? "acknowledged" : "not_required",
            ...(scenarioId ? { scenarioId } : {}),
          },
        });
      }
    } catch (e) {
      if (connectGenRef.current !== gen) return;
      teardown();
      setCallStatus("idle");
      setConnectError(e instanceof Error ? e.message : "Connection failed");
    }
  }, [
    consentRequired,
    trainingConsent,
    handleDcMessage,
    teardown,
    profileId,
    difficultyKey,
    scenarioId,
    sessionId,
  ]);

  const endCall = useCallback(async () => {
    if (callStatusRef.current === "connecting") {
      connectGenRef.current += 1;
      teardown();
      setCallStatus("idle");
      setAnalysisError(null);
      setConnectError(null);
      return;
    }

    flushAssistantBuffer();

    const entries: TranscriptEntry[] = [...transcriptRef.current];
    setTranscript(entries);

    setCallStatus("ended");
    setIsConnected(false);
    teardown();

    const endedAt = Date.now();
    saveTranscript({
      sessionId,
      entries,
      startedAt: callStartTime,
      endedAt,
      violationsDetected: [...violationsDetectedRef.current],
      trainingConsentAt:
        consentTimestampRef.current != null
          ? new Date(consentTimestampRef.current).toISOString()
          : null,
    });

    const transcriptText = entries
      .map((line) => `${line.role === "user" ? "Agent" : "Beneficiary"}: ${line.text}`)
      .join("\n");

    const agentTurns = entries.filter((e) => e.role === "user").length;
    const durationSec = callStartTime != null ? (endedAt - callStartTime) / 1000 : 0;
    const avgResponseTimeSec =
      agentTurns > 0
        ? Math.round((durationSec / agentTurns) * 10) / 10
        : Math.round(durationSec * 10) / 10;

    const uidEnd = getOrCreateLocalUserId();

    if (entries.length > 0 && FEATURES.PLATFORM_AUDIT_CONSOLE) {
      logAuditEvent({
        userId: uidEnd,
        userName: "Trainee",
        eventType: "simulation.transcript_archived",
        category: "call-simulation",
        severity: "info",
        description: `Session closed · ${entries.length} transcript lines · ${agentTurns} agent turns · ${violationsDetectedRef.current.length} soft-flag note(s).`,
        sessionId,
      });
    }
    if (entries.length > 0 && FEATURES.CARRIER_AUDIT_LOG) {
      appendCarrierAuditEntry({
        eventType: "lab_transcript_summary",
        agentRef: uidEnd,
        summary: `Transcript archived: ${entries.length} lines, ${agentTurns} agent turns.`,
        metadata: {
          sessionId,
          lines: entries.length,
          agentTurns,
          softFlagCount: violationsDetectedRef.current.length,
          profileId,
          difficultyKey,
          ...(scenarioId ? { scenarioId } : {}),
        },
      });
    }

    if (!transcriptText.trim()) {
      setDebrief({
        complianceScore: 0,
        violations: [],
        missedSteps: [
          "No transcript captured — allow microphone access, confirm Netlify env OPENAI_API_KEY, and use HTTPS.",
          "Session service: /.netlify/functions/createAICallSession · Post-call audit: /.netlify/functions/analyzeCall",
        ],
        suggestedResponses: [],
        coachingFeedback:
          "The session ended without transcript lines. If the call sounded live but this log is empty, check realtime transcription in the OpenAI session and browser console for errors.",
      });
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);
    try {
      let res: Response;
      let rawBody = "";
      try {
        res = await fetch("/.netlify/functions/analyzeCall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: transcriptText }),
        });
        rawBody = await res.text();
      } catch {
        setAnalysisError(formatAnalyzeCallFailure({ status: 0, json: {}, bodyText: "", fetchFailed: true }));
        setDebrief({
          complianceScore: 0,
          violations: [],
          missedSteps: [],
          suggestedResponses: [],
          coachingFeedback: "",
        });
        return;
      }

      let data: Record<string, unknown> = {};
      try {
        data = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        setAnalysisError(formatAnalyzeCallFailure({ status: res.status, json: data, bodyText: rawBody }));
        setDebrief({
          complianceScore: 0,
          violations: [],
          missedSteps: [],
          suggestedResponses: [],
          coachingFeedback: "",
        });
        return;
      }

      const score = Number(data.complianceScore ?? data.score) || 0;
      const coachingFb = typeof data.coachingFeedback === "string" ? data.coachingFeedback : "";
      const coachingArr =
        Array.isArray(data.coaching) ? (data.coaching as unknown[]).filter((x): x is string => typeof x === "string") : [];
      const coachingFeedback = coachingFb || coachingArr.join("\n\n");

      let checklist: Record<string, string> | null = null;
      if (data.checklist != null && typeof data.checklist === "object" && !Array.isArray(data.checklist)) {
        const entries: Record<string, string> = {};
        for (const [k, v] of Object.entries(data.checklist as Record<string, unknown>)) {
          if (typeof v === "string") entries[k] = v;
        }
        checklist = Object.keys(entries).length ? entries : null;
      }

      const apiPass = typeof data.passLabel === "string" ? data.passLabel.trim() : "";
      let passLabel: "pass" | "conditional" | "fail" = "fail";
      if (apiPass === "pass" || apiPass === "conditional" || apiPass === "fail") {
        passLabel = apiPass;
      } else {
        if (score >= 85) passLabel = "pass";
        else if (score >= 70) passLabel = "conditional";
        else passLabel = "fail";
      }

      const payload: ComplianceResultPayload = {
        complianceScore: score,
        passLabel,
        summary: typeof data.summary === "string" ? data.summary : "",
        checklist,
        violations: Array.isArray(data.violations) ? (data.violations as string[]) : [],
        missedSteps: Array.isArray(data.missedSteps) ? (data.missedSteps as string[]) : [],
        suggestedResponses: Array.isArray(data.suggestedResponses)
          ? (data.suggestedResponses as string[])
          : [],
        coachingFeedback,
      };
      saveComplianceResult(sessionId, payload);
      setDebrief(payload);
      onSessionScored?.({
        score: payload.complianceScore,
        avgResponseTimeSec,
        profileId,
        difficultyKey,
        scenarioId,
      });
    } finally {
      setAnalyzing(false);
    }
  }, [callStartTime, difficultyKey, flushAssistantBuffer, onSessionScored, profileId, scenarioId, sessionId, teardown]);

  const retryScenario = useCallback(() => {
    setDebrief(null);
    setAnalysisError(null);
    setConnectError(null);
    setCallStatus("idle");
    setCallStartTime(null);
    setElapsed(0);
    assistantBufRef.current = "";
    transcriptRef.current = [];
    violationsDetectedRef.current = [];
    transcriptAuditKeysRef.current = new Set();
    consentTimestampRef.current = null;
    setTrainingConsent(false);
    setTranscript([]);
    setLivePartial(null);
    setAlertLevel("none");
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  const pulseClass =
    alertLevel === "violation"
      ? "shadow-[0_0_24px_rgba(180,60,60,0.35)]"
      : alertLevel === "warn"
        ? "shadow-[0_0_20px_rgba(180,140,60,0.28)]"
        : isConnected
          ? "shadow-[0_0_22px_rgba(60,140,90,0.3)]"
          : "";

  const statusLabel =
    callStatus === "connecting" ? "Connecting" : callStatus === "live" ? "Live" : callStatus === "ended" ? "Ended" : "Standby";

  return (
    <div className="space-y-4">
      <audio ref={audioRef} autoPlay playsInline className="hidden" />

      {consentRequired ? (
        <div className="rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/55 p-4">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
            Training &amp; audit notice
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]/88">
            This simulation may capture microphone audio for the AI beneficiary, generate a written transcript, and
            store scores, coaching notes, and compliance flags for training-quality and audit purposes. Continue only
            if you are authorized to use this lab in your role and you are not recording a real beneficiary without
            required disclosures.
          </p>
          <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-[var(--text-muted)]">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--border-gold)]/50 bg-black/40 accent-[var(--gold-accent)]"
              checked={trainingConsent}
              onChange={(e) => setTrainingConsent(e.target.checked)}
            />
            <span>
              I understand this session can be logged (transcript, scores, and compliance signals) for institute and
              carrier oversight workflows.
            </span>
          </label>
        </div>
      ) : null}

      {connectError ? (
        <div
          role="alert"
          className="rounded-sm border border-red-500/35 bg-red-950/20 p-4 text-[var(--text-primary)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="font-display text-[10px] uppercase tracking-[0.2em] text-red-300/95">Line setup failed</p>
            <button
              type="button"
              onClick={() => setConnectError(null)}
              className="rounded-sm border border-red-500/40 px-2 py-1 text-[10px] uppercase tracking-wider text-red-200/90 hover:bg-red-950/40"
            >
              Dismiss
            </button>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-red-100/88">{connectError}</p>
        </div>
      ) : null}

      <div
        className={`rounded-sm border border-[var(--border-gold)]/40 bg-[var(--bg-matte-elevated)]/80 p-4 transition-[box-shadow] duration-500 ${pulseClass}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`relative flex h-3 w-3 rounded-full ${
                callStatus === "live"
                  ? "bg-emerald-600/90"
                  : callStatus === "connecting"
                    ? "bg-amber-500/90 animate-pulse"
                    : "bg-[var(--text-muted)]/40"
              }`}
            >
              {callStatus === "live" ? (
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/40" />
              ) : null}
            </span>
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Line status
              </p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{statusLabel}</p>
            </div>
          </div>

          <div className="font-mono text-2xl tabular-nums tracking-tight text-[var(--gold-accent)]">
            {callStartTime != null && (callStatus === "live" || callStatus === "ended")
              ? formatElapsed(elapsed)
              : "00:00"}
          </div>
        </div>

        <div className="mt-4 flex h-14 items-end justify-center gap-0.5 px-2">
          {waveBars.map((v, i) => (
            <div
              key={i}
              className="w-1.5 rounded-t bg-gradient-to-t from-emerald-900/50 to-emerald-500/70 transition-[height] duration-75"
              style={{ height: `${8 + v * 44}px`, opacity: 0.35 + v * 0.65 }}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
          <span
            className={`rounded border px-2 py-1 ${
              isConnected ? "border-emerald-700/50 text-emerald-500/90" : "border-[var(--border-gold)]/25 text-[var(--text-muted)]"
            }`}
          >
            {isConnected ? "Channel open" : "Channel closed"}
          </span>
          <span
            className={`rounded border px-2 py-1 ${
              isListening
                ? "border-emerald-600/40 text-emerald-400/90"
                : "border-[var(--border-gold)]/25 text-[var(--text-muted)]"
            }`}
          >
            {isListening ? "TX: agent audio" : "TX: silent"}
          </span>
          {alertLevel !== "none" ? (
            <span
              className={`rounded border px-2 py-1 ${
                alertLevel === "violation"
                  ? "border-red-700/50 text-red-400/90"
                  : "border-amber-700/45 text-amber-400/85"
              }`}
            >
              Soft alert: {alertLevel === "violation" ? "compliance tone" : "pressure language"}
            </span>
          ) : null}
        </div>

        <div className="mt-4 space-y-2">
          {consentRequired && !canStartCall && callStatus === "idle" ? (
            <p className="text-[10px] uppercase tracking-wider text-amber-500/85">
              Acknowledge training &amp; audit logging above to start.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
          {callStatus !== "live" && callStatus !== "connecting" ? (
            <button
              type="button"
              onClick={() => void startCall()}
              disabled={!canStartCall}
              className={`rounded-sm border border-[var(--border-gold)] bg-[var(--gold-accent)]/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-[var(--gold-accent)] transition-colors hover:bg-[var(--gold-accent)]/15 ${
                !canStartCall ? "cursor-not-allowed opacity-45 hover:bg-[var(--gold-accent)]/10" : ""
              }`}
            >
              Start AI call
            </button>
          ) : null}
          {callStatus === "live" || callStatus === "connecting" ? (
            <button
              type="button"
              onClick={() => void endCall()}
              className="rounded-sm border border-red-900/50 bg-red-950/20 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-red-300/90 transition-colors hover:bg-red-950/35"
            >
              End call
            </button>
          ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-4">
        <p className="mb-2 font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Transcript log
        </p>
        <div className="max-h-48 overflow-y-auto font-mono text-xs leading-relaxed text-[var(--text-primary)]/85">
          {transcript.length === 0 && !livePartial ? (
            <span className="text-[var(--text-muted)]">No lines yet.</span>
          ) : (
            <ul className="space-y-2">
              {transcript.map((line, i) => (
                <li key={`${line.at}-${i}`}>
                  <span className={line.role === "user" ? "text-[var(--gold-accent)]/90" : "text-emerald-500/85"}>
                    {line.role === "user" ? "Agent" : "Beneficiary"}:
                  </span>{" "}
                  {line.text}
                </li>
              ))}
              {livePartial ? (
                <li className="text-[var(--text-muted)]">
                  <span className={livePartial.role === "user" ? "text-[var(--gold-accent)]/70" : "text-emerald-500/60"}>
                    {livePartial.role === "user" ? "Agent" : "Beneficiary"}…
                  </span>{" "}
                  {livePartial.text}
                </li>
              ) : null}
            </ul>
          )}
        </div>
      </div>

      {analyzing || debrief ? (
        <AICallDebrief
          score={debrief?.complianceScore ?? 0}
          passLabel={debrief?.passLabel ?? "fail"}
          summary={debrief?.summary ?? ""}
          checklist={debrief?.checklist ?? null}
          violations={debrief?.violations ?? []}
          missedSteps={debrief?.missedSteps ?? []}
          coachingFeedback={debrief?.coachingFeedback ?? ""}
          suggestedResponses={debrief?.suggestedResponses ?? []}
          onRetry={retryScenario}
          analyzing={analyzing}
          analysisError={analysisError}
        />
      ) : null}
    </div>
  );
}
