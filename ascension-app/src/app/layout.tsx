import type { Metadata } from "next";
import Link from "next/link";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SV Medicare Institute — Ascension Mode",
  description:
    "Knowledge. Confidence. Excellence. Elite Medicare training for healthcare and insurance professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} antialiased font-sans flex min-h-screen flex-col`}
      >
        <div className="flex-1">{children}</div>
        <footer className="shrink-0 border-t border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
          <nav
            aria-label="Site shortcuts"
            className="mx-auto mb-3 flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]"
          >
            <Link href="/" className="transition-colors hover:text-[var(--gold-accent)]">
              Home
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-[var(--gold-accent)]">
              Command deck
            </Link>
            <Link href="/training/comply-track" className="text-[var(--gold-accent)]/90 transition-colors hover:text-[var(--gold-accent)]">
              ComplyTrack
            </Link>
            <Link href="/events-training" className="transition-colors hover:text-[var(--gold-accent)]">
              Events &amp; field
            </Link>
            <Link href="/certification" className="transition-colors hover:text-[var(--gold-accent)]">
              Certification
            </Link>
          </nav>
          <p className="mx-auto max-w-6xl text-center text-xs text-[var(--text-muted)]">
            SV Medicare Institute is designed, built, and powered by{" "}
            <Link
              href="https://pitchmarketing.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--gold-accent)] underline decoration-[var(--gold-accent)]/50 underline-offset-2 transition-colors hover:text-[var(--gold-accent)] hover:decoration-[var(--gold-accent)]"
            >
              Pitch Market Strategies &amp; Public Relations LLC
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
