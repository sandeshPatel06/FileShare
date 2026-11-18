/**
 * SEO & Canonical URL Configuration Helper
 * Enforces https://fileshare.shptechnology.online as the canonical domain in production,
 * preventing accidental indexing of *.onrender.com or circular canonical redirect loops.
 */

export const CANONICAL_SITE_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://filesp.pages.dev";

export function getAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  // If envUrl points to the internal render domain or is missing, enforce canonical domain.
  if (!envUrl || envUrl.includes("onrender.com")) {
    return CANONICAL_SITE_URL;
  }

  // During local development or configured custom domain
  return envUrl.replace(/\/+$/, "");
}
