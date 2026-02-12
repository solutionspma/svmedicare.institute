"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { CertificationModule } from "@/data/certification";
import { MODULE_CONTENT } from "@/data/module-content";
import { getLeafNodes, findNodeById, getFirstLeaf } from "@/lib/module-utils";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import { ModuleFiletree } from "@/components/ModuleFiletree";
import { ContentCanvas } from "@/components/ContentCanvas";
import { Badge } from "@/components/Badge";
import { MiniExam } from "@/components/MiniExam";

const STORAGE_KEY = "svmedicare-module-progress";

function getStoredProgress(moduleId: string): { completed: string[]; miniExamPassed: boolean } {
  if (typeof window === "undefined") return { completed: [], miniExamPassed: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: [], miniExamPassed: false };
    const all = JSON.parse(raw) as Record<string, { completed: string[]; miniExamPassed: boolean }>;
    return all[moduleId] ?? { completed: [], miniExamPassed: false };
  } catch {
    return { completed: [], miniExamPassed: false };
  }
}

function setStoredProgress(moduleId: string, data: { completed: string[]; miniExamPassed: boolean }) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[moduleId] = data;
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

  const [activeId, setActiveId] = useState<string | null>(firstLeafId);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    const { completed } = getStoredProgress(module.id);
    return new Set(completed);
  });
  const [miniExamPassed, setMiniExamPassed] = useState(false);
  const [showMiniExam, setShowMiniExam] = useState(false);

  useEffect(() => {
    const { completed, miniExamPassed: passed } = getStoredProgress(module.id);
    setCompletedIds(new Set(completed));
    setMiniExamPassed(passed);
  }, [module.id]);

  useEffect(() => {
    if (activeId === null && firstLeafId) setActiveId(firstLeafId);
  }, [firstLeafId, activeId]);

  const saveProgress = useCallback(
    (completed: string[], miniPassed: boolean) => {
      setStoredProgress(module.id, { completed, miniExamPassed: miniPassed });
    },
    [module.id]
  );

  const handleComplete = useCallback(() => {
    if (!activeId) return;
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(activeId);
      saveProgress([...next], miniExamPassed);
      return next;
    });
  }, [activeId, miniExamPassed, saveProgress]);

  const handleMiniExamPass = useCallback(() => {
    setMiniExamPassed(true);
    setCompletedIds((prev) => {
      const arr = [...prev];
      saveProgress(arr, true);
      return prev;
    });
  }, [saveProgress]);

  const activeNode = activeId ? findNodeById(topics, activeId) : null;
  const displayNode = activeNode ? getFirstLeaf(activeNode) : null;
  const allLeavesCompleted = leaves.length > 0 && leaves.every((l) => completedIds.has(l.id));

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-matte)]">
      <header className="shrink-0 border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/certification"
            className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
          >
            ← Certification
          </Link>
          <span className="text-xs uppercase text-[var(--gold-accent)]">Module {module.id}</span>
        </div>
      </header>

      {/* 20/80 split */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 min-h-0">
        {/* 20% — Filetree sidebar */}
        <aside className="w-[20%] min-w-[220px] shrink-0 border-r border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Topics
          </h2>
          <ModuleFiletree
            nodes={topics}
            activeId={activeId}
            completedIds={completedIds}
            onSelect={setActiveId}
          />
          <div className="mt-6 space-y-2">
            <Badge
              label="Content Complete"
              icon="✓"
              earned={allLeavesCompleted}
            />
            <Badge
              label="Mini Exam Passed"
              icon="🏆"
              earned={miniExamPassed}
            />
          </div>
        </aside>

        {/* 80% — Content canvas */}
        <main className="flex-1 overflow-y-auto p-8">
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

              <VideoPlaceholder
                src={content?.introVideo ?? module.videoPlaceholder}
                placeholderLabel="Module intro — add your ElevenLabs character/scene here"
                caption="Create with ElevenLabs: character welcome, key concept explainer, or scene transition"
              />

              <section>
                <h2 className="font-body text-lg font-semibold text-[var(--text-primary)]">
                  Learning Objectives
                </h2>
                <ul className="mt-2 space-y-2 text-[var(--text-muted)]">
                  {module.objectives.map((obj, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--gold-accent)]">•</span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </section>

              {showMiniExam && content?.miniExamIds && content.miniExamIds.length > 0 ? (
                <MiniExam
                  questionIds={content.miniExamIds}
                  onPass={handleMiniExamPass}
                  onClose={() => setShowMiniExam(false)}
                  passThreshold={0.7}
                />
              ) : displayNode && (displayNode.children?.length ?? 0) === 0 ? (
                <ContentCanvas
                  node={displayNode}
                  onComplete={handleComplete}
                  isCompleted={completedIds.has(displayNode.id)}
                />
              ) : (
                <div className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-6">
                  <p className="text-[var(--text-muted)]">
                    Select a topic from the sidebar to view its content.
                  </p>
                </div>
              )}

              {!showMiniExam && allLeavesCompleted && content?.miniExamIds && content.miniExamIds.length > 0 && (
                <div className="rounded-lg border border-[var(--gold-accent)]/40 bg-[var(--gold-accent)]/5 p-6">
                  <h3 className="font-body font-semibold text-[var(--text-primary)]">
                    End of Chapter — Mini Exam
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    You've completed all topics. Take the mini exam to earn your chapter badge.
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
    </div>
  );
}
