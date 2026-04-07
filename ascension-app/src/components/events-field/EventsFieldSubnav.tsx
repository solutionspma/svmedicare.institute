"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/events-training", label: "Event Training" },
  { href: "/events-calendar", label: "Events Calendar" },
  { href: "/schedule-event", label: "Schedule an Event" },
] as const;

export function EventsFieldSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Events and field compliance"
      className="flex flex-wrap gap-2 border-b border-[var(--border-gold)]/25 pb-4 md:gap-3"
    >
      {LINKS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors md:text-[11px] ${
              active
                ? "bg-[var(--gold-accent)]/15 text-[var(--gold-accent)] ring-1 ring-[var(--gold-accent)]/35"
                : "text-[var(--text-muted)] hover:bg-black/30 hover:text-[var(--text-primary)]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
