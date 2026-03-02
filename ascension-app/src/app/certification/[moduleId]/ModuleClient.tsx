"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { CertificationModule } from "@/data/certification";
import { MODULE_CONTENT } from "@/data/module-content";
import { getObjectiveContent } from "@/data/objectives-content";
import { getObjectivesForTopic, getLessonForTopic } from "@/data/topic-lessons";
import { getLeafNodes, findNodeById, getFirstLeaf } from "@/lib/module-utils";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import { ModuleFiletree } from "@/components/ModuleFiletree";
import { LessonCanvas } from "@/components/LessonCanvas";
import { Badge } from "@/components/Badge";
import { MiniExam } from "@/components/MiniExam";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PresenterWindow } from "@/components/PresenterWindow";
import { getLiveSession } from "@/data/live-sessions";

const STORAGE_KEY = "svmedicare-module-progress";

function getStoredProgress(moduleId: string): { miniExamPassed: boolean } {
  if (typeof window === "undefined") return { miniExamPassed: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { miniExamPassed: false };
    const all = JSON.parse(raw) as Record<string, { completed?: string[]; miniExamPassed: boolean }>;
    return { miniExamPassed: all[moduleId]?.miniExamPassed ?? false };
  } catch {
    return { miniExamPassed: false };
  }
}

