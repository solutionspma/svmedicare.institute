"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FEATURES } from "@/config/features";
import { AICallMode } from "@/components/call-simulator/AICallMode";
import { Leaderboard } from "@/components/call-simulator/Leaderboard";
import { CertificationBadge } from "@/components/call-simulator/CertificationBadge";
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
import { checkCertification, type ScoreRecord } from "@/services/certificationEngine";
import {
  appendCertScore,
  loadCertScoreHistory,
} from "@/services/callLabCertHistory";
import {
  getOrCreateLocalUserId,
  recordLeaderboardSession,
} from "@/services/callLabLeaderboard";
import { recordAgencyTrainingSession } from "@/services/agencyMetricsStore";
import { appendCarrierAuditEntry } from "@/services/carrierAuditLog";
import {
  getActiveCertificateForUser,
  issueCertificate,
} from "@/services/certificateEngine";
import { logAuditEvent } from "@/services/auditLogger";
import { saveCallAttempt } from "@/services/callAttemptStore";
import { CallLabShell } from "@/components/call-lab/CallLabShell";
import type { CertificationRecord } from "@/types/certification";
import type { ComplianceScore } from "@/types/compliance";

type LabMode = "guided" | "roleplay" | "ai-live";

const DIFFICULTY_OPTIONS = (Object.keys(difficultyLevels) as DifficultyLevelKey[]).map((key) => ({
  key,
  label: difficultyLevels[key].label,
}));

const TRAINING_SCENARIOS = listTrainingScenarios();

