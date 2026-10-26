"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { storyProjects, type StoryProject } from "@/lib/collective";
import { gradedImage, rawImage } from "@/lib/images";
import Reveal from "@/components/ui/Reveal";
import GradeComparison from "@/components/case-studies/GradeComparison";

const sortOptions = [
  { id: "all", label: "All Media" },
  { id: "doc", label: "Doc" },
  { id: "narrative", label: "Narrative" },
  { id: "journalism", label: "Journalism" },
];

const gridProjects = [
  {
    id: "voices" as const,
    tag: "Docuseries",
    tagTone: "text-primary-fixed",
    award: "Official Selection",
    awardTone: "text-tertiary-fixed",
    sort: "doc",
    title: "Voices of the Dorms",
    metaLeft: "42K+ Views",
    metaRight: "Blackmagic 6K",
    cta: "Watch Film",
    icon: "play_arrow",
    aspect: "aspect-[4/3]",
  },
  {
    id: "error404" as const,
    tag: "Narrative",
    tagTone: "text-secondary",
    award: "Audience Award",
    awardTone: "text-on-primary-fixed",
    sort: "narrative",
    title: "Error 404: Graduation",
    metaLeft: "48-Hour Film",
    metaRight: "Tri-State Fest",
    cta: "Watch Film",
    icon: "play_arrow",
    aspect: "aspect-[4/3]",
  },
  {
    id: "audit" as const,
    tag: "Investigative",
    tagTone: "text-tertiary-fixed",
    award: "Policy Passed",
    awardTone: "text-primary-fixed",
    sort: "journalism",
    title: "The Dining Hall Audit",
    metaLeft: "FOIA Exposé",
    metaRight: "Senate Resolution",
    cta: "Read & Watch",
    icon: "arrow_forward",
    aspect: "aspect-[4/3]",
  },
];

const gearCards = [
  {
    label: "Sony FX3 / FX6",
    title: "Cinema Rigging",
    detail: "Full check-out privileges on cinema cameras, prime lenses & gimbals.",
    icon: "videocam",
  },
  {
    label: "ATEM Switchers",
    title: "Multi-Cam Live",
    detail: "Direct live athletics, concert stages, and instant replay decks.",
    icon: "live_tv",
  },
  {
    label: "DaVinci Resolve",
    title: "Color & Sound",
    detail: "Log-to-Rec709 color pipelines and studio Fairlight mixing.",
    icon: "palette",
  },
  {
    label: "Press Pass Clearance",
    title: "Campus FOIA",
    detail: "Investigative records, ethical standards, and legal clearances.",
    icon: "gavel",
  },
];

const chapters = [
  { label: "01 // Teaser & Rig Setup", time: "00:00", percent: 0 },
  { label: "02 // Main Event Live Cut", time: "02:24", percent: 28 },
  { label: "03 // Director & DP Comms", time: "06:15", percent: 74 },
];

