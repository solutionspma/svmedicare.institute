/**
 * Topic → Lesson mapping: Full scenario-based lessons for each (topic, objective) pair
 * Content from AHIP QA Key, Your Medicare Benefits, Medicare Compliance & FWA
 * Stories and scenarios make the subject matter real.
 */

export type LessonContent = {
  objective: string;
  scenarioTitle: string;
  scenario: string;
  narrative: string;
  keyConcepts: string[];
  application: string;
  thinkAbout: string;
  takeaway: string;
};

/** Which objective indices apply to each topic (by topic id) */
export const TOPIC_OBJECTIVE_MAP: Record<string, number[]> = {
  // Module 1
  "1-1-a": [0, 1], // What is Medicare? → ways to get Medicare, eligibility
  "1-1-b": [0], // Ways to Get Medicare
  "1-2-a": [2, 3], // Part A → coverage, premiums
  "1-2-b": [2, 3], // Part B → coverage, premiums
  "1-3-a": [1, 2], // Part A & B Eligibility
  "1-3-b": [3], // Premiums & Cost-Sharing
  "1-4-a": [4], // Medigap
  "1-4-b": [4], // Medicare as Secondary
  // Module 2
  "2-1-a": [0, 1], // What is MA?
  "2-1-b": [1], // Plan Types
  "2-2-a": [2], // SNPs
  "2-3-a": [3, 4], // MA-PD vs PDP
  // Module 3
  "3-1-a": [0, 1],
  "3-1-b": [1],
  "3-2-a": [2],
  "3-2-b": [2],
  // Module 4
  "4-1-a": [0, 1],
  "4-1-b": [1],
  "4-2-a": [2, 3],
  "4-2-b": [3, 4],
  // Module 5
  "5-1-a": [0, 1],
  "5-1-b": [1],
  "5-2-a": [2, 3, 4],
  // Module 6
  "6-1-a": [0, 1],
  "6-1-b": [1, 2, 4],
};

