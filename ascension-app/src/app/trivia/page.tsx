"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  TRIVIA_CATEGORIES,
  TRIVIA_QUESTIONS,
  type TriviaQuestion,
} from "@/data/trivia";

function speak(text: string) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }
}

export default function TriviaPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = useCallback((catId: string) => {
    const filtered = TRIVIA_QUESTIONS.filter((q) => q.category === catId);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 5);
    setCategory(catId);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setGameOver(false);
  }, []);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    const q = questions[currentIndex];
    const correct = idx === q.correctIndex;
    if (correct) {
      setScore((s) => s + 1);
      speak("Correct! Well done.");
    } else {
      speak("Sorry, that's not correct.");
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setGameOver(true);
      if (score === questions.length) {
        speak("Perfect score! Outstanding!");
      } else if (score >= questions.length / 2) {
        speak("Good job! Keep learning.");
      }
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-[var(--bg-matte)]">
        <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/dashboard" className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
              ← Dashboard
            </Link>
            <h1 className="font-display text-xl uppercase tracking-widest text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
              Medicare Trivia
            </h1>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Choose Your Category
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              5 questions per round. Test your knowledge from The Only Medicare Book You Need.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRIVIA_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => startGame(cat.id)}
                className="group flex flex-col items-center gap-3 rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-8 text-left transition-all hover:border-[var(--gold-accent)]/60 hover:bg-[var(--gold-accent)]/5"
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="font-body text-lg font-semibold text-[var(--text-primary)]">
                  {cat.label}
                </span>
              </motion.button>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
            Tap answers to hear feedback. Sound on for the full experience.
          </p>
        </main>
      </div>
    );
  }

  if (gameOver) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-[var(--bg-matte)]">
        <header className="border-b border-[var(--border-gold)]/20 px-6 py-4">
          <Link href="/trivia" className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            ← New Game
          </Link>
        </header>
        <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <h2 className="font-display text-4xl uppercase tracking-widest text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
              Round Complete
            </h2>
            <p className="mt-6 font-body text-6xl font-bold text-[var(--text-primary)]">
              {score} / {questions.length}
            </p>
            <p className="mt-2 text-[var(--text-muted)]">{pct}% correct</p>
            {pct === 100 && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-block rounded border border-[var(--gold-accent)] px-4 py-2 text-[var(--gold-accent)]"
              >
                🏆 Perfect!
              </motion.span>
            )}
            <div className="mt-12 flex gap-4">
              <Link href="/trivia">
                <motion.button
                  className="rounded border border-[var(--border-gold)] px-6 py-3 text-sm uppercase tracking-wider text-[var(--gold-accent)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Play Again
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  className="rounded bg-[var(--gold-accent)]/20 px-6 py-3 text-sm uppercase tracking-wider text-[var(--gold-accent)]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-matte)]">
      <header className="border-b border-[var(--border-gold)]/20 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">
            {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-sm font-semibold text-[var(--gold-accent)]">
            Score: {score}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-body text-xl font-semibold leading-relaxed text-[var(--text-primary)]">
              {q.question}
            </h2>
            <div className="mt-8 space-y-3">
              {q.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const isCorrect = idx === q.correctIndex;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selected !== null}
                    className={`w-full rounded-lg border p-4 text-left font-body transition-all ${
                      showCorrect
                        ? "border-green-500/60 bg-green-500/10"
                        : showWrong
                        ? "border-red-500/60 bg-red-500/10"
                        : "border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] hover:border-[var(--gold-accent)]/50"
                    }`}
                    whileHover={selected === null ? { scale: 1.01 } : {}}
                    whileTap={selected === null ? { scale: 0.99 } : {}}
                  >
                    <span className="text-[var(--text-primary)]">{opt}</span>
                    {showCorrect && <span className="ml-2 text-green-400">✓</span>}
                    {showWrong && <span className="ml-2 text-red-400">✗</span>}
                  </motion.button>
                );
              })}
            </div>
            {showResult && q.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-4"
              >
                <p className="text-sm text-[var(--text-muted)]">
                  <strong className="text-[var(--gold-accent)]">Learn:</strong>{" "}
                  {q.explanation}
                </p>
              </motion.div>
            )}
            {showResult && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={nextQuestion}
                className="mt-6 w-full rounded-lg border border-[var(--gold-accent)] py-3 font-body text-sm uppercase tracking-wider text-[var(--gold-accent)]"
              >
                {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