function setStoredProgress(moduleId: string, data: { miniExamPassed: boolean }) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[moduleId] = { ...all[moduleId], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function CertificationModuleClient({ module }: { module: CertificationModule }) {
  const content = MODULE_CONTENT.find((m) => m.moduleId === module.id);
  const topics = content?.topics ?? [];
  const leaves = getLeafNodes(topics);
  const firstLeafId = leaves[0]?.id ?? null;

  // Check for live presenter session
  const liveSession = getLiveSession(module.id);

  const [activeId, setActiveId] = useState<string | null>(firstLeafId);
  const [selectedObjectiveIndex, setSelectedObjectiveIndex] = useState<number | null>(null);
  const [miniExamPassed, setMiniExamPassed] = useState(false);
  const [showMiniExam, setShowMiniExam] = useState(false);
  const [mobileTopicsOpen, setMobileTopicsOpen] = useState(false);

  useEffect(() => {
    const { miniExamPassed: passed } = getStoredProgress(module.id);
    setMiniExamPassed(passed);
  }, [module.id]);

  useEffect(() => {
    if (activeId === null && firstLeafId) setActiveId(firstLeafId);
  }, [firstLeafId, activeId]);

  useEffect(() => {
    if (activeId) setSelectedObjectiveIndex(null);
  }, [activeId]);

  const handleMiniExamPass = useCallback(() => {
    setMiniExamPassed(true);
    setStoredProgress(module.id, { miniExamPassed: true });
  }, [module.id]);

  const activeNode = activeId ? findNodeById(topics, activeId) : null;
  const displayNode = activeNode ? getFirstLeaf(activeNode) : null;
  const topicId = displayNode?.id ?? null;

  const objectivesForTopic =
    topicId && module.objectives.length > 0
      ? getObjectivesForTopic(topicId, module.objectives.length)
      : [];

  const currentLesson =
    topicId !== null && selectedObjectiveIndex !== null
      ? getLessonForTopic(topicId, selectedObjectiveIndex)
      : null;

  const objectiveContent =
    module.id && selectedObjectiveIndex !== null
      ? getObjectiveContent(module.id, selectedObjectiveIndex)
      : null;

  /** Module completion = passing mini exam only. No click-through. */
  const moduleComplete = miniExamPassed;
  const activeLabel = displayNode?.label ?? activeNode?.label ?? "Select topic";
  const handleTopicSelect = useCallback((id: string) => {
    setActiveId(id);
    setMobileTopicsOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-matte)]">
      <header className="shrink-0 border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-4 py-3 md:px-6 md:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Link
            href="/certification"
            className="shrink-0 text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
          >
            ← Certification
          </Link>
          {/* Mobile: Topics dropdown trigger */}
          <button
            type="button"
            onClick={() => setMobileTopicsOpen(true)}
            className="md:hidden flex flex-1 min-w-0 items-center justify-between gap-2 rounded border border-[var(--border-gold)]/40 bg-black/30 px-4 py-2.5 text-left"
          >
            <span className="truncate text-sm text-[var(--text-primary)]">{activeLabel}</span>
            <span className="shrink-0 text-[var(--gold-accent)]">▾</span>
          </button>
          <span className="hidden shrink-0 text-xs uppercase text-[var(--gold-accent)] md:block">Module {module.id}</span>
        </div>
      </header>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 min-h-0">
        {/* Desktop sidebar — hidden on mobile */}
        <aside className="hidden md:block w-[220px] lg:w-[20%] min-w-[220px] shrink-0 border-r border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Topics
          </h2>
          <ModuleFiletree
            nodes={topics}
            activeId={activeId}
            completedIds={new Set()}
            showAllComplete={miniExamPassed}
            onSelect={setActiveId}
          />
          <div className="mt-6 space-y-2">
            <Badge label="Module Complete" icon="✓" earned={moduleComplete} />
          </div>
        </aside>

        {/* Mobile topics drawer — slide-over from left */}
        <AnimatePresence>
          {mobileTopicsOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileTopicsOpen(false)}
                className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="md:hidden fixed left-0 top-0 z-50 h-full w-[min(300px,85vw)] overflow-y-auto border-r border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] p-4 shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    Topics
                  </h2>
                  <button
                    type="button"
                    onClick={() => setMobileTopicsOpen(false)}
                    className="rounded p-2 text-[var(--text-muted)] hover:bg-[var(--gold-accent)]/10 hover:text-[var(--gold-accent)]"
                    aria-label="Close topics"
                  >
                    ✕
                  </button>
                </div>
                <ModuleFiletree
                  nodes={topics}
                  activeId={activeId}
                  completedIds={new Set()}
                  showAllComplete={miniExamPassed}
                  onSelect={handleTopicSelect}
                />
                <div className="mt-6">
                  <Badge label="Module Complete" icon="✓" earned={moduleComplete} />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content — full width on mobile */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div>
                <h1
                  className="font-display text-3xl uppercase tracking-widest text-[var(--text-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {module.title}
                </h1>
                <p className="mt-2 text-[var(--text-muted)]">{module.description}</p>
              </div>

              {/* Audio narration for module introduction */}
              <AudioPlayer 
                src={module.audioUrl} 
                label={`${module.title} - Introduction Narration`}
              />

              <VideoPlaceholder
                src={content?.introVideo ?? module.videoPlaceholder}
                placeholderLabel="Module intro — add your video here"
              />

              {showMiniExam && content?.miniExamIds && content.miniExamIds.length > 0 ? (
                <MiniExam
                  questionIds={content.miniExamIds}
                  onPass={handleMiniExamPass}
                  onClose={() => setShowMiniExam(false)}
                  passThreshold={0.7}
                />
              ) : displayNode && topicId ? (
                <>
                  {/* Topic + Learning Objectives */}
                  <section>
                    <h2 className="font-body text-lg font-semibold text-[var(--text-primary)]">
                      {displayNode.label}
                    </h2>
                    {displayNode.body && (
                      <p className="mt-2 text-[var(--text-muted)]">{displayNode.body}</p>
                    )}
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Learning objectives — click to expand lesson
                      </h3>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Each objective opens a full lesson with scenarios and key concepts for this topic.
                      </p>
                      <ul className="mt-4 space-y-2">
                        {objectivesForTopic.map((objIndex) => {
                          const objText = module.objectives[objIndex];
                          const isSelected = selectedObjectiveIndex === objIndex;
                          const hasLesson =
                            getLessonForTopic(topicId, objIndex) || getObjectiveContent(module.id, objIndex);
                          return (
                            <li key={objIndex}>
                              <button
                                onClick={() =>
                                  setSelectedObjectiveIndex(isSelected ? null : objIndex)
                                }
                                className={`flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                  hasLesson
                                    ? isSelected
                                      ? "bg-[var(--gold-accent)]/20 text-[var(--gold-accent)]"
                                      : "text-[var(--text-muted)] hover:bg-[var(--gold-accent)]/10 hover:text-[var(--gold-accent)]"
                                    : "cursor-default text-[var(--text-muted)] opacity-75"
                                }`}
                              >
                                <span className="shrink-0 text-[var(--gold-accent)]">
                                  {isSelected ? "▾" : "▸"}
                                </span>
                                <span>{objText}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </section>

                  {/* Expanded lesson when objective clicked */}
                  {selectedObjectiveIndex !== null && (currentLesson || objectiveContent) && (
                    <section className="border-t border-[var(--border-gold)]/20 pt-8">
                      <LessonCanvas
                        lesson={currentLesson}
                        topicNode={displayNode}
                        objectiveText={module.objectives[selectedObjectiveIndex]}
                        objectivePages={objectiveContent?.pages}
                        moduleId={module.id}
                        objectiveIndex={selectedObjectiveIndex}
                      />
                    </section>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-6">
                  <p className="text-[var(--text-muted)]">
                    Select a topic from the sidebar to view its content and learning objectives.
                  </p>
                </div>
              )}

              {!showMiniExam && !miniExamPassed && content?.miniExamIds && content.miniExamIds.length > 0 && (
                <div className="rounded-lg border border-[var(--gold-accent)]/40 bg-[var(--gold-accent)]/5 p-6">
                  <h3 className="font-body font-semibold text-[var(--text-primary)]">
                    End of Chapter — Mini Exam
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Complete the lessons above, then take the mini exam to earn your module completion badge.
                  </p>
                  <button
                    onClick={() => setShowMiniExam(true)}
                    className="mt-4 rounded border border-[var(--gold-accent)] px-4 py-2 text-sm uppercase tracking-wider text-[var(--gold-accent)] hover:bg-[var(--gold-accent)]/10"
                  >
                    Take Mini Exam
                  </button>
                </div>
              )}

              <div className="flex gap-4 pt-8">
                <Link href="/certification">
                  <span className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
                    ← Back to modules
                  </span>
                </Link>
                <Link href="/certification/exam">
                  <span className="text-sm uppercase tracking-wider text-[var(--gold-accent)] hover:underline">
                    Take certification exam →
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Live Presenter Window - appears when enabled */}
      {liveSession && (
        <PresenterWindow
          defaultOpen={liveSession.autoOpen}
          meetingUrl={liveSession.meetingUrl}
          platform={liveSession.platform}
          presenterName={liveSession.presenterName}
        />
      )}
    </div>
  );
}
