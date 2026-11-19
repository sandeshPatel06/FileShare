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
  Plus,
  QrCode,
  FolderUp,
  Wand2,
  Globe,
  Compass,
  Loader2,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Clock,
  Pin,
  X,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { ARTICLES } from "@/lib/articles";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";
import { useRecentSpaces } from "@/hooks/useRecentSpaces";

interface LandingPageProps {
  defaultSlug: string;
}

export function LandingPage({ defaultSlug }: LandingPageProps) {
  const router = useRouter();
  const [customSlug, setCustomSlug] = useState("");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const { recentSpaces, removeRecentSpace, togglePin, clearRecentSpaces } = useRecentSpaces();

  const handleCreateSpace = (slugToUse?: string) => {
    const target = (slugToUse || customSlug.trim() || defaultSlug)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-");
    setActiveSlug(target);
    router.push(`/s/${target}`);
  };

  const handleCustomSlugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateSpace();
  };

  const featuredWorkspaces = [
    { slug: "general", title: "General Workspace", icon: "💬" },
    { slug: "notes", title: "Live Markdown Notes", icon: "📝" },
    { slug: "code", title: "Code Snippet Vault", icon: "⚡" },
    { slug: "welcome", title: "Sandbox & Docs", icon: "🚀" },
  ];

  const featuredArticles = ARTICLES.slice(0, 4);

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
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

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Button
              onClick={() => handleCreateSpace()}
              disabled={Boolean(activeSlug)}
              className="!px-3.5 !py-1.5 !rounded-md text-xs !font-semibold bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white min-h-[36px]"
              icon={activeSlug && !customSlug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            >
              {activeSlug && !customSlug ? "Opening..." : "New Space"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            {/* Value Proposition Badges */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-6">
              <span className="text-[var(--status-success-text)] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Zero Registration
              </span>
              <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
              <span className="text-[var(--accent-primary)] flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Real-Time SSE Sync
              </span>
              <span className="text-[var(--border-color)] select-none" aria-hidden="true">•</span>
              <span className="text-[var(--accent-sky)] flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> 500MB File Vault
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-main)] mb-6 leading-tight">
              Free Online Notepad Without Login &amp; Real-Time File Sharing
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[var(--text-muted)] mb-8 leading-relaxed">
              Create an instant workspace to collaborate on live Markdown notes, share text through a live URL, render Mermaid diagrams, and share files up to 500MB in real time. No registration, email verification, or account required.
            </p>

            {/* Workspace Launcher Action Form */}
            <div className="max-w-md mx-auto bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 shadow-sm">
              <form onSubmit={handleCustomSlugSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <label htmlFor="landing-custom-slug" className="sr-only">
                    Workspace URL Slug
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
                    aria-label="Enter custom workspace name"
                    className="w-full pl-8 pr-3 py-2.5 min-h-[44px] text-xs sm:text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] font-mono transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={Boolean(activeSlug)}
                  aria-label="Open or create instant workspace"
                  className="!px-5 !py-2.5 min-h-[44px] !rounded-lg !font-semibold text-xs sm:text-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shrink-0"
                  icon={activeSlug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : undefined}
                  iconRight={!activeSlug ? <ArrowRight className="w-3.5 h-3.5" /> : undefined}
                >
                  {activeSlug ? "Opening..." : "Open Space"}
                </Button>
              </form>

              <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  disabled={Boolean(activeSlug)}
                  onClick={() => handleCreateSpace(defaultSlug)}
                  className="!px-2 !py-1 !rounded-md inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-50 min-h-[36px]"
                  icon={activeSlug === defaultSlug ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-primary)]" /> : <Compass className="w-3.5 h-3.5" />}
                >
                  Random Space (/s/{defaultSlug})
                </Button>
                <span>500MB Limit per file</span>
              </div>

              {/* Recent Spaces Quick Access (Local & Privacy-Safe) */}
              {recentSpaces.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-[var(--border-color)] text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                      Recent Spaces
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSpaces}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--status-danger-text)] transition-colors cursor-pointer min-h-[36px] px-2 flex items-center rounded-md"
                      title="Clear recent workspaces"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {recentSpaces.map((item) => (
                      <div
                        key={item.slug}
                        className="group inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--border-color)]/50 border border-[var(--border-color)] transition-colors text-xs font-mono min-h-[36px]"
                      >
                        <Link
                          href={`/s/${item.slug}`}
                          className="font-bold text-[var(--text-main)] hover:text-[var(--accent-primary)] truncate max-w-[120px] transition-colors py-1"
                          title={`Open workspace /s/${item.slug}`}
                        >
                          {item.slug}
                        </Link>
                        <button
                          type="button"
                          onClick={() => togglePin(item.slug)}
                          title={item.pinned ? "Unpin workspace" : "Pin workspace"}
                          aria-label={item.pinned ? "Unpin workspace" : "Pin workspace"}
                          className={`min-h-[32px] min-w-[32px] p-1 rounded-md flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer ${
                            item.pinned ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                          }`}
                        >
                          <Pin className={`w-3 h-3 ${item.pinned ? "fill-current" : ""}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRecentSpace(item.slug)}
                          title="Remove from history"
                          aria-label="Remove from history"
                          className="min-h-[32px] min-w-[32px] p-1 rounded-md flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--status-danger-text)] transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Consent Notice (GDPR & DPDP Act 2023) */}
              <p className="mt-3 text-xs text-[var(--text-muted)] text-center leading-normal">
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

            {/* Quick Link to Knowledge Base */}
            <div className="mt-6 text-xs text-[var(--text-muted)] flex flex-wrap items-center justify-center gap-3 text-center">
              <span>New to FileShare?</span>
              <Link href="/guide" className="text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 font-medium min-h-[36px]">
                Read the Complete User Guide <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3-Step Educational Workflow Overview */}
        <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-3">
              How Instant Workspaces Work
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Direct browser-to-browser workspace collaboration without accounts, email verifications, or installation steps.
            </p>
          </header>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
            <li>
              <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 relative flex flex-col">
                <span className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] flex items-center justify-center font-mono font-bold text-sm mb-4" aria-hidden="true">
                  01
                </span>
                <h3 className="text-base font-bold mb-2 text-[var(--text-main)]">Pick Any Workspace URL</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Type any custom name like <code className="px-1.5 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)] font-mono text-[var(--accent-primary)]">/s/sprint-notes</code> or generate a random link. The space is created automatically upon navigation.
                </p>
              </article>
            </li>

            <li>
              <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 relative flex flex-col">
                <span className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] flex items-center justify-center font-mono font-bold text-sm mb-4" aria-hidden="true">
                  02
                </span>
                <h3 className="text-base font-bold mb-2 text-[var(--text-main)]">Type &amp; Upload Live</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Write Markdown notes, render Mermaid diagrams, and drag-and-drop files up to 500MB. All participants sync live over Server-Sent Events.
                </p>
              </article>
            </li>

            <li>
              <article className="h-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 relative flex flex-col">
                <span className="w-9 h-9 rounded-lg bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)] flex items-center justify-center font-mono font-bold text-sm mb-4" aria-hidden="true">
                  03
                </span>
                <h3 className="text-base font-bold mb-2 text-[var(--text-main)]">Share or Protect</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Share via direct URL or dynamic QR code. To restrict access, set a bcrypt password gate to secure your notes and attachments.
                </p>
              </article>
            </li>
          </ol>
        </section>

        {/* Feature Grid */}
        <section className="py-12 sm:py-16 bg-[var(--bg-surface)] border-t border-b border-[var(--border-color)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <header className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-3">
                Workspace Architecture &amp; Features
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                A lightweight stack combining real-time Markdown sync with 500MB streaming uploads.
              </p>
            </header>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0">
              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Zap className="w-5 h-5 text-[var(--accent-primary)] mb-2.5" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">Live Synchronization</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Real-time updates broadcast to all connected tabs and devices in milliseconds using native Server-Sent Events.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <FolderUp className="w-5 h-5 text-[var(--accent-primary)] mb-2.5" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">500MB File Vault</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Direct streaming uploads for multi-file archives, video media, PDFs, datasets, and code repositories.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Wand2 className="w-5 h-5 text-[var(--accent-primary)] mb-2.5" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">AI Copilot Formatter</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Deterministic Markdown cleanup standardizing headers, task lists, and spacing while preserving raw code blocks.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Lock className="w-5 h-5 text-[var(--accent-primary)] mb-2.5" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">Password Protection</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Lock sensitive workspaces with 12-round salted bcrypt password hashing and slug-scoped JWT authentication.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <QrCode className="w-5 h-5 text-[var(--accent-primary)] mb-2.5" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">QR Code Device Handoff</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Transfer workspaces between desktop and mobile devices quickly with client-rendered vector QR codes.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Globe className="w-5 h-5 text-[var(--accent-primary)] mb-2.5" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">Zero Registration</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    No email or password needed. Open any URL slug directly and begin collaborating immediately.
                  </p>
                </article>
              </li>
            </ul>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-3">
              Why Teams Choose FileShare
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Compare FileShare with traditional cloud storage, pastebins, and file transfer services.
            </p>
          </header>

          <div className="overflow-x-auto max-w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
              <caption className="sr-only">Feature comparison: FileShare vs Cloud Drives vs Standard Pastebin</caption>
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)]">
                  <th scope="col" className="p-3 sm:p-4 font-bold text-[var(--text-main)]">Key Capability</th>
                  <th scope="col" className="p-3 sm:p-4 font-bold text-[var(--accent-primary)]">FileShare</th>
                  <th scope="col" className="p-3 sm:p-4 font-medium text-[var(--text-muted)]">Cloud Drives (Google Drive)</th>
                  <th scope="col" className="p-3 sm:p-4 font-medium text-[var(--text-muted)]">Standard Pastebin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-xs text-[var(--text-muted)]">
                <tr>
                  <th scope="row" className="p-3 sm:p-4 font-medium text-[var(--text-main)]">Registration &amp; Login</th>
                  <td className="p-3 sm:p-4 font-bold text-[var(--status-success-text)]">Zero (Anonymous)</td>
                  <td className="p-3 sm:p-4">Mandatory Account</td>
                  <td className="p-3 sm:p-4">Optional / Limited</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 sm:p-4 font-medium text-[var(--text-main)]">Real-Time Collaborative Editing</th>
                  <td className="p-3 sm:p-4 font-bold text-[var(--status-success-text)]">Live SSE Sync (Milliseconds)</td>
                  <td className="p-3 sm:p-4">Document Delay</td>
                  <td className="p-3 sm:p-4 text-[var(--status-danger-text)]">Static (No Live Sync)</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 sm:p-4 font-medium text-[var(--text-main)]">File Attachment Capacity</th>
                  <td className="p-3 sm:p-4 font-bold text-[var(--status-success-text)]">500 MB Free per file</td>
                  <td className="p-3 sm:p-4">Consumes Account Quota</td>
                  <td className="p-3 sm:p-4 text-[var(--status-danger-text)]">None (Text Only)</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 sm:p-4 font-medium text-[var(--text-main)]">Markdown &amp; Mermaid Diagrams</th>
                  <td className="p-3 sm:p-4 font-bold text-[var(--status-success-text)]">Native Inline Rendering</td>
                  <td className="p-3 sm:p-4">Requires Third-Party Extensions</td>
                  <td className="p-3 sm:p-4 text-[var(--status-danger-text)]">Plain Raw Text Only</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 sm:p-4 font-medium text-[var(--text-main)]">Instant Device Handoff</th>
                  <td className="p-3 sm:p-4 font-bold text-[var(--status-success-text)]">Dynamic Vector QR Code</td>
                  <td className="p-3 sm:p-4">Requires App Install</td>
                  <td className="p-3 sm:p-4">Manual URL Copying</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 sm:p-4 font-medium text-[var(--text-main)]">Security &amp; Passwords</th>
                  <td className="p-3 sm:p-4 font-bold text-[var(--status-success-text)]">Bcrypt Password Lock &amp; JWT</td>
                  <td className="p-3 sm:p-4">Account Permissions</td>
                  <td className="p-3 sm:p-4">Public / Unprotected</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Featured Educational Resources & Guides Section */}
        <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-3">
                <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
                <span>Engineering Knowledge Hub</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
                Featured Guides &amp; Technical Publications
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                Explore in-depth articles on remote collaboration, workspace security, and Markdown productivity.
              </p>
            </div>
            <Link
              href="/resources"
              className="text-xs sm:text-sm font-semibold text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 min-h-[36px]"
            >
              View All 8 Articles <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featuredArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono mb-2">
                    <span className="text-[var(--accent-primary)] font-medium">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors mb-2">
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
        <section className="py-8 bg-[var(--bg-surface)] border-t border-b border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center mb-4">
              Starter Public Workspaces
            </h3>
            <nav aria-label="Starter public workspaces" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredWorkspaces.map((item) => {
                const isItemActive = activeSlug === item.slug;
                return (
                  <Button
                    key={item.slug}
                    size="md"
                    disabled={Boolean(activeSlug)}
                    onClick={() => handleCreateSpace(item.slug)}
                    className="!justify-start !items-center gap-2.5 !p-3 !rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] !text-left !font-semibold disabled:opacity-50 min-h-[48px]"
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
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">/s/{item.slug}</div>
                    </div>
                  </Button>
                );
              })}
            </nav>
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) */}
        <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Technical details on FileShare architecture, storage limits, and workspace security.
            </p>
          </header>

          <dl className="space-y-4">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-2">
                Is FileShare free to use, and do I need to register?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Yes, FileShare is free with zero registration required. There are no forms to fill out, no email confirmations, and no subscriptions. You can start typing or uploading immediately.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-2">
                What is the file size upload limit?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                You can upload files up to 500 MB each. FileShare supports multi-file uploads including videos, zip archives, images, PDFs, and code repositories with streaming cloud storage backing.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-2">
                How does real-time synchronization work?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                FileShare utilizes Server-Sent Events (SSE) to broadcast changes across all connected clients in milliseconds. Edits and file uploads show up automatically without any page refresh needed.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-2">
                Can I protect my workspace with a password?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Yes. Click the Lock Space action inside any workspace to set a password. Passwords are salted and hashed with bcrypt (12 rounds) and verified via slug-scoped JWT tokens.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-2">
                How do I open my workspace on mobile devices?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Click the QR code button in the top navigation bar of your workspace to generate a vector QR code. Scan it with your phone&apos;s camera to immediately continue editing on mobile.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-2">
                How is FileShare different from Pastebin, Google Drive, or WeTransfer?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Unlike Pastebin, FileShare offers real-time live typing synchronization, rich Markdown formatting, Mermaid diagram rendering, and 500MB multi-file uploads. Unlike Google Drive or WeTransfer, FileShare requires zero registration, no recipient email addresses, and creates instant workspaces accessible by custom URL slug or QR code.
              </dd>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5">
              <dt className="text-sm font-bold text-[var(--text-main)] mb-2">
                Can I write Markdown and render Mermaid diagrams?
              </dt>
              <dd className="text-xs text-[var(--text-muted)] leading-relaxed">
                Yes. FileShare natively parses GitHub Flavored Markdown (headings, task lists, code blocks with syntax highlighting) and automatically renders Mermaid sequence, flowchart, and class diagrams inline with live synchronization.
              </dd>
            </div>
          </dl>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--header-bg)] border-t border-[var(--border-color)] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

          <div className="pt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-center sm:text-left text-[var(--text-muted)]">
            <p>Operated by <strong>SHP Technology</strong> • Founder: Sandesh Patel • Jabalpur, Madhya Pradesh 482001, India</p>
            <p>GDPR &amp; India DPDP Act 2023 Compliant • Free Web Utility</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
