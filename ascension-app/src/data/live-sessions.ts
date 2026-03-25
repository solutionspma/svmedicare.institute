/**
 * Live Session Configuration
 * Configure live presenter/facilitator sessions for certification modules
 * 
 * To enable a live session:
 * 1. Set enabled: true for the module
 * 2. Choose platform: 'zoom' | 'teams' | 'cisco' | 'openmeeting'
 * 3. Add the meeting URL
 * 4. Set presenter name
 * 
 * The presenter window will appear on the module page when configured
 */

import type { PlatformType } from "@/components/PresenterWindow";

export type LiveSession = {
  /** Enable live session for this module */
  enabled: boolean;
  /** Platform type */
  platform: PlatformType;
  /** Meeting URL (will be auto-converted to embed URL) */
  meetingUrl: string;
  /** Presenter/facilitator name */
  presenterName: string;
  /** Optional: Session start time (for scheduling) */
  scheduledTime?: string;
  /** Optional: Session end time */
  scheduledEnd?: string;
  /** Auto-open presenter window */
  autoOpen?: boolean;
};

/**
 * Live sessions by module ID
 * Update these when scheduling live instruction
 */
export const LIVE_SESSIONS: Record<string, LiveSession> = {
  "1": {
    enabled: true,  // ✅ ENABLED for testing
    platform: "openmeeting",
    meetingUrl: "https://openmeeting.space/medicare-basics",
    presenterName: "Debbie Thompson",
    autoOpen: false,
    // scheduledTime: "2026-03-15T10:00:00",
    // scheduledEnd: "2026-03-15T11:30:00",
  },
  "2": {
    enabled: false,
    platform: "zoom",
    meetingUrl: "https://zoom.us/j/123456789",
    presenterName: "Medicare Expert",
    autoOpen: false,
  },
  "3": {
    enabled: false,
    platform: "teams",
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/...",
    presenterName: "Compliance Specialist",
    autoOpen: false,
  },
  "4": {
    enabled: false,
    platform: "cisco",
    meetingUrl: "https://company.webex.com/meet/instructor",
    presenterName: "Marketing Trainer",
    autoOpen: false,
  },
  "5": {
    enabled: false,
    platform: "openmeeting",
    meetingUrl: "https://openmeeting.space/fwa-training",
    presenterName: "FWA Compliance Officer",
    autoOpen: false,
  },
  "6": {
    enabled: false,
    platform: "openmeeting",
    meetingUrl: "https://openmeeting.space/enrollment-periods",
    presenterName: "Enrollment Specialist",
    autoOpen: false,
  },
};

/**
 * Get live session config for a module
 */
export function getLiveSession(moduleId: string): LiveSession | null {
  const session = LIVE_SESSIONS[moduleId];
  if (!session || !session.enabled) return null;
  
  // Check if session is scheduled and if it's the right time
  if (session.scheduledTime && session.scheduledEnd) {
    const now = new Date();
    const start = new Date(session.scheduledTime);
    const end = new Date(session.scheduledEnd);
    
    // Only show if within scheduled time window (or 15 min before)
    const earlyJoinBuffer = 15 * 60 * 1000; // 15 minutes in milliseconds
    if (now < new Date(start.getTime() - earlyJoinBuffer) || now > end) {
      return null;
    }
  }
  
  return session;
}

/**
 * Check if a live session is currently active
 */
export function isSessionActive(moduleId: string): boolean {
  return getLiveSession(moduleId) !== null;
}
