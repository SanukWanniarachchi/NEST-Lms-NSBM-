# NEST LMS

A responsive, frontend-only learning management system demonstration for NEST Club — NSBM Educators and Scholars Together.

## Demonstration scope

- Public NEST Club website
- Cybersecurity, networking, and robotics learning paths
- Statically generated course and lesson pages
- Simulated student and administrator dashboards
- Simulated login and local UI states
- Light and dark themes
- GitHub Pages-compatible static export

All accounts, instructors, course progress, testimonials, analytics, certificate requests, and administrative actions are mock data. This V1 does not include a database, authentication, or persistent state.

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
```

The production build is exported to `out/` for static hosting. GitHub Pages deployment is defined in `.github/workflows/deploy-pages.yml`.
