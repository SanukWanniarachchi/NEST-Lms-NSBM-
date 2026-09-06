# NEST LMS Admin Deployment Runbook

## Runtime

- Node.js 20 or newer with the repository's locked npm dependencies.
- A persistent PostgreSQL database reachable only from approved application
  and administration networks.
- An HTTPS address for the admin service, preferably an NSBM-controlled
  subdomain.
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

## Release procedure

1. Back up PostgreSQL and record the currently deployed Git commit.
2. Install locked dependencies with `npm ci`.
3. Run `npm run admin:typecheck` and `npm run admin:build`.
4. Run `npm run admin:db:migrate` once as a controlled deployment job.
5. Start the built admin service with `npm run admin:start`, or configure the
   hosting platform to run the equivalent managed process. Use `npm run
   admin:dev` only for local development.
6. Confirm `/health/live` and `/health/ready` return HTTP 200.
7. Test SSO with an allowlisted administrator and verify that a non-allowlisted
   identity is denied.
8. Verify create, edit, publish, archive, restore, audit, and sign-out behavior
   before directing normal admin traffic to the release.

## Publishing public content

1. Publish reviewed records inside the protected admin workspace.
2. Run `npm run admin:publish:snapshot` in an authorised release checkout with
   read access to the production database.
3. Review `data/generated/admin-content.json` and run `npm run check:public`.
4. Commit only the approved generated snapshot and related public changes to
   the public release branch, then deploy the static application.

This deliberate bridge keeps drafts, account records, audit history, and
database credentials out of the static website.

## Recovery

- If application startup fails, keep traffic on the previous application
  version and inspect the readiness response and server logs.
- Do not reverse a completed database migration by hand. Restore the recorded
  backup only through the NSBM database owner after impact review.
- If an identity is compromised, deactivate its account in the admin directory;
  active sessions are rejected on their next protected request.
- Rotate the OIDC client secret, database credential, or `AUTH_SECRET` through
  the hosting secret manager when exposure is suspected. Rotating `AUTH_SECRET`
  signs all administrators out.
