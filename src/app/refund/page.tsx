import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, CheckCircle2, ShieldAlert, ArrowLeft, Mail, RefreshCcw } from "lucide-react";
import { Footer } from "@/components/Footer";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";

const appUrl = getAppUrl();

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Official Refund and Cancellation Policy for FileShare, operated by SHP Technology. Learn about our free service tier, voluntary contributions, and dispute resolutions.",
  alternates: {
    canonical: `${appUrl}/refund`,
  },
  openGraph: {
    title: "Refund Policy | FileShare",
    description: "Read the transparent Refund and Cancellation terms for FileShare.",
    url: `${appUrl}/refund`,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "FileShare: Refund & Cancellation Policy"
    ),
  },
  twitter: {
    card: "summary_large_image",
    site: "@SandeshPat007",
    creator: "@SandeshPat007",
    title: "Refund Policy | FileShare",
    description: "Read the transparent Refund and Cancellation terms for FileShare.",
    images: [`${appUrl}/og-image.png`],
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-dvh bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] border-b border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight">
            <div className="w-7 h-7 rounded-md bg-[var(--accent-primary)] flex items-center justify-center text-white">
              <CreditCard className="w-4 h-4" />
            </div>
            <span>FileShare</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
            <Link href="/privacy" className="hover:text-[var(--text-main)] transition-colors">Privacy</Link>
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
            <RefreshCcw className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Commercial Terms & Policies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-2xl">
            FileShare is a 100% free web utility operated by SHP Technology. Here is how our refund and cancellation policies work.
          </p>
          <p className="text-xs text-[var(--text-subtle)] mt-2 font-mono">
            Last Updated: September 29, 2026 | Effective Date: September 29, 2026
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          {/* Section 1: Free Service Tier */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[var(--status-success-text)]" />
              1. 100% Free Utility (No Paid Tiers)
            </h2>
            <p className="text-[var(--text-muted)]">
              FileShare is entirely free. All core features (instant workspace creation, real-time Markdown notes, one-click formatting, diagrams, password protection, and file sharing up to 500 MB per file) are free to use.
            </p>
            <p className="text-[var(--text-muted)]">
              We do not collect credit cards, debit cards, or subscription fees. Because you are never charged to use FileShare, refunds do not apply to regular usage.
            </p>
          </section>

          {/* Section 2: Cancellation Terms */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              2. No Accounts to Cancel
            </h2>
            <p className="text-[var(--text-muted)]">
              FileShare uses a zero-registration model. There are no member accounts, subscriptions, or recurring commitments to cancel:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[var(--text-muted)]">
              <li>To stop using FileShare, simply close your browser tab.</li>
              <li>You can delete your uploaded files at any time via the file panel.</li>
              <li>You can edit or clear your notes whenever you like.</li>
              <li>Unused workspaces are automatically cleaned up without any fees or action required.</li>
            </ul>
          </section>

          {/* Section 3: Future Paid Features & Commercial Terms */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              3. Future Paid Features &amp; Commercial Terms
            </h2>
            <p className="text-[var(--text-muted)]">
              If FileShare introduces optional paid features, enterprise hosting, or dedicated support in the future:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[var(--text-muted)]">
              <li><strong>Clear Pricing:</strong> All fees, billing terms, and renewal cycles will be stated upfront before payment.</li>
              <li><strong>Refund Window:</strong> For any future paid plans, refund requests submitted within 14 calendar days of initial purchase or billing error will be reviewed and refunded to the original payment method.</li>
              <li><strong>Voluntary Donations:</strong> Voluntary tips or sponsorships to support server costs are non-refundable, except in verified cases of technical error or accidental duplicate charges.</li>
              <li><strong>Enterprise Contracts:</strong> Custom agreements and private deployments are governed by their respective signed Statement of Work (SOW).</li>
            </ul>
          </section>

          {/* Section 4: Contact & Billing Support */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <Mail className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              4. Questions &amp; Support
            </h2>
            <p className="text-[var(--text-muted)]">
              If you have any questions about this policy, voluntary contributions, or future services, please get in touch:
            </p>
            <div className="p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-mono space-y-1 break-all">
              <div>Entity: SHP Technology (FileShare)</div>
              <div>Email: sandeshpatel.sp.93@gmail.com</div>
              <div>Address: 1st floor, SHP Technology, Near Underground Bridge, Madan Mahal Station, Jabalpur, Madhya Pradesh 482001, India</div>
              <div>Response Time: Usually within 24 to 48 business hours</div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
