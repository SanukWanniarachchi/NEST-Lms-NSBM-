type Environment = Record<string, string | undefined>;

export function productionConfigurationErrors(environment: Environment) {
  const errors: string[] = [];
  if (environment.NEST_AUTH_MODE !== "oidc") errors.push("NEST_AUTH_MODE must be oidc.");
  if ((environment.AUTH_SECRET?.trim().length ?? 0) < 32) errors.push("AUTH_SECRET must contain at least 32 non-padding characters.");
  if (environment.NEST_DATABASE_DRIVER !== "postgres") errors.push("NEST_DATABASE_DRIVER must be postgres.");
  for (const key of ["OIDC_CLIENT_ID", "OIDC_CLIENT_SECRET"]) {
    if (!environment[key]?.trim()) errors.push(`${key} is required.`);
  }
  for (const key of ["OIDC_ISSUER", "OIDC_REDIRECT_URI", "NEXT_PUBLIC_SITE_URL"]) {
    try {
      const url = new URL(environment[key] ?? "");
      if (url.protocol !== "https:" || url.username || url.password || url.hash) throw new Error();
      if (key === "OIDC_REDIRECT_URI" && (url.pathname !== "/auth/callback" || url.search)) throw new Error();
    } catch {
      errors.push(`${key} must be an HTTPS URL without credentials or a fragment${key === "OIDC_REDIRECT_URI" ? ", ending in /auth/callback without a query" : ""}.`);
    }
  }
  try {
    const database = new URL(environment.DATABASE_URL ?? "");
    if (!["postgres:", "postgresql:"].includes(database.protocol) || !database.hostname || database.pathname.length < 2) throw new Error();
  } catch {
    errors.push("DATABASE_URL must be a PostgreSQL connection URL with a database name.");
  }
  if (environment.OIDC_CLIENT_AUTH_METHOD && !["client_secret_basic", "client_secret_post"].includes(environment.OIDC_CLIENT_AUTH_METHOD)) errors.push("OIDC_CLIENT_AUTH_METHOD is unsupported.");
  if (environment.NEST_DEV_ADMIN_CODE?.trim()) errors.push("Remove NEST_DEV_ADMIN_CODE from production settings.");
  if (environment.PORT && (!/^\d+$/.test(environment.PORT) || Number(environment.PORT) < 1 || Number(environment.PORT) > 65535)) errors.push("PORT must be an integer from 1 to 65535.");
  return errors;
}

export function assertProductionConfiguration(environment: Environment) {
  const errors = productionConfigurationErrors(environment);
  if (errors.length) throw new Error(`Production configuration is incomplete:\n${errors.join("\n")}`);
}
