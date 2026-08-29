# NEST LMS

A responsive, statically published learning management experience for NEST Club — NSBM Educators and Scholars Together.

## Current release

- Public NEST Club website
- Cybersecurity, networking, and robotics learning paths
- Statically generated course and lesson pages
- Research library prepared for approved papers, videos, and documents
- Official NEST community and YouTube links
- 85 structured micro-lessons across 15 modules
- Light and dark themes
- GitHub Pages-compatible static export

This GitHub Pages release does not include authentication, persistent learner progress, message delivery, or administrative editing. Those services will be introduced through the protected admin platform without changing the published curriculum structure.

The protected platform architecture and NSBM handover boundary are documented in [`docs/ADMIN_PLATFORM_ARCHITECTURE.md`](docs/ADMIN_PLATFORM_ARCHITECTURE.md). GitHub Pages is a public preview target and will not host authentication or admin APIs.

## Local development

```bash
npm install
npm run dev
```

The protected admin application runs separately so the public GitHub Pages build remains static:

```bash
npm run admin:dev
```

Open `http://localhost:3001`. Local credentials are read from the ignored `admin/.env.local` file and the local adapter is disabled in production builds.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
# or run all three release gates
npm run check
```

The production build is exported to `out/` for static hosting. GitHub Pages deployment is defined in `.github/workflows/deploy-pages.yml`.
