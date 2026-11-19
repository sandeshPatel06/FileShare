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
  ChevronDown,
  Smartphone,
  Users,
  Share2,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Footer } from "@/components/Footer";
import { ARTICLES } from "@/lib/articles";
import { useRecentSpaces } from "@/hooks/useRecentSpaces";
import { generateSlug } from "@/lib/slugGenerator";

interface LandingPageProps {
  defaultSlug: string;
}

export function LandingPage({}: LandingPageProps) {
  const router = useRouter();
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
          router.push(`/projects/${data.slug}`);
          return;
        }
      }
    } catch {
      // Fallback to client-generated slug if offline / API error
    }
    const fallback = generateSlug(prefix);
    router.push(`/projects/${fallback}`);
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
            <Button
              onClick={() => router.push("/projects")}
              className="!px-3 sm:!px-4 !py-1.5 !rounded-md text-xs !font-semibold bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white min-h-[36px]"
              iconRight={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Try Now
            </Button>
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
              <span className="text-[var(--accent-text)] flex items-center gap-1.5 font-medium whitespace-nowrap">
                <Zap className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Instant Live Sync
              </span>
              <span className="hidden sm:inline text-[var(--border-color)] select-none" aria-hidden="true">•</span>
              <span className="text-[var(--accent-sky)] flex items-center gap-1.5 font-medium whitespace-nowrap">
                <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> 500MB Free Vault
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] mb-3 sm:mb-4 leading-tight sm:leading-tight text-balance">
              Free Online Notepad &amp; Instant File Sharing
            </h1>

            <p className="max-w-[65ch] mx-auto text-xs sm:text-sm md:text-base text-[var(--text-muted)] mb-4 sm:mb-5 leading-normal sm:leading-relaxed text-pretty">
              Write live Markdown notes, sketch diagrams, and share files up to 500MB with anyone through a single link. No account, forms, or passwords required.
            </p>

            {/* Hero Main Action Card */}
            <div className="max-w-md mx-auto bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm text-center space-y-4">
              <div className="space-y-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] text-balance">
                  Start working together in seconds
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed text-pretty">
                  Create notes, sketch diagrams, and share files up to 500MB with anyone. Zero sign-up, zero installation.
                </p>
              </div>

              <Button
                onClick={() => router.push("/projects")}
                className="w-full !py-3 min-h-[46px] !rounded-lg !font-semibold text-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white flex items-center justify-center gap-2"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Try Now
              </Button>

              <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-center gap-3 text-[11px] font-mono text-[var(--text-muted)]">
                <span>100% Free</span>
                <span aria-hidden="true">•</span>
                <span>No Account Needed</span>
                <span aria-hidden="true">•</span>
                <span>Instant Setup</span>
              </div>
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
                              ? "text-[var(--accent-text)]"
                              : "text-[var(--text-muted)] opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Pin className={`w-3 h-3 ${item.pinned ? "fill-current" : ""}`} />
                        </button>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-semibold text-xs text-[var(--text-main)] truncate">
                              /projects/{item.slug}
                            </span>
                            {item.pinned && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-text)] font-medium shrink-0">
                                Pinned
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{ago}</div>
                        </div>

                        {/* Open link */}
                        <Link
                          href={`/projects/${item.slug}`}
                          onClick={() => setShowRecentModal(false)}
                          title={`Open /projects/${item.slug}`}
                          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-text)] hover:underline py-1 px-1.5"
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
              <Link href="/guide" className="text-[var(--accent-text)] hover:underline inline-flex items-center gap-1 font-medium min-h-[32px] sm:min-h-[36px]">
                Read the Complete User Guide <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3-Step Educational Workflow Overview */}
        <section className="py-8 sm:py-12 md:py-14 max-w-6xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 sm:mb-3">
              Three-Step Workflow
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
                  Type any custom link like <code className="px-1.5 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border-color)] font-mono text-[var(--accent-text)]">/s/notes</code> or click Random Space. Your workspace opens right away.
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

        {/* Real-World Use Cases */}
        <section className="py-8 sm:py-12 md:py-14 max-w-6xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-2.5 sm:mb-3">
              <Share2 className="w-3.5 h-3.5 text-[var(--accent-text)]" aria-hidden="true" />
              <span>Everyday Use Cases</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 sm:mb-3 text-balance">
              Built for Fast Real-World Productivity
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed text-pretty">
              Whether swapping files between devices or writing live meeting notes, FileShare gets it done without friction.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <article className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-text)] border border-[var(--accent-primary)]/20 flex items-center justify-center mb-3">
                  <Smartphone className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)] mb-1.5">Phone to PC Transfer</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Need to send a photo, code snippet, or APK from your smartphone to your laptop? Scan the QR code, drop the file, and download it instantly on PC.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-success-text)] shrink-0" />
                <span>No apps or cables needed</span>
              </div>
            </article>

            <article className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-text)] border border-[var(--accent-primary)]/20 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)] mb-1.5">Live Meeting Notes</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Take notes during calls or interviews. Send the link to teammates and everyone sees edits in real time with zero login walls or permission requests.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-success-text)] shrink-0" />
                <span>Millisecond live sync</span>
              </div>
            </article>

            <article className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-text)] border border-[var(--accent-primary)]/20 flex items-center justify-center mb-3">
                  <FolderUp className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)] mb-1.5">500MB Quick File Drop</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Hit an email attachment limit? Drop large ZIPs, videos, PDFs, or design assets up to 500MB and send a single direct link that opens anywhere.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-success-text)] shrink-0" />
                <span>Direct browser downloads</span>
              </div>
            </article>

            <article className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-colors">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-text)] border border-[var(--accent-primary)]/20 flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)] mb-1.5">Private Client Handoff</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Sharing sensitive API tokens, server configs, or client deliverables? Set a workspace password so only authorized parties can unlock the content.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--status-success-text)] shrink-0" />
                <span>Bcrypt encrypted lock</span>
              </div>
            </article>
          </div>
        </section>

        {/* Workspace Capabilities */}
        <section className="py-8 sm:py-12 md:py-14 bg-[var(--bg-surface)] border-t border-b border-[var(--border-color)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <header className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 sm:mb-3">
                Built-in Workspace Tools
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                A fast, distraction-free workspace built for quick notes and easy file sharing.
              </p>
            </header>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 list-none p-0 m-0">
              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Zap className="w-5 h-5 text-[var(--accent-text)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">Instant Live Sync</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Notes and uploads update instantly on every screen without needing to refresh the page.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <FolderUp className="w-5 h-5 text-[var(--accent-text)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">500MB File Sharing</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Upload documents, images, videos, zip archives, and code files up to 500MB each.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Wand2 className="w-5 h-5 text-[var(--accent-text)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">One-Click Formatter</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Clean up spacing, headers, and task lists in one click without altering your code blocks.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Lock className="w-5 h-5 text-[var(--accent-text)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">Password Lock</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Protect confidential notes and files with an optional password only you and your team know.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <QrCode className="w-5 h-5 text-[var(--accent-text)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">Mobile QR Handoff</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Scan the built-in QR code with your phone camera to take your workspace anywhere instantly.
                  </p>
                </article>
              </li>

              <li>
                <article className="h-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 hover:border-[var(--accent-primary)] transition-colors">
                  <Globe className="w-5 h-5 text-[var(--accent-text)] mb-2" aria-hidden="true" />
                  <h3 className="text-sm font-bold mb-1 text-[var(--text-main)]">No Sign-Up Needed</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    No email, no forms, and no setup. Open any link in your browser and start working right away.
                  </p>
                </article>
              </li>
            </ul>
          </div>
        </section>

        {/* Platform Comparison Matrix */}
        <section className="py-8 sm:py-12 md:py-14 max-w-5xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 sm:mb-3">
              Platform Comparison
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              See how FileShare compares to traditional cloud drives and paste tools.
            </p>
          </header>

          <div className="overflow-x-auto max-w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
              <caption className="sr-only">Platform comparison: FileShare vs Cloud Drives vs Standard Pastebin</caption>
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)]">
                  <th scope="col" className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--text-main)]">Capability</th>
                  <th scope="col" className="p-2.5 sm:p-3.5 md:p-4 font-bold text-[var(--accent-text)]">FileShare</th>
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
                <BookOpen className="w-3.5 h-3.5 text-[var(--accent-text)]" aria-hidden="true" />
                <span>Knowledge Base</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] text-balance">
                Helpful Guides &amp; Tips
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 text-pretty">
                Read quick tutorials on Markdown tricks, shortcuts, and productive workflows.
              </p>
            </div>
            <Link
              href="/resources"
              className="text-xs sm:text-sm font-semibold text-[var(--accent-text)] hover:underline inline-flex items-center gap-1 min-h-[36px]"
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
                    <span className="text-[var(--accent-text)] font-medium">{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)] group-hover:text-[var(--accent-text)] transition-colors mb-2 text-balance">
                    <Link href={`/resources/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3 mb-4 text-pretty">
                    {article.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-mono">{article.date}</span>
                  <Link
                    href={`/resources/${article.slug}`}
                    className="font-semibold text-[var(--accent-text)] inline-flex items-center gap-1 group-hover:gap-1.5 transition-all py-1"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Starter Public Workspaces */}
        <section className="py-6 sm:py-8 bg-[var(--bg-surface)] border-t border-b border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center mb-3 sm:mb-4">
              Starter Workspaces
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
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-text)]" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      )
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs truncate text-[var(--text-main)]">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)]">New /projects/{item.prefix}-...</div>
                    </div>
                  </Button>
                );
              })}
            </nav>
          </div>
        </section>

        {/* Common Questions & Answers Accordion */}
        <section className="py-8 sm:py-12 md:py-14 max-w-3xl mx-auto px-4 sm:px-6">
          <header className="text-center max-w-[65ch] mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-2.5 sm:mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--accent-text)]" aria-hidden="true" />
              <span>Questions &amp; Answers</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2 sm:mb-3 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed text-pretty">
              Everything you need to know about FileShare workspaces, real-time collaboration, and security.
            </p>
          </header>

          <div className="space-y-3">
            <details className="group bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 transition-colors open:border-[var(--accent-primary)]/60">
              <summary className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--text-main)] cursor-pointer select-none list-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded">
                <span>Is FileShare free to use, and do I need to register?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200" aria-hidden="true" />
              </summary>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2.5 text-pretty">
                Yes, FileShare is 100% free with zero registration required. There are no forms to fill out, no email confirmations, and no subscriptions. You can start typing or uploading immediately.
              </p>
            </details>

            <details className="group bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 transition-colors open:border-[var(--accent-primary)]/60">
              <summary className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--text-main)] cursor-pointer select-none list-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded">
                <span>What is the file size upload limit?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200" aria-hidden="true" />
              </summary>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2.5 text-pretty">
                You can upload files up to 500 MB each. FileShare supports multi-file uploads including videos, zip archives, images, PDFs, audio, and code files.
              </p>
            </details>

            <details className="group bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 transition-colors open:border-[var(--accent-primary)]/60">
              <summary className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--text-main)] cursor-pointer select-none list-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded">
                <span>How does real-time synchronization work?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200" aria-hidden="true" />
              </summary>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2.5 text-pretty">
                FileShare uses instant live sync so changes appear across all connected browsers in milliseconds. When anyone edits notes or uploads a file, it shows up automatically without refreshing.
              </p>
            </details>

            <details className="group bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 transition-colors open:border-[var(--accent-primary)]/60">
              <summary className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--text-main)] cursor-pointer select-none list-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded">
                <span>Can I protect my workspace with a password?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200" aria-hidden="true" />
              </summary>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2.5 text-pretty">
                Yes. Click Lock Space in the top bar to set a password. Anyone visiting the link will need to enter your password to view or edit notes and files.
              </p>
            </details>

            <details className="group bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 transition-colors open:border-[var(--accent-primary)]/60">
              <summary className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--text-main)] cursor-pointer select-none list-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded">
                <span>How do I open my workspace on mobile devices?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200" aria-hidden="true" />
              </summary>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2.5 text-pretty">
                Click the QR code button in the top bar. Scan it with your phone&apos;s camera to instantly open and edit your workspace on mobile.
              </p>
            </details>

            <details className="group bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 transition-colors open:border-[var(--accent-primary)]/60">
              <summary className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--text-main)] cursor-pointer select-none list-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded">
                <span>How is FileShare different from Pastebin, Google Drive, or WeTransfer?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200" aria-hidden="true" />
              </summary>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2.5 text-pretty">
                Unlike Pastebin, FileShare syncs your typing live, renders rich Markdown diagrams, and supports 500MB file uploads. Unlike Google Drive or WeTransfer, there is no account to create, no email addresses needed, and workspaces open instantly with a link.
              </p>
            </details>

            <details className="group bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 transition-colors open:border-[var(--accent-primary)]/60">
              <summary className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--text-main)] cursor-pointer select-none list-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded">
                <span>Can I write Markdown and render Mermaid diagrams?</span>
                <ChevronDown className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-open:rotate-180 transition-transform duration-200" aria-hidden="true" />
              </summary>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2.5 text-pretty">
                Yes. FileShare supports GitHub Flavored Markdown (headings, task lists, tables, syntax-highlighted code blocks) and renders Mermaid flowcharts and diagrams automatically in real time.
              </p>
            </details>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
