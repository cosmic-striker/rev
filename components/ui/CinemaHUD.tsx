"use client";

import { useEffect, useState } from "react";

export default function CinemaHUD() {
  const [frames, setFrames] = useState(12);
  const [seconds, setSeconds] = useState(44);
  const [minutes, setMinutes] = useState(19);
  const [hours] = useState(0);
  const [cineMode, setCineMode] = useState<"24FPS" | "60FPS" | "120FPS">("24FPS");
  const [audioActive, setAudioActive] = useState(true);

  // Accurate cinema timecode runner (24 fps clock)
  useEffect(() => {
    const interval = setInterval(() => {
      setFrames((prev) => {
        if (prev >= 23) {
          setSeconds((s) => {
            if (s >= 59) {
              setMinutes((m) => (m >= 59 ? 0 : m + 1));
              return 0;
            }
            return s + 1;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  const format = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="w-full bg-surface-container-lowest border-b border-surface-variant/40 px-gutter py-1.5 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm select-none z-40 relative">
      <div className="flex items-center gap-space-md overflow-hidden whitespace-nowrap">
        {/* REC Indicator */}
        <div className="flex items-center gap-space-xs text-primary-fixed bg-surface-container px-2 py-0.5 border border-primary-fixed/30">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
          <span className="font-bold tracking-widest text-primary-fixed font-mono text-[11px]">
            REC [{format(hours)}:{format(minutes)}:{format(seconds)}:{format(frames)}]
          </span>
        </div>

        <span className="hidden md:inline text-outline-variant">|</span>

        {/* Audio VU Meter */}
        <div
          onClick={() => setAudioActive(!audioActive)}
          className="cursor-pointer group flex items-center gap-1.5 px-1.5 py-0.5 bg-surface-container/60 hover:bg-surface-container transition-colors"
          title="Click to toggle VU Audio Monitor"
        >
          <span className="hidden sm:inline font-mono text-[10px] tracking-wider text-outline">
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
          <span className="text-[10px] font-mono text-tertiary-fixed font-bold">
            {audioActive ? "-6dB" : "MUTED"}
          </span>
        </div>

        <span className="hidden lg:inline text-outline-variant">|</span>

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
          className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-surface-container text-[10px] font-mono tracking-wider hover:text-primary transition-colors border border-surface-variant/40"
          title="Switch Cine Sensor Profile"
        >
          <span className="text-outline">CAM-A:</span>
          <span className="text-primary font-bold">SONY FX3</span>
          <span className="text-secondary font-bold">[{cineMode}]</span>
          <span className="text-tertiary-fixed text-[9px]">EI 800</span>
        </button>

        <span className="hidden sm:inline text-outline-variant">|</span>

        {/* Dispatch announcement ticker */}
        <div className="flex items-center gap-2 text-tertiary-fixed font-semibold tracking-wider text-[11px]">
          <span className="inline-block w-1.5 h-1.5 bg-tertiary-fixed animate-pulse" />
          <span>CAMPUS DISPATCH ACTIVE // FALL PRODUCTION SZN</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-space-sm font-label-sm">
        <span className="text-on-surface-variant text-[11px] uppercase tracking-wider">
          NEXT CREW CALL:
        </span>
        <span className="px-space-xs py-0.5 bg-surface-container-high border border-primary-fixed/40 text-primary-fixed font-bold tracking-wider text-[11px]">
          TUE 19:00 RM 304
        </span>
      </div>
    </div>
  );
}
