import "server-only";

export function isLocalAuthEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.NEST_AUTH_MODE === "local";
}

export function getLocalAdminName() {
  return process.env.NEST_DEV_ADMIN_NAME?.trim() || "NEST Administrator";
}