export default function StoriesPage() {
  const [activeSort, setActiveSort] = useState("all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<keyof typeof storyProjects | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(28);
  const [timecode, setTimecode] = useState("02:24");
  const [activeChapter, setActiveChapter] = useState(1);
  const [resolution, setResolution] = useState<"4K" | "1080P">("4K");
  const [shareLabel, setShareLabel] = useState("Share Cut");

  const activeProject: StoryProject | null = activeId ? storyProjects[activeId] : null;

  const openProject = (id: keyof typeof storyProjects) => {
    setActiveId(id);
    setProgress(storyProjects[id].progress);
    setTimecode(storyProjects[id].currentTime);
    setActiveChapter(1);
    setResolution("4K");
    setIsPlaying(true);
    setShareLabel("Share Cut");
  };

  const closeProject = () => {
    setActiveId(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredProjects = gridProjects.filter((project) => {
    const matchesSort = activeSort === "all" || project.sort === activeSort;
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.tag.toLowerCase().includes(search.toLowerCase()) ||
      project.award.toLowerCase().includes(search.toLowerCase());
    return matchesSort && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Viewfinder Header Bar */}
      <section className="w-full bg-surface-container-lowest px-gutter py-space-xs border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm font-label-sm text-label-sm text-on-surface-variant uppercase">
          <div className="flex items-center gap-space-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-ping" />
            <span className="text-primary-fixed font-bold font-mono">REC [00:44:18:02]</span>
            <span className="hidden sm:inline text-on-surface-variant font-mono text-[11px]">
              {"// ISO 800 // 24FPS // SHUTTER 180° // 4K PRORES RAW"}
            </span>
          </div>
          <div className="flex items-center gap-space-md font-mono text-[11px]">
            <span>ARCHIVE DEPT // CASE STUDY DISPATCH #42</span>
            <span className="px-space-xs bg-surface text-primary-fixed font-bold">
              LIVE STATUS: ACTIVE ROLL
            </span>
          </div>
        </div>
      </section>

      {/* Hero Header */}
      <section className="w-full bg-surface px-gutter py-space-xl border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
          <Reveal direction="up" className="flex flex-wrap items-center gap-space-sm">
            <span className="px-space-sm py-space-xs bg-surface-container-high text-primary-fixed font-label-sm text-label-sm uppercase tracking-widest font-bold border border-primary-fixed/40">
              Campus Production Archives &amp; Impact Reports
            </span>
            <span className="text-on-surface-variant font-label-sm text-label-sm uppercase font-mono">
              {"// 2023-2025 COHORT RELEASES"}
            </span>
          </Reveal>

          <Reveal direction="up" delay={150} className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
            <div className="lg:col-span-8 space-y-space-sm">
              <h1 className="font-display-xl text-display-xl uppercase tracking-tighter text-primary leading-none">
                Stories That{" "}
                <span className="text-primary-fixed underline decoration-secondary-container decoration-4 underline-offset-8">
                  Matter
                </span>{" "}
                To Our Campus
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Award-winning student films, live festival broadcasts, and
                investigative documentary journalism. Completely produced by undergraduate creators.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Flagship Case Study */}
      <section className="w-full bg-surface-container-low px-gutter py-space-xl border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto space-y-space-lg">
          <Reveal direction="up" className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm">
            <div className="flex items-center gap-space-xs font-label-md text-label-md uppercase text-primary-fixed font-bold">
              <span className="w-3 h-3 bg-primary-container" />
              <span>FLAGSHIP CASE STUDY // PRODUCTION DEEP DIVE</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-mono">
              FILE REF: SF-24-LIVE-DOC
            </span>
          </Reveal>

          <Reveal direction="zoom" duration={800} className="bg-surface-container-lowest p-space-md lg:p-space-xl space-y-space-lg border border-surface-variant shadow-[8px_8px_0px_0px_#004cf6]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              <div className="lg:col-span-8 flex flex-col gap-space-md">
                <div
                  className="relative w-full aspect-video bg-surface-container-high overflow-hidden group cursor-pointer border border-surface-variant/40 hover:border-primary-fixed transition-colors"
                  onClick={() => openProject("flagship")}
                >
                  <Image
                    src={storyProjects.flagship.poster}
                    alt="Springfest '24 Mainstage multi-cam production"
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

                  {/* Audio Equalizer Overlay on Hover */}
                  <div className="absolute top-space-md left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-end gap-1 h-6 bg-surface-container-lowest/80 px-space-sm py-1 backdrop-blur-md border border-primary-fixed/40">
                    <span className="w-1 bg-primary-fixed rounded-none animate-eq-bar-1" />
                    <span className="w-1 bg-primary-fixed rounded-none animate-eq-bar-2" />
                    <span className="w-1 bg-primary-fixed rounded-none animate-eq-bar-3" />
                    <span className="w-1 bg-primary-fixed rounded-none animate-eq-bar-4" />
                    <span className="font-label-sm text-label-sm text-primary-fixed ml-1 uppercase font-bold">
                      Audio Track Active
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-primary-container text-on-primary-fixed flex items-center justify-center shadow-[4px_4px_0px_0px_#ffffff] group-hover:scale-110 group-hover:bg-tertiary-fixed transition-all duration-300">
                      <span className="material-symbols-outlined text-headline-lg">
                        play_arrow
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-space-md left-space-md flex items-center gap-space-xs font-label-sm text-label-sm bg-surface-container-lowest/90 px-space-sm py-space-xs text-primary-fixed border border-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                    <span>CAM-01 • STAGE RIG</span>
                  </div>
                  <div className="absolute top-space-md right-space-md bg-surface-container-lowest/90 px-space-sm py-space-xs font-label-sm text-label-sm text-on-surface uppercase font-mono text-xs border border-surface-variant">
                    4K UHD • 24 FPS
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-space-md space-y-space-xs">
                    <div className="flex justify-between items-end">
                      <div className="space-y-space-xs">
                        <span className="px-space-xs py-1 bg-secondary text-on-secondary font-label-sm text-label-sm uppercase font-bold">
                          Springfest &apos;24 Mainstage
                        </span>
                        <h3 className="font-headline-md text-headline-md text-primary uppercase">
                          72-Hour Turnaround Multi-Cam
                        </h3>
                      </div>
                      <div className="hidden sm:inline-flex px-space-sm py-1 bg-surface-container-high/90 text-primary-fixed font-label-sm uppercase font-mono font-bold">
                        08:24 Official Doc
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-space-sm">
                  <div className="bg-surface-container p-space-md text-center sm:text-left border border-surface-variant/40">
                    <div className="font-display-lg text-display-lg text-primary-fixed leading-none">
                      185K+
                    </div>
                    <div className="font-label-sm text-label-sm uppercase text-on-surface-variant mt-space-xs font-bold">
                      Total Impressions
                    </div>
                  </div>
                  <div className="bg-surface-container p-space-md text-center sm:text-left border border-surface-variant/40">
                    <div className="font-display-lg text-display-lg text-tertiary-fixed leading-none">
                      72H
                    </div>
                    <div className="font-label-sm text-label-sm uppercase text-on-surface-variant mt-space-xs font-bold">
                      Shoot-to-Delivery
                    </div>
                  </div>
                  <div className="bg-surface-container p-space-md text-center sm:text-left border border-surface-variant/40">
                    <div className="font-display-lg text-display-lg text-secondary leading-none">
                      16
                    </div>
                    <div className="font-label-sm text-label-sm uppercase text-on-surface-variant mt-space-xs font-bold">
                      Student Crew
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between space-y-space-md">
                <div className="space-y-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase text-primary-fixed tracking-wider font-bold">
                      Case Study 01
                    </span>
                    <h2 className="font-headline-lg text-headline-lg text-primary uppercase mt-space-xs">
                      High-Speed Festival Broadcast
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                      How 16 student filmmakers coordinated multi-cam coverage and
                      on-site proxy edits to deliver viral recaps within 3 hours of
                      headliners.
                    </p>
                  </div>
                  <div className="space-y-space-xs pt-space-xs">
                    <div className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider pb-space-xs font-bold">
                      Execution Timeline
                    </div>
                    {[
                      ["01 // Shotlist Clearance", "T-14 Days"],
                      ["02 // 3-Cam Rig + Drone", "Live Show"],
                      ["03 // Trailer Rush Edit", "Midnight"],
                      ["04 // 4K Master Drop", "+72 Hours"],
                    ].map(([step, time]) => (
                      <div
                        key={step}
                        className="flex items-center justify-between p-space-sm bg-surface-container border border-surface-variant/30"
                      >
                        <span className="font-label-sm uppercase text-primary font-bold">
                          {step}
                        </span>
                        <span className="px-space-xs py-0.5 bg-surface-container-high text-tertiary-fixed font-label-sm font-mono font-bold">
                          {time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openProject("flagship")}
                  className="w-full flex items-center justify-center gap-space-xs px-space-md py-space-sm bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all cursor-pointer group shadow-[4px_4px_0px_0px_#ffffff]"
                >
                  <span>Watch Archival Cut</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    play_arrow
                  </span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DaVinci Resolve Color Lab // Live Log-to-Rec.709 Comparison */}
      <section className="w-full bg-surface-container-lowest px-gutter py-space-xl border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto space-y-space-lg">
          <Reveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
                Color Grading Pipeline &amp; Post-Production Lab
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary uppercase mt-1">
                From Flat Log to Cinematic Master
              </h2>
            </div>
            <p className="text-xs font-mono text-on-surface-variant uppercase max-w-sm">
              Drag the interactive comparison handle below to reveal our DaVinci Resolve studio color grading pipeline.
            </p>
          </Reveal>

          <Reveal direction="zoom" duration={800}>
            <GradeComparison raw={rawImage} graded={gradedImage} />
          </Reveal>
        </div>
      </section>

      {/* Selected Student Projects with Search & Filter */}
      <section className="w-full bg-surface px-gutter py-space-xl">
        <div className="max-w-7xl mx-auto space-y-space-lg">
          <Reveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed font-bold">
                Original Campus Productions
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary uppercase mt-space-xs">
                Selected Student Projects &amp; Investigations
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative min-w-[200px]">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by title, genre..."
                  className="w-full bg-surface-container text-primary text-xs px-3 py-2 pl-8 border border-surface-variant focus:outline-none focus:border-primary-fixed placeholder:text-outline"
                />
                <span className="material-symbols-outlined absolute left-2 top-2 text-base text-outline pointer-events-none">
                  search
                </span>
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-2 text-xs text-outline hover:text-primary"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setActiveSort(option.id)}
                    className={
                      activeSort === option.id
                        ? "px-space-md py-space-xs bg-primary-container text-on-primary-fixed font-bold uppercase shadow-[2px_2px_0px_0px_#ffffff]"
                        : "px-space-md py-space-xs bg-surface-container text-on-surface hover:text-primary transition-colors"
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {filteredProjects.map((project, idx) => {
              const data = storyProjects[project.id];
              return (
                <Reveal key={project.id} delay={idx * 100} direction="up">
                  <article className="bg-surface-container flex flex-col justify-between group overflow-hidden border border-surface-variant/40 hover:border-primary-fixed shadow-[4px_4px_0px_0px_#292a2b] hover:shadow-[6px_6px_0px_0px_#c3f400] transition-all duration-300">
                    <div
                      className={`relative w-full ${project.aspect} bg-surface-container-high overflow-hidden cursor-pointer`}
                      onClick={() => openProject(project.id)}
                    >
                      <Image
                        src={data.poster}
                        alt={`${data.title} poster`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                      <span
                        className={`absolute top-space-xs left-space-xs px-space-xs py-1 bg-surface-container-lowest/90 font-label-sm text-label-sm ${project.tagTone} uppercase font-bold`}
                      >
                        {project.tag}
                      </span>
                      <span
                        className={`absolute bottom-space-xs right-space-xs px-space-xs py-1 ${
                          project.id === "error404"
                            ? "bg-primary-container"
                            : "bg-surface-container-lowest/90"
                        } ${project.awardTone} font-label-sm text-label-sm uppercase font-bold`}
                      >
                        {project.award}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-14 h-14 bg-primary-container text-on-primary-fixed flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined text-headline-sm">
                            play_arrow
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-space-md space-y-space-sm">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-sm text-headline-sm text-primary uppercase group-hover:text-primary-fixed transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase pt-space-xs border-t border-surface-variant">
                        <span>{project.metaLeft}</span>
                        <span className="font-mono text-primary-fixed font-bold">{project.metaRight}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openProject(project.id)}
                        className="w-full inline-flex items-center justify-center gap-space-xs py-space-xs bg-surface-container-high hover:bg-primary-container hover:text-on-primary-fixed text-primary font-label-sm text-label-sm uppercase font-bold transition-all cursor-pointer shadow-[2px_2px_0px_0px_#ffffff]"
                      >
                        <span>{project.cta}</span>
                        <span className="material-symbols-outlined text-sm">
                          {project.icon}
                        </span>
                      </button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Production Tech Gear Strip */}
      <section className="w-full bg-surface-container-low px-gutter py-space-xl border-t border-surface-variant/40">
        <div className="max-w-7xl mx-auto space-y-space-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {gearCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 80} direction="up">
                <div className="bg-surface-container-lowest p-space-md flex flex-col justify-between group hover:bg-surface-container transition-all border border-surface-variant/40 hover:border-primary-fixed">
                  <div className="space-y-space-xs">
                    <div className="w-10 h-10 bg-surface-container flex items-center justify-center text-primary-fixed group-hover:bg-primary-container group-hover:text-on-primary-fixed transition-colors">
                      <span className="material-symbols-outlined">{card.icon}</span>
                    </div>
                    <span className="font-label-sm text-label-sm uppercase text-primary-fixed font-bold">
                      {card.label}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-primary uppercase">
                      {card.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {card.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Student Film Grant Banner */}
      <section className="w-full bg-surface-container-lowest px-gutter py-space-xl border-t border-surface-variant/40">
        <div className="max-w-7xl mx-auto">
          <Reveal direction="zoom" className="bg-primary-container p-space-md sm:p-space-xl text-on-primary-fixed shadow-[8px_8px_0px_0px_#004cf6]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-space-lg text-on-primary-fixed">
              <div className="space-y-space-xs text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-space-xs font-label-sm text-label-sm uppercase tracking-widest font-bold">
                  <span className="w-2 h-2 bg-on-primary-fixed animate-ping" />
                  <span>Fall Grant Window Now Open</span>
                </div>
                <h2 className="font-display-xl text-display-xl uppercase tracking-tighter leading-none">
                  $2,500 FILM GRANT
                </h2>
                <p className="font-body-lg text-body-lg font-bold uppercase tracking-wider">
                  Student funding + Cinema Gear Package + Upperclass Mentorship
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end gap-space-xs w-full md:w-auto">
                <Link
                  href="/join"
                  className="w-full md:w-auto px-space-xl py-space-md bg-surface text-primary hover:bg-surface-container-highest font-headline-sm text-headline-sm uppercase font-bold text-center tracking-tight transition-all shadow-[4px_4px_0px_0px_#ffffff]"
                >
                  Pitch Your Film
                </Link>
                <span className="font-label-sm text-label-sm uppercase text-on-primary-fixed tracking-wider font-bold">
                  Rolling Submissions // Deadline Oct 31
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Interactive Video Playback Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/95 backdrop-blur-xl transition-all duration-300"
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeProject();
          }}
        >
          <div className="relative w-full max-w-6xl max-h-[92vh] bg-surface-container-lowest border border-surface-variant flex flex-col overflow-hidden shadow-[12px_12px_0px_0px_#c3f400]">
            <div className="h-12 bg-surface-container px-space-md border-b border-surface-variant flex items-center justify-between shrink-0">
              <div className="flex items-center gap-space-sm font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-mono">
                <span className="inline-block w-2.5 h-2.5 bg-primary-container rounded-full animate-ping" />
                <span className="text-primary font-bold">
                  CINEMA REPLAY // RESOLUTION CLUB DECK
                </span>
                <span className="hidden md:inline text-surface-tint">
                  {"// CALIBRATED REC.709 PROXY"}
                </span>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="hidden sm:inline font-label-sm text-label-sm text-on-surface-variant uppercase font-mono">
                  [ESC TO CLOSE]
                </span>
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={closeProject}
                  className="w-8 h-8 bg-surface-container-high hover:bg-primary-container hover:text-on-primary-fixed flex items-center justify-center text-primary transition-colors cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
              <div className="lg:col-span-8 bg-black flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-surface-variant">
                <div className="relative w-full aspect-video bg-surface-container-lowest flex items-center justify-center overflow-hidden select-none">
                  <Image
                    src={activeProject.poster}
                    alt={`${activeProject.title} active playback reel`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                  <div className="absolute top-space-sm left-space-sm flex items-center gap-2 bg-black/70 px-space-xs py-0.5 border border-surface-variant font-label-sm text-label-sm text-primary-fixed">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                    <span>{activeProject.cam}</span>
                  </div>
                  <div className="absolute top-space-sm right-space-sm bg-black/70 px-space-xs py-0.5 border border-surface-variant font-label-sm text-label-sm text-on-surface uppercase font-mono">
                    {resolution === "4K" ? "4K UHD • 24 FPS" : "1080P PRORES • 24 FPS"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((value) => !value)}
                    className="absolute w-20 h-20 bg-primary-container text-on-primary-fixed flex items-center justify-center shadow-[4px_4px_0px_0px_#ffffff] hover:scale-110 hover:bg-tertiary-fixed transition-all cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    <span className="material-symbols-outlined text-4xl">
                      {isPlaying ? "pause" : "play_arrow"}
                    </span>
                  </button>
                </div>

                <div className="bg-surface-container-lowest p-space-sm sm:p-space-md border-t border-surface-variant space-y-space-xs">
                  <div
                    className="relative w-full h-2 bg-surface-variant rounded cursor-pointer group"
                    onClick={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect();
                      const clicked = event.clientX - rect.left;
                      const percent = Math.max(0, Math.min(100, (clicked / rect.width) * 100));
                      setProgress(percent);
                      setTimecode(
                        `0${Math.floor(percent / 10)}:${String(
                          Math.floor((percent % 10) * 6)
                        ).padStart(2, "0")}`
                      );
                    }}
                  >
                    <div
                      className="h-full bg-primary-container rounded transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow border-2 border-surface-container-lowest pointer-events-none"
                      style={{ left: `${progress}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-space-sm pt-1">
                    <div className="flex items-center gap-space-sm">
                      <button
                        type="button"
                        onClick={() => setIsPlaying((value) => !value)}
                        className="text-primary hover:text-primary-fixed transition-colors flex items-center cursor-pointer"
                        title="Play/Pause"
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {isPlaying ? "pause" : "play_arrow"}
                        </span>
                      </button>
                      <div className="flex items-center gap-1 font-label-sm text-label-sm text-primary-fixed font-mono">
                        <span>{timecode}</span>
                        <span className="text-on-surface-variant">/</span>
                        <span className="text-on-surface-variant">
                          {activeProject.duration}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 text-on-surface-variant pl-space-xs">
                        <span className="material-symbols-outlined text-xl">
                          volume_up
                        </span>
                        <div className="w-16 h-1 bg-surface-variant rounded">
                          <div className="h-full bg-primary rounded" style={{ width: "75%" }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs font-label-sm text-label-sm">
                      <span className="text-on-surface-variant hidden sm:inline uppercase font-mono">
                        Res:
                      </span>
                      <button
                        type="button"
                        onClick={() => setResolution("4K")}
                        className={`px-space-xs py-0.5 uppercase rounded text-[10px] ${
                          resolution === "4K"
                            ? "bg-primary-container text-on-primary-fixed font-bold"
                            : "bg-surface-container hover:bg-surface-variant text-on-surface"
                        }`}
                      >
                        4K
                      </button>
                      <button
                        type="button"
                        onClick={() => setResolution("1080P")}
                        className={`px-space-xs py-0.5 uppercase rounded text-[10px] ${
                          resolution === "1080P"
                            ? "bg-primary-container text-on-primary-fixed font-bold"
                            : "bg-surface-container hover:bg-surface-variant text-on-surface"
                        }`}
                      >
                        1080P
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-surface-container-low p-space-md sm:p-space-lg flex flex-col justify-between gap-space-md">
                <div className="space-y-space-md">
                  <div className="space-y-space-xs">
                    <span className="font-label-sm text-label-sm uppercase text-primary-fixed font-bold tracking-wider">
                      {activeProject.category}
                    </span>
                    <h2 className="font-headline-lg text-headline-lg text-primary uppercase leading-tight">
                      {activeProject.title}
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant pt-1">
                      {activeProject.synopsis}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-bold">
                      Direct Chapter Jumps
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {chapters.map((item, index) => (
                        <button
                          key={item.time}
                          type="button"
                          onClick={() => {
                            setActiveChapter(index);
                            setProgress(item.percent);
                            setTimecode(item.time);
                          }}
                          className={`text-left px-space-sm py-space-xs font-label-sm text-label-sm uppercase flex justify-between items-center transition-colors hover:bg-surface-container-high ${
                            activeChapter === index
                              ? "bg-surface-container text-primary-fixed border-l-2 border-primary-fixed font-bold"
                              : "bg-surface-container-lowest text-on-surface border-l-2 border-transparent"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="text-on-surface-variant font-mono">{item.time}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-space-xs pt-space-xs border-t border-surface-variant">
                    <div className="bg-surface-container p-space-xs">
                      <div className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                        Director / Major
                      </div>
                      <div className="font-label-sm text-label-sm text-primary font-bold uppercase">
                        {activeProject.crew}
                      </div>
                    </div>
                    <div className="bg-surface-container p-space-xs">
                      <div className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                        Gear Ecosystem
                      </div>
                      <div className="font-label-sm text-label-sm text-primary-fixed font-bold uppercase">
                        {activeProject.gear}
                      </div>
                    </div>
                    <div className="bg-surface-container p-space-xs">
                      <div className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                        Laurel / Status
                      </div>
                      <div className="font-label-sm text-label-sm text-tertiary-fixed font-bold uppercase">
                        {activeProject.laurel}
                      </div>
                    </div>
                    <div className="bg-surface-container p-space-xs">
                      <div className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                        Color Master
                      </div>
                      <div className="font-label-sm text-label-sm text-primary font-bold uppercase">
                        {activeProject.color}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm pt-space-md border-t border-surface-variant">
                  <button
                    type="button"
                    onClick={() => {
                      setShareLabel("Copied Link!");
                      window.setTimeout(() => setShareLabel("Share Cut"), 1800);
                    }}
                    className="flex-1 py-space-xs bg-surface-container-high hover:bg-surface-variant text-primary font-label-sm text-label-sm uppercase font-bold text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                    <span>{shareLabel}</span>
                  </button>
                  <Link
                    href="/join"
                    className="flex-1 py-space-xs bg-primary-container text-on-primary-fixed hover:bg-tertiary-fixed hover:text-on-tertiary-fixed font-label-sm text-label-sm uppercase font-bold text-center transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Pitch Deck</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
