"use client";

import { motion } from "framer-motion";
import type { ContentNode } from "@/data/module-content";
import { VideoPlaceholder } from "./VideoPlaceholder";

type Props = {
  node: ContentNode;
  onComplete: () => void;
  isCompleted: boolean;
};

export function ContentCanvas({ node, onComplete, isCompleted }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-2xl uppercase tracking-widest text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
          {node.label}
        </h2>
        {!isCompleted && (
          <motion.button
            onClick={onComplete}
            className="shrink-0 rounded border border-[var(--gold-accent)] px-3 py-1.5 text-xs uppercase tracking-wider text-[var(--gold-accent)] hover:bg-[var(--gold-accent)]/10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Mark complete
          </motion.button>
        )}
      </div>

      {node.body && (
        <p className="leading-relaxed text-[var(--text-primary)]">
          {node.body}
        </p>
      )}

      {node.bullets && node.bullets.length > 0 && (
        <ul className="space-y-2 border-l-2 border-[var(--gold-accent)]/30 pl-4">
          {node.bullets.map((b, i) => (
            <li key={i} className="text-[var(--text-muted)]">
              {b}
            </li>
          ))}
        </ul>
      )}

      {node.videoPath && (
        <VideoPlaceholder
          src={node.videoPath}
          placeholderLabel="Concept video"
        />
      )}

      {node.audioPath && (
        <div className="rounded border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] p-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-[var(--text-muted)]">
            Audio available
          </p>
          <audio
            src={node.audioPath}
            controls
            className="w-full"
            preload="metadata"
          >
            Your browser does not support audio.
          </audio>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Place voiceover at {node.audioPath}
          </p>
        </div>
      )}
    </motion.div>
  );
}
