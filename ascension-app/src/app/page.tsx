"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { WOODEN_BACKGROUNDS } from "@/data/pexels-images";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-matte)]">
      {/* Animated wooden backdrop — subtle, cinematic */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={WOODEN_BACKGROUNDS[0]}
          alt=""
          fill
          className="object-cover opacity-[0.12]"
          sizes="100vw"
          priority
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[var(--bg-matte)]/95 via-[var(--bg-matte)]/90 to-[var(--bg-matte)]"
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>
      {/* Subtle moving light sweep */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delay: 0.5,
              duration: 2,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
      >
        <div
          className="absolute left-0 top-1/2 h-[1px] w-full origin-left -translate-y-1/2"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(201, 162, 39, 0.12) 20%, 
              rgba(201, 162, 39, 0.25) 50%, 
              rgba(201, 162, 39, 0.12) 80%, 
              transparent 100%)`,
            boxShadow: "0 0 80px rgba(201, 162, 39, 0.15)",
          }}
        >
          <motion.div
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-[var(--gold-accent)]/20 to-transparent"
            animate={{
              x: ["0%", "100%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatDelay: 3,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      </motion.div>

      {/* Gold accent lines — diagonal, breaking the grid */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute left-[-10%] top-[15%] h-px w-[40%] -rotate-12"
          style={{
            background: `linear-gradient(90deg, transparent, var(--gold-accent) 20%, var(--gold-accent-dim) 80%, transparent)`,
            opacity: 0.4,
          }}
        />
        <div
          className="absolute right-[-10%] bottom-[25%] h-px w-[35%] rotate-6"
          style={{
            background: `linear-gradient(90deg, transparent, var(--gold-accent-dim) 20%, var(--gold-accent) 80%, transparent)`,
            opacity: 0.3,
          }}
        />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-[var(--space-23)]">
        {/* Kinetic typography */}
        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
              },
            },
          }}
        >
          <motion.p
            className="font-display text-[clamp(2.5rem,10vw,5.5rem)] uppercase leading-[0.9] tracking-[0.08em] text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
            variants={{
              hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            KNOWLEDGE.
          </motion.p>
          <motion.p
            className="font-display mt-2 text-[clamp(2.5rem,10vw,5.5rem)] uppercase leading-[0.9] tracking-[0.08em] text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
            variants={{
              hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            CONFIDENCE.
          </motion.p>
          <motion.p
            className="font-display mt-2 text-[clamp(2.5rem,10vw,5.5rem)] uppercase leading-[0.9] tracking-[0.08em] text-[var(--gold-accent)]"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 0 60px var(--gold-glow)",
            }}
            variants={{
              hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            EXCELLENCE.
          </motion.p>
        </motion.div>

        {/* Subline */}
        <motion.p
          className="mt-8 max-w-md text-center font-body text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          SV Medicare Institute
        </motion.p>
        <motion.p
          className="mt-2 text-center font-body text-sm text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Healthcare & Insurance Excellence
        </motion.p>

        {/* CTA — metallic gold, cinematic */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/dashboard">
            <motion.button
              className="group relative overflow-hidden rounded-sm border border-[var(--border-gold)] bg-transparent px-10 py-4 font-body text-sm font-medium uppercase tracking-[0.2em] text-[var(--gold-accent)] transition-colors hover:border-[var(--gold-accent)] hover:text-[var(--gold-accent)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: "0 0 30px rgba(201, 162, 39, 0.1)",
              }}
            >
              <span className="relative z-10">Enter the Institute</span>
              <motion.span
                className="absolute inset-0 bg-[var(--gold-accent)]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.08 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Optional: Ambient audio toggle placeholder */}
        <motion.div
          className="absolute bottom-8 right-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-gold)]/50 text-[var(--text-muted)] transition-colors hover:border-[var(--gold-accent)]/50 hover:text-[var(--gold-accent)]"
            aria-label="Toggle ambient audio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </button>
        </motion.div>
      </main>
    </div>
  );
}
