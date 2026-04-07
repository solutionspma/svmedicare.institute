import raw from "@/data/eventTrainingHub.json";

export type EventTypeCard = {
  id: string;
  title: string;
  summary: string;
};

export type ComplianceBlock = {
  allowed: string[];
  prohibited: string[];
  disclaimers: string[];
  soaRules: string[];
};

export type EventScenario = {
  id: string;
  title: string;
  eventTypeId: string;
  instructions: string;
};

export type EventTrainingHubData = {
  eventTypes: EventTypeCard[];
  complianceByType: Record<string, ComplianceBlock>;
  scenarios: EventScenario[];
  checklist: {
    before: string[];
    during: string[];
    after: string[];
  };
};

export const eventTrainingHubData = raw as EventTrainingHubData;

export function complianceForType(typeId: string): ComplianceBlock | undefined {
  return eventTrainingHubData.complianceByType[typeId];
}
