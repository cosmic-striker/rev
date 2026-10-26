"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { homeFilters, homeMedia, type MediaCard } from "@/lib/collective";
import Reveal from "@/components/ui/Reveal";
import Modal from "@/components/ui/Modal";

function FilmStrip({ count = 6 }: { count?: number }) {
  return (
    <div className="h-3 bg-surface-container-lowest flex items-center justify-around px-2">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="w-1.5 h-1.5 bg-surface" />
      ))}
    </div>
  );
}

export default function Repertoire() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaCard | null>(null);

  const visibleMedia = homeMedia.filter((item) => {
    const matchesFilter =
      activeFilter === "all" ? true : item.category === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.footer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-7xl mx-auto px-gutter space-y-space-lg">
          <Reveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest mb-1">
                <span className="w-2.5 h-2.5 bg-primary-fixed animate-ping" />
                Repertoire &amp; Dispatches
              </div>
              <h2 className="font-headline-lg text-headline-lg uppercase text-primary tracking-tight">
                Latest Productions &amp; Student Work
              </h2>
              <div className="flex items-center gap-space-sm text-label-md text-label-md uppercase text-on-surface-variant tracking-wider mt-1">
                <span
                  className="text-primary-fixed font-bold"
                  role="status"
                  aria-live="polite"
                >
                  ● {visibleMedia.length} DISPATCHES
                </span>
                <span>•</span>
                <span>DOCS</span>
                <span>•</span>
                <span>LIVE RECAPS</span>
                <span>•</span>
                <span>PHOTO STORIES</span>
              </div>
            </div>

            {/* Filter controls + Instant Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative min-w-[220px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search dispatches and events"
                  placeholder="Search dispatches & events..."
                  className="w-full bg-surface-container text-primary text-xs px-3 py-2 pl-8 border border-surface-variant focus:outline-none focus:border-primary-fixed placeholder:text-outline"
                />
                <span className="material-symbols-outlined absolute left-2 top-2 text-base text-outline pointer-events-none">
                  search
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-2 text-xs text-outline hover:text-primary"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-space-xs scrollbar-none">
                {homeFilters.map((filter) => {
                  const active = activeFilter === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveFilter(filter.id)}
                      className={
                        active
                          ? "px-space-md py-space-xs bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider whitespace-nowrap transition-all shadow-[2px_2px_0px_0px_#ffffff]"
                          : "px-space-md py-space-xs bg-surface-container text-on-surface-variant font-label-lg text-label-lg uppercase tracking-wider whitespace-nowrap hover:text-primary transition-all"
                      }
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Media Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {visibleMedia.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 80} direction="up">
                <article
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${item.title}`}
                  onClick={() => setSelectedMedia(item)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedMedia(item);
                    }
                  }}
                  className="media-card group flex flex-col bg-surface-container-low transition-all duration-300 hover:bg-surface-container shadow-[4px_4px_0px_0px_#292a2b] hover:shadow-[6px_6px_0px_0px_#c3f400] hover:-translate-y-1 cursor-pointer border border-surface-variant/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <FilmStrip />
                  <div className="relative aspect-video w-full overflow-hidden bg-surface-container-highest">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 flex gap-1 z-10">
                      <span
                        className={`px-space-xs py-0.5 bg-surface-container-lowest/90 ${item.badgeTone} font-label-sm text-label-sm uppercase font-bold tracking-wider`}
                      >
                        {item.badge}
                      </span>
                      <span className="px-space-xs py-0.5 bg-surface-container-lowest/90 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                        {item.secondaryBadge}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 px-space-xs py-0.5 text-on-surface font-label-sm text-label-sm z-10 font-mono text-xs">
                      {item.duration}
                    </div>
                    <div className="absolute inset-0 bg-primary-fixed/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="w-12 h-12 bg-primary-container text-on-primary-fixed flex items-center justify-center shadow-[3px_3px_0px_0px_#ffffff] scale-90 group-hover:scale-100 transition-transform">
                        <span className="material-symbols-outlined text-2xl">
                          play_arrow
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="p-space-md flex flex-col flex-grow justify-between space-y-space-sm">
                    <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase">
                      <span>{item.source}</span>
                      <span className={`${item.viewsTone} font-bold`}>{item.views}</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary uppercase group-hover:text-primary-fixed transition-colors truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase">
                      <span className="px-space-xs py-0.5 bg-surface-container-high text-primary-fixed font-bold">
                        {item.footer}
                      </span>
                      <span className="material-symbols-outlined text-primary-fixed group-hover:translate-x-1.5 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {visibleMedia.length === 0 && (
            <div className="text-center py-16 bg-surface-container border border-surface-variant">
              <span className="material-symbols-outlined text-5xl text-outline mb-2">
                movie
              </span>
              <p className="font-headline-sm text-lg uppercase text-primary">
                No matching dispatches found
              </p>
              <p className="text-sm text-on-surface-variant mt-1">
                Try searching for &quot;Spring Fling&quot;, &quot;Football&quot;, or &quot;Podcast&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="mt-4 px-4 py-2 bg-primary-container text-on-primary-fixed font-label-sm uppercase font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Individual Dispatch Project Modal */}
      <Modal
        open={selectedMedia !== null}
        onClose={() => setSelectedMedia(null)}
        labelledBy="media-modal-title"
        panelClassName="w-full max-w-3xl border border-surface-variant bg-surface-container-low p-space-md shadow-[10px_10px_0px_0px_#004cf6]"
      >
        {selectedMedia && (
          <div>
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-variant/40">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed font-label-sm text-xs font-bold uppercase">
                  {selectedMedia.badge}
                </span>
                <span
                  id="media-modal-title"
                  className="font-headline-sm text-headline-sm uppercase text-primary max-w-sm sm:max-w-md"
                >
                  {selectedMedia.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="w-8 h-8 flex items-center justify-center bg-surface-container text-on-surface hover:bg-error-container hover:text-on-error-container font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-surface-container-lowest relative overflow-hidden">
              <Image
                src={selectedMedia.image}
                alt={selectedMedia.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-transparent flex items-end p-4">
                <div className="w-full flex items-end justify-between">
                  <div>
                    <span className="text-tertiary-fixed text-xs font-mono font-bold uppercase">
                      {selectedMedia.source}
                    </span>
                    <h4 className="font-headline-sm text-primary uppercase text-base mt-0.5">
                      {selectedMedia.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      {selectedMedia.footer} • {selectedMedia.duration}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-primary-fixed text-on-primary-fixed font-bold font-mono text-xs">
                    {selectedMedia.views}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant uppercase">
              <span className="font-mono text-xs">Captured on Sony FX3 Cinema Line</span>
              <Link
                href="/stories"
                className="text-primary-fixed hover:text-tertiary-fixed font-bold uppercase"
              >
                Explore Full Case Archive →
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
