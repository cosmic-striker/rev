# Contributing to Resolution Club Website

Thank you for contributing to the Resolution Club Website. This document provides guidelines and instructions for contributing.

## Getting Started

### Workflow

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Commit your changes
6. Push to your fork
7. Open a Pull Request

### Clone Repository

```bash
git clone https://github.com/your-username/resolution-club-website.git
cd resolution-club-website
```

### Install Dependencies

```bash
npm run install:all
```

### Create Your Branch

Use the following naming convention:

```bash
git checkout -b yourname/section-name
```

Examples:
- `john/home-page`
- `jane/event-filters`
- `alex/admin-dashboard`

## Development Setup

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Environment Variables

1. Copy the example environment file

```bash
cp .env.example .env
```

2. Fill in the required variables as described in the README

### Running the Project

```bash
npm run dev
```

This starts both the frontend (port 3000) and backend (port 5000).

## Contribution Guidelines

### Code Standards

- Write clean, readable code
- Use TypeScript for type safety
- Follow existing code conventions
- Use reusable components
- Maintain responsive design
- Optimize media usage
- Remove unused imports and variables

### File Naming

- Use PascalCase for components: `EventCard.tsx`
- Use camelCase for utilities: `formatDate.ts`
- Use lowercase for styles: `globals.css`
- Use descriptive names: avoid `index.ts` for non-entry files

### Commit Messages

Use the following format:

```
type(scope): short description
```

### Commit Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | UI or styling updates |
| `refactor` | Code improvement without feature change |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Commit Examples

```
feat(home): add hero section animation
fix(events): resolve image loading issue
docs(readme): update installation instructions
style(team): improve member card layout
```

## Pull Request Process

### Before Submitting

- Test your changes locally
- Ensure responsive design works on all devices
- Check for console errors
- Verify no breaking changes

### PR Description

Include the following in your Pull Request:

- Summary of changes
- Screenshots for UI changes
- Related issue numbers (if applicable)
- Testing steps

### Responsiveness Checklist

Test your work on:
- Mobile (below 768px)
- Tablet (768px to 1280px)
- Desktop (above 1280px)

## Security Practices

- Validate all inputs
- Sanitize form data
- Protect admin routes
- Use environment variables for secrets
- Never commit credentials or API keys
- Never expose sensitive data in client-side code

## Code Review

- All Pull Requests require review before merging
- Feedback may be requested for improvements
- Approved changes will be merged into the main branch

## Syncing Your Fork

```bash
git remote add upstream https://github.com/ExploitX-org/Resolution-Webpage.git
git pull upstream main
```

## What Not to Do

- Do not push directly to `main`
- Do not upload unnecessary large files
- Do not commit secrets or API keys
- Do not mix unrelated changes in one commit
- Do not skip the review process

## Questions

If you have questions about contributing, open an issue or reach out to the maintainers.

---

This project represents the creative identity of Resolution. Contribute with quality, consistency, and professionalism.
