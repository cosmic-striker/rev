"use client";

import Image from "next/image";
import { useState } from "react";
import { projects, workFilters } from "@/lib/data";
import { workProjectImages } from "@/lib/images";
import Icon from "@/components/ui/Icon";

export default function ProjectGrid() {
  const [filter, setFilter] = useState("all");

  const visible = projects.filter(
    (p) => filter === "all" || p.categories.includes(filter)
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {workFilters.map((f) => {
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

      <div className="mt-space-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {projects.map((project, idx) => {
          const show = visible.some((p) => p.id === project.id);
          const image = workProjectImages[idx] ?? workProjectImages[0];
          return (
            <article
              key={project.id}
              className="project-card group flex-col bg-[rgba(18,24,36,0.55)] backdrop-blur-[20px] border border-white/[0.07] rounded-xl overflow-hidden transition-all duration-300 hover:border-primary-container/40 hover:shadow-[0_16px_48px_-8px_rgba(0,229,255,0.18)]"
              style={{
                display: show ? "flex" : "none",
              }}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container-highest">
                <Image
                  src={image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04] saturate-90 group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-space-sm">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-container text-on-primary-fixed">
                    <Icon name="play_arrow" className="text-base" filled />
                  </span>
                  <span className="font-label-sm text-label-sm uppercase text-primary">
                    {project.meta}
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-space-lg gap-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-on-surface-variant">
                  {project.client}
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-primary">
                  {project.award}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">
                  {project.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant flex-1">
                  {project.description}
                </p>
                <div className="flex items-center justify-between pt-space-sm mt-auto">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-label-sm text-label-sm uppercase text-outline">
                      Director: {project.director}
                    </span>
                    {project.sound && (
                      <span className="font-label-sm text-label-sm uppercase text-outline">
                        Sound: {project.sound}
                      </span>
                    )}
                  </div>
                  <a
                    href="/case-studies"
                    className="flex items-center gap-space-xs font-label-md text-label-md uppercase text-primary hover:gap-space-sm transition-all"
                  >
                    View Case
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
