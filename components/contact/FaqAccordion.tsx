"use client";

import { useState } from "react";
import { faqs } from "@/lib/data";
import Icon from "@/components/ui/Icon";

export default function FaqAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-col border-t border-outline-variant">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <div key={faq.id} className="border-b border-outline-variant">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="w-full px-space-lg py-space-md flex items-center justify-between gap-space-md text-left"
              aria-expanded={isOpen}
            >
              <span className="font-title-lg text-title-lg text-on-surface">
                <span className="font-label-md text-label-md uppercase tracking-[0.18em] text-primary mr-space-md">
                  {String(faqs.indexOf(faq) + 1).padStart(2, "0")}
                </span>
                {faq.question}
              </span>
              <Icon
                name="expand_more"
                className={`text-primary transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-space-lg pb-space-md font-body-md text-body-md text-on-surface-variant">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
