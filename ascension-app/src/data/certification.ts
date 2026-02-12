/**
 * SV Medicare Institute Certification Course
 * Based on: The Only Medicare Book You Need, AHIP Modules 1-5, Medicare Compliance & FWA
 * Effective, not exhaustive — key competencies for insurance professionals
 */

export type CertificationModule = {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  duration: string;
  contentSlug: string;
  /** ElevenLabs: scene/video placeholder — path to asset when ready */
  videoPlaceholder?: string;
};

export const CERTIFICATION_MODULES: CertificationModule[] = [
  {
    id: "1",
    title: "Medicare Program Basics",
    description: "Eligibility, Parts A & B, Original Medicare, premiums, and Medigap.",
    objectives: [
      "Explain the different ways to get Medicare benefits",
      "Describe eligibility for Part A and Part B",
      "Understand Part A and Part B coverage",
      "Explain Original Medicare premiums and cost-sharing",
      "Describe Medigap and when Medicare is secondary to employer plans",
    ],
    duration: "~15 min",
    contentSlug: "basics",
    videoPlaceholder: "/assets/elevenlabs/module-1-intro.mp4",
  },
  {
    id: "2",
    title: "Plan Types & Benefits",
    description: "Medicare Advantage, PFFS, MSA, SNPs, Part D, and TrOOP.",
    objectives: [
      "Compare Original Medicare vs Medicare Advantage",
      "Explain HMO, PPO, PFFS, and MSA plan types",
      "Describe Special Needs Plans (SNPs) and eligibility",
      "Understand Part D coverage, formularies, and TrOOP",
      "Explain when standalone Part D pairs with MA plans",
    ],
    duration: "~20 min",
    contentSlug: "plans",
    videoPlaceholder: "/assets/elevenlabs/module-2-intro.mp4",
  },
  {
    id: "3",
    title: "Compliance & Marketing",
    description: "CMS marketing rules, SOA, educational vs marketing events, compensation.",
    objectives: [
      "Identify CMS marketing requirements for MA and Part D",
      "Explain Scope of Appointment (SOA) and timing rules",
      "Distinguish educational events from marketing events",
      "Understand agent compensation and pro-rata recoupment",
      "Recognize prohibited marketing practices",
    ],
    duration: "~20 min",
    contentSlug: "compliance",
    videoPlaceholder: "/assets/elevenlabs/module-3-intro.mp4",
  },
  {
    id: "4",
    title: "Communications & Marketing Rules",
    description: "Marketing definitions, SOA, events, compensation, and CMS requirements.",
    objectives: [
      "Explain what constitutes marketing vs educational content",
      "Document Scope of Appointment (SOA) and timing rules",
      "Distinguish educational from marketing events",
      "Understand agent compensation and pro-rata recoupment",
      "Recognize prohibited marketing practices",
    ],
    duration: "~20 min",
    contentSlug: "compliance",
    videoPlaceholder: "/assets/elevenlabs/module-4-intro.mp4",
  },
  {
    id: "5",
    title: "Fraud, Waste & Abuse",
    description: "FWA definitions, reporting obligations, and penalties.",
    objectives: [
      "Define fraud, waste, and abuse in the Medicare context",
      "Identify major FWA laws and regulations",
      "Recognize consequences and penalties",
      "Know how to report suspected FWA",
      "Understand corrective action requirements",
    ],
    duration: "~15 min",
    contentSlug: "fwa",
    videoPlaceholder: "/assets/elevenlabs/module-5-intro.mp4",
  },
  {
    id: "6",
    title: "Enrollment & Election Periods",
    description: "AEP, OEP, IEP, SEP, disenrollment, and consumer protections.",
    objectives: [
      "Explain AEP, OEP, IEP, and key SEPs",
      "Understand creditable coverage and late enrollment penalty",
      "Describe disenrollment rules and grace periods",
      "Explain dual-eligible and LIS enrollment",
      "Understand plan notification and timing requirements",
    ],
    duration: "~15 min",
    contentSlug: "enrollment",
    videoPlaceholder: "/assets/elevenlabs/module-5-intro.mp4",
  },
];

export const CERTIFICATION_EXAM_CONFIG = {
  questionsPerModule: 4,
  totalQuestions: 20,
  passThreshold: 0.7, // 70%
  timeLimitMinutes: 30,
};
