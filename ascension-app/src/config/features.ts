export const FEATURES = {
  /** Premium realtime voice (alias path with createRealtimeSession + WebRTC client). */
  AI_LIVE_CALL: false,
  /** PSTN bridge — placeholder only; must stay off unless explicitly enabled. */
  TELNYX_TRAINING: false,
  /** Tactical 3-column Call Lab shell (scenario pack, checklist, Connecture sim). */
  CALL_LAB_COMMAND_CENTER: true,
  /** Structured compliance reports + call attempt persistence for admin views. */
  COMPLIANCE_REPORTS: true,
  AI_CALL_MODE: false,
  LEADERBOARD: true,
  CERTIFICATION: true,
  TELNYX_MODE: false,
  /** Printable certificate + QR verification URL */
  PRINTABLE_CREDENTIALS: true,
  /** Public /training/verify + Netlify verifyCredential */
  CREDENTIAL_VERIFICATION: true,
  /** Manager roll-up (localStorage; replace with Supabase for org-wide) */
  AGENCY_DASHBOARD: true,
  /** Carrier-facing audit trail + CSV export */
  CARRIER_AUDIT_LOG: true,
  /** Modular certificates engine + printable viewer */
  PLATFORM_CERTIFICATES: true,
  /** Agency command center (/agency/dashboard) */
  PLATFORM_AGENCY_COMMAND: true,
  /** Compliance audit console (/agency/audit) */
  PLATFORM_AUDIT_CONSOLE: true,
  /** Require acknowledgment before AI live call (training + audit logging copy). */
  CALL_LAB_TRAINING_CONSENT: true,
} as const;
