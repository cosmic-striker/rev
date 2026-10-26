"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export default function GradeComparison({
  raw,
  graded,
}: {
  raw: string;
  graded: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const update = useCallback((clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    let p = ((clientX - rect.left) / rect.width) * 100;
    if (p < 2) p = 2;
    if (p > 98) p = 98;
    setPos(Math.round(p));
  }, []);

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
                onClick={() => setPos(pct)}
                className={`px-2 py-0.5 text-[10px] font-mono uppercase transition-colors ${
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
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => update(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches.length > 0) update(e.touches[0].clientX);
        }}
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
          <div className="relative w-full h-full" style={{ width: stageRef.current?.clientWidth || "100%" }}>
            <Image
              src={raw}
              alt="Raw camera log"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ filter: "saturate(0.35) brightness(1.12) contrast(0.85)" }}
            />
          </div>
          <span className="absolute bottom-3 left-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface bg-surface-container-lowest/90 px-space-sm py-1 border border-surface-variant font-mono text-[11px] font-bold">
            ◄ Flat Camera Log [Sony S-Log3 / EI 800]
          </span>
        </div>

        {/* Master Grade Tag (Right) */}
        <span className="absolute bottom-3 right-3 font-label-sm text-label-sm uppercase tracking-wider text-primary bg-surface-container-lowest/90 px-space-sm py-1 border border-surface-variant font-mono text-[11px] font-bold">
          Master Theatrical Grade [Resolution Club Custom 3D LUT] ►
        </span>

        {/* Split Divider Line and Draggable Puck */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-primary-fixed shadow-[0_0_12px_#c3f400] z-20 pointer-events-none"
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
        <div className="absolute top-3 left-3 text-[10px] font-mono text-outline pointer-events-none">
          DAVINCI COLOR MANAGED (DWG / INTERMEDIATE)
        </div>
      </div>
    </div>
  );
}
