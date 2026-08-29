import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { basename, dirname, extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? 4173);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
]);

function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  const cleanPath = normalize(decoded).replace(/^([/\\])+/, "");
  const target = resolve(root, cleanPath);

  if (target !== root && !target.startsWith(root + sep)) {
    return null;
  }

  const candidates = [target];
  const pagePayloadSuffix = ".__PAGE__.txt";
  if (target.endsWith(pagePayloadSuffix)) {
    const payloadBase = basename(target, pagePayloadSuffix);
    const [prefix, route, ...segments] = payloadBase.split(".");
    if (prefix && route) {
      candidates.push(join(dirname(target), `${prefix}.${route}`, ...segments, "__PAGE__.txt"));
    }
  }
  if (existsSync(target) && statSync(target).isDirectory()) {
    candidates.push(join(target, "index.html"));
  } else if (!extname(target)) {
    candidates.push(join(target, "index.html"), `${target}.html`);
  }

  return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
}

createServer((request, response) => {
  const file = resolveFile(request.url ?? "/");
  if (!file) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": mimeTypes.get(extname(file)) ?? "application/octet-stream",
  });
  createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});
