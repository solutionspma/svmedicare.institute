"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ModuleData = [title: string, subtitle: string];

const modules: ModuleData[] = [
  ["Program Overview", "What LIS is and how to explain it"],
  ["Automatic Qualification", "Medicaid, MSP, SSI pathways"],
  ["2026 Screening Limits", "Income, resources, exclusions"],
  ["2026 Cost Sharing", "Deductibles, copays, OOP threshold"],
  ["Application Process", "SSA, reapplication, LI NET"],
  ["Compliance Rules", "What agents can and cannot say"],
  ["Knowledge Check", "80% required passing score"],
  ["Completion Script", "Field-ready compliant language"],
];

export function LISTrainingClient() {
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, boolean>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const savedActive = localStorage.getItem("lisActive");
    const savedComplete = localStorage.getItem("lisComplete");
    if (savedActive) setActive(Number(savedActive));
    if (savedComplete) setCompleted(JSON.parse(savedComplete));
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("lisActive", String(active));
  }, [active]);

  useEffect(() => {
    localStorage.setItem("lisComplete", JSON.stringify(completed));
  }, [completed]);

  const markComplete = useCallback(() => {
    if (!completed.includes(active)) {
      setCompleted([...completed, active]);
    }
  }, [active, completed]);

  const goModule = (idx: number) => {
    setActive(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextModule = () => {
    const next = Math.min(modules.length - 1, active + 1);
    goModule(next);
  };

  const prevModule = () => {
    const prev = Math.max(0, active - 1);
    goModule(prev);
  };

  const gradeQuiz = () => {
    const questions = [
      { name: "q1", answer: "b" },
      { name: "q2", answer: "c" },
      { name: "q3", answer: "a" },
      { name: "q4", answer: "b" },
      { name: "q5", answer: "c" },
    ];

    let correct = 0;
    questions.forEach(({ name, answer }) => {
      const selected = document.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement;
      if (selected && selected.value === answer) correct++;
    });

    const score = Math.round((correct / questions.length) * 100);
    const isPassing = score >= 80;

    setQuizScores({ score: isPassing, passed: isPassing });

    const scorebox = document.getElementById("scorebox") as HTMLDivElement;
    if (scorebox) {
      scorebox.className = `scorebox ${isPassing ? "pass" : "fail"}`;
      scorebox.textContent = isPassing
        ? `Passed: ${score}%. Knowledge check complete.`
        : `Score: ${score}%. Review the module and try again.`;
      scorebox.style.display = "block";
    }

    if (isPassing && !completed.includes(6)) {
      setCompleted([...completed, 6]);
    }
  };

  const pct = Math.round((completed.length / modules.length) * 100);

  return (
    <div className="min-h-screen bg-[var(--bg-matte)] text-[var(--text-primary)]">
      {/* Top Navigation Header */}
      <header className="border-b border-[var(--border-gold)]/20 bg-[var(--bg-matte-elevated)] px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-3">
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
            <nav className="flex flex-wrap gap-4 text-[10px] uppercase tracking-wider">
              <Link
                href="/training/comply-track"
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                ComplyTrack
              </Link>
              <Link
                href="/training/lis"
                className="text-[var(--gold-accent)] transition-colors hover:text-[var(--gold-accent)]"
              >
                LIS / Extra Help
              </Link>
              <Link
                href="/events-training"
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--gold-accent)]"
              >
                Events &amp; Field
              </Link>
            </nav>
          </div>
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
              2026 Compliant Training Module
            </p>
            <h1 className="mt-1 font-display text-2xl uppercase tracking-[0.06em] sm:text-3xl">
              Low-Income Subsidy (LIS) / Extra Help
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
              Train agents to explain Extra Help accurately, identify who qualifies, avoid overpromising benefits, and route beneficiaries to official application channels.
            </p>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full bg-gradient-to-b from-[var(--bg-primary)] to-[#0a1628] px-4 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:overflow-auto lg:px-6">
          <div className="mb-6 flex items-center gap-3 lg:mb-8">
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
              <p className="text-xs text-[#b9c7dc]">LIS / Extra Help Training</p>
            </div>
          </div>

          <div className="mb-6 rounded-3xl border border-white/12 bg-white/8 p-3.5 lg:mb-8">
            <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-gradient-to-r from-[#d99b20] to-[#fff0a6] transition-all duration-250"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2.5 text-[10px] leading-relaxed text-[#d7e5fb]">
              {pct}% complete • {completed.length}/{modules.length} sections checked off
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {modules.map((m, i) => (
              <button
                key={i}
                onClick={() => goModule(i)}
                className={`text-left rounded-2xl px-3 py-3 transition-colors ${
                  i === active ? "bg-white/16" : "bg-white/6 hover:bg-white/12"
                } ${completed.includes(i) ? "border border-[var(--success)]/40" : ""}`}
              >
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white/38 text-[10px] font-bold text-white/90">
                    {completed.includes(i) ? "✓" : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[11px] font-black uppercase tracking-wider text-[#dbe7f7]">
                      {m[0]}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-[#b8c8dc]">{m[1]}</p>
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:py-10">
          <div className="mx-auto max-w-2xl">
            {/* Hero */}
            {active === -1 && (
              <section className="mb-6 rounded-3xl border border-[var(--border-gold)]/40 bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-sm">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f0d28d] bg-[#fff6df] px-2.5 py-1 text-[10px] font-black text-[#7a4b00]">
                  2026 COMPLIANT TRAINING MODULE
                </div>
                <h1 className="font-display text-4xl font-black text-white">
                  Low-Income Subsidy (LIS) / Extra Help
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  This module trains agents to explain Extra Help accurately, identify who may qualify, avoid overpromising benefits, and route beneficiaries to the proper official application channels.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Part D", "Extra Help", "LIS", "CMS / Medicare / SSA", "Agent Compliance"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1 text-[10px] font-bold text-[var(--accent-primary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Module 0: Program Overview */}
            {active === 0 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">1. Program Overview</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    <strong>Extra Help</strong>, also called the <strong>Low-Income Subsidy (LIS)</strong>, is a Medicare program that helps people with limited income and resources pay Medicare Part D drug coverage costs. It may help with premiums, deductibles, copays/coinsurance, and the Part D late enrollment penalty.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-black/20 p-3">
                      <p className="font-display text-[10px] font-black uppercase text-[var(--accent-primary)]">
                        What it helps with
                      </p>
                      <p className="mt-2 text-[13px] leading-tight text-[var(--text-secondary)]">
                        Part D premium, deductible, covered-drug cost sharing, and late enrollment penalty.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-black/20 p-3">
                      <p className="font-display text-[10px] font-black uppercase text-[var(--accent-primary)]">
                        What it is not
                      </p>
                      <p className="mt-2 text-[13px] leading-tight text-[var(--text-secondary)]">
                        It is not Medicaid by itself, not a Medicare Advantage plan, and not permission to ignore formulary/network rules.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-black/20 p-3">
                      <p className="font-display text-[10px] font-black uppercase text-[var(--accent-primary)]">
                        Agent posture
                      </p>
                      <p className="mt-2 text-[13px] leading-tight text-[var(--text-secondary)]">
                        Educate, screen, document, and direct to official channels. Do not guarantee approval.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-lg border-l-4 border-[#d99b20] bg-[#fff8e7] p-4">
                    <p className="text-[11px] font-bold text-[#7a4b00]">
                      <strong>Training note:</strong> Older or simplified field charts may still use "Full Benefit" and "Semi Benefit" language. For 2026 training, teach agents to verify benefits using current CMS/Medicare/SSA rules and plan systems.
                    </p>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-display text-sm font-black uppercase">Agent talk track</h3>
                    <p className="mt-2 rounded-lg border border-[var(--border-gold)]/30 bg-black/30 p-3 text-[13px] italic text-[var(--text-secondary)]">
                      "Extra Help is a Medicare program that may reduce your Part D drug costs if you meet income and resource guidelines. Some people get it automatically, and others can apply through Social Security."
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Module 1: Automatic Qualification */}
            {active === 1 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">2. Who Gets Extra Help Automatically?</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    A beneficiary may receive Extra Help automatically when they already receive certain assistance.
                  </p>
                  <table className="mt-6 w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-gold)]/25 bg-[#16345c]">
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">Automatic pathway</th>
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">What it means for the agent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "Full Medicaid coverage",
                          "Do not ask them to re-prove eligibility in a sales conversation. Verify status through approved tools.",
                        ],
                        [
                          "State help paying Part B premium through an MSP",
                          "MSP enrollment generally triggers Extra Help.",
                        ],
                        [
                          "SSI payments from Social Security",
                          "SSI can trigger automatic Extra Help even if the person does not have Medicaid.",
                        ],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-[var(--border-gold)]/10">
                          <td className="px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[0]}</td>
                          <td className="px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 rounded-lg border-l-4 border-[var(--accent-primary)] bg-[#eef6ff] p-4">
                    <p className="text-[11px] font-bold text-[#1e4f7a]">
                      <strong>Best practice:</strong> If a prospect says they have Medicaid, QMB, SLMB, QI, or SSI, pause and verify before discussing plan affordability. Their Part D cost-sharing may be materially different.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Module 2: 2026 Screening Limits */}
            {active === 2 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">3. 2026 Income and Resource Screening</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    For 2026, Medicare lists the general Extra Help screening limits below for the 50 states and District of Columbia. Limits are higher in Alaska and Hawaii.
                  </p>
                  <table className="mt-6 w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-gold)]/25 bg-[#16345c]">
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">Situation</th>
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">Annual income limit</th>
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">Resource limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Individual", "$23,940", "$18,090"],
                        ["Married couple", "$32,460", "$36,100"],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-[var(--border-gold)]/10">
                          <td className="px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[0]}</td>
                          <td className="px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[1]}</td>
                          <td className="px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6">
                    <h3 className="font-display text-sm font-black uppercase">Resources that generally count</h3>
                    <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
                      Checking, savings, retirement accounts, stocks, bonds, and other liquid resources that can be converted to cash.
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-display text-sm font-black uppercase">Resources that generally do not count</h3>
                    <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
                      Primary home, personal items, one car, burial plots, up to $1,500 set aside for burial expenses per person, furniture, and household/personal items.
                    </p>
                  </div>
                  <div className="mt-6 rounded-lg border-l-4 border-[#e74c3c] bg-[#fff1f0] p-4">
                    <p className="text-[11px] font-bold text-[#912018]">
                      <strong>Compliance guardrail:</strong> Agents should not tell a beneficiary to move, hide, give away, or restructure resources to qualify. That crosses the line fast. Refer them to SSA, SHIP, Medicaid office, or a qualified advisor.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Module 3: 2026 Cost Sharing */}
            {active === 3 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">4. 2026 Cost Sharing and Benefit Levels</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    For 2026, Extra Help reduces Part D costs. Most LIS beneficiaries have a $0 deductible and capped copays for covered drugs at participating pharmacies.
                  </p>
                  <table className="mt-6 w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-gold)]/25 bg-[#16345c]">
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">LIS category</th>
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">Deductible</th>
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">Generic copay</th>
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">Brand copay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Institutionalized or receiving home/community-based services", "$0", "$0", "$0"],
                        ["Full-benefit dual eligible, income ≤ 100% FPL", "$0", "$1.60", "$4.90"],
                        [
                          "Income between 100% and 150% FPL, MSP/SSI-only, or applied/eligible under LIS resource rules",
                          "$0",
                          "$5.10",
                          "$12.65",
                        ],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-[var(--border-gold)]/10">
                          <td className="px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[0]}</td>
                          <td className="px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[1]}</td>
                          <td className="px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[2]}</td>
                          <td className="px-3 py-3 text-[13px] text-[var(--text-secondary)]">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 rounded-lg border-l-4 border-[var(--accent-primary)] bg-[#eef6ff] p-4">
                    <p className="text-[11px] font-bold text-[#1e4f7a]">
                      <strong>2026 OOP threshold:</strong> Once total drug costs reach $2,100, the beneficiary pays $0 for covered Part D drugs for the rest of the year.
                    </p>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-display text-sm font-black uppercase">Field explanation</h3>
                    <p className="mt-2 rounded-lg border border-[var(--border-gold)]/30 bg-black/30 p-3 text-[13px] italic text-[var(--text-secondary)]">
                      "Your exact copay depends on your LIS level, the drug, whether it is covered by the plan, and whether the pharmacy is in the plan's network."
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Module 4: Application Process */}
            {active === 4 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">5. Applying, Reapplying, and LI NET</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    People who do not get Extra Help automatically can apply through Social Security. They can apply before or after enrolling in Part D, and can reapply if income or resources change.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-black/20 p-3">
                      <p className="font-display text-[10px] font-black uppercase text-[var(--accent-primary)]">
                        Prepare documents
                      </p>
                      <p className="mt-2 text-[13px] leading-tight text-[var(--text-secondary)]">
                        Bank statements, tax returns, IRA/401(k) balances, pension, veterans benefits, annuities, and Railroad Retirement information.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-black/20 p-3">
                      <p className="font-display text-[10px] font-black uppercase text-[var(--accent-primary)]">
                        Apply through SSA
                      </p>
                      <p className="mt-2 text-[13px] leading-tight text-[var(--text-secondary)]">
                        Online, by phone, or by appointment. Agents may help explain the process but should not misrepresent eligibility.
                      </p>
                    </div>
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-black/20 p-3">
                      <p className="font-display text-[10px] font-black uppercase text-[var(--accent-primary)]">
                        LI NET
                      </p>
                      <p className="mt-2 text-[13px] leading-tight text-[var(--text-secondary)]">
                        Temporary Part D coverage may help people who qualify for Extra Help but are not yet enrolled in a Part D plan.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-lg border-l-4 border-[#d99b20] bg-[#fff8e7] p-4">
                    <p className="text-[11px] font-bold text-[#7a4b00]">
                      <strong>Do not say:</strong> "You are approved." <br />
                      <strong>Say:</strong> "You may qualify. Social Security or the appropriate agency makes the final determination."
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Module 5: Compliance Rules */}
            {active === 5 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">6. Agent Compliance Rules</h2>
                  <table className="mt-6 w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-gold)]/25 bg-[#16345c]">
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">Do</th>
                        <th className="px-3 py-3 text-left text-[11px] font-bold text-white">Do not</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "Use official Medicare, CMS, SSA, state Medicaid, and approved carrier materials.",
                          "Invent benefit amounts or use outdated copays without verifying the plan year.",
                        ],
                        [
                          "Explain that Extra Help works with Part D drug coverage.",
                          "Imply LIS pays non-Part-D medical costs.",
                        ],
                        [
                          "Screen for Medicaid, MSP, SSI, income, and resources.",
                          "Guarantee approval or tell someone they 'definitely qualify.'",
                        ],
                        [
                          "Document the conversation and the source used.",
                          "Pressure a beneficiary to switch plans just because they may have LIS.",
                        ],
                        [
                          "Verify formulary, pharmacy, premium, and drug costs before recommending a plan.",
                          "Assume $0 premium means every plan is free or best for the client.",
                        ],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-[var(--border-gold)]/10">
                          <td className="px-3 py-3 text-[13px] text-[var(--success)]">{row[0]}</td>
                          <td className="px-3 py-3 text-[13px] text-[var(--danger)]">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 rounded-lg border-l-4 border-[#e74c3c] bg-[#fff1f0] p-4">
                    <p className="text-[11px] font-bold text-[#912018]">
                      <strong>Golden rule:</strong> LIS can change affordability, but it does not erase suitability, formulary review, network review, or permission-to-contact rules.
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
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Answer each question. Passing score: 80%.
                  </p>

                  <form id="quiz" className="mt-6 space-y-4">
                    {[
                      {
                        q: "1. Extra Help primarily helps with what?",
                        answer: "b",
                        options: [
                          { value: "a", text: "Dental, vision, and hearing allowances" },
                          {
                            value: "b",
                            text: "Medicare Part D premiums, deductibles, copays/coinsurance, and late enrollment penalty",
                          },
                          { value: "c", text: "Part B IRMAA only" },
                        ],
                      },
                      {
                        q: "2. Which person may get Extra Help automatically?",
                        answer: "c",
                        options: [
                          { value: "a", text: "Anyone age 65" },
                          { value: "b", text: "Anyone enrolled in Medicare Advantage" },
                          { value: "c", text: "Someone with Medicaid, MSP help, or SSI" },
                        ],
                      },
                      {
                        q: "3. For 2026, what is the general individual resource limit commonly shown by Medicare for Extra Help screening?",
                        answer: "a",
                        options: [
                          { value: "a", text: "$18,090" },
                          { value: "b", text: "$9,950" },
                          { value: "c", text: "$2,000" },
                        ],
                      },
                      {
                        q: "4. What should an agent say when a beneficiary appears eligible?",
                        answer: "b",
                        options: [
                          { value: "a", text: '"You are approved."' },
                          {
                            value: "b",
                            text: '"You may qualify; SSA or the proper agency makes the final determination."',
                          },
                          { value: "c", text: '"Switch today and your drugs are free."' },
                        ],
                      },
                      {
                        q: "5. Does LIS eliminate the need to check formulary and pharmacy network?",
                        answer: "c",
                        options: [
                          { value: "a", text: "Yes" },
                          { value: "b", text: "Only during AEP" },
                          { value: "c", text: "No" },
                        ],
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[var(--border-gold)]/30 bg-black/20 p-4"
                        data-answer={item.answer}
                      >
                        <p className="font-display font-black text-[var(--text-primary)]">{item.q}</p>
                        <div className="mt-3 space-y-2">
                          {item.options.map((opt) => (
                            <label
                              key={opt.value}
                              className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-white/5 p-2 transition-colors hover:bg-white/8"
                            >
                              <input
                                type="radio"
                                name={`q${idx + 1}`}
                                value={opt.value}
                                className="h-4 w-4"
                              />
                              <span className="text-sm text-[var(--text-secondary)]">{opt.text}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </form>

                  <button
                    type="button"
                    onClick={gradeQuiz}
                    className="mt-6 w-full rounded-lg bg-[var(--accent-primary)] px-4 py-2 font-display font-black uppercase text-[var(--bg-primary)] transition-opacity hover:opacity-90"
                  >
                    Grade Knowledge Check
                  </button>

                  <div
                    id="scorebox"
                    className="mt-4 hidden rounded-xl border p-4 text-center font-bold"
                    style={{ display: "none" }}
                  />
                </div>
              </section>
            )}

            {/* Module 7: Completion Script */}
            {active === 7 && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-[var(--border-gold)]/30 bg-[var(--bg-matte-elevated)]/40 p-6">
                  <h2 className="font-display text-2xl font-black">8. Completion and Field Script</h2>
                  <div className="mt-6 rounded-lg border-l-4 border-[var(--accent-primary)] bg-[#eef6ff] p-4">
                    <p className="font-display text-[10px] font-black uppercase text-[#1e4f7a]">Certified field script:</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#1e4f7a]">
                      "Extra Help is a Medicare program for people with limited income and resources. It can help reduce Part D premiums, deductibles, prescription copays, and the Part D late enrollment penalty. Some people get it automatically through Medicaid, a Medicare Savings Program, or SSI. Others can apply through Social Security. I can help explain the process and review your plan options, but Social Security or the proper agency determines eligibility."
                    </p>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-display text-sm font-black uppercase">Before recommending a plan, verify:</h3>
                    <ul className="mt-3 space-y-2 text-[13px] text-[var(--text-secondary)]">
                      <li className="flex gap-2">
                        <span className="mt-0.5 text-[var(--accent-primary)]">•</span>
                        <span>Current LIS/Medicaid/MSP/SSI status using approved tools.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 text-[var(--accent-primary)]">•</span>
                        <span>Each medication, dosage, quantity, and pharmacy preference.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 text-[var(--accent-primary)]">•</span>
                        <span>
                          Plan premium after LIS, deductible, copays, formulary, prior authorization, step therapy, and preferred pharmacy status.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 text-[var(--accent-primary)]">•</span>
                        <span>
                          Whether the beneficiary received a notice from Medicare, SSA, Medicaid, or the plan.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <p className="mt-6 text-[11px] text-[var(--text-muted)]">
                    Internal training module. Validate against current CMS, Medicare.gov, SSA, carrier, and state guidance before live agent deployment.
                  </p>
                </div>
              </section>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                onClick={prevModule}
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
                onClick={nextModule}
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
