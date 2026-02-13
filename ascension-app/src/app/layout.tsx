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
