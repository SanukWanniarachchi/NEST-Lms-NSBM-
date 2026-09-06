# NEST LMS Admin Platform Architecture

## Phase 0 decision

NEST LMS will remain one repository with two deployable applications:

- The root Next.js application contains the public, read-only learning routes.
- The `admin/` Next.js application is the protected workspace for authorised
  NEST board members.

The public application can remain a static deployment. The admin application
must run with a server runtime and should use an NSBM-controlled address such as
`admin.nest.nsbm.lk`. GitHub Pages remains suitable for the public static
preview, but it must never host or simulate authentication, sessions, database
writes, or admin APIs.

## Access model

Public visitors do not have an account or application role. Managed accounts
use three roles:

- `super_admin`: has full content permissions and manages administrator and
  user accounts.
- `admin`: may create, edit, publish, archive, and restore managed content.
- `user`: is reserved for future authenticated learner features and cannot
  enter the admin workspace.

Authentication should use NSBM's OpenID Connect or OAuth 2.0 SSO service. Access
is granted only when the authenticated NSBM identity is also present in the NEST
admin allowlist. Removing a person from that allowlist removes their access
without sharing or rotating a club password.

Each protected request must enforce authorisation on the server. Hiding buttons
or redirecting in the browser is not an access-control boundary.

## Production components

1. **Public Next.js application**: serves the static learning website.
2. **Admin Next.js application**: serves the protected workspace and API
   endpoints from an NSBM server runtime.
3. **NSBM SSO**: authenticates board members and returns a stable user identity.
4. **Relational database**: stores managed content, the admin allowlist, and an
   audit history. PostgreSQL is the preferred portable target unless NSBM
   specifies another supported database.
5. **Media storage**: stores uploaded documents and images outside the Git
   repository. The database stores metadata and storage references, not file
   contents.

## Content lifecycle

Managed records use three states:

- `draft`: visible only inside the admin workspace.
- `published`: available on the public website.
- `archived`: retained for audit and recovery but hidden publicly.

Research resources support papers, videos, and documents. A published record
must include a title, summary, author list, publication date, topic tags, and a
valid resource URL. Courses and announcements use the same lifecycle. Their
working payload can be revised without replacing the last published payload.

## Security requirements

- Use a maintained authentication library and the NSBM identity provider; do
  not implement password storage locally.
- Store sessions in `HttpOnly`, `Secure`, and appropriate `SameSite` cookies.
- Keep SSO secrets, database credentials, and session secrets server-only.
- Validate all input on the server and authorise every mutation.
- Record who changed content, what changed, and when.
- Restrict upload types and sizes, generate storage-safe filenames, and scan
  uploaded files using NSBM's approved tooling when available.
- Never commit `.env` files, credentials, session data, database files, or
  uploaded media.

## Planned implementation phases

1. **Phase 1 - Admin shell and local auth adapter**: create the `admin/`
   application, protected navigation, session boundaries, and a development-only
   identity adapter.
2. **Phase 2 - Database and repositories**: add migrations, content persistence,
   allowlist storage, and audit records.
3. **Phase 3 - Research workflow**: build create, edit, preview, publish, archive,
   and restore flows for research resources.
4. **Phase 4 - Courses and announcements**: move the remaining managed content
   behind the same validated service layer. **Implemented.**
5. **Phase 5 - NSBM integration**: connect the prepared OIDC adapter to NSBM
   SSO, use the approved PostgreSQL service, select media storage, and complete
   infrastructure testing. **Application adapter implemented; institutional
   activation pending.**

## Phase 2 implementation

Phase 2 uses one PostgreSQL schema across both environments:

- Local development uses PGlite persistence under the ignored `admin/.data/`
  directory, with no separate database service required.
- Production uses the `postgres` adapter with the NSBM-supplied `DATABASE_URL`.
- Numbered SQL migrations are stored in `admin/db/migrations/` and recorded in
  the database `schema_migrations` table.
- The server-only data layer checks the active admin allowlist on every
  protected request, including requests with an existing signed session.
- Repository mutations write an audit event in the same database transaction
  as the allowlist or content change.

Phase 2 creates `admin_allowlist`, `research_resources`, and `audit_events`.
Research editing and lifecycle screens remain Phase 3 work; this phase provides
their persistence and audit boundary only.

Required database environment variables are documented in
`admin/.env.example`. Local setup runs `npm run admin:db:migrate` followed by
`npm run admin:db:seed-local`. Production migrations must run as a controlled
deployment step before the new application version starts.

## Phase 3 implementation

Phase 3 adds an authenticated research workspace on top of the Phase 2 data
boundary. Administrators can search and filter records, create and edit drafts,
preview the intended public presentation, publish reviewed drafts, archive
active records, and restore archived records to drafts. Every Server Action
revalidates the active admin session, validates its input, and writes an audit
event in the same transaction as the content mutation.

Published records remain in the admin database during this phase. The public
application stays static and does not query the protected database directly;
the approved publishing bridge is delivered separately before production
launch.

## Phase 4 implementation

Phase 4 adds audited course and announcement management. Administrators can
edit the three course curricula, including module lessons and portrait or
landscape YouTube settings, and can create and maintain public announcements.
Server-side schemas validate all managed payloads and safe announcement links.

The publishing bridge exports only published payloads to
`data/generated/admin-content.json`. The static public build reads that snapshot
and never connects to the protected database. Publishing a record in the admin
workspace does not deploy it by itself: an authorised release operator runs
`npm run admin:publish:snapshot`, reviews the generated change, and deploys the
public application.

## Phase 5 readiness

The application provides an OpenID Connect Authorization Code flow using PKCE,
state, and nonce validation. The returned stable subject must already exist as
an active `super_admin` or `admin` account; SSO authentication alone never
grants admin access. Local code authentication remains unavailable in
production.

The admin runtime also exposes `/health/live` and `/health/ready`. Readiness
checks database access and required authentication configuration without
returning credentials or provider details. The remaining Phase 5 work is an
infrastructure handover: NSBM must provide and approve the real identity
provider registration, PostgreSQL service, media-storage policy, TLS endpoint,
backup policy, and deployment environment.

## Handover contract

The NSBM infrastructure owner will supply the SSO issuer details, registered
client credentials, redirect URLs, database connection, media-storage location,
TLS termination, and backup policy. The application will supply documented
environment names, migrations, health checks, deployment commands, and a tested
rollback procedure.
