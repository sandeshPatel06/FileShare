import { generateSlug } from "@/lib/slugGenerator";
import { LandingPage } from "@/components/LandingPage";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";
import type { Metadata } from "next";

const appUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Free Online Notepad & File Sharing | FileShare",
  description: "Free online notepad without login for real-time Markdown collaboration and secure file sharing up to 500MB. Create a workspace instantly with no registration.",
  keywords: [
    "online notepad without login",
    "real-time collaborative notepad",
    "file share text",
    "text sharing online",
    "share text with a link",
    "live URL sharing",
    "instant URL sharing",
    "temporary link sharing",
    "paste text online",
    "online clipboard sharing",
    "send text from phone to PC",
    "transfer text between devices",
    "anonymous text sharing",
    "shared URL notepad",
    "live shared notes",
    "collaborative text editor",
    "file sharing without registration",
    "500mb file sharing",
    "real-time markdown editor",
    "temporary workspace without sign up",
    "share files with a link",
    "anonymous file transfer",
    "file drop without login",
    "drag and drop file sharing",
    "large file transfer without account",
    "share notes online",
    "password protected notes",
    "qr code file transfer",
    "temporary file vault",
  ],
  alternates: {
    canonical: appUrl,
  },
  openGraph: {
    title: "Free Online Notepad & File Sharing | FileShare",
    description: "Real-time Markdown notes and secure file sharing up to 500MB without registration.",
    url: appUrl,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "FileShare Logo — Real-Time Notes & File Vault"
    ),
  },
  twitter: {
    card: "summary_large_image",
    site: "@SandeshPat007",
    creator: "@SandeshPat007",
    title: "Free Online Notepad & File Sharing | FileShare",
    description: "Create a real-time Markdown workspace and share files up to 500MB with no sign-up.",
    images: [`${appUrl}/og-image.png`],
  },
};

export default function Home() {
  const defaultSlug = generateSlug();

  // NOTE: questions/answers must match the visible FAQ copy in
  // LandingPage.tsx exactly — mismatched FAQ schema risks rich-result removal.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is FileShare free to use, and do I need to register?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, FileShare is 100% free with zero registration required. There are no forms to fill out, no email confirmations, and no subscriptions. You can start typing or uploading immediately."
        }
      },
      {
        "@type": "Question",
        "name": "What is the file size upload limit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can upload files up to 500 MB each. FileShare supports multi-file uploads including videos, zip archives, images, PDFs, and code files."
        }
      },
      {
        "@type": "Question",
        "name": "How does real-time synchronization work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FileShare uses instant live sync so changes appear across all connected browsers in milliseconds. When anyone edits notes or uploads a file, it shows up automatically without refreshing."
        }
      },
      {
        "@type": "Question",
        "name": "Can I protect my workspace with a password?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Click Lock Space in the top bar to set a password. Anyone visiting the link will need to enter your password to view or edit notes and files."
        }
      },
      {
        "@type": "Question",
        "name": "How do I open my workspace on mobile devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Click the QR code button in the top bar. Scan it with your phone's camera to instantly open and edit your workspace on mobile."
        }
      },
      {
        "@type": "Question",
        "name": "How is FileShare different from Pastebin, Google Drive, or WeTransfer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike Pastebin, FileShare syncs your typing live, renders rich Markdown diagrams, and supports 500MB file uploads. Unlike Google Drive or WeTransfer, there is no account to create, no email addresses needed, and workspaces open instantly with a link."
        }
      },
      {
        "@type": "Question",
        "name": "Can I write Markdown and render Mermaid diagrams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. FileShare supports GitHub Flavored Markdown (headings, task lists, tables, syntax-highlighted code blocks) and renders Mermaid flowcharts and diagrams automatically in real time."
        }
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Create an Instant Collaborative Workspace and Share Files",
    "description": "Step-by-step instructions to create an anonymous real-time workspace for live Markdown notes and secure file sharing up to 500MB.",
    "image": `${appUrl}/logo.png`,
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Choose or enter a workspace slug",
        "text": "Enter your preferred custom workspace name (such as /s/my-project) in the launcher or click 'Random Space' to auto-generate a private slug."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Collaborate on live Markdown notes",
        "text": "Write and edit text simultaneously with collaborators. Format with Markdown, code syntax highlighting, task checkboxes, and Mermaid diagrams."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Upload files up to 500MB",
        "text": "Drag and drop archives, PDFs, videos, or code folders into the file vault. Files sync live across all active participants."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Share or lock your space",
        "text": "Share the URL, scan the QR code on your phone, or add a password lock for private collaboration."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <LandingPage defaultSlug={defaultSlug} />
    </>
  );
}
