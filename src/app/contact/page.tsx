"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Mail,
  ShieldAlert,
  Clock,
  Send,
  MessageSquare,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  User,
  ExternalLink,
} from "lucide-react";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("support");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    // Create mailto fallback link for instant dispatch
    setTimeout(() => {
      const subject = encodeURIComponent(`[${category.toUpperCase()}] Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCategory: ${category}\n\nMessage:\n${message}\n\n[Consent given under GDPR / India DPDP Act 2023]`
      );
      window.location.href = `mailto:sandeshpatel.sp.93@gmail.com?subject=${subject}&body=${body}`;
      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

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
            <Link href="/about" className="hover:text-[var(--text-main)] transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-[var(--text-main)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--text-main)] transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-[var(--text-main)] transition-colors">Cookies</Link>
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
            <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Contact &amp; Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-2xl">
            Have questions, feedback, or need assistance? Reach out directly or send us a message below.
          </p>
        </div>

        {/* Direct Contact Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-3">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">Email Support</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                Questions, bug reports, and general help with FileShare.
              </p>
            </div>
            <a
              href="mailto:sandeshpatel.sp.93@gmail.com"
              className="text-xs font-mono text-[var(--accent-primary)] hover:underline break-all"
            >
              sandeshpatel.sp.93@gmail.com
            </a>
          </div>

          <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-3">
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">GitHub</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                Open source repo. Report issues, suggest features, or view code.
              </p>
            </div>
            <a
              href="https://github.com/sandeshPatel06/file-share"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center mb-3">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">Founder &amp; Lead</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                Sandesh Patel · SHP Technology. Direct updates and chat on X.
              </p>
            </div>
            <a
              href="https://x.com/SandeshPat007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1"
            >
              <span>@SandeshPat007</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-[var(--status-danger-bg)] text-[var(--status-danger-text)] flex items-center justify-center mb-3">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[var(--text-main)] mb-1">Abuse &amp; DMCA</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                Report copyright infringement, malware, or policy violations.
              </p>
            </div>
            <a
              href="mailto:sandeshpatel.sp.93@gmail.com"
              className="text-xs font-mono text-[var(--status-danger-text)] hover:underline break-all"
            >
              sandeshpatel.sp.93@gmail.com
            </a>
          </div>
        </div>

        {/* Response Time SLA */}
        <div className="mb-10 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <Clock className="w-4 h-4 shrink-0 text-[var(--accent-primary)]" />
          <p>
            <strong>Response Time:</strong> Urgent security and abuse notices are triaged within 12–24 hours; general inquiries within 1–2 business days (Mon–Fri, 09:00–18:00 IST).
          </p>
        </div>

        {/* Business & Statutory Details Box */}
        <section className="mb-10 p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 shrink-0 text-[var(--accent-primary)]" />
            <h2 className="text-base font-bold text-[var(--text-main)]">
              Business &amp; Statutory Details
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
              <div><span className="text-[var(--text-subtle)] dark:text-[var(--text-muted)]">Operating Entity:</span> <strong>SHP Technology</strong></div>
              <div><span className="text-[var(--text-subtle)] dark:text-[var(--text-muted)]">Founder &amp; Developer:</span> Sandesh Patel</div>
              <div><span className="text-[var(--text-subtle)] dark:text-[var(--text-muted)]">Registered Office:</span> 1st floor, SHP Technology, Near Underground Bridge, Madan Mahal Station, Jabalpur, Madhya Pradesh 482001, India</div>
              <div><span className="text-[var(--text-subtle)] dark:text-[var(--text-muted)]">GST Status:</span> Exempt / Unregistered under threshold (Sec 22, CGST Act)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1.5">
              <div><span className="text-[var(--text-subtle)] dark:text-[var(--text-muted)]">Grievance Officer:</span> Sandesh Patel</div>
              <div><span className="text-[var(--text-subtle)] dark:text-[var(--text-muted)]">Statutory Email:</span> <a href="mailto:sandeshpatel.sp.93@gmail.com" className="text-[var(--accent-primary)] hover:underline break-all">sandeshpatel.sp.93@gmail.com</a></div>
              <div><span className="text-[var(--text-subtle)] dark:text-[var(--text-muted)]">Abuse / DMCA:</span> <a href="mailto:sandeshpatel.sp.93@gmail.com" className="text-[var(--accent-primary)] hover:underline break-all">sandeshpatel.sp.93@gmail.com</a></div>
              <div><span className="text-[var(--text-subtle)] dark:text-[var(--text-muted)]">Support:</span> <a href="mailto:sandeshpatel.sp.93@gmail.com" className="text-[var(--accent-primary)] hover:underline break-all">sandeshpatel.sp.93@gmail.com</a></div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">
              Send a Message
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Fill out the form below. When submitted, it opens your email client with your message ready to send.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-[var(--status-success-bg)] border border-[var(--status-success-border)] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[var(--status-success-text)] mx-auto" />
              <h3 className="text-sm font-bold text-[var(--text-main)]">Message Prepared</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                Your email app should now open with your message. If it didn&apos;t, send your message directly to{" "}
                <a href="mailto:sandeshpatel.sp.93@gmail.com" className="font-mono break-all text-[var(--accent-primary)] underline hover:opacity-80">
                  sandeshpatel.sp.93@gmail.com
                </a>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-[var(--text-main)] mb-1 font-mono">
                    Full Name <span className="text-[var(--status-danger-text)]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    aria-required="true"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] dark:placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-[var(--text-main)] mb-1 font-mono">
                    Email Address <span className="text-[var(--status-danger-text)]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-required="true"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] dark:placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-category" className="block text-xs font-bold text-[var(--text-main)] mb-1 font-mono">
                  Topic <span className="text-[var(--status-danger-text)]" aria-hidden="true">*</span>
                </label>
                <select
                  id="contact-category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  <option value="support">General Support</option>
                  <option value="grievance">Data Privacy / DPDP Act</option>
                  <option value="abuse">Abuse &amp; DMCA Takedown</option>
                  <option value="security">Security Vulnerability</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-[var(--text-main)] mb-1 font-mono">
                  Message <span className="text-[var(--status-danger-text)]" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help? Include workspace URL (/s/[slug]) if relevant..."
                  aria-required="true"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] dark:placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              {/* Form Consent Checkbox */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <label htmlFor="contact-consent-checkbox" className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    id="contact-consent-checkbox"
                    name="consent"
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-required="true"
                    className="mt-0.5 w-4 h-4 rounded border-[var(--border-color)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] cursor-pointer"
                  />
                  <span className="text-xs text-[var(--text-muted)] leading-relaxed">
                    I consent to SHP Technology processing my name and email to respond to this request, under the India DPDP Act 2023 and EU GDPR. See our{" "}
                    <Link href="/privacy" className="text-[var(--accent-primary)] underline hover:text-[var(--text-main)]">
                      Privacy Policy
                    </Link>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting || !consent}
                className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 cursor-pointer"
                aria-label="Send message"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Preparing Email...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 bg-[var(--header-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© 2026 FileShare (SHP Technology). All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="hover:text-[var(--text-main)] transition-colors">Home</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/about" className="hover:text-[var(--text-main)] transition-colors">About</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-[var(--text-main)] transition-colors">Privacy Policy</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/terms" className="hover:text-[var(--text-main)] transition-colors">Terms &amp; Conditions</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/cookies" className="hover:text-[var(--text-main)] transition-colors">Cookie Policy</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/refund" className="hover:text-[var(--text-main)] transition-colors">Refund Policy</Link>
            <span className="hidden sm:inline">•</span>
            <CookieSettingsButton />
          </div>
        </div>
      </footer>
    </div>
  );
}
