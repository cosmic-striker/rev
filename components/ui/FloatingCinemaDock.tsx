"use client";

import { useEffect, useState } from "react";

export default function FloatingCinemaDock({
  onOpenGear,
}: {
  onOpenGear?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalHeight > 0) {
        setScrollPercent(
          Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)))
        );
      }
      setVisible(currentScroll > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBook = () => {
    const el = document.getElementById("request-coverage");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#request-coverage";
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-surface-container-low/95 border border-surface-variant p-1.5 shadow-[6px_6px_0px_0px_#c3f400] backdrop-blur-md transition-all duration-300">
      {/* Gear Locker quick open */}
      {onOpenGear && (
        <button
          type="button"
          onClick={onOpenGear}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-xs uppercase font-bold tracking-wider transition-colors"
          title="Open Equipment Cage"
        >
          <span className="material-symbols-outlined text-sm text-primary-fixed">
            inventory_2
          </span>
          <span>Gear Locker</span>
        </button>
      )}

      {/* Book Crew shortcut */}
      <button
        type="button"
        onClick={scrollToBook}
        className="flex items-center gap-1.5 px-3 py-2 bg-primary-container text-on-primary-fixed hover:bg-tertiary-fixed font-label-sm text-xs uppercase font-bold tracking-wider transition-colors"
        title="Request Event Coverage"
      >
        <span className="material-symbols-outlined text-sm">videocam</span>
        <span>Book Crew</span>
      </button>

      {/* Scroll to Top with Circular Percentage Indicator */}
      <button
        type="button"
        onClick={scrollToTop}
        className="relative w-9 h-9 flex items-center justify-center bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
        aria-label="Scroll to top"
        title="Scroll to Top"
      >
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-surface-variant stroke-current"
            strokeWidth="2.5"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-primary-fixed stroke-current transition-all duration-150"
            strokeDasharray={`${scrollPercent}, 100`}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="material-symbols-outlined text-base absolute text-primary">
          arrow_upward
        </span>
      </button>
    </div>
  );
}

