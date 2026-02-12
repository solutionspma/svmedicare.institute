"use client";

import { motion } from "framer-motion";

type BadgeProps = {
  label: string;
  icon?: string;
  earned?: boolean;
};

export function Badge({ label, icon = "🏆", earned = false }: BadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
        earned
          ? "border-[var(--gold-accent)] bg-[var(--gold-accent)]/10 text-[var(--gold-accent)]"
          : "border-[var(--border-gold)]/30 text-[var(--text-muted)]"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  );
}
