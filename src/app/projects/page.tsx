import type { Metadata } from "next";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";
import { ProjectsClient } from "./ProjectsClient";

export async function generateMetadata(): Promise<Metadata> {
  const appUrl = getAppUrl();
  return {
    title: "Workspaces Hub & Projects | FileShare",
    description: "Create an anonymous real-time Markdown workspace or revisit your recent spaces. 100% free, no registration required, with instant live sync and 500MB secure file vault.",
    keywords: [
      "online notepad no login",
      "free workspace without registration",
      "collaborative markdown scratchpad",
      "instant file sharing vault",
      "real time note sharing link",
      "anonymous notes hub",
    ],
    alternates: {
      canonical: `${appUrl}/projects`,
    },
    openGraph: {
      title: "Workspaces Hub & Projects | FileShare",
      description: "Create an anonymous real-time Markdown workspace or revisit your recent spaces. 100% free, no registration required, with instant live sync and 500MB secure file vault.",
      url: `${appUrl}/projects`,
      siteName: "FileShare",
      locale: "en_US",
      type: "website",
      images: getDefaultOgImages(
        appUrl,
        "FileShare Projects & Workspaces"
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: "Workspaces Hub & Projects | FileShare",
      description: "Create an anonymous real-time Markdown workspace or revisit your recent spaces with 500MB file vault.",
      images: [`${appUrl}/og-image.png`],
    },
  };
}

export default function ProjectsPage() {
  return <ProjectsClient />;
}
