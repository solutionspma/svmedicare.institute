export const aiCallerProfiles = [
  {
    id: "cooperative_senior",
    name: "Mary Thompson",
    tone: "calm",
    personality: "polite, patient, listens carefully",
    behavior: "answers clearly, gives info easily",
    difficultyModifier: 0.8,
  },
  {
    id: "confused_beneficiary",
    name: "Robert Jenkins",
    tone: "uncertain",
    personality: "confused, asks repeated questions",
    behavior: "needs clarification, forgets info",
    difficultyModifier: 1.0,
  },
  {
    id: "skeptical_caller",
    name: "Linda Harris",
    tone: "guarded",
    personality: "suspicious, questions legitimacy",
    behavior: "asks how agent got info",
    difficultyModifier: 1.2,
  },
  {
    id: "impatient_caller",
    name: "James Carter",
    tone: "rushed",
    personality: "short-tempered, wants quick answers",
    behavior: "interrupts, pushes for fast info",
    difficultyModifier: 1.3,
  },
  {
    id: "hostile_caller",
    name: "Diane Brooks",
    tone: "aggressive",
    personality: "confrontational, challenges agent",
    behavior: "accuses, questions compliance",
    difficultyModifier: 1.5,
  },
] as const;

export type AICallerProfileId = (typeof aiCallerProfiles)[number]["id"];
