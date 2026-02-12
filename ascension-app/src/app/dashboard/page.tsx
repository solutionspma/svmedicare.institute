"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Mock data for MVP — will wire to Supabase
const RANKS = [
  "Trainee",
  "Certified",
  "Senior Advisor",
  "Expert",
  "Master",
] as const;

const STARTER_MISSIONS = [
  {
    id: "1",
    title: "Mission 1: Medicare Basics",
    description: "Define Parts A, B, C, D. Master eligibility.",
    xp: 150,
    completed: false,
  },
  {
    id: "2",
    title: "Mission 2: Plan Types",
    description: "Compare Advantage vs Original. Explore Medigap.",
    xp: 200,
    completed: false,
  },
  {
    id: "3",
    title: "Mission 3: Compliance Drills",
    description: "CMS regulations. Compliant messaging.",
    xp: 250,
    completed: false,
  },
];

const QUICK_ACTIONS = [
  { href: "/certification", label: "Certification Course", icon: "📜", desc: "5 modules + exam" },
  { href: "/trivia", label: "Medicare Trivia", icon: "🎯", desc: "Test your knowledge" },
  { href: "/transfers", label: "Live Transfers", icon: "📞", desc: "Master the handoff" },
];

export default function DashboardPage() {
  const currentXP = 0;
  const xpToNextRank = 500;
  const currentRankIndex = 0;
  const progress = (currentXP / xpToNextRank) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg-matte)]">
      {/* Level 1 HUD-style header */}
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-display text-xl uppercase tracking-widest text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
            SV Institute
          </Link>
          <div className="flex items-center gap-6">
            {/* XP counter in corner */}
            <div className="flex items-center gap-2 rounded border border-[var(--border-gold)]/30 bg-black/30 px-3 py-1.5">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
                XP
              </span>
              <span className="font-mono text-sm font-semibold text-[var(--gold-accent)]">
                {currentXP}
              </span>
            </div>
            <div className="h-4 w-px bg-[var(--border-gold)]/30" />
            <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">
              {RANKS[currentRankIndex]}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Level map / XP meter */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mb-4 font-display text-2xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Rank Progress
          </h2>
          <div className="flex items-center gap-4">
            {/* Rank ladder preview */}
            <div className="flex flex-col gap-1">
              {RANKS.map((rank, i) => (
                <span
                  key={rank}
                  className={`text-xs uppercase ${
                    i <= currentRankIndex
                      ? "text-[var(--gold-accent)]"
                      : "text-[var(--text-muted)]/50"
                  }`}
                >
                  {rank}
                </span>
              ))}
            </div>
            <div className="flex-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/50">
                <motion.div
                  className="h-full bg-[var(--gold-accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                {currentXP} / {xpToNextRank} XP to {RANKS[currentRankIndex + 1] ?? "Master"}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Quick actions — Trivia & Live Transfers */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 font-display text-2xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action, i) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="group flex items-center gap-4 rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-6 transition-all hover:border-[var(--gold-accent)]/60 hover:bg-[var(--gold-accent)]/5"
                >
                  <span className="text-4xl">{action.icon}</span>
                  <div>
                    <h3 className="font-body font-semibold text-[var(--text-primary)] group-hover:text-[var(--gold-accent)]">
                      {action.label}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">{action.desc}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Mission cards */}
        <section>
          <h2 className="mb-6 font-display text-2xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Missions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STARTER_MISSIONS.map((mission, i) => (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 * i,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative overflow-hidden rounded-sm border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-6 transition-colors hover:border-[var(--border-gold)]/60"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-xs uppercase tracking-wider text-[var(--gold-accent)]">
                    {mission.xp} XP
                  </span>
                  {mission.completed && (
                    <span className="rounded bg-[var(--gold-accent)]/20 px-2 py-0.5 text-xs text-[var(--gold-accent)]">
                      CLEAR
                    </span>
                  )}
                </div>
                <h3 className="mb-2 font-body text-lg font-semibold text-[var(--text-primary)]">
                  {mission.title}
                </h3>
                <p className="mb-4 text-sm text-[var(--text-muted)]">
                  {mission.description}
                </p>
                <Link href={`/missions/${mission.id}`}>
                  <motion.button
                    className="w-full rounded-sm border border-[var(--border-gold)] py-2.5 font-body text-sm uppercase tracking-wider text-[var(--gold-accent)] transition-colors hover:bg-[var(--gold-accent)]/10"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {mission.completed ? "Review" : "Start Mission"}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Back to landing */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="text-sm uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
          >
            ← Return to entrance
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
