# NEST LMS

A responsive, statically published learning management experience for NEST Club — NSBM Educators and Scholars Together.

## Current release

- Public NEST Club website
- Cybersecurity, networking, and robotics learning paths
- Statically generated course and lesson pages
- News covering research, learning releases and community progress
- Official NEST community and YouTube links
- 85 structured micro-lessons across 15 modules
- Light and dark themes
- GitHub Pages-compatible static export

This static release has no authentication, shared learner records, message delivery or administrative editing. Checkpoint results and completions are saved only in the current browser when storage is available. The privacy page explains storage and includes a progress-clearing control.

For publishing the public site on Cloudflare Pages and updating it through GitHub, see [`docs/CLOUDFLARE_PAGES.md`](docs/CLOUDFLARE_PAGES.md).

The protected platform architecture and NSBM handover boundary are documented in [`docs/ADMIN_PLATFORM_ARCHITECTURE.md`](docs/ADMIN_PLATFORM_ARCHITECTURE.md). GitHub Pages is a public preview target and will not host authentication or admin APIs.

Courses and announcements now load from a reviewed admin export. The manual export, import, release, and rollback steps are documented in [`docs/CONTENT_PUBLISHING.md`](docs/CONTENT_PUBLISHING.md). Drafts and account data remain in the protected admin platform.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run typecheck
npm run build
# or run all release gates, including route generation and export validation
npm run check
```

The production build is exported to `out/` for static hosting. Run `npm run preview` (or `npm start`) after building to view it at `http://127.0.0.1:4173`. GitHub Pages deployment is defined in `.github/workflows/deploy-pages.yml`; public validation also runs on pull requests.

`check:export` checks exported local links, anchor targets, images, scripts, and stylesheet assets, and rejects demo or retired admin/login/dashboard routes. It also checks the configured deployment base path. External video playback and third-party URLs are checked separately.

Local visual experiments are preserved in the ignored `app/_demos/` private folder, which Next.js excludes from routing. To revisit a playground, temporarily rename that folder to `app/demos/` and run the development server; return it to `app/_demos/` before a production build.
