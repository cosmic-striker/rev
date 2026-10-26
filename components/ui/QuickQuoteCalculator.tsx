"use client";

import { useState } from "react";

export default function QuickQuoteCalculator({
  onApplyEstimates,
}: {
  onApplyEstimates?: (summary: string) => void;
}) {
  const [eventType, setEventType] = useState<"fest" | "sports" | "gala" | "talk">("fest");
  const [orgType, setOrgType] = useState<"rso" | "dept" | "greek">("rso");
  const [duration, setDuration] = useState<"short" | "half" | "full">("half");
  const [deliverables, setDeliverables] = useState<string[]>([
    "Vertical Reels / TikTok",
    "4K Highlight Recap",
  ]);

  const toggleDeliverable = (item: string) => {
    setDeliverables((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  // Dynamic calculations based on choices
  const getCrewSize = () => {
    if (duration === "full" || eventType === "fest") return "3-4 Crew (Director, DP, Gimbal, Audio)";
    if (duration === "half") return "2-3 Crew (Lead DP, Second Shooter, Sound)";
    return "1-2 Crew (Solo Run-and-Gun DP + Audio)";
  };

  const getEstimatedTurnaround = () => {
    if (deliverables.includes("Vertical Reels / TikTok")) return "48 Hours (Rush Social Cut) + 5 Days Master";
    return "3-5 Business Days";
  };

  const getCost = () => {
    if (orgType === "rso") return "$0 (100% RSO Subsidized)";
    if (orgType === "greek") return "$75 Equipment Upkeep Donation";
    return "$150 Dept Internal Voucher";
  };

  const handleApply = () => {
    const summary = `${getCost()} | ${getCrewSize()} | Turnaround: ${getEstimatedTurnaround()} | Deliverables: ${deliverables.join(", ")}`;
    if (onApplyEstimates) {
      onApplyEstimates(summary);
    }
    const formElement = document.getElementById("request-coverage");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-surface-container-high border border-surface-variant p-4 sm:p-6 shadow-[8px_8px_0px_0px_#004cf6] relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-surface-variant/50">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-secondary-container" />
          <h3 className="font-headline-md text-headline-md uppercase text-primary text-base sm:text-lg">
            Interactive Coverage &amp; Crew Estimator
          </h3>
        </div>
        <span className="px-2 py-0.5 bg-primary-container text-on-primary-fixed font-label-sm text-xs font-bold uppercase tracking-wider">
          Real-Time University Pricing
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {/* Step 1: Event Type */}
        <div className="space-y-2">
          <label className="block font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
            1. Event Scope
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "fest", label: "Concert / Fest", icon: "celebration" },
              { id: "sports", label: "Athletics / Rally", icon: "sports_score" },
              { id: "gala", label: "Gala / Banquet", icon: "nightlife" },
              { id: "talk", label: "Keynote / Talk", icon: "mic" },
            ].map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEventType(e.id as typeof eventType)}
                className={`p-2 text-left flex items-center gap-2 transition-all ${
                  eventType === e.id
                    ? "bg-secondary-container text-on-surface shadow-[2px_2px_0px_0px_#ffffff]"
                    : "bg-surface-container text-on-surface-variant hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-base">{e.icon}</span>
                <span className="text-xs uppercase font-semibold truncate">{e.label}</span>
              </button>
            ))}
          </div>

          <label className="block font-label-sm text-label-sm uppercase text-on-surface-variant font-bold pt-2">
            2. Duration
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: "short", label: "1-2 Hours" },
              { id: "half", label: "3-5 Hours" },
              { id: "full", label: "Full Day" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDuration(d.id as typeof duration)}
                className={`py-1 px-1.5 text-center text-xs uppercase font-bold tracking-wider transition-colors ${
                  duration === d.id
                    ? "bg-primary-container text-on-primary-fixed"
                    : "bg-surface-container text-on-surface-variant hover:text-primary"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Org & Deliverables */}
        <div className="space-y-2">
          <label className="block font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
            3. Organization Category
          </label>
          <div className="space-y-1.5">
            {[
              { id: "rso", label: "Registered Student Org (RSO)", note: "100% Subsidized Fee Voucher" },
              { id: "greek", label: "Fraternity / Sorority / Club Sports", note: "Subsidized Equipment Fee" },
              { id: "dept", label: "Academic Dept / Administration", note: "Internal University PO" },
            ].map((org) => (
              <button
                key={org.id}
                type="button"
                onClick={() => setOrgType(org.id as typeof orgType)}
                className={`w-full p-2 text-left transition-all ${
                  orgType === org.id
                    ? "bg-surface-container-highest border-l-2 border-primary-fixed"
                    : "bg-surface-container text-on-surface-variant hover:text-primary"
                }`}
              >
                <p className="text-xs uppercase font-bold text-primary">{org.label}</p>
                <p className="text-xs text-tertiary-fixed">{org.note}</p>
              </button>
            ))}
          </div>

          <label className="block font-label-sm text-label-sm uppercase text-on-surface-variant font-bold pt-1">
            4. Required Deliverables
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              "Vertical Reels / TikTok",
              "4K Highlight Recap",
              "Full Raw Photo Album",
              "Multi-Cam Audio Stem",
            ].map((del) => {
              const active = deliverables.includes(del);
              return (
                <button
                  key={del}
                  type="button"
                  onClick={() => toggleDeliverable(del)}
                  className={`p-1.5 text-left text-xs uppercase font-semibold flex items-center gap-1.5 transition-colors ${
                    active
                      ? "bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/40"
                      : "bg-surface-container text-outline hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {active ? "check_box" : "check_box_outline_blank"}
                  </span>
                  <span className="truncate">{del}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Estimated Calculation Breakdown */}
        <div className="bg-surface-container-lowest p-4 border border-surface-variant flex flex-col justify-between space-y-3">
          <div>
            <span className="font-label-sm text-xs text-primary-fixed uppercase tracking-widest font-bold">
              ESTIMATED CREW DISPATCH QUOTE
            </span>
            <div className="mt-2 space-y-2">
              <div>
                <p className="text-xs uppercase text-outline">Total Budget Impact</p>
                <p className="font-headline-lg text-headline-md text-primary-fixed font-bold leading-none mt-0.5">
                  {getCost()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-outline">Recommended Crew</p>
                <p className="text-xs uppercase font-semibold text-primary mt-0.5">
                  {getCrewSize()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-outline">Estimated Delivery SLA</p>
                <p className="text-xs uppercase font-semibold text-tertiary-fixed mt-0.5">
                  {getEstimatedTurnaround()}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-outline">Production Gear Package</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Sony FX3 / FX30 Cinema Rigs, Gimbal Stabilization &amp; Wireless Audio.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            className="w-full py-2.5 bg-primary-container text-on-primary-fixed font-label-sm text-xs uppercase font-bold tracking-wider hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all shadow-[3px_3px_0px_0px_#ffffff] text-center"
          >
            Lock In This Estimate &amp; Book Crew →
          </button>
        </div>
      </div>
    </div>
  );
}

