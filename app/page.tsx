"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  homeChapters,
  homeFilters,
  homeImages,
  homeMedia,
  type MediaCard,
} from "@/lib/collective";
import CinemaHUD from "@/components/ui/CinemaHUD";
import Reveal from "@/components/ui/Reveal";
import GearLockerModal from "@/components/ui/GearLockerModal";
import QuickQuoteCalculator from "@/components/ui/QuickQuoteCalculator";
import FloatingCinemaDock from "@/components/ui/FloatingCinemaDock";

function FilmStrip({ count = 6 }: { count?: number }) {
  return (
    <div className="h-3 bg-surface-container-lowest flex items-center justify-around px-2">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="w-1.5 h-1.5 bg-surface" />
      ))}
    </div>
  );
}

const statCards = [
  {
    value: "45K+",
    label: "Student Followers",
    detail: "TikTok • YouTube • Reels",
    tone: "text-primary-fixed",
  },
  {
    value: "180+",
    label: "Campus Events Covered",
    detail: "Athletics, Greek, Fests, Talks",
    tone: "text-secondary",
  },
  {
    value: "14",
    label: "Film Festival Laurels",
    detail: "Inter-Collegiate Honors '21-'24",
    tone: "text-tertiary-fixed",
  },
  {
    value: "100%",
    label: "Student Produced",
    detail: "Zero Faculty Filters. Raw Voice.",
    tone: "text-primary",
  },
];

const guarantees = [
  {
    icon: "cloud_download",
    tone: "text-primary-fixed",
    title: "Full 4K Cinema Delivery",
    detail: "Formatted for Instagram Reels, YouTube Longform, and high-res archives.",
  },
  {
    icon: "speed",
    tone: "text-tertiary-fixed",
    title: "48-Hour Rush Social Cut",
    detail:
      "Quick vertical edits ready for your club's TikTok and Instagram within 48 hours of wrap.",
  },
  {
    icon: "group",
    tone: "text-secondary",
    title: "Zero Equipment Fees for RSOs",
    detail:
      "Recognized Student Organizations qualify for subsidized student media coverage vouchers.",
  },
];

