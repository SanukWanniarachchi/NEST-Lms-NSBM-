# Development Timeline

## 2026-08-10

- Created the initial Next.js project.
- Built the first NEST LMS demo structure.
- Added the main public website pages for the NEST Club learning experience.
- Added the first LMS-style pages for courses, lessons, login, learner portal, admin overview, contact, and about.
- Configured the project for static publishing.

## 2026-08-12

- Expanded the course content into three learning paths: Cybersecurity Foundations, Networking Essentials, and Robotics Fundamentals.
- Added 15 guided modules and 85 structured micro-lessons.
- Improved the visual design for the homepage, course cards, course pages, and portal views.
- Refined responsive layouts for desktop and mobile screens.
- Fixed navigation active states for GitHub Pages routes.
- Added light and dark theme support with saved preference behavior.
- Added button interaction polish.
- Confirmed the site builds as a static GitHub Pages release.

## 2026-08-23

- Published project status review after GitHub Pages release.
- Confirmed the live website is reachable at `https://sanukwanniarachchi.github.io/NEST-Lms-NSBM-/`.
- Added this development timeline file to track project progress by date.

## 2026-08-25

- Added Research, Announcements, and Community pages to support club updates, research activity, and WhatsApp community access.
- Added the official NEST YouTube channel link in the About section.
- Reorganized the top navigation with primary links and an inline More menu.
- Redesigned the website with a soft glassmorphism visual style, refined color palette, updated cards, improved hover effects, and a custom light/dark toggle.
- Added animated course and community banners with smoother transform-based motion.
- Fixed QR code asset loading and optimized small brand images for faster page loads.
- Added Playwright visual QA tests for layout, theme, responsive views, marquee motion, and header interactions.
- Removed stale preview assets and unused default files from the project.
- Confirmed lint, typecheck, production build, and visual QA pass before GitHub deployment.

## 2026-08-29

- Replaced sample research entries with a publication-ready resource model for papers, videos, and documents.
- Added a clear research-library empty state until approved work is published.
- Removed the temporary student login, learner dashboard, and admin demonstration pages.
- Added direct access to the official NEST YouTube channel from the About page and footer.
- Removed retired portal styling and expanded automated visual, responsive, runtime, and export-route QA coverage.
- Confirmed the 98-page static release passes lint, type checking, production build, and 104 Playwright checks.
- Completed Phase 0 of the admin platform: documented the NSBM SSO architecture, protected admin boundary, content lifecycle, environment contract, and infrastructure handover requirements.
- Centralized the research publication types for future draft, published, and archived admin workflows without changing the public website.
