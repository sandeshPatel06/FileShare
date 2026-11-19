"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Shield,
  Zap,
  Lock,
  ArrowRight,
  QrCode,
  FolderUp,
  Wand2,
  Globe,
  Loader2,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Clock,
  Pin,
  X,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ARTICLES } from "@/lib/articles";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";
import { useRecentSpaces } from "@/hooks/useRecentSpaces";
import { generateSlug } from "@/lib/slugGenerator";

interface LandingPageProps {
  defaultSlug: string;
}

export function LandingPage({ defaultSlug }: LandingPageProps) {
  const router = useRouter();
  const [customSlug, setCustomSlug] = useState("");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const { recentSpaces, removeRecentSpace, togglePin, clearRecentSpaces } = useRecentSpaces();

  const handleCreateNewSpace = async (prefix?: string) => {
    const loadingKey = prefix || "new";
    setActiveSlug(loadingKey);
    try {
      const url = prefix
        ? `/api/pages/create?new=true&prefix=${encodeURIComponent(prefix)}`
        : "/api/pages/create?new=true";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.slug) {
          router.push(`/s/${data.slug}`);
          return;
        }
      }
    } catch {
      // Fallback to client-generated slug if offline / API error
    }
    const fallback = generateSlug(prefix);
    router.push(`/s/${fallback}`);
  };

  const handleCustomSlugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSlug.trim();
    if (!trimmed) {
      // If user submits empty input, create a guaranteed fresh workspace
      void handleCreateNewSpace();
      return;
    }
    const target = trimmed.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    setActiveSlug(target);
    router.push(`/s/${target}`);
  };

  const featuredWorkspaces = [
    { prefix: "general", title: "General Workspace", icon: "💬" },
    { prefix: "notes", title: "Live Markdown Notes", icon: "📝" },
    { prefix: "code", title: "Code Snippet Vault", icon: "⚡" },
    { prefix: "docs", title: "Sandbox & Docs", icon: "🚀" },
  ];

  const featuredArticles = ARTICLES.slice(0, 4);

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 overflow-x-clip">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2" aria-label="FileShare Home">
              <div className="w-7 h-7 rounded-md bg-[var(--accent-primary)] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-base tracking-tight text-[var(--text-main)]">
                FileShare
              </span>
            </Link>

            {/* Navigation links */}
            <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-5 text-xs font-medium text-[var(--text-muted)]">
              <Link href="/resources" className="py-1 hover:text-[var(--text-main)] transition-colors">Resources</Link>
              <Link href="/guide" className="py-1 hover:text-[var(--text-main)] transition-colors">User Guide</Link>
              <Link href="/about" className="py-1 hover:text-[var(--text-main)] transition-colors">About</Link>
              <Link href="/contact" className="py-1 hover:text-[var(--text-main)] transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-6 pb-8 sm:pt-10 sm:pb-12 md:pt-12 md:pb-14 border-b border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            {/* Value Proposition Badges */}
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-3 sm:mb-4 max-w-full">
              <span className="text-[var(--status-success-text)] flex items-center gap-1.5 font-medium whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> No Sign-Up Needed
              </span>
              <span className="hidden sm:inline text-[var(--border-color)] select-none" aria-hidden="true">•</span>
              <span className="text-[var(--accent-primary)] flex items-center gap-1.5 font-medium whitespace-nowrap">
                <Zap className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Instant Live Sync
              </span>
              <span className="hidden sm:inline text-[var(--border-color)] select-none" aria-hidden="true">•</span>
              <span className="text-[var(--accent-sky)] flex items-center gap-1.5 font-medium whitespace-nowrap">
                <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> 500MB Free Vault
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] mb-3 sm:mb-4 leading-tight sm:leading-tight">
              Free Online Notepad &amp; Instant File Sharing
            </h1>

            <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-[var(--text-muted)] mb-4 sm:mb-5 leading-normal sm:leading-relaxed">
              Write live Markdown notes, sketch diagrams, and share files up to 500MB with anyone through a single link. No account, forms, or passwords required.
            </p>

            {/* Workspace Launcher Action Form */}
            <div className="max-w-md mx-auto bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-5 shadow-sm">
              <form onSubmit={handleCustomSlugSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1 min-w-0">
                  <label htmlFor="landing-custom-slug" className="sr-only">
                    Workspace name or link
                  </label>
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] select-none">
                    /s/
                  </span>
                  <input
                    id="landing-custom-slug"
                    name="slug"
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder={defaultSlug}
                    aria-label="Enter a custom workspace name, or leave empty for a random one"
                    className="w-full pl-8 pr-3 py-2 min-h-[42px] sm:min-h-[44px] text-xs sm:text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] font-mono transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={Boolean(activeSlug)}
                  aria-label="Open or create workspace"
                  className="!px-4 sm:!px-5 !py-2 min-h-[42px] sm:min-h-[44px] !rounded-lg !font-semibold text-xs sm:text-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shrink-0"
                  icon={activeSlug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : undefined}
                  iconRight={!activeSlug ? <ArrowRight className="w-3.5 h-3.5" /> : undefined}
                >
                  {activeSlug ? "Opening..." : customSlug.trim() ? "Open Space" : "Random Space"}
                </Button>
              </form>

              <div className="mt-2.5 pt-2.5 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {recentSpaces.length > 0 && (
                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      onClick={() => setShowRecentModal(true)}
                      className="!px-2.5 !py-1 !rounded-md inline-flex items-center gap-1.5 text-[var(--text-main)] hover:bg-[var(--hover-overlay)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 min-h-[32px] sm:min-h-[36px]"
                      icon={<Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
                    >
                      Recent ({recentSpaces.length})
                    </Button>
                  )}
                </div>

                <span className="text-[11px] sm:text-xs text-[var(--text-muted)]">500MB limit per file</span>
              </div>

              {/* Form Consent Notice (GDPR & DPDP Act 2023) */}
              <p className="mt-2.5 text-[11px] sm:text-xs text-[var(--text-muted)] text-center leading-normal">
                By opening or joining a workspace, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-[var(--text-main)]">
                  Terms
                </Link>
                ,{" "}
                <Link href="/privacy" className="underline hover:text-[var(--text-main)]">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/cookies" className="underline hover:text-[var(--text-main)]">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            {/* Modal Dialog for Recent Workspaces */}
            <Modal
              open={showRecentModal}
              onClose={() => setShowRecentModal(false)}
              title="Recent Spaces"
              maxWidth="max-w-sm"
              footer={
                <div className="flex items-center justify-between w-full">
                  <Button
                    size="xs"
                    variant="danger"
                    onClick={() => {
                      clearRecentSpaces();
                      setShowRecentModal(false);
                    }}
                    icon={<X className="w-3.5 h-3.5" />}
                  >
                    Clear History
                  </Button>
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => setShowRecentModal(false)}
                  >
                    Close
                  </Button>
                </div>
              }
            >
              <div className="space-y-1.5 max-h-[55vh] overflow-y-auto">
                {recentSpaces.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-[var(--text-muted)]">
                    <Clock className="w-8 h-8 opacity-30" />
                    <p className="text-xs text-center">No recent spaces yet.<br />Open a workspace to see it here.</p>
                  </div>
                ) : (
                  recentSpaces.map((item) => {
                    const ago = (() => {
                      const diff = Date.now() - item.lastVisited;
                      const mins = Math.floor(diff / 60000);
                      if (mins < 1) return "just now";
                      if (mins < 60) return `${mins}m ago`;
                      const hrs = Math.floor(mins / 60);
                      if (hrs < 24) return `${hrs}h ago`;
                      return `${Math.floor(hrs / 24)}d ago`;
                    })();
                    return (
                      <div
                        key={item.slug}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/60 transition-colors group"
                      >
                        {/* Pin button */}
                        <button
                          type="button"
                          onClick={() => togglePin(item.slug)}
                          title={item.pinned ? "Unpin" : "Pin to top"}
                          aria-label={item.pinned ? "Unpin workspace" : "Pin workspace to top"}
                          className={`shrink-0 p-1 rounded transition-colors cursor-pointer ${
                            item.pinned
                              ? "text-[var(--accent-primary)]"
                              : "text-[var(--text-muted)] opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Pin className={`w-3 h-3 ${item.pinned ? "fill-current" : ""}`} />
                        </button>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-semibold text-xs text-[var(--text-main)] truncate">
                              /s/{item.slug}
                            </span>
                            {item.pinned && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-medium shrink-0">
                                Pinned
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{ago}</div>
                        </div>

                        {/* Open link */}
                        <Link
                          href={`/s/${item.slug}`}
                          onClick={() => setShowRecentModal(false)}
                          title={`Open /s/${item.slug}`}
                          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-primary)] hover:underline py-1 px-1.5"
                        >
                          Open
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeRecentSpace(item.slug)}
                          title="Remove from history"
                          aria-label="Remove from history"
                          className="shrink-0 p-1 rounded text-[var(--text-muted)] hover:text-[var(--status-danger-text)] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </Modal>

            {/* Quick Link to Knowledge Base */}
            <div className="mt-3 sm:mt-4 text-xs text-[var(--text-muted)] flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
              <span>New to FileShare?</span>
              <Link href="/guide" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 font-medium min-h-[32px] sm:min-h-[36px]">
                Read the Complete User Guide <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3-Step Educational Workflow Overview */}
        <section className="py-8 sm:py-12 md:py-14 max-w-6xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 sm:mb-3">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Start working together in seconds with three simple steps.
            </p>
          </header>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 list-none p-0 m-0">
            <li>
              <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 md:p-6 relative flex flex-col">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] flex items-center justify-center font-mono font-bold text-xs sm:text-sm mb-3 sm:mb-4" aria-hidden="true">
                  01
                </span>
                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2 text-[var(--text-main)]">1. Choose a Name</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Type any custom link like <code className="px-1.5 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)] font-mono text-[var(--accent-primary)]">/s/notes</code> or click Random Space. Your workspace opens right away.
                </p>
              </article>
            </li>

            <li>
              <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 md:p-6 relative flex flex-col">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] flex items-center justify-center font-mono font-bold text-xs sm:text-sm mb-3 sm:mb-4" aria-hidden="true">
                  02
                </span>
                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2 text-[var(--text-main)]">2. Write &amp; Upload</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Take notes in Markdown, sketch diagrams, and drop files up to 500MB. Edits update live across all open screens.
                </p>
              </article>
            </li>

            <li>
              <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 md:p-6 relative flex flex-col">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] flex items-center justify-center font-mono font-bold text-xs sm:text-sm mb-3 sm:mb-4" aria-hidden="true">
                  03
                </span>
                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2 text-[var(--text-main)]">3. Share &amp; Lock</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Share the link or scan the QR code from your phone. You can also add an optional password to keep your space private.
                </p>
              </article>
            </li>
          </ol>
        </section>

        {/* Feature Grid */}
        <section className="py-8 sm:py-12 md:py-14 bg-[var(--bg-surface)] border-t border-b border-[var(--border-color)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <header className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 sm:mb-3">
                Everything You Need
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                A fast, distraction-free workspace built for quick notes and easy file sharing.
              </p>
            </header>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 list-none p-0 m-0">
              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Zap className="w-5 h-5 text-[var(--accent-primary)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">Instant Live Sync</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Notes and uploads update instantly on every screen without needing to refresh the page.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <FolderUp className="w-5 h-5 text-[var(--accent-primary)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">500MB File Sharing</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Upload documents, images, videos, zip archives, and code files up to 500MB each.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Wand2 className="w-5 h-5 text-[var(--accent-primary)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">One-Click Formatter</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Clean up spacing, headers, and task lists in one click without altering your code blocks.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Lock className="w-5 h-5 text-[var(--accent-primary)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">Password Lock</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Protect confidential notes and files with an optional password only you and your team know.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <QrCode className="w-5 h-5 text-[var(--accent-primary)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">Mobile QR Handoff</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Scan the built-in QR code with your phone camera to take your workspace anywhere instantly.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Globe className="w-5 h-5 text-[var(--accent-primary)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">No Sign-Up Needed</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    No email, no forms, and no setup. Open any link in your browser and start working right away.
                  </p>
                </article>
              </li>
            </ul>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="py-8 sm:py-12 md:py-14 max-w-5xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 sm:mb-3">
              How FileShare Compares
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              See how FileShare compares to traditional cloud drives and paste tools.
            </p>
          </header>

          <div className="overflow-x-auto max-w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
              <caption className="sr-only">Feature comparison: FileShare vs Cloud Drives vs Standard Pastebin</caption>
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)]">
                  <th scope="col" className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--text-main)]">Feature</th>
                  <th scope="col" className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--accent-primary)]">FileShare</th>
                  <th scope="col" className="p-2.5 sm:p-3.5 md:p-4 font-medium text-[var(--text-muted)]">Cloud Drives (Google Drive)</th>
                  <th scope="col" className="p-2.5 sm:p-3.5 md:p-4 font-medium text-[var(--text-muted)]">Standard Pastebin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-xs text-[var(--text-muted)]">
                <tr>
                  <th scope="row" className="p-2.5 sm:p-3.5 md:p-4 font-medium text-[var(--text-main)]">Sign-Up &amp; Login</th>
                  <td className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--status-success-text)]">None (Instant access)</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4">Mandatory Account</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4">Optional / Limited</td>
                </tr>
                <tr>
                  <th scope="row" className="p-2.5 sm:p-3.5 md:p-4 font-medium text-[var(--text-main)]">Live Typing Collaboration</th>
                  <td className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--status-success-text)]">Instant live updates</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4">Delayed saving</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4 text-[var(--status-danger-text)]">None (Static pages)</td>
                </tr>
                <tr>
                  <th scope="row" className="p-2.5 sm:p-3.5 md:p-4 font-medium text-[var(--text-main)]">File Attachment Limit</th>
                  <td className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--status-success-text)]">500MB Free per file</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4">Uses account storage</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4 text-[var(--status-danger-text)]">None (Text only)</td>
                </tr>
                <tr>
                  <th scope="row" className="p-2.5 sm:p-3.5 md:p-4 font-medium text-[var(--text-main)]">Markdown &amp; Diagrams</th>
                  <td className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--status-success-text)]">Built-in live preview</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4">Needs add-ons</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4 text-[var(--status-danger-text)]">Plain text only</td>
                </tr>
                <tr>
                  <th scope="row" className="p-2.5 sm:p-3.5 md:p-4 font-medium text-[var(--text-main)]">Mobile Phone Handoff</th>
                  <td className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--status-success-text)]">Instant QR code scan</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4">Requires mobile app</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4">Manual copy-pasting</td>
                </tr>
                <tr>
                  <th scope="row" className="p-2.5 sm:p-3.5 md:p-4 font-medium text-[var(--text-main)]">Password Protection</th>
                  <td className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--status-success-text)]">One-click password lock</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4">Complex permissions</td>
                  <td className="p-2.5 sm:p-3.5 md:p-4">Usually public</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Featured Educational Resources & Guides Section */}
        <section className="py-8 sm:py-12 md:py-14 max-w-6xl mx-auto px-4 sm:px-6">
          <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-2.5 sm:mb-3">
                <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                <span>Knowledge Base</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)]">
                Helpful Guides &amp; Tips
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Read quick tutorials on Markdown tricks, shortcuts, and productive workflows.
              </p>
            </div>
            <Link
              href="/resources"
              className="text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 min-h-[36px]"
            >
              View All 8 Articles <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {featuredArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 md:p-6 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono mb-2">
                    <span className="text-[var(--accent-primary)] font-medium">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors mb-2">
                    <Link href={`/resources/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3 mb-4">
                    {article.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-mono">{article.date}</span>
                  <Link
                    href={`/resources/${article.slug}`}
                    className="font-semibold text-[var(--accent-primary)] inline-flex items-center gap-1 group-hover:gap-1.5 transition-all py-1"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Featured Public Workspaces */}
        <section className="py-6 sm:py-8 bg-[var(--bg-surface)] border-t border-b border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center mb-3 sm:mb-4">
              Try a Starter Space
            </h3>
            <nav aria-label="Starter public workspaces" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {featuredWorkspaces.map((item) => {
                const isItemActive = activeSlug === item.prefix;
                return (
                  <Button
                    key={item.prefix}
                    size="md"
                    disabled={Boolean(activeSlug)}
                    onClick={() => handleCreateNewSpace(item.prefix)}
                    className="!justify-start !items-center gap-2.5 !p-2.5 sm:!p-3 !rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] !text-left !font-semibold disabled:opacity-50 min-h-[44px] sm:min-h-[48px]"
                    icon={<span className="text-lg" aria-hidden="true">{item.icon}</span>}
                    iconRight={
                      isItemActive ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-primary)]" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      )
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs truncate text-[var(--text-main)]">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">New /s/{item.prefix}-... space</div>
                    </div>
                  </Button>
                );
              })}
            </nav>
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) */}
        <section className="py-8 sm:py-12 md:py-14 max-w-4xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-2.5 sm:mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 sm:mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Simple answers to common questions about FileShare.
            </p>
          </header>

          <dl className="space-y-3 sm:space-y-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-1.5 sm:mb-2">
                Is FileShare free to use, and do I need to register?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Yes, FileShare is 100% free with zero registration required. There are no forms to fill out, no email confirmations, and no subscriptions. You can start typing or uploading immediately.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-1.5 sm:mb-2">
                What is the file size upload limit?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                You can upload files up to 500 MB each. FileShare supports multi-file uploads including videos, zip archives, images, PDFs, and code files.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-1.5 sm:mb-2">
                How does real-time synchronization work?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                FileShare uses instant live sync so changes appear across all connected browsers in milliseconds. When anyone edits notes or uploads a file, it shows up automatically without refreshing.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-1.5 sm:mb-2">
                Can I protect my workspace with a password?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Yes. Click Lock Space in the top bar to set a password. Anyone visiting the link will need to enter your password to view or edit notes and files.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-1.5 sm:mb-2">
                How do I open my workspace on mobile devices?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Click the QR code button in the top bar. Scan it with your phone&apos;s camera to instantly open and edit your workspace on mobile.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-1.5 sm:mb-2">
                How is FileShare different from Pastebin, Google Drive, or WeTransfer?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Unlike Pastebin, FileShare syncs your typing live, renders rich Markdown diagrams, and supports 500MB file uploads. Unlike Google Drive or WeTransfer, there is no account to create, no email addresses needed, and workspaces open instantly with a link.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-1.5 sm:mb-2">
                Can I write Markdown and render Mermaid diagrams?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Yes. FileShare supports GitHub Flavored Markdown (headings, task lists, tables, syntax-highlighted code blocks) and renders Mermaid flowcharts and diagrams automatically in real time.
              </dd>
            </div>
          </dl>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--header-bg)] border-t border-[var(--border-color)] py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-3 sm:gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              <span>FileShare: Real-Time Notes &amp; File Vault</span>
            </div>
            <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <Link href="/about" className="py-1 hover:text-[var(--text-main)] transition-colors">About</Link>
              <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
              <Link href="/guide" className="py-1 hover:text-[var(--text-main)] transition-colors">User Guide</Link>
              <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
              <Link href="/resources" className="py-1 hover:text-[var(--text-main)] transition-colors">Resources</Link>
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
    </div>
  );
}
