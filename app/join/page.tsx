"use client";

import Image from "next/image";
import { useState } from "react";
import { faqs, joinImages } from "@/lib/collective";

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full overflow-hidden bg-surface-container-lowest px-gutter py-space-xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs bg-surface-container-high rounded-full ring-1 ring-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">
                Now Booking Fall/Spring Cycles • Open Auditions
              </span>
            </div>
            <div className="flex items-center gap-space-md font-label-sm text-label-sm uppercase">
              <span className="text-primary-fixed flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-sm">bolt</span> 48H
                Delivery
              </span>
              <span className="text-tertiary-fixed flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-sm">verified</span>{" "}
                $0 Student Org Tier
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-space-xs max-w-4xl">
            <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
              [ RESOLUTION CLUB // DISPATCH ]
            </span>
            <h1 className="font-display-xl text-display-xl uppercase tracking-tighter text-primary leading-none text-balance">
              Book Our Crew. Or Join It.
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl gap-space-sm pt-space-xs">
            <button
              type="button"
              onClick={() => setTrack("book")}
              className={`px-space-lg py-space-md font-headline-sm text-headline-sm uppercase font-bold tracking-tight rounded-none flex items-center justify-between transition-all ${
                track === "book"
                  ? "bg-primary-container text-on-primary-fixed shadow-xl"
                  : "bg-surface-container-high hover:bg-surface-bright text-on-surface shadow-md ring-1 ring-surface-variant"
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
              className={`px-space-lg py-space-md font-headline-sm text-headline-sm uppercase font-bold tracking-tight rounded-none flex items-center justify-between transition-all ${
                track === "join"
                  ? "bg-primary-container text-on-primary-fixed shadow-xl"
                  : "bg-surface-container-high hover:bg-surface-bright text-on-surface shadow-md ring-1 ring-surface-variant"
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
          </div>
        </div>
      </section>

      <section className="w-full bg-surface-container-low px-gutter py-space-xl relative">
        <div className="max-w-7xl mx-auto">
          {track === "book" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <div className="lg:col-span-4 flex flex-col gap-space-md">
                <div className="p-space-lg bg-surface-container shadow-2xl rounded-none flex flex-col gap-space-md border-l-2 border-primary-container relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-space-xs">
                    <span className="px-space-sm py-0.5 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-bold">
                      Field Production Unit
                    </span>
                    <span className="font-label-sm text-label-sm text-primary-fixed font-mono">
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
                  <div className="relative w-full h-44 overflow-hidden shadow-md">
                    <Image
                      src={joinImages.booking}
                      alt="Student camera operator filming an outdoor night concert on campus"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-space-xs py-0.5 bg-surface-container-lowest/90 text-primary-fixed font-label-sm text-label-sm">
                      REC ● SONY FX3 // 4K 10-BIT
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                    <div className="p-space-sm bg-surface-container-high rounded-none">
                      <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold block">
                        142+
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                        Events Covered
                      </span>
                    </div>
                    <div className="p-space-sm bg-surface-container-high rounded-none">
                      <span className="font-headline-sm text-headline-sm text-tertiary-fixed font-bold block">
                        4.9 / 5
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                        Satisfaction
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 p-space-lg bg-surface-container shadow-2xl rounded-none">
                <form
                  className="flex flex-col gap-space-lg"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setBookingSubmitted(true);
                  }}
                >
                  <div className="flex items-center justify-between border-b border-surface-variant pb-space-sm">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
                        Quick Booking Engine
                      </span>
                      <h3 className="font-headline-md text-headline-md uppercase text-primary">
                        Dispatch Request
                      </h3>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                      ~2 MIN FORM
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                      <label
                        className="font-label-md text-label-md uppercase text-on-surface font-bold"
                        htmlFor="orgName"
                      >
                        Student Org / Dept *
                      </label>
                      <input
                        className="w-full px-space-md py-space-sm bg-surface-container-highest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container rounded-none"
                        id="orgName"
                        placeholder="e.g. Student Union, Club Rugby"
                        required
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-space-xs">
                      <label
                        className="font-label-md text-label-md uppercase text-on-surface font-bold"
                        htmlFor="contactEmail"
                      >
                        University Email (.edu) *
                      </label>
                      <input
                        className="w-full px-space-md py-space-sm bg-surface-container-highest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container rounded-none"
                        id="contactEmail"
                        pattern=".+@.+\.edu"
                        placeholder="handle@university.edu"
                        required
                        type="email"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-md text-label-md uppercase text-on-surface font-bold">
                      1. Select Event Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                      {eventTypes.map((type) => {
                        const active = eventType === type.label;
                        return (
                          <button
                            key={type.label}
                            type="button"
                            onClick={() => setEventType(type.label)}
                            className={`p-space-sm font-label-md text-label-md uppercase text-left transition-colors ${
                              active
                                ? "bg-surface-bright border-l-2 border-primary-container text-primary"
                                : "bg-surface-container-highest text-on-surface hover:bg-surface-bright"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm block mb-1 text-primary-fixed">
                              {type.icon}
                            </span>
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                    <input type="hidden" value={eventType} readOnly />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                      <label
                        className="font-label-md text-label-md uppercase text-on-surface font-bold"
                        htmlFor="eventDate"
                      >
                        Event Date *
                      </label>
                      <input
                        className="w-full px-space-md py-space-sm bg-surface-container-highest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container rounded-none"
                        id="eventDate"
                        required
                        type="date"
                      />
                    </div>
                    <div className="flex flex-col gap-space-xs">
                      <label
                        className="font-label-md text-label-md uppercase text-on-surface font-bold"
                        htmlFor="eventLocation"
                      >
                        Campus Venue / Hall *
                      </label>
                      <input
                        className="w-full px-space-md py-space-sm bg-surface-container-highest text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container rounded-none"
                        id="eventLocation"
                        placeholder="e.g. Quad Amphitheater, Ballrooms"
                        required
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-md text-label-md uppercase text-on-surface font-bold">
                      2. Coverage Package *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                      {coveragePackages.map((item) => (
                        <label
                          key={item.label}
                          className="p-space-sm bg-surface-container-highest hover:bg-surface-bright cursor-pointer flex flex-col gap-space-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-primary-fixed text-lg">
                              {item.icon}
                            </span>
                            <input
                              defaultChecked={item.checked}
                              className="accent-primary-container"
                              name="coverage"
                              type="checkbox"
                              value={item.label}
                            />
                          </div>
                          <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-xs">
                    <label className="font-label-md text-label-md uppercase text-on-surface font-bold">
                      3. Budget Tier *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
                      {budgetTiers.map((tier) => (
                        <label
                          key={tier.price}
                          className={`p-space-md bg-surface-container-highest flex flex-col gap-1 cursor-pointer hover:bg-surface-bright transition-colors relative ${
                            tier.checked ? "border-b-2 border-primary-container" : ""
                          }`}
                        >
                          <input
                            defaultChecked={tier.checked}
                            className="accent-primary-container self-start mb-1"
                            name="budgetTier"
                            type="radio"
                            value={tier.label}
                          />
                          <span
                            className={`font-headline-sm text-headline-sm ${tier.tone} uppercase font-bold`}
                          >
                            {tier.price}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface uppercase">
                            {tier.label}
                          </span>
                          <span className="font-body-sm text-body-sm text-outline">
                            {tier.detail}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs border-t border-surface-variant">
                    <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase">
                      <span className="material-symbols-outlined text-primary-fixed text-base">
                        verified
                      </span>
                      Student Producer Assigned In ≤ 48H
                    </div>
                    <button
                      className="w-full sm:w-auto px-space-xl py-space-md bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all shadow-xl rounded-none flex items-center justify-center gap-space-sm"
                      type="submit"
                    >
                      Dispatch Coverage Crew
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>

                  {bookingSubmitted && (
                    <div className="p-space-md bg-primary-fixed/20 text-primary-fixed font-body-sm text-body-sm uppercase tracking-wide">
                      ✓ Production request dispatched! The assigned student
                      producer will reply via .edu email within 48 hours.
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {track === "join" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <div className="p-space-lg bg-surface-container shadow-2xl rounded-none flex flex-col gap-space-lg">
                  <div className="flex flex-wrap items-center justify-between gap-space-sm">
                    <span className="px-space-sm py-space-xs bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm uppercase font-bold">
                      Pathway 02 // Fall &amp; Spring Cycles
                    </span>
                    <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
                      No Experience Required • Gear Provided
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-xs">
                    <h2 className="font-display-lg text-display-lg uppercase tracking-tight text-primary leading-tight">
                      Join Resolution Club (Recruitment &amp; Auditions)
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">
                      Whether you&apos;ve never held a cine camera or you&apos;ve been
                      cutting on Premiere for years, Resolution Club provides the
                      mentorship, equipment, and live festival press passes to
                      level up your work.
                    </p>
                  </div>

                  <div className="p-space-md bg-surface-container-high rounded-none shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-primary-fixed text-2xl">
                        event_available
                      </span>
                      <div>
                        <div className="font-label-md text-label-md uppercase text-on-surface font-bold">
                          Current Cycle Deadlines
                        </div>
                        <div className="font-headline-sm text-headline-sm text-primary uppercase font-bold tracking-wide">
                          Fall Cycle: Sep 15 // Spring Cycle: Jan 26
                        </div>
                      </div>
                    </div>
                    <span className="px-space-sm py-space-xs bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase font-bold">
                      Apps Open
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-sm">
                    <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface font-bold flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary-fixed">
                        badge
                      </span>
                      Open Roles (Select One or Multiple on Form)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
                      {openRoles.map((role, index) => (
                        <div
                          key={role}
                          className="p-space-sm bg-surface-container-highest rounded-none flex items-center gap-space-xs"
                        >
                          <span
                            className={`w-2 h-2 ${
                              index < 3 ? "bg-primary-fixed" : "bg-tertiary-fixed"
                            }`}
                          />
                          <span className="font-label-md text-label-md uppercase text-on-surface">
                            {role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-sm">
                    <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface font-bold flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary-fixed">
                        route
                      </span>
                      The 4-Step Application Road
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-sm">
                      {applicationSteps.map((step) => (
                        <div
                          key={step.step}
                          className="p-space-sm bg-surface-container-highest flex flex-col gap-space-xs"
                        >
                          <span
                            className={`font-headline-sm text-headline-sm ${step.tone} font-mono font-bold`}
                          >
                            {step.step}
                          </span>
                          <span className="font-label-md text-label-md uppercase text-on-surface font-bold">
                            {step.title}
                          </span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {step.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-space-sm flex flex-col sm:flex-row items-center gap-space-md">
                    <a
                      className="w-full sm:w-auto px-space-xl py-space-md bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all rounded-none shadow-xl flex items-center justify-center gap-space-sm"
                      href="https://forms.google.com"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Fill Out Member Application Form
                      <span className="material-symbols-outlined">open_in_new</span>
                    </a>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                      Takes ~5 minutes. Requires active university login.
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <div className="p-space-lg bg-surface-container shadow-xl rounded-none flex flex-col gap-space-md">
                  <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase font-bold tracking-wider">
                    [ CREW INCENTIVES // PERKS ]
                  </span>
                  <h3 className="font-headline-md text-headline-md uppercase text-primary">
                    Why Join Resolution Club?
                  </h3>
                  <ul className="flex flex-col gap-space-md">
                    {perks.map((perk) => (
                      <li key={perk.title} className="flex items-start gap-space-sm">
                        <span className="material-symbols-outlined text-primary-fixed">
                          {perk.icon}
                        </span>
                        <div>
                          <h4 className="font-label-md text-label-md uppercase text-on-surface font-bold">
                            {perk.title}
                          </h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {perk.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="relative w-full h-40 overflow-hidden rounded-none shadow-md mt-space-sm">
                    <Image
                      src={joinImages.perks}
                      alt="Student media team reviewing photos and video footage together"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        className="w-full bg-surface-container-lowest px-gutter py-space-xl"
        id="cage-info"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
                Physical Hub • Student Center Level 2
              </span>
              <h2 className="font-headline-lg text-headline-lg uppercase text-primary">
                Studio 204 &amp; Equipment Cage
              </h2>
            </div>
            <div className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-high rounded-full ring-1 ring-surface-variant">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase font-bold">
                Active Cage Hours: Mon–Fri 2:00 PM – 8:00 PM
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="p-space-lg bg-surface-container rounded-none shadow-xl flex flex-col justify-between gap-space-md border-t-2 border-primary-container">
              <div className="flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-primary-fixed text-3xl">
                  location_on
                </span>
                <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface font-bold">
                  Studio 204 Pin
                </h3>
                <p className="font-body-md text-body-md text-primary font-bold">
                  Student Center B-Wing, Rm 204
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Next to University Radio 88.5 FM. Look for illuminated &apos;ON-AIR&apos;
                  neon.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase font-bold">
                Free Keycard Swipe Access
              </span>
            </div>

            <div className="p-space-lg bg-surface-container rounded-none shadow-xl flex flex-col justify-between gap-space-md border-t-2 border-tertiary-fixed">
              <div className="flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-tertiary-fixed text-3xl">
                  inventory_2
                </span>
                <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface font-bold">
                  Equipment Vault
                </h3>
                <p className="font-body-md text-body-md text-primary font-bold">
                  Mon – Fri: 2:00 – 8:00 PM
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Free checkout of FX3s, lenses, audio, and light kits for cleared
                  student members.
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase font-bold">
                72-Hour Free Loan Period
              </span>
            </div>

            <div className="p-space-lg bg-surface-container rounded-none shadow-xl flex flex-col justify-between gap-space-md border-t-2 border-secondary-fixed">
              <div className="flex flex-col gap-space-xs">
                <span className="material-symbols-outlined text-secondary-fixed text-3xl">
                  forum
                </span>
                <h3 className="font-headline-sm text-headline-sm uppercase text-on-surface font-bold">
                  Instant Crew Channels
                </h3>
                <p className="font-body-md text-body-md text-primary font-bold">
                  Discord Active 24/7
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  General meetings every Tuesday at 7:00 PM in Media Hall 101 with
                  free pizza.
                </p>
              </div>
              <a
                className="px-space-md py-space-xs bg-surface-bright hover:bg-primary-container hover:text-on-primary-fixed text-primary font-label-md text-label-md uppercase font-bold transition-all inline-flex items-center justify-between"
                href="https://discord.gg/resolutionclub"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Join Studio Discord</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-surface px-gutter py-space-xl">
        <div className="max-w-4xl mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col gap-space-xs text-center">
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
              Got Questions?
            </span>
            <h2 className="font-display-lg text-display-lg uppercase text-primary">
              Frequently Asked Questions
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Everything you need to know about joining our roster or booking our
              crew for your organization.
            </p>
          </div>

          <div className="flex flex-col gap-space-sm">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="bg-surface-container rounded-none shadow-md overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-space-lg py-space-md text-left flex items-center justify-between gap-space-md focus:outline-none"
                  >
                    <span className="font-headline-sm text-headline-sm uppercase text-on-surface font-semibold">
                      {faq.question}
                    </span>
                    <span
                      className={`material-symbols-outlined text-primary-fixed transform transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      {isOpen ? "remove" : "add"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-space-lg pb-space-md text-primary-fixed font-medium font-body-md text-body-md border-t-0">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-space-lg bg-surface-container-high rounded-none shadow-lg flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-fixed flex items-center justify-center font-bold text-xl">
                ?
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm uppercase text-primary">
                  Still have an unusual inquiry?
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Drop into our Discord channel or visit our studio desk during open
                  cage hours.
                </span>
              </div>
            </div>
            <a
              className="px-space-lg py-space-sm bg-surface-bright text-on-surface hover:text-primary-fixed font-label-md text-label-md uppercase font-bold tracking-wider rounded-none transition-colors"
              href="mailto:media-club@university.edu"
            >
              Email Our Exec Board
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
