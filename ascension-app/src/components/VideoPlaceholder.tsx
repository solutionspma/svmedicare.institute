"use client";

import { motion } from "framer-motion";

type VideoPlaceholderProps = {
  /** Path to ElevenLabs-generated video (e.g. /assets/elevenlabs/module-1-intro.mp4) */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Caption shown below */
  caption?: string;
  /** Character/scene description for when no video exists yet */
  placeholderLabel?: string;
};

/**
 * Placeholder for ElevenLabs character/scene video.
 * Replace src with your ElevenLabs export when ready.
 */
export function VideoPlaceholder({
  src,
  alt = "Training video",
  caption,
  placeholderLabel = "Video coming soon — create with ElevenLabs",
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
            <p className="text-sm text-[var(--text-muted)]">
              {placeholderLabel}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]/70">
              Drop your ElevenLabs export in /public/assets/elevenlabs/
            </p>
          </div>
        </div>
      )}
      {caption && (
        <p className="border-t border-[var(--border-gold)]/20 bg-black/20 px-4 py-2 text-sm text-[var(--text-muted)]">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
