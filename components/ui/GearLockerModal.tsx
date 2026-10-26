"use client";

import { useEffect, useState } from "react";

export type GearItem = {
  id: string;
  name: string;
  category: "cameras" | "lenses" | "gimbals" | "audio" | "lighting";
  tag: string;
  specs: string;
  status: "available" | "in_use" | "reserved";
  statusText: string;
  tier: "General Member" | "Lead DP" | "Certified Field Crew";
  qty: string;
};

const gearInventory: GearItem[] = [
  {
    id: "fx3-1",
    name: "Sony FX3 Full-Frame Cinema Camera",
    category: "cameras",
    tag: "A-Cam Flagship",
    specs: "4K 120p, 10-bit 4:2:2, S-Cinetone / S-Log3, Dual Base ISO 800/12800",
    status: "available",
    statusText: "In Cage (Ready to Deploy)",
    tier: "Certified Field Crew",
    qty: "4 Units",
  },
  {
    id: "fx3-2",
    name: "Sony FX30 Super35 Cinema Camera",
    category: "cameras",
    tag: "B-Cam Documentary",
    specs: "4K 60p Oversampled 6K, ProRes RAW Output, XLR Handle Unit",
    status: "available",
    statusText: "In Cage (Ready to Deploy)",
    tier: "General Member",
    qty: "6 Units",
  },
  {
    id: "bmpcc-6k",
    name: "Blackmagic Pocket Cinema Camera 6K Pro",
    category: "cameras",
    tag: "Indie Narrative Unit",
    specs: "Super35 Sensor, Gen 5 Color Science, Internal ND Filters (2/4/6 stops)",
    status: "in_use",
    statusText: "Out in Field: Campus Doc Team",
    tier: "Lead DP",
    qty: "3 Units",
  },
  {
    id: "sony-gm-24-70",
    name: "Sony FE 24-70mm f/2.8 GM II",
    category: "lenses",
    tag: "Standard Zoom",
    specs: "Ultra-sharp fast zoom, XD Linear motors, de-clickable aperture ring",
    status: "available",
    statusText: "In Cage (Ready to Deploy)",
    tier: "General Member",
    qty: "5 Lenses",
  },
  {
    id: "sony-gm-70-200",
    name: "Sony FE 70-200mm f/2.8 GM OSS II",
    category: "lenses",
    tag: "Athletics Telephoto",
    specs: "Fluorite elements, optical image stabilization, internal focus",
    status: "in_use",
    statusText: "Out in Field: NCAA Basketball Shoot",
    tier: "Certified Field Crew",
    qty: "3 Lenses",
  },
  {
    id: "dji-rs3-pro",
    name: "DJI RS3 Pro Gimbal Stabilizer Combo",
    category: "gimbals",
    tag: "Motorized Tracking",
    specs: "10lb payload, carbon fiber arms, LiDAR range finder autofocus",
    status: "available",
    statusText: "In Cage (Ready to Deploy)",
    tier: "Certified Field Crew",
    qty: "4 Kits",
  },
  {
    id: "sennheiser-avx",
    name: "Sennheiser EW-DP Wireless Lav System",
    category: "audio",
    tag: "Field Audio",
    specs: "All-digital 2.4GHz ultra-low latency, ME2 omnidirectional lavaliers",
    status: "available",
    statusText: "In Cage (Ready to Deploy)",
    tier: "General Member",
    qty: "8 Transmitters",
  },
  {
    id: "aputure-300d",
    name: "Aputure LS 300d II Daylight LED",
    category: "lighting",
    tag: "Studio Key Light",
    specs: "55000 lux @ 0.5m with Fresnel, 96+ CRI, Bowens Mount Light Dome",
    status: "reserved",
    statusText: "Reserved: Tonight 19:30 Studio 04",
    tier: "Certified Field Crew",
    qty: "4 Kits",
  },
];

const categories = [
  { id: "all", label: "All Gear (28)" },
  { id: "cameras", label: "Cinema Cameras" },
  { id: "lenses", label: "G-Master Lenses" },
  { id: "gimbals", label: "Gimbals & Rigs" },
  { id: "audio", label: "Audio & Comms" },
  { id: "lighting", label: "Lighting & Studio" },
];

