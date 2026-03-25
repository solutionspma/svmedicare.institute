/**
 * Learning objectives interactive content — 5+ pages per objective
 * From: Your Medicare Benefits, AHIP PY26, Medicare Compliance & FWA
 */

export type ObjectivePage = {
  title: string;
  body: string;
  bullets?: string[];
  keyPoint?: string;
  callout?: string;
};

export type ObjectiveContent = {
  objective: string;
  pages: ObjectivePage[];
};

/** Key: "moduleId_objectiveIndex" — e.g. "1_0", "2_3" */
export const OBJECTIVES_CONTENT: Record<string, ObjectiveContent> = {
  // ─── Module 1: Medicare Program Basics ─────────────────────────────────────
  "1_0": {
    objective: "Explain the different ways to get Medicare benefits",
    pages: [
      {
        title: "Two Paths to Medicare Coverage",
        body: "Medicare beneficiaries can receive their medical coverage through one of two primary pathways. Understanding these options is essential for guiding consumers toward the right choice for their situation.",
        bullets: [
          "Original Medicare: Fee-for-service coverage directly from the federal government",
          "Medicare Advantage: Private plans that contract with Medicare to provide Part A and Part B benefits",
        ],
        keyPoint: "Part D prescription drug coverage is always through a private plan—even with Original Medicare.",
      },
      {
        title: "Original Medicare (Parts A + B)",
        body: "Original Medicare is the traditional fee-for-service program. Beneficiaries can see any doctor or hospital that accepts Medicare, nationwide. There are no networks, no referrals required for specialists, and no prior authorization for most services.",
        bullets: [
          "Part A: Hospital insurance (inpatient care, SNF, hospice, home health)",
          "Part B: Medical insurance (doctors, outpatient, preventive care)",
          "Medicare pays providers directly; beneficiaries pay deductibles and coinsurance",
        ],
        callout: "Original Medicare has no out-of-pocket maximum. Costs can be unlimited for heavy users.",
      },
      {
        title: "Medicare Advantage (Part C)",
        body: "Medicare Advantage plans are offered by private companies approved by Medicare. They provide all Part A and Part B benefits (except hospice, which stays with Original Medicare). Many MA plans also include Part D and extra benefits like dental, vision, and fitness.",
        bullets: [
          "Must cover everything Original Medicare covers",
          "Optional extras: dental, vision, hearing, wellness programs",
          "Each plan has a maximum out-of-pocket limit (MOOP)",
          "Plans use networks: HMO, PPO, PFFS, or MSA",
        ],
      },
      {
        title: "Part D: Always Private",
        body: "Prescription drug coverage is not part of Original Medicare. Beneficiaries must enroll in a standalone Part D plan (PDP) or a Medicare Advantage plan that includes drug coverage (MA-PD). PDPs are offered by private insurers that contract with Medicare.",
        bullets: [
          "Standalone PDP: Pairs with Original Medicare or MA plans without drug coverage",
          "MA-PD: Drug coverage bundled into the Medicare Advantage plan",
          "Medicare Cost plans may offer Part D or use standalone PDP",
        ],
      },
      {
        title: "Choosing the Right Path",
        body: "Agents must help beneficiaries compare Original Medicare plus Medigap plus PDP against Medicare Advantage. Factors include: provider network, prescription needs, travel habits, budget, and extra benefits.",
        keyPoint: "Never assume one path is right for everyone. Assess each beneficiary's situation individually.",
      },
    ],
  },
  "1_1": {
    objective: "Describe eligibility for Part A and Part B",
    pages: [
      {
        title: "Age-Based Eligibility",
        body: "Most people become eligible for Medicare at age 65. If you are already receiving Social Security or Railroad Retirement Board benefits, you will be automatically enrolled in Part A and Part B the month you turn 65.",
        bullets: [
          "Age 65 or older and a U.S. citizen or lawfully present 5+ years",
          "Automatic enrollment for those on Social Security/RRB at 65",
          "If not auto-enrolled, apply during your Initial Enrollment Period (IEP)",
        ],
      },
      {
        title: "Under-65 Eligibility: Disability",
        body: "Individuals under 65 can qualify for Medicare after receiving Social Security Disability Insurance (SSDI) or Railroad Retirement disability benefits for 24 months. The 24th month of disability benefits triggers Medicare eligibility.",
        bullets: [
          "24 months of SSDI or RRB disability = automatic Medicare",
          "No waiting period for ALS (Lou Gehrig's disease)",
          "ESRD (end-stage renal disease) has special rules—coverage can begin sooner",
        ],
      },
      {
        title: "Residency and Citizenship",
        body: "To be eligible for Medicare, you must be a U.S. citizen or lawfully admitted alien who has lived in the United States continuously for at least 5 years. Individuals in Puerto Rico are automatically enrolled in Part A when eligible but must actively enroll in Part B.",
        keyPoint: "Puerto Rico residents: Part A is automatic; Part B requires separate enrollment.",
      },
      {
        title: "Part A Premium-Free Status",
        body: "Part A is usually premium-free if you or your spouse have 40 or more quarters (10 years) of Medicare-covered employment. Fewer than 40 quarters results in a monthly Part A premium.",
        bullets: [
          "40+ quarters = $0 Part A premium",
          "30–39 quarters = reduced premium",
          "Fewer than 30 quarters = full premium",
        ],
      },
      {
        title: "Part B: Everyone Pays",
        body: "Part B always has a monthly premium. Most pay the standard amount; higher-income beneficiaries pay more (IRMAA). Part B is optional but declining it without other creditable coverage can trigger a late enrollment penalty if you enroll later.",
        callout: "Declining Part B when first eligible can lead to a permanent 10% penalty per year for each year you could have had it.",
      },
    ],
  },
  "1_2": {
    objective: "Understand Part A and Part B coverage",
    pages: [
      {
        title: "Part A: Hospital Insurance",
        body: "Part A covers inpatient hospital care, including acute care hospitals, critical access hospitals, rehabilitation facilities, and long-term care hospitals. It also covers skilled nursing facility care (up to 100 days after a qualifying 3-day inpatient stay), hospice, and home health in qualifying circumstances.",
        bullets: [
          "Inpatient hospital: Semiprivate room, meals, nursing, drugs, supplies",
          "SNF: Up to 100 days per benefit period; days 21–100 have a daily copay",
          "Hospice: For terminal illness; care focuses on comfort",
          "Blood: After first 3 pints per calendar year",
        ],
      },
      {
        title: "Part A: Benefit Periods",
        body: "Part A uses benefit periods, not calendar years. A benefit period starts when you are admitted as an inpatient and ends when you have been out of the hospital or SNF for 60 consecutive days. There is no limit on the number of benefit periods.",
        keyPoint: "60 days out of the hospital resets the benefit period. A new admission starts a new period.",
      },
      {
        title: "Part B: Medical Insurance",
        body: "Part B covers physician and other health care professional services, outpatient hospital care, clinical lab and diagnostic tests (X-rays, MRIs, CT scans), durable medical equipment, physical and occupational therapy, ambulatory surgical center services, chemotherapy, ambulance, and preventive services.",
        bullets: [
          "Doctors and outpatient services",
          "Lab tests, X-rays, MRIs, CT scans",
          "DME (wheelchairs, oxygen, etc.)",
          "Preventive services (many at no cost-sharing)",
        ],
      },
      {
        title: "Part B: Preventive Services",
        body: "Medicare covers many preventive services at no cost when the provider accepts assignment. Examples include annual wellness visits, flu shots, pneumococcal vaccine, mammograms, colorectal cancer screenings, diabetes screenings, and cardiovascular screenings.",
        callout: "Preventive services help beneficiaries stay healthy. Encourage use of covered wellness visits.",
      },
      {
        title: "Coverage Rules",
        body: "Medicare only covers services that are medically necessary. Beneficiaries should confirm coverage before receiving non-emergency care. If a service is denied, they have the right to appeal.",
        bullets: [
          "Medically necessary: Required for diagnosis or treatment",
          "Assignment: Provider agrees to accept Medicare's approved amount",
          "Non-participating providers may charge up to 15% over the limiting charge",
        ],
      },
    ],
  },
  "1_3": {
    objective: "Explain Original Medicare premiums and cost-sharing",
    pages: [
      {
        title: "Part A Costs",
        body: "Part A has a deductible per benefit period (recently over $1,600). For a hospital stay, you pay the deductible once per benefit period. For SNF care, days 1–20 are covered after the deductible; days 21–100 have a daily coinsurance amount.",
        bullets: [
          "Deductible: Per benefit period, not per year",
          "SNF days 21–100: Daily copay (amount changes annually)",
          "Beyond 100 days: Full cost to beneficiary",
        ],
      },
      {
        title: "Part B Premiums",
        body: "Part B has a standard monthly premium. Higher-income beneficiaries pay an Income-Related Monthly Adjustment Amount (IRMAA) in addition to the standard premium. IRMAA is based on modified adjusted gross income from two years prior.",
        keyPoint: "IRMAA applies to Part B and Part D. Income from 2 years ago determines the amount.",
      },
      {
        title: "Part B Deductible and Coinsurance",
        body: "Part B has an annual deductible. After the deductible, beneficiaries typically pay 20% of the Medicare-approved amount for most covered services when the provider accepts assignment. Some preventive services have $0 cost-sharing.",
        bullets: [
          "Annual deductible (amount set annually)",
          "20% coinsurance for most Part B services",
          "Preventive services: Often $0 when provider accepts assignment",
        ],
      },
      {
        title: "No Out-of-Pocket Maximum",
        body: "Original Medicare has no cap on out-of-pocket costs. Beneficiaries with significant health needs could face very high expenses. Medigap or Medicare Advantage can provide cost protection.",
        callout: "This is a key reason many beneficiaries choose Medicare Advantage or add Medigap.",
      },
      {
        title: "Late Enrollment Penalties",
        body: "Enrolling in Part B or Part D late (without creditable coverage) can result in permanent penalties. Part B: 10% per year for each year you could have had it. Part D: 1% of national base premium per month unenrolled.",
        bullets: [
          "Part B penalty: 10% per full 12-month period",
          "Part D penalty: 1% per month; permanent",
          "Creditable coverage avoids penalties",
        ],
      },
    ],
  },
  "1_4": {
    objective: "Describe Medigap and when Medicare is secondary to employer plans",
    pages: [
      {
        title: "What is Medigap?",
        body: "Medigap (Medicare Supplement Insurance) is private insurance that helps pay costs Original Medicare doesn't cover—copays, coinsurance, deductibles. Medigap works only with Original Medicare, not with Medicare Advantage.",
        bullets: [
          "Sold by private insurers",
          "Standardized plans: A through N (coverage varies by letter)",
          "Does not include prescription drugs",
          "One Medigap per person",
        ],
      },
      {
        title: "Medigap Open Enrollment",
        body: "The best time to buy Medigap is during the 6-month Medigap Open Enrollment Period, which starts the month you're 65 or older and enrolled in Part B. During this period, insurers cannot deny coverage or charge more due to pre-existing conditions.",
        keyPoint: "Missing this window can mean medical underwriting and higher premiums or denial.",
      },
      {
        title: "Medicare as Secondary",
        body: "When you have employer group health coverage and the employer has 20 or more employees, the employer plan is primary and Medicare is secondary. Medicare may pay some costs not covered by the group plan.",
        bullets: [
          "20+ employees: Employer plan primary",
          "Fewer than 20 employees: Medicare may be primary",
          "Coordination of benefits determines which pays first",
        ],
      },
      {
        title: "Special Enrollment Period",
        body: "If you delay Part B because you have employer coverage, you get a Special Enrollment Period (SEP) when that coverage ends. You have 8 months from the last month of employer coverage to enroll in Part B without penalty.",
        callout: "8 months from last month of employer coverage—don't miss this window.",
      },
      {
        title: "Creditable Coverage",
        body: "Employer drug coverage is 'creditable' if it pays at least as much as Medicare's standard Part D benefit. Having creditable coverage when you decline Part D avoids the late enrollment penalty when you enroll later.",
        bullets: [
          "Request a Letter of Creditable Coverage from employer",
          "Keep documentation for Part D enrollment",
          "63+ days without creditable coverage = Part D penalty",
        ],
      },
    ],
  },

  // ─── Module 2: Plan Types & Benefits ──────────────────────────────────────
  "2_0": {
    objective: "Compare Original Medicare vs Medicare Advantage",
    pages: [
      { title: "Side-by-Side Overview", body: "Original Medicare is fee-for-service; Medicare Advantage is managed care. Original Medicare has no network; MA plans use networks. Original Medicare has no out-of-pocket cap; MA plans have a required MOOP.", bullets: ["Original: Part A + B from government", "MA: Part A + B (and often D) from private plan"] },
      { title: "Cost Structure", body: "Original Medicare: deductibles, coinsurance, no cap. MA: copays, coinsurance, MOOP, often $0 premium.", bullets: ["MA often includes Part D at no extra cost", "MA may offer dental, vision, hearing"] },
      { title: "Provider Access", body: "Original Medicare: any Medicare-accepting provider. MA: typically network providers; out-of-network may cost more or not be covered (except emergencies).", keyPoint: "Emergency care is covered anywhere in the U.S. with both." },
      { title: "Referrals and Prior Auth", body: "Original Medicare: no referrals for specialists. MA: HMOs often require PCP and referrals; PPOs may not.", bullets: ["Know plan type before advising", "Prior auth may apply in MA"] },
      { title: "Choosing Between Them", body: "Consider: budget, providers, prescriptions, travel, extra benefits. No single answer fits all beneficiaries.", callout: "Match the plan to the beneficiary's needs and preferences." },
    ],
  },
  "2_1": {
    objective: "Explain HMO, PPO, PFFS, and MSA plan types",
    pages: [
      { title: "HMO: Health Maintenance Organization", body: "HMOs typically require you to use network providers and may require a primary care physician and referrals for specialists. Emergency care is covered anywhere.", bullets: ["Network only (except emergency)", "PCP and referrals common", "Lower premiums and copays"] },
      { title: "PPO: Preferred Provider Organization", body: "PPOs allow in- and out-of-network care. In-network costs less; out-of-network costs more. Referrals usually not required.", bullets: ["In/out-of-network options", "No referral typically needed", "Higher cost out-of-network"] },
      { title: "PFFS: Private Fee-for-Service", body: "PFFS plans allow you to see any provider who accepts the plan's terms. No formal network; providers accept per visit.", bullets: ["Any willing provider", "No network required", "Must accept plan terms and payment"] },
      { title: "MSA: Medical Savings Account", body: "MSAs combine a high-deductible MA plan with a savings account. Medicare deposits funds; you use them for health care. May have partial, full, or no network.", bullets: ["High deductible + savings account", "Unused funds may roll over", "Network varies"] },
      { title: "Quick Reference", body: "HMO: network, referrals. PPO: network preferred. PFFS: any provider. MSA: high deductible + account.", keyPoint: "Explain network implications clearly to beneficiaries." },
    ],
  },
  "2_2": {
    objective: "Describe Special Needs Plans (SNPs) and eligibility",
    pages: [
      { title: "What Are SNPs?", body: "SNPs limit enrollment to beneficiaries with specific characteristics. They tailor benefits and care to the needs of their population.", bullets: ["C-SNP: Chronic conditions", "D-SNP: Dual-eligible (Medicare + Medicaid)", "I-SNP: Institutionalized"] },
      { title: "C-SNPs: Chronic Conditions", body: "C-SNPs enroll beneficiaries with specific chronic conditions (e.g., diabetes, heart failure, dementia). Benefits and care management are designed for that condition.", keyPoint: "Must meet CMS-specified condition criteria." },
      { title: "D-SNPs: Dual-Eligible", body: "D-SNPs are for those with both Medicare and Medicaid. QMBs (Qualified Medicare Beneficiaries) have protected cost-sharing; providers cannot balance-bill above Medicaid amounts.", bullets: ["Dual-eligible only", "QMB: Medicaid pays cost-sharing", "Coordination with Medicaid"] },
      { title: "I-SNPs: Institutionalized", body: "I-SNPs enroll beneficiaries who have been in an institution (e.g., nursing home) for 90+ days or need institutional-level care but live in the community (IE-SNP).", bullets: ["90+ days institutionalized", "IE-SNP: institutional level of care, community dwelling"] },
      { title: "Eligibility Verification", body: "Agents must verify SNP eligibility before enrollment. Enrolling ineligible beneficiaries can result in disenrollment and compliance issues.", callout: "Always confirm eligibility. SNPs are not open to everyone." },
    ],
  },
  "2_3": {
    objective: "Understand Part D coverage, formularies, and TrOOP",
    pages: [
      { title: "Part D Basics", body: "Part D covers prescription drugs. Plans have formularies (drug lists) and tiers. Each plan structures cost-sharing differently.", bullets: ["Formulary: list of covered drugs", "Tiers: lower tiers = lower cost", "Prior auth and step therapy may apply"] },
      { title: "Coverage Phases", body: "Part D has phases: deductible, initial coverage, coverage gap (closing), and catastrophic. TrOOP (True Out-of-Pocket) tracks spending that counts toward catastrophic.", bullets: ["Deductible phase", "Initial coverage", "Coverage gap", "Catastrophic"] },
      { title: "TrOOP", body: "TrOOP counts: deductible, copays, coinsurance. TrOOP does not count: OTC drugs, employer supplemental help, non-formulary drugs (unless exception), vitamins.", keyPoint: "TrOOP determines when catastrophic coverage begins." },
      { title: "IRA Changes", body: "The Inflation Reduction Act is phasing out the coverage gap and capping insulin costs. Monitor annual updates for current rules.", callout: "Coverage gap eliminated 2025; insulin cap in effect." },
      { title: "Formulary Changes", body: "Plans can change formularies during the year with notice. Mid-year changes may require 60-day notice or beneficiary right to appeal.", bullets: ["Annual formulary updates", "Mid-year changes: notice required", "Exception process for non-formulary"] },
    ],
  },
  "2_4": {
    objective: "Explain when standalone Part D pairs with MA plans",
    pages: [
      { title: "MA-PD vs Standalone", body: "MA HMO and PPO plans that offer drug coverage (MA-PD) require members to get Part D only through the plan. MA PFFS or MSA plans without drug coverage can pair with a standalone PDP.", bullets: ["MA HMO/PPO: Part D through plan only", "PFFS/MSA without drugs: can add PDP"] },
      { title: "Cost Plans", body: "Medicare Cost plans may offer Part D or require a standalone PDP. Check each plan's materials.", keyPoint: "Cost plans have different rules from MA." },
      { title: "Enrollment Rules", body: "Enrolling in MA-PD and a standalone PDP at the same time results in automatic disenrollment from the PDP. Never enroll a beneficiary in both.", callout: "Dual enrollment in MA-PD and PDP is not allowed." },
      { title: "Late Enrollment", body: "If a beneficiary has MA without drug coverage and doesn't have creditable coverage, they may incur a Part D penalty when they add a PDP later.", bullets: ["63+ days without creditable = penalty", "Add PDP when losing other coverage"] },
      { title: "Agent Responsibility", body: "Agents must ensure beneficiaries understand their drug coverage options and avoid gaps or duplicate coverage.", bullets: ["Confirm current drug coverage", "Avoid gaps and penalties", "Document decisions"] },
    ],
  },

  // ─── Module 3: Compliance & Marketing ────────────────────────────────────
  "3_0": {
    objective: "Identify CMS marketing requirements for MA and Part D",
    pages: [
      { title: "Accuracy and Non-Misleading", body: "All marketing must be accurate and not misleading. CMS prohibits false or misleading claims, pressure tactics, and misleading comparisons.", bullets: ["Accurate benefit descriptions", "No false deadlines", "Clear disclaimers"] },
      { title: "Required Disclosures", body: "Marketing materials must include required disclosures: network limitations, out-of-pocket maximums, formulary information, and other plan-specific details.", keyPoint: "Members must be informed of key plan features." },
      { title: "Comparative Advertising", body: "Comparative advertising requires CMS approval and participant consent. Never compare plans without proper authorization.", bullets: ["CMS approval required", "Participant consent", "Document everything"] },
      { title: "Prohibited Practices", body: "Prohibited: unsolicited contact, door-to-door without referral, meals at marketing events, promotional items with plan info, cold calling.", callout: "When in doubt, follow CMS scripts and document." },
      { title: "Pre-Enrollment Checklist", body: "Before enrollment: confirm SOA, read required scripts, provide accurate comparison, document all interactions.", bullets: ["SOA in place", "Scripts read verbatim", "Accurate information"] },
    ],
  },
  "3_1": {
    objective: "Explain Scope of Appointment (SOA) and timing rules",
    pages: [
      { title: "What is SOA?", body: "Scope of Appointment is a form or recording that documents the beneficiary's agreement to discuss specific plans or plan types. It must be completed before any plan-specific discussion.", bullets: ["Required before plan-specific discussion", "Written or recorded", "Valid 12 months from signature"] },
      { title: "When SOA is Required", body: "SOA is required before discussing specific MA, Part D, or Medicare Supplement plans. General Medicare education does not require SOA.", keyPoint: "Plan-specific = SOA required." },
      { title: "12-Month Validity", body: "An SOA is valid for 12 months from the date of signature. After 12 months, a new SOA is required for plan-specific discussions.", bullets: ["12 months from signature", "New SOA after expiry", "Document the date"] },
      { title: "Documentation", body: "SOA must be documented in writing or by recording. Retain according to CMS and plan requirements. Be prepared for audits.", callout: "Documentation is critical for compliance." },
      { title: "No SOA = No Discussion", body: "Without a valid SOA, you cannot discuss specific plans. Respect the boundary; it protects both the beneficiary and the agent.", bullets: ["No plan-specific discussion without SOA", "Obtain SOA first", "Stay within scope"] },
    ],
  },
  "3_2": {
    objective: "Distinguish educational events from marketing events",
    pages: [
      { title: "Educational Events", body: "Educational events provide general Medicare information without promoting specific plans. No plan-specific discussion, no applications, no enrollment.", bullets: ["General Medicare info only", "No plan-specific content", "No enrollment"] },
      { title: "Marketing Events", body: "Marketing events promote specific plans. May include plan applications, enrollment forms, and plan-specific discussions. Requires SOA.", bullets: ["Plan-specific content", "May include enrollment", "SOA required"] },
      { title: "12-Hour Rule", body: "CMS requires at least 12 hours between an educational event and a marketing event. This prevents confusion and ensures beneficiaries are not pressured.", keyPoint: "12+ hours between educational and marketing." },
      { title: "Educational Event Limits", body: "At educational events: light snacks ($15 or less per person), business reply cards. No full meals, no gift cards, no plan applications.", callout: "Keep educational events purely educational." },
      { title: "Best Practices", body: "Clearly separate educational and marketing. Document event type, date, time, and attendees. Train staff on the difference.", bullets: ["Separate events clearly", "Document everything", "Train staff"] },
    ],
  },
  "3_3": {
    objective: "Understand agent compensation and pro-rata recoupment",
    pages: [
      { title: "Compensation Structure", body: "Agents are compensated by plans for enrollments. Compensation varies by plan, product type, and timing. CMS has rules on compensation amounts and disclosure.", bullets: ["Plan pays agent", "Varies by plan and product", "CMS rules apply"] },
      { title: "Pro-Rata Recoupment", body: "When a member disenrolls, the plan may recoup (claw back) a portion of the agent's compensation. The agent typically keeps compensation through the month of disenrollment.", keyPoint: "Recoupment applies to captive and independent agents." },
      { title: "Who It Applies To", body: "Pro-rata recoupment applies to agents (captive and independent). It does not apply to plan employees. CMS marketing rules apply to all except plan employees.", bullets: ["Agents: recoupment applies", "Plan employees: different rules", "Know your status"] },
      { title: "Timing", body: "Recoupment timing varies by plan. Some plans recoup over months; others have different structures. Understand your contracts.", callout: "Review your agent agreement for recoupment terms." },
      { title: "Compliance", body: "Compensation should never drive inappropriate enrollments. Follow CMS rules and ethical standards. Document all enrollments properly.", bullets: ["Never enroll for compensation alone", "Follow CMS rules", "Document properly"] },
    ],
  },
  "3_4": {
    objective: "Recognize prohibited marketing practices",
    pages: [
      { title: "Unsolicited Contact", body: "Do not contact beneficiaries without permission. No cold calling to sell Medicare plans. Exceptions exist for referrals and existing relationships within rules.", bullets: ["No cold calling", "Referrals and permission", "Know the exceptions"] },
      { title: "Meals and Gifts", body: "Prohibited at marketing events: full meals, gift cards, cash. Light snacks ($15 or less per person) allowed at educational events. No promotional items with plan info.", keyPoint: "Keep incentives minimal and compliant." },
      { title: "False or Misleading", body: "Never use false deadlines, claim a plan covers 'everything,' or misrepresent benefits. All information must be accurate and not misleading.", bullets: ["No false deadlines", "No 'covers everything'", "Accurate information only"] },
      { title: "Pressure Tactics", body: "Do not pressure beneficiaries to enroll. Do not use high-pressure sales tactics. Allow beneficiaries time to decide.", callout: "Beneficiary choice and understanding are paramount." },
      { title: "Documentation", body: "When in doubt, follow CMS scripts and document everything. Good documentation protects you and the beneficiary.", bullets: ["Use CMS scripts", "Document all interactions", "Retain records"] },
    ],
  },

  // ─── Module 4: Communications & Marketing (same content as Module 3) ───────
  // 4_0 through 4_4 use same content as 3_0 through 3_4 — added at end

  // ─── Module 5: Fraud, Waste & Abuse ───────────────────────────────────────
  "5_0": {
    objective: "Define fraud, waste, and abuse in the Medicare context",
    pages: [
      { title: "Fraud Defined", body: "Fraud is knowingly submitting false claims or misrepresentations to obtain federal health care payment. It requires intent to deceive.", bullets: ["Intent required", "False claims or misrepresentations", "Federal payment involved"] },
      { title: "Waste Defined", body: "Waste involves practices that result in unnecessary costs—e.g., overuse of services. Generally not criminally negligent but results in unnecessary spending.", bullets: ["Unnecessary costs", "Overuse", "Not typically criminal"] },
      { title: "Abuse Defined", body: "Abuse involves practices that do not meet professional standards of care or do not provide medically necessary services. May not meet the bar for fraud.", keyPoint: "Abuse: substandard care or medically unnecessary." },
      { title: "Examples", body: "Fraud: billing for services not rendered. Waste: prescribing unnecessary tests. Abuse: upcoding or providing services that don't meet standards.", callout: "Detect, correct, prevent. Reporting is everyone's responsibility." },
      { title: "Why It Matters", body: "FWA harms beneficiaries, taxpayers, and the Medicare program. All Sponsor and FDR employees must understand and report suspected FWA.", bullets: ["Harms beneficiaries", "Drains program resources", "Reporting required"] },
    ],
  },
  "5_1": {
    objective: "Identify major FWA laws and regulations",
    pages: [
      { title: "18 USC 1347", body: "Criminal health care fraud. Penalties: up to 10 years imprisonment, fines up to $250,000. Applies to knowingly executing a scheme to defraud a health care benefit program.", bullets: ["Criminal statute", "Up to 10 years", "$250K fine"] },
      { title: "False Claims Act", body: "Civil liability for submitting false claims to the government. Qui tam provisions allow whistleblowers to bring suit. Treble damages possible.", bullets: ["Civil liability", "Whistleblower provisions", "Treble damages"] },
      { title: "Anti-Kickback Statute", body: "Prohibits knowingly and willfully offering or receiving remuneration to induce referrals for items or services payable by federal health care programs.", keyPoint: "Remuneration for referrals is prohibited." },
      { title: "Stark Law", body: "Prohibits physician self-referral for designated health services. Different from Anti-Kickback; both can apply.", bullets: ["Physician self-referral", "Designated health services", "Strict liability"] },
      { title: "Exclusion", body: "Individuals or entities convicted of certain offenses can be excluded from federal health care programs. Exclusion means no payment for services.", callout: "Exclusion can end a career in health care." },
    ],
  },
  "5_2": {
    objective: "Recognize consequences and penalties",
    pages: [
      { title: "Criminal Penalties", body: "Criminal FWA can result in imprisonment, fines, and a criminal record. 18 USC 1347: up to 10 years, $250K.", bullets: ["Imprisonment", "Fines", "Criminal record"] },
      { title: "Civil Penalties", body: "Civil liability can include treble damages, per-claim penalties, and exclusion from federal programs.", keyPoint: "Civil and criminal can apply together." },
      { title: "Contract Termination", body: "Plans can terminate contracts with agents, FDRs, or providers who commit FWA. CMS can impose sanctions on plans.", bullets: ["Contract termination", "Plan sanctions", "Lost business"] },
      { title: "Reputation and Career", body: "FWA can destroy professional reputation and end careers. The stakes are high.", callout: "Prevention and compliance protect you and beneficiaries." },
      { title: "Corrective Action", body: "Organizations must take corrective action when FWA is identified. This may include training, process changes, and reporting.", bullets: ["Corrective action required", "Training", "Process improvements"] },
    ],
  },
  "5_3": {
    objective: "Know how to report suspected FWA",
    pages: [
      { title: "Internal Reporting", body: "Report suspected FWA through your organization's compliance process. Use the designated hotline, email, or portal. Do not ignore red flags.", bullets: ["Use compliance process", "Hotline, email, or portal", "Report promptly"] },
      { title: "Good-Faith Protection", body: "Good-faith reporting is protected. Retaliation against reporters is prohibited. Report without fear of reprisal when acting in good faith.", keyPoint: "Good-faith reporters are protected from retaliation." },
      { title: "Confidentiality", body: "Reports can often be made anonymously or confidentially. Know your organization's policy.", bullets: ["Anonymous options", "Confidentiality", "Follow policy"] },
      { title: "External Reporting", body: "Serious concerns can be reported to OIG, CMS, or law enforcement. Know when and how to escalate.", callout: "When in doubt, report. Silence helps wrongdoers." },
      { title: "Documentation", body: "Document what you observed, when, and who was involved. Do not investigate on your own—report and let compliance handle it.", bullets: ["Document observations", "Do not investigate", "Report to compliance"] },
    ],
  },
  "5_4": {
    objective: "Understand corrective action requirements",
    pages: [
      { title: "When Corrective Action is Required", body: "When FWA is identified, the organization must take corrective action. This includes investigating, remediating, and preventing recurrence.", bullets: ["Investigate", "Remediate", "Prevent recurrence"] },
      { title: "Training", body: "FWA training is required within 90 days of hire and annually thereafter. All Sponsor and FDR employees must complete it.", keyPoint: "90 days of hire, annually for all." },
      { title: "Policies and Procedures", body: "Organizations must have policies and procedures to prevent, detect, and correct FWA. These must be followed and updated.", bullets: ["Policies required", "Procedures", "Regular updates"] },
      { title: "Monitoring", body: "Ongoing monitoring and auditing help detect FWA. Report anomalies and participate in compliance activities.", callout: "Compliance is ongoing, not one-time." },
      { title: "Culture of Compliance", body: "A culture where employees feel safe reporting and leadership takes FWA seriously is essential. Everyone has a role.", bullets: ["Safe to report", "Leadership commitment", "Everyone's responsibility"] },
    ],
  },

  // ─── Module 6: Enrollment & Election Periods ───────────────────────────────
  "6_0": {
    objective: "Explain AEP, OEP, IEP, and key SEPs",
    pages: [
      { title: "AEP: Annual Enrollment Period", body: "AEP runs October 15–December 7 each year. Everyone can enroll, disenroll, or change MA or Part D plans. Changes take effect January 1.", bullets: ["Oct 15–Dec 7", "Everyone eligible", "Effective Jan 1"] },
      { title: "OEP: Open Enrollment Period", body: "OEP runs January 1–March 31. Only for current MA enrollees. Can switch to another MA plan or to Original Medicare plus Part D. One change per year.", keyPoint: "OEP is MA-only; not for new enrollments." },
      { title: "IEP: Initial Enrollment Period", body: "IEP is the 7-month period around your 65th birthday (3 months before, month of, 3 months after). Or when you first become eligible for Medicare.", bullets: ["7 months around 65", "First eligibility", "Critical for avoiding penalties"] },
      { title: "Key SEPs", body: "SEPs allow changes outside AEP/OEP for qualifying events: loss of creditable coverage, move, dual-eligible, LIS, etc. Each SEP has specific rules and timing.", callout: "Know the SEPs. Timing is everything." },
      { title: "Agent Responsibility", body: "Agents must explain periods clearly, ensure beneficiaries enroll in the right period, and document election period used.", bullets: ["Explain clearly", "Right period", "Document"] },
    ],
  },
  "6_1": {
    objective: "Understand creditable coverage and late enrollment penalty",
    pages: [
      { title: "Creditable Coverage", body: "Creditable drug coverage pays at least as much as Medicare's standard Part D benefit. Employer coverage, VA, TRICARE can be creditable. Beneficiaries should get a Letter of Creditable Coverage.", bullets: ["As good as standard Part D", "Employer, VA, TRICARE", "Letter of Creditable Coverage"] },
      { title: "Part D Penalty", body: "63+ days without creditable coverage = permanent 1% of national base premium per month unenrolled. Enroll before the 63-day break when losing employer coverage.", keyPoint: "63 days = penalty threshold. Don't miss it." },
      { title: "Part B Penalty", body: "Declining Part B when first eligible can result in 10% penalty per full 12-month period for each year you could have had it. Permanent.", bullets: ["10% per year", "Permanent", "Avoid with SEP"] },
      { title: "Avoiding Penalties", body: "Enroll during IEP, SEP, or AEP when eligible. Maintain creditable coverage or enroll in Part D before 63-day break.", callout: "Plan ahead. Penalties are permanent." },
      { title: "Documentation", body: "Beneficiaries should keep Letters of Creditable Coverage. Agents should document when coverage was lost and when enrollment occurred.", bullets: ["Keep letters", "Document dates", "Proof for appeals"] },
    ],
  },
  "6_2": {
    objective: "Describe disenrollment rules and grace periods",
    pages: [
      { title: "Voluntary Disenrollment", body: "Beneficiaries can disenroll during AEP, OEP, or with a qualifying SEP. They must contact the plan or Medicare to disenroll.", bullets: ["AEP, OEP, SEP", "Contact plan or Medicare", "Follow process"] },
      { title: "Non-Payment", body: "Plans may offer a grace period for non-payment. After grace period, plan can disenroll the member. Member receives notice.", keyPoint: "Grace periods vary by plan. Know the rules." },
      { title: "Plan-Initiated", body: "Plans can disenroll for non-payment, fraud, or other cause. CMS rules govern when and how. Member must receive notice.", bullets: ["Non-payment", "Fraud", "Notice required"] },
      { title: "Effective Dates", body: "Disenrollment effective dates vary by circumstance. AEP/OEP changes effective first of next month or Jan 1. SEP effective dates defined by SEP type.", callout: "Confirm effective dates. Gaps in coverage can occur." },
      { title: "Recoupment", body: "When members disenroll, agent pro-rata recoupment may apply. Ensure enrollments are appropriate to avoid churn.", bullets: ["Pro-rata recoupment", "Appropriate enrollments", "Avoid churn"] },
    ],
  },
  "6_3": {
    objective: "Explain dual-eligible and LIS enrollment",
    pages: [
      { title: "Dual-Eligible", body: "Dual-eligible beneficiaries have both Medicare and Medicaid. They may qualify for Special Needs Plans (D-SNPs) and have cost-sharing assistance.", bullets: ["Medicare + Medicaid", "D-SNP eligible", "Cost-sharing help"] },
      { title: "LIS: Low-Income Subsidy", body: "LIS (Extra Help) helps with Part D premiums, deductibles, and copays. Automatic for full Medicaid, SSI, MSP; others must apply.", keyPoint: "LIS dramatically reduces Part D costs." },
      { title: "SEPs for Dual-Eligible", body: "Dual-eligible beneficiaries have a monthly SEP to change MA or Part D plans. Can change once per month.", bullets: ["Monthly SEP", "One change per month", "Plan flexibility"] },
      { title: "QMB and SLMB", body: "QMB: Medicaid pays Medicare cost-sharing. SLMB: Medicaid pays Part B premium. Different levels of assistance.", callout: "QMBs: providers cannot balance-bill above Medicaid amount." },
      { title: "Agent Role", body: "Agents should help dual-eligible beneficiaries understand their options, LIS, and D-SNP eligibility. Ensure they get the benefits they qualify for.", bullets: ["Explain options", "LIS enrollment", "D-SNP if eligible"] },
    ],
  },
  "6_4": {
    objective: "Understand plan notification and timing requirements",
    pages: [
      { title: "10-Day Notice", body: "Plans must notify beneficiaries in writing within 10 calendar days after CMS accepts the enrollment. Confirmation includes effective date and plan details.", bullets: ["10 calendar days", "In writing", "After CMS acceptance"] },
      { title: "Confirmation Content", body: "Confirmation should include: effective date, plan name, benefits summary, contact information, and rights to change or disenroll.", keyPoint: "Beneficiary must receive clear confirmation." },
      { title: "Timing of Enrollment", body: "Enrollment requests are processed by CMS. Effective dates depend on the election period and when the request is received.", bullets: ["CMS processing", "Election period rules", "Effective date logic"] },
      { title: "Documentation", body: "Agents should document when enrollment was submitted and when confirmation was sent. Retain records per CMS and plan requirements.", callout: "Document everything. Audits happen." },
      { title: "Member Rights", body: "Members have the right to receive materials in accessible formats, lodge complaints, and appeal. Agents should inform members of their rights.", bullets: ["Accessible formats", "Complaints", "Appeals"] },
    ],
  },
};

/** Get objective content — Module 4 falls back to Module 3 (same objectives) */
export function getObjectiveContent(moduleId: string, objectiveIndex: number): ObjectiveContent | null {
  const key = `${moduleId}_${objectiveIndex}`;
  const fallback = moduleId === "4" ? OBJECTIVES_CONTENT[`3_${objectiveIndex}`] : null;
  return OBJECTIVES_CONTENT[key] ?? fallback ?? null;
}
