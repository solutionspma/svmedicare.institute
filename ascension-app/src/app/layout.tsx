import type { Metadata } from "next";
import Image from "next/image";
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
        <header className="sticky top-0 z-50 border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)]/95 backdrop-blur-sm px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <Link
              href="/"
              className="flex flex-col items-center justify-center leading-none"
              aria-label="Go to home"
            >
              <span className="relative block h-44 w-[22rem]">
                <Image
                  src="/SVC-logo.png"
                  alt="SV Custom Quality Insurance Consulting"
                  fill
                  className="object-contain scale-[1.75] drop-shadow-[0_0_1px_rgba(255,255,255,0.86)] drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] drop-shadow-[0_0_11px_rgba(255,255,255,0.3)]"
                  sizes="352px"
                  priority
                />
              </span>
              <span className="-mt-1 block text-center font-display text-xl uppercase tracking-[0.12em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]">
                SV Medicare Institute
              </span>
            </Link>
            <nav
              aria-label="Primary navigation"
              className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]"
            >
              <Link href="/dashboard" className="transition-colors hover:text-[var(--gold-accent)]">
                Dashboard
              </Link>
              <Link href="/training/comply-track" className="transition-colors hover:text-[var(--gold-accent)]">
                ComplyTrack
              </Link>
              <Link href="/training/lis" className="transition-colors hover:text-[var(--gold-accent)]">
                LIS
              </Link>
              <Link href="/events-training" className="transition-colors hover:text-[var(--gold-accent)]">
                Events &amp; Field
              </Link>
              <Link href="/certification" className="transition-colors hover:text-[var(--gold-accent)]">
                Certification
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="shrink-0 border-t border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-6 py-4">
          <nav
            aria-label="Site shortcuts"
            className="mx-auto mb-3 flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]"
          >
            <Link href="/" className="transition-colors hover:text-[var(--gold-accent)]">
              Home
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-[var(--gold-accent)]">
              Command deck
            </Link>
            <Link href="/training/comply-track" className="transition-colors hover:text-[var(--gold-accent)]">
              ComplyTrack
            </Link>
            <Link href="/training/lis" className="transition-colors hover:text-[var(--gold-accent)]">
              LIS / Extra Help
            </Link>
            <Link href="/events-training" className="transition-colors hover:text-[var(--gold-accent)]">
              Events &amp; field
            </Link>
            <Link href="/certification" className="transition-colors hover:text-[var(--gold-accent)]">
              Certification
            </Link>
          </nav>
          <p className="mx-auto max-w-6xl text-center text-sm text-[var(--text-muted)]">
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
