"use client";

import { useEffect, useState } from "react";

const zones = [
  { id: "la", label: "LA", timeZone: "America/Los_Angeles", suffix: "PST" },
  { id: "lon", label: "LON", timeZone: "Europe/London", suffix: "GMT" },
  { id: "tyo", label: "TYO", timeZone: "Asia/Tokyo", suffix: "JST" },
];

export default function WorldClocks() {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const update = () => {
      const next: Record<string, string> = {};
      zones.forEach((z) => {
        next[z.id] = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: z.timeZone,
        }).format(new Date());
      });
      setTimes(next);
    };
    update();
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="contents">
      {zones.map((z) => (
        <span
          key={z.id}
          id={`time-${z.id}`}
          className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-on-surface-variant"
        >
          {z.label} {times[z.id] ?? "--:--"} {z.suffix}
        </span>
      ))}
    </div>
  );
}

export function HubClock({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone,
        }).format(new Date())
      );
    };
    update();
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return <>{time}</>;
}
