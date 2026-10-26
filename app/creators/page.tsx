"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { creators, type Creator } from "@/lib/collective";
import Reveal from "@/components/ui/Reveal";
import Modal from "@/components/ui/Modal";

const filters = [
  { id: "all", label: "All Crew (42)" },
  { id: "exec", label: "Executive Board" },
  { id: "cine", label: "Cinematography & Video" },
  { id: "photo", label: "Photography & Film Lab" },
  { id: "audio", label: "Audio & Podcasts" },
  { id: "social", label: "Social & Marketing" },
];

const toneClasses = {
  lime: {
    text: "text-primary-fixed",
    bg: "bg-primary-fixed",
    on: "text-on-primary-fixed",
    border: "border-primary-fixed",
  },
  blue: {
    text: "text-secondary-fixed",
    bg: "bg-secondary-fixed",
    on: "text-on-secondary",
    border: "border-secondary-fixed",
  },
  cyan: {
    text: "text-tertiary-fixed",
    bg: "bg-tertiary-fixed",
    on: "text-on-tertiary",
    border: "border-tertiary-fixed",
  },
};

const lifeCards = [
  {
    badge: "Tuesdays",
    badgeClass: "bg-primary-container text-on-primary-fixed",
    icon: "local_pizza",
    iconClass: "text-primary-fixed",
    title: "Free Pizza & Pitch",
    detail: "Media Lab B12 // 7:00 PM",
  },
  {
    badge: "Weekends",
    badgeClass: "bg-secondary text-on-secondary",
    icon: "movie_creation",
    iconClass: "text-secondary-fixed",
    title: "Gameday Shoots",
    detail: "All-Campus Soundstages & Arena",
  },
  {
    badge: "Late Nights",
    badgeClass: "bg-tertiary-fixed text-on-tertiary",
    icon: "coffee",
    iconClass: "text-tertiary-fixed",
    title: "Edit Jams & Sound",
    detail: "Lab Open 24/7 // Synth & Drip Coffee",
  },
  {
    badge: "May Premiere",
    badgeClass: "bg-surface-bright text-primary",
    icon: "award_star",
    iconClass: "text-primary-fixed",
    title: "Red Carpet Gala",
    detail: "Main Auditorium // 900+ Attendees",
  },
];

