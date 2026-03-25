/**
 * Expanded module content from AHIP PY26, Medicare Compliance, FWA, Your Medicare Benefits
 * Hierarchical structure for filetree + 20/80 canvas layout
 */

export type ContentNode = {
  id: string;
  label: string;
  type: "topic" | "subtopic" | "content";
  children?: ContentNode[];
  /** Reading material — key features from official docs */
  body?: string;
  /** Bullet points for key features */
  bullets?: string[];
  /** Audio path for voiceover */
  audioPath?: string;
  /** Video path */
  videoPath?: string;
};

export type ModuleContent = {
  moduleId: string;
  title: string;
  introVideo?: string;
  topics: ContentNode[];
  /** Mini exam question IDs (from trivia) */
  miniExamIds?: string[];
};

export const MODULE_CONTENT: ModuleContent[] = [
  {
    moduleId: "1",
    title: "Medicare Program Basics",
    introVideo: "/assets/intro-videos/module-1-intro.mp4",
    topics: [
      {
        id: "1-1",
        label: "Medicare Basics",
        type: "topic",
        children: [
          {
            id: "1-1-a",
            label: "What is Medicare?",
            type: "subtopic",
            body: "Medicare is the Federal health insurance program for individuals aged 65 and over, and for younger individuals with certain serious health conditions or disabilities. Medicare eligibility does not consider income; however, individuals may pay higher premiums based on income, and low-income individuals may qualify for additional assistance.",
            bullets: [
              "Federal program for those 65+ and certain under-65 with disabilities",
              "Eligibility not based on income; premiums may vary by income",
              "Low-income individuals may qualify for Extra Help",
            ],
            audioPath: "/assets/audio/mod1-1a.mp3",
          },
          {
            id: "1-1-b",
            label: "Ways to Get Medicare",
            type: "subtopic",
            body: "Individuals can receive Medicare medical coverage directly from the Federal Government (Original Medicare, fee-for-service) or through a private health plan (Medicare Advantage). Part D outpatient drug benefits are always through a private plan—even with Original Medicare.",
            bullets: [
              "Original Medicare: Part A + B, fee-for-service, any Medicare provider",
              "Medicare Advantage: Private plans covering A, B, often D",
              "Part D: Always through private plans (PDP or MA-PD)",
            ],
            audioPath: "/assets/audio/mod1-1b.mp3",
          },
        ],
      },
      {
        id: "1-2",
        label: "Part A & Part B Coverage",
        type: "topic",
        children: [
          {
            id: "1-2-a",
            label: "Part A — Hospital Insurance",
            type: "subtopic",
            body: "Part A covers inpatient hospital care (acute care, critical access, rehab, long-term care hospitals), skilled nursing and rehabilitation up to 100 days (after 3-day hospital stay; MA plans may waive this), blood, hospice, up to 100 days home health after hospital/SNF, inpatient psychiatric care (up to 190 lifetime days).",
            bullets: [
              "Inpatient hospital care",
              "Skilled nursing facility (up to 100 days, after 3-day stay)",
              "Hospice care",
              "Home health (qualifying circumstances)",
              "Blood (after first 3 pints)",
            ],
            audioPath: "/assets/audio/mod1-2a.mp3",
          },
          {
            id: "1-2-b",
            label: "Part B — Medical Insurance",
            type: "subtopic",
            body: "Part B covers physician and other health care professional services, outpatient hospital services, clinical lab and diagnostic tests (X-rays, MRIs, CT scans), durable medical equipment, home health not covered under Part A, physical and occupational therapy, ambulatory surgical center services, chemotherapy, ambulance, chiropractic (limited), preventive services (vaccines, mammograms, smoking cessation), diabetic supplies, dialysis, outpatient mental health.",
            bullets: [
              "Doctor and outpatient services",
              "Lab tests, X-rays, MRIs, CT scans",
              "Durable medical equipment",
              "Preventive services (many at no cost-sharing)",
              "Ambulance, dialysis, diabetic supplies",
            ],
            audioPath: "/assets/audio/mod1-2b.mp3",
          },
        ],
      },
      {
        id: "1-3",
        label: "Eligibility & Enrollment",
        type: "topic",
        children: [
          {
            id: "1-3-a",
            label: "Part A & B Eligibility",
            type: "subtopic",
            body: "To be eligible: (1) Age 65 or older, OR under 65 with 24 months of Social Security/RRB disability benefits, OR ALS (Lou Gehrig's), OR ESRD. (2) U.S. resident; U.S. citizen or lawfully admitted alien with 5 continuous years residence. Individuals in Puerto Rico are not automatically enrolled in Part B.",
            bullets: [
              "65+; or 24 months SSDI; or ALS; or ESRD",
              "U.S. citizen or lawfully present 5+ years",
              "Automatic enrollment for those on Social Security/RRB at 65",
              "24 months of disability = automatic Medicare for under-65",
            ],
            audioPath: "/assets/audio/mod1-3a.mp3",
          },
          {
            id: "1-3-b",
            label: "Premiums & Cost-Sharing",
            type: "subtopic",
            body: "Part A is usually premium-free with 40 quarters of work. Part B has a standard monthly premium; higher-income beneficiaries pay more (IRMAA). Part A deductible, coinsurance for SNF (days 21–100), Part B deductible and 20% coinsurance for many services.",
            bullets: [
              "Part A: Premium-free for 40 quarters; otherwise premium applies",
              "Part B: Standard premium; IRMAA for higher income",
              "Part A: Deductible per benefit period; SNF copay days 21–100",
              "Part B: Annual deductible; typically 20% coinsurance",
            ],
            audioPath: "/assets/audio/mod1-3b.mp3",
          },
        ],
      },
      {
        id: "1-4",
        label: "Medigap & Employer Plans",
        type: "topic",
        children: [
          {
            id: "1-4-a",
            label: "Medigap (Supplemental Insurance)",
            type: "subtopic",
            body: "Medigap helps cover Part A deductible, Part B coinsurance/copays, and some services Original Medicare doesn't cover. Best enrollment window: 6 months after Part B starts (Medicare Supplement Open Enrollment). Plans are standardized (A through N); coverage varies by plan letter.",
            bullets: [
              "Fills gaps in Original Medicare",
              "6-month open enrollment after Part B starts",
              "Standardized plans A–N",
              "Does not include prescription drugs",
            ],
            audioPath: "/assets/audio/mod1-4a.mp3",
          },
          {
            id: "1-4-b",
            label: "Medicare as Secondary",
            type: "subtopic",
            body: "When you have employer group health coverage, Medicare may be secondary. Special Enrollment Period (SEP) applies when you lose employer coverage—8 months after last month of employer coverage to enroll in Part B without penalty.",
            bullets: [
              "Employer coverage primary when working for employer with 20+ employees",
              "SEP: 8 months after employer coverage ends",
              "No late enrollment penalty if creditable coverage",
            ],
            audioPath: "/assets/audio/mod1-4b.mp3",
          },
        ],
      },
    ],
    miniExamIds: ["b1", "b2", "b3", "ahip1", "ahip2", "ahip3"],
  },
  {
    moduleId: "2",
    title: "Part C and Medicare Health Plans",
    introVideo: "/assets/intro-videos/module-2-intro.mp4",
    topics: [
      {
        id: "2-1",
        label: "Medicare Advantage Overview",
        type: "topic",
        children: [
          {
            id: "2-1-a",
            label: "What is Medicare Advantage?",
            type: "subtopic",
            body: "Medicare Advantage (Part C) plans are offered by private companies that contract with Medicare. They cover all Part A and Part B benefits (except hospice, which stays with Original Medicare). Many include Part D and supplemental benefits (dental, vision, hearing, fitness). All MA plans have a maximum out-of-pocket limit (MOOP).",
            bullets: [
              "All-in-one: Part A + B, often Part D",
              "Private plans, Medicare-approved",
              "MOOP required for basic benefits",
              "Often includes dental, vision, hearing, fitness",
            ],
            audioPath: "/assets/audio/mod2-1a.mp3",
          },
          {
            id: "2-1-b",
            label: "Plan Types: HMO, PPO, PFFS, MSA",
            type: "subtopic",
            body: "HMOs: Generally network only; PCP may be required; referrals for specialists. PPOs: In- and out-of-network; higher cost-sharing out-of-network. PFFS: Any provider who accepts plan terms; no network required. MSA: High-deductible + savings account; may have partial, full, or no network.",
            bullets: [
              "HMO: Network, PCP, referrals typical",
              "PPO: In/out-of-network; no referral required",
              "PFFS: Any willing provider",
              "MSA: High deductible + account",
            ],
            audioPath: "/assets/audio/mod2-1b.mp3",
          },
        ],
      },
      {
        id: "2-2",
        label: "Special Needs Plans",
        type: "topic",
        children: [
          {
            id: "2-2-a",
            label: "C-SNPs, I-SNPs, D-SNPs",
            type: "subtopic",
            body: "C-SNPs: Chronic conditions (diabetes, stroke, cancer, dementia, etc.). I-SNPs: Institutionalized 90+ days. IE-SNPs: Need institutional level of care but live in community. D-SNPs: Dual-eligible (Medicare + Medicaid). QMBs have protected cost-sharing.",
            bullets: [
              "C-SNP: Chronic conditions",
              "I-SNP: Institutionalized",
              "D-SNP: Dual-eligible",
              "QMB: Medicaid pays cost-sharing",
            ],
            audioPath: "/assets/audio/mod2-2a.mp3",
          },
        ],
      },
      {
        id: "2-3",
        label: "MA & Prescription Drugs",
        type: "topic",
        children: [
          {
            id: "2-3-a",
            label: "MA-PD vs Standalone PDP",
            type: "subtopic",
            body: "MA HMO/PPO: Part D only through the plan (MA-PD). MA PFFS or MSA without drug coverage: Can use standalone PDP. Cost plans: May offer Part D or use standalone PDP.",
            bullets: [
              "MA HMO/PPO: Must get Part D through plan",
              "PFFS/MSA without drugs: Can add standalone PDP",
            ],
            audioPath: "/assets/audio/mod2-3a.mp3",
          },
        ],
      },
    ],
    miniExamIds: ["p1", "p2", "p3", "ahip4", "ahip5", "ahip6", "ahip7"],
  },
  {
    moduleId: "3",
    title: "Part D Prescription Drug Coverage",
    introVideo: "/assets/intro-videos/module-3-intro.mp4",
    topics: [
      {
        id: "3-1",
        label: "Part D Basics",
        type: "topic",
        children: [
          {
            id: "3-1-a",
            label: "Eligibility & Plan Types",
            type: "subtopic",
            body: "Eligible: Entitled to Part A and/or enrolled in Part B; U.S. citizen or lawfully present. Plan types: Standalone PDP, MA-PD, Cost-PD, PACE. PDPs must enroll any eligible beneficiary regardless of health status.",
            bullets: [
              "Part A and/or Part B required",
              "PDP, MA-PD, Cost-PD, PACE",
              "No medical underwriting",
            ],
            audioPath: "/assets/audio/mod3-1a.mp3",
          },
          {
            id: "3-1-b",
            label: "Covered & Excluded Drugs",
            type: "subtopic",
            body: "Covered: Prescription drugs, biologics, insulin, diabetic supplies, vaccines not in Part B (shingles, RSV, etc.). Excluded: Weight loss/gain, fertility, cosmetic, cough/cold, most vitamins, erectile dysfunction (sexual use), OTC. Plans may offer supplemental benefits for some excluded drugs.",
            bullets: [
              "Prescription drugs, biologics, insulin",
              "Vaccines (shingles, RSV, Tdap)",
              "Excluded: OTC, many vitamins, ED drugs",
            ],
            audioPath: "/assets/audio/mod3-1b.mp3",
          },
        ],
      },
      {
        id: "3-2",
        label: "TrOOP & Coverage Phases",
        type: "topic",
        children: [
          {
            id: "3-2-a",
            label: "True Out-of-Pocket (TrOOP)",
            type: "subtopic",
            body: "TrOOP counts toward catastrophic coverage. Counts: Deductible, copays, coinsurance. Does not count: OTC, employer supplemental drug help, non-formulary drugs (unless exception), vitamins.",
            bullets: [
              "Deductible, copays, coinsurance count",
              "OTC, employer aid, vitamins don't",
              "IRA: Coverage gap eliminated 2025; cap 2025",
            ],
            audioPath: "/assets/audio/mod3-2a.mp3",
          },
          {
            id: "3-2-b",
            label: "Late Enrollment Penalty",
            type: "subtopic",
            body: "63+ days without creditable coverage = permanent 1% of national base premium per month unenrolled. Enroll before 63-day break when losing employer coverage.",
            bullets: [
              "63+ days without creditable = penalty",
              "1% per month, permanent",
              "SEP for loss of creditable coverage",
            ],
            audioPath: "/assets/audio/mod3-2b.mp3",
          },
        ],
      },
    ],
    miniExamIds: ["b4", "ahip6", "ahip7", "e4", "e5"],
  },
  {
    moduleId: "4",
    title: "Communications & Marketing Rules",
    introVideo: "/assets/intro-videos/module-4-intro.mp4",
    topics: [
      {
        id: "4-1",
        label: "Marketing Definitions",
        type: "topic",
        children: [
          {
            id: "4-1-a",
            label: "What is Marketing?",
            type: "subtopic",
            body: "Marketing = intent + content. Intent: Draw attention to a plan or influence choice. Content: Benefits, premiums, cost-sharing, rankings, Star Ratings, rewards. Mentioning broad categories (dental, vision, hearing) = marketing content.",
            bullets: [
              "Marketing = intent + content",
              "Benefits, premiums, Star Ratings = marketing",
              "Educational ≠ marketing (no plan-specific)",
            ],
            audioPath: "/assets/audio/mod4-1a.mp3",
          },
          {
            id: "4-1-b",
            label: "Scope of Appointment (SOA)",
            type: "subtopic",
            body: "Required before discussing specific plans. Valid 12 months from signature. Must be documented (written or recorded). No SOA = no plan-specific discussion.",
            bullets: [
              "Required before plan-specific discussion",
              "Valid 12 months from signature",
              "Document in writing or recording",
            ],
            audioPath: "/assets/audio/mod4-1b.mp3",
          },
        ],
      },
      {
        id: "4-2",
        label: "Events & Compensation",
        type: "topic",
        children: [
          {
            id: "4-2-a",
            label: "Educational vs Marketing Events",
            type: "subtopic",
            body: "Educational: No plan-specific; 12+ hours before marketing event. At educational: Light snacks $15 or less per person; business reply cards. Prohibited: Full meals, gift cards, plan applications.",
            bullets: [
              "12 hours between educational and marketing",
              "Educational: snacks $15 or less, BRCs",
              "No full meals, gift cards",
            ],
            audioPath: "/assets/audio/mod4-2a.mp3",
          },
          {
            id: "4-2-b",
            label: "Agent Compensation",
            type: "subtopic",
            body: "Pro-rata recoupment when members disenroll. Agent keeps compensation through month of disenrollment. Applies to captive and independent agents; not to plan employees. CMS marketing rules apply to all except plan employees.",
            bullets: [
              "Pro-rata recoupment on disenrollment",
              "Compensation through disenrollment month",
              "Applies to agents, not employees",
            ],
            audioPath: "/assets/audio/mod4-2b.mp3",
          },
        ],
      },
    ],
    miniExamIds: ["c1", "c2", "c3", "ahip8", "ahip9", "ahip10", "ahip11", "ahip12"],
  },
  {
    moduleId: "5",
    title: "Fraud, Waste & Abuse",
    introVideo: "/assets/intro-videos/module-5-intro.mp4",
    topics: [
      {
        id: "5-1",
        label: "FWA Definitions",
        type: "topic",
        children: [
          {
            id: "5-1-a",
            label: "Fraud, Waste, Abuse",
            type: "subtopic",
            body: "Fraud: Knowingly submitting false claims or misrepresentations to get federal payment; requires intent. Waste: Practices resulting in unnecessary costs (e.g., overuse); generally not criminally negligent. Abuse: Practices not meeting standards of care or medically necessary.",
            bullets: [
              "Fraud: Intent + knowledge",
              "Waste: Misuse of resources",
              "Abuse: Substandard care",
            ],
            audioPath: "/assets/audio/mod5-1a.mp3",
          },
          {
            id: "5-1-b",
            label: "Laws & Penalties",
            type: "subtopic",
            body: "18 USC 1347: Criminal health care fraud—up to 10 years imprisonment, fines up to $250,000. Civil penalties, exclusion from federal programs, contract termination.",
            bullets: [
              "18 USC 1347: Criminal penalties",
              "Up to 10 years, $250K fine",
              "Exclusion, contract termination",
            ],
            audioPath: "/assets/audio/mod5-1b.mp3",
          },
        ],
      },
      {
        id: "5-2",
        label: "Training & Reporting",
        type: "topic",
        children: [
          {
            id: "5-2-a",
            label: "FWA Training Requirements",
            type: "subtopic",
            body: "Within 90 days of initial hire; annually thereafter. Required for all Sponsor and FDR employees. Report suspected FWA through organizational compliance process.",
            bullets: [
              "90 days of hire, annually",
              "All employees and FDRs",
              "Report through compliance",
            ],
            audioPath: "/assets/audio/mod5-2a.mp3",
          },
        ],
      },
    ],
    miniExamIds: ["fwa1", "fwa2", "fwa3", "fwa4", "fwa5"],
  },
  {
    moduleId: "6",
    title: "Enrollment & Election Periods",
    introVideo: "/assets/intro-videos/module-5-intro.mp4",
    topics: [
      {
        id: "6-1",
        label: "Election Periods",
        type: "topic",
        children: [
          {
            id: "6-1-a",
            label: "AEP, OEP, IEP, SEP",
            type: "subtopic",
            body: "AEP: Oct 15–Dec 7; everyone can enroll, disenroll, or change. OEP: Jan 1–Mar 31; only for current MA enrollees (MA-to-MA or MA-to-Original). IEP/ICEP: When first eligible. SEP: Qualifying events (move, loss of creditable coverage, dual-eligible, etc.).",
            bullets: [
              "AEP: Oct 15–Dec 7, everyone",
              "OEP: Jan 1–Mar 31, MA enrollees only",
              "IEP: First eligibility",
              "SEP: Qualifying events",
            ],
            audioPath: "/assets/audio/mod6-1a.mp3",
          },
          {
            id: "6-1-b",
            label: "Disenrollment & Notifications",
            type: "subtopic",
            body: "Plans may offer grace period for non-payment or disenroll after notice. Plan must notify beneficiary within 10 calendar days in writing after CMS accepts enrollment.",
            bullets: [
              "10 days written notice after CMS acceptance",
              "Grace period for non-payment (plan option)",
              "Disenrollment during AEP/OEP or SEP",
            ],
            audioPath: "/assets/audio/mod6-1b.mp3",
          },
        ],
      },
    ],
    miniExamIds: ["e1", "e2", "e3", "ahip13", "ahip14", "ahip15", "ahip16"],
  },
];
