"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  complianceForType,
  eventTrainingHubData,
} from "@/lib/eventsField/eventTrainingHub";

type ModuleData = { title: string; subtitle: string };

const modules: ModuleData[] = [
  { title: "CMS Event Overview", subtitle: "What counts as a marketing event" },
  { title: "Community Events", subtitle: "Health fairs, senior centers, education" },
  { title: "Retail Booths", subtitle: "In-store kiosk compliance & scripts" },
  { title: "Carrier Events", subtitle: "Co-branded forums & addenda rules" },
  { title: "Self-Hosted Events", subtitle: "Your event, your full responsibility" },
  { title: "Event Checklist", subtitle: "Before, during, and after" },
  { title: "Knowledge Check", subtitle: "80% required passing score" },
  { title: "Completion Script", subtitle: "Field-ready language & next steps" },
];

const eventTypeIds = ["community", "retail", "carrier", "self_hosted"];

export function EventsTrainingModuleClient() {
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const savedActive = localStorage.getItem("evtActive");
    const savedComplete = localStorage.getItem("evtComplete");
    if (savedActive) setActive(Number(savedActive));
    if (savedComplete) setCompleted(JSON.parse(savedComplete));
  }, []);

  useEffect(() => { localStorage.setItem("evtActive", String(active)); }, [active]);
  useEffect(() => { localStorage.setItem("evtComplete", JSON.stringify(completed)); }, [completed]);

  const markComplete = useCallback(() => {
    if (!completed.includes(active)) setCompleted((c) => [...c, active]);
  }, [active, completed]);

  const goModule = (idx: number) => {
    setActive(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gradeQuiz = () => {
    const answers: Record<string, string> = { q1: "b", q2: "c", q3: "a", q4: "b", q5: "c" };
    let correct = 0;
    Object.entries(answers).forEach(([name, answer]) => {
      const el = document.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement | null;
      if (el?.value === answer) correct++;
    });
    const score = Math.round((correct / 5) * 100);
    const box = document.getElementById("evt-scorebox") as HTMLDivElement | null;
    if (box) {
      box.style.display = "block";
      box.className = "mt-4 rounded-xl border p-4 text-center font-bold " + (score >= 80
        ? "border-green-500/40 bg-green-900/30 text-green-300"
        : "border-red-500/40 bg-red-900/30 text-red-300");
      box.textContent = score >= 80
        ? "Passed: " + score + "%. Knowledge check complete."
        : "Score: " + score + "%. Review the module and try again.";
    }
    if (score >= 80 && !completed.includes(6)) setCompleted((c) => [...c, 6]);
  };

  const pct = Math.round((completed.length / modules.length) * 100);

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      {/* Page Header */}
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-[var(--border-gold)]/35 bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-matte)] px-2 py-1.5 transition-colors hover:border-[var(--gold-accent)]/65"
              aria-label="Go to home"
            >
              <span className="relative h-8 w-8 overflow-hidden rounded-md border border-[var(--border-gold)]/35 bg-[#0f2f63]">
                <Image
                  src="/SVC-logo.png"
                  alt="SV Custom Quality Insurance Consulting"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </span>
              <span className="font-display text-[10px] uppercase tracking-[0.2em] text-[var(--gold-accent)]">
                SVC Home
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold-accent)]"
            >
              Command deck
            </Link>
          </div>
          <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
            CMS-Regulated Marketing Training
          </p>
          <h1 className="mt-1 font-display text-3xl uppercase tracking-[0.06em] sm:text-4xl">
            Events &amp; Field Compliance
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Sequential training on CMS-compliant marketing events — from community health fairs to self-hosted enrollment sessions.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/events-calendar"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] transition-colors hover:bg-[var(--accent-primary)]/20"
            >
              📅 View Events Calendar
            </Link>
            <Link
              href="/schedule-event"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-gold)]/40 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-[var(--accent-primary)]"
            >
              + Request Event Spot
            </Link>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full bg-gradient-to-b from-[var(--bg-primary)] to-[#0a1628] px-4 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:overflow-auto lg:px-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-white/20 bg-[#0f2f63]">
              <Image
                src="/SVC-logo.png"
                alt="SV Custom Quality Insurance Consulting"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <p className="font-display font-bold text-white">SV Medicare Institute</p>
              <p className="text-xs text-[#b9c7dc]">Events &amp; Field Training</p>
            </div>
          </div>

          <div className="mb-6 rounded-3xl border border-white/12 bg-white/8 p-3.5">
            <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-gradient-to-r from-[#d99b20] to-[#fff0a6] transition-all duration-250"
                style={{ width: pct + "%" }}
              />
            </div>
            <p className="mt-2.5 text-[10px] leading-relaxed text-[#d7e5fb]">
              {pct}% complete &bull; {completed.length}/{modules.length} sections checked off
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {modules.map((m, i) => (
              <button
                key={i}
                onClick={() => goModule(i)}
                className={"text-left rounded-2xl px-3 py-3 transition-colors " +
                  (i === active ? "bg-white/16 " : "bg-white/6 hover:bg-white/12 ") +
                  (completed.includes(i) ? "border border-[var(--success)]/40" : "")}
              >
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white/38 text-[10px] font-bold text-white/90">
                    {completed.includes(i) ? "✓" : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[11px] font-black uppercase tracking-wider text-[#dbe7f7]">{m.title}</p>
                    <p className="mt-0.5 text-[10px] leading-tight text-[#b8c8dc]">{m.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </nav>

          <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
            <Link
              href="/events-calendar"
              className="flex items-center gap-2 rounded-xl bg-white/6 px-3 py-2.5 text-[11px] text-[#b9c7dc] transition-colors hover:bg-white/12 hover:text-white"
            >
              <span>📅</span> Events Calendar
            </Link>
            <Link
              href="/schedule-event"
              className="flex items-center gap-2 rounded-xl bg-white/6 px-3 py-2.5 text-[11px] text-[#b9c7dc] transition-colors hover:bg-white/12 hover:text-white"
            >
              <span>+</span> Request Event Spot
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:py-10">
          <div className="mx-auto max-w-2xl">

            {/* Module 0: CMS Event Overview */}
            {active === 0 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">1. CMS Marketing Event Overview</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    CMS regulates how Medicare agents may conduct public-facing events where Medicare products are discussed or sold. Understanding which rules apply to your event type is the first compliance requirement.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      { title: "Marketing events", body: "Any event where plan-specific benefits, premiums, or enrollment options are discussed with prospective enrollees." },
                      { title: "Educational events", body: "Events restricted to general Medicare education only — no plan-specific details, no enrollment, no SOA capture for sales." },
                      { title: "Your responsibility", body: "Regardless of event type, agents are personally responsible for compliance at events they attend or host." },
                    ].map((c) => (
                      <div key={c.title} className="rounded-xl border border-[var(--border-subtle)] bg-black/20 p-3">
                        <p className="font-display text-[10px] font-black uppercase text-[var(--accent-primary)]">{c.title}</p>
                        <p className="mt-2 text-[13px] leading-tight text-[var(--text-secondary)]">{c.body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-lg border-l-4 border-[#d99b20] bg-[#fff8e7] p-4">
                    <p className="text-[11px] font-bold text-[#7a4b00]">
                      <strong>Key rule:</strong> If you distribute plan-specific materials or discuss plan benefits with prospective enrollees, CMS treats the event as a marketing event regardless of what you call it.
                    </p>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-display text-sm font-black uppercase">The four event types covered in this module:</h3>
                    <ul className="mt-3 space-y-2">
                      {eventTrainingHubData.eventTypes.map((t) => (
                        <li key={t.id} className="flex gap-2 text-[13px] text-[var(--text-secondary)]">
                          <span className="mt-0.5 text-[var(--accent-primary)]">•</span>
                          <span><strong className="text-[var(--text-primary)]">{t.title}</strong> — {t.summary}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Modules 1–4: Event Types */}
            {active >= 1 && active <= 4 && (() => {
              const typeId = eventTypeIds[active - 1];
              const type = eventTrainingHubData.eventTypes.find((t) => t.id === typeId);
              const block = complianceForType(typeId);
              const scenarios = eventTrainingHubData.scenarios.filter((s) => s.eventTypeId === typeId);
              if (!type || !block) return null;
              return (
                <section className="space-y-6">
                  <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                    <h2 className="font-display text-2xl font-black">{active + 1}. {type.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{type.summary}</p>
                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-lg border border-[var(--success)]/40 bg-[var(--success-bg,#0d2b1a)] p-4">
                        <h4 className="font-display text-[10px] font-black uppercase tracking-wider text-[var(--success)]">Allowed actions</h4>
                        <ul className="mt-3 space-y-2 text-[13px] text-[var(--text-secondary)]">
                          {block.allowed.map((x, i) => <li key={i} className="flex gap-2"><span className="mt-0.5 text-[var(--success)]">✓</span><span>{x}</span></li>)}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-[var(--danger)]/40 bg-[var(--danger-bg,#2b0d0d)] p-4">
                        <h4 className="font-display text-[10px] font-black uppercase tracking-wider text-[var(--danger)]">Prohibited actions</h4>
                        <ul className="mt-3 space-y-2 text-[13px] text-[var(--text-secondary)]">
                          {block.prohibited.map((x, i) => <li key={i} className="flex gap-2"><span className="mt-0.5 text-[var(--danger)]">✕</span><span>{x}</span></li>)}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-[var(--border-subtle)] bg-black/20 p-4">
                        <h4 className="font-display text-[10px] font-black uppercase tracking-wider text-[var(--accent-primary)]">Required disclaimers</h4>
                        <ul className="mt-3 space-y-2 text-[13px] text-[var(--text-secondary)]">
                          {block.disclaimers.map((x, i) => <li key={i} className="flex gap-2"><span className="mt-0.5 text-[var(--accent-primary)]">•</span><span>{x}</span></li>)}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-[var(--border-subtle)] bg-black/20 p-4">
                        <h4 className="font-display text-[10px] font-black uppercase tracking-wider text-[var(--accent-primary)]">SOA rules</h4>
                        <ul className="mt-3 space-y-2 text-[13px] text-[var(--text-secondary)]">
                          {block.soaRules.map((x, i) => <li key={i} className="flex gap-2"><span className="mt-0.5 text-[var(--accent-primary)]">•</span><span>{x}</span></li>)}
                        </ul>
                      </div>
                    </div>
                    {scenarios.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-display text-sm font-black uppercase">Practice scenario</h3>
                        {scenarios.map((s) => (
                          <div key={s.id} className="mt-3 rounded-lg border border-[var(--border-gold)]/30 bg-black/30 p-4">
                            <p className="font-medium text-[var(--text-primary)]">{s.title}</p>
                            <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)]">{s.instructions}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );
            })()}

            {/* Module 5: Event Checklist */}
            {active === 5 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">6. Event Checklist</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Use this checklist for every CMS-regulated event you attend or host. Document completion for your audit trail.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {(["before", "during", "after"] as const).map((phase) => (
                      <div key={phase} className="rounded-lg border border-[var(--border-subtle)] bg-black/20 p-4">
                        <h4 className="font-display text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">{phase}</h4>
                        <ul className="mt-3 space-y-2">
                          {eventTrainingHubData.checklist[phase].map((item, i) => (
                            <li key={i} className="flex gap-2 text-[13px] text-[var(--text-muted)]">
                              <span className="mt-1.5 h-3 w-3 shrink-0 rounded border border-[var(--border-gold)]/50 bg-black/30" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-lg border-l-4 border-[var(--accent-primary)] bg-[#eef6ff] p-4">
                    <p className="text-[11px] font-bold text-[#1e4f7a]">
                      <strong>Retention:</strong> Event documentation — sign-in sheets, SOA records, material version IDs, and incident logs — must be retained per CMS and carrier requirements.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Module 6: Knowledge Check */}
            {active === 6 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">7. Knowledge Check</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">Answer each question. Passing score: 80%.</p>
                  <div className="mt-6 space-y-4">
                    {[
                      { q: "1. If you distribute plan-specific materials at a health fair, CMS treats the event as:", name: "q1", options: [{ v: "a", t: "Educational only" }, { v: "b", t: "A marketing event" }, { v: "c", t: "A carrier event by default" }] },
                      { q: "2. Which action is prohibited at any CMS-regulated event?", name: "q2", options: [{ v: "a", t: "Collecting permission to contact after full disclosures" }, { v: "b", t: "Scheduling a follow-up appointment" }, { v: "c", t: "Offering cash or gift cards conditioned on enrollment" }] },
                      { q: "3. At a retail booth, what must you obtain before plan-specific recommendations?", name: "q3", options: [{ v: "a", t: "Explicit scope of appointment" }, { v: "b", t: "Carrier approval only" }, { v: "c", t: "Nothing — retail is pre-approved" }] },
                      { q: "4. If a carrier speaker runs over time and compresses your schedule, you should:", name: "q4", options: [{ v: "a", t: "Proceed without disclosures since carrier is present" }, { v: "b", t: "Still deliver required disclosures before one-on-one sessions" }, { v: "c", t: "Skip to enrollment since attendees already consented by attending" }] },
                      { q: "5. Does self-hosting an event relax cold-call rules for post-event follow-up?", name: "q5", options: [{ v: "a", t: "Yes, attendees gave implied consent" }, { v: "b", t: "Only for attendees who signed in" }, { v: "c", t: "No — you still must verify permission chains" }] },
                    ].map((item) => (
                      <div key={item.name} className="rounded-2xl border border-[var(--border-gold)]/30 bg-black/20 p-4">
                        <p className="font-display font-black text-[var(--text-primary)]">{item.q}</p>
                        <div className="mt-3 space-y-2">
                          {item.options.map((opt) => (
                            <label key={opt.v} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-white/5 p-2 transition-colors hover:bg-white/8">
                              <input type="radio" name={item.name} value={opt.v} className="h-4 w-4" />
                              <span className="text-sm text-[var(--text-secondary)]">{opt.t}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={gradeQuiz}
                    className="mt-6 w-full rounded-lg bg-[var(--accent-primary)] px-4 py-2 font-display font-black uppercase text-[var(--bg-primary)] transition-opacity hover:opacity-90"
                  >
                    Grade Knowledge Check
                  </button>
                  <div id="evt-scorebox" style={{ display: "none" }} />
                </div>
              </section>
            )}

            {/* Module 7: Completion */}
            {active === 7 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">8. Completion &amp; Field Script</h2>
                  <div className="mt-6 rounded-lg border-l-4 border-[var(--accent-primary)] bg-[#eef6ff] p-4">
                    <p className="font-display text-[10px] font-black uppercase text-[#1e4f7a]">Certified field script — event introduction:</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#1e4f7a]">
                      &ldquo;Thank you for joining us today. I am a licensed insurance agent — not affiliated with or endorsed by Medicare or the federal government. Today we will cover general Medicare information. Plan availability, benefits, premiums, and networks vary. We do not offer every plan available. If you would like to discuss specific plan options, I&rsquo;ll need to complete a scope of appointment with you first so we can schedule a private follow-up.&rdquo;
                    </p>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-display text-sm font-black uppercase">Before every event, confirm:</h3>
                    <ul className="mt-3 space-y-2 text-[13px] text-[var(--text-secondary)]">
                      {["Materials versioned and compliance-reviewed.", "Licensing and appointment numbers current for the venue state.", "SOA process documented for any sales conversations.", "Incident log template accessible.", "Carrier or FMO event addendum reviewed if applicable."].map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-0.5 text-[var(--accent-primary)]">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Link
                      href="/events-calendar"
                      className="flex flex-col gap-1 rounded-xl border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 p-4 transition-colors hover:bg-[var(--accent-primary)]/20"
                    >
                      <p className="font-display text-[10px] font-black uppercase tracking-wider text-[var(--accent-primary)]">📅 Events Calendar</p>
                      <p className="text-[13px] text-[var(--text-muted)]">View all upcoming community and carrier events.</p>
                    </Link>
                    <Link
                      href="/schedule-event"
                      className="flex flex-col gap-1 rounded-xl border border-[var(--border-gold)]/40 bg-white/5 p-4 transition-colors hover:bg-white/10"
                    >
                      <p className="font-display text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">+ Request Event Spot</p>
                      <p className="text-[13px] text-[var(--text-muted)]">Submit a request to host or attend a field event.</p>
                    </Link>
                  </div>
                  <p className="mt-6 text-[11px] text-[var(--text-muted)]">
                    Internal training module. Validate against current CMS, carrier, and state guidance before live agent deployment.
                  </p>
                </div>
              </section>
            )}

            {/* Navigation */}
            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                onClick={() => goModule(Math.max(0, active - 1))}
                className="rounded-lg bg-white/8 px-4 py-2 font-display text-sm font-black uppercase text-[var(--text-muted)] transition-colors hover:bg-white/12 hover:text-[var(--accent-primary)]"
              >
                ← Previous
              </button>
              <button
                onClick={markComplete}
                className="rounded-lg bg-[var(--success)] px-4 py-2 font-display text-sm font-black uppercase text-[var(--bg-primary)] transition-opacity hover:opacity-90"
              >
                Mark Section Complete
              </button>
              <button
                onClick={() => goModule(Math.min(modules.length - 1, active + 1))}
                className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 font-display text-sm font-black uppercase text-[var(--bg-primary)] transition-opacity hover:opacity-90"
              >
                Next →
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