export default function CallLabPage() {
  const [mode, setMode] = useState<LabMode>("guided");
  const [scenarioId, setScenarioId] = useState<string>(() => TRAINING_SCENARIOS[0]?.id ?? "inbound_call_standard");
  const [callerId, setCallerId] = useState<AICallerProfileId>(aiCallerProfiles[0].id);
  const [difficultyKey, setDifficultyKey] = useState<DifficultyLevelKey>("MEDIUM");
  const [lbRevision, setLbRevision] = useState(0);
  const [userId, setUserId] = useState("");
  const [scoreHistory, setScoreHistory] = useState<ScoreRecord[]>([]);
  const [platformCert, setPlatformCert] = useState<CertificationRecord | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- mount-only localStorage hydrate matches empty SSR snapshot */
  useEffect(() => {
    setUserId(getOrCreateLocalUserId());
    setScoreHistory(loadCertScoreHistory());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const certified = useMemo(() => checkCertification(scoreHistory), [scoreHistory]);
  const qualifyingCount = useMemo(
    () => scoreHistory.filter((s) => s.score >= 90).length,
    [scoreHistory]
  );

  useEffect(() => {
    if (!userId) return;
    setPlatformCert(getActiveCertificateForUser(getOrCreateLocalUserId()));
  }, [userId, certified, scoreHistory.length]);

  useEffect(() => {
    const s = getScenarioById(scenarioId);
    if (!s) return;
    if (s.personality) setCallerId(mapPackPersonalityToProfileId(s.personality));
    if (s.difficulty) setDifficultyKey(mapPackDifficultyToLab(s.difficulty));
  }, [scenarioId]);

  const activeScenario = getScenarioById(scenarioId);

  const handleSessionScored = useCallback(
    (payload: {
      score: number;
      avgResponseTimeSec: number;
      profileId: string;
      difficultyKey: string;
      scenarioId?: string;
    }) => {
      const uid = getOrCreateLocalUserId();
      if (FEATURES.LEADERBOARD) {
        recordLeaderboardSession(uid, "Trainee", payload.score, payload.avgResponseTimeSec);
        setLbRevision((n) => n + 1);
      }
      if (FEATURES.CERTIFICATION) {
        const next = appendCertScore(payload.score);
        setScoreHistory(next);
      }
      if (FEATURES.AGENCY_DASHBOARD) {
        recordAgencyTrainingSession({
          agentUserId: uid,
          agentDisplayName: "Trainee",
          score: payload.score,
          avgResponseTimeSec: payload.avgResponseTimeSec,
          profileId: payload.profileId,
          difficultyKey: payload.difficultyKey,
        });
      }
      if (FEATURES.CARRIER_AUDIT_LOG) {
        appendCarrierAuditEntry({
          eventType: "lab_session_completed",
          severity: payload.score < 80 ? "warning" : "info",
          agentRef: uid,
          summary: `AI lab session scored ${payload.score} (${payload.profileId} / ${payload.difficultyKey})${payload.scenarioId ? ` · ${payload.scenarioId}` : ""}`,
          metadata: {
            score: payload.score,
            avgResponseTimeSec: payload.avgResponseTimeSec,
            profileId: payload.profileId,
            difficultyKey: payload.difficultyKey,
            scenarioPackId: SCENARIO_PACK.id,
            scenarioPackVersion: SCENARIO_PACK.version,
            ...(payload.scenarioId ? { scenarioId: payload.scenarioId } : {}),
          },
        });
      }
      if (FEATURES.PLATFORM_AUDIT_CONSOLE) {
        logAuditEvent({
          userId: uid,
          userName: "Trainee",
          eventType: "simulation.completed",
          category: "call-simulation",
          severity: payload.score < 80 ? "warning" : "info",
          description: `AI call coaching completed · compliance score ${payload.score}${payload.scenarioId ? ` · scenario ${payload.scenarioId}` : ""}.`,
          relatedRule: "CMS disclosure / scope checkpoints",
          scoreImpact: payload.score - 90,
          sessionId: `${payload.profileId}-${payload.difficultyKey}-${Date.now()}`,
        });
      }
    },
    []
  );

  const persistCallAttempt = useCallback(
    (args: {
      score: number;
      passLabel: string;
      violations: string[];
      missedSteps: string[];
      transcript: string;
    }) => {
      if (!FEATURES.COMPLIANCE_REPORTS) return;
      const uid = getOrCreateLocalUserId();
      const title = getScenarioById(scenarioId)?.title ?? scenarioId;
      saveCallAttempt({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        agentUserId: uid,
        agentDisplayName: "Trainee",
        scenarioId,
        scenarioTitle: title,
        mode: "ai-live",
        profileId: callerId,
        difficultyKey,
        score: args.score,
        passLabel: args.passLabel as ComplianceScore["passLabel"],
        violations: args.violations,
        missedSteps: args.missedSteps,
        startedAt: null,
        endedAt: new Date().toISOString(),
        transcriptPreview: args.transcript.slice(0, 220),
      });
    },
    [scenarioId, callerId, difficultyKey]
  );

  useEffect(() => {
    if (!certified || !FEATURES.CERTIFICATION || !FEATURES.PLATFORM_CERTIFICATES) return;
    const uid = getOrCreateLocalUserId();
    if (getActiveCertificateForUser(uid)) return;
    const scores = loadCertScoreHistory();
    const avg =
      scores.length > 0
        ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length)
        : 90;
    const rec = issueCertificate(
      { userId: uid, fullName: "Trainee" },
      avg,
      { id: "mcs-v1", title: "Certified Medicare Call Specialist", validityMonths: 12 }
    );
    setPlatformCert(rec);
    if (FEATURES.PLATFORM_AUDIT_CONSOLE) {
      logAuditEvent({
        userId: uid,
        userName: "Trainee",
        eventType: "certification.earned",
        category: "certification",
        severity: "info",
        description:
          "Certification issued after three qualifying simulations with scores at or above 90 compliance.",
        relatedRule: "Institute certification threshold",
      });
    }
  }, [certified]);

  useEffect(() => {
    if (!certified || !FEATURES.CARRIER_AUDIT_LOG) return;
    const flagKey = "svmi-audit-cert-logged-v1";
    try {
      if (typeof window !== "undefined" && window.localStorage.getItem(flagKey)) return;
      appendCarrierAuditEntry({
        eventType: "certification_unlocked",
        severity: "notice",
        agentRef: getOrCreateLocalUserId(),
        summary: "Agent met certification threshold (three sessions at 90+ compliance).",
        metadata: { qualifyingSessions: qualifyingCount },
      });
      if (typeof window !== "undefined") window.localStorage.setItem(flagKey, "1");
    } catch {
      /* ignore */
    }
  }, [certified, qualifyingCount]);

  return (
    <div className="min-h-screen bg-[var(--bg-matte)]">
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--gold-accent)]">
              Compliance call lab
            </p>
            <h1 className="font-display text-xl uppercase tracking-widest text-[var(--text-primary)]">
              Training circuit
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {FEATURES.PLATFORM_AGENCY_COMMAND ? (
              <Link
                href="/agency/dashboard"
                className="text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                Command
              </Link>
            ) : FEATURES.AGENCY_DASHBOARD ? (
              <Link
                href="/training/agency"
                className="text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                Agency
              </Link>
            ) : null}
            {FEATURES.PLATFORM_AUDIT_CONSOLE ? (
              <Link
                href="/agency/audit"
                className="text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                Audit
              </Link>
            ) : null}
            {FEATURES.CARRIER_AUDIT_LOG ? (
              <Link
                href="/training/carrier-audit"
                className="text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                Carrier CSV
              </Link>
            ) : null}
            {(FEATURES.PLATFORM_CERTIFICATES || FEATURES.CREDENTIAL_VERIFICATION) ? (
              <Link
                href="/verify"
                className="text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                Verify
              </Link>
            ) : null}
            {FEATURES.PRINTABLE_CREDENTIALS ? (
              <Link
                href="/training/credential"
                className="text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                Legacy credential
              </Link>
            ) : null}
            <Link
              href="/dashboard"
              className="text-xs uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
            >
              ← Command deck
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {FEATURES.CALL_LAB_COMMAND_CENTER ? (
          <CallLabShell
            scenarioId={scenarioId}
            onScenarioId={setScenarioId}
            mode={mode}
            onMode={setMode}
            callerId={callerId}
            onCallerId={setCallerId}
            difficultyKey={difficultyKey}
            onDifficultyKey={setDifficultyKey}
            onSessionScored={handleSessionScored}
            onSaveCallAttempt={persistCallAttempt}
            certificationSlot={
              FEATURES.CERTIFICATION ? (
                <CertificationBadge
                  certified={certified}
                  qualifyingScoresCount={qualifyingCount}
                  printCredentialHref={
                    FEATURES.PRINTABLE_CREDENTIALS ? "/training/credential" : undefined
                  }
                  platformCredentialHref={
                    FEATURES.PLATFORM_CERTIFICATES && platformCert
                      ? `/certification/credential?id=${encodeURIComponent(platformCert.id)}`
                      : undefined
                  }
                />
              ) : null
            }
            leaderboardSlot={
              FEATURES.LEADERBOARD ? (
                <Leaderboard key={`lb-${lbRevision}`} currentUserId={userId} />
              ) : null
            }
          />
        ) : null}

        {!FEATURES.CALL_LAB_COMMAND_CENTER ? (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 rounded-sm border border-[var(--border-gold)]/30 bg-black/30 p-5"
            >
              <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
                {SCENARIO_PACK.title} · v{SCENARIO_PACK.version}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                Mission-ready voice practice: script-guided discipline, partner roleplay, or synthetic beneficiary
                calls with after-action compliance review.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]/90">{SCENARIO_PACK.disclaimer.global}</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]/80">{SCENARIO_PACK.disclaimer.script}</p>
              <p className="mt-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                Pack pass threshold (reference): {getPackPassThreshold()} · institute certification uses separate
                Call Lab rules.
              </p>
            </motion.div>

            <section className="mb-8">
              <h2 className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-[var(--text-primary)]">
                Select scenario
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TRAINING_SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScenarioId(s.id)}
                    className={`rounded-sm border p-4 text-left transition-colors ${
                      scenarioId === s.id
                        ? "border-[var(--gold-accent)]/55 bg-[var(--gold-accent)]/8"
                        : "border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/40 hover:border-[var(--border-gold)]/55"
                    }`}
                  >
                    <p className="font-display text-[10px] uppercase tracking-[0.15em] text-[var(--gold-accent)]">
                      {s.difficulty ?? "normal"} · {s.personality?.replace(/_/g, " ") ?? "persona"}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{s.title}</p>
                    {s.description ? (
                      <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{s.description}</p>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>

            <div className="mb-8 flex flex-wrap gap-2">
              {(
                [
                  ["guided", "Guided"],
                  ["roleplay", "Roleplay"],
                  ["ai-live", "AI Live Call"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={`rounded-sm border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                    mode === id
                      ? "border-[var(--gold-accent)] bg-[var(--gold-accent)]/10 text-[var(--gold-accent)]"
                      : "border-[var(--border-gold)]/35 text-[var(--text-muted)] hover:border-[var(--border-gold)]/55 hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === "guided" ? (
              <section className="space-y-4 rounded-sm border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/60 p-6">
                <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  Guided sequence · {activeScenario?.title ?? scenarioId}
                </h2>
                {activeScenario?.steps?.length ? (
                  <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--text-primary)]/85">
                    {activeScenario.steps.map((step) => (
                      <li key={step.id} className="leading-relaxed">
                        {formatStepForDisplay(step)}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ol className="list-decimal space-y-3 pl-5 text-sm text-[var(--text-primary)]/85">
                    <li>Open with permission to continue and scope of the appointment.</li>
                    <li>Confirm recording and disclosure obligations before needs discussion.</li>
                    <li>Document eligibility context; avoid steering before ANOC / consent.</li>
                    <li>Close with next steps and compliant contact preferences only.</li>
                  </ol>
                )}
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Run the checklist aloud; maintain tactical calm and neutral pacing.
                </p>
              </section>
            ) : null}

            {mode === "roleplay" ? (
              <section className="space-y-4 rounded-sm border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/60 p-6">
                <h2 className="font-display text-sm uppercase tracking-[0.2em] text-[var(--text-primary)]">
                  Roleplay brief · {activeScenario?.title ?? scenarioId}
                </h2>
                <p className="text-sm text-[var(--text-primary)]/85">
                  {activeScenario?.description ??
                    "Partner assumes a beneficiary comparing two MAPD options. You must obtain scope, present benefits within permitted boundaries, and resist pressure to guarantee savings."}{" "}
                  Debrief afterward against CMS disclosure checkpoints.
                </p>
                <ul className="list-inside list-disc space-y-2 text-sm text-[var(--text-muted)]">
                  <li>Keep tone measured; no urgent closes.</li>
                  <li>If uncertain, schedule a follow-up rather than improvising guarantees.</li>
                </ul>
                {activeScenario?.violations?.length ? (
                  <div className="mt-3 text-sm text-[var(--text-muted)]">
                    <p className="font-display text-[10px] uppercase tracking-wider text-amber-500/90">
                      Pack violations to avoid
                    </p>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                      {activeScenario.violations.map((v) => (
                        <li key={v.code}>
                          {v.code}: {v.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}

            {mode === "ai-live" ? (
              <section className="space-y-6">
                <div className={`grid gap-4 sm:grid-cols-2 ${!FEATURES.AI_CALL_MODE ? "opacity-55" : ""}`}>
                  <label className="block space-y-2">
                    <span className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      AI caller personality
                    </span>
                    <select
                      value={callerId}
                      onChange={(e) => setCallerId(e.target.value as AICallerProfileId)}
                      disabled={!FEATURES.AI_CALL_MODE}
                      className="w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]/50 disabled:cursor-not-allowed"
                    >
                      {aiCallerProfiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.tone}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Difficulty
                    </span>
                    <select
                      value={difficultyKey}
                      onChange={(e) => setDifficultyKey(e.target.value as DifficultyLevelKey)}
                      disabled={!FEATURES.AI_CALL_MODE}
                      className="w-full rounded-sm border border-[var(--border-gold)]/40 bg-black/40 px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--gold-accent)]/50 disabled:cursor-not-allowed"
                    >
                      {DIFFICULTY_OPTIONS.map((d) => (
                        <option key={d.key} value={d.key}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {FEATURES.CERTIFICATION ? (
                  <CertificationBadge
                    certified={certified}
                    qualifyingScoresCount={qualifyingCount}
                    printCredentialHref={
                      FEATURES.PRINTABLE_CREDENTIALS ? "/training/credential" : undefined
                    }
                    platformCredentialHref={
                      FEATURES.PLATFORM_CERTIFICATES && platformCert
                        ? `/certification/credential?id=${encodeURIComponent(platformCert.id)}`
                        : undefined
                    }
                  />
                ) : null}
                {FEATURES.AI_CALL_MODE ? (
                  <AICallMode
                    profileId={callerId}
                    difficultyKey={difficultyKey}
                    scenarioId={scenarioId}
                    onSessionScored={handleSessionScored}
                  />
                ) : (
                  <div className="rounded-sm border border-[var(--border-gold)]/35 bg-[var(--bg-matte-elevated)]/70 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-gold)]/40 text-[var(--gold-accent)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <p className="font-display text-sm uppercase tracking-[0.15em] text-[var(--text-primary)]">
                      AI Live Call available as premium upgrade
                    </p>
                    <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-muted)]">
                      Realtime beneficiary simulation and automated compliance coaching unlock with entitlement flags —
                      no keys exposed client-side.
                    </p>
                  </div>
                )}
              </section>
            ) : null}
          </div>

          {FEATURES.LEADERBOARD ? (
            <Leaderboard key={`lb-${lbRevision}`} currentUserId={userId} />
          ) : null}
        </div>
        ) : null}
      </main>
    </div>
  );
}
