import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const appUrl = getAppUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/projects", "/guide", "/about", "/contact", "/resources", "/terms", "/privacy", "/cookies", "/refund", "/api/health"],
        disallow: ["/api/", "/s/", "/projects/"],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "Google-Display-Ads-Bot",
        allow: "/",
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
