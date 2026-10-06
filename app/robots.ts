import type { MetadataRoute } from "next";
import { publicPageUrl, publicSiteUrl } from "@/lib/public-site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = publicSiteUrl.pathname;
  return { rules: { userAgent: "*", allow: base, disallow: ["admin/", "login/", "dashboard/"].map(path => `${base}${path}`) }, sitemap: publicPageUrl("sitemap.xml") };
}
