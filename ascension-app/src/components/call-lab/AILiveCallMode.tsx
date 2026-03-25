"use client";

import type { MutableRefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FEATURES } from "@/config/features";
import { formatAnalyzeCallFailure } from "@/lib/aiCallSupport";
import type { ChecklistItemState } from "@/types/compliance";
import type { AICallerProfileId } from "@/data/aiCallerProfiles";
import type { DifficultyLevelKey } from "@/config/difficultyLevels";
import { createCallAudioManager } from "@/services/callAudioManager";
import { startRealtimeVoiceSession, type RealtimeSessionHandle } from "@/services/openaiRealtimeClient";
import type { TranscriptRow } from "./CallTranscriptPanel";
import { CallControls } from "./CallControls";
import { CallTranscriptPanel } from "./CallTranscriptPanel";
import { PostCallDebrief } from "./PostCallDebrief";
import { SoftAlertBanner } from "./SoftAlertBanner";

export type AILiveSessionPhase = "idle" | "connecting" | "live" | "paused" | "complete";
type Phase = AILiveSessionPhase;

export type AILiveCallModeProps = {
  profileId: AICallerProfileId;
  difficultyKey: DifficultyLevelKey;
  scenarioId: string;
  scenarioTitle: string;
  checklistRef: MutableRefObject<ChecklistItemState[]>;
  onAgentUtterance: (text: string) => void;
  onActivity?: (s: { phase: AILiveSessionPhase; elapsedMs: number }) => void;
  canStart: boolean;
  transcriptHidden: boolean;
  onToggleTranscript: () => void;
  onSessionScored?: (payload: {
    score: number;
    avgResponseTimeSec: number;
    profileId: string;
    difficultyKey: string;
    scenarioId?: string;
  }) => void;
  onSaveAttempt?: (payload: {
    score: number;
    passLabel: string;
    violations: string[];
    missedSteps: string[];
    transcript: string;
  }) => void;
};

