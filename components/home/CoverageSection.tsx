"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { homeImages } from "@/lib/collective";
import Reveal from "@/components/ui/Reveal";
import QuickQuoteCalculator from "@/components/ui/QuickQuoteCalculator";

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

interface CoverageSectionProps {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

export default function CoverageSection({ notes, setNotes }: CoverageSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const orgId = `${formId}-organization`;
  const dateId = `${formId}-date`;
  const notesId = `${formId}-notes`;

  const handleApplyEstimates = (summary: string) => {
    setNotes((previous) =>
      previous
        ? `${previous}\n[Auto-Estimate]: ${summary}`
        : `[Auto-Estimate]: ${summary}`
    );
  };

  return (
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
                <div className="text-label-sm text-on-surface-variant uppercase font-semibold text-xs">
                  Fast Social Delivery
                </div>
              </div>
              <div className="p-space-xs bg-surface-container text-center border border-surface-variant/40">
                <div className="text-secondary font-headline-sm font-bold">$0</div>
                <div className="text-label-sm text-on-surface-variant uppercase font-semibold text-xs">
                  Free For RSOs
                </div>
              </div>
              <div className="p-space-xs bg-surface-container text-center border border-surface-variant/40">
                <div className="text-tertiary-fixed font-headline-sm font-bold">4K</div>
                <div className="text-label-sm text-on-surface-variant uppercase font-semibold text-xs">
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
              ref={formRef}
              className="space-y-space-md"
              onSubmit={(event) => {
                event.preventDefault();
                setIsSubmitting(true);
                window.setTimeout(() => {
                  setIsSubmitting(false);
                  setSubmitted(true);
                  setNotes("");
                  formRef.current?.reset();
                }, 600);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div>
                  <label
                    htmlFor={nameId}
                    className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                  >
                    Contact Name *
                  </label>
                  <input
                    id={nameId}
                    name="name"
                    autoComplete="name"
                    className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline"
                    placeholder="e.g. Jordan Hayes"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label
                    htmlFor={emailId}
                    className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                  >
                    University Email (.edu) *
                  </label>
                  <input
                    id={emailId}
                    name="email"
                    autoComplete="email"
                    className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline"
                    placeholder="name@university.edu"
                    required
                    type="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div>
                  <label
                    htmlFor={orgId}
                    className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                  >
                    Student Org / Department *
                  </label>
                  <input
                    id={orgId}
                    name="organization"
                    autoComplete="organization"
                    className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline"
                    placeholder="e.g. Student Government / Engineering Society"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label
                    htmlFor={dateId}
                    className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                  >
                    Event Date &amp; Time *
                  </label>
                  <input
                    id={dateId}
                    name="eventDate"
                    className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline"
                    required
                    type="datetime-local"
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
                        htmlFor={`${formId}-package-${index}`}
                        className="flex items-center gap-space-xs p-space-xs bg-surface-container cursor-pointer hover:bg-surface-bright border border-surface-variant/40"
                      >
                        <input
                          id={`${formId}-package-${index}`}
                          name="packages"
                          value={label}
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
                <label
                  htmlFor={notesId}
                  className="block font-label-sm text-label-sm text-on-surface uppercase mb-1 font-semibold"
                >
                  Event Location, Gear Notes &amp; Story Details
                </label>
                <textarea
                  id={notesId}
                  name="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="w-full bg-surface-container text-on-surface px-space-md py-space-sm font-body-sm text-body-sm outline-none border border-surface-variant focus:border-primary-fixed placeholder:text-outline resize-none"
                  placeholder="Briefly describe what makes this event unique, estimated attendance, and any special camera or sound gear requested..."
                  rows={4}
                />
              </div>

              {submitted && (
                <div className="p-space-sm bg-primary-container text-on-primary-fixed font-label-sm text-label-sm uppercase font-bold flex items-center justify-between shadow-[2px_2px_0px_0px_#ffffff]">
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
  );
}
