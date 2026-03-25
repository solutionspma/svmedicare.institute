export const difficultyLevels = {
  EASY: {
    label: "Easy",
    aiBehavior: "cooperative",
    complianceTolerance: "high",
    interruptions: false,
  },
  MEDIUM: {
    label: "Medium",
    aiBehavior: "neutral",
    complianceTolerance: "moderate",
    interruptions: true,
  },
  HARD: {
    label: "Hard",
    aiBehavior: "challenging",
    complianceTolerance: "low",
    interruptions: true,
  },
  ELITE: {
    label: "Elite",
    aiBehavior: "hostile",
    complianceTolerance: "strict",
    interruptions: true,
  },
} as const;

export type DifficultyLevelKey = keyof typeof difficultyLevels;
