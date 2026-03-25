export type MockTranscript = {
  id: string;
  attemptId: string;
  lines: { role: "AGENT" | "BENEFICIARY" | "SYSTEM"; t: string; at: string }[];
};

export const MOCK_TRANSCRIPTS: MockTranscript[] = [
  {
    id: "trx-1",
    attemptId: "att-demo-1",
    lines: [
      { role: "AGENT", t: "Thank you for calling — my name is Alex. How may I assist you today?", at: "00:00" },
      {
        role: "BENEFICIARY",
        t: "I'm trying to understand Medicare Advantage options in my area.",
        at: "00:22",
      },
      { role: "SYSTEM", t: "Checklist: scope gate pending", at: "00:45" },
    ],
  },
];
