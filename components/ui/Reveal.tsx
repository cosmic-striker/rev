"use client";

import { useEffect, useRef, useState } from "react";

type RevealDirection = "up" | "down" | "left" | "right" | "zoom" | "fade";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: RevealDirection;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
  id?: string;
}

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  duration = 700,
  className = "",
  threshold = 0.1,
  once = true,
  id,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const getTransformClasses = () => {
    if (visible) {
      return "opacity-100 translate-x-0 translate-y-0 scale-100 filter-none";
    }

    switch (direction) {
      case "up":
        return "opacity-0 translate-y-8";
      case "down":
        return "opacity-0 -translate-y-8";
      case "left":
        return "opacity-0 translate-x-8";
      case "right":
        return "opacity-0 -translate-x-8";
      case "zoom":
        return "opacity-0 scale-95";
      case "fade":
      default:
        return "opacity-0";
    }
  };

  return (
    <div
      id={id}
      ref={ref}
      className={`transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${getTransformClasses()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
