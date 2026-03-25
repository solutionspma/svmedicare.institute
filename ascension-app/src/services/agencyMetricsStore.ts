import type { AgencyAgentMetrics, AgencyDashboardSnapshot } from "@/types/agency";

const STORE_KEY = "svmi-agency-metrics-v1";
const DEFAULT_AGENCY_ID = "agency-demo-1";

type PersistedAgent = AgencyAgentMetrics;

type StoreShape = {
  agencyId: string;
  agencyName: string;
  updatedAt: number;
  agents: PersistedAgent[];
};

const SEED: PersistedAgent[] = [
  {
    userId: "npc-vex",
    displayName: "M. Ortega",
    sessionsLogged: 42,
    lastScore: 94,
    avgScore: 91,
    avgResponseTimeSec: 8.6,
    lastActivityAt: Date.now() - 86400000 * 2,
  },
  {
    userId: "npc-lynx",
    displayName: "T. Okonkwo",
    sessionsLogged: 31,
    lastScore: 88,
    avgScore: 89,
    avgResponseTimeSec: 8.8,
    lastActivityAt: Date.now() - 86400000,
  },
];

function read(): StoreShape {
  if (typeof window === "undefined") {
    return {
      agencyId: DEFAULT_AGENCY_ID,
      agencyName: "Demo Field Office",
      updatedAt: Date.now(),
      agents: SEED.map((a) => ({ ...a })),
    };
  }
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) {
      const initial: StoreShape = {
        agencyId: DEFAULT_AGENCY_ID,
        agencyName: "Demo Field Office",
        updatedAt: Date.now(),
        agents: SEED.map((a) => ({ ...a })),
      };
      return initial;
    }
    const parsed = JSON.parse(raw) as StoreShape;
    if (!parsed.agents || !Array.isArray(parsed.agents)) {
      return {
        agencyId: DEFAULT_AGENCY_ID,
        agencyName: "Demo Field Office",
        updatedAt: Date.now(),
        agents: SEED.map((a) => ({ ...a })),
      };
    }
    return parsed;
  } catch {
    return {
      agencyId: DEFAULT_AGENCY_ID,
      agencyName: "Demo Field Office",
      updatedAt: Date.now(),
      agents: SEED.map((a) => ({ ...a })),
    };
  }
}

function write(data: StoreShape): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function recordAgencyTrainingSession(args: {
  agentUserId: string;
  agentDisplayName: string;
  score: number;
  avgResponseTimeSec: number;
  profileId: string;
  difficultyKey: string;
}): void {
  const store = read();
  store.updatedAt = Date.now();
  let agent = store.agents.find((a) => a.userId === args.agentUserId);
  if (!agent) {
    agent = {
      userId: args.agentUserId,
      displayName: args.agentDisplayName,
      sessionsLogged: 0,
      lastScore: null,
      avgScore: 0,
      avgResponseTimeSec: 0,
      lastActivityAt: Date.now(),
    };
    store.agents.push(agent);
  }
  agent.displayName = args.agentDisplayName;
  agent.sessionsLogged += 1;
  agent.lastScore = args.score;
  agent.lastActivityAt = Date.now();
  const prevSum = agent.avgScore * (agent.sessionsLogged - 1);
  agent.avgScore = Math.round((prevSum + args.score) / agent.sessionsLogged);
  const prevRt = agent.avgResponseTimeSec * (agent.sessionsLogged - 1);
  agent.avgResponseTimeSec =
    Math.round(((prevRt + args.avgResponseTimeSec) / agent.sessionsLogged) * 10) / 10;
  write(store);
}

export function getAgencyDashboardSnapshot(): AgencyDashboardSnapshot {
  const s = read();
  const agents = [...s.agents].sort((a, b) => b.lastActivityAt - a.lastActivityAt);
  return {
    agencyId: s.agencyId,
    agencyName: s.agencyName,
    updatedAt: s.updatedAt,
    agents,
  };
}
