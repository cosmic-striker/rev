import Link from "next/link";
import { footerLinks, siteConfig } from "@/lib/site";

export default function SiteFooter() {
  const year = siteConfig.year;
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-surface-variant py-space-xl">
      <div className="max-w-7xl mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-xl pb-space-lg border-b border-surface-variant">
          <div className="space-y-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 bg-primary-fixed" />
              <span className="font-headline-sm text-headline-sm uppercase text-primary">
                Resolution Club
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Independent university media and film hub documenting campus culture,
              investigative dispatches, and student visual narratives.
            </p>
            <div className="flex items-center gap-space-xs text-primary-fixed font-label-sm text-label-sm uppercase">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              Live Production Station
            </div>
          </div>

          <div>
            <h4 className="font-label-lg text-label-lg uppercase text-on-surface tracking-wider mb-space-md">
              Campus Media Network
            </h4>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/creators">
                  Student Affairs
                </Link>
              </li>
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/stories">
                  Campus Paper
                </Link>
              </li>
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/">
                  Radio Station (WLUM 91.3)
                </Link>
              </li>
              <li>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/join">
                  Equipment Cage Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-label-lg text-label-lg uppercase text-on-surface tracking-wider mb-space-md">
              Channels &amp; Broadcast
            </h4>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              {footerLinks.connect
                .filter((link) => link.href && link.href !== "#")
                .map((link) => (
                  <li key={link.label}>
                    <a
                      className="text-on-surface-variant hover:text-primary transition-colors"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="font-label-lg text-label-lg uppercase text-on-surface tracking-wider mb-space-md">
              Dispatch HQ
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
              Student Center, Studio Basement 04
              <br />
              Office Hours: Mon–Thu 16:00 – 21:00
            </p>
            <Link
              href="/join"
              className="inline-flex items-center gap-space-xs font-label-sm text-label-sm text-primary-fixed hover:text-tertiary-fixed uppercase font-bold"
            >
              Submit Reel / Tip
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="pt-space-md flex flex-col sm:flex-row justify-between items-center gap-space-sm text-on-surface-variant font-label-sm text-label-sm uppercase">
          <span>© {year} {siteConfig.name}. Managed by students.</span>
          <span>Autonomous Student Press Division • University Media Board</span>
        </div>
      </div>
    </footer>
  );
}
