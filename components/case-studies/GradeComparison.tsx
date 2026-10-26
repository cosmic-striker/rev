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

  const update = useCallback((clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    let p = ((clientX - rect.left) / rect.width) * 100;
    if (p < 5) p = 5;
    if (p > 95) p = 95;
    setPos(p);
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/[0.07] select-none touch-none cursor-ew-resize"
      onMouseMove={(e) => update(e.clientX)}
      onTouchMove={(e) => {
        if (e.touches.length > 0) update(e.touches[0].clientX);
      }}
    >
      <Image
        src={graded}
        alt="Master theatrical grade"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <Image
          src={raw}
          alt="Raw camera log"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "saturate(0.4) brightness(1.1)" }}
        />
        <span className="absolute bottom-3 left-3 font-label-sm text-label-sm uppercase tracking-[0.22em] text-on-surface bg-surface-container-lowest/70 px-space-sm py-0.5 rounded">
          Raw Camera Log [ARRI LogC4]
        </span>
      </div>
      <span className="absolute bottom-3 right-3 font-label-sm text-label-sm uppercase tracking-[0.22em] text-primary bg-surface-container-lowest/70 px-space-sm py-0.5 rounded">
        Master Theatrical Grade [Resolution Club Custom LUT]
      </span>
      <div
        className="absolute top-0 bottom-0 w-px bg-primary-container"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-primary-container text-on-primary-fixed border border-surface-container-lowest shadow-[0_0_24px_rgba(0,229,255,0.6)]">
          <span className="material-symbols-outlined text-base">unfold_more</span>
        </div>
      </div>
    </div>
  );
}
