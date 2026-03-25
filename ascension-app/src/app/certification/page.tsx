"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CERTIFICATION_MODULES } from "@/data/certification";
import { PEXELS_IMAGES } from "@/data/pexels-images";

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-matte)]">
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/dashboard" className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            ← Dashboard
          </Link>
          <h1 className="font-display text-xl uppercase tracking-widest text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
            SV Certification
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8"
        >
          <div className="flex-1">
            <h2 className="font-display text-3xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Medicare Certification Course
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Based on <em>The Only Medicare Book You Need</em>, AHIP Modules 1–5, and CMS Compliance Training. 
              Effective, not exhaustive — key competencies for insurance professionals.
            </p>
          </div>
          <div className="shrink-0">
            <div className="h-32 w-48 overflow-hidden rounded border border-[var(--border-gold)]/30">
              <Image
                src={PEXELS_IMAGES.certification[0].src}
                alt={PEXELS_IMAGES.certification[0].alt}
                width={192}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {CERTIFICATION_MODULES.map((mod, i) => (
            <motion.section
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[var(--gold-accent)]">
                    Module {mod.id}
                  </span>
                  <h3 className="mt-1 font-body text-xl font-semibold text-[var(--text-primary)]">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {mod.description}
                  </p>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    {mod.duration}
                  </p>
                </div>
                <Link href={`/certification/${mod.id}`}>
                  <motion.span
                    className="inline-block rounded border border-[var(--border-gold)] px-4 py-2 text-sm uppercase tracking-wider text-[var(--gold-accent)] transition-colors hover:bg-[var(--gold-accent)]/10"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start →
                  </motion.span>
                </Link>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-[var(--text-muted)]">
                {mod.objectives.slice(0, 3).map((obj, j) => (
                  <li key={j}>• {obj}</li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-lg border-2 border-[var(--gold-accent)]/50 bg-[var(--gold-accent)]/5 p-8 text-center"
        >
          <h3 className="font-display text-2xl uppercase tracking-widest text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
            Ready for the Exam?
          </h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            20 questions • 70% to pass • ~30 min
          </p>
          <Link href="/certification/exam" className="mt-4 inline-block">
            <motion.button
              className="rounded border border-[var(--gold-accent)] bg-[var(--gold-accent)]/20 px-8 py-3 font-body text-sm uppercase tracking-wider text-[var(--gold-accent)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Take Certification Exam
            </motion.button>
          </Link>
        </motion.div>

      </main>
    </div>
  );
}
