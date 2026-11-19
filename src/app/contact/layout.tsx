import type { Metadata } from "next";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";

const appUrl = getAppUrl();

export const metadata: Metadata = {
  title: "Contact Us & Support — FileShare",
  description: "Get in touch with the FileShare team. Technical inquiries, feedback, DMCA notices, and user support.",
  alternates: {
    canonical: `${appUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us & Support — FileShare",
    description: "Get in touch with the FileShare team for technical inquiries, DMCA notices, and support.",
    url: `${appUrl}/contact`,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "FileShare Contact & Support — Real-Time Notes & File Sharing Vault"
    ),
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us & Support — FileShare",
    description: "Get in touch with the FileShare team for technical inquiries, DMCA notices, and user support.",
    images: [`${appUrl}/og-image.png`],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
