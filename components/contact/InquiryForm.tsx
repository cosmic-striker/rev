"use client";

import { useRef, useState } from "react";
import { budgetTiers, hubOptions, scopeOptions } from "@/lib/data";
import Icon from "@/components/ui/Icon";

export default function InquiryForm() {
  const [scopes, setScopes] = useState<string[]>(["Commercial", "Brand Identity Film"]);
  const [budget, setBudget] = useState("$50k-$100k");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleScope = (id: string) => {
    setScopes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setFileName(
      files.length > 1
        ? `${files[0].name} (+${files.length - 1} more files)`
        : files[0].name
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <label className="flex flex-col gap-space-xs">
          <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
            Principal Contact Name *
          </span>
          <input
            required
            type="text"
            placeholder="Helena Vance"
            className="w-full bg-surface-container px-space-md py-space-sm rounded text-on-surface font-body-md placeholder:text-outline/40 focus:outline-none focus:bg-surface-container-high focus:ring-1 focus:ring-primary-container transition-all"
          />
        </label>
        <label className="flex flex-col gap-space-xs">
          <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
            Entity / Brand Name *
          </span>
          <input
            required
            type="text"
            placeholder="Aether Spatial Labs"
            className="w-full bg-surface-container px-space-md py-space-sm rounded text-on-surface font-body-md placeholder:text-outline/40 focus:outline-none focus:bg-surface-container-high focus:ring-1 focus:ring-primary-container transition-all"
          />
        </label>
      </div>

      <label className="flex flex-col gap-space-xs">
        <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
          Corporate Direct Email *
        </span>
        <input
          required
          type="email"
          placeholder="vance@aetherspatial.com"
          className="w-full bg-surface-container px-space-md py-space-sm rounded text-on-surface font-body-md placeholder:text-outline/40 focus:outline-none focus:bg-surface-container-high focus:ring-1 focus:ring-primary-container transition-all"
        />
      </label>

      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
            Discipline &amp; Scope (Multi-Select)
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-primary">
            {scopes.length} Selected
          </span>
        </div>
        <div className="flex flex-wrap gap-space-sm">
          {scopeOptions.map((opt) => {
            const active = scopes.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleScope(opt.id)}
                className={`inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-full font-label-md text-label-md uppercase tracking-[0.18em] transition-all duration-200 ${
                  active
                    ? "bg-primary-container text-on-primary-fixed shadow-[0_0_16px_rgba(0,229,255,0.35)]"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <Icon name={opt.icon} className="text-base" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
          Capital Allocation Parameter (USD)
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm">
          {budgetTiers.map((tier) => {
            const active = budget === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => setBudget(tier.value)}
                className={`flex flex-col items-center justify-center gap-1 p-space-md rounded transition-all duration-200 ${
                  active
                    ? "bg-surface-container-high text-on-surface shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span
                  className={`font-label-md text-label-md uppercase tracking-[0.18em] ${
                    active ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {tier.value}
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
                  {tier.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <label className="flex flex-col gap-space-xs">
          <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
            Target Public Premiere *
          </span>
          <input
            required
            type="date"
            className="w-full bg-surface-container px-space-md py-space-sm rounded text-on-surface font-body-md focus:outline-none focus:bg-surface-container-high focus:ring-1 focus:ring-primary-container transition-all [color-scheme:dark]"
          />
        </label>
        <label className="flex flex-col gap-space-xs">
          <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
            Preferred Hub
          </span>
          <select className="w-full bg-surface-container px-space-md py-space-sm rounded text-on-surface font-body-md focus:outline-none focus:bg-surface-container-high focus:ring-1 focus:ring-primary-container transition-all">
            {hubOptions.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-space-xs">
        <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
          Narrative Framework &amp; Objectives *
        </span>
        <textarea
          required
          rows={4}
          placeholder="Outline the core thesis, artistic mood, deliverable spectrum, and any relevant references..."
          className="w-full bg-surface-container p-space-md rounded text-on-surface font-body-md placeholder:text-outline/40 focus:outline-none focus:bg-surface-container-high focus:ring-1 focus:ring-primary-container transition-all resize-y"
        />
      </label>

      <div className="flex flex-col gap-space-sm">
        <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
          Asset Transmission / Deck, Moodboard, or NDA (Optional)
        </span>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`relative flex flex-col items-center justify-center gap-space-sm border border-dashed rounded-lg p-space-xl text-center transition-colors ${
            dragging
              ? "border-primary-container bg-surface-container-highest"
              : "border-outline-variant bg-surface-container"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Icon name="cloud_upload" className="text-primary-container text-3xl" />
          <span className="font-body-md text-body-md text-on-surface">
            Drag &amp; Drop Pitch Deck, Script, or Treatment
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            PDF, Keynote, MP4, or ZIP archive (Up to 250MB per packet)
          </span>
          {fileName && (
            <span className="font-label-sm text-label-sm uppercase tracking-[0.22em] text-primary">
              Attached: {fileName}
            </span>
          )}
        </div>
        <span className="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-[0.22em] text-on-surface-variant">
          <Icon name="lock" className="text-body-sm" />
          NDA Standard Protocols Active
        </span>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto self-start bg-primary-container text-on-primary-fixed font-label-md text-label-md uppercase tracking-[0.2em] px-space-xl py-space-md rounded hover:shadow-[0_0_32px_rgba(0,229,255,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-space-sm disabled:opacity-70"
      >
        {submitted
          ? "Directive Transmitted"
          : submitting
            ? "Encrypting & Routing..."
            : "Dispatch Commission Directive"}
        <Icon name={submitted ? "check" : "arrow_forward"} className="text-body-md" />
      </button>

      {submitted && (
        <div className="flex items-start gap-space-sm border border-primary-container/40 bg-primary-container/10 rounded-lg p-space-md">
          <Icon name="check_circle" className="text-primary-container" />
          <p className="font-body-md text-body-md text-on-surface">
            Transmission acknowledged. Executive producer dispatch assigned. We
            will reply in under 24 hours.
          </p>
        </div>
      )}
    </form>
  );
}
