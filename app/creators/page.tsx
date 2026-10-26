"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { creators } from "@/lib/collective";

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

  const visibleCreators =
    activeFilter === "all"
      ? creators
      : creators.filter((creator) => creator.depts.includes(activeFilter));

  return (
    <div className="flex flex-col w-full">
      <div className="w-full bg-surface-container-lowest text-primary-fixed py-space-xs overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-gutter flex items-center justify-between text-label-sm font-label-sm tracking-widest uppercase">
          <div className="flex items-center gap-space-sm">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
            <span>REC STATUS: ACTIVE DISPATCH // CREW INDEX AY 2024–2025</span>
          </div>
          <div className="hidden sm:flex items-center gap-space-lg text-on-surface-variant font-body-sm">
            <span>CAM A: 4K 24FPS</span>
            <span>ISO: 800</span>
            <span>SHUTTER: 1/48</span>
            <span className="text-primary-fixed font-bold font-label-sm">
              STUDIO B12 ONLINE
            </span>
          </div>
        </div>
      </div>

      <section className="w-full bg-surface-container-low pt-space-xl pb-space-lg">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-highest text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-space-md">
            <span className="w-1.5 h-1.5 bg-primary-fixed" />
            Executive Board &amp; Crew Roster // Academic Year 2024-2025
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end mb-space-xl">
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
              <div className="bg-surface-container p-space-md">
                <span className="text-label-sm font-label-sm text-primary-fixed uppercase tracking-wider block mb-space-xs">
                  {"// DISPATCH PROTOCOL"}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface leading-snug">
                  Every package is researched, captured, scored, and mastered
                  autonomously by undergraduates. Free equipment cage access
                  granted to all certified active members.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xs bg-surface-container-highest p-space-xs">
            <div className="bg-surface-container p-space-md flex flex-col justify-between">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
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
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
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
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
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
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                Mentorship
              </span>
              <span className="font-display-lg text-display-lg text-primary-fixed-dim leading-none mt-space-xs">
                04
              </span>
              <span className="font-label-sm text-label-sm text-on-surface uppercase mt-space-xs">
                Faculty Advisors
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-surface-container-lowest py-space-md sticky top-20 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex items-center justify-between gap-space-md overflow-x-auto pb-space-xs scrollbar-none">
            <div className="flex items-center gap-space-xs shrink-0" role="tablist">
              {filters.map((filter) => {
                const active = activeFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-space-md py-space-xs text-label-lg font-label-lg uppercase tracking-wider transition-all ${
                      active
                        ? "bg-primary-container text-on-primary-fixed shadow-[3px_3px_0px_0px_#ffffff]"
                        : "bg-surface-container text-on-surface hover:bg-surface-bright"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
            <div className="hidden xl:flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm tracking-wider uppercase shrink-0">
              <span className="material-symbols-outlined text-sm text-primary-fixed">
                tune
              </span>
              <span>
                Showing:{" "}
                <strong className="text-primary">
                  {visibleCreators.length}{" "}
                  {visibleCreators.length === 1 ? "Creator" : "Creators"}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-space-xl">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {visibleCreators.map((creator) => {
              const tone = toneClasses[creator.tone];
              return (
                <article
                  key={creator.id}
                  className="student-card group flex flex-col bg-surface-container relative overflow-hidden transition-all duration-300 hover:translate-x-1 hover:-translate-y-1 shadow-md border border-surface-variant"
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
                        <span className="text-label-sm font-label-sm text-primary-fixed bg-surface-container-lowest/80 px-1.5 py-0.5 font-bold">
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
                          className={`text-label-sm font-label-sm ${tone.on} ${tone.bg} px-1.5 py-0.5 font-bold uppercase`}
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
                          className={`inline-block bg-surface-container-highest px-space-xs py-0.5 text-label-sm font-label-sm ${tone.text} font-medium`}
                        >
                          {creator.year}
                        </span>
                      </div>
                      <h2 className="font-headline-sm text-headline-sm uppercase text-primary tracking-tight font-bold">
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
                        className={`material-symbols-outlined ${tone.text} text-base`}
                      >
                        {creator.icon}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-surface-container-lowest py-space-xl">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <span className="text-label-sm font-label-sm text-primary-fixed uppercase tracking-widest block mb-space-xs">
                {"// FIELD RHYTHM"}
              </span>
              <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-primary">
                LIFE AT RESOLUTION CLUB
              </h2>
            </div>
            <span className="text-label-md font-label-md uppercase tracking-wider text-on-surface-variant bg-surface-container px-space-sm py-space-xs">
              Weekly Crew Schedule AY 24-25
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {lifeCards.map((card) => (
              <div
                key={card.title}
                className="bg-surface-container p-space-md flex flex-col justify-between border border-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center justify-between mb-space-md">
                  <span
                    className={`px-2 py-0.5 ${card.badgeClass} font-bold font-label-sm uppercase tracking-wider`}
                  >
                    {card.badge}
                  </span>
                  <span
                    className={`material-symbols-outlined ${card.iconClass} text-xl`}
                  >
                    {card.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm uppercase text-primary mb-space-xs font-bold">
                    {card.title}
                  </h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    {card.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-primary-container text-on-primary-fixed py-space-xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-gutter relative z-10">
          <div className="bg-surface-container-lowest text-on-surface p-space-xl border-2 border-primary-fixed shadow-[6px_6px_0px_0px_#c3f400]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg mb-space-lg">
              <div>
                <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider mb-space-sm font-bold">
                  <span className="w-2 h-2 rounded-full bg-on-primary-fixed animate-pulse" />
                  Spring 2025 Rookie Bootcamp
                </div>
                <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-primary leading-none">
                  NO EXPERIENCE? NO PROBLEM.
                </h2>
              </div>
              <Link
                href="/join"
                className="px-space-xl py-space-md bg-primary-container text-on-primary-fixed hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all font-label-lg text-label-lg uppercase tracking-wider font-bold shadow-[4px_4px_0px_0px_#ffffff] shrink-0 inline-flex items-center gap-space-xs"
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
                  className="flex items-center gap-space-sm bg-surface-container p-space-md border border-surface-variant"
                >
                  <span
                    className={`w-8 h-8 rounded-full ${item.circle} flex items-center justify-center font-bold font-label-sm shrink-0`}
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
          </div>
        </div>
      </section>
    </div>
  );
}
