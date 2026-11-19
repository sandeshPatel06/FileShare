"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Plus,
  ArrowRight,
  Clock,
  Pin,
  X,
  Loader2,
  FolderOpen,
  Sparkles,
  ExternalLink,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/Footer";
import { useRecentSpaces } from "@/hooks/useRecentSpaces";
import { generateSlug } from "@/lib/slugGenerator";

export function ProjectsClient() {
  const router = useRouter();
  const [customSlug, setCustomSlug] = useState("");
  const [loadingState, setLoadingState] = useState<string | null>(null);
  const { recentSpaces, removeRecentSpace, togglePin, clearRecentSpaces } = useRecentSpaces();

  const handleCreateSpace = async (prefix?: string) => {
    const key = prefix || "random";
    setLoadingState(key);
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
      // Fallback to client-generated slug
    }
    const fallback = generateSlug(prefix);
    router.push(`/projects/${fallback}`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSlug.trim();
    if (!trimmed) {
      void handleCreateSpace();
      return;
    }
    const target = trimmed.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    setLoadingState(target);
    router.push(`/projects/${target}`);
  };

  const starters = [
    { prefix: "general", title: "General Workspace", icon: "💬" },
    { prefix: "notes", title: "Live Notes", icon: "📝" },
    { prefix: "code", title: "Code Vault", icon: "⚡" },
    { prefix: "docs", title: "Sandbox Docs", icon: "🚀" },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] border-b border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2" aria-label="FileShare Home">
              <div className="w-7 h-7 rounded-md bg-[var(--accent-primary)] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-base tracking-tight text-[var(--text-main)]">
                FileShare
              </span>
            </Link>

            <nav aria-label="Projects Navigation" className="hidden sm:flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
              <Link href="/" className="py-1 hover:text-[var(--text-main)] transition-colors">Home</Link>
              <Link href="/guide" className="py-1 hover:text-[var(--text-main)] transition-colors">User Guide</Link>
              <Link href="/resources" className="py-1 hover:text-[var(--text-main)] transition-colors">Resources</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Button
              onClick={() => handleCreateSpace()}
              disabled={Boolean(loadingState)}
              className="!px-3 !py-1.5 !rounded-md text-xs !font-semibold bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white min-h-[34px]"
              icon={loadingState === "random" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            >
              {loadingState === "random" ? "Creating..." : "New Space"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Page Hero */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-text)]" />
            <span>Workspace Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-main)] text-balance">
            Your Workspaces &amp; Projects
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-[65ch] text-pretty">
            Create a new collaborative space or jump back into any of your active rooms. All notes sync in real time and files up to 500MB upload instantly.
          </p>
        </div>

        {/* Action Grid: Create Workspace + Existing Workspaces */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Create Workspace (5 cols) */}
          <section className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
            <header className="space-y-1">
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[var(--accent-text)]" />
                Create a Workspace
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Choose a custom name or generate a random one instantly.
              </p>
            </header>

            {/* Quick Random Button */}
            <Button
              onClick={() => handleCreateSpace()}
              disabled={Boolean(loadingState)}
              className="w-full !py-2.5 min-h-[44px] !rounded-lg !font-semibold text-xs sm:text-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white flex items-center justify-center gap-2"
              icon={loadingState === "random" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            >
              {loadingState === "random" ? "Creating workspace..." : "Create Random Workspace"}
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[var(--border-color)] w-full"></div>
              <span className="bg-[var(--bg-surface)] px-3 text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider relative">
                or choose a name
              </span>
            </div>

            {/* Custom Slug Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-2.5">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] select-none">
                  /projects/
                </span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="my-workspace"
                  aria-label="Enter custom workspace name"
                  className="w-full pl-22 pr-3 py-2 min-h-[42px] text-xs sm:text-sm rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] font-mono transition-colors"
                />
              </div>
              <Button
                type="submit"
                disabled={Boolean(loadingState)}
                className="w-full !py-2 min-h-[40px] !rounded-lg text-xs font-semibold bg-[var(--bg-main)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] flex items-center justify-center gap-2"
                icon={loadingState && loadingState !== "random" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : undefined}
                iconRight={!loadingState || loadingState === "random" ? <ArrowRight className="w-3.5 h-3.5" /> : undefined}
              >
                Open or Create Space
              </Button>
            </form>

            {/* Starter Templates */}
            <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
              <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                Quick Starters
              </span>
              <div className="grid grid-cols-2 gap-2">
                {starters.map((item) => (
                  <button
                    key={item.prefix}
                    type="button"
                    disabled={Boolean(loadingState)}
                    onClick={() => handleCreateSpace(item.prefix)}
                    className="p-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-left transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <div className="text-base mb-0.5">{item.icon}</div>
                    <div className="text-xs font-semibold text-[var(--text-main)]">{item.title}</div>
                    <div className="text-[10px] font-mono text-[var(--text-muted)] truncate">/{item.prefix}-...</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right Column: Existing / Recent Workspaces (7 cols) */}
          <section className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-[var(--accent-text)]" />
                  Your Existing Spaces
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Spaces you have recently visited or pinned on this device.
                </p>
              </div>

              {recentSpaces.length > 0 && (
                <button
                  type="button"
                  onClick={clearRecentSpaces}
                  className="text-[11px] text-[var(--text-muted)] hover:text-[var(--status-danger-text)] transition-colors cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </header>

            {/* Spaces List */}
            <div className="space-y-2">
              {recentSpaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)]">
                    <Clock className="w-6 h-6 opacity-40" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[var(--text-main)]">
                      No workspaces visited yet
                    </p>
                    <p className="text-xs text-[var(--text-muted)] max-w-[40ch]">
                      Create a new workspace using the options on the left to start collaborating.
                    </p>
                  </div>
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
                    <article
                      key={item.slug}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/60 transition-colors group"
                    >
                      {/* Left: Pin + Info */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => togglePin(item.slug)}
                          title={item.pinned ? "Unpin workspace" : "Pin workspace to top"}
                          aria-label={item.pinned ? "Unpin workspace" : "Pin workspace to top"}
                          className={`shrink-0 p-1 rounded-md transition-colors cursor-pointer ${
                            item.pinned
                              ? "text-[var(--accent-text)]"
                              : "text-[var(--text-muted)] opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Pin className={`w-3.5 h-3.5 ${item.pinned ? "fill-current" : ""}`} />
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/projects/${item.slug}`}
                              className="font-mono font-semibold text-xs sm:text-sm text-[var(--text-main)] hover:text-[var(--accent-text)] transition-colors truncate"
                              title={`Open /projects/${item.slug}`}
                            >
                              /projects/{item.slug}
                            </Link>
                            {item.pinned && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-text)] font-medium shrink-0">
                                Pinned
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] mt-0.5 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 opacity-60" />
                            <span>Visited {ago}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/projects/${item.slug}`}
                          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white inline-flex items-center gap-1.5 transition-colors"
                        >
                          Open
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeRecentSpace(item.slug)}
                          title="Remove from history"
                          aria-label="Remove from history"
                          className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--status-danger-text)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
