"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PlatformType = "zoom" | "teams" | "cisco" | "openmeeting" | "none";

type PresenterWindowProps = {
  /** Show presenter window by default */
  defaultOpen?: boolean;
  /** Meeting URL or embed code */
  meetingUrl?: string;
  /** Platform type */
  platform?: PlatformType;
  /** Presenter name */
  presenterName?: string;
};

/**
 * Live Presenter/Facilitator Window
 * Supports: Zoom, Microsoft Teams, Cisco WebEx, openmeeting.space
 * 
 * Can be embedded in certification modules for live instruction
 */
export function PresenterWindow({
  defaultOpen = false,
  meetingUrl,
  platform = "none",
  presenterName = "Instructor"
}: PresenterWindowProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);

  // If no platform or URL configured, don't render
  if (platform === "none" || !meetingUrl) {
    return null;
  }

  const platformConfig = {
    zoom: {
      name: "Zoom",
      icon: "📹",
      embedSupport: true,
      color: "from-blue-600/20 to-blue-400/10"
    },
    teams: {
      name: "Microsoft Teams",
      icon: "💼",
      embedSupport: true,
      color: "from-purple-600/20 to-purple-400/10"
    },
    cisco: {
      name: "Cisco WebEx",
      icon: "🎥",
      embedSupport: true,
      color: "from-green-600/20 to-green-400/10"
    },
    openmeeting: {
      name: "OpenMeeting.Space",
      icon: "🌐",
      embedSupport: true,
      color: "from-amber-600/20 to-amber-400/10"
    }
  };

  const config = platformConfig[platform] || platformConfig.openmeeting;

  // Generate appropriate embed URL based on platform
  const getEmbedUrl = () => {
    if (!meetingUrl) return "";
    
    // If already an embed URL, use it directly
    if (meetingUrl.includes("/embed") || meetingUrl.includes("?embed=")) {
      return meetingUrl;
    }

    // Platform-specific embed URL transformations
    switch (platform) {
      case "zoom":
        // Zoom embed format: https://zoom.us/wc/join/{meetingId}
        if (meetingUrl.includes("zoom.us/j/")) {
          const meetingId = meetingUrl.split("/j/")[1]?.split("?")[0];
          return `https://zoom.us/wc/join/${meetingId}`;
        }
        return meetingUrl;
      
      case "teams":
        // Teams can embed via iframe
        return meetingUrl;
      
      case "cisco":
        // Cisco WebEx embed format
        if (meetingUrl.includes("webex.com/meet/")) {
          return meetingUrl.replace("/meet/", "/embed/");
        }
        return meetingUrl;
      
      case "openmeeting":
        // OpenMeeting.Space embed format
        if (!meetingUrl.includes("?embed=true")) {
          return `${meetingUrl}${meetingUrl.includes("?") ? "&" : "?"}embed=true`;
        }
        return meetingUrl;
      
      default:
        return meetingUrl;
    }
  };

  const embedUrl = getEmbedUrl();

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-[var(--gold-accent)]/40 bg-gradient-to-r from-black/90 to-[var(--gold-accent)]/20 px-6 py-3 shadow-2xl backdrop-blur-sm transition-all hover:scale-105 hover:border-[var(--gold-accent)]/60 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
      >
        <span className="text-2xl">{config.icon}</span>
        <div className="text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-accent)]">
            Live Session
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Join {presenterName}
          </p>
        </div>
        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
      </motion.button>
    );
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-40 w-80 overflow-hidden rounded-lg border border-[var(--gold-accent)]/40 bg-black/95 shadow-2xl backdrop-blur-sm"
      >
        <div className={`flex items-center justify-between bg-gradient-to-r ${config.color} px-4 py-3`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {presenterName}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{config.name}</p>
            </div>
            <div className="ml-2 h-2 w-2 animate-pulse rounded-full bg-red-500" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--gold-accent)]"
              title="Maximize"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-[var(--text-muted)] transition-colors hover:bg-red-500/20 hover:text-red-400"
              title="Leave session"
            >
              ✕
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-6 z-50 flex flex-col overflow-hidden rounded-xl border border-[var(--gold-accent)]/40 bg-black shadow-2xl backdrop-blur-sm md:inset-8 lg:inset-12"
      >
        {/* Header */}
        <div className={`flex items-center justify-between bg-gradient-to-r ${config.color} px-4 py-3 md:px-6`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] md:text-base">
                Live with {presenterName}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{config.name} Session</p>
            </div>
            <div className="ml-2 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Live
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="rounded p-2 text-[var(--text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--gold-accent)]"
              title="Minimize"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-2 text-[var(--text-muted)] transition-colors hover:bg-red-500/20 hover:text-red-400"
              title="Leave session"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video embed */}
        <div className="relative flex-1 bg-black">
          <iframe
            src={embedUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="h-full w-full"
            title={`${config.name} Live Session with ${presenterName}`}
          />
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-[var(--border-gold)]/20 bg-black/50 px-4 py-2 backdrop-blur-sm md:px-6">
          <p className="text-xs text-[var(--text-muted)]">
            💡 Ask questions in the chat or raise your hand
          </p>
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--gold-accent)] hover:underline"
          >
            Open in {config.name} App →
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
