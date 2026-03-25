"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TriviaQuestion } from "@/data/trivia";
import { TRIVIA_QUESTIONS } from "@/data/trivia";
import { Badge } from "./Badge";

type Props = {
  questionIds: string[];
  onPass: () => void;
  onClose?: () => void;
  passThreshold?: number;
};

export function MiniExam({ questionIds, onPass, onClose, passThreshold = 0.7 }: Props) {
  const questions = questionIds
    .map((id) => TRIVIA_QUESTIONS.find((q) => q.id === id))
    .filter((q): q is TriviaQuestion => q != null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-6">
        <p className="text-[var(--text-muted)]">No questions available for this mini exam.</p>
      </div>
    );
  }

  const q = questions[currentIndex];
  const isCorrect = selected !== null && selected === q.correctIndex;
  const progress = ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const total = score + (selected === q.correctIndex ? 1 : 0);
      setFinalScore(total);
      setFinished(true);
      const pct = total / questions.length;
      setPassed(pct >= passThreshold);
      if (pct >= passThreshold) onPass();
    }
  };

  if (finished) {
    const pct = (finalScore / questions.length) * 100;
    const didPass = pct >= passThreshold * 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-lg border border-[var(--gold-accent)]/40 bg-[var(--bg-matte-elevated)] p-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-6xl"
          >
            {didPass ? "🏆" : "📚"}
          </motion.div>
          <h3 className="mt-4 font-display text-xl uppercase tracking-widest text-[var(--text-primary)]">
            {didPass ? "Mini Exam Passed!" : "Keep Studying"}
          </h3>
          <p className="mt-2 text-[var(--text-muted)]">
            Score: {finalScore} / {questions.length} ({Math.round(pct)}%)
          </p>
          {didPass && (
            <Badge
              label="Chapter Complete"
              icon="✓"
              earned
            />
          )}
          <div className="mt-6 flex justify-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="rounded border border-[var(--border-gold)]/50 px-4 py-2 text-sm uppercase tracking-wider text-[var(--text-muted)] hover:bg-[var(--gold-accent)]/10 hover:text-[var(--gold-accent)]"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-[var(--gold-accent)]/40 bg-[var(--bg-matte-elevated)] p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[var(--gold-accent)]">
          Mini Exam — Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--bg-matte)]">
          <motion.div
            className="h-full bg-[var(--gold-accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <h3 className="font-body text-lg font-medium text-[var(--text-primary)]">{q.question}</h3>

      <ul className="mt-4 space-y-2">
        {q.options.map((opt, i) => {
          const wasSelected = selected === i;
          const isRight = i === q.correctIndex;
          const showResult = answered && (wasSelected || isRight);

          return (
            <motion.li key={i}>
              <button
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  showResult
                    ? isRight
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : wasSelected
                        ? "border-red-500/50 bg-red-500/10 text-red-400"
                        : "border-[var(--border-gold)]/30 text-[var(--text-muted)]"
                    : "border-[var(--border-gold)]/30 text-[var(--text-primary)] hover:border-[var(--gold-accent)]/30 hover:bg-[var(--gold-accent)]/5"
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            </motion.li>
          );
        })}
      </ul>

      {answered && q.explanation && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 border-l-2 border-[var(--gold-accent)]/30 pl-4 text-sm text-[var(--text-muted)]"
        >
          {q.explanation}
        </motion.p>
      )}

      {answered && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            className="rounded border border-[var(--gold-accent)] px-4 py-2 text-sm uppercase tracking-wider text-[var(--gold-accent)] hover:bg-[var(--gold-accent)]/10"
          >
            {currentIndex < questions.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
