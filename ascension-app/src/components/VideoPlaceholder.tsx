"use client";

import { motion } from "framer-motion";

type VideoPlaceholderProps = {
  src?: string;
  alt?: string;
  placeholderLabel?: string;
};

export function VideoPlaceholder({
  src,
  alt = "Training video",
  placeholderLabel = "Video coming soon",
}: VideoPlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8 overflow-hidden rounded-lg border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]"
    >
      {src ? (
        <video
          src={src}
          controls
          className="w-full"
          poster=""
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-black/40">
          <div className="text-center">
            <div className="mb-3 text-4xl">🎬</div>
            <p className="text-sm text-[var(--text-muted)]">{placeholderLabel}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
