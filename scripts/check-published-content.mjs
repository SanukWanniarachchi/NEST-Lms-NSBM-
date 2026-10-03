import { readFileSync } from "node:fs";
import { validatePublishedContent } from "./published-content-schema.mjs";

const snapshot = validatePublishedContent(JSON.parse(readFileSync("data/generated/admin-content.json", "utf8")));
console.log(`Published content passed: ${snapshot.courses.length} courses and ${snapshot.announcements.length} announcements; public fields only.`);