export default function CampusCoveragePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChapter, setActiveChapter] = useState(0);
  const [reelOpen, setReelOpen] = useState(false);
  const [gearModalOpen, setGearModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaCard | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formNotes, setFormNotes] = useState("");

  const chapter = homeChapters[activeChapter];

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setReelOpen(false);
        setSelectedMedia(null);
        setGearModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleApplyEstimates = (summary: string) => {
    setFormNotes((prev) =>
      prev ? `${prev}\n[Auto-Estimate]: ${summary}` : `[Auto-Estimate]: ${summary}`
    );
  };

  const handleSelectGear = (gearName: string) => {
    setFormNotes((prev) =>
      prev
        ? `${prev}\n[Requested Gear Checkout]: ${gearName}`
        : `[Requested Gear Checkout]: ${gearName}`
    );
    const formElement = document.getElementById("request-coverage");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Live Cinema Viewfinder HUD */}
      <CinemaHUD />

      {/* Floating Quick Dock */}
      <FloatingCinemaDock onOpenGear={() => setGearModalOpen(true)} />

      {/* Equipment Cage Modal */}
      <GearLockerModal
        open={gearModalOpen}
        onClose={() => setGearModalOpen(false)}
        onSelectGear={handleSelectGear}
      />

      {/* Hero Section */}
      <section className="relative w-full bg-surface-container-lowest overflow-hidden border-b border-surface-variant/40">
        {/* Animated Viewfinder Grid Overlays */}
        <div className="absolute top-6 left-6 pointer-events-none text-outline-variant font-label-sm z-20 hidden sm:flex flex-col">
          <span className="text-tertiary-fixed-dim font-mono text-[11px] font-bold">
            ⌜ FRAME 2.39:1 ANAMORPHIC
          </span>
          <span className="text-on-surface-variant text-[9px] font-mono">
            4K RAW 12-BIT // ISO 800
          </span>
        </div>
        <div className="absolute top-6 right-6 pointer-events-none text-outline-variant font-label-sm z-20 text-right hidden sm:block">
          <span className="text-tertiary-fixed-dim font-mono text-[11px] font-bold">
            LUT: RESOLUTION_PRINT_04 ⌝
          </span>
          <span className="text-on-surface-variant text-[9px] font-mono">
            WB 5600K • SHUTTER 1/48
          </span>
        </div>

        {/* Ambient Cine Glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 right-10 w-96 h-96 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-gutter pt-space-xl pb-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
          <Reveal direction="up" duration={800} className="lg:col-span-7 space-y-space-md">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="inline-flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-highest text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider border border-primary-fixed/30">
                <span className="w-1.5 h-1.5 bg-primary-fixed animate-ping" />
                University Student Media Collective
              </span>
              <span className="px-space-sm py-1 bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
                Fall &amp; Spring Production Cycles
              </span>
              <span className="px-space-xs py-1 bg-secondary-container text-secondary-fixed font-label-sm text-label-sm uppercase font-bold tracking-widest shadow-[2px_2px_0px_0px_#ffffff]">
                VOL. 38
              </span>
            </div>

            <h1 className="font-display-xl text-display-xl uppercase tracking-tighter text-primary leading-none text-balance">
              Raw Stories.
              <br />
              <span className="text-primary-fixed underline decoration-secondary-container decoration-4 underline-offset-8">
                Cinematic Campus Life.
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              From packed stadium student sections and underground indie concerts
              to hard-hitting student senate exposés. Captured entirely by undergraduate
              filmmakers and journalists.
            </p>

            <div className="flex flex-wrap items-center gap-space-xs pt-1">
              <span className="px-space-sm py-1 bg-surface-container-high border border-primary-fixed/40 text-primary-fixed font-label-md text-label-md uppercase font-bold tracking-wider hover:bg-surface-container-highest transition-colors cursor-default">
                ⚡ 100% Student-Run
              </span>
              <button
                type="button"
                onClick={() => setGearModalOpen(true)}
                className="px-space-sm py-1 bg-surface-container-high border border-surface-variant text-on-surface font-label-md text-label-md uppercase font-bold tracking-wider hover:border-primary-fixed hover:text-primary-fixed transition-all"
              >
                🎥 Free Cinema Gear Cage →
              </button>
              <span className="px-space-sm py-1 bg-surface-container-high border border-surface-variant text-tertiary-fixed font-label-md text-label-md uppercase font-bold tracking-wider hover:bg-surface-container-highest transition-colors cursor-default">
                🔥 All Majors Welcome
              </span>
            </div>

            <div className="pt-space-sm flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-space-md">
              <button
                type="button"
                onClick={() => setReelOpen(true)}
                className="inline-flex items-center justify-center gap-space-sm px-space-lg py-space-md bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:translate-x-1 active:translate-y-1"
              >
                <span
                  className="material-symbols-outlined text-lg animate-pulse"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
                Watch Fall Reel 2024
              </button>
              <Link
                href="#request-coverage"
                className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-md bg-secondary-container text-on-surface font-label-lg text-label-lg uppercase tracking-wider hover:bg-surface-container-high transition-all shadow-[4px_4px_0px_0px_#b8c4ff] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                <span className="material-symbols-outlined text-lg">videocam</span>
                Request Event Coverage
              </Link>
              <div className="flex items-center gap-space-xs text-on-surface font-label-md text-label-md bg-surface-container px-space-md py-space-sm border border-surface-variant/40">
                <span className="material-symbols-outlined text-primary-fixed text-base animate-pulse">
                  event
                </span>
                <span>
                  Next Crew Pitch:{" "}
                  <strong className="text-primary-fixed font-bold">
                    Tues 7PM, Rm 304
                  </strong>
                </span>
              </div>
            </div>
          </Reveal>

          {/* Interactive Cinema Hero Viewfinder Card */}
          <Reveal direction="left" delay={200} duration={900} className="lg:col-span-5 relative">
            <div className="relative bg-surface-container-low p-space-sm shadow-[8px_8px_0px_0px_#c3f400] transition-all hover:shadow-[12px_12px_0px_0px_#c3f400] group">
              <div className="flex items-center justify-between pb-space-xs font-label-sm text-label-sm text-outline tracking-widest uppercase">
                <div className="flex items-center gap-1.5 text-primary-fixed font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
                  <span>● LIVE PREVIEW SINK</span>
                </div>
                <span className="font-mono text-[10px] text-tertiary-fixed">
                  STILLS / 120FPS DUAL GAIN
                </span>
              </div>

              <div
                onClick={() => setReelOpen(true)}
                className="relative aspect-video w-full overflow-hidden bg-surface-container-highest cursor-pointer select-none"
              >
                <Image
                  src={homeImages.hero}
                  alt="College students operating cinema rigs in front of an outdoor campus amphitheater stage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-85" />

                {/* Viewfinder Crosshair in center */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-12 h-12 border border-primary-fixed/40 flex items-center justify-center relative transition-transform duration-500 group-hover:scale-110">
                    <span className="w-1.5 h-1.5 bg-primary-fixed" />
                    <span className="absolute -top-1 w-2 h-[1px] bg-primary-fixed" />
                    <span className="absolute -bottom-1 w-2 h-[1px] bg-primary-fixed" />
                    <span className="absolute -left-1 h-2 w-[1px] bg-primary-fixed" />
                    <span className="absolute -right-1 h-2 w-[1px] bg-primary-fixed" />
                  </div>
                </div>

                {/* Live audio waves badge on preview */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-surface-container-lowest/80 px-2 py-1 text-[10px] font-mono text-primary-fixed uppercase border border-surface-variant">
                  <span className="w-1 h-2.5 bg-primary-fixed animate-pulse" />
                  <span className="w-1 h-4 bg-tertiary-fixed animate-pulse" />
                  <span className="w-1 h-3 bg-secondary-fixed animate-pulse" />
                  <span>AUDIO REC</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="px-space-xs py-0.5 bg-primary-container text-on-primary-fixed font-label-sm text-label-sm font-bold uppercase">
                      Field Ops Unit
                    </span>
                    <p className="font-headline-sm text-headline-sm uppercase text-primary mt-1 leading-tight group-hover:text-primary-fixed transition-colors">
                      Spring Fling 2024
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Director Maya Lin &apos;25 setting gimbal tracking
                    </p>
                  </div>
                  <span className="w-9 h-9 flex items-center justify-center bg-primary-container text-on-primary-fixed font-bold group-hover:bg-tertiary-fixed transition-colors shadow-[2px_2px_0px_0px_#ffffff]">
                    <span className="material-symbols-outlined text-lg">
                      play_arrow
                    </span>
                  </span>
                </div>
              </div>

              <div className="pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant uppercase font-mono text-[10px]">
                <span>MEDIA ID: #LUM-2024-DOCS</span>
                <span className="text-tertiary-fixed font-bold">
                  SYNC LOCK: GENLOCK MASTER
                </span>
              </div>
            </div>

            {/* Award Floating Badge */}
            <div className="absolute -bottom-6 -left-4 bg-surface-container-highest p-space-md shadow-[4px_4px_0px_0px_#004cf6] max-w-xs hidden sm:block border border-surface-variant hover:scale-105 transition-transform duration-200">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary-fixed text-xl animate-pulse">
                  award_star
                </span>
                <span className="font-headline-sm text-headline-sm text-primary uppercase leading-tight">
                  National Pacemaker
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 uppercase">
                2024 Collegiate Press Multi-Media Award Winner
              </p>
            </div>
          </Reveal>
        </div>

        {/* Live Stats Strip */}
        <div className="w-full bg-surface-container-low py-space-md border-t border-surface-variant/40">
          <div className="max-w-7xl mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 gap-space-md">
            {statCards.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100} direction="up">
                <div className="flex flex-col p-space-sm bg-surface-container border border-surface-variant/40 hover:border-primary-fixed/60 transition-all hover:-translate-y-1">
                  <span
                    className={`font-display-lg text-display-lg font-extrabold uppercase leading-none ${stat.tone}`}
                  >
                    {stat.value}
                  </span>
                  <span className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface mt-1">
                    {stat.label}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {stat.detail}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Repertoire & Dispatches Section with Interactive Search & Filter */}
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
                <span className="text-primary-fixed font-bold">
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
                  placeholder="Search dispatches & events..."
                  className="w-full bg-surface-container text-primary text-xs px-3 py-2 pl-8 border border-surface-variant focus:outline-none focus:border-primary-fixed placeholder:text-outline"
                />
                <span className="material-symbols-outlined absolute left-2 top-2 text-base text-outline pointer-events-none">
                  search
                </span>
                {searchQuery && (
                  <button
                    type="button"
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
                  onClick={() => setSelectedMedia(item)}
                  className="media-card group flex flex-col bg-surface-container-low transition-all duration-300 hover:bg-surface-container shadow-[4px_4px_0px_0px_#292a2b] hover:shadow-[6px_6px_0px_0px_#c3f400] hover:-translate-y-1 cursor-pointer border border-surface-variant/30"
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
                    <div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 px-space-xs py-0.5 text-on-surface font-label-sm text-label-sm z-10 font-mono text-[11px]">
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

      {/* Master Cut Highlight Reel with Interactive Scrubber */}
      <section className="w-full bg-surface-container-lowest py-space-xl relative border-y border-surface-variant/40">
        <div className="max-w-7xl mx-auto px-gutter space-y-space-lg">
          <Reveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest font-bold">
                Master Cut Highlight Reel
              </span>
              <h2 className="font-headline-lg text-headline-lg uppercase text-primary tracking-tight">
                The 2024–2025 Campus Reel
              </h2>
            </div>
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
              <span>Runtime: 03:24 • UltraHD 3840x2160 • DCI-P3 Color</span>
            </div>
          </Reveal>

          <Reveal direction="zoom" duration={800} className="w-full bg-surface-container-low p-space-sm sm:p-space-md shadow-[8px_8px_0px_0px_#004cf6]">
            <div className="relative w-full aspect-video bg-surface-container-lowest overflow-hidden group">
              <Image
                src={homeImages.reel}
                alt="Dynamic montage of university football fans, theatrical actors, a solar car, and a campus rally"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-transparent to-surface-container-lowest/40" />

              <button
                type="button"
                onClick={() => setReelOpen(true)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                aria-label="Open campus reel"
              >
                <span className="w-20 h-20 bg-primary-container text-on-primary-fixed flex items-center justify-center shadow-[4px_4px_0px_0px_#ffffff] transition-all duration-300 group-hover:scale-110 group-hover:bg-tertiary-fixed">
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                </span>
              </button>

              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-space-xs py-1 bg-surface-container-lowest/80 border border-surface-variant font-label-sm text-label-sm text-primary-fixed">
                <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                <span>CAM-A • MASTER CUT</span>
              </div>
              <div className="absolute top-4 right-4 bg-surface-container-lowest/80 px-space-xs py-1 text-on-surface font-label-sm text-label-sm uppercase font-mono">
                4K UHD • 24 FPS
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-label-sm text-label-sm text-on-surface uppercase">
                <div className="flex items-center gap-space-xs bg-surface-container-lowest/80 px-space-xs py-1 border border-surface-variant/40">
                  <span className="text-primary-fixed font-bold font-mono">{chapter.time}</span>
                  <span className="text-on-surface-variant">/ 03:24</span>
                  <span className="text-tertiary-fixed ml-2 font-bold">
                    {chapter.label.toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-lowest/80 px-space-xs py-1 border border-surface-variant/40 font-mono text-[11px]">
                  <span>AUDIO: 5.1 SURROUND BUS</span>
                </div>
              </div>
            </div>

            {/* Interactive Chapter Scrubber Bar */}
            <div className="mt-space-md bg-surface-container p-space-sm space-y-space-sm">
              <div className="flex items-center justify-between text-on-surface font-label-sm text-label-sm uppercase">
                <span className="font-bold text-primary-fixed flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">tune</span>
                  Interactive Chapter Scrubber
                </span>
                <span className="text-on-surface-variant hidden sm:inline">
                  Click chapter below to jump preview cue
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                {homeChapters.map((item, index) => {
                  const active = index === activeChapter;
                  return (
                    <button
                      key={item.time}
                      type="button"
                      onClick={() => setActiveChapter(index)}
                      className={`p-space-xs text-left transition-all flex flex-col ${
                        active
                          ? "bg-surface-container-high shadow-[2px_2px_0px_0px_#c3f400] border-l-2 border-primary-fixed"
                          : "bg-surface-container-low hover:bg-surface-bright"
                      }`}
                    >
                      <div className="flex items-center justify-between font-label-sm text-label-sm">
                        <span
                          className={
                            active
                              ? "text-primary-fixed font-bold font-mono text-xs"
                              : "text-on-surface-variant font-bold font-mono text-xs"
                          }
                        >
                          {item.time}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 ${
                            active ? "bg-primary-fixed animate-ping" : "bg-surface-variant"
                          }`}
                        />
                      </div>
                      <span className="font-headline-sm text-headline-sm text-primary uppercase text-sm mt-0.5 truncate">
                        {item.title}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-xs truncate">
                        {item.detail}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="w-full bg-surface-container-lowest h-2 relative mt-2 overflow-hidden">
                <div
                  className="h-full bg-primary-fixed transition-all duration-300 shadow-[0_0_8px_#c3f400]"
                  style={{ width: chapter.progress }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Equipment Cage & Locker Banner */}
      <section className="w-full bg-surface py-space-xl" id="equipment-cage">
        <div className="max-w-7xl mx-auto px-gutter">
          <Reveal direction="up" className="w-full bg-surface-container p-space-md border border-surface-variant/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-[6px_6px_0px_0px_#292a2b] hover:shadow-[6px_6px_0px_0px_#c3f400] transition-all">
            <div className="flex items-center gap-space-sm">
              <div className="w-12 h-12 bg-primary-container text-on-primary-fixed flex items-center justify-center font-bold shrink-0 shadow-[2px_2px_0px_0px_#ffffff]">
                <span className="material-symbols-outlined text-2xl">inventory_2</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
                    Gear Locker • Free Member Checkout
                  </span>
                  <span className="px-1.5 py-0.5 bg-secondary-container text-secondary-fixed text-[10px] uppercase font-bold">
                    28+ Rigs In Inventory
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Sony FX3 &amp; FX30 cinema rigs, BMPCC 6K Pro, Sony G-Master primes &amp; zooms,
                  DJI RS3 Pro motorized gimbals, Sennheiser wireless lavs, and DaVinci color grading bays.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGearModalOpen(true)}
              className="whitespace-nowrap px-space-lg py-space-sm bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase font-bold hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all shadow-[2px_2px_0px_0px_#ffffff]"
            >
              Browse Cage Inventory (28) →
            </button>
          </Reveal>
        </div>
      </section>

      {/* Event Coverage Dispatch + Interactive Estimator */}
      <section className="w-full bg-surface py-space-xl" id="request-coverage">
        <div className="max-w-7xl mx-auto px-gutter space-y-space-xl">
          {/* Interactive Estimator Tool */}
          <Reveal direction="up">
            <QuickQuoteCalculator onApplyEstimates={handleApplyEstimates} />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            <Reveal direction="right" className="lg:col-span-5 space-y-space-md">
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest">
                <span className="w-2.5 h-2.5 bg-primary-container animate-ping" />
                Campus Dispatch Service
              </div>
              <h2 className="font-headline-lg text-headline-lg uppercase text-primary tracking-tight">
                Have an Event on Campus? Let Our Student Crew Film It.
              </h2>
              <div className="grid grid-cols-3 gap-space-xs pt-1">
                <div className="p-space-xs bg-surface-container text-center border border-surface-variant/40">
                  <div className="text-primary-fixed font-headline-sm font-bold">48H</div>
                  <div className="text-label-sm text-on-surface-variant uppercase font-semibold text-[10px]">
                    Fast Social Delivery
                  </div>
                </div>
                <div className="p-space-xs bg-surface-container text-center border border-surface-variant/40">
                  <div className="text-secondary font-headline-sm font-bold">$0</div>
                  <div className="text-label-sm text-on-surface-variant uppercase font-semibold text-[10px]">
                    Free For RSOs
                  </div>
                </div>
                <div className="p-space-xs bg-surface-container text-center border border-surface-variant/40">
                  <div className="text-tertiary-fixed font-headline-sm font-bold">4K</div>
                  <div className="text-label-sm text-on-surface-variant uppercase font-semibold text-[10px]">
                    Sony FX3 Rigs
                  </div>
                </div>
              </div>

              <div className="space-y-space-sm pt-space-xs">
                {guarantees.map((item) => (
                  <div
                    key={item.title}
                    className="p-space-sm bg-surface-container flex items-start gap-space-sm border border-surface-variant/30 hover:border-primary-fixed/40 transition-colors"
                  >
                    <span className={`material-symbols-outlined ${item.tone} text-xl`}>
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-headline-sm text-headline-sm text-primary text-sm uppercase">
                        {item.title}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative w-full h-44 bg-surface-container-high overflow-hidden shadow-[4px_4px_0px_0px_#292a2b] flex items-end p-space-sm border border-surface-variant">
                <Image
                  src={homeImages.dispatch}
                  alt="University media studio basement editing bay with glowing monitors"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-surface-container-lowest/80" />
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div>
                    <span className="text-primary-fixed font-label-sm text-label-sm uppercase font-bold">
                      Studio Hub
                    </span>
                    <p className="text-primary font-headline-sm text-headline-sm text-sm uppercase">
                      Student Center Basement Room 04
                    </p>
                  </div>
                  <span className="px-space-xs py-1 bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase font-bold">
                    Open Daily
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Coverage Dispatch Form */}
            <Reveal direction="left" delay={200} className="lg:col-span-7 bg-surface-container-low p-space-lg shadow-[8px_8px_0px_0px_#c3f400] border border-surface-variant">
              <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm mb-space-md border-b border-surface-variant/40">
                <h3 className="font-headline-md text-headline-md uppercase text-primary">
                  Coverage Dispatch Request
                </h3>
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest font-bold">
                  FALL 2024 SLOTS OPEN
                </span>
              </div>

              <form
                className="space-y-space-md"
                onSubmit={(event) => {
                  event.preventDefault();
                  setIsSubmitting(true);
                  setTimeout(() => {
                    setIsSubmitting(false);
                    setSubmitted(true);
                  }, 600);
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold">
                      Contact Name *
                    </label>
                    <input
                      className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline"
                      placeholder="e.g. Jordan Hayes"
                      required
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold">
                      University Email (.edu) *
                    </label>
                    <input
                      className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline"
                      placeholder="name@university.edu"
                      required
                      type="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold">
                      Student Org / Department *
                    </label>
                    <input
                      className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline"
                      placeholder="e.g. Student Government / Engineering Society"
                      required
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold">
                      Event Date &amp; Time *
                    </label>
                    <input
                      className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline"
                      placeholder="e.g. Nov 14, 2024 at 18:00"
                      required
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold">
                    Requested Media Package
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs mt-1">
                    {["Full Video Rec", "TikTok / Reels Cut", "Still Photo Set"].map(
                      (label, index) => (
                        <label
                          key={label}
                          className="flex items-center gap-space-xs p-space-xs bg-surface-container cursor-pointer hover:bg-surface-bright border border-surface-variant/40"
                        >
                          <input
                            defaultChecked={index < 2}
                            className="accent-primary-fixed"
                            type="checkbox"
                          />
                          <span className="font-label-sm text-label-sm text-on-surface uppercase">
                            {label}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold">
                    Event Location, Gear Notes &amp; Story Details
                  </label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline resize-none"
                    placeholder="Briefly describe what makes this event unique, estimated attendance, and any special camera or sound gear requested..."
                    rows={4}
                  />
                </div>

                {submitted && (
                  <div className="p-space-sm bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase font-bold flex items-center justify-between shadow-[2px_2px_0px_0px_#ffffff] animate-bounce">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        check_circle
                      </span>
                      Dispatch request registered! Production Lead will contact you within 24 hours.
                    </span>
                    <button
                      className="text-on-primary-fixed hover:opacity-75 font-bold"
                      onClick={() => setSubmitted(false)}
                      type="button"
                      aria-label="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                    Response SLA: ≤ 24h • Priority for official registered student clubs.
                  </span>
                  <button
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-space-xl py-space-md bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 disabled:opacity-60"
                    type="submit"
                  >
                    {isSubmitting ? "Transmitting..." : "Submit Dispatch Request"}
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Recruitment Callout Banner */}
      <section className="w-full bg-surface-container-high py-space-xl overflow-hidden relative border-t border-surface-variant/40">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-gutter relative z-10 flex flex-col lg:flex-row items-center justify-between gap-space-xl">
          <Reveal direction="up" className="space-y-space-xs text-left max-w-2xl">
            <div className="inline-flex items-center gap-space-xs px-space-xs py-0.5 bg-secondary-container text-secondary-fixed font-label-sm text-label-sm uppercase font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              Recruiting All Majors • No Prior Film Experience Needed
            </div>
            <h2 className="font-headline-lg text-headline-lg uppercase text-primary tracking-tight leading-tight">
              Want To Make Movies, Shoot Gamedays, Or Host A Campus Show?
            </h2>
            <div className="flex flex-wrap items-center gap-space-xs pt-2">
              <span className="px-space-sm py-1 bg-surface-container-highest border border-primary-fixed/30 text-primary-fixed font-label-md text-label-md uppercase font-bold">
                ✨ No Prior Experience Needed
              </span>
              <span className="px-space-sm py-1 bg-surface-container-highest border border-surface-variant text-on-surface font-label-md text-label-md uppercase font-bold">
                🎬 All Gear Provided
              </span>
              <span className="px-space-sm py-1 bg-surface-container-highest border border-secondary text-secondary font-label-md text-label-md uppercase font-bold">
                🏆 Pacemaker Winning Club
              </span>
            </div>
          </Reveal>

          <Reveal direction="left" delay={200} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md w-full lg:w-auto flex-shrink-0">
            <Link
              href="#request-coverage"
              className="inline-flex items-center justify-center px-space-lg py-space-md bg-surface-container-lowest text-primary font-label-lg text-label-lg uppercase tracking-wider hover:bg-surface-bright transition-all shadow-[4px_4px_0px_0px_#292a2b] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              Book Coverage For Your Club
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-space-xs px-space-xl py-space-md bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              Apply For Fall Recruitment
              <span className="material-symbols-outlined text-lg">arrow_outward</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Master Reel Modal */}
      {reelOpen && (
        <div
          className="fixed inset-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center p-space-md"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) setReelOpen(false);
          }}
        >
          <div className="bg-surface-container-low max-w-4xl w-full p-space-md shadow-[10px_10px_0px_0px_#c3f400] relative border border-surface-variant">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-variant/40">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 bg-primary-container animate-ping" />
                <span className="font-headline-sm text-headline-sm uppercase text-primary">
                  FALL 2024 MASTER REEL PREVIEW
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReelOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-surface-container text-on-surface hover:bg-error-container hover:text-on-error-container font-bold"
                aria-label="Close reel"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-surface-container-lowest relative overflow-hidden flex items-center justify-center group">
              <Image
                src={homeImages.modal}
                alt="High energy college campus montage under glowing stadium lights"
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-surface-container-lowest/40 flex items-center justify-center">
                <div className="text-center p-space-md bg-surface-container-lowest/85 border border-surface-variant max-w-md">
                  <span className="material-symbols-outlined text-primary-fixed text-5xl animate-pulse">
                    smart_display
                  </span>
                  <p className="font-headline-sm text-headline-sm uppercase text-primary mt-2">
                    Fall Showcase 2024 Master Stream
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Color graded in DaVinci Resolve • 4K DCI-P3 60FPS ProRes Master
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="px-2 py-1 bg-primary-container text-on-primary-fixed font-mono text-xs font-bold">
                      ACTIVE SINK
                    </span>
                    <span className="px-2 py-1 bg-surface-container text-tertiary-fixed font-mono text-xs">
                      5.1 SURROUND
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant uppercase font-mono text-[11px]">
              <span>COLLEGIATE STUDENT PRESS ACCREDITED</span>
              <span className="text-primary-fixed font-bold">4K 60FPS PRORES 422HQ</span>
            </div>
          </div>
        </div>
      )}

      {/* Individual Dispatch Project Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center p-space-md"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedMedia(null);
          }}
        >
          <div className="bg-surface-container-low max-w-3xl w-full p-space-md shadow-[10px_10px_0px_0px_#004cf6] relative border border-surface-variant">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-variant/40">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed font-label-sm text-[10px] font-bold uppercase">
                  {selectedMedia.badge}
                </span>
                <span className="font-headline-sm text-headline-sm uppercase text-primary truncate max-w-sm sm:max-w-md">
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
        </div>
      )}
    </div>
  );
}
