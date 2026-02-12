"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const MISSION_DATA: Record<string, { title: string; description: string; xp: number }> = {
  "1": {
    title: "Mission 1: Medicare Basics",
    description: "Define Parts A, B, C, D. Master eligibility and enrollment periods.",
    xp: 150,
  },
  "2": {
    title: "Mission 2: Plan Types & Benefits",
    description: "Compare Medicare Advantage vs Original Medicare. Explore Medigap and Part D.",
    xp: 200,
  },
  "3": {
    title: "Mission 3: Compliance Drills",
    description: "CMS regulations for Medicare marketing. Compliant vs non-compliant messaging.",
    xp: 250,
  },
};

export function MissionClient({ id }: { id: string }) {
  const mission = MISSION_DATA[id];
  const [completed, setCompleted] = useState(false);

  if (!mission) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-matte)]">
        <p className="text-[var(--text-muted)]">Mission not found.</p>
        <Link href="/dashboard" className="ml-4 text-[var(--gold-accent)]">
          ← Dashboard
        </Link>
      </div>
    );
  }

  const handleComplete = () => {
    setCompleted(true);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance("Mission clear. Well done.");
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-matte)]">
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/dashboard" className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            {completed && (
              <motion.div
                className="absolute -right-4 -top-4 z-10"
                initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <span
                  className="inline-block rounded border-2 border-[var(--gold-accent)] bg-[var(--gold-accent)]/10 px-4 py-2 font-display text-2xl uppercase tracking-wider text-[var(--gold-accent)]"
                  style={{
                    fontFamily: "var(--font-display)",
                    boxShadow: "0 0 30px var(--gold-glow)",
                  }}
                >
                  CLEAR
                </span>
              </motion.div>
            )}

            <h1 className="font-display text-3xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              {mission.title}
            </h1>
            <p className="mt-4 text-[var(--text-muted)]">{mission.description}</p>
            <p className="mt-2 text-sm text-[var(--gold-accent)]">{mission.xp} XP on completion</p>
          </div>

          <div className="mt-12 space-y-6">
            <div className="rounded-sm border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-6">
              <h2 className="mb-4 font-body text-lg font-semibold text-[var(--text-primary)]">
                Content Placeholder
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Mission content will load here. For MVP, complete the mission to see the animated CLEAR stamp.
              </p>
            </div>

            {!completed ? (
              <motion.button
                className="w-full rounded-sm border border-[var(--border-gold)] bg-transparent py-4 font-body text-sm uppercase tracking-wider text-[var(--gold-accent)] transition-colors hover:bg-[var(--gold-accent)]/10"
                onClick={handleComplete}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Complete Mission
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="mb-4 text-center text-sm text-[var(--gold-accent)]">
                  +{mission.xp} XP earned
                </p>
                <Link href="/dashboard">
                  <motion.button
                    className="w-full rounded-sm border border-[var(--border-gold)] bg-[var(--gold-accent)]/10 py-4 font-body text-sm uppercase tracking-wider text-[var(--gold-accent)]"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Return to Dashboard
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
