import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";

const appUrl = getAppUrl();

export const metadata: Metadata = {
  title: "Engineering Blog & Resources — FileShare",
  description:
    "Explore the FileShare engineering blog and technical resource publications.",
  alternates: {
    canonical: `${appUrl}/resources`,
  },
  openGraph: {
    title: "Engineering Blog & Resources — FileShare",
    description:
      "Explore the FileShare engineering blog and technical resource publications.",
    url: `${appUrl}/resources`,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "FileShare Engineering Blog & Resources"
    ),
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Blog & Resources — FileShare",
    description:
      "Explore the FileShare engineering blog and technical resource publications.",
    images: [`${appUrl}/og-image.png`],
  },
};

export default function BlogRedirect() {
  redirect("/resources");
}
