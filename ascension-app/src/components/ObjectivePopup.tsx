"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ObjectiveContent } from "@/data/objectives-content";

type Props = {
  content: ObjectiveContent;
  onClose: () => void;
};

export function ObjectivePopup({ content, onClose }: Props) {
  const [page, setPage] = useState(0);
  const pages = content.pages;
  const totalPages = pages.length;
  const current = pages[page];
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft" && canPrev) setPage((p) => p - 1);
    if (e.key === "ArrowRight" && canNext) setPage((p) => p + 1);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="objective-popup-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-gold)]/20 px-6 py-4">
          <h2
            id="objective-popup-title"
            className="font-display text-sm uppercase tracking-widest text-[var(--gold-accent)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Learning Objective
          </h2>
          <button
            onClick={onClose}
            className="rounded p-2 text-[var(--text-muted)] hover:bg-[var(--gold-accent)]/10 hover:text-[var(--gold-accent)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Objective title */}
        <div className="border-b border-[var(--border-gold)]/20 px-6 py-3">
          <p className="text-sm font-medium text-[var(--text-primary)]">{content.objective}</p>
        </div>

        {/* Page content */}
        <div className="max-h-[50vh] overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h3 className="font-body text-lg font-semibold text-[var(--text-primary)]">
                {current.title}
              </h3>
              <p className="leading-relaxed text-[var(--text-muted)]">{current.body}</p>
              {current.bullets && current.bullets.length > 0 && (
                <ul className="space-y-2 border-l-2 border-[var(--gold-accent)]/30 pl-4">
                  {current.bullets.map((b, i) => (
                    <li key={i} className="text-[var(--text-muted)]">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {current.keyPoint && (
                <div className="rounded-lg border border-[var(--gold-accent)]/40 bg-[var(--gold-accent)]/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-accent)]">
                    Key point
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">{current.keyPoint}</p>
                </div>
              )}
              {current.callout && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Remember
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-primary)]">{current.callout}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[var(--border-gold)]/20 px-6 py-4">
          <div className="flex gap-1">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === page ? "bg-[var(--gold-accent)]" : "bg-[var(--border-gold)]/40 hover:bg-[var(--gold-accent)]/50"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-muted)]">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!canPrev}
                className="rounded border border-[var(--border-gold)]/50 px-3 py-1.5 text-xs uppercase tracking-wider text-[var(--text-muted)] hover:bg-[var(--gold-accent)]/10 hover:text-[var(--gold-accent)] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--text-muted)]"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!canNext}
                className="rounded border border-[var(--gold-accent)] px-3 py-1.5 text-xs uppercase tracking-wider text-[var(--gold-accent)] hover:bg-[var(--gold-accent)]/10 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
