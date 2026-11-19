import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdaptiveFontLoader } from "@/components/AdaptiveFontLoader";
import { ToastProvider } from "@/components/ui/Toast";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";

const appUrl = getAppUrl();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8fa" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Free Online Notepad & File Sharing | FileShare",
    template: "%s | FileShare",
  },
  description: "Free online notepad without login for real-time Markdown collaboration and secure file sharing up to 500MB. Create a workspace instantly with no registration.",
  keywords: [
    "online notepad",
    "online notepad without login",
    "real-time collaborative notes",
    "live markdown editor online",
    "instant shared notepad",
    "temporary notes sharing",
    "collaborative markdown scratchpad",
    "free web notepad live sync",
    "anonymous text editor",
    "online notepad with link",
    "file share text",
    "text sharing online",
    "share text with a link",
    "text to link sharing",
    "live text sharing",
    "live URL sharing",
    "real-time URL sharing",
    "instant URL sharing",
    "shareable text URL",
    "temporary link sharing",
    "online clipboard sharing",
    "paste text online",
    "online text transfer",
    "send text from phone to PC",
    "transfer text between devices",
    "cross-device text sharing",
    "QR text sharing",
    "anonymous text sharing",
    "temporary notes link",
    "shared URL notepad",
    "live shared notes",
    "collaborative text editor",
    "file share",
    "free file sharing no registration",
    "anonymous file transfer",
    "send large files up to 500mb free",
    "temporary file upload vault",
    "quick file share online",
    "secure file storage without account",
    "qr code file transfer pc to mobile",
    "instant file transfer link",
    "file drop without login",
    "drag and drop file sharing",
    "large file transfer without account",
    "quick file transfer online",
    "pastebin alternative no login",
    "share code snippets with syntax highlighting",
    "online mermaid diagram renderer",
    "developer scratchpad with markdown",
    "instant code sharing tool",
    "password protected notes sharing",
    "secure temporary file vault",
    "ephemeral workspace",
    "private shared notepad with password",
    "zero registration file transfer",
  ],
  authors: [{ name: "SANDESH-PATEL" }],
  creator: "SANDESH-PATEL",
  publisher: "FileShare",
  category: "Productivity",
  alternates: {
    canonical: appUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Free Online Notepad & File Sharing | FileShare",
    description: "Collaborate on Markdown notes in real time and share files up to 500MB without registration.",
    url: appUrl,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "FileShare: Real-Time Notes & File Sharing Vault"
    ),
  },
  twitter: {
    card: "summary_large_image",
    site: "@SandeshPat007",
    creator: "@SandeshPat007",
    title: "Free Online Notepad & File Sharing | FileShare",
    description: "Real-time Markdown notes and secure 500MB file sharing with no sign-up required.",
    images: [`${appUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "FAwpNypqtvK6LiCHZQk4SWhP2nl8wYOqZ_XjFRVnVhU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${appUrl}/#website`,
        "url": appUrl,
        "name": "FileShare",
        "alternateName": ["FileShare Online", "FileShare Notepad", "FileShare Vault"],
        "description": "Free instant real-time collaborative notepad and secure 500MB file sharing with zero registration.",
        "publisher": {
          "@id": `${appUrl}/#organization`,
        },
        "inLanguage": "en-US",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${appUrl}/#software`,
        "name": "FileShare",
        "url": appUrl,
        "image": `${appUrl}/logo.png`,
        "description": "Instant real-time collaborative Markdown text editor and high-speed 500MB secure file sharing workspace without login or registration.",
        "applicationCategory": "UtilitiesApplication, ProductivityApplication, DeveloperApplication",
        "operatingSystem": "All (Web Browser, Windows, macOS, Linux, iOS, Android)",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1540",
          "bestRating": "5",
          "worstRating": "1",
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "featureList": [
          "Zero registration instant anonymous workspaces",
          "Real-time live collaborative Markdown editing with instant sync",
          "Instant file upload vault supporting files up to 500MB",
          "Automatic Mermaid syntax diagram rendering",
          "AI Copilot one-click Markdown syntax formatting",
          "Secure password protection for private workspaces",
          "Dynamic QR code generator for instant PC to phone handoff",
          "Dark and light theme support",
        ],
        "publisher": {
          "@id": `${appUrl}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${appUrl}/#organization`,
        "name": "SHP Technology",
        "url": appUrl,
        "logo": `${appUrl}/logo.png`,
        "founder": {
          "@type": "Person",
          "name": "Sandesh Patel",
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1st floor, SHP Technology, Near Underground Bridge, Madan Mahal Station",
          "addressLocality": "Jabalpur",
          "addressRegion": "Madhya Pradesh",
          "postalCode": "482001",
          "addressCountry": "IN",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${appUrl}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is FileShare free to use, and do I need to register?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, FileShare is 100% free with zero registration required. There are no forms to fill out, no email confirmations, and no subscriptions. You can start typing or uploading immediately.",
            },
          },
          {
            "@type": "Question",
            "name": "What is the file size upload limit?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can upload files up to 500 MB each. FileShare supports multi-file uploads including videos, zip archives, images, PDFs, and code files.",
            },
          },
          {
            "@type": "Question",
            "name": "How does real-time synchronization work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "FileShare uses instant live sync so changes appear across all connected browsers in milliseconds. When anyone edits notes or uploads a file, it shows up automatically without refreshing.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I protect my workspace with a password?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Click Lock Space in the top bar to set a password. Anyone visiting the link will need to enter your password to view or edit notes and files.",
            },
          },
          {
            "@type": "Question",
            "name": "How do I open my workspace on mobile devices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Click the QR code button in the top bar. Scan it with your phone's camera to instantly open and edit your workspace on mobile.",
            },
          },
          {
            "@type": "Question",
            "name": "How is FileShare different from Pastebin, Google Drive, or WeTransfer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Unlike Pastebin, FileShare syncs your typing live, renders rich Markdown diagrams, and supports 500MB file uploads. Unlike Google Drive or WeTransfer, there is no account to create, no email addresses needed, and workspaces open instantly with a link.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I write Markdown and render Mermaid diagrams?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. FileShare supports GitHub Flavored Markdown (headings, task lists, tables, syntax-highlighted code blocks) and renders Mermaid flowcharts and diagrams automatically in real time.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${appUrl}/#howto`,
        "name": "How to Collaborate on Notes and Share Files Instantly Without an Account",
        "description": "Create an instant real-time Markdown notepad and upload files up to 500MB with zero sign-up.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Open a Workspace",
            "text": "Go to /projects to pick a custom name or click Random Space to launch an instant workspace.",
            "url": `${appUrl}/projects`,
          },
          {
            "@type": "HowToStep",
            "name": "Take Notes & Upload Files",
            "text": "Write live Markdown notes with formatting and drag-and-drop files up to 500MB into your workspace vault.",
            "url": `${appUrl}`,
          },
          {
            "@type": "HowToStep",
            "name": "Share or Protect",
            "text": "Share the URL with peers, scan the QR code to open on mobile, or set an optional password to lock your workspace.",
            "url": `${appUrl}`,
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Font origins: preconnect once (cheap). Tier stylesheets are
            injected at runtime by the bootstrap below + AdaptiveFontLoader. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/*
          Network-aware font bootstrap: runs synchronously pre-paint:
          1. Reuses the cached tier (24h TTL) when fresh.
          2. Else classifies via Network Information API (sync, zero bytes).
          3. Top tier ("full") first when the network allows it.
          4. Non-blocking stylesheet fetch (media=print trick) so slow
             networks never block first paint on fonts.
          Keep in sync with src/lib/fonts.ts (TIER_STYLESHEETS + TTL).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var FULL="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap";var BAL="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap";var c=navigator.connection||{};var t=null;try{var s=localStorage.getItem("fs-font-tier"),ts=+localStorage.getItem("fs-font-tier-ts");if((s==="full"||s==="balanced"||s==="lite")&&Date.now()-ts<864e5)t=s;}catch(e){}var tier=t;if(!tier){if(c.saveData||c.effectiveType==="slow-2g"||c.effectiveType==="2g"||(typeof c.downlink==="number"&&c.downlink<0.8))tier="lite";else if(c.effectiveType==="3g"||(typeof c.downlink==="number"&&c.downlink<2.5)||(typeof c.rtt==="number"&&c.rtt>400)||(typeof navigator.deviceMemory==="number"&&navigator.deviceMemory<=2)||(typeof navigator.hardwareConcurrency==="number"&&navigator.hardwareConcurrency<=2))tier="balanced";else tier="full";}document.documentElement.dataset.fontTier=tier;var url=tier==="full"?FULL:(tier==="balanced"?BAL:null);if(url){var l=document.createElement("link");l.id="adaptive-font-css";l.rel="stylesheet";l.href=url;l.media="print";l.onload=function(){l.media="all";};document.head.appendChild(l);setTimeout(function(){l.media="all";},3000);}}catch(e){}})();`,
          }}
        />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Consent Mode v2 Initialization (GDPR & DPDP Act 2023 Default Denied with wait_for_update) */}
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `}
        </Script>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QJ7L4HP72G"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QJ7L4HP72G', {
              anonymize_ip: true
            });
          `}
        </Script>
        {/* Google AdSense Site Verification (Script loaded conditionally on content-rich pages) */}
        <meta name="google-adsense-account" content="ca-pub-4947821599815451" />
      </head>
      <body className="antialiased bg-[var(--bg-main)] text-[var(--text-main)] min-h-dvh font-sans transition-colors duration-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent-primary)] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme={process.env.NEXT_PUBLIC_DEFAULT_THEME || "dark"}
          enableSystem={false}
        >
          <div id="main-content" tabIndex={-1} className="outline-none min-h-dvh flex flex-col">
            {children}
          </div>
          <AdaptiveFontLoader />
          <ToastProvider />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
