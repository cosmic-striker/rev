"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

export default function ShowreelModal({
  triggerLabel = "Play Showreel",
  variant = "primary",
  showIcon = true,
  className = "",
  iconOverride,
}: {
  triggerLabel?: string;
  variant?: "primary" | "inline";
  showIcon?: boolean;
  className?: string;
  iconOverride?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(40);

  const close = useCallback(() => {
    setOpen(false);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  useEffect(() => {
    if (!open || !playing) return;
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.6));
    }, 120);
    return () => window.clearInterval(id);
  }, [open, playing]);

  const triggerClasses = iconOverride
    ? className
    : variant === "primary"
      ? `inline-flex items-center gap-space-sm bg-primary-container text-on-primary-fixed font-label-md text-label-md uppercase tracking-[0.18em] px-space-lg py-space-md rounded-lg hover:shadow-[0_0_24px_rgba(0,229,255,0.6)] hover:-translate-y-0.5 transition-all duration-200 ${className}`
      : `inline-flex items-center gap-space-sm text-on-surface font-label-md text-label-md uppercase tracking-[0.18em] px-space-lg py-space-md rounded-lg bg-white/[0.04] border border-white/15 hover:border-primary-container hover:text-primary transition-all duration-200 ${className}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClasses}
        aria-label={iconOverride ? "Play showreel" : undefined}
      >
        {iconOverride ? (
          iconOverride
        ) : (
          <>
            {showIcon && <Icon name="play_arrow" className="text-body-lg" filled />}
            {triggerLabel}
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-margin"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Showreel player"
        >
          <div className="relative w-full max-w-4xl shadow-glass-elev">
            <div className="flex items-center justify-between px-space-md py-space-sm border-b border-white/10 bg-[rgba(13,14,17,0.9)] rounded-t-xl">
              <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-primary">
                Now Playing • Resolution Club Master Reel 2025
              </span>
              <button
                onClick={close}
                className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase text-on-surface-variant hover:text-primary"
                aria-label="Close player"
              >
                close
                <Icon name="close" className="text-body-sm" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-gradient-to-br from-surface-container-lowest via-surface-container to-surface-container-high overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-primary-container/30 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                </div>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,229,255,0.15),transparent_60%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-space-md bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-space-md">
                  <button
                    onClick={() => setPlaying((v) => !v)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-container text-on-primary-fixed"
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    <Icon name={playing ? "pause" : "play_arrow"} className="text-base" filled />
                  </button>
                  <Icon name="replay_10" className="text-on-surface" />
                  <div className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full bg-primary-container transition-[width] duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                    01:08 / 02:48
                  </span>
                  <Icon name="volume_up" className="text-on-surface" />
                  <span className="font-label-sm text-label-sm uppercase text-outline hidden sm:inline">
                    ProRes 4444 XQ • 24.000 FPS
                  </span>
                  <Icon name="fullscreen" className="text-on-surface" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
