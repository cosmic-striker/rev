"use client";

import { useEffect, useRef, useState } from "react";

const format = (num: number) => num.toString().padStart(2, "0");

export default function CinemaHUD() {
  const [cineMode, setCineMode] = useState<"24FPS" | "60FPS" | "120FPS">("24FPS");
  const [audioActive, setAudioActive] = useState(true);
  const timecodeRef = useRef<HTMLSpanElement>(null);

  // 24 fps timecode driven outside React to avoid 24 re-renders per second.
  useEffect(() => {
    let frame = 0;
    let lastUpdate = 0;
    const start = performance.now();
    const baseFrames = 19 * 60 * 24 + 44 * 24 + 12;

    const tick = (now: number) => {
      if (now - lastUpdate >= 1000 / 24) {
        lastUpdate = now;
        const totalFrames =
          baseFrames + Math.floor(((now - start) / 1000) * 24);
        const frames = totalFrames % 24;
        const seconds = Math.floor(totalFrames / 24) % 60;
        const minutes = Math.floor(totalFrames / 1440) % 60;
        const hours = Math.floor(totalFrames / 86400) % 24;

        if (timecodeRef.current) {
          timecodeRef.current.textContent = `REC [${format(hours)}:${format(
            minutes
          )}:${format(seconds)}:${format(frames)}]`;
        }
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="w-full bg-surface-container-lowest border-b border-surface-variant/40 px-gutter py-1.5 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm select-none z-40 relative">
      <div className="flex items-center gap-space-md overflow-hidden whitespace-nowrap">
        {/* REC Indicator */}
        <div className="flex items-center gap-space-xs text-primary-fixed bg-surface-container px-2 py-0.5 border border-primary-fixed/30">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
          <span
            ref={timecodeRef}
            className="font-bold tracking-widest text-primary-fixed font-mono text-xs"
          >
            REC [00:19:44:12]
          </span>
        </div>

        <span className="hidden md:inline text-outline">|</span>

        {/* Audio VU Meter */}
        <button
          type="button"
          aria-pressed={audioActive}
          aria-label="Toggle VU audio monitor"
          onClick={() => setAudioActive(!audioActive)}
          className="cursor-pointer group flex items-center gap-1.5 px-1.5 py-0.5 bg-surface-container/60 hover:bg-surface-container transition-colors"
        >
          <span className="hidden sm:inline font-mono text-xs tracking-wider text-outline">
            VU CH1/2:
          </span>
          <div className="flex items-end gap-0.5 h-3.5 w-14 bg-surface-container-highest px-0.5 py-0.5">
            <span
              className={`w-1.5 bg-primary-fixed rounded-none ${
                audioActive ? "animate-vu-1" : "h-1"
              }`}
            />
            <span
              className={`w-1.5 bg-primary-fixed rounded-none ${
                audioActive ? "animate-vu-2" : "h-1.5"
              }`}
            />
            <span
              className={`w-1.5 bg-tertiary-fixed rounded-none ${
                audioActive ? "animate-vu-3" : "h-2"
              }`}
            />
            <span
              className={`w-1.5 bg-secondary-fixed rounded-none ${
                audioActive ? "animate-vu-4" : "h-1"
              }`}
            />
            <span className="w-1.5 bg-error h-1" />
          </div>
          <span className="text-xs font-mono text-tertiary-fixed font-bold">
            {audioActive ? "-6dB" : "MUTED"}
          </span>
        </button>

        <span className="hidden lg:inline text-outline">|</span>

        {/* Camera Sensor Mode Switcher */}
        <button
          type="button"
          onClick={() => {
            const modes: ("24FPS" | "60FPS" | "120FPS")[] = [
              "24FPS",
              "60FPS",
              "120FPS",
            ];
            const nextIdx = (modes.indexOf(cineMode) + 1) % modes.length;
            setCineMode(modes[nextIdx]);
          }}
          className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-surface-container text-xs font-mono tracking-wider hover:text-primary transition-colors border border-surface-variant/40"
          title="Switch Cine Sensor Profile"
        >
          <span className="text-outline">CAM-A:</span>
          <span className="text-primary font-bold">SONY FX3</span>
          <span className="text-secondary font-bold">[{cineMode}]</span>
          <span className="text-tertiary-fixed text-xs">EI 800</span>
        </button>

        <span className="hidden sm:inline text-outline">|</span>

        {/* Dispatch announcement ticker */}
        <div className="flex items-center gap-2 text-tertiary-fixed font-semibold tracking-wider text-xs">
          <span className="inline-block w-1.5 h-1.5 bg-tertiary-fixed animate-pulse" />
          <span>CAMPUS DISPATCH ACTIVE // FALL PRODUCTION SZN</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-space-sm font-label-sm">
        <span className="text-on-surface-variant text-xs uppercase tracking-wider">
          NEXT CREW CALL:
        </span>
        <span className="px-space-xs py-0.5 bg-surface-container-high border border-primary-fixed/40 text-primary-fixed font-bold tracking-wider text-xs">
          TUE 19:00 RM 304
        </span>
      </div>
    </div>
  );
}

