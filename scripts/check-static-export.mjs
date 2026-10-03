import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const exportRoot = resolve("out");
const manifest = ".next/routes-manifest.json";
const basePath = process.env.PAGES_BASE_PATH ?? (existsSync(manifest) ? JSON.parse(readFileSync(manifest, "utf8")).basePath : "") ?? "";
const origin = "https://nest-export.invalid";
const problems = new Set();
const checkedTargets = new Set();
const htmlFiles = [];
const cssFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (extname(path) === ".html") htmlFiles.push(path);
    else if (extname(path) === ".css") cssFiles.push(path);
  }
}

function checkTarget(value, source, checkFragment = false) {
  const decoded = value.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
  const sourcePath = relative(exportRoot, source).split(sep).join("/");
  const url = new URL(decoded, `${origin}${basePath}/${sourcePath}`);
  if (url.protocol === "javascript:") {
    problems.add(`${sourcePath}: executable link ${value}`);
    return;
  }
  if (url.origin !== origin) return;
  if (basePath && url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) {
    problems.add(`${sourcePath}: link outside deployment base path ${value}`);
    return;
  }
  const pathname = decodeURIComponent(url.pathname.slice(basePath.length));
  let target = resolve(exportRoot, `.${pathname}`);
  if (target !== exportRoot && !target.startsWith(`${exportRoot}${sep}`)) {
    problems.add(`${sourcePath}: path outside export ${value}`);
    return;
  }
  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
  if (!existsSync(target)) {
    problems.add(`${sourcePath}: missing target ${value}`);
    return;
  }
  checkedTargets.add(target);
  if (checkFragment && url.hash && extname(target) === ".html") {
    const id = decodeURIComponent(url.hash.slice(1));
    const content = readFileSync(target, "utf8");
    const ids = Array.from(content.matchAll(/\bid=["']([^"']+)["']/g), match => match[1]);
    if (!ids.includes(id)) problems.add(`${sourcePath}: missing anchor ${value}`);
  }
}

if (!existsSync(exportRoot)) throw new Error("No static export found. Run npm run build first.");
walk(exportRoot);
for (const file of htmlFiles) {
  const path = relative(exportRoot, file).split(sep).join("/");
  if (/^(?:demos|_demos|admin|login|dashboard)(?:\/|\.html$)/.test(path)) problems.add(`Non-public route exported: ${path}`);
  const content = readFileSync(file, "utf8");
  for (const match of content.matchAll(/<(a|link|img|script|source)\b[^>]*?\b(?:href|src)=["']([^"']+)["'][^>]*>/g)) {
    checkTarget(match[2], file, match[1] === "a");
  }
}
for (const file of cssFiles) {
  for (const match of readFileSync(file, "utf8").matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) checkTarget(match[1], file);
}
if (problems.size) {
  console.error([...problems].join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Static export passed: ${htmlFiles.length} HTML files, ${checkedTargets.size} local targets, ${cssFiles.length} stylesheets; no demo/admin routes or broken local links/assets. Base path: ${basePath || "/"}`);
}
