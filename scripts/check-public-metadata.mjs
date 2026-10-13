import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = "out";
const base = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sanukwanniarachchi.github.io/NEST-Lms-NSBM-/");
base.pathname = `${base.pathname.replace(/\/+$/, "")}/`;
const pageUrl = path => new URL(path, base).href;
const errors = [];
const urls = new Set();
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) inspect(file);
    else if (entry.name.endsWith(".html")) {
      const path = relative(root, file).split(sep).join("/");
      if (path === "404.html" || path.startsWith("404/") || path.startsWith("_not-found/")) continue;
      const route = path === "index.html" ? "" : path.replace(/index\.html$/, "");
      const retired = ["contact/", "research/", "announcements/"].includes(route);
      const canonicalRoute = route === "contact/" ? "about/" : retired ? "news/" : route;
      const html = readFileSync(file, "utf8");
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/g) || [];
      if (canonical.length !== 1 || !canonical[0].includes(`href="${pageUrl(canonicalRoute)}"`)) errors.push(`${path}: missing or incorrect canonical`);
      if (retired && !/<meta name="robots" content="noindex, follow"/.test(html)) errors.push(`${path}: retired page must be noindex, follow`);
      if (!retired) urls.add(pageUrl(route));
    }
  }
}
inspect(root);
const xml = readFileSync(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
if (sitemapUrls.length !== urls.size || new Set(sitemapUrls).size !== urls.size || sitemapUrls.some(url => !urls.has(url))) errors.push("Sitemap does not exactly match the published, indexable pages");
if (!readFileSync(join(root, "robots.txt"), "utf8").includes(`Sitemap: ${pageUrl("sitemap.xml")}`)) errors.push("robots.txt uses an incorrect sitemap URL");
for (const name of ["_headers", "_redirects"]) readFileSync(join(root, name), "utf8");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else console.log(`Public metadata passed: ${urls.size} indexable pages, matching canonical URLs/sitemap/robots and Cloudflare policy files.`);
