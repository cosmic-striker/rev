"use client";

import Image from "next/image";
import { useState } from "react";
import { archiveCases, archiveFilters } from "@/lib/data";
import { archiveImages } from "@/lib/images";
import Icon from "@/components/ui/Icon";

const iconByCategory: Record<string, string> = {
  vfx: "auto_fix_high",
  sound: "graphic_eq",
  brand: "apartment",
};

export default function CaseArchive() {
  const [filter, setFilter] = useState("all");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-space-xl">
        {archiveFilters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`font-label-md text-label-md uppercase tracking-[0.18em] px-space-md py-space-sm rounded-lg transition-all duration-200 ${
                active
                  ? "bg-primary-container text-on-primary-fixed shadow-[0_0_16px_rgba(0,229,255,0.3)]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-gutter">
        {archiveCases.map((c, idx) => {
          const show = filter === "all" || c.category === filter;
          const image = archiveImages[idx] ?? archiveImages[0];
          return (
            <article
              key={c.id}
              style={{ display: show ? "grid" : "none" }}
              className="grid-cols-1 lg:grid-cols-12 gap-gutter-desktop bg-[rgba(18,24,36,0.55)] backdrop-blur-[20px] border border-white/[0.07] rounded-xl overflow-hidden transition-all duration-300 hover:border-primary-container/40 hover:shadow-[0_16px_48px_-8px_rgba(0,229,255,0.18)]"
            >
              <div className="relative lg:col-span-5 aspect-[4/3] lg:aspect-auto lg:min-h-[320px] overflow-hidden bg-surface-container-highest">
                <Image
                  src={image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover saturate-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/70 to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.22em] text-primary bg-surface-container-lowest/70 px-space-sm py-0.5 rounded">
                  <Icon name={iconByCategory[c.category] ?? "movie"} className="text-body-sm" />
                  {c.discipline}
                </span>
              </div>
              <div className="lg:col-span-7 flex flex-col p-space-lg gap-space-md">
                <div className="flex items-center gap-space-sm font-label-sm text-label-sm uppercase tracking-[0.22em] text-on-surface-variant">
                  <span className="text-primary">{c.client}</span>
                  <span>•</span>
                  <span>{c.location}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  {c.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {c.description}
                </p>
                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-outline">
                    Key Outputs:
                  </span>
                  {c.outputs.map((o) => (
                    <span
                      key={o}
                      className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary-container" />
                      {o}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-end justify-between pt-space-md border-t border-outline-variant">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-on-surface-variant">
                      {c.metricLabel}
                    </span>
                    <span className="font-headline-md text-headline-md text-primary">
                      {c.metricValue}
                    </span>
                  </div>
                  <a
                    href="/case-studies"
                    className="flex items-center gap-space-xs font-label-md text-label-md uppercase text-primary hover:gap-space-sm transition-all"
                  >
                    Explore Case
                    <Icon name="arrow_forward" className="text-body-sm" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
