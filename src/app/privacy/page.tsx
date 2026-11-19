import type { Metadata } from "next";
import Link from "next/link";
import { Shield, FileText, Lock, Globe, Database, Cookie, AlertCircle, Scale, UserCheck } from "lucide-react";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";
import { Footer } from "@/components/Footer";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";

const appUrl = getAppUrl();

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Privacy Policy (GDPR & DPDP)",
  description: "Privacy policy for FileShare (SHP Technology). Plain-language data protection notice compliant with the EU GDPR and India's DPDP Act, 2023.",
  alternates: {
    canonical: `${appUrl}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | GDPR & DPDP Compliant",
    description: "Learn how FileShare handles your data: no accounts required, instant file deletion, and full GDPR and India DPDP Act compliance.",
    url: `${appUrl}/privacy`,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "FileShare: Privacy Policy & Data Protection Notice"
    ),
  },
  twitter: {
    card: "summary_large_image",
    site: "@SandeshPat007",
    creator: "@SandeshPat007",
    title: "Privacy Policy | GDPR & DPDP Compliant",
    description: "Learn how FileShare handles your data: no accounts required, instant file deletion, and full GDPR and India DPDP Act compliance.",
    images: [`${appUrl}/og-image.png`],
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col transition-colors duration-200">
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
            <Link href="/cookies" className="hover:text-[var(--text-main)] transition-colors">Cookie Policy</Link>
            <Link href="/terms" className="hover:text-[var(--text-main)] transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-[var(--text-main)] transition-colors">Refund Policy</Link>
            <Link href="/contact" className="hover:text-[var(--text-main)] transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Title & Badge */}
        <div className="mb-8 border-b border-[var(--border-color)] pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-3">
            <Shield className="w-3.5 h-3.5 text-[var(--status-success-text)]" />
            <span>GDPR (EU) &amp; DPDP Act 2023 (India) Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Last updated: September 29, 2026 · Effective date: September 29, 2026
          </p>
        </div>

        {/* Quick Summary Card */}
        <div className="mb-8 p-4 sm:p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs sm:text-sm space-y-2">
          <h2 className="font-semibold text-[var(--text-main)] text-sm sm:text-base">
            The short version
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            You do not need to register, sign in, or share your email, phone number, or name to use FileShare. We collect only what is strictly required to run your live notes and file transfers, we never sell your data, and you can delete your uploaded files at any time.
          </p>
        </div>

        <div className="text-sm leading-relaxed space-y-8">
          {/* Section 1: Who We Are */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <Globe className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              1. Who We Are (Data Fiduciary)
            </h2>
            <p className="text-[var(--text-muted)]">
              This notice outlines how <strong>SHP Technology</strong> (&quot;FileShare&quot;, &quot;we&quot;, &quot;our&quot;) handles your data in compliance with the <strong>EU General Data Protection Regulation (GDPR)</strong> and <strong>India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>. Under these laws, SHP Technology acts as the Data Fiduciary (or Data Controller).
            </p>
            <div className="p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-mono space-y-1.5 break-all">
              <div><strong>Entity:</strong> SHP Technology (Operating &quot;FileShare&quot;)</div>
              <div><strong>Address:</strong> 1st floor, SHP Technology, Near Underground Bridge, Madan Mahal Station, Jabalpur, Madhya Pradesh 482001, India</div>
              <div><strong>Contact Email:</strong> sandeshpatel.sp.93@gmail.com</div>
              <div><strong>Grievance Officer:</strong> Sandesh Patel (sandeshpatel.sp.93@gmail.com)</div>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              We practice strict <strong>data minimization</strong>: we do not maintain user profiles, track identities across the web, or require personal identifiers to create or join workspaces.
            </p>
          </section>

          {/* Section 2: What We Collect */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <Database className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              2. What We Collect and Store
            </h2>
            <p className="text-[var(--text-muted)]">
              Because FileShare requires no account registration, we only process the technical items needed to make your shared spaces function:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                <div className="font-bold text-[var(--text-main)]">Workspace Notes &amp; Text</div>
                <p className="text-[var(--text-muted)]">
                  The Markdown notes and diagrams you edit in a workspace (<code className="font-mono text-[var(--accent-primary)]">/s/[slug]</code>). Notes update live for anyone with the workspace link.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                <div className="font-bold text-[var(--text-main)]">Uploaded Files (Vault)</div>
                <p className="text-[var(--text-muted)]">
                  Files you upload (up to 500 MB per file). Stored with encryption on Backblaze B2 cloud storage. Any participant with access can download or delete them.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                <div className="font-bold text-[var(--text-main)]">Workspace Passwords</div>
                <p className="text-[var(--text-muted)]">
                  If you protect a space, we store only a safely scrambled version of your password. We can never read, access, or recover your original password.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
                <div className="font-bold text-[var(--text-main)]">Local &amp; Session Storage</div>
                <p className="text-[var(--text-muted)]">
                  Session storage keeps short-lived tokens to keep protected workspaces unlocked during your browser session (cleared on tab close). Local storage remembers your theme and cookie choices.
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              <strong>Server Logs:</strong> Temporary web logs (IP address, user agent, timestamp) are kept briefly for abuse prevention, DDoS protection, and rate limiting, then discarded.
            </p>
          </section>

          {/* Section 3: Legal Grounds */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <Scale className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              3. Legal Bases for Processing
            </h2>
            <p className="text-[var(--text-muted)]">
              Under Section 4 and 6 of the India DPDP Act 2023 and Article 6 of the EU GDPR, we process data only for defined, lawful purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[var(--text-muted)]">
              <li>
                <strong>Delivering the Workspace Service (Contract / Consent):</strong> Sending your Markdown notes, diagrams, and files to your active collaborators in real time so everyone sees changes instantly.
              </li>
              <li>
                <strong>Access Protection &amp; Authentication (Specified Purpose / Legitimate Use):</strong> Checking your passphrase securely to keep locked workspaces restricted to authorised users.
              </li>
              <li>
                <strong>Security, Abuse Prevention &amp; Rate Limiting (Legitimate Interest / Legal Duty):</strong> Monitoring request frequency to safeguard the platform from brute-force attempts, DDoS attacks, and malicious uploads.
              </li>
              <li>
                <strong>Site Analytics &amp; Advertising (Explicit Consent):</strong> Google Analytics 4 (with IP anonymization) and Google AdSense are activated only if you grant consent through our cookie consent banner (Google Consent Mode v2).
              </li>
            </ul>
          </section>

          {/* Section 4: Your Rights */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <UserCheck className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              4. Your Privacy Rights
            </h2>
            <p className="text-[var(--text-muted)]">
              Whether you are in the European Economic Area or India, you have enforceable statutory rights under GDPR (Chapter III) and the DPDP Act 2023 (Sections 11–14):
            </p>
            <div className="space-y-2.5 text-xs text-[var(--text-muted)]">
              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <strong className="text-[var(--text-main)] block mb-1">Right to Access &amp; Summary (DPDP Sec. 11 / GDPR Art. 15):</strong>
                You can ask what personal data we process and the categories of service providers involved.
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <strong className="text-[var(--text-main)] block mb-1">Right to Correction &amp; Erasure (DPDP Sec. 12 / GDPR Art. 16 &amp; 17):</strong>
                You can delete any uploaded file immediately using the trash icon in the file panel, or clear text in your workspace. You may also contact us to request the permanent deletion of unreferenced workspace records.
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <strong className="text-[var(--text-main)] block mb-1">Right to Grievance Redressal (DPDP Sec. 13):</strong>
                You are entitled to have data protection queries or complaints resolved by our Grievance Officer within 30 days.
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <strong className="text-[var(--text-main)] block mb-1">Right to Nominate (DPDP Sec. 14):</strong>
                Under Indian law, you may nominate an individual to manage your personal data rights in the event of death or incapacity.
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                <strong className="text-[var(--text-main)] block mb-1">Right to Withdraw Consent (DPDP Sec. 6[4] / GDPR Art. 7):</strong>
                You can withdraw your consent for non-essential cookies and analytics at any time via the Cookie Settings button below.
              </div>
            </div>
          </section>

          {/* Section 5: Grievance Officer & Complaints */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--accent-primary)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <AlertCircle className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              5. Grievance Redressal Officer (DPDP Act Disclosure)
            </h2>
            <p className="text-[var(--text-muted)]">
              If you have any questions, concerns, or requests regarding your personal data, reach out directly to our Grievance Redressal Officer:
            </p>
            <div className="p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-mono space-y-1.5 break-all">
              <div><strong>Officer Name:</strong> Sandesh Patel</div>
              <div><strong>Role:</strong> Data Protection &amp; Grievance Redressal Officer</div>
              <div><strong>Organization:</strong> SHP Technology</div>
              <div><strong>Address:</strong> 1st floor, SHP Technology, Near Underground Bridge, Madan Mahal Station, Jabalpur, Madhya Pradesh 482001, India</div>
              <div><strong>Email:</strong> sandeshpatel.sp.93@gmail.com</div>
              <div><strong>Acknowledgment:</strong> Within 48 hours</div>
              <div><strong>Resolution:</strong> Within 30 calendar days</div>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              <strong>Escalations:</strong> If you are not satisfied with our resolution, you have the right under Indian law to appeal to the <strong>Data Protection Board of India (DPBI)</strong>. Residents of the European Economic Area may file a complaint with their local supervisory Data Protection Authority (DPA).
            </p>
          </section>

          {/* Section 6: Children's Privacy */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <Lock className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              6. Protection of Children (DPDP Sec. 9 &amp; GDPR Art. 8)
            </h2>
            <p className="text-[var(--text-muted)]">
              FileShare does not target or knowingly collect data from children under 18 years of age:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[var(--text-muted)]">
              <li>We do not track, profile, or serve targeted advertising to children.</li>
              <li>We do not process data in any manner likely to harm a minor&apos;s well-being.</li>
              <li>If you believe a minor has uploaded personal files or content to a workspace without parental consent, contact <code className="font-mono text-xs break-all">sandeshpatel.sp.93@gmail.com</code> for immediate removal.</li>
            </ul>
          </section>

          {/* Section 7: Infrastructure & Transfers */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <Globe className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              7. Cloud Infrastructure &amp; Cross-Border Transfers
            </h2>
            <p className="text-[var(--text-muted)]">
              To provide fast and reliable real-time collaboration across regions, we use trusted infrastructure partners:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[var(--text-muted)]">
              <li>
                <strong>Encrypted Cloud Storage (Backblaze B2 / AWS S3):</strong> Vault files are stored in SOC 2 / ISO 27001 certified data centers with encryption at rest and transport-layer protection (TLS 1.3).
              </li>
              <li>
                <strong>Edge Network &amp; Hosting:</strong> Cloud edge infrastructure providing DDoS filtering and low-latency delivery.
              </li>
              <li>
                <strong>Google Analytics &amp; AdSense:</strong> Operated by Google LLC with anonymized IP addresses. Tracking cookies load only after explicit user approval.
              </li>
            </ul>
          </section>

          {/* Section 8: Cookies */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <Cookie className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              8. Cookie Preferences
            </h2>
            <p className="text-[var(--text-muted)]">
              Essential cookies keep your workspace preferences working. For full details on our cookie usage and third-party scripts, read our{" "}
              <Link href="/cookies" className="text-[var(--accent-primary)] underline hover:text-[var(--text-main)]">
                Cookie Policy
              </Link>.
            </p>
            <div className="pt-2">
              <CookieSettingsButton />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
