"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { profile } from "@/lib/collective";
import ScrollProgress from "@/components/ui/ScrollProgress";

const navItems = [
  { href: "/", label: "Campus Coverage" },
  { href: "/stories", label: "Stories & Projects" },
  { href: "/creators", label: "Student Creators" },
  { href: "/join", label: "Join & Book Us" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <ScrollProgress />
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-surface-variant transition-all">
        <div className="h-20 max-w-7xl mx-auto px-gutter flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <Link href="/" className="flex items-center gap-space-sm group">
              <span
                aria-hidden="true"
                className="relative flex h-9 w-9 items-center justify-center bg-primary-container text-on-primary-fixed font-display-lg text-lg leading-none transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-2deg]"
              >
                R
                <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-tertiary-fixed animate-pulse" />
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-headline-sm uppercase tracking-tight text-primary leading-none group-hover:text-primary-fixed transition-colors">
                    Resolution Club
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping" />
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed">
                  Student Media Collective
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-space-md">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-3 py-1.5 font-label-lg text-label-lg uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? "text-primary-fixed font-bold"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary-fixed shadow-[0_0_8px_#c3f400] transition-all" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-space-md">
            <Link
              href="/join"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider hover:bg-tertiary-fixed hover:text-on-tertiary-fixed transition-all shadow-[2px_2px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
            >
              Join The Crew / Auditions
            </Link>
            <Link
              href="/creators"
              aria-label="Student creators"
              className="relative group"
            >
              <Image
                src={profile}
                alt="Profile"
                width={34}
                height={34}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-variant group-hover:ring-primary-fixed transition-all"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary-fixed rounded-full border-2 border-background" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="lg:hidden w-9 h-9 flex items-center justify-center bg-surface-container text-on-surface hover:text-primary-fixed transition-colors"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className="material-symbols-outlined text-xl">
                {open ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-surface-variant bg-surface/98 backdrop-blur-2xl transition-all duration-300">
            <nav className="max-w-7xl mx-auto px-gutter py-space-md flex flex-col gap-space-sm">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={
                      active
                        ? "font-label-lg text-label-lg uppercase tracking-wider text-primary-fixed border-l-2 border-primary-fixed pl-space-sm py-space-xs font-bold bg-surface-container/50"
                        : "font-label-lg text-label-lg uppercase tracking-wider text-on-surface-variant hover:text-primary border-l-2 border-transparent pl-space-sm py-space-xs"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/join"
                onClick={() => setOpen(false)}
                className="mt-space-sm inline-flex items-center justify-center bg-primary-container text-on-primary-fixed font-label-lg text-label-lg uppercase font-bold tracking-wider px-space-md py-space-sm shadow-[2px_2px_0px_0px_#ffffff]"
              >
                Join The Crew / Auditions
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
