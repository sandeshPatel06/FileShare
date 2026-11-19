import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ShieldCheck, Settings, CheckCircle2, Lock, Eye, ArrowLeft } from "lucide-react";
import { CookieSettingsButton } from "@/components/ui/CookieSettingsButton";
import { Footer } from "@/components/Footer";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";

const appUrl = getAppUrl();

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Detailed Cookie Policy for FileShare. Understand what cookies and browser storage technologies we use, why we use them, and how to manage your privacy preferences.",
  alternates: {
    canonical: `${appUrl}/cookies`,
  },
  openGraph: {
    title: "Cookie Policy | FileShare",
    description: "Learn about the cookies and storage technologies used by FileShare.",
    url: `${appUrl}/cookies`,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "FileShare: Cookie Policy & Storage Technologies"
    ),
  },
  twitter: {
    card: "summary_large_image",
    site: "@SandeshPat007",
    creator: "@SandeshPat007",
    title: "Cookie Policy | FileShare",
    description: "Learn about the cookies and storage technologies used by FileShare.",
    images: [`${appUrl}/og-image.png`],
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] border-b border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight">
            <div className="w-7 h-7 rounded-md bg-[var(--accent-primary)] flex items-center justify-center text-white">
              <Cookie className="w-4 h-4" />
            </div>
            <span>FileShare</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
            <Link href="/privacy" className="hover:text-[var(--text-main)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[var(--text-main)] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[var(--text-main)] transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        <div className="mb-10 border-b border-[var(--border-color)] pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--status-success-text)]" />
            <span>Privacy &amp; Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Cookie Policy
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-2xl">
            FileShare uses minimal browser storage to keep workspaces secure and functional. We do not require accounts, and optional analytics or ads stay off unless you choose to enable them.
          </p>
          <p className="text-xs text-[var(--text-subtle)] mt-2">
            Last Updated: September 29, 2026 | Effective Date: September 29, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          {/* Quick Preference Box */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--accent-primary)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-base text-[var(--text-main)] mb-1">
                Your Cookie Choices
              </h2>
              <p className="text-xs text-[var(--text-muted)] max-w-xl">
                Optional analytics and advertising cookies are disabled by default. You can review or change your settings at any time.
              </p>
            </div>
            <div className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold hover:bg-[var(--accent-primary-hover)] transition-colors inline-flex items-center justify-center gap-2">
              <Settings className="w-3.5 h-3.5" />
              <CookieSettingsButton />
            </div>
          </section>

          {/* Section 1: Overview */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <Cookie className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              1. What We Store and Why
            </h2>
            <p className="text-[var(--text-muted)]">
              We use two types of browser storage:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[var(--text-muted)]">
              <li>
                <strong>Local &amp; Session Storage:</strong> Saved directly in your browser. Unlike cookies, this data is not sent with every HTTP request. We use it solely to keep password-protected workspaces unlocked for your session and to remember your theme.
              </li>
              <li>
                <strong>Cookies:</strong> Small text files placed in your browser. We use cookies only for anonymous aggregate analytics and non-intrusive ads, both of which require your explicit consent.
              </li>
            </ul>
          </section>

          {/* Section 2: Storage Inventory */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <Lock className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              2. Complete Storage Inventory
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Here is every storage key and cookie FileShare uses:
            </p>

            <div className="overflow-x-auto max-w-full">
              <table className="w-full min-w-[640px] text-left text-xs border border-[var(--border-color)] rounded-xl overflow-hidden">
                <thead className="bg-[var(--bg-main)] font-mono text-[var(--text-subtle)] dark:text-[var(--text-muted)] border-b border-[var(--border-color)]">
                  <tr>
                    <th className="p-3">Key / Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
                  <tr>
                    <td className="p-3 font-mono font-bold text-[var(--text-main)]">token:[slug]</td>
                    <td className="p-3">sessionStorage</td>
                    <td className="p-3 font-semibold text-[var(--status-success-text)]">Essential</td>
                    <td className="p-3">Tab session</td>
                    <td className="p-3">Temporarily keeps password-protected workspaces unlocked. Cleared when you close the tab.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-[var(--text-main)]">fileshare_cookie_consent</td>
                    <td className="p-3">localStorage</td>
                    <td className="p-3 font-semibold text-[var(--status-success-text)]">Essential</td>
                    <td className="p-3">1 year</td>
                    <td className="p-3">Saves your cookie consent choices so you do not see the banner on every page reload.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-[var(--text-main)]">theme</td>
                    <td className="p-3">localStorage</td>
                    <td className="p-3 font-semibold text-[var(--accent-sky)]">Preference</td>
                    <td className="p-3">Persistent</td>
                    <td className="p-3">Remembers your dark or light theme preference.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-[var(--text-main)]">_ga, _ga_*</td>
                    <td className="p-3">Cookie (Google)</td>
                    <td className="p-3 font-semibold text-[var(--accent-primary)]">Analytics (Optional)</td>
                    <td className="p-3">Up to 2 years</td>
                    <td className="p-3">Collects anonymized traffic statistics to help us see how FileShare is used. Only set if opted in.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-[var(--text-main)]">__gads, __gpi</td>
                    <td className="p-3">Cookie (Google)</td>
                    <td className="p-3 font-semibold text-[var(--accent-primary)]">Advertising (Optional)</td>
                    <td className="p-3">13 months</td>
                    <td className="p-3">Limits how often the same ad is shown on public editorial pages. Only set if opted in.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Default-Off Consent */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <Eye className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              3. Privacy by Default (Consent Mode v2)
            </h2>
            <p className="text-[var(--text-muted)]">
              We respect your privacy upfront. On your first visit, all analytics and advertising cookies remain completely disabled. We only activate them if you explicitly select &quot;Accept All&quot; or enable them in your preferences.
            </p>
          </section>

          {/* Section 4: Browser Controls */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              4. Managing Cookies in Your Browser
            </h2>
            <p className="text-[var(--text-muted)]">
              You can also block or clear cookies and local storage through your browser settings at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[var(--text-muted)]">
              <li><strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies</li>
              <li><strong>Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
              <li><strong>Safari:</strong> Settings &gt; Privacy &gt; Block all cookies / Manage Website Data</li>
              <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies</li>
            </ul>
            <p className="text-xs text-[var(--text-muted)] italic pt-1">
              Note: Blocking session storage will prevent password-protected workspaces from staying unlocked while editing.
            </p>
          </section>

          {/* Section 5: Contact */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-2">
            <h2 className="text-lg font-bold text-[var(--text-main)]">5. Questions &amp; Contact</h2>
            <p className="text-[var(--text-muted)]">
              If you have questions about our cookie policy or privacy practices, reach out to us:
            </p>
            <div className="p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-mono space-y-1 break-all">
              <div>Entity: SHP Technology</div>
              <div>Contact: Sandesh Patel</div>
              <div>Email: sandeshpatel.sp.93@gmail.com</div>
              <div>Address: Jabalpur, Madhya Pradesh 482001, India</div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
