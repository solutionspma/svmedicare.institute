"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { PEXELS_IMAGES } from "@/data/pexels-images";

export default function LiveTransfersPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-matte)]">
      {/* Animated wooden backdrop */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={PEXELS_IMAGES.background[0]}
          alt=""
          fill
          className="object-cover opacity-[0.30]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[var(--bg-matte)]/80" />
      </div>

      <header className="relative z-10 border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)]/90 backdrop-blur-sm px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/dashboard" className="text-sm uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]">
            ← Dashboard
          </Link>
          <h1 className="font-display text-xl uppercase tracking-widest text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
            Live Transfers
          </h1>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8"
        >
          <div className="flex-1">
            <h2 className="font-display text-3xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Mastering Live Transfers
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Live transfers are a critical touchpoint in Medicare sales. A smooth handoff builds trust, protects compliance, and increases conversion. Here&apos;s how to nail them.
            </p>
          </div>
          <div className="shrink-0">
            <div className="h-32 w-48 overflow-hidden rounded border border-[var(--border-gold)]/30">
              <Image
                src={PEXELS_IMAGES.transfers[0].src}
                alt={PEXELS_IMAGES.transfers[0].alt}
                width={192}
                height={128}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Section 1 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/80 p-6 backdrop-blur-sm"
          >
            <h3 className="font-display text-xl uppercase tracking-wider text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
              1. Before the Transfer
            </h3>
            <ul className="mt-4 space-y-2 text-[var(--text-primary)]">
              <li>• Get verbal consent: &quot;I&apos;d like to connect you with a specialist who can help. Is that okay?&quot;</li>
              <li>• Brief the prospect: &quot;You&apos;ll be speaking with [Name] who will review your options.&quot;</li>
              <li>• Confirm the prospect is ready and in a safe place to talk.</li>
            </ul>
          </motion.section>

          {/* Section 2 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/80 p-6 backdrop-blur-sm"
          >
            <h3 className="font-display text-xl uppercase tracking-wider text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
              2. Receiving the Transfer
            </h3>
            <ul className="mt-4 space-y-2 text-[var(--text-primary)]">
              <li>• Confirm identity: &quot;Hi [Name], this is [Your Name]. I understand you were just speaking with [Agent]. Is now still a good time?&quot;</li>
              <li>• Re-establish rapport before diving into plan details.</li>
              <li>• Don&apos;t repeat everything — build on what they already discussed.</li>
            </ul>
          </motion.section>

          {/* Section 3 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/80 p-6 backdrop-blur-sm"
          >
            <h3 className="font-display text-xl uppercase tracking-wider text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
              3. Compliance Must-Haves
            </h3>
            <ul className="mt-4 space-y-2 text-[var(--text-primary)]">
              <li>• Record consent for the transfer per CMS guidelines.</li>
              <li>• Use required scripts verbatim when mandated.</li>
              <li>• Document the transfer in your CRM or system of record.</li>
              <li>• Never assume the prospect remembers disclosures — confirm key points.</li>
            </ul>
          </motion.section>

          {/* Section 4 - Script */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg border border-[var(--border-gold)]/50 bg-[var(--gold-accent)]/5 p-6"
          >
            <h3 className="font-display text-xl uppercase tracking-wider text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
              Sample Opening Script
            </h3>
            <blockquote className="mt-4 border-l-2 border-[var(--gold-accent)] pl-4 italic text-[var(--text-primary)]">
              &quot;Hi [Prospect Name], this is [Your Name] with [Company]. I understand you were just speaking with [Agent Name] about your Medicare options. Before we continue, I want to make sure you&apos;re in a comfortable place to talk and that you have a few minutes. Do you? Great. [Agent] shared that you&apos;re interested in [topic]. I&apos;d like to walk you through a few options that might work well for you. Sound good?&quot;
            </blockquote>
          </motion.section>

          {/* Section 5 - Red Flags */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/80 p-6 backdrop-blur-sm"
          >
            <h3 className="font-display text-xl uppercase tracking-wider text-[var(--gold-accent)]" style={{ fontFamily: "var(--font-display)" }}>
              Red Flags — Pause & Reconnect
            </h3>
            <ul className="mt-4 space-y-2 text-[var(--text-primary)]">
              <li>• Prospect seems confused or doesn&apos;t remember the prior conversation</li>
              <li>• Background noise or distractions — &quot;Would another time work better?&quot;</li>
              <li>• Prospect didn&apos;t consent to the transfer</li>
              <li>• Language barrier — arrange for a qualified interpreter</li>
            </ul>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link href="/trivia">
            <span className="text-sm text-[var(--gold-accent)] hover:underline">
              Test your knowledge in the Trivia section →
            </span>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
