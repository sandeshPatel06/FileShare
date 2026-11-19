import Link from "next/link";
import { Shield } from "lucide-react";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";

export function Footer() {
  return (
    <footer className="bg-[var(--header-bg)] border-t border-[var(--border-color)] py-6 sm:py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-3 sm:gap-4 text-xs text-[var(--text-muted)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-[var(--accent-text)] shrink-0" aria-hidden="true" />
            <span>FileShare: Real-Time Notes &amp; File Vault</span>
          </div>
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link href="/" className="py-1 hover:text-[var(--text-main)] transition-colors">Home</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <Link href="/projects" className="py-1 hover:text-[var(--text-main)] transition-colors">Projects</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <Link href="/guide" className="py-1 hover:text-[var(--text-main)] transition-colors">User Guide</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <Link href="/resources" className="py-1 hover:text-[var(--text-main)] transition-colors">Resources</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <Link href="/about" className="py-1 hover:text-[var(--text-main)] transition-colors">About</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <Link href="/contact" className="py-1 hover:text-[var(--text-main)] transition-colors">Contact</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <Link href="/privacy" className="py-1 hover:text-[var(--text-main)] transition-colors">Privacy Policy</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <Link href="/terms" className="py-1 hover:text-[var(--text-main)] transition-colors">Terms &amp; Conditions</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <Link href="/cookies" className="py-1 hover:text-[var(--text-main)] transition-colors">Cookie Policy</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <Link href="/refund" className="py-1 hover:text-[var(--text-main)] transition-colors">Refund Policy</Link>
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <CookieSettingsButton />
            <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
            <a
              href="https://github.com/sandeshPatel06/file-share"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 py-1 hover:text-[var(--text-main)] transition-colors"
              aria-label="FileShare on GitHub (opens in new tab)"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </nav>
        </div>

        <div className="pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-center sm:text-left text-[var(--text-muted)] break-words">
          <p>Operated by <strong>SHP Technology</strong> • Founder: Sandesh Patel • Jabalpur, Madhya Pradesh 482001, India</p>
          <p>GDPR &amp; India DPDP Act 2023 Compliant • Free Web Utility</p>
        </div>
      </div>
    </footer>
  );
}