/** Full lesson content: topicId_objectiveIndex → LessonContent */
export const TOPIC_LESSONS: Record<string, LessonContent> = {
  // ─── Module 1: Medicare Basics ────────────────────────────────────────────

  "1-1-a_0": {
    objective: "Explain the different ways to get Medicare benefits",
    scenarioTitle: "Mr. Schmidt Plans for Retirement",
    scenario:
      "Mr. Schmidt, 64, is planning his retirement. He asks you what Original Medicare covers and how it differs from the Medicare Advantage plan his neighbor has. He wants to understand his options before he turns 65.",
    narrative:
      "You explain that Medicare beneficiaries have two main paths. Original Medicare (Parts A and B) is fee-for-service coverage directly from the federal government—he can see any doctor or hospital that accepts Medicare, nationwide. No networks, no referrals required for specialists. His neighbor's Medicare Advantage plan is different: it's offered by a private company that contracts with Medicare. It covers the same Part A and B benefits but often bundles Part D and extra benefits like dental or gym memberships. The trade-off: MA plans use networks and may require referrals. Part D—prescription drugs—is always through a private plan, whether he chooses Original Medicare or Medicare Advantage.",
    keyConcepts: [
      "Original Medicare = Part A + B, fee-for-service, any Medicare provider",
      "Medicare Advantage = Part A + B (and often D) from a private plan",
      "Part D is always private—standalone PDP or bundled in MA-PD",
    ],
    application:
      "When you meet a prospect like Mr. Schmidt, don't assume one path is right. Ask about his doctors, prescriptions, travel habits, and budget. Match the path to his situation.",
    thinkAbout:
      "Why might someone prefer Original Medicare plus Medigap over Medicare Advantage? When might MA be the better fit?",
    takeaway: "Two paths: Original Medicare or Medicare Advantage. Part D is always private. Match the path to the beneficiary.",
  },

  "1-2-a_2": {
    objective: "Understand Part A and Part B coverage",
    scenarioTitle: "Mrs. Foster's Skilled Nursing Stay",
    scenario:
      "Mrs. Foster, 72, is covered by Original Medicare. She sustained a hip fracture and had a lengthy hospital stay. Her doctors feel she will need a month or two of nursing and rehabilitative care in a skilled nursing facility. She and her family ask: What does Medicare cover?",
    narrative:
      "You explain that Medicare Part A covers skilled nursing facility (SNF) care—but with specific rules. She must have had a qualifying 3-day inpatient hospital stay. Medicare covers the first 20 days of her SNF stay in full (after she's met the Part A deductible for the benefit period). For days 21 through 100, she'll pay a daily coinsurance amount. After 100 days in that benefit period, Medicare doesn't cover additional SNF days. The key: SNF care is for skilled needs—rehab, nursing care—not custodial care. Her doctors' recommendation for a month or two of rehab fits squarely within what Part A covers. You remind her that Medicare Advantage plans must cover at least as much as Original Medicare; some MA plans waive the 3-day stay requirement.",
    keyConcepts: [
      "SNF: Up to 100 days per benefit period; first 20 days fully covered after deductible",
      "3-day qualifying inpatient stay required for Original Medicare (MA may waive)",
      "Days 21–100: Daily coinsurance; after 100 days: no coverage",
    ],
    application:
      "When a beneficiary or family asks about SNF coverage, walk through the 3-day stay, benefit period, and cost-sharing. Document your explanation.",
    thinkAbout:
      "What happens if Mrs. Foster is discharged from the SNF, goes home for 60 days, then needs SNF again?",
    takeaway: "Part A SNF: 3-day stay, 20 days full, days 21–100 copay. Know the benefit period.",
  },

  "1-2-a_3": {
    objective: "Explain Original Medicare premiums and cost-sharing",
    scenarioTitle: "Understanding Mrs. Foster's SNF Costs",
    scenario:
      "Mrs. Foster's daughter is helping with her mother's care. She wants to know: What will Mom actually pay for the skilled nursing stay? Is there a cap on out-of-pocket costs?",
    narrative:
      "You explain that Part A has a deductible per benefit period (roughly $1,600+). Once that's met—often by the hospital stay—Part A covers the first 20 SNF days with no additional cost to Mrs. Foster. For days 21 through 100, there's a daily coinsurance (amount set annually; recently around $200/day). So for a 60-day SNF stay, she'd pay: $0 for days 1–20, then the daily copay for days 21–60. The critical point: Original Medicare has no out-of-pocket maximum. There's no cap. If Mrs. Foster had extended hospital and SNF stays, her costs could add up. That's why many beneficiaries add Medigap or choose Medicare Advantage, which has a required maximum out-of-pocket limit.",
    keyConcepts: [
      "Part A deductible: Per benefit period, not per year",
      "SNF days 21–100: Daily copay (amount changes annually)",
      "Original Medicare: No out-of-pocket cap",
    ],
    application:
      "Always explain that Original Medicare has no cap. For beneficiaries with high health needs, Medigap or MA may provide cost protection.",
    thinkAbout:
      "Why does Medicare use benefit periods instead of calendar years for Part A?",
    takeaway: "Part A: Deductible per benefit period; SNF copay days 21–100. No OOP cap with Original Medicare.",
  },

  "1-2-b_2": {
    objective: "Understand Part A and Part B coverage",
    scenarioTitle: "Dr. Sanchez and Part B Services",
    scenario:
      "Mr. Pham, a Qualified Medicare Beneficiary (QMB), visits his primary care provider Dr. Maria Sanchez for a bad cold. The normal copayment for the visit is $40. How much may Dr. Sanchez collect from Mr. Pham?",
    narrative:
      "You explain that Part B covers professional services—doctor visits, outpatient care, lab tests, durable medical equipment, and many preventive services. For most beneficiaries, Part B has an annual deductible and then 20% coinsurance for many services. But Mr. Pham is a QMB—Qualified Medicare Beneficiary. QMBs have Medicaid that pays their Medicare cost-sharing. Dr. Sanchez may only collect the minimal copayment that would apply under Medicaid, if any—not the full $40 the plan charges other enrollees. Providers cannot balance-bill QMBs above the Medicaid amount. This protection ensures dual-eligible beneficiaries can access care without being charged more than their state's Medicaid rules allow.",
    keyConcepts: [
      "Part B: Doctor visits, outpatient, lab tests, DME, preventive services",
      "QMB: Medicaid pays Medicare cost-sharing; providers cannot balance-bill above Medicaid amount",
      "20% coinsurance typical for many Part B services (after deductible)",
    ],
    application:
      "When working with dual-eligible beneficiaries, explain QMB protections. Providers must accept Medicaid reimbursement rates.",
    thinkAbout:
      "What if Dr. Sanchez doesn't accept Medicaid? Can she still see Mr. Pham?",
    takeaway: "Part B covers doctors and outpatient. QMBs: protected cost-sharing; no balance billing above Medicaid.",
  },

  "1-3-a_1": {
    objective: "Describe eligibility for Part A and Part B",
    scenarioTitle: "Mr. Bauer: Under 65 and Disabled",
    scenario:
      "Mr. Bauer is 49. Eighteen months ago he was declared disabled by the Social Security Administration and has been receiving disability payments. He asks whether he can get Medicare coverage.",
    narrative:
      "You tell Mr. Bauer that yes—after receiving Social Security disability benefits for 24 months, he will be automatically enrolled in Medicare, regardless of his age. He's at 18 months now, so in about 6 months he'll receive his Medicare card. He'll get Part A (usually premium-free since he has enough work history) and Part B. He'll need to decide whether to keep Part B or delay it if he has other coverage. You also mention that individuals with ALS (Lou Gehrig's disease) get Medicare immediately—no 24-month wait. Those with ESRD (end-stage renal disease) have different rules. For Mr. Bauer, the 24-month clock is the key.",
    keyConcepts: [
      "24 months of SSDI = automatic Medicare enrollment (under 65)",
      "ALS: No waiting period",
      "ESRD: Special rules",
    ],
    application:
      "When prospects are under 65 and disabled, confirm how long they've received SSDI. Set expectations for the 24-month mark.",
    thinkAbout:
      "What if Mr. Bauer had employer coverage during the 24 months? Does that change anything?",
    takeaway: "24 months of SSDI = Medicare. ALS = immediate. Know the eligibility paths.",
  },

  "1-3-a_2": {
    objective: "Understand Part A and Part B coverage",
    scenarioTitle: "Herber Noble: Lawfully Present, Ready to Enroll",
    scenario:
      "Herber Noble is turning 65 next month. He legally entered the U.S. over twenty years ago but is not a citizen. He has worked at Smallcap Inc. and contributed to Medicare. He has diabetes and wants to know if he can enroll in a Medicare Advantage plan.",
    narrative:
      "You explain that Herber is eligible for Medicare Advantage as long as he is entitled to Part A and enrolled in Part B. Eligibility for Medicare requires: (1) Age 65 or older (or 24 months SSDI, or ALS, or ESRD), and (2) U.S. citizen or lawfully admitted alien who has lived in the U.S. continuously for at least 5 years. Herber meets both. He should go to the Social Security website to enroll in Part A and B if he hasn't already. Once enrolled, he can choose a Medicare Advantage plan. His diabetes doesn't affect eligibility—Medicare and MA plans cannot use medical underwriting. He may even qualify for a C-SNP (Chronic Condition Special Needs Plan) tailored to diabetes if one is available in his area.",
    keyConcepts: [
      "Eligibility: 65+ or 24mo SSDI or ALS or ESRD; citizen or lawfully present 5+ years",
      "No medical underwriting for Medicare or MA",
      "Enroll in Part A and B first, then choose MA",
    ],
    application:
      "Lawfully present residents with 5+ years can enroll. Direct them to Social Security for Part A/B, then to you for MA.",
    thinkAbout:
      "What if Herber had only been in the U.S. for 3 years? What about someone in Puerto Rico?",
    takeaway: "Eligibility: 65+ or disability; citizen or 5+ years lawfully present. No underwriting.",
  },

  "1-3-b_3": {
    objective: "Explain Original Medicare premiums and cost-sharing",
    scenarioTitle: "Ms. Henderson and the Part B Premium",
    scenario:
      "Ms. Henderson has worked for 40 years and paid Medicare taxes. She believes she will qualify for Medicare at 65 without paying any premiums. What should you tell her?",
    narrative:
      "You explain that Part A is usually premium-free for someone with 40 or more quarters of Medicare-covered employment. She's correct there. But Part B is different. Everyone pays a Part B premium—there is no free Part B. She'll pay the standard monthly premium. If her income is higher (based on tax returns from two years ago), she may pay more due to IRMAA—the Income-Related Monthly Adjustment Amount. Part A covers hospital, SNF, hospice, home health. Part B covers doctors, outpatient, preventive care. She needs both for comprehensive coverage. You congratulate her on her work history—premium-free Part A is a real benefit—and set expectations for Part B.",
    keyConcepts: [
      "Part A: Often premium-free with 40+ quarters",
      "Part B: Always has a premium; IRMAA for higher income",
      "Part B covers doctors and outpatient—essential for most beneficiaries",
    ],
    application:
      "Many beneficiaries are surprised Part B isn't free. Explain clearly; it avoids confusion at enrollment.",
    thinkAbout:
      "What if Ms. Henderson delays Part B because she has employer coverage? What happens when she retires?",
    takeaway: "Part A can be free; Part B always has a premium. Set expectations early.",
  },

  "1-4-a_4": {
    objective: "Describe Medigap and when Medicare is secondary to employer plans",
    scenarioTitle: "Mr. Moy and Medicare Supplemental Insurance",
    scenario:
      "Mr. Moy will soon turn 65. His wife has a Medicare Advantage plan, but his health care needs are different. He wants to understand what Medicare Supplemental Insurance (Medigap) provides.",
    narrative:
      "You explain that Medigap helps cover costs that Original Medicare doesn't—the Part A deductible, Part B coinsurance and copays, and sometimes services Medicare doesn't cover at all. It works only with Original Medicare, not with Medicare Advantage. His wife's MA plan is different: it replaces Original Medicare. For Mr. Moy, if he chooses Original Medicare, a Medigap plan would fill the gaps. The best time to buy is during the 6-month Medigap Open Enrollment Period, which starts the month he's 65 or older and enrolled in Part B. During that window, insurers cannot deny him or charge more for pre-existing conditions. After that, he may face medical underwriting. Medigap does not include prescription drugs—he'd need a standalone Part D plan. Standardized plans are labeled A through N; coverage varies by letter.",
    keyConcepts: [
      "Medigap: Fills gaps in Original Medicare—deductibles, coinsurance, copays",
      "6-month open enrollment after Part B starts—guaranteed issue",
      "Does not include drugs; pairs with standalone PDP",
    ],
    application:
      "When prospects compare MA vs Original Medicare + Medigap, explain the Medigap enrollment window. Missing it matters.",
    thinkAbout:
      "Why might Mr. Moy prefer Original Medicare + Medigap over his wife's MA plan?",
    takeaway: "Medigap fills gaps. Best window: 6 months after Part B. No drugs—add PDP.",
  },

  "1-4-b_4": {
    objective: "Describe Medigap and when Medicare is secondary to employer plans",
    scenarioTitle: "Mrs. Thomas and the Special Enrollment Period",
    scenario:
      "Mrs. Thomas is 66, has employer coverage, and will retire next year. She heard she must enroll in Part B at the start of the year to avoid a gap. What can you tell her?",
    narrative:
      "You explain that she has a Special Enrollment Period (SEP) when she loses employer coverage. She may enroll in Part B at any time while still covered by her employer plan. But the key: she has an 8-month period that starts the month after the last month of employer coverage. During that SEP, she can enroll in Part B without a late enrollment penalty—even if she delayed Part B when she first turned 65 because she had employer coverage. She does not need to enroll at the start of the year. She should enroll before the 8 months run out to avoid a gap and a penalty. When her employer sends the termination notice, she'll know her last month of coverage. The 8-month clock starts the next month.",
    keyConcepts: [
      "SEP for loss of employer coverage: 8 months from last month of coverage",
      "No late enrollment penalty if she had creditable coverage",
      "Enroll before the 8 months end to avoid gap",
    ],
    application:
      "Counsel beneficiaries with employer coverage: document the end date, enroll during the SEP, keep proof of creditable coverage.",
    thinkAbout:
      "What if Mrs. Thomas's employer has fewer than 20 employees? Does that change Medicare's role?",
    takeaway: "8-month SEP after employer coverage ends. No penalty with creditable coverage. Don't miss the window.",
  },

  // ─── Module 2: Plan Types ─────────────────────────────────────────────────

  "2-1-a_0": {
    objective: "Compare Original Medicare vs Medicare Advantage",
    scenarioTitle: "Tariq Considers Switching to MA",
    scenario:
      "Tariq is a Medicare beneficiary considering switching to a Medicare Advantage plan during Open Enrollment. He's read about prior authorization and referrals. What type of plans can require them?",
    narrative:
      "You explain that Medicare Advantage plans are offered by private companies approved by Medicare. They must cover everything Original Medicare covers (except hospice, which stays with Original Medicare). Many include Part D and extra benefits. The trade-off: MA plans use networks and management tools. PPO plans can require prior authorization for both in-network and out-of-network services. HMOs typically require a primary care physician and referrals for specialists. PFFS plans allow any provider who accepts the plan's terms. MSA plans combine a high deductible with a savings account. Compared to Original Medicare, MA offers a maximum out-of-pocket limit and often $0 or low premiums, but beneficiaries give up the freedom to see any Medicare provider without network or referral rules.",
    keyConcepts: [
      "MA must cover at least what Original Medicare covers",
      "PPO: Prior auth possible for in- and out-of-network",
      "HMO: PCP and referrals typical",
    ],
    application:
      "When prospects consider MA, explain network and prior auth. Match plan type to their needs.",
    thinkAbout:
      "Why might someone on Original Medicare consider switching to MA during OEP?",
    takeaway: "MA = networks and management. PPO/HMO differ. Compare to Original Medicare.",
  },

  "2-1-b_1": {
    objective: "Explain HMO, PPO, PFFS, and MSA plan types",
    scenarioTitle: "Mr. Trevino and the PFFS Plan",
    scenario:
      "Mr. Trevino's current HMO requires him to use network doctors. He sees a PFFS plan with an attractive premium. He wants to know: Must he use doctors in a network?",
    narrative:
      "You explain that with a Private Fee-for-Service (PFFS) plan, he may receive care from any doctor who is allowed to bill Medicare—if he shows the doctor his plan ID card and the doctor agrees to accept the PFFS plan's payment terms and conditions. There is no formal network. The catch: the doctor can choose to accept or not accept the plan; if they don't accept, he'd need to find another provider. PFFS plans can also allow balance billing in some cases. Compare that to his HMO: network only (except emergencies), often a PCP and referrals. Or a PPO: in-network costs less, out-of-network costs more. MSA: high deductible plus savings account. Each type has trade-offs. For Mr. Trevino, PFFS offers flexibility but less predictability than an HMO network.",
    keyConcepts: [
      "PFFS: Any provider who accepts plan terms; no formal network",
      "HMO: Network only; PCP and referrals",
      "PPO: In/out-of-network; higher cost out-of-network",
    ],
    application:
      "Explain PFFS flexibility and the risk of providers not accepting. Document the conversation.",
    thinkAbout:
      "When might a beneficiary prefer PFFS over an HMO or PPO?",
    takeaway: "PFFS: any willing provider. No network, but acceptance isn't guaranteed.",
  },

  "2-2-a_2": {
    objective: "Describe Special Needs Plans (SNPs) and eligibility",
    scenarioTitle: "Mr. Dalton and SNP Eligibility",
    scenario:
      "Mr. Dalton is in excellent health, lives in his own home, and has a sizeable income from investments. He asks if he can enroll in a Special Needs Plan (SNP).",
    narrative:
      "You explain that SNPs limit enrollment to specific populations. He cannot enroll in an SNP—he doesn't meet the criteria. C-SNPs are for chronic conditions (diabetes, heart failure, dementia, etc.). I-SNPs are for institutionalized beneficiaries (90+ days). D-SNPs are for dual-eligible beneficiaries (Medicare + Medicaid). Mr. Dalton doesn't fit any of these. SNPs tailor benefits and care management to their population. For someone like Mr. Dalton, a standard Medicare Advantage HMO or PPO—or Original Medicare plus Medigap—would be appropriate. You use this as a chance to explain the SNP types so he can recognize when a prospect might qualify.",
    keyConcepts: [
      "C-SNP: Chronic conditions",
      "D-SNP: Dual-eligible (Medicare + Medicaid)",
      "I-SNP: Institutionalized 90+ days",
    ],
    application:
      "Verify SNP eligibility before enrollment. Enrolling ineligible beneficiaries causes problems.",
    thinkAbout:
      "What if Mr. Dalton had diabetes? Would he automatically qualify for a C-SNP?",
    takeaway: "SNPs are for specific populations. Verify eligibility. No SNPs for everyone.",
  },

  "1-2-b_3": {
    objective: "Explain Original Medicare premiums and cost-sharing",
    scenarioTitle: "Part B Deductible and Coinsurance",
    scenario:
      "A beneficiary has met her Part B deductible this year. She visits her doctor for a follow-up. The Medicare-approved amount is $150. How much does she pay?",
    narrative:
      "After the annual Part B deductible is met, beneficiaries typically pay 20% of the Medicare-approved amount for most covered services when the provider accepts assignment. So for a $150 service, she'd pay $30 (20% of $150). Medicare pays the rest. If the provider doesn't accept assignment, they can charge up to 15% more (the limiting charge). Part B has no out-of-pocket maximum—costs can add up over the year. Preventive services like annual wellness visits often have $0 cost-sharing when the provider accepts assignment. Always confirm the provider accepts assignment and ask about cost before receiving non-emergency care.",
    keyConcepts: [
      "20% coinsurance typical for many Part B services after deductible",
      "Assignment: Provider accepts Medicare amount; no balance billing above limiting charge",
      "No OOP cap with Original Medicare",
    ],
    application:
      "When explaining costs, use the 20% rule. Recommend beneficiaries confirm assignment before visits.",
    thinkAbout:
      "What if the beneficiary has a Medigap plan? How does that change her cost?",
    takeaway: "Part B: 20% coinsurance after deductible. Assignment matters. No cap.",
  },

  "2-3-a_3": {
    objective: "Understand Part D coverage, formularies, and TrOOP",
    scenarioTitle: "Jerry Smith Needs Part D",
    scenario:
      "Jerry Smith has Medicare Parts A and B and a Medigap plan he's had for years. The Medigap plan does not provide drug benefits. How should you advise him?",
    narrative:
      "You recommend that Jerry add a standalone Part D prescription drug plan (PDP) to his coverage. Medigap does not include prescription drugs. Without Part D, he risks a late enrollment penalty if he goes 63+ days without creditable drug coverage and enrolls later. He should compare PDPs in his area—formularies, premiums, cost-sharing—and enroll during AEP if he's making a change, or during a valid SEP if he has one. If he were on a Medicare Advantage plan that included drug coverage (MA-PD), he wouldn't need a standalone PDP. But with Original Medicare + Medigap, Part D is a separate decision.",
    keyConcepts: [
      "Medigap does not include drugs",
      "Standalone PDP pairs with Original Medicare or MA plans without drug coverage",
      "63+ days without creditable coverage = penalty",
    ],
    application:
      "Always ask about current drug coverage. Medigap + PDP is common. Avoid the penalty.",
    thinkAbout:
      "What if Jerry had employer drug coverage? When would he need to enroll in Part D?",
    takeaway: "Medigap = no drugs. Add standalone PDP. Avoid the 63-day gap.",
  },

  // ─── Module 5: FWA (sample) ───────────────────────────────────────────────

  "5-1-a_0": {
    objective: "Define fraud, waste, and abuse in the Medicare context",
    scenarioTitle: "Spotting Red Flags in the Field",
    scenario:
      "An agent in your office mentions that a provider partner has been asking beneficiaries to sign blank forms \"to speed up enrollment.\" Another agent reports that a pharmacy is offering gift cards for switching Part D plans. How do you categorize these?",
    narrative:
      "You explain the definitions. Fraud is knowingly submitting false claims or misrepresentations to obtain federal payment—it requires intent. Blank forms could facilitate fraud if they're later filled in with false information. Waste involves unnecessary costs—overuse of services, inefficiency. Abuse involves practices that don't meet standards of care or aren't medically necessary—it may not rise to fraud but still harms the program. The gift cards for switching could be a prohibited inducement or kickback. You stress: when in doubt, report. Good-faith reporting is protected. The compliance team and law enforcement will determine the proper categorization. Your job is to recognize red flags and escalate.",
    keyConcepts: [
      "Fraud: Intent + false claims or misrepresentations",
      "Waste: Unnecessary costs",
      "Abuse: Substandard or medically unnecessary",
    ],
    application:
      "Train agents to recognize red flags. Document and report. Never participate in or ignore suspicious activity.",
    thinkAbout:
      "What's the difference between a marketing violation and FWA? Can they overlap?",
    takeaway: "Fraud = intent. Waste = unnecessary cost. Abuse = substandard. Report red flags.",
  },

  // ─── Module 6: Enrollment (sample) ───────────────────────────────────────

  "6-1-a_0": {
    objective: "Explain AEP, OEP, IEP, and key SEPs",
    scenarioTitle: "When Can Maria Change Her Plan?",
    scenario:
      "Maria is 66 and on a Medicare Advantage plan. She's unhappy with her plan's network. Her friend said she can change during \"open enrollment.\" When exactly can she switch?",
    narrative:
      "You explain the periods. AEP (Annual Enrollment Period) runs October 15–December 7. Everyone can enroll, disenroll, or change MA or Part D. Changes take effect January 1. OEP (Open Enrollment Period) runs January 1–March 31. It's only for people already in an MA plan. Maria can switch to another MA plan or to Original Medicare plus Part D. She gets one change during OEP per year. If she wants to change during AEP, she'd do it Oct 15–Dec 7 for a Jan 1 effective date. IEP (Initial Enrollment Period) is for people first becoming eligible—the 7 months around their 65th birthday. SEPs apply for qualifying events like moving, losing employer coverage, or becoming dual-eligible. For Maria, AEP or OEP are her main windows.",
    keyConcepts: [
      "AEP: Oct 15–Dec 7; everyone; effective Jan 1",
      "OEP: Jan 1–Mar 31; MA enrollees only; one change",
      "IEP: 7 months around 65",
    ],
    application:
      "Explain AEP vs OEP clearly. Document the period used for enrollment.",
    thinkAbout:
      "What if Maria moves to a new county in February? Does she get an SEP?",
    takeaway: "AEP: everyone. OEP: MA only. Know the calendar.",
  },

  // ─── Module 3 & 4: Compliance (sample) ─────────────────────────────────────

  "3-1-a_0": {
    objective: "Identify CMS marketing requirements for MA and Part D",
    scenarioTitle: "Angel's Educational vs Marketing Event",
    scenario:
      "Angel holds an educational seminar at 9am. A prospect asks when he can hold a marketing meeting to discuss specific plans. What's the rule?",
    narrative:
      "You explain that CMS requires at least 12 hours between an educational event and a marketing event. So if Angel's educational seminar is at 9am, he cannot hold the marketing meeting until at least 9pm the same day—or ideally the next day to avoid any confusion. Educational events provide general Medicare information with no plan-specific discussion. Marketing events promote specific plans and require a Scope of Appointment (SOA). At educational events: light snacks $15 or less per person, business reply cards. No full meals, gift cards, or plan applications. The 12-hour rule prevents beneficiaries from feeling pressured or confused about the purpose of each event.",
    keyConcepts: [
      "12+ hours between educational and marketing events",
      "Educational: no plan-specific content",
      "Marketing: SOA required",
    ],
    application:
      "Schedule events with the 12-hour rule in mind. Document event type and time.",
    thinkAbout:
      "What if Angel holds the marketing event at 10pm the same day? Is that compliant?",
    takeaway: "12 hours between educational and marketing. Document and separate.",
  },

  "4-1-b_1": {
    objective: "Document Scope of Appointment (SOA) and timing rules",
    scenarioTitle: "The Prospect Who Wants to \"Just Talk\"",
    scenario:
      "A prospect calls and says they want to \"just learn about Medicare\"—no specific plans. Halfway through the call they ask about Plan X. You don't have an SOA. What do you do?",
    narrative:
      "You pause and explain that before discussing any specific plan, you need a Scope of Appointment. You can continue with general Medicare education—eligibility, parts, enrollment periods—but the moment they ask about Plan X, you've crossed into plan-specific territory. You obtain an SOA (written or recorded, valid 12 months) and then you can discuss Plan X. No SOA means no plan-specific discussion. It protects both you and the beneficiary. Document the SOA and keep it on file. If you had discussed Plan X without an SOA, you'd be out of compliance.",
    keyConcepts: [
      "SOA required before plan-specific discussion",
      "General education is fine without SOA",
      "Valid 12 months from signature",
    ],
    application:
      "Train agents to recognize the line. When in doubt, get the SOA first.",
    thinkAbout:
      "Can you take an SOA over the phone? What format is acceptable?",
    takeaway: "No SOA = no plan-specific. Get it first.",
  },
};

/** Get objectives that apply to a topic. If no mapping, returns all indices 0..4 for module fallback. */
export function getObjectivesForTopic(topicId: string, totalObjectives: number = 5): number[] {
  const mapped = TOPIC_OBJECTIVE_MAP[topicId];
  if (mapped && mapped.length > 0) return mapped;
  return Array.from({ length: totalObjectives }, (_, i) => i);
}

/** Get lesson for (topicId, objectiveIndex) */
export function getLessonForTopic(topicId: string, objectiveIndex: number): LessonContent | null {
  const key = `${topicId}_${objectiveIndex}`;
  return TOPIC_LESSONS[key] ?? null;
}
