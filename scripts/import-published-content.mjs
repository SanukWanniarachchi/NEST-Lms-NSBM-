import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { validatePublishedContent } from "./published-content-schema.mjs";

if (!process.argv[2]) throw new Error("Provide the reviewed admin-content.json path: npm run content:import -- <path>");
const snapshot = validatePublishedContent(JSON.parse(await readFile(resolve(process.argv[2]), "utf8")));
const target = resolve("data/generated/admin-content.json");
await mkdir(dirname(target), { recursive: true });
await writeFile(`${target}.tmp`, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
await rename(`${target}.tmp`, target);
console.log(`Imported ${snapshot.courses.length} courses and ${snapshot.announcements.length} announcements. Review the diff and run npm run check before publishing.`);
