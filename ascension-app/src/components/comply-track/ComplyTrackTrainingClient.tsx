"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTrainingRole } from "@/hooks/useTrainingRole";
import { canAccessAdminComplyTrack } from "@/lib/complyTrackAccess";
import { appendComplyTrackSession, loadComplyTrackSessions } from "@/services/complyTrackSessionStore";
import {
  createChecklistForScenario,
  setStep,
  toggleStep,
  type ChecklistState,
  type ComplianceStepId,
} from "@/lib/complyTrack/complianceChecklistEngine";
import { computeScore } from "@/lib/complyTrack/scoringEngine";
import { getScenarioById, loadScenarios } from "@/lib/complyTrack/scenarioEngine";
import { CallSimulationView } from "./CallSimulationView";
import { ComplyTrackDashboard } from "./ComplyTrackDashboard";
import { ComplyTrackResultsView } from "./ComplyTrackResultsView";
import { ComplyTrackScenarioSelector } from "./ComplyTrackScenarioSelector";
import { RightPanelFlow } from "./RightPanelFlow";

type Phase = "dashboard" | "select" | "call" | "results";

const SCENARIOS = loadScenarios();

export function ComplyTrackTrainingClient() {
  const { role, mounted } = useTrainingRole();
  const [phase, setPhase] = useState<Phase>("dashboard");
  const [scenarioId, setScenarioId] = useState<string | null>(() => SCENARIOS[0]?.id ?? null);
  const [checklist, setChecklist] = useState<ChecklistState>(() =>
    createChecklistForScenario(getScenarioById(SCENARIOS[0]?.id ?? "")?.requiredComplianceSteps ?? [])
  );
  const [callActive, setCallActive] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const callStartRef = useRef<number | null>(null);

  const [result, setResult] = useState<{
    percentage: number;
    passed: boolean;
    completed: number;
    total: number;
    missedSteps: ComplianceStepId[];
  } | null>(null);

  const [sessionsVersion, setSessionsVersion] = useState(0);
  const lastSession = useMemo(() => {
    const all = loadComplyTrackSessions();
    const s = all[0];
    if (!s) return null;
    return { scenarioName: s.scenarioName, at: s.at, percentage: s.percentage, passed: s.passed };
  }, [sessionsVersion]);

  const activeScenario = scenarioId ? getScenarioById(scenarioId) : undefined;

  useEffect(() => {
    if (!callActive) {
      callStartRef.current = null;
      return;
    }
    callStartRef.current = Date.now();
    const id = window.setInterval(() => {
      if (callStartRef.current == null) return;
      setElapsedMs(Date.now() - callStartRef.current);
    }, 200);
    return () => window.clearInterval(id);
  }, [callActive]);

  const resetChecklistForScenario = useCallback((id: string) => {
    const s = getScenarioById(id);
    if (!s) return;
    setChecklist(createChecklistForScenario(s.requiredComplianceSteps));
  }, []);

  const goSelect = useCallback(() => {
    setPhase("select");
    setCallActive(false);
    setElapsedMs(0);
  }, []);

  const goCall = useCallback(() => {
    if (!scenarioId) return;
    resetChecklistForScenario(scenarioId);
    setPhase("call");
    setCallActive(false);
    setElapsedMs(0);
  }, [scenarioId, resetChecklistForScenario]);

  const finishSession = useCallback(() => {
    if (!activeScenario) return;
    const score = computeScore(checklist, activeScenario.requiredComplianceSteps);
    const missed = activeScenario.requiredComplianceSteps.filter((id) => !checklist[id]);
    setResult({
      percentage: score.percentage,
      passed: score.passed,
      completed: score.completed,
      total: score.total,
      missedSteps: missed,
    });
    appendComplyTrackSession({
      at: new Date().toISOString(),
      scenarioId: activeScenario.id,
      scenarioName: activeScenario.name,
      percentage: score.percentage,
      passed: score.passed,
      durationMs: elapsedMs,
    });
    setSessionsVersion((n) => n + 1);
    setCallActive(false);
    setPhase("results");
  }, [activeScenario, checklist, elapsedMs]);

  const onToggle = useCallback((id: ComplianceStepId) => {
    setChecklist((c) => toggleStep(c, id));
  }, []);

  const onMarkComplete = useCallback((id: ComplianceStepId) => {
    setChecklist((c) => setStep(c, id, true));
  }, []);

  const required = activeScenario?.requiredComplianceSteps ?? [];

  return (
    <div className="min-h-screen bg-[var(--bg-matte)]">
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="font-display text-sm uppercase tracking-widest text-[var(--gold-accent)] transition-opacity hover:opacity-90"
          >
            ← Command deck
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wider">
            {mounted && canAccessAdminComplyTrack(role) ? (
              <Link
                href="/admin/comply-track"
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                Admin
              </Link>
            ) : null}
            <Link href="/agency/dashboard" className="text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]">
              Command
            </Link>
            <Link href="/verify" className="text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]">
              Verify
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {phase === "dashboard" ? (
          <ComplyTrackDashboard
            lastSession={lastSession}
            onStart={() => {
              goSelect();
            }}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div>
              {phase === "select" ? (
                <ComplyTrackScenarioSelector
                  scenarios={SCENARIOS}
                  selectedId={scenarioId}
                  onSelect={(id) => {
                    setScenarioId(id);
                    resetChecklistForScenario(id);
                  }}
                  onContinue={goCall}
                  onBack={() => {
                    setPhase("dashboard");
                  }}
                />
              ) : null}

              {phase === "call" && activeScenario ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPhase("select");
                        setCallActive(false);
                        setElapsedMs(0);
                      }}
                      className="text-xs uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
                    >
                      ← Scenarios
                    </button>
                  </div>
                  <CallSimulationView
                    callerName={activeScenario.callerDisplayName ?? "Caller"}
                    callerSubtitle={activeScenario.callerSubtitle ?? "Simulated"}
                    scenarioType={activeScenario.type}
                    callActive={callActive}
                    elapsedMs={elapsedMs}
                    onAccept={() => {
                      setElapsedMs(0);
                      setCallActive(true);
                    }}
                    onDecline={() => {
                      setCallActive(false);
                      setElapsedMs(0);
                      setPhase("select");
                    }}
                    onEndSession={finishSession}
                  />
                </div>
              ) : null}

              {phase === "results" && activeScenario && result ? (
                <ComplyTrackResultsView
                  scenarioName={activeScenario.name}
                  percentage={result.percentage}
                  passed={result.passed}
                  completed={result.completed}
                  total={result.total}
                  missedSteps={result.missedSteps}
                  onAgain={() => goSelect()}
                  onHome={() => setPhase("dashboard")}
                />
              ) : null}
            </div>

            <RightPanelFlow
              requiredSteps={phase === "select" && scenarioId ? getScenarioById(scenarioId)?.requiredComplianceSteps ?? [] : required}
              checklist={checklist}
              onToggle={onToggle}
              onMarkComplete={onMarkComplete}
              disabled={phase !== "call" || !callActive}
              readOnly={phase === "results" || phase === "select"}
            />
          </div>
        )}
      </main>
    </div>
  );
}
