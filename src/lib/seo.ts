/**
 * SEO & Canonical URL Configuration Helper
 * Enforces https://filesp.pages.dev as the canonical domain in production,
 * preventing accidental indexing of *.onrender.com, *.shptechnology.online,
 * or circular canonical redirect loops.
 */

export const CANONICAL_SITE_URL = "https://filesp.pages.dev";

export function getAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  // In production, ALWAYS enforce canonical domain
  if (process.env.NODE_ENV === "production") {
    return CANONICAL_SITE_URL;
  }

  // If envUrl points to legacy domains (*.onrender.com, *shptechnology.online) or is missing, enforce canonical
  if (
    !envUrl ||
    envUrl.includes("onrender.com") ||
    envUrl.includes("shptechnology.online")
  ) {
    return CANONICAL_SITE_URL;
  }

  // During local development (e.g. http://localhost:3000)
  return envUrl.replace(/\/+$/, "");
}

export const SITE_NAME = "FileShare";
export const DEFAULT_TWITTER_SITE = "@SandeshPat007";
export const DEFAULT_TWITTER_CREATOR = "@SandeshPat007";

export function getDefaultOgImages(appUrl: string, customAlt?: string) {
  return [
    {
      url: `${appUrl}/og-image.png`,
      secureUrl: `${appUrl}/og-image.png`,
      width: 1200,
      height: 630,
      alt: customAlt || "FileShare — Free Online Collaborative Notepad & 500MB File Vault",
      type: "image/png",
    },
    {
      url: `${appUrl}/logo.png`,
      secureUrl: `${appUrl}/logo.png`,
      width: 512,
      height: 512,
      alt: customAlt ? `${customAlt} Logo` : "FileShare Logo — Real-Time Notes & File Sharing Vault",
      type: "image/png",
    },
  ];
}

export function getDefaultTwitter(options: {
  title: string;
  description: string;
  image?: string;
  card?: "summary_large_image" | "summary";
}) {
  const appUrl = getAppUrl();
  return {
    card: options.card || ("summary_large_image" as const),
    site: DEFAULT_TWITTER_SITE,
    creator: DEFAULT_TWITTER_CREATOR,
    title: options.title,
    description: options.description,
    images: [options.image || `${appUrl}/og-image.png`],
  };
}
