import type { LeaderboardEntry } from "@/types/leaderboard";

const LB_STORAGE = "call-lab-leaderboard-v1";
const USER_ID_KEY = "call-lab-user-id-v1";

type PersistedAgent = {
  userId: string;
  displayName: string;
  callsCompleted: number;
  scoreSum: number;
  responseSecSum: number;
};

type StoredShape = {
  agents: PersistedAgent[];
};

const SEED_DISPLAY: PersistedAgent[] = [
  {
    userId: "npc-vex",
    displayName: "M. Ortega",
    callsCompleted: 42,
    scoreSum: 3828,
    responseSecSum: 361.2,
  },
  {
    userId: "npc-lynx",
    displayName: "T. Okonkwo",
    callsCompleted: 31,
    scoreSum: 2871,
    responseSecSum: 272.8,
  },
  {
    userId: "npc-hale",
    displayName: "R. Hale",
    callsCompleted: 27,
    scoreSum: 2457,
    responseSecSum: 256.5,
  },
];

function cloneSeeds(): PersistedAgent[] {
  return SEED_DISPLAY.map((s) => ({ ...s }));
}

function readStore(): StoredShape {
  if (typeof window === "undefined") return { agents: [] };
  try {
    const raw = window.localStorage.getItem(LB_STORAGE);
    if (!raw) return { agents: cloneSeeds() };
    const parsed = JSON.parse(raw) as StoredShape;
    if (!parsed.agents || !Array.isArray(parsed.agents)) return { agents: cloneSeeds() };
    return parsed;
  } catch {
    return { agents: cloneSeeds() };
  }
}

function writeStore(data: StoredShape): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LB_STORAGE, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function getOrCreateLocalUserId(): string {
  if (typeof window === "undefined") return "offline-user";
  let id = window.localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = `you-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    window.localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export function recordLeaderboardSession(
  userId: string,
  displayName: string,
  complianceScore: number,
  avgResponseTimeSec: number
): void {
  const store = readStore();
  let agent = store.agents.find((a) => a.userId === userId);
  if (!agent) {
    agent = {
      userId,
      displayName,
      callsCompleted: 0,
      scoreSum: 0,
      responseSecSum: 0,
    };
    store.agents.push(agent);
  }
  agent.displayName = displayName;
  agent.callsCompleted += 1;
  agent.scoreSum += complianceScore;
  agent.responseSecSum += avgResponseTimeSec;
  writeStore(store);
}

export type LeaderboardRow = LeaderboardEntry & {
  displayName: string;
  avgResponseTimeSec: number;
};

export function getLeaderboardRows(): LeaderboardRow[] {
  const store = readStore();
  const rows: LeaderboardRow[] = store.agents.map((a) => {
    const score =
      a.callsCompleted > 0 ? Math.round(a.scoreSum / a.callsCompleted) : Math.round(a.scoreSum);
    const avgResponseTimeSec =
      a.callsCompleted > 0 ? Math.round((a.responseSecSum / a.callsCompleted) * 10) / 10 : 0;
    return {
      userId: a.userId,
      score,
      rank: 0,
      callsCompleted: a.callsCompleted,
      displayName: a.displayName,
      avgResponseTimeSec,
    };
  });

  rows.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.avgResponseTimeSec - b.avgResponseTimeSec;
  });

  rows.forEach((r, i) => {
    r.rank = i + 1;
  });

  return rows;
}
