import Link from "next/link";
import type { ReactNode } from "react";
import { EventsFieldSubnav } from "./EventsFieldSubnav";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function EventsFieldPageShell({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)] transition-opacity hover:opacity-90"
            >
              ← Home
            </Link>
            <Link
              href="/dashboard"
              className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
            >
              Command deck
            </Link>
          </div>
          <p className="mt-3 font-display text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
            Events &amp; Field Compliance
          </p>
          <h1 className="mt-1 font-display text-2xl uppercase tracking-[0.06em] sm:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">{subtitle}</p> : null}
          <div className="mt-6">
            <EventsFieldSubnav />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
