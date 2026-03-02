"use client";

import { useState, useRef, useEffect } from "react";

type AudioPlayerProps = {
  src?: string;
  label?: string;
};

/**
 * Audio player for module introduction narration
 * Displays a sleek control bar with play/pause, progress, and time
 */
export function AudioPlayer({ src, label = "Module Introduction Audio" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // If no audio source, show a placeholder for upload
  if (!src) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border-gold)]/30 bg-black/20 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gold-accent)]/10">
            <span className="text-xl">🎵</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {label}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Upload audio to Supabase Storage: <code className="rounded bg-black/40 px-1.5 py-0.5">audio/module-intros/</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-lg border border-[var(--border-gold)]/30 bg-gradient-to-br from-black/40 to-[var(--gold-accent)]/5 p-4 shadow-lg">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={!isLoaded}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--gold-accent)] text-black transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Progress and Time */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              disabled={!isLoaded}
              className="flex-1 cursor-pointer appearance-none bg-transparent disabled:cursor-default [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--gold-accent)] [&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[var(--border-gold)]/30 [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[var(--border-gold)]/30 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--gold-accent)] [&::-webkit-slider-thumb]:-mt-1"
            />
            <span className="text-xs text-[var(--text-muted)]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Visual progress bar */}
          <div className="h-1 overflow-hidden rounded-full bg-[var(--border-gold)]/20">
            <div
              className="h-full bg-gradient-to-r from-[var(--gold-accent)] to-amber-300 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="mt-3 text-xs text-[var(--text-muted)]">
        🎧 {label}
      </p>
    </div>
  );
}
