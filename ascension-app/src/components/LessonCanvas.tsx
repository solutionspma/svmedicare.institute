"use client";

import { motion } from "framer-motion";
import type { LessonContent } from "@/data/topic-lessons";
import type { ContentNode } from "@/data/module-content";

type Props = {
  /** Full scenario-based lesson (preferred) */
  lesson: LessonContent | null;
  /** Topic node for fallback (body + bullets) */
  topicNode: ContentNode | null;
  /** Objective text */
  objectiveText: string;
  /** Objective pages from objectives-content (fallback when no lesson) */
  objectivePages?: { title: string; body: string; bullets?: string[]; keyPoint?: string; callout?: string }[];
  moduleId: string;
  objectiveIndex: number;
  /** Future: allow click-through for users who previously completed (backend master control) */
  allowClickThrough?: boolean;
};

export function LessonCanvas({
  lesson,
  topicNode,
  objectiveText,
  objectivePages,
  moduleId,
  objectiveIndex,
}: Props) {
  // Full scenario-based lesson
  if (lesson) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Lesson: {objectiveText}
          </h2>
        </div>

        {/* Scenario */}
        <div className="rounded-lg border border-[var(--gold-accent)]/30 bg-[var(--gold-accent)]/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-accent)]">
            Scenario
          </p>
          <h3 className="mt-2 font-body text-lg font-semibold text-[var(--text-primary)]">
            {lesson.scenarioTitle}
          </h3>
          <p className="mt-3 leading-relaxed text-[var(--text-primary)]">
            {lesson.scenario}
          </p>
        </div>

        {/* Narrative */}
        <div>
          <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            What You Need to Know
          </h3>
          <p className="mt-3 leading-relaxed text-[var(--text-primary)]">
            {lesson.narrative}
          </p>
        </div>

        {/* Key Concepts */}
        <div>
          <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Key Concepts
          </h3>
          <ul className="mt-3 space-y-2 border-l-2 border-[var(--gold-accent)]/30 pl-4">
            {lesson.keyConcepts.map((c, i) => (
              <li key={i} className="text-[var(--text-primary)]">{c}</li>
            ))}
          </ul>
        </div>

        {/* Application */}
        <div className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-accent)]">
            In the Field
          </p>
          <p className="mt-2 text-[var(--text-primary)]">{lesson.application}</p>
        </div>

        {/* Think About */}
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Reflect
          </p>
          <p className="mt-2 text-[var(--text-primary)]">{lesson.thinkAbout}</p>
        </div>

        {/* Takeaway */}
        <div className="rounded-lg border-2 border-[var(--gold-accent)]/40 bg-[var(--gold-accent)]/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-accent)]">
            Takeaway
          </p>
          <p className="mt-2 font-medium text-[var(--text-primary)]">{lesson.takeaway}</p>
        </div>
      </motion.div>
    );
  }

  // Fallback: topic content + objective pages (no scenario)
  const hasObjectivePages = objectivePages && objectivePages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
          Lesson: {objectiveText}
        </h2>
      </div>

      {topicNode?.body && (
        <div>
          <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Topic Overview
          </h3>
          <p className="mt-3 leading-relaxed text-[var(--text-primary)]">{topicNode.body}</p>
          {topicNode.bullets && topicNode.bullets.length > 0 && (
            <ul className="mt-4 space-y-2 border-l-2 border-[var(--gold-accent)]/30 pl-4">
              {topicNode.bullets.map((b, i) => (
                <li key={i} className="text-[var(--text-muted)]">{b}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {hasObjectivePages && (
        <div className="space-y-6">
          <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Learning Material
          </h3>
          {objectivePages.map((page, i) => (
            <div key={i} className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-5">
              <h4 className="font-body font-semibold text-[var(--text-primary)]">{page.title}</h4>
              <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{page.body}</p>
              {page.bullets && page.bullets.length > 0 && (
                <ul className="mt-3 space-y-1 pl-4">
                  {page.bullets.map((b, j) => (
                    <li key={j} className="text-[var(--text-muted)]">{b}</li>
                  ))}
                </ul>
              )}
              {page.keyPoint && (
                <div className="mt-4 rounded border border-[var(--gold-accent)]/40 bg-[var(--gold-accent)]/10 px-4 py-2">
                  <p className="text-xs font-semibold text-[var(--gold-accent)]">Key point</p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">{page.keyPoint}</p>
                </div>
              )}
              {page.callout && (
                <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/10 px-4 py-2">
                  <p className="text-xs font-semibold text-amber-400">Remember</p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">{page.callout}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
