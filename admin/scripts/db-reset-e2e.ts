import { rm } from "node:fs/promises";
import path from "node:path";

const dataRoot = path.resolve(process.cwd(), "admin", ".data");
const configured = process.env.NEST_DATABASE_URL || "admin/.data/e2e";
const target = path.resolve(process.cwd(), configured);

if (path.dirname(target) !== dataRoot || path.basename(target) !== "e2e") {
  throw new Error("Refusing to reset a database outside admin/.data/e2e.");
}

async function main() {
  await rm(target, { recursive: true, force: true });
  console.log(`Reset test database at ${target}.`);
}

void main();