export function AILiveCallMode({
  profileId,
  difficultyKey,
  scenarioId,
  scenarioTitle,
  checklistRef,
  onAgentUtterance,
  onActivity,
  canStart,
  transcriptHidden,
  onToggleTranscript,
  onSessionScored,
  onSaveAttempt,
}: AILiveCallModeProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioMgr = useRef(createCallAudioManager());
  const sessionRef = useRef<RealtimeSessionHandle | null>(null);
  const startedAt = useRef<number | null>(null);
  const partialUserRef = useRef("");
  const linesRef = useRef<TranscriptRow[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lines, setLines] = useState<TranscriptRow[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [connectErr, setConnectErr] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [debrief, setDebrief] = useState<{
    score: number;
    passLabel: string;
    violations: string[];
    missed: string[];
    coaching: string;
    suggestions: string[];
  } | null>(null);
  const [analysisErr, setAnalysisErr] = useState<string | null>(null);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  useEffect(() => {
    if (phase !== "live" && phase !== "paused") return;
    const id = window.setInterval(() => {
      if (startedAt.current == null) return;
      setElapsed(Date.now() - startedAt.current);
    }, 500);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    onActivity?.({ phase, elapsedMs: elapsed });
  }, [phase, elapsed, onActivity]);

  const pushLine = useCallback((row: TranscriptRow) => {
    linesRef.current = [...linesRef.current, row];
    setLines(linesRef.current);
  }, []);

  const teardown = useCallback(() => {
    sessionRef.current?.disconnect();
    sessionRef.current = null;
    audioMgr.current.stop();
    setMicMuted(false);
  }, []);

  const start = useCallback(async () => {
    setConnectErr(null);
    setDebrief(null);
    setAnalysisErr(null);
    linesRef.current = [];
    setLines([]);
    partialUserRef.current = "";
    setPhase("connecting");
    startedAt.current = null;
    setElapsed(0);
    try {
      const handle = await startRealtimeVoiceSession({
        profileId,
        difficultyKey,
        scenarioId,
        audio: audioMgr.current,
        remoteAudioEl: audioRef.current,
        hooks: {
          onTranscriptUpdate: (role, text, partial) => {
            const now = Date.now();
            if (role === "user") {
              if (partial) {
                partialUserRef.current += text;
                return;
              }
              const u = (partialUserRef.current + text).trim();
              partialUserRef.current = "";
              if (!u) return;
              pushLine({ role: "AGENT", text: u, at: now });
              onAgentUtterance(u);
              return;
            }
            if (partial) return;
            pushLine({ role: "BENEFICIARY", text, at: now });
          },
        },
      });
      sessionRef.current = handle;
      setPhase("live");
      startedAt.current = Date.now();
    } catch (e) {
      teardown();
      setPhase("idle");
      setConnectErr(e instanceof Error ? e.message : "Connection failed");
    }
  }, [difficultyKey, onAgentUtterance, profileId, pushLine, scenarioId, teardown]);

  const pauseOrResume = useCallback(() => {
    if (phase === "live") {
      audioMgr.current.mute(true);
      setPhase("paused");
      setMicMuted(true);
    } else if (phase === "paused") {
      audioMgr.current.mute(false);
      setPhase("live");
      setMicMuted(false);
    }
  }, [phase]);

  const end = useCallback(async () => {
    if (phase === "connecting") {
      teardown();
      setPhase("idle");
      return;
    }

    const snapshot = [...linesRef.current];
    const ck = checklistRef.current;

    teardown();
    setPhase("complete");

    const endedAt = Date.now();
    const transcriptText = snapshot
      .map((l) =>
        `${l.role === "AGENT" ? "Agent" : l.role === "BENEFICIARY" ? "Beneficiary" : "System"}: ${l.text}`
      )
      .join("\n");

    const agentTurns = snapshot.filter((l) => l.role === "AGENT").length;
    const durationSec = startedAt.current != null ? (endedAt - startedAt.current) / 1000 : 0;
    const avgResponseTimeSec =
      agentTurns > 0
        ? Math.round((durationSec / agentTurns) * 10) / 10
        : Math.round(durationSec * 10) / 10;

    if (!transcriptText.trim()) {
      setDebrief({
        score: 0,
        passLabel: "fail",
        violations: [],
        missed: ["No transcript captured"],
        coaching: "Confirm microphone permissions and realtime function deployment.",
        suggestions: [],
      });
      return;
    }

    setAnalyzing(true);
    setAnalysisErr(null);
    const endpoint = FEATURES.COMPLIANCE_REPORTS
      ? "/.netlify/functions/analyzeCallTranscript"
      : "/.netlify/functions/analyzeCall";
    let res: Response;
    let rawBody = "";
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptText,
          ...(FEATURES.COMPLIANCE_REPORTS
            ? {
                checklistState: ck,
                scenario: { id: scenarioId, title: scenarioTitle },
              }
            : {}),
        }),
      });
      rawBody = await res.text();
    } catch {
      setAnalysisErr(formatAnalyzeCallFailure({ status: 0, json: {}, bodyText: "", fetchFailed: true }));
      setAnalyzing(false);
      return;
    }

    let data: Record<string, unknown> = {};
    try {
      data = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
    } catch {
      data = {};
    }

    if (!res.ok) {
      setAnalysisErr(formatAnalyzeCallFailure({ status: res.status, json: data, bodyText: rawBody }));
      setAnalyzing(false);
      return;
    }

    const score = Number(data.complianceScore) || 0;
    const violations = Array.isArray(data.violations) ? (data.violations as string[]) : [];
    const missed = Array.isArray(data.missedSteps) ? (data.missedSteps as string[]) : [];
    const coaching = typeof data.coachingFeedback === "string" ? data.coachingFeedback : "";
    const suggestions = Array.isArray(data.suggestedResponses) ? (data.suggestedResponses as string[]) : [];

    let passLabel = "pass";
    if (score < 70) passLabel = "fail";
    else if (score < 85) passLabel = "conditional";

    setDebrief({ score, passLabel, violations, missed, coaching, suggestions });
    onSessionScored?.({
      score,
      avgResponseTimeSec,
      profileId,
      difficultyKey,
      scenarioId,
    });
    onSaveAttempt?.({
      score,
      passLabel,
      violations,
      missedSteps: missed,
      transcript: transcriptText,
    });
    setAnalyzing(false);
  }, [
    checklistRef,
    difficultyKey,
    onSaveAttempt,
    onSessionScored,
    phase,
    profileId,
    scenarioId,
    scenarioTitle,
    teardown,
  ]);

  const toggleMute = useCallback(() => {
    const next = !micMuted;
    setMicMuted(next);
    audioMgr.current.mute(next);
  }, [micMuted]);

  const retry = useCallback(() => {
    setDebrief(null);
    setAnalysisErr(null);
    setConnectErr(null);
    linesRef.current = [];
    setLines([]);
    setPhase("idle");
    startedAt.current = null;
    setElapsed(0);
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  return (
    <div className="space-y-3">
      <audio ref={audioRef} autoPlay playsInline className="hidden" />
      {connectErr ? <SoftAlertBanner level="violation">{connectErr}</SoftAlertBanner> : null}

      <div className="flex h-10 items-end justify-center gap-0.5 opacity-90">
        {phase === "live" || phase === "paused"
          ? Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-t bg-gradient-to-t from-emerald-900/40 to-emerald-400/60"
                style={{ height: `${6 + (i % 5) * 4}px` }}
              />
            ))
          : null}
      </div>

      <CallControls
        phase={phase}
        canStart={canStart}
        micMuted={micMuted}
        transcriptHidden={transcriptHidden}
        onStart={() => void start()}
        onPause={pauseOrResume}
        onEnd={() => void end()}
        onRetry={retry}
        onToggleMute={toggleMute}
        onToggleTranscript={onToggleTranscript}
      />

      <CallTranscriptPanel lines={lines} hidden={transcriptHidden} />

      {debrief || analyzing || analysisErr ? (
        <PostCallDebrief
          score={debrief?.score ?? 0}
          passLabel={debrief?.passLabel ?? "fail"}
          violations={debrief?.violations ?? []}
          missedSteps={debrief?.missed ?? []}
          coaching={debrief?.coaching ?? ""}
          suggestions={debrief?.suggestions ?? []}
          analyzing={analyzing}
          error={analysisErr}
          onRetry={retry}
        />
      ) : null}
    </div>
  );
}
