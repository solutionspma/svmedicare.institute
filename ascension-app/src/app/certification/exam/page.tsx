"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CERTIFICATION_EXAM_CONFIG,
  CERTIFICATION_MODULES,
} from "@/data/certification";
import { TRIVIA_QUESTIONS, type TriviaQuestion } from "@/data/trivia";

function speak(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }
}

function PassedSpeech() {
  const done = useRef(false);
  useEffect(() => {
    if (!done.current) {
      speak("Congratulations! You passed the certification exam.");
      done.current = true;
    }
  }, []);
  return null;
}

export default function CertificationExamPage() {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const questions = useMemo(() => {
    const selected: TriviaQuestion[] = [];
    for (const mod of CERTIFICATION_MODULES) {
      const pool = TRIVIA_QUESTIONS.filter((q) => q.category === mod.contentSlug);
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      selected.push(...shuffled.slice(0, CERTIFICATION_EXAM_CONFIG.questionsPerModule));
    }
    return [...selected].sort(() => Math.random() - 0.5);
  }, []);

  const handleAnswer = useCallback((qIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  const score = useMemo(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    return { correct, total: questions.length, pct: (correct / questions.length) * 100 };
  }, [questions, answers]);

  const passed = submitted && score.pct >= CERTIFICATION_EXAM_CONFIG.passThreshold * 100;

  if (!started) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)]">
        <header className="border-b border-[var(--border-gold)]/20 px-6 py-4">
          <Link href="/certification" className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            ← Certification
          </Link>
        </header>
        <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Certification Exam
            </h1>
            <p className="mt-4 text-[var(--text-muted)]">
              {questions.length} questions • {CERTIFICATION_EXAM_CONFIG.timeLimitMinutes} min • 70% to pass
            </p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Covers all 5 modules. No time limit in this practice exam.
            </p>
            <motion.button
              onClick={() => setStarted(true)}
              className="mt-8 rounded border border-[var(--gold-accent)] bg-[var(--gold-accent)]/20 px-8 py-4 font-body text-sm uppercase tracking-wider text-[var(--gold-accent)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Begin Exam
            </motion.button>
          </motion.div>
        </main>
      </div>
    );
  }

  if (submitted) {
    const pct = Math.round(score.pct);
    return (
      <div className="min-h-screen bg-[var(--bg-matte)]">
        <header className="border-b border-[var(--border-gold)]/20 px-6 py-4">
          <Link href="/certification" className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            ← Certification
          </Link>
        </header>
        <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl uppercase tracking-widest text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
              {passed ? "Certification Complete" : "Keep Studying"}
            </h1>
            <p className="mt-6 font-body text-5xl font-bold text-[var(--text-primary)]">
              {score.correct} / {score.total}
            </p>
            <p className="mt-2 text-[var(--text-muted)]">{pct}%</p>
            {passed ? (
              <>
                <PassedSpeech />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded border-2 border-[var(--gold-accent)] px-6 py-4 text-[var(--gold-accent)]"
                >
                  🏆 Passed
                </motion.div>
              </>
            ) : (
              <p className="mt-4 text-sm text-[var(--text-muted)]">
                Review the modules and try again. You need 70% to pass.
              </p>
            )}
            <div className="mt-12 flex gap-4">
              <Link href="/certification">
                <motion.div
                  className="rounded border border-[var(--border-gold)] px-6 py-3 text-sm uppercase tracking-wider text-[var(--gold-accent)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to modules
                </motion.div>
              </Link>
              <Link href="/certification/exam">
                <motion.div
                  className="rounded bg-[var(--gold-accent)]/20 px-6 py-3 text-sm uppercase tracking-wider text-[var(--gold-accent)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Retake exam
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const showSubmit = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-screen bg-[var(--bg-matte)]">
      <header className="border-b border-[var(--border-gold)]/20 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/certification" className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            ← Exit
          </Link>
          <span className="text-sm text-[var(--text-muted)]">
            {Object.keys(answers).length} / {questions.length} answered
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-4 text-xs uppercase tracking-wider text-[var(--text-muted)]">
              Question {currentQ + 1} of {questions.length}
            </p>
            <h2 className="font-body text-xl font-semibold leading-relaxed text-[var(--text-primary)]">
              {questions[currentQ].question}
            </h2>
            <div className="mt-8 space-y-3">
              {questions[currentQ].options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(currentQ, idx)}
                  className={`w-full rounded-lg border p-4 text-left font-body transition-all ${
                    answers[currentQ] === idx
                      ? "border-[var(--gold-accent)] bg-[var(--gold-accent)]/10"
                      : "border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] hover:border-[var(--gold-accent)]/50"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ((q) => q - 1)}
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
                >
                  ← Previous
                </button>
              )}
              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ((q) => q + 1)}
                  className="text-sm text-[var(--gold-accent)] hover:underline"
                >
                  Next →
                </button>
              ) : null}
              {showSubmit && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleSubmit}
                  className="rounded border border-[var(--gold-accent)] bg-[var(--gold-accent)]/20 px-6 py-2 text-sm uppercase tracking-wider text-[var(--gold-accent)]"
                >
                  Submit exam
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
