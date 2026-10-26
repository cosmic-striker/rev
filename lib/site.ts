// Centralized site content. Update placeholder values here.
// TODO: Replace placeholder values with real organization details.

export const siteConfig = {
  name: "Resolution Club",
  shortName: "Resolution Club",
  description:
    "Student-run university media and film collective documenting campus culture, investigative dispatches, and student visual narratives.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  year: new Date().getFullYear(),
  contactEmail: "contact@resolutionclub.example.com", // TODO
  instagram: "#", // TODO
  youtube: "#", // TODO
  vimeo: "#", // TODO
  tiktok: "#", // TODO
  address: "Student Center Basement Room 04", // TODO
};

export const footerLinks = {
  explore: [
    { label: "Stories", href: "/stories" },
    { label: "Creators", href: "/creators" },
    { label: "Join the Crew", href: "/join" },
  ],
  dispatch: [
    { label: "Request Coverage", href: "/#request-coverage" },
    { label: "Equipment Cage", href: "/#equipment-cage" },
    { label: "Production Guidelines", href: "/join" },
  ],
  connect: [
    { label: "Instagram", href: siteConfig.instagram },
    { label: "YouTube", href: siteConfig.youtube },
    { label: "Vimeo", href: siteConfig.vimeo },
    { label: "TikTok", href: siteConfig.tiktok },
  ],
};
