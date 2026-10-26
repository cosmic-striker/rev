"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { faqs, joinImages } from "@/lib/collective";
import Reveal from "@/components/ui/Reveal";

const eventTypes = [
  { label: "Concert / Fest", icon: "celebration" },
  { label: "Sports / Rally", icon: "sports_score" },
  { label: "Banquet / Gala", icon: "nightlife" },
  { label: "Conference / Keynote", icon: "mic" },
];

const coveragePackages = [
  { label: "Video Recap", icon: "movie", checked: true },
  { label: "Full Photo Set", icon: "camera", checked: true },
  { label: "TikTok Reels", icon: "smartphone", checked: false },
  { label: "Livestream", icon: "podium", checked: false },
];

const budgetTiers = [
  {
    price: "$0 FREE",
    label: "Org Subsidized",
    detail: "Campus affairs grant",
    tone: "text-primary-fixed",
    checked: true,
  },
  {
    price: "$75",
    label: "Club Tier",
    detail: "Gear upkeep donation",
    tone: "text-tertiary-fixed",
    checked: false,
  },
  {
    price: "$200+",
    label: "Dept / Sponsored",
    detail: "Ticketed campus events",
    tone: "text-secondary-fixed",
    checked: false,
  },
];

const openRoles = [
  "Camera Operators",
  "Event Photographers",
  "Video Editors",
  "TikTok Creators",
  "Audio Techs",
  "Graphic Designers",
];

const applicationSteps = [
  {
    step: "01",
    title: "Online Form",
    detail: "5-minute submission of your interests & links.",
    tone: "text-primary-fixed",
  },
  {
    step: "02",
    title: "Welcome Mixer",
    detail: "Grab pizza, check out equipment, meet the directors.",
    tone: "text-primary-fixed",
  },
  {
    step: "03",
    title: "Casual Chat",
    detail: "15-minute vibe check to align goals & project teams.",
    tone: "text-primary-fixed",
  },
  {
    step: "04",
    title: "Join the Crew",
    detail: "Cage authorization badge & first live shoots!",
    tone: "text-tertiary-fixed",
  },
];

const perks = [
  {
    icon: "photo_camera",
    title: "$50,000+ Gear Cage Access",
    detail:
      "Free rental of Sony FX3, A7IV, G-Master primes, wireless lavs, and Aputure lights.",
  },
  {
    icon: "passkey",
    title: "Backstage Press Passes",
    detail:
      "Shoot pit access at Homecoming, Spring Fest, varsity rivalries, and comedy nights.",
  },
  {
    icon: "movie",
    title: "Standout Portfolio",
    detail:
      "Real, verified client work for festival reels, Vimeo showcases, and agency resumes.",
  },
  {
    icon: "local_pizza",
    title: "Pizza & Friendships",
    detail:
      "Weekly free pizza at general meetings and lifelong creative collaborators.",
  },
];

