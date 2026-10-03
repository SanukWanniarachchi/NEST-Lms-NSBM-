# NEST LMS Admin Deployment Runbook

## Runtime

- Node.js 22 with the repository's locked npm dependencies, including `tsx`
  for the production operator commands and startup wrapper.
- A persistent PostgreSQL database reachable only from approved application
  and administration networks.
- An HTTPS address for the admin service on the chosen external host or
  club-owned domain. Hosting does not require NSBM servers.
- A reverse proxy or application platform that can run a long-lived Next.js
  server and poll the health endpoints.

The public website remains a separate static build. Do not expose the admin
database, PGlite files, environment files, or uploaded media through the public
site.

## Required production environment

```text
NODE_ENV=production
NEST_AUTH_MODE=oidc
AUTH_SECRET=<at least 32 random characters>
OIDC_ISSUER=https://<approved-issuer>
OIDC_CLIENT_ID=<registered-client-id>
OIDC_CLIENT_SECRET=<registered-client-secret>
OIDC_CLIENT_AUTH_METHOD=client_secret_basic
OIDC_REDIRECT_URI=https://<admin-host>/auth/callback
OIDC_SCOPES=openid profile email
NEST_DATABASE_DRIVER=postgres
DATABASE_URL=postgres://<managed-secret>
NEXT_PUBLIC_SITE_URL=https://<public-site>
```

Register the redirect URI exactly as configured. Store all secrets in the host
secret manager, not in Git, deployment logs, or a shared `.env` file.

`npm run admin:check:production` validates these settings without contacting the
database or identity provider and reports variable names without secret values.
`npm run admin:start` repeats that check, uses the platform's `PORT` (otherwise
3001), and binds to `0.0.0.0`. Build commands can run without production secrets;
starting the server requires them. Development access codes are rejected.

## External hosting configuration

The current release is a conventional Node service. For Render or an equivalent
Node host, use the repository root and the `admin-platform` branch:

| Setting | Value |
| --- | --- |
| Build command | `npm ci --include=dev && npm run admin:typecheck && npm run admin:test:data && npm run admin:build` |
| Pre-deploy command | `npm run admin:check:production && npm run admin:db:migrate` |
| Start command | `npm run admin:start` |
| Health check | `/health/ready` |
| Node version | 22 |
| Initial automatic deploys | Off, until the first production release is verified |

If the selected plan has no pre-deploy job, run configuration validation and
migrations from an authorised release checkout before starting the new service.
Keep the database in the same region where practical, use the provider's required
TLS connection settings, and verify backups and a restore on staging before
launch. A runtime check does not verify database TLS or backups.

This is a deployment recipe, not a purchased or deployed hosting service.
Cloudflare can host the public static export separately. The admin has not been
adapted or verified on Workers; that needs a separate compatibility test before
choosing it. See [Render's Next.js instructions](https://render.com/docs/deploy-nextjs-app)
and [Cloudflare's Next.js Workers instructions](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

## First production administrator

After migrations, get the first administrator's exact `sub` from the approved
OIDC provider. An email address is not a substitute for that subject. Set
`NEST_BOOTSTRAP_SUBJECT`, `NEST_BOOTSTRAP_NAME`, and `NEST_BOOTSTRAP_EMAIL` in the
operator environment, then run `npm run admin:bootstrap:production` once.

The command only creates an active super administrator in an empty account
directory and records an audit event. It refuses to replace any account or add
another bootstrap account. Remove those three environment values afterwards;
manage further accounts through the protected Users page. Never run the local
seed or E2E reset against production. The account bootstrap does not copy courses
or announcements. To initialize a fresh managed-content directory, review the
public snapshot and run `npm run admin:import:production -- data/generated/admin-content.json`
once from the production release checkout. This validates the public snapshot,
imports its approved published curriculum and announcements in one transaction,
and records audit events. It refuses to replace any existing managed content.
Then preview the imported records in admin before creating a production export.

The `Check admin release` GitHub workflow builds both sides, tests the data
safeguards, and uses a disposable PostgreSQL service to run migrations, account
bootstrap, curriculum initialization, snapshot export, and a production server
smoke check. Its identity settings are fixtures; it does not verify real SSO.
`npm run admin:test:production` starts a temporary production server on `PORT`
and checks readiness and protected redirects; run it against a staging database
with complete production-style settings before an actual release.

## Release procedure

1. Back up PostgreSQL and record the currently deployed Git commit.
2. Install locked dependencies with `npm ci --include=dev`.
3. Run `npm run admin:typecheck` and `npm run admin:build`.
4. Run `npm run admin:check:production` and then `npm run admin:db:migrate` once
   as a controlled deployment job. Bootstrap the first administrator as above
   on the initial release only.
5. Start the built admin service with `npm run admin:start`, or configure the
   hosting platform to run the equivalent managed process. Use `npm run
   admin:dev` only for local development.
6. Confirm `/health/live` and `/health/ready` return HTTP 200.
   Readiness checks configuration and the required account, managed-content,
   research, and audit tables. It returns a generic HTTP 503 on failure and does
   not perform an SSO login or check backup health.
7. Test SSO with an allowlisted administrator and verify that a non-allowlisted
   identity is denied.
8. Verify create, edit, publish, archive, restore, audit, and sign-out behavior
   before directing normal admin traffic to the release.

## Publishing public content

1. Publish reviewed records inside the protected admin workspace.
2. Run `npm run admin:publish:snapshot` in an authorised release checkout with
   read access to the production database.
3. In the separate public `main` checkout, run `npm run content:import -- <path>`
   using the reviewed export path. Review the diff and run `npm run check`.
4. Commit the approved public snapshot to `main` and push it. Follow
   [the public publishing instructions](CONTENT_PUBLISHING.md); do not merge
   protected admin application code into the public release branch.

This deliberate bridge keeps drafts, account records, audit history, and
database credentials out of the static website.

## Recovery

- If application startup fails, keep traffic on the previous application
  version and inspect the readiness response and server logs.
- Do not reverse a completed database migration by hand. Restore the recorded
  backup through the appointed database owner after impact review.
- If an identity is compromised, deactivate its account in the admin directory;
  active sessions are rejected on their next protected request.
- Rotate the OIDC client secret, database credential, or `AUTH_SECRET` through
  the hosting secret manager when exposure is suspected. Rotating `AUTH_SECRET`
  signs all administrators out.
