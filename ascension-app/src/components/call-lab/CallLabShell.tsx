"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { FEATURES } from "@/config/features";
import { aiCallerProfiles, type AICallerProfileId } from "@/data/aiCallerProfiles";
import {
  SCENARIO_PACK,
  formatStepForDisplay,
  getPackPassThreshold,
  getScenarioById,
  listTrainingScenarios,
  mapPackDifficultyToLab,
  mapPackPersonalityToProfileId,
} from "@/data/scenarioPack";
import { difficultyLevels, type DifficultyLevelKey } from "@/config/difficultyLevels";
import { useTrainingRole } from "@/hooks/useTrainingRole";
import { canAccessAdminCallLab } from "@/lib/callLabAccess";
import {
  cloneDefaultChecklist,
  detectViolations,
  mergeChecklistFromAgentText,
  scoreCall,
} from "@/services/complianceScoringEngine";
import { initiateTrainingCall } from "@/services/telnyxBridge";
import type { ChecklistItemState } from "@/types/compliance";
import { AILiveCallMode, type AILiveSessionPhase } from "./AILiveCallMode";
import { CallHeader, type HeaderPhase } from "./CallHeader";
import { CallerProfileCard } from "./CallerProfileCard";
import { ComplianceChecklist } from "./ComplianceChecklist";
import { ComplianceScoreCard } from "./ComplianceScoreCard";
import { ConnectureSimulationPanel } from "./ConnectureSimulationPanel";
import { ModeSelector, type CallLabUiMode } from "./ModeSelector";
import { ScenarioSelector } from "./ScenarioSelector";
import { SoftAlertBanner } from "./SoftAlertBanner";

