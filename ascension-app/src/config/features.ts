export const FEATURES = {
  /** Disabled — ComplyTrack is static-only (no realtime voice). */
  AI_LIVE_CALL: false,
  /** PSTN bridge — placeholder only; must stay off unless explicitly enabled. */
  TELNYX_TRAINING: false,
  /** Static ComplyTrack training UI at /training/comply-track (JSON scenarios + checklist). */
  COMPLY_TRACK: true,
  /** Structured compliance reports + call attempt persistence for admin views. */
  COMPLIANCE_REPORTS: true,
  /** Legacy alias; kept off with ComplyTrack. */
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
  /** Acknowledgment before legacy AI live call (keep off with ComplyTrack-only training). */
  AI_CALL_TRAINING_CONSENT: false,
} as const;
