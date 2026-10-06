// Set the full public base URL (including any deployment prefix) at build time.
export const publicSiteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sanukwanniarachchi.github.io/NEST-Lms-NSBM-/");

if (publicSiteUrl.username || publicSiteUrl.password || publicSiteUrl.search || publicSiteUrl.hash
  || (publicSiteUrl.protocol !== "https:" && !(publicSiteUrl.protocol === "http:" && ["localhost", "127.0.0.1"].includes(publicSiteUrl.hostname)))) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTPS public base URL without credentials, a query or a fragment (HTTP is allowed for localhost).");
}
publicSiteUrl.pathname = `${publicSiteUrl.pathname.replace(/\/+$/, "")}/`;

export function publicPageUrl(path = "") {
  return new URL(path.replace(/^\/+/, ""), publicSiteUrl).href;
}