export default function GearLockerModal({
  open,
  onClose,
  onSelectGear,
}: {
  open: boolean;
  onClose: () => void;
  onSelectGear?: (gearName: string) => void;
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const filteredGear = gearInventory.filter((item) => {
    const matchesTab = activeTab === "all" || item.category === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.specs.toLowerCase().includes(search.toLowerCase()) ||
      item.tag.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface-container-low max-w-4xl w-full border border-surface-variant p-4 sm:p-6 shadow-[10px_10px_0px_0px_#c3f400] relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-variant/40">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 bg-primary-container text-on-primary-fixed flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">inventory_2</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md uppercase text-primary leading-tight">
                  Equipment Cage Locker
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-primary-fixed/20 text-primary-fixed font-label-sm text-[11px] font-bold uppercase tracking-wider">
                  Live Checkout Database
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                Student Center Room B04 • Free Equipment Access for All Club Members
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-surface-container hover:bg-error-container hover:text-on-error-container transition-colors text-primary font-bold"
            aria-label="Close Gear Locker"
          >
            ✕
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="pt-4 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveTab(c.id)}
                className={`px-2.5 py-1 text-[11px] uppercase font-bold tracking-wider whitespace-nowrap transition-all ${
                  activeTab === c.id
                    ? "bg-primary-container text-on-primary-fixed shadow-[2px_2px_0px_0px_#ffffff]"
                    : "bg-surface-container text-on-surface-variant hover:text-primary"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter gear, cameras..."
              className="w-full bg-surface-container text-primary text-xs px-3 py-1.5 pl-8 border border-surface-variant focus:outline-none focus:border-primary-fixed placeholder:text-outline"
            />
            <span className="material-symbols-outlined absolute left-2 top-1.5 text-base text-outline pointer-events-none">
              search
            </span>
          </div>
        </div>

        {/* Inventory List */}
        <div className="overflow-y-auto pr-1 space-y-3 flex-1 scrollbar-none my-2">
          {filteredGear.map((gear) => (
            <div
              key={gear.id}
              className="p-3.5 bg-surface-container hover:bg-surface-container-high transition-colors border-l-2 border-primary-fixed flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary uppercase text-sm">
                    {gear.name}
                  </span>
                  <span className="px-1.5 py-0.5 bg-surface-container-highest text-secondary-fixed text-[10px] font-bold uppercase tracking-wider">
                    {gear.tag}
                  </span>
                  <span className="px-1.5 py-0.5 bg-surface-container-lowest text-on-surface-variant text-[10px] uppercase font-mono">
                    {gear.qty}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  {gear.specs}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-outline font-label-sm">
                  <span>Req: <strong className="text-on-surface">{gear.tier}</strong></span>
                  <span>•</span>
                  <span
                    className={
                      gear.status === "available"
                        ? "text-primary-fixed font-bold flex items-center gap-1"
                        : gear.status === "in_use"
                        ? "text-secondary font-bold flex items-center gap-1"
                        : "text-tertiary-fixed font-bold flex items-center gap-1"
                    }
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        gear.status === "available"
                          ? "bg-primary-fixed animate-pulse"
                          : gear.status === "in_use"
                          ? "bg-secondary"
                          : "bg-tertiary-fixed"
                      }`}
                    />
                    {gear.statusText}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onSelectGear) onSelectGear(gear.name);
                  onClose();
                }}
                className="self-start sm:self-center px-3 py-1.5 bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-fixed transition-colors text-primary font-label-sm text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
              >
                Request in Dispatch →
              </button>
            </div>
          ))}

          {filteredGear.length === 0 && (
            <div className="text-center py-10 bg-surface-container text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">
                search_off
              </span>
              <p className="font-headline-sm text-sm uppercase text-primary">
                No matching gear found
              </p>
              <p className="text-xs">Try searching for &quot;FX3&quot;, &quot;Gimbal&quot;, or &quot;Zoom&quot;.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-surface-variant/40 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-on-surface-variant gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping" />
            <span>Walk-in checkouts open Mon-Fri 14:00 - 19:00 with student ID.</span>
          </div>
          <span className="text-primary-fixed font-mono font-bold uppercase">
            All insurance covered by University Student Life
          </span>
        </div>
      </div>
    </div>
  );
}

