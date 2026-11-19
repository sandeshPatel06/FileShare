import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Shield,
  Globe,
  Users,
  HardDrive,
  Code2,
  Cpu,
  HeartHandshake,
  ArrowRight,
  Building2,
} from "lucide-react";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { AdBanner } from "@/components/ads/AdBanner";
import { Footer } from "@/components/Footer";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";
import { ADSENSE_SLOTS } from "@/lib/ads";

const appUrl = getAppUrl();

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "About Us | Architecture & Privacy",
  description: "Learn why FileShare was created: our mission, how it works, our privacy values, and what makes it different.",
  alternates: {
    canonical: `${appUrl}/about`,
  },
  openGraph: {
    title: "About Us | Architecture & Privacy",
    description: "Learn why FileShare was created: our mission, how it works, and our privacy values.",
    url: `${appUrl}/about`,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "About FileShare: Mission, Architecture & Privacy Values"
    ),
  },
  twitter: {
    card: "summary_large_image",
    site: "@SandeshPat007",
    creator: "@SandeshPat007",
    title: "About Us | Architecture & Privacy",
    description: "Learn why FileShare was created: our mission, how it works, and our privacy values.",
    images: [`${appUrl}/og-image.png`],
  },
};

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${appUrl}/about#webpage`,
        "url": `${appUrl}/about`,
        "name": "About FileShare: Engineering Mission, Architecture & Privacy Values",
        "description": "Learn why FileShare was created: our mission, how it works, our privacy values, and what makes it different.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${appUrl}/#website`,
          "name": "FileShare",
          "url": appUrl,
        },
        "inLanguage": "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${appUrl}/about#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": appUrl,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About",
            "item": `${appUrl}/about`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-dvh bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {/* Conditionally load AdSense on this publisher about page */}
      <AdSenseScript />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] border-b border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight">
            <div className="w-7 h-7 rounded-md bg-[var(--accent-primary)] flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <span>FileShare</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
            <Link href="/resources" className="hover:text-[var(--text-main)] transition-colors">Resources</Link>
            <Link href="/guide" className="hover:text-[var(--text-main)] transition-colors">Guide</Link>
            <Link href="/contact" className="hover:text-[var(--text-main)] transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Hero Title */}
        <div className="mb-10 border-b border-[var(--border-color)] pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-3">
            <Globe className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Built by SHP Technology</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            About FileShare
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Fast, zero-login workspaces for live Markdown notes and instant file sharing up to 500 MB.
          </p>
        </div>

        <div className="space-y-10 text-sm sm:text-base leading-relaxed">
          {/* Section: Why FileShare Exists */}
          <section className="bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Why We Built FileShare
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Sharing a quick note, a code snippet, or a large video or archive between two devices should take seconds. Yet most services require an account, email confirmations, software downloads, or strict 25 MB email limits.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              FileShare was built by <strong>Sandesh Patel</strong> at <strong>SHP Technology</strong> in <strong>Jabalpur, Madhya Pradesh, India</strong>, to eliminate that friction. Open any link, share it with peers, and start typing or uploading immediately — no signups, no passwords to manage, and no setup friction.
            </p>
          </section>

          {/* Section: Who It Is For */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Designed for Simplicity and Speed
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed">
              FileShare keeps the focus on instant utility:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-3">
                  <Code2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base mb-1 text-[var(--text-main)]">Developers &amp; Students</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Jot down meeting notes, debug code snippets with syntax highlighting, and preview Mermaid diagrams together in real time.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-3">
                  <HardDrive className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base mb-1 text-[var(--text-main)]">Cross-Device Transfers</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Move photos, PDFs, archives, and build artifacts up to 500 MB between your phone, laptop, and desktop using a simple URL or QR code.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-3">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base mb-1 text-[var(--text-main)]">Privacy-First Sharing</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  No accounts, no email addresses, and no phone numbers required. Add an optional passphrase whenever a workspace needs extra privacy.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-3">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base mb-1 text-[var(--text-main)]">Workshops &amp; Presentations</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Distribute slide decks, workshop exercises, and links to an entire room in seconds without managing attendee permissions.
                </p>
              </div>
            </div>
          </section>

          {/* Section: How It Works */}
          <section className="bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] min-w-0">
                How It Works Under the Hood
              </h2>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              We keep the architecture lightweight and reliable so your workspaces load instantly and update without lag:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[var(--text-muted)]">
              <article className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <h3 className="font-bold text-[var(--text-main)] mb-1">Instant Live Sync</h3>
                <p>When you type, updates appear instantly on connected screens without needing to refresh.</p>
              </article>

              <article className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <h3 className="font-bold text-[var(--text-main)] mb-1">Hybrid Database</h3>
                <p>Powered by PostgreSQL and high-performance SQLite for dependable, lightning-fast response times.</p>
              </article>

              <article className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <h3 className="font-bold text-[var(--text-main)] mb-1">500 MB Vault Storage</h3>
                <p>Uploads stream safely to Backblaze B2 cloud storage with local disk fallbacks, supporting partial downloads and fast resume.</p>
              </article>

              <article className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <h3 className="font-bold text-[var(--text-main)] mb-1">Passphrase Protection</h3>
                <p>Workspaces can be protected with a custom passphrase (hashed using bcrypt). Unlocked sessions are strictly scoped to your current browser tab.</p>
              </article>
            </div>
          </section>

          {/* Safe In-Content Ad Unit */}
          <AdBanner slot={ADSENSE_SLOTS.about} className="max-w-3xl mx-auto" />

          {/* Section: Values & Monetization */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] min-w-0">
                Our Values &amp; Free Access
              </h2>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              FileShare is 100% free to use. We do not sell user data or lock essential features behind paywalls.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed">
              To cover server, cloud storage, and bandwidth costs, we display non-intrusive ads via Google AdSense solely on public pages (like our Guide, Resources, and About pages).
            </p>
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] space-y-2">
              <div className="font-semibold text-[var(--text-main)]">Our Clear Promises:</div>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>No ads inside workspaces:</strong> Your editor and file vaults remain clean and distraction-free.</li>
                <li><strong>No misleading banners:</strong> We never use deceptive popups or disguised download buttons.</li>
                <li><strong>Zero workspace tracking:</strong> We do not inject tracking or advertising scripts inside active workspaces.</li>
              </ul>
            </div>
          </section>

          {/* About the Developer & Company */}
          <section className="bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] min-w-0">
                About the Developer
              </h2>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              FileShare is built and maintained by <strong>Sandesh Patel</strong> under <strong>SHP Technology</strong>, based in Jabalpur, Madhya Pradesh, India.
            </p>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Have feedback, questions, or ideas? Visit our{" "}
              <Link href="/contact" className="text-[var(--accent-primary)] hover:underline font-medium">
                Contact &amp; Support page
              </Link>{" "}
              or email us at{" "}
              <a href="mailto:sandeshpatel.sp.93@gmail.com" className="text-[var(--accent-primary)] hover:underline font-medium">
                sandeshpatel.sp.93@gmail.com
              </a>.
            </p>
          </section>

          {/* Call to action */}
          <section className="bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-main)]">
              Start Sharing Instantly
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-5 max-w-md mx-auto leading-relaxed">
              Launch a live workspace in seconds or browse our technical guides.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                Create Instant Space
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/resources"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm font-semibold hover:bg-[var(--bg-surface)] transition-colors inline-flex items-center justify-center"
              >
                Read Technical Guides
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