export default function CreatorsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const visibleCreators = creators.filter((creator) => {
    const matchesFilter =
      activeFilter === "all" ? true : creator.depts.includes(activeFilter);
    const matchesSearch =
      creator.name.toLowerCase().includes(search.toLowerCase()) ||
      creator.role.toLowerCase().includes(search.toLowerCase()) ||
      creator.department.toLowerCase().includes(search.toLowerCase()) ||
      creator.specialty.toLowerCase().includes(search.toLowerCase()) ||
      creator.gear.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full relative">
      {/* Top Viewfinder Ticker */}
      <div className="w-full bg-surface-container-lowest text-primary-fixed py-space-xs overflow-hidden select-none border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto px-gutter flex items-center justify-between text-label-sm font-label-sm tracking-widest uppercase">
          <div className="flex items-center gap-space-sm">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
            <span className="font-mono">REC STATUS: ACTIVE DISPATCH // CREW INDEX AY 2024–2025</span>
          </div>
          <div className="hidden sm:flex items-center gap-space-lg text-on-surface-variant font-mono text-xs">
            <span>CAM A: 4K 24FPS</span>
            <span>ISO: 800</span>
            <span>SHUTTER: 1/48</span>
            <span className="text-primary-fixed font-bold">STUDIO B12 ONLINE</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-surface-container-low pt-space-xl pb-space-lg border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto px-gutter">
          <Reveal direction="up" className="inline-flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-highest text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-space-md border border-primary-fixed/30 font-bold">
            <span className="w-1.5 h-1.5 bg-primary-fixed animate-ping" />
            Executive Board &amp; Crew Roster // Academic Year 2024-2025
          </Reveal>

          <Reveal direction="up" delay={150} className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end mb-space-xl">
            <div className="lg:col-span-8">
              <h1 className="font-display-xl text-display-xl uppercase tracking-tight text-primary leading-none mb-space-sm">
                MEET THE STUDENT CREATORS BEHIND THE LENS
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Filmmakers, photojournalists, audio geeks, graphic designers, and
                social media strategists from majors ranging from Computer Science
                to Film &amp; Television. United by a passion for telling
                university stories.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end">
              <div className="bg-surface-container p-space-md border border-surface-variant/40 shadow-[4px_4px_0px_0px_#c3f400]">
                <span className="text-label-sm font-label-sm text-primary-fixed uppercase tracking-wider block mb-space-xs font-mono font-bold">
                  {"// DISPATCH PROTOCOL"}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface leading-snug">
                  Every package is researched, captured, scored, and mastered
                  autonomously by undergraduates. Free equipment cage access
                  granted to all certified active members.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="zoom" delay={200} className="grid grid-cols-2 md:grid-cols-4 gap-space-xs bg-surface-container-highest p-space-xs border border-surface-variant/40">
            <div className="bg-surface-container p-space-md flex flex-col justify-between">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                Field Personnel
              </span>
              <span className="font-display-lg text-display-lg text-primary-fixed leading-none mt-space-xs">
                42
              </span>
              <span className="font-label-sm text-label-sm text-on-surface uppercase mt-space-xs">
                Active Student Members
              </span>
            </div>
            <div className="bg-surface-container p-space-md flex flex-col justify-between">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                Interdisciplinary
              </span>
              <span className="font-display-lg text-display-lg text-secondary-fixed leading-none mt-space-xs">
                16
              </span>
              <span className="font-label-sm text-label-sm text-on-surface uppercase mt-space-xs">
                Diverse Academic Majors
              </span>
            </div>
            <div className="bg-surface-container p-space-md flex flex-col justify-between">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                Governance
              </span>
              <span className="font-display-lg text-display-lg text-tertiary-fixed leading-none mt-space-xs">
                100%
              </span>
              <span className="font-label-sm text-label-sm text-on-surface uppercase mt-space-xs">
                Student-Governed
              </span>
            </div>
            <div className="bg-surface-container p-space-md flex flex-col justify-between">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                Mentorship
              </span>
              <span className="font-display-lg text-display-lg text-primary-fixed-dim leading-none mt-space-xs">
                04
              </span>
              <span className="font-label-sm text-label-sm text-on-surface uppercase mt-space-xs">
                Faculty Advisors
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Filter and Instant Search Bar */}
      <section className="w-full bg-surface-container-lowest py-space-md sticky top-20 z-40 backdrop-blur-md bg-opacity-95 border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto px-gutter flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div
            className="flex items-center gap-space-xs overflow-x-auto pb-space-xs scrollbar-none"
            role="group"
            aria-label="Filter crew by department"
          >
            {filters.map((filter) => {
              const active = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-space-md py-space-xs text-label-lg font-label-lg uppercase tracking-wider transition-all whitespace-nowrap ${
                    active
                      ? "bg-primary-container text-on-primary-fixed shadow-[3px_3px_0px_0px_#ffffff] font-bold"
                      : "bg-surface-container text-on-surface hover:bg-surface-bright"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search crew by name, role, specialty, or gear"
                placeholder="Search crew by name, gear..."
                className="w-full bg-surface-container text-primary text-xs px-3 py-1.5 pl-8 border border-surface-variant focus:outline-none focus:border-primary-fixed placeholder:text-outline"
              />
              <span className="material-symbols-outlined absolute left-2 top-1.5 text-base text-outline pointer-events-none">
                search
              </span>
              {search && (
                <button
                  type="button"
                  aria-label="Clear crew search"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1.5 text-xs text-outline hover:text-primary"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="hidden xl:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase shrink-0 font-mono">
              <span className="material-symbols-outlined text-sm text-primary-fixed">
                tune
              </span>
              <span>
                Showing:{" "}
                <strong className="text-primary font-bold">
                  {visibleCreators.length}{" "}
                  {visibleCreators.length === 1 ? "Creator" : "Creators"}
                </strong>
              </span>
            </div>
          </div>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          Showing {visibleCreators.length} crew members
        </p>
      </section>

      {/* Creators Grid */}
      <section className="w-full bg-background py-space-xl">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {visibleCreators.map((creator, idx) => {
              const tone = toneClasses[creator.tone];
              return (
                <Reveal key={creator.id} delay={idx * 70} direction="up">
                  <article
                    role="button"
                    tabIndex={0}
                    aria-label={`View dossier for ${creator.name}, ${creator.role}`}
                    onClick={() => setSelectedCreator(creator)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedCreator(creator);
                      }
                    }}
                    className="student-card group flex flex-col bg-surface-container relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-[4px_4px_0px_0px_#292a2b] hover:shadow-[6px_6px_0px_0px_#c3f400] border border-surface-variant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed"
                  >
                    <div className="h-4 bg-surface-container-lowest flex items-center justify-around px-2 py-0.5 select-none">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className="w-1.5 h-1.5 bg-surface-variant"
                        />
                      ))}
                    </div>
                    <div className="relative w-full aspect-[4/5] bg-surface-container-highest overflow-hidden">
                      <Image
                        src={creator.image}
                        alt={`Editorial portrait of ${creator.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 p-3 pointer-events-none flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="text-label-sm font-label-sm text-primary-fixed bg-surface-container-lowest/80 px-1.5 py-0.5 font-bold font-mono">
                            {creator.code}
                          </span>
                          <span className="material-symbols-outlined text-primary-fixed text-sm opacity-75">
                            crop_free
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span
                            className={`material-symbols-outlined ${tone.text} text-sm opacity-75`}
                          >
                            {creator.gearIcon}
                          </span>
                          <span
                            className={`text-label-sm font-label-sm ${tone.on} ${tone.bg} px-1.5 py-0.5 font-bold uppercase shadow-[2px_2px_0px_0px_#ffffff]`}
                          >
                            {creator.gear}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-space-md flex flex-col flex-grow justify-between bg-surface-container">
                      <div>
                        <div className="flex items-center justify-between gap-space-xs mb-space-xs">
                          <span
                            className={`font-label-sm text-label-sm uppercase tracking-wider ${tone.text} font-bold`}
                          >
                            {creator.department}
                          </span>
                          <span
                            className={`inline-block bg-surface-container-highest px-space-xs py-0.5 text-label-sm font-label-sm ${tone.text} font-mono`}
                          >
                            {creator.year}
                          </span>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm uppercase text-primary tracking-tight font-bold group-hover:text-primary-fixed transition-colors">
                          {creator.name}
                        </h2>
                        <p
                          className={`font-label-md text-label-md uppercase font-semibold mt-space-xs ${
                            creator.tone === "lime" ? "text-tertiary-fixed" : tone.text
                          }`}
                        >
                          {creator.role}
                        </p>
                      </div>
                      <div className="pt-space-sm mt-space-sm flex items-center justify-between border-t border-surface-variant">
                        <span className="text-label-sm font-label-sm text-on-surface-variant uppercase">
                          {creator.specialty}
                        </span>
                        <span
                          className={`material-symbols-outlined ${tone.text} text-base group-hover:scale-125 transition-transform`}
                        >
                          {creator.icon}
                        </span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {visibleCreators.length === 0 && (
            <div className="text-center py-16 bg-surface-container border border-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">
                person_search
              </span>
              <p className="font-headline-sm text-lg uppercase text-primary">
                No creators found
              </p>
              <p className="text-sm text-on-surface-variant mt-1">
                Try searching for &quot;Editor&quot;, &quot;Audio&quot;, or &quot;Maya&quot;.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Field Rhythm Section */}
      <section className="w-full bg-surface-container-lowest py-space-xl border-t border-surface-variant/40">
        <div className="max-w-7xl mx-auto px-gutter">
          <Reveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <span className="text-label-sm font-label-sm text-primary-fixed uppercase tracking-widest block mb-space-xs font-mono font-bold">
                {"// FIELD RHYTHM"}
              </span>
              <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-primary">
                LIFE AT RESOLUTION CLUB
              </h2>
            </div>
            <span className="text-label-md font-label-md uppercase tracking-wider text-on-surface-variant bg-surface-container px-space-sm py-space-xs border border-surface-variant font-mono">
              Weekly Crew Schedule AY 24-25
            </span>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {lifeCards.map((card, idx) => (
              <Reveal key={card.title} delay={idx * 80} direction="up">
                <div className="bg-surface-container p-space-md flex flex-col justify-between border border-surface-variant hover:bg-surface-container-high transition-all hover:-translate-y-1 shadow-[4px_4px_0px_0px_#292a2b] hover:shadow-[4px_4px_0px_0px_#c3f400]">
                  <div className="flex items-center justify-between mb-space-md">
                    <span
                      className={`px-2 py-0.5 ${card.badgeClass} font-bold font-label-sm uppercase tracking-wider shadow-[2px_2px_0px_0px_#ffffff]`}
                    >
                      {card.badge}
                    </span>
                    <span
                      className={`material-symbols-outlined ${card.iconClass} text-xl animate-pulse`}
                    >
                      {card.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm uppercase text-primary mb-space-xs font-bold">
                      {card.title}
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-mono">
                      {card.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bootcamp Recruitment Banner */}
      <section className="w-full bg-primary-container text-on-primary-fixed py-space-xl relative overflow-hidden border-t border-surface-variant/40">
        <div className="max-w-7xl mx-auto px-gutter relative z-10">
          <Reveal direction="zoom" className="bg-surface-container-lowest text-on-surface p-space-xl border-2 border-primary-fixed shadow-[8px_8px_0px_0px_#004cf6]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg mb-space-lg">
              <div>
                <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-space-sm font-bold shadow-[2px_2px_0px_0px_#ffffff]">
                  <span className="w-2 h-2 rounded-full bg-on-primary-fixed animate-ping" />
                  Spring 2025 Rookie Bootcamp
                </div>
                <h2 className="font-display-xl text-display-xl uppercase tracking-tight text-primary leading-none">
                  NO EXPERIENCE? NO PROBLEM.
                </h2>
              </div>
              <Link
                href="/join"
                className="px-space-xl py-space-md bg-primary-container text-on-primary-fixed hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all font-label-lg text-label-lg uppercase tracking-wider font-bold shadow-[4px_4px_0px_0px_#ffffff] shrink-0 inline-flex items-center gap-space-xs hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                <span>Audition / Join Crew</span>
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
              {[
                {
                  step: "01",
                  title: "Gear Training",
                  detail: "Sony FX6 & Cinema Rigs",
                  circle: "bg-primary-container text-on-primary-fixed",
                  label: "text-primary-fixed",
                },
                {
                  step: "02",
                  title: "Shoot",
                  detail: "Boom Mics & Directing",
                  circle: "bg-secondary text-on-secondary",
                  label: "text-secondary-fixed",
                },
                {
                  step: "03",
                  title: "Edit",
                  detail: "DaVinci & Sound Mix",
                  circle: "bg-tertiary-fixed text-on-tertiary",
                  label: "text-tertiary-fixed",
                },
                {
                  step: "04",
                  title: "Premiere",
                  detail: "60s Film Screening",
                  circle: "bg-surface-bright text-primary",
                  label: "text-primary-fixed",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-center gap-space-sm bg-surface-container p-space-md border border-surface-variant hover:border-primary-fixed transition-colors"
                >
                  <span
                    className={`w-8 h-8 rounded-none ${item.circle} flex items-center justify-center font-bold font-mono text-xs shrink-0 shadow-[2px_2px_0px_0px_#ffffff]`}
                  >
                    {item.step}
                  </span>
                  <div>
                    <span
                      className={`text-label-sm font-label-sm ${item.label} uppercase tracking-wider block font-bold`}
                    >
                      {item.title}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {item.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Creator Detail Modal */}
      <Modal
        open={selectedCreator !== null}
        onClose={() => setSelectedCreator(null)}
        labelledBy="creator-modal-title"
        panelClassName="bg-surface-container-low max-w-2xl w-full border border-surface-variant p-4 sm:p-6 shadow-[10px_10px_0px_0px_#c3f400] relative"
      >
        {selectedCreator && (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-surface-variant/40">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed font-mono text-xs font-bold uppercase">
                  {selectedCreator.code}
                </span>
                <span className="font-headline-sm text-headline-sm uppercase text-primary">
                  Crew Member Dossier
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCreator(null)}
                className="w-8 h-8 flex items-center justify-center bg-surface-container text-on-surface hover:bg-error-container hover:text-on-error-container font-bold"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-5 relative aspect-[4/5] bg-surface-container-highest overflow-hidden border border-surface-variant">
                <Image
                  src={selectedCreator.image}
                  alt={selectedCreator.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="sm:col-span-7 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary-fixed text-xs font-bold uppercase">
                    <span>{selectedCreator.department}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedCreator.year}</span>
                  </div>
                  <h3
                    id="creator-modal-title"
                    className="font-headline-lg text-headline-lg uppercase text-primary mt-1"
                  >
                    {selectedCreator.name}
                  </h3>
                  <p className="text-tertiary-fixed font-semibold uppercase text-xs">
                    {selectedCreator.role}
                  </p>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-2">
                    Specialized in {selectedCreator.specialty.toLowerCase()}. Certified operator
                    for club film productions, multi-cam live events, and festival releases.
                  </p>
                </div>

                <div className="space-y-2 bg-surface-container p-3 border border-surface-variant/40">
                  <span className="font-label-sm text-xs text-outline uppercase tracking-wider font-bold">
                    Primary Production Rig:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-fixed text-base">
                      {selectedCreator.gearIcon}
                    </span>
                    <span className="text-xs uppercase font-bold text-primary">
                      {selectedCreator.gear}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href="/join"
                    className="flex-1 py-2 bg-primary-container text-on-primary-fixed hover:bg-tertiary-fixed text-center font-label-sm text-xs uppercase font-bold tracking-wider transition-colors shadow-[2px_2px_0px_0px_#ffffff]"
                  >
                    Request on Dispatch →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedCreator(null)}
                    className="px-3 py-2 bg-surface-container hover:bg-surface-container-high text-xs uppercase font-bold text-on-surface"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
