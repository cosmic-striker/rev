# Resolution Club (rev)

A neo-brutalist portfolio and booking site for a student-run university media and film collective. It showcases campus coverage, student productions, and the crew, and collects event-coverage and crew-application requests.

All on-site people, events, awards, and metrics are illustrative placeholders for this demo and are not claims about a real organization.

## Stack

- [Next.js 14](https://nextjs.org) App Router
- React 18 + TypeScript (strict)
- Tailwind CSS with custom design tokens (Syne / Space Grotesk)
- `next/font` for self-hosted variable fonts
- Zod-validated route handlers for form delivery

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint (Next.js config) |

## Project structure

```
app/                    App Router pages, layout, API routes, SEO files
  page.tsx              Campus coverage home
  stories/              Student productions and case studies
  creators/             Crew roster
  join/                 Coverage booking and crew application
  api/                  Form submission route handlers
components/
  layout/               Header and footer
  ui/                   Shared UI (modals, HUD, reveal, icons)
  home/                 Home page sections and client islands
  stories/              Stories page sections
  creators/             Creators page sections
  join/                 Join page sections
lib/                    Site config, content data, images, validation
public/images/          Locally hosted, optimized imagery
```

## Environment variables

Copy `.env.example` to `.env.local` and set the values you need.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used by metadata, sitemap and manifest |

Form delivery and additional environment variables are documented in `.env.example`.