function formatMmSs(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

const SCENARIOS = listTrainingScenarios();

export type CallLabShellProps = {
  scenarioId: string;
  onScenarioId: (id: string) => void;
  mode: CallLabUiMode;
  onMode: (m: CallLabUiMode) => void;
  callerId: AICallerProfileId;
  onCallerId: (id: AICallerProfileId) => void;
  difficultyKey: DifficultyLevelKey;
  onDifficultyKey: (k: DifficultyLevelKey) => void;
  onSessionScored: (payload: {
    score: number;
    avgResponseTimeSec: number;
    profileId: string;
    difficultyKey: string;
    scenarioId?: string;
  }) => void;
  onSaveCallAttempt: (args: {
    score: number;
    passLabel: string;
    violations: string[];
    missedSteps: string[];
    transcript: string;
  }) => void;
  certificationSlot: ReactNode;
  leaderboardSlot: ReactNode;
};

export function CallLabShell({
  scenarioId,
  onScenarioId,
  mode,
  onMode,
  callerId,
  onCallerId,
  difficultyKey,
  onDifficultyKey,
  onSessionScored,
  onSaveCallAttempt,
  certificationSlot,
  leaderboardSlot,
}: CallLabShellProps) {
  const { role, mounted } = useTrainingRole();
  const activeScenario = getScenarioById(scenarioId);
  const [checklist, setChecklist] = useState<ChecklistItemState[]>(() => cloneDefaultChecklist());
  const checklistRef = useRef(checklist);
  useEffect(() => {
    checklistRef.current = checklist;
  }, [checklist]);

  useEffect(() => {
    setChecklist(cloneDefaultChecklist());
  }, [scenarioId]);

  useEffect(() => {
    const s = getScenarioById(scenarioId);
    if (!s) return;
    if (s.personality) onCallerId(mapPackPersonalityToProfileId(s.personality));
    if (s.difficulty) onDifficultyKey(mapPackDifficultyToLab(s.difficulty));
  }, [scenarioId, onCallerId, onDifficultyKey]);

  const [trainingConsent, setTrainingConsent] = useState(false);
  const [transcriptHidden, setTranscriptHidden] = useState(false);
  const [livePhase, setLivePhase] = useState<AILiveSessionPhase>("idle");
  const [liveElapsed, setLiveElapsed] = useState(0);

  const onAgentUtterance = useCallback((text: string) => {
    setChecklist((c) => mergeChecklistFromAgentText(text, c));
  }, []);

  const previewScore = useMemo(() => scoreCall("", scenarioId, checklist), [checklist, scenarioId]);

  const violationHints = useMemo(
    () => detectViolations("", checklist).filter((v) => v.severity !== "low").slice(0, 2),
    [checklist]
  );

  useEffect(() => {
    if (mode !== "ai-live") {
      setLivePhase("idle");
      setLiveElapsed(0);
    }
  }, [mode]);

  const headerPhase: HeaderPhase = useMemo(() => {
    if (mode !== "ai-live") return "idle";
    if (livePhase === "paused") return "paused";
    if (livePhase === "complete") return "complete";
    if (livePhase === "connecting") return "connecting";
    if (livePhase === "live") return "live";
    return "idle";
  }, [livePhase, mode]);

  const aiLiveUnlocked = FEATURES.AI_LIVE_CALL || FEATURES.AI_CALL_MODE;
  const consentOk = !FEATURES.CALL_LAB_TRAINING_CONSENT || trainingConsent;
  const canStartAi = aiLiveUnlocked && consentOk;

  const diffOptions = (Object.keys(difficultyLevels) as DifficultyLevelKey[]).map((key) => ({
    key,
    label: difficultyLevels[key].label,
  }));

  return (
    <div className="space-y-8">
      {mounted && canAccessAdminCallLab(role) ? (
        <div className="flex justify-end">
          <Link
            href="/admin/call-lab"
            className="text-[10px] uppercase tracking-wider text-[var(--gold-accent)] hover:underline"
          >
            Admin · Call Lab ops
          </Link>
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-sm border border-[var(--border-gold)]/30 bg-black/30 p-5"
      >
        <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
          {SCENARIO_PACK.title} · v{SCENARIO_PACK.version}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          Mission-ready voice practice with command-center layout. Educational use only.
        </p>
        <p className="mt-3 text-xs text-[var(--text-muted)]/90">{SCENARIO_PACK.disclaimer.global}</p>
        <p className="mt-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Pack reference threshold: {getPackPassThreshold()} (institute certification rules are separate).
        </p>
      </motion.div>

      <CallHeader
        scenarioTitle={activeScenario?.title ?? scenarioId}
        elapsedLabel={mode === "ai-live" ? formatMmSs(liveElapsed) : "00:00"}
        modeLabel={mode === "ai-live" ? "AI Live" : mode === "roleplay" ? "Roleplay" : "Guided"}
        callerLabel={aiCallerProfiles.find((p) => p.id === callerId)?.name ?? callerId}
        difficultyLabel={difficultyLevels[difficultyKey].label}
        phase={headerPhase}
      />

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* LEFT */}
        <div className="space-y-4 lg:col-span-3">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Scenario
          </p>
          <ScenarioSelector scenarios={SCENARIOS} value={scenarioId} onChange={onScenarioId} />
          <ModeSelector mode={mode} onChange={onMode} />
          <div className="grid gap-2">
            <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Personality override
              <select
                value={callerId}
                onChange={(e) => onCallerId(e.target.value as AICallerProfileId)}
                className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-2 py-2 text-sm text-[var(--text-primary)]"
              >
                {aiCallerProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Difficulty override
              <select
                value={difficultyKey}
                onChange={(e) => onDifficultyKey(e.target.value as DifficultyLevelKey)}
                className="mt-1 w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-2 py-2 text-sm text-[var(--text-primary)]"
              >
                {diffOptions.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {mode === "guided" && activeScenario?.steps?.length ? (
            <div className="rounded-sm border border-[var(--border-gold)]/30 bg-black/35 p-3">
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Script guidance
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] leading-snug text-[var(--text-primary)]/88">
                {activeScenario.steps.map((st) => (
                  <li key={st.id}>{formatStepForDisplay(st)}</li>
                ))}
              </ol>
            </div>
          ) : null}

          <ComplianceChecklist items={checklist} />
        </div>

        {/* CENTER */}
        <div className="space-y-4 lg:col-span-5">
          {mode === "roleplay" ? (
            <div className="rounded-sm border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/45 p-4 text-sm text-[var(--text-primary)]/88">
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
                Roleplay orders
              </p>
              <p className="mt-2">
                {activeScenario?.description ??
                  "Partner plays beneficiary. You run disclosures, scope, and needs — no live AI in this mode."}
              </p>
            </div>
          ) : null}

          {mode === "ai-live" ? (
            <>
              {FEATURES.CALL_LAB_TRAINING_CONSENT ? (
                <div className="rounded-sm border border-[var(--border-gold)]/35 bg-black/30 p-3 text-xs text-[var(--text-muted)]">
                  <label className="flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={trainingConsent}
                      onChange={(e) => setTrainingConsent(e.target.checked)}
                      className="mt-0.5 accent-[var(--gold-accent)]"
                    />
                    <span>
                      I understand sessions may be logged (transcript, scores, compliance signals) for training and
                      audit workflows.
                    </span>
                  </label>
                </div>
              ) : null}

              {violationHints.length ? (
                <SoftAlertBanner level="warn">
                  {violationHints.map((v) => v.message).join(" · ")}
                </SoftAlertBanner>
              ) : null}

              {aiLiveUnlocked ? (
                <AILiveCallMode
                  profileId={callerId}
                  difficultyKey={difficultyKey}
                  scenarioId={scenarioId}
                  scenarioTitle={activeScenario?.title ?? scenarioId}
                  checklistRef={checklistRef}
                  onAgentUtterance={onAgentUtterance}
                  onActivity={({ phase, elapsedMs }) => {
                    setLivePhase(phase);
                    setLiveElapsed(elapsedMs);
                  }}
                  canStart={canStartAi}
                  transcriptHidden={transcriptHidden}
                  onToggleTranscript={() => setTranscriptHidden((v) => !v)}
                  onSessionScored={onSessionScored}
                  onSaveAttempt={onSaveCallAttempt}
                />
              ) : (
                <div className="rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/70 p-8 text-center">
                  <p className="font-display text-sm uppercase tracking-[0.15em] text-[var(--text-primary)]">
                    AI Live Call · premium
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-muted)]">
                    Enable <span className="font-mono text-[var(--gold-accent)]">AI_LIVE_CALL</span> or{" "}
                    <span className="font-mono text-[var(--gold-accent)]">AI_CALL_MODE</span> in feature flags. OpenAI
                    keys remain on Netlify only; session uses ephemeral realtime tokens.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-sm border border-[var(--border-gold)]/25 bg-black/35 p-6 text-center text-sm text-[var(--text-muted)]">
              Select <span className="text-[var(--gold-accent)]">AI Live Call</span> to open the secure voice
              circuit. Guided and roleplay modes use the left-column checklist and right-column workspace only.
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-4 lg:col-span-4">
          <ConnectureSimulationPanel checklist={checklist} />
          <CallerProfileCard profileId={callerId} />
          <ComplianceScoreCard score={previewScore} />
          {certificationSlot}
          <div className="rounded-sm border border-[var(--border-gold)]/25 bg-black/30 p-3">
            <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              PSTN bridge (Telnyx)
            </p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {FEATURES.TELNYX_TRAINING
                ? "Telnyx flag on — wire credentials to activate training DID routing."
                : "Disabled. Enable TELNYX_TRAINING only when legal and operational approvals are in place."}
            </p>
            <button
              type="button"
              disabled={!FEATURES.TELNYX_TRAINING}
              onClick={() => void initiateTrainingCall({ scenarioId, agentId: "local" })}
              className="mt-3 w-full rounded-sm border border-[var(--border-gold)]/35 px-3 py-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Placeholder training call
            </button>
          </div>
          {leaderboardSlot}
        </div>
      </div>
    </div>
  );
}
