"use client";

import Image from "next/image";
import { useState } from "react";
import { roster, rosterFilters } from "@/lib/data";
import { teamImages } from "@/lib/images";
import Icon from "@/components/ui/Icon";

export default function TeamGrid() {
  const [filter, setFilter] = useState("all");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {rosterFilters.map((f) => {
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

      <div className="mt-space-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {roster.map((member, idx) => {
          const show = filter === "all" || member.category === filter;
          const image = teamImages[idx] ?? teamImages[0];
          return (
            <article
              key={member.id}
              style={{ display: show ? "flex" : "none" }}
              className="roster-card group flex-col bg-[rgba(18,24,36,0.55)] backdrop-blur-[20px] border border-white/[0.07] rounded-xl overflow-hidden transition-all duration-300 hover:border-primary-container/40 hover:shadow-[0_16px_48px_-8px_rgba(0,229,255,0.18)]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-highest">
                <Image
                  src={image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover grayscale-[0.3] saturate-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                <span className="absolute top-3 left-3 font-label-sm text-label-sm uppercase tracking-[0.22em] text-primary bg-surface-container-lowest/70 px-space-sm py-0.5 rounded">
                  {member.code}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">
                    {member.name}
                  </h3>
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-on-surface-variant">
                    {member.locations}
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-space-md gap-space-sm">
                <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-primary">
                  {member.role}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex-1">
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-space-xs">
                  {member.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant border border-outline-variant px-space-sm py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pt-space-sm border-t border-outline-variant flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-outline">
                    {member.clients}
                  </span>
                  <Icon name="open_in_new" className="text-primary text-body-sm" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
