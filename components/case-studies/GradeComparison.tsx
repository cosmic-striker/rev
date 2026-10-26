"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function GradeComparison({
  raw,
  graded,
}: {
  raw: string;
  graded: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const pendingXRef = useRef<number | null>(null);
  const [pos, setPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const commit = (clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    let next = ((clientX - rect.left) / rect.width) * 100;
    if (next < 2) next = 2;
    if (next > 98) next = 98;
    setPos(Math.round(next));
  };

  const scheduleUpdate = (clientX: number) => {
    pendingXRef.current = clientX;
    if (frameRef.current) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = 0;
      if (pendingXRef.current !== null) commit(pendingXRef.current);
    });
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const nudge = (delta: number) => {
    setPos((current) => Math.min(98, Math.max(2, current + delta)));
  };

  return (
    <div className="flex flex-col space-y-3">
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between font-label-sm text-label-sm uppercase text-on-surface-variant px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
          <span className="text-primary-fixed font-bold font-mono">
            SPLIT GRADE MONITOR // REC.709 vs LOGC4
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-outline font-mono hidden sm:inline">POSITION: {pos}%</span>
          <div className="flex items-center gap-1">
            {[25, 50, 75].map((pct) => (
              <button
                key={pct}
                type="button"
                aria-pressed={pos === pct}
                onClick={() => setPos(pct)}
                className={`px-2 py-0.5 text-xs font-mono uppercase transition-colors ${
                  pos === pct
                    ? "bg-primary-container text-on-primary-fixed font-bold"
                    : "bg-surface-container text-on-surface hover:text-primary"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Split Canvas */}
      <div
        ref={stageRef}
        className="relative aspect-video w-full overflow-hidden border border-surface-variant select-none touch-none cursor-ew-resize shadow-[8px_8px_0px_0px_#c3f400] group"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setIsDragging(true);
          scheduleUpdate(event.clientX);
        }}
        onPointerMove={(event) => {
          if (!isDragging) return;
          scheduleUpdate(event.clientX);
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          setIsDragging(false);
        }}
        onPointerCancel={() => setIsDragging(false)}
      >
        {/* Graded Image (Right) */}
        <Image
          src={graded}
          alt="Master theatrical grade"
          fill
          sizes="100vw"
          className="object-cover"
        />

        {/* Raw Log Image (Left, clipped to pos%) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          <div
            className="relative h-full"
            style={{ width: `${(100 / pos) * 100}%` }}
          >
            <Image
              src={raw}
              alt="Raw camera log"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ filter: "saturate(0.35) brightness(1.12) contrast(0.85)" }}
            />
          </div>
          <span className="absolute bottom-3 left-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface bg-surface-container-lowest/90 px-space-sm py-1 border border-surface-variant font-mono text-xs font-bold">
            ◄ Flat Camera Log [Sony S-Log3 / EI 800]
          </span>
        </div>

        {/* Master Grade Tag (Right) */}
        <span className="absolute bottom-3 right-3 font-label-sm text-label-sm uppercase tracking-wider text-primary bg-surface-container-lowest/90 px-space-sm py-1 border border-surface-variant font-mono text-xs font-bold">
          Master Theatrical Grade [Resolution Club Custom 3D LUT] ►
        </span>

        {/* Split Divider Line and Draggable Puck */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Color grade comparison position"
          aria-valuemin={2}
          aria-valuemax={98}
          aria-valuenow={pos}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
              event.preventDefault();
              nudge(-2);
            } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
              event.preventDefault();
              nudge(2);
            } else if (event.key === "Home") {
              event.preventDefault();
              setPos(2);
            } else if (event.key === "End") {
              event.preventDefault();
              setPos(98);
            }
          }}
          className="absolute top-0 bottom-0 w-[2px] bg-primary-fixed shadow-[0_0_12px_#c3f400] z-20 cursor-ew-resize focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed"
          style={{ left: `${pos}%` }}
        >
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 bg-primary-container text-on-primary-fixed border border-surface-container-lowest shadow-[0_0_20px_rgba(195,244,0,0.8)] transition-transform duration-150 ${
              isDragging ? "scale-110" : "group-hover:scale-105"
            }`}
          >
            <span className="material-symbols-outlined text-lg">unfold_more</span>
          </div>
        </div>

        {/* Viewfinder crosshair overlay */}
        <div className="absolute top-3 left-3 text-xs font-mono text-outline pointer-events-none">
          DAVINCI COLOR MANAGED (DWG / INTERMEDIATE)
        </div>
      </div>
    </div>
  );
}
