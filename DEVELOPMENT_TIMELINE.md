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
- Completed Phase 1 with a separate server-rendered admin application, development-only signed-session login, protected workspace routes, responsive admin navigation, and local authentication tests.
- Kept the public GitHub Pages application isolated from server-only authentication code while preparing the admin deployment for future NSBM SSO.
- Completed Phase 2 with a shared PostgreSQL schema, versioned migrations, local PGlite persistence, and a production PostgreSQL connection adapter.
- Added database-backed admin allowlisting with immediate session revocation checks and idempotent local administrator seeding.
- Added audited repositories for administrator access and research drafts, with database transactions preserving content and audit consistency.
- Added migration, repository, authorization, build, and responsive visual QA coverage for the Phase 2 data foundation.

## 2026-08-30

- Added expandable YouTube video lessons to the public course curriculum and lesson pages.
- Added privacy-enhanced, interaction-loaded players with responsive 16:9 framing for desktop and mobile screens.
- Added support for standard, shortened, Shorts, embed, and privacy-enhanced YouTube links.
- Confirmed live sample playback and completed production, responsive, theme, accessibility, and visual regression checks.

## 2026-08-31

- Added a compact club leadership section with placeholders for the Master-in-Charge and student board profiles.
- Replaced the lower homepage learning-values ribbon with consistently styled course-technology icons.
- Confirmed the updated public release passes production build and all 109 Playwright checks.
- Completed Phase 3 with an authenticated research workflow for creating, editing, previewing, publishing, archiving, and restoring resources.
- Added server-side research validation, audited lifecycle transitions, repeatable database test setup, and responsive admin form coverage.

## 2026-09-03

- Replaced the public Research navigation with a News section for NEST stories, learning releases, and community updates.
- Added module-completion prompts with three relevant university course recommendations for every module.
- Added clear registration guidance and free or paid certificate information while confirming that NEST modules do not issue certificates.
- Added source-backed module checkpoints across all 15 modules with 45 reviewed multiple-choice questions.
- Added immediate answer explanations, authoritative source links, unlimited retries, and local best-score tracking.
- Moved follow-up course recommendations to successful checkpoint results.
- Kept lesson sequencing, chatbot, forum, and server-backed progress outside this public static release.

## 2026-09-05

- Added audited super-admin, admin, and user roles to the protected admin database and session boundary.
- Added a super-admin-only account directory with safeguards against self-lockout and removal of the final privileged account.
- Added responsive account-management coverage across desktop and mobile admin workflows.

## 2026-09-06

- Added audited course and announcement draft, publish, archive, and restore workflows to the protected admin platform.
- Added a validated publishing snapshot that keeps the public static website isolated from drafts, accounts, audit data, and database credentials.
- Added an NSBM-ready OpenID Connect adapter with PKCE, state, nonce, allowlist enforcement, and production-only HTTPS requirements.
- Added liveness and readiness endpoints plus an infrastructure deployment and recovery runbook.
- Expanded desktop and mobile admin coverage for content editing, publishing, health checks, and role-protected access.

## 2026-10-03

- Completed launch preparation Phase 1: enquiry editing retains every field, and the prepared message can be copied or selected manually when clipboard access is unavailable.
- Made the collapsed mobile navigation inactive and hidden from assistive technology; Escape closes the menu and returns focus to its button.
- Added desktop and mobile regression checks for enquiry editing, copying, clipboard failure, and mobile navigation.
- Confirmed lint, type checking, production build, and 20 focused interaction and responsive layout checks pass.
- Identified eight outdated About/Contact visual snapshots from before the combined page; their baseline reconciliation remains release verification work.
- Deferred Google Drive video migration, leadership profiles, domain registration, and external hosting until the required inputs and later phases.
- Applied the selected Ripple spring homepage entrance and an eight-second colour sweep loop on the second sentence, starting after all letters settle; reduced motion disables both effects.
- Verified the animation sequence, continuous loop, light/dark themes, mobile/desktop layout, and reduced-motion behaviour, and refreshed the four homepage visual baselines.
- Completed the available Phase 2 public-site cleanup: preserved local visual experiments in the ignored `app/_demos/` private folder and excluded them from exported routes.
- Added static-export validation to local release checks and GitHub Pages deployment, covering local links, anchors, assets, deployment prefixes, and exclusion of demo/admin/login/dashboard routes.
- Confirmed the production export contains 117 HTML files and 148 valid local targets; checked the release gate against missing assets, broken anchors, incorrect prefixes, and accidental demo routes.
- Reconciled the eight About/Contact visual baselines with the combined page and confirmed all 67 selected animation, interaction, checkpoint, screenshot, and responsive layout checks pass.
- The verified direct WhatsApp invite URL remains pending; the QR-based community page is retained until the club supplies that URL.
- Completed launch preparation Phase 3 by merging the latest six public-site commits into `admin-platform`, retaining the managed course loader and all protected admin application code.
- Resolved validation-script and timeline conflicts, and carried the approved MAC address, DNS, and PWM text corrections into both managed course seed data and the published snapshot.
- Confirmed the public and admin production builds, static export validation, four admin data tests, all 28 admin browser checks, and 67 selected public browser checks pass.
- Kept public `main` unchanged during this phase; the static publishing bridge and external admin deployment remain later phases.
- Completed launch preparation Phase 4: public courses and announcements now read the reviewed admin snapshot, with manual export, import, release, and rollback instructions.
- Added public-field validation before import and every production build; invalid content leaves the existing snapshot untouched, and empty announcement exports display an empty board.
- Verified the real admin exporter against an isolated database: published revisions were retained while drafts, archived notices, private fields, and accounts were excluded.
- Confirmed lint, type checking, five content tests, the 117-page production export with 149 valid local targets, and all 74 selected public browser checks pass; refreshed four announcement baselines to match export order.
- External admin hosting and production configuration remain the next phase; Google Drive migration and leadership profiles remain deferred.
- Completed launch preparation Phase 5 application preparations on `admin-platform`, including the Phase 4 public publishing bridge.
- Added production configuration checks, platform-port startup, database-table readiness, an audited first-administrator bootstrap, and a transaction-protected initial curriculum import that refuses to overwrite existing content.
- Updated the external Node hosting runbook and added GitHub release checks with disposable PostgreSQL migrations, bootstrap, curriculum import, export validation, and production startup verification.
- Confirmed lint, both production builds, five public content tests, nine admin data and configuration tests, and all 28 admin browser checks pass locally; verified the production server uses an assigned port and reports HTTP 503 when its database is unavailable.
- Actual external deployment, real OIDC login, production database credentials and backups, domain configuration, Google Drive videos, and leadership data still require the chosen services and club inputs.