export default function JoinPage() {
  const [track, setTrack] = useState<"book" | "join">("book");
  const [eventType, setEventType] = useState("Concert / Fest");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const bookingFormRef = useRef<HTMLFormElement>(null);
  const joinFormRef = useRef<HTMLFormElement>(null);
  const bookingFormId = useId();
  const joinFormId = useId();

  // Role Matcher Quiz state
  const [vibeAnswer, setVibeAnswer] = useState<string | null>(null);
  const [eveningAnswer, setEveningAnswer] = useState<string | null>(null);

  const getRoleMatch = () => {
    if (!vibeAnswer || !eveningAnswer) return null;
    if (vibeAnswer === "action") return "Gimbal DP & Field Camera Operator (Sony FX3 + DJI RS3 Pro)";
    if (vibeAnswer === "sound") return "Lead Audio Recordist & Boom Operator (Sennheiser + MixPre)";
    if (vibeAnswer === "color") return "DaVinci Colorist & Post-Production Editor";
    return "Documentary Director & Investigative Reporter";
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-surface-container-lowest px-gutter py-space-xl border-b border-surface-variant/40">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg relative z-10">
          <Reveal direction="up" className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs bg-surface-container-high border border-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed font-bold">
                Now Booking Fall/Spring Cycles • Open Auditions
              </span>
            </div>
            <div className="flex items-center gap-space-md font-label-sm text-label-sm uppercase font-mono">
              <span className="text-primary-fixed flex items-center gap-space-xs font-bold">
                <span className="material-symbols-outlined text-sm">bolt</span> 48H
                Delivery
              </span>
              <span className="text-tertiary-fixed flex items-center gap-space-xs font-bold">
                <span className="material-symbols-outlined text-sm">verified</span>{" "}
                $0 Student Org Tier
              </span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={150} className="flex flex-col gap-space-xs max-w-4xl">
            <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold font-mono">
              [ RESOLUTION CLUB // DISPATCH ]
            </span>
            <h1 className="font-display-xl text-display-xl uppercase tracking-tighter text-primary leading-none text-balance">
              Book Our Crew. Or Join It.
            </h1>
          </Reveal>

          {/* Mode Switcher Tabs */}
          <Reveal direction="up" delay={250} className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl gap-space-sm pt-space-xs">
            <button
              type="button"
              onClick={() => setTrack("book")}
              className={`px-space-lg py-space-md font-headline-sm text-headline-sm uppercase font-bold tracking-tight flex items-center justify-between transition-all ${
                track === "book"
                  ? "bg-primary-container text-on-primary-fixed shadow-[4px_4px_0px_0px_#ffffff]"
                  : "bg-surface-container-high hover:bg-surface-bright text-on-surface border border-surface-variant shadow-[4px_4px_0px_0px_#292a2b]"
              }`}
            >
              <span className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-xl">videocam</span>
                I Need Event Coverage
              </span>
              <span className="material-symbols-outlined text-base">
                arrow_downward
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTrack("join")}
              className={`px-space-lg py-space-md font-headline-sm text-headline-sm uppercase font-bold tracking-tight flex items-center justify-between transition-all ${
                track === "join"
                  ? "bg-primary-container text-on-primary-fixed shadow-[4px_4px_0px_0px_#ffffff]"
                  : "bg-surface-container-high hover:bg-surface-bright text-on-surface border border-surface-variant shadow-[4px_4px_0px_0px_#292a2b]"
              }`}
            >
              <span className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-xl">group_add</span>
                I Want to Join Crew
              </span>
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* Main Track Section */}
      <section className="w-full bg-surface-container-low px-gutter py-space-xl relative border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto">
          {track === "book" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <Reveal direction="right" className="lg:col-span-4 flex flex-col gap-space-md">
                <div className="p-space-lg bg-surface-container shadow-[8px_8px_0px_0px_#004cf6] border border-surface-variant flex flex-col gap-space-md border-l-4 border-l-primary-fixed relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-space-xs">
                    <span className="px-space-sm py-0.5 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-bold">
                      Field Production Unit
                    </span>
                    <span className="font-label-sm text-label-sm text-primary-fixed font-mono font-bold">
                      EST. 24H DISPATCH
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg uppercase tracking-tight text-primary">
                    On-Campus Pro Media Dispatch
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Full multicam cinema coverage, flash photo ops, and high-energy
                    vertical reels powered by university creators.
                  </p>
                  <div className="relative w-full h-44 overflow-hidden shadow-md border border-surface-variant">
                    <Image
                      src={joinImages.booking}
                      alt="Student camera operator filming an outdoor night concert on campus"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-space-xs py-0.5 bg-surface-container-lowest/90 text-primary-fixed font-label-sm text-label-sm font-mono text-xs">
                      REC ● SONY FX3 // 4K 10-BIT
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                    <div className="p-space-sm bg-surface-container-high border border-surface-variant/40">
                      <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold block">
                        142+
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                        Events Covered
                      </span>
                    </div>
                    <div className="p-space-sm bg-surface-container-high border border-surface-variant/40">
                      <span className="font-headline-sm text-headline-sm text-tertiary-fixed font-bold block">
                        4.9 / 5
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                        Satisfaction
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="left" delay={150} className="lg:col-span-8 bg-surface-container p-space-lg shadow-[8px_8px_0px_0px_#c3f400] border border-surface-variant">
                <form
                  ref={bookingFormRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBookingSubmitted(true);
                    bookingFormRef.current?.reset();
                  }}
                  className="space-y-space-md"
                >
                  <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant/40">
                    <h3 className="font-headline-md text-headline-md uppercase text-primary">
                      Coverage Booking Request
                    </h3>
                    <span className="text-primary-fixed font-label-sm text-label-sm uppercase font-mono font-bold">
                      STEP 1 OF 2
                    </span>
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm uppercase text-on-surface mb-space-xs font-bold">
                      1. Select Event Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                      {eventTypes.map((et) => (
                        <button
                          key={et.label}
                          type="button"
                          onClick={() => setEventType(et.label)}
                          className={`p-space-sm text-left flex flex-col gap-1 transition-all border ${
                            eventType === et.label
                              ? "bg-primary-container text-on-primary-fixed border-primary-fixed shadow-[2px_2px_0px_0px_#ffffff] font-bold"
                              : "bg-surface-container-high text-on-surface border-surface-variant hover:border-primary-fixed"
                          }`}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {et.icon}
                          </span>
                          <span className="font-label-sm text-label-sm uppercase">
                            {et.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div>
                      <label
                        htmlFor={`${bookingFormId}-name`}
                        className="block font-label-sm text-label-sm uppercase text-on-surface mb-1 font-semibold"
                      >
                        Your Name *
                      </label>
                      <input
                        id={`${bookingFormId}-name`}
                        name="name"
                        autoComplete="name"
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-surface-container-high text-primary px-space-md py-space-sm text-xs border border-surface-variant focus:outline-none focus:border-primary-fixed"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`${bookingFormId}-email`}
                        className="block font-label-sm text-label-sm uppercase text-on-surface mb-1 font-semibold"
                      >
                        University Email (.edu) *
                      </label>
                      <input
                        id={`${bookingFormId}-email`}
                        name="email"
                        autoComplete="email"
                        type="email"
                        required
                        placeholder="alex@university.edu"
                        className="w-full bg-surface-container-high text-primary px-space-md py-space-sm text-xs border border-surface-variant focus:outline-none focus:border-primary-fixed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div>
                      <label
                        htmlFor={`${bookingFormId}-organization`}
                        className="block font-label-sm text-label-sm uppercase text-on-surface mb-1 font-semibold"
                      >
                        Student Org / Club *
                      </label>
                      <input
                        id={`${bookingFormId}-organization`}
                        name="organization"
                        autoComplete="organization"
                        type="text"
                        required
                        placeholder="e.g. Asian Student Union / Robotics Club"
                        className="w-full bg-surface-container-high text-primary px-space-md py-space-sm text-xs border border-surface-variant focus:outline-none focus:border-primary-fixed"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`${bookingFormId}-event-date`}
                        className="block font-label-sm text-label-sm uppercase text-on-surface mb-1 font-semibold"
                      >
                        Event Date &amp; Time *
                      </label>
                      <input
                        id={`${bookingFormId}-event-date`}
                        name="eventDate"
                        type="datetime-local"
                        required
                        className="w-full bg-surface-container-high text-primary px-space-md py-space-sm text-xs border border-surface-variant focus:outline-none focus:border-primary-fixed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm uppercase text-on-surface mb-1 font-semibold">
                      Package Deliverables
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                      {coveragePackages.map((pkg, index) => (
                        <label
                          key={pkg.label}
                          htmlFor={`${bookingFormId}-package-${index}`}
                          className="flex items-center gap-space-xs p-space-xs bg-surface-container-high border border-surface-variant cursor-pointer hover:bg-surface-bright"
                        >
                          <input
                            id={`${bookingFormId}-package-${index}`}
                            name="packages"
                            value={pkg.label}
                            type="checkbox"
                            defaultChecked={pkg.checked}
                            className="accent-primary-fixed"
                          />
                          <span className="font-label-sm text-label-sm text-on-surface uppercase">
                            {pkg.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm uppercase text-on-surface mb-1 font-semibold">
                      Budget &amp; Funding Tier
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
                      {budgetTiers.map((b, index) => (
                        <label
                          key={b.label}
                          htmlFor={`${bookingFormId}-budget-${index}`}
                          className="p-space-xs bg-surface-container-high border border-surface-variant flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className={`font-headline-sm text-sm font-bold block ${b.tone}`}>
                              {b.price}
                            </span>
                            <span className="font-label-sm text-xs uppercase text-on-surface">
                              {b.label}
                            </span>
                          </div>
                          <input
                            id={`${bookingFormId}-budget-${index}`}
                            type="radio"
                            name="budgetTier"
                            value={b.label}
                            defaultChecked={b.checked}
                            className="accent-primary-fixed"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {bookingSubmitted && (
                    <div className="p-space-sm bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase font-bold flex items-center justify-between shadow-[2px_2px_0px_0px_#ffffff] animate-bounce">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          check_circle
                        </span>
                        Booking registered! Production Director will reply within 24 hours.
                      </span>
                      <button
                        onClick={() => setBookingSubmitted(false)}
                        type="button"
                        className="text-on-primary-fixed font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-space-md bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                  >
                    Confirm Booking Request →
                  </button>
                </form>
              </Reveal>
            </div>
          )}

          {track === "join" && (
            <div className="space-y-space-xl">
              {/* Role Matcher Quiz */}
              <Reveal direction="up" className="bg-surface-container p-space-lg border border-surface-variant shadow-[8px_8px_0px_0px_#004cf6]">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-space-sm border-b border-surface-variant/40">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary-fixed text-xl">
                      psychology
                    </span>
                    <h3 className="font-headline-md text-headline-md uppercase text-primary">
                      Interactive Crew Role Matcher Quiz
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed font-mono text-xs font-bold uppercase">
                    30-Second Discovery
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg pt-space-md">
                  <div className="space-y-2">
                    <p className="block font-label-sm text-label-sm text-on-surface uppercase font-bold">
                      1. What kind of creative energy calls to you most?
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { id: "action", label: "Dynamic movement, fast pacing & running with the camera" },
                        { id: "color", label: "Color aesthetics, fine cuts, and rhythm in the edit suite" },
                        { id: "sound", label: "Capturing pristine soundscapes, music, and mic craft" },
                        { id: "story", label: "Investigating questions, interviewing students, journalism" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={vibeAnswer === item.id}
                          onClick={() => setVibeAnswer(item.id)}
                          className={`w-full p-2.5 text-left text-xs uppercase font-semibold transition-all border ${
                            vibeAnswer === item.id
                              ? "bg-primary-container text-on-primary-fixed border-primary-fixed shadow-[2px_2px_0px_0px_#ffffff]"
                              : "bg-surface-container-high text-on-surface border-surface-variant hover:border-primary-fixed"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="block font-label-sm text-label-sm text-on-surface uppercase font-bold">
                      2. How would you spend your ideal Friday night on campus?
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { id: "field", label: "In the front row / media pit of a packed concert or game" },
                        { id: "suite", label: "At a 24-hour edit jam with pizza and synthesizers" },
                        { id: "interview", label: "Tracking down an intriguing campus story lead" },
                        { id: "tech", label: "Tinkering with cinema prime lenses, gimbals and lights" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={eveningAnswer === item.id}
                          onClick={() => setEveningAnswer(item.id)}
                          className={`w-full p-2.5 text-left text-xs uppercase font-semibold transition-all border ${
                            eveningAnswer === item.id
                              ? "bg-secondary-container text-on-surface border-secondary-fixed shadow-[2px_2px_0px_0px_#ffffff]"
                              : "bg-surface-container-high text-on-surface border-surface-variant hover:border-secondary-fixed"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {getRoleMatch() && (
                  <div className="mt-space-md p-space-md bg-surface-container-lowest border-2 border-primary-fixed flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-[4px_4px_0px_0px_#c3f400]">
                    <div>
                      <span className="font-mono text-xs text-tertiary-fixed uppercase font-bold">
                        RECOMMENDED CREW COHORT:
                      </span>
                      <p className="font-headline-sm text-primary-fixed font-bold uppercase text-base mt-0.5">
                        {getRoleMatch()}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Free equipment cage checkout privileges included upon bootcamp completion.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const form = document.getElementById("audition-form");
                        if (form) form.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="whitespace-nowrap px-space-md py-space-sm bg-primary-container text-on-primary-fixed uppercase font-bold text-xs tracking-wider hover:bg-tertiary-fixed shadow-[2px_2px_0px_0px_#ffffff]"
                    >
                      Apply For This Role →
                    </button>
                  </div>
                )}
              </Reveal>

              {/* 4-Step Onboarding Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {applicationSteps.map((s, idx) => (
                  <Reveal key={s.step} delay={idx * 80} direction="up">
                    <div className="p-space-md bg-surface-container border border-surface-variant hover:border-primary-fixed transition-all shadow-[4px_4px_0px_0px_#292a2b]">
                      <span className={`font-display-lg text-display-lg ${s.tone} font-extrabold leading-none`}>
                        {s.step}
                      </span>
                      <h4 className="font-headline-sm text-headline-sm uppercase text-primary mt-1 font-bold">
                        {s.title}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-1">
                        {s.detail}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Audition Application Form */}
              <Reveal direction="up" className="bg-surface-container p-space-lg shadow-[8px_8px_0px_0px_#c3f400] border border-surface-variant" id="audition-form">
                <div className="flex flex-wrap items-center justify-between pb-space-sm mb-space-md border-b border-surface-variant/40">
                  <h3 className="font-headline-md text-headline-md uppercase text-primary">
                    Fall &amp; Spring Crew Audition Form
                  </h3>
                  <span className="font-mono text-xs text-primary-fixed font-bold uppercase">
                    ALL MAJORS WELCOME • ZERO FEES
                  </span>
                </div>

                <form
                  ref={joinFormRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setJoinSubmitted(true);
                    joinFormRef.current?.reset();
                  }}
                  className="space-y-space-md"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                    <div>
                      <label
                        htmlFor={`${joinFormId}-name`}
                        className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                      >
                        Full Name *
                      </label>
                      <input
                        id={`${joinFormId}-name`}
                        name="name"
                        autoComplete="name"
                        type="text"
                        required
                        placeholder="e.g. Jordan Hayes"
                        className="w-full bg-surface-container-high text-primary px-space-md py-space-sm text-xs border border-surface-variant focus:outline-none focus:border-primary-fixed"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`${joinFormId}-email`}
                        className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                      >
                        University Email *
                      </label>
                      <input
                        id={`${joinFormId}-email`}
                        name="email"
                        autoComplete="email"
                        type="email"
                        required
                        placeholder="jordan@university.edu"
                        className="w-full bg-surface-container-high text-primary px-space-md py-space-sm text-xs border border-surface-variant focus:outline-none focus:border-primary-fixed"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`${joinFormId}-graduation`}
                        className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                      >
                        Graduation Year &amp; Major *
                      </label>
                      <input
                        id={`${joinFormId}-graduation`}
                        name="graduation"
                        type="text"
                        required
                        placeholder="e.g. '26 Film / Computer Science"
                        className="w-full bg-surface-container-high text-primary px-space-md py-space-sm text-xs border border-surface-variant focus:outline-none focus:border-primary-fixed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold">
                      Primary Department of Interest
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
                      {openRoles.map((role, idx) => (
                        <label
                          key={role}
                          htmlFor={`${joinFormId}-role-${idx}`}
                          className="flex items-center gap-space-xs p-space-xs bg-surface-container-high border border-surface-variant cursor-pointer hover:bg-surface-bright"
                        >
                          <input
                            id={`${joinFormId}-role-${idx}`}
                            name="roles"
                            value={role}
                            type="checkbox"
                            defaultChecked={idx === 0}
                            className="accent-primary-fixed"
                          />
                          <span className="font-label-sm text-label-sm text-on-surface uppercase">
                            {role}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`${joinFormId}-portfolio`}
                      className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                    >
                      Portfolio / Social Links (Optional)
                    </label>
                    <input
                      id={`${joinFormId}-portfolio`}
                      name="portfolio"
                      autoComplete="url"
                      type="text"
                      placeholder="e.g. Instagram, YouTube, Vimeo, Behance, or Google Drive folder"
                      className="w-full bg-surface-container-high text-primary px-space-md py-space-sm text-xs border border-surface-variant focus:outline-none focus:border-primary-fixed"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`${joinFormId}-why`}
                      className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                    >
                      Why do you want to join Resolution Club?
                    </label>
                    <textarea
                      id={`${joinFormId}-why`}
                      name="why"
                      rows={3}
                      placeholder="Tell us about the kinds of stories you want to capture, your creative heroes, or what you want to learn..."
                      className="w-full bg-surface-container-high text-primary px-space-md py-space-sm text-xs border border-surface-variant focus:outline-none focus:border-primary-fixed resize-none"
                    />
                  </div>

                  {joinSubmitted && (
                    <div className="p-space-sm bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase font-bold flex items-center justify-between shadow-[2px_2px_0px_0px_#ffffff] animate-bounce">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          check_circle
                        </span>
                        Application received! Check your inbox for the welcome mixer details.
                      </span>
                      <button
                        onClick={() => setJoinSubmitted(false)}
                        type="button"
                        className="text-on-primary-fixed font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-space-md bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                  >
                    Submit Crew Application →
                  </button>
                </form>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* Perks Strip */}
      <section className="w-full bg-surface py-space-xl border-b border-surface-variant/40">
        <div className="max-w-7xl mx-auto px-gutter space-y-space-lg">
          <Reveal direction="up" className="text-center max-w-2xl mx-auto">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed font-bold font-mono">
              [ MEMBER ADVANTAGES ]
            </span>
            <h2 className="font-headline-lg text-headline-lg uppercase text-primary mt-1">
              Why Students Choose Resolution Club
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {perks.map((p, idx) => (
              <Reveal key={p.title} delay={idx * 80} direction="up">
                <div className="p-space-md bg-surface-container border border-surface-variant hover:border-primary-fixed transition-all shadow-[4px_4px_0px_0px_#292a2b] hover:shadow-[4px_4px_0px_0px_#c3f400] flex flex-col justify-between">
                  <span className="material-symbols-outlined text-primary-fixed text-3xl mb-space-xs">
                    {p.icon}
                  </span>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm uppercase text-primary font-bold">
                      {p.title}
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                      {p.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="w-full bg-surface-container-lowest py-space-xl">
        <div className="max-w-4xl mx-auto px-gutter space-y-space-md">
          <Reveal direction="up" className="text-center pb-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed font-bold font-mono">
              [ FAQ DISPATCH ]
            </span>
            <h2 className="font-headline-lg text-headline-lg uppercase text-primary mt-1">
              Common Questions &amp; Protocols
            </h2>
          </Reveal>

          <div className="space-y-space-xs">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.question}
                  className="bg-surface-container border border-surface-variant/40 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-space-md text-left flex items-center justify-between text-primary font-headline-sm text-sm uppercase hover:text-primary-fixed transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`material-symbols-outlined transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary-fixed" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-space-md pb-space-md pt-0 text-on-surface-variant font-body-sm text-xs border-t border-surface-variant/20 pt-space-xs">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
