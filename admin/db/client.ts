import "server-only";
import { openDatabase, type AdminDatabase } from "./connection";

const globalDatabase = globalThis as typeof globalThis & {
  nestAdminDatabase?: Promise<AdminDatabase>;
};

export function getAdminDatabase() {
  globalDatabase.nestAdminDatabase ??= openDatabase().then(({ db }) => db);
  return globalDatabase.nestAdminDatabase;
}
