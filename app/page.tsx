"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { homeChapters, homeImages } from "@/lib/collective";
import CinemaHUD from "@/components/ui/CinemaHUD";
import Reveal from "@/components/ui/Reveal";
import GearLockerModal from "@/components/ui/GearLockerModal";
import FloatingCinemaDock from "@/components/ui/FloatingCinemaDock";
import Modal from "@/components/ui/Modal";
import Repertoire from "@/components/home/Repertoire";
import CoverageSection from "@/components/home/CoverageSection";

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

export default function CampusCoveragePage() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [reelOpen, setReelOpen] = useState(false);
  const [gearModalOpen, setGearModalOpen] = useState(false);
  const [formNotes, setFormNotes] = useState("");

  const chapter = homeChapters[activeChapter];

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
        <div className="absolute top-6 left-6 pointer-events-none text-outline font-label-sm z-20 hidden sm:flex flex-col">
          <span className="text-tertiary-fixed-dim font-mono text-xs font-bold">
            ⌜ FRAME 2.39:1 ANAMORPHIC
          </span>
          <span className="text-on-surface-variant text-xs font-mono">
            4K RAW 12-BIT // ISO 800
          </span>
        </div>
        <div className="absolute top-6 right-6 pointer-events-none text-outline font-label-sm z-20 text-right hidden sm:block">
          <span className="text-tertiary-fixed-dim font-mono text-xs font-bold">
            LUT: RESOLUTION_PRINT_04 ⌝
          </span>
          <span className="text-on-surface-variant text-xs font-mono">
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
                <span className="font-mono text-xs text-tertiary-fixed">
                  STILLS / 120FPS DUAL GAIN
                </span>
              </div>

              <div
                role="button"
                tabIndex={0}
                aria-label="Open the Spring Fling 2024 preview reel"
                onClick={() => setReelOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setReelOpen(true);
                  }
                }}
                className="relative aspect-video w-full overflow-hidden bg-surface-container-highest cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
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
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-surface-container-lowest/80 px-2 py-1 text-xs font-mono text-primary-fixed uppercase border border-surface-variant">
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

              <div className="pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant uppercase font-mono text-xs">
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

      <Repertoire />

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
                <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-lowest/80 px-space-xs py-1 border border-surface-variant/40 font-mono text-xs">
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
                  <span className="px-1.5 py-0.5 bg-secondary-container text-secondary-fixed text-xs uppercase font-bold">
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

      <CoverageSection notes={formNotes} setNotes={setFormNotes} />

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
      <Modal
        open={reelOpen}
        onClose={() => setReelOpen(false)}
        labelledBy="reel-modal-title"
        panelClassName="w-full max-w-4xl border border-surface-variant bg-surface-container-low p-space-md shadow-[10px_10px_0px_0px_#c3f400]"
      >
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-surface-variant/40">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 bg-primary-container animate-ping" />
                <span
                  id="reel-modal-title"
                  className="font-headline-sm text-headline-sm uppercase text-primary"
                >
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
            <div className="mt-space-sm flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant uppercase font-mono text-xs">
              <span>COLLEGIATE STUDENT PRESS ACCREDITED</span>
              <span className="text-primary-fixed font-bold">4K 60FPS PRORES 422HQ</span>
            </div>
      </Modal>

    </div>
  );
}
