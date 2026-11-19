import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckCircle2, AlertTriangle, ShieldAlert, Scale, Globe, Building2, HardDrive, Shield } from "lucide-react";
import { Footer } from "@/components/Footer";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";

const appUrl = getAppUrl();

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions for FileShare (SHP Technology). Compliant with the Indian Information Technology Act, 2000 and global digital service regulations.",
  alternates: {
    canonical: `${appUrl}/terms`,
  },
  openGraph: {
    title: "Terms and Conditions | FileShare",
    description: "Terms of Service, Intermediary Guidelines, and Acceptable Use Policy for FileShare.",
    url: `${appUrl}/terms`,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "FileShare: Terms and Conditions & Intermediary Guidelines"
    ),
  },
  twitter: {
    card: "summary_large_image",
    site: "@SandeshPat007",
    creator: "@SandeshPat007",
    title: "Terms and Conditions | FileShare",
    description: "Terms of Service, Intermediary Guidelines, and Acceptable Use Policy for FileShare.",
    images: [`${appUrl}/og-image.png`],
  },
};

export default function TermsPage() {
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
            <Link href="/privacy" className="hover:text-[var(--text-main)] transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-[var(--text-main)] transition-colors">Cookies</Link>
            <Link href="/refund" className="hover:text-[var(--text-main)] transition-colors">Refund Policy</Link>
            <Link href="/contact" className="hover:text-[var(--text-main)] transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="mb-8 border-b border-[var(--border-color)] pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-3">
            <Scale className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Plain-Language Terms &amp; Intermediary Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Terms &amp; Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Last Updated: September 29, 2026 | Effective Date: September 29, 2026
          </p>
        </div>

        <div className="text-sm leading-relaxed space-y-8">
          {/* Section 1: Agreement to Terms */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[var(--status-success-text)]" />
              1. Acceptance of Terms &amp; Entity Information
            </h2>
            <p className="text-[var(--text-muted)]">
              Welcome to FileShare. FileShare is a free, zero-registration notepad and file sharing tool. By opening this site, creating or viewing a workspace, or uploading files, you agree to these Terms and Conditions (&quot;Terms&quot;), our Privacy Policy, and our Cookie Policy. If you do not agree, please do not use the service. You never need an account or email to use FileShare.
            </p>
            <div className="p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-mono space-y-1">
              <div><strong>Operating Entity:</strong> SHP Technology</div>
              <div><strong>Operator:</strong> Sandesh Patel</div>
              <div><strong>Registered Office:</strong> 1st floor, SHP Technology, Near Underground Bridge, Madan Mahal Station, Jabalpur, Madhya Pradesh 482001, India</div>
              <div><strong>Contact Email:</strong> sandeshpatel.sp.93@gmail.com</div>
              <div><strong>Platform URL:</strong> <code className="font-mono text-xs break-all">{appUrl}</code></div>
            </div>
          </section>

          {/* Section 2: Platform Role & Intermediary Status */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <Globe className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              2. Our Role as a Platform (You own what you write and upload; we provide the tool)
            </h2>
            <p className="text-[var(--text-muted)]">
              FileShare operates as an <strong>Intermediary</strong> under Section 2(1)(w) of the <strong>Indian Information Technology Act, 2000</strong> and the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>.
            </p>
            <p className="text-[var(--text-muted)]">
              Under Section 79 safe harbor provisions, here is what that means in plain English:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[var(--text-muted)]">
              <li><strong>You own your content:</strong> You keep full ownership of all notes, markdown documents, and files you create or upload.</li>
              <li><strong>We provide the tool:</strong> We do not review, endorse, edit, or curate your content, and we do not choose who receives your workspace links.</li>
              <li><strong>You are responsible:</strong> Because you choose what to write and upload, you are solely responsible for what you share.</li>
            </ul>
          </section>

          {/* Section 3: Acceptable Use Policy */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold text-[var(--text-main)]">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[var(--status-danger-text)]" />
              3. Clear Rules for Acceptable Use
            </div>
            <p className="text-[var(--text-muted)]">
              To keep FileShare safe and legal for everyone (and in compliance with Rule 3(1)(b) of the IT Intermediary Rules, 2021), you agree <strong>NOT</strong> to upload, paste, store, or share any content that falls into these categories:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1">
                <div className="font-bold text-[var(--status-danger-text)]">Malware &amp; Exploits</div>
                <p className="text-[var(--text-muted)]">
                  Viruses, trojans, ransomware, spyware, keyloggers, or any software designed to hack, harm, or disrupt computers, devices, or networks.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1">
                <div className="font-bold text-[var(--status-danger-text)]">Copyright &amp; Piracy</div>
                <p className="text-[var(--text-muted)]">
                  Files, books, music, movies, or proprietary software that you do not own or have written legal permission to distribute.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1">
                <div className="font-bold text-[var(--status-danger-text)]">Child Harm (CSAM): Zero Tolerance</div>
                <p className="text-[var(--text-muted)]">
                  Any child sexual abuse material, child exploitation, or content endangering minors. We enforce zero tolerance and report violations to law enforcement immediately.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1">
                <div className="font-bold text-[var(--status-danger-text)]">Phishing &amp; Scams</div>
                <p className="text-[var(--text-muted)]">
                  Fake login pages, credential harvesting, financial fraud, impersonating people or brands, or misleading links.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1">
                <div className="font-bold text-[var(--status-danger-text)]">National Security &amp; Violence</div>
                <p className="text-[var(--text-muted)]">
                  Material that threatens the sovereignty, defense, or integrity of India or friendly nations, incites violence, or disrupts public order.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1">
                <div className="font-bold text-[var(--status-danger-text)]">Abuse &amp; Doxxing</div>
                <p className="text-[var(--text-muted)]">
                  Hate speech, defamation, non-consensual intimate imagery, harassment, or publishing someone else&apos;s private personal data without consent.
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              SHP Technology reserves the right to immediately take down violating files, delete workspaces, and block abusive IP addresses upon discovery or notice.
            </p>
          </section>

          {/* Section 4: Notice and Takedown Procedure */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <ShieldAlert className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              4. Notice, Takedown &amp; Grievance Redressal (24–36h SLA)
            </h2>
            <p className="text-[var(--text-muted)]">
              If you discover unlawful material, copyright infringement, or a violation of your legal rights on FileShare, send an email to our Grievance Officer with the exact workspace link and a short description:
            </p>
            <div className="p-3.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-mono space-y-1 break-all">
              <div><strong>Grievance &amp; Abuse Officer:</strong> Sandesh Patel</div>
              <div><strong>Email:</strong> sandeshpatel.sp.93@gmail.com</div>
              <div><strong>Address:</strong> 1st floor, SHP Technology, Near Underground Bridge, Madan Mahal Station, Jabalpur, Madhya Pradesh 482001, India</div>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Under Rule 3(1)(d) of the IT Intermediary Rules, 2021, we act within <strong>24 to 36 hours</strong> to remove or disable access to verified unlawful or infringing content upon receiving a valid report or court/government order.
            </p>
          </section>

          {/* Section 5: Storage Caps & Ephemeral Nature */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <HardDrive className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              5. Storage Limits &amp; Temporary Workspaces
            </h2>
            <p className="text-[var(--text-muted)]">
              FileShare is designed for quick collaboration, live Markdown editing, and fast file sharing, not permanent cloud storage or long-term archiving.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[var(--text-muted)]">
              <li><strong>500 MB per file limit:</strong> You can upload individual files up to 500 MB. Larger files are rejected automatically.</li>
              <li><strong>Temporary workspaces:</strong> Workspaces and uploaded files that remain inactive (typically untouched for 30 to 90 days) may be automatically deleted to free up server resources.</li>
              <li><strong>Keep your own backups:</strong> Please save copies of important notes and files on your own device. We cannot recover deleted or expired workspaces.</li>
            </ul>
          </section>

          {/* Section 6: Disclaimers and Limitation of Liability */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <Shield className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              6. Service Provided As-Is (No Warranties &amp; Limitation of Liability)
            </h2>
            <p className="text-[var(--text-muted)]">
              FileShare is provided completely free of charge on an <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong> basis, without warranties of any kind.
            </p>
            <div className="p-4 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs space-y-2 text-[var(--text-muted)] leading-relaxed">
              <p>
                <strong>No uptime guarantees:</strong> While we aim for high reliability, we do not promise that FileShare will always be online, uninterrupted, bug-free, or secure against unauthorized attacks.
              </p>
              <p>
                <strong>Limitation of liability:</strong> To the maximum extent allowed by law, SHP Technology, Sandesh Patel, and contributors are not liable for any lost data, lost profits, business interruption, or damages resulting from using or being unable to use FileShare.
              </p>
            </div>
          </section>

          {/* Section 7: User Responsibility */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">
              7. User Responsibility
            </h2>
            <p className="text-[var(--text-muted)]">
              You are entirely responsible for the text you write, files you upload, and how you share your workspace links and optional passwords.
            </p>
            <p className="text-[var(--text-muted)]">
              If someone brings a legal claim, dispute, or demand against SHP Technology or Sandesh Patel because of content you uploaded, laws you broke, or your misuse of FileShare, you agree to take full responsibility and cover any resulting damages, losses, and reasonable legal expenses.
            </p>
          </section>

          {/* Section 8: Dispute Resolution & Jurisdiction */}
          <section className="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-xl border border-[var(--border-color)] space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
              <Building2 className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
              8. Governing Law &amp; Jurisdiction
            </h2>
            <p className="text-[var(--text-muted)]">
              These Terms and your use of FileShare are governed by the laws of India.
            </p>
            <p className="text-[var(--text-muted)]">
              Any dispute or legal claim arising from FileShare or these Terms shall be handled exclusively by the competent courts in <strong>Jabalpur, Madhya Pradesh, India</strong>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
