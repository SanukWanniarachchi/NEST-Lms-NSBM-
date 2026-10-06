# Public static site on Cloudflare Pages

Only the generated `out/` directory is public. Announcements and structure changes are reviewed in GitHub, checked, and rebuilt. This deployment has no account service, shared learner records, admin API or message delivery. Checkpoint progress stays in the visitor's browser; the enquiry form prepares text for copying.

## Build settings

Connect the intended GitHub repository to a Cloudflare Pages project. Use production branch `main`, the repository root, build command `npm run check`, output directory `out`, and Node 22 (`NODE_VERSION=22`). Keep `PAGES_BASE_PATH` unset for a root-hosted Pages site. Do not add a Next.js server adapter or deploy `.next/`.

Set `NEXT_PUBLIC_SITE_URL` to the full chosen HTTPS public URL with a trailing slash, including a path prefix only if the actual host uses one. This is a public build-time setting, not a secret. Set it separately for production and preview as appropriate. Until the owner chooses a URL, code falls back to the existing GitHub Pages address; that fallback must be replaced in the Cloudflare build settings before launch. Changing the environment requires rebuilding.

The export includes `_headers` and `_redirects`. They configure basic response headers, immutable caching for fingerprinted assets, and permanent redirects from retired Contact/Research routes. The CSP starts in **report-only** mode; it does not block content and has no reporting endpoint. Check browser console violations on the hosted preview before deciding on enforcement. Inline framework/theme scripts and styles currently require `unsafe-inline`. GitHub Pages and the local preview do not apply these Cloudflare files.

## Release checks

1. Run `npm ci`, `npm run check`, and the browser checks in the pull-request workflow. Review the source/content diff and preview.
2. Confirm the chosen URL, official contact details, photos/publication permission and names. The WhatsApp link change is deferred at the owner's request.
3. On the hosted preview verify direct lesson links, refresh, missing-page 404, retired-route 301 redirects, headers, HTTPS, theme, quizzes, keyboard navigation, mobile layouts and user-loaded video playback.
4. Verify canonical links, `robots.txt` and `sitemap.xml` use the chosen production URL. A preview using production canonicals must not be treated as a second production site; restrict/indexing-manage previews through provider settings.
5. Confirm domain/TLS, GitHub branch protections, build permissions and the release owner. HSTS is an owner/provider decision after checking domain and subdomain HTTPS coverage.

The existing GitHub Pages workflow remains enabled. An approved future push can trigger that deployment as well as Cloudflare's Git integration; disable the old hosting workflow through a reviewed change if it is being retired. No remote settings are changed by this document.

## Recovery and monitoring

Assign a club member to watch GitHub/Cloudflare failed builds and periodically check Home, a lesson and a checkpoint. Cloudflare deployment history can roll production back to a known working deployment; then revert the faulty source commit through GitHub so the next build stays fixed. Keep the repository, reviewed content snapshot and original media as recovery sources. Test a rollback on a preview before launch. Browser-only progress cannot be centrally restored.

After launch measure real-user performance and check Firefox/Safari/iOS, screen-reader navigation and zoom manually. Local automated tests do not establish full WCAG compliance or live CDN behavior.

Provider references: [static Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [redirects](https://developers.cloudflare.com/pages/configuration/redirects/), [rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/).
