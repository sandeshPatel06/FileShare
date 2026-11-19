"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  FileArchive,
  FileText,
  FolderOpen,
  HardDrive,
  History,
  Lock,
  Pin,
  Search,
  Shuffle,
  Smartphone,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "./ThemeToggle";
import { useRecentSpaces, type RecentSpaceItem } from "@/hooks/useRecentSpaces";
import { generateSlug } from "@/lib/slugGenerator";

const Modal = dynamic(() => import("@/components/ui/Modal").then((m) => m.Modal), { ssr: false });

export interface LandingPageProps {
  defaultSlug: string;
}

interface QuickChip {
  emoji: string;
  label: string;
  slug: string;
}

interface ComparisonRow {
  feature: string;
  fileshare: string;
  drive: string;
  pastebin: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FeatureItem {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  title: string;
  description: string;
}

const QUICK_CHIPS: QuickChip[] = [
  { emoji: "📝", label: "notes", slug: "meeting-notes" },
  { emoji: "📁", label: "vault", slug: "file-vault" },
  { emoji: "📱", label: "phone-transfer", slug: "phone-transfer" },
  { emoji: "⚡", label: "scratchpad", slug: "scratchpad" },
];

const FEATURES: FeatureItem[] = [
  {
    icon: FileText,
    title: "Live Markdown Notes",
    description:
      "Type together in real time. Full Markdown checklists, tables, code blocks, and live diagrams sync without page refreshes.",
  },
  {
    icon: HardDrive,
    title: "500MB File Sharing",
    description:
      "Bypass 25MB email attachment caps. Drop large videos, ZIPs, or PDFs with direct browser download links.",
  },
  {
    icon: Smartphone,
    title: "Phone to PC Transfer",
    description:
      "Scan the workspace QR code with your phone camera to transfer photos, documents, or links straight to your desktop.",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description:
      "Lock private workspaces in one click with an optional password. Only visitors who enter the password can access your space.",
  },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Account Required",
    fileshare: "None — 100% free & instant",
    drive: "Must create/sign in to Google",
    pastebin: "Required for large text",
  },
  {
    feature: "Live Real-Time Sync",
    fileshare: "Yes — instant updates as you type",
    drive: "Yes, but slow on big documents",
    pastebin: "No (static pages only)",
  },
  {
    feature: "File Size Limit",
    fileshare: "500 MB per file (Free)",
    drive: "Uses up limited cloud storage",
    pastebin: "Text only (no files)",
  },
  {
    feature: "Phone to PC Transfer",
    fileshare: "Scan QR code with camera (No app)",
    drive: "Must download mobile app",
    pastebin: "Manual copy-pasting",
  },
  {
    feature: "Password Lock",
    fileshare: "1-click optional password",
    drive: "Complex permissions & sharing",
    pastebin: "Paid Pro account only",
  },
];

// Verbatim match with Schema.org FAQPage JSON-LD in src/app/page.tsx
const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Is FileShare free to use, and do I need to register?",
    answer:
      "Yes, FileShare is 100% free with zero registration required. There are no forms to fill out, no email confirmations, and no subscriptions. You can start typing or uploading immediately.",
  },
  {
    question: "What is the file size upload limit?",
    answer:
      "You can upload files up to 500 MB each. FileShare supports multi-file uploads including videos, zip archives, images, PDFs, and code files.",
  },
  {
    question: "How does real-time synchronization work?",
    answer:
      "FileShare uses instant live sync so changes appear across all connected browsers in milliseconds. When anyone edits notes or uploads a file, it shows up automatically without refreshing.",
  },
  {
    question: "Can I protect my workspace with a password?",
    answer:
      "Yes. Click Lock Space in the top bar to set a password. Anyone visiting the link will need to enter your password to view or edit notes and files.",
  },
  {
    question: "How do I open my workspace on mobile devices?",
    answer:
      "Click the QR code button in the top bar. Scan it with your phone's camera to instantly open and edit your workspace on mobile.",
  },
  {
    question:
      "How is FileShare different from Pastebin, Google Drive, or WeTransfer?",
    answer:
      "Unlike Pastebin, FileShare syncs your typing live, renders rich Markdown diagrams, and supports 500MB file uploads. Unlike Google Drive or WeTransfer, there is no account to create, no email addresses needed, and workspaces open instantly with a link.",
  },
  {
    question: "Can I write Markdown and render Mermaid diagrams?",
    answer:
      "Yes. FileShare supports GitHub Flavored Markdown (headings, task lists, tables, syntax-highlighted code blocks) and renders Mermaid flowcharts and diagrams automatically in real time.",
  },
];

function sanitizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_/\s]/g, "")
    .replace(/[\s/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function formatRelativeTime(timestamp: number, now: number): string {
  const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/** Interactive split window hero preview with simulated live sync */
function WorkspacePreview({ previewSlug }: { previewSlug: string }) {
  const [copiedFile, setCopiedFile] = useState(false);

  const handleCopySample = () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        void navigator.clipboard.writeText(
          `${window.location.origin}/projects/${previewSlug}`
        );
      }
    } catch {
      // Ignore clipboard write failures in restricted contexts
    }
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 1500);
  };

  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-lg overflow-hidden text-left">
      {/* Window Chrome */}
      <div className="px-3.5 py-2 bg-[var(--header-bg)] border-b border-[var(--border-color)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <Lock className="w-3 h-3 text-[var(--accent-text)]" aria-hidden="true" />
          <span>filesp.pages.dev/projects/{previewSlug}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[var(--status-success-text)] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success-text)]" />
          Live Sync
        </div>
      </div>

      {/* Split Window Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
        {/* Left: Live Notes Pane (7 cols) */}
        <div className="md:col-span-7 p-4 bg-[var(--bg-main)] space-y-2.5 text-xs font-mono">
          <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-main)] flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-[var(--accent-text)]" aria-hidden="true" />
              meeting-notes.md
            </span>
            <span>Markdown</span>
          </div>

          <div className="space-y-1.5 text-[var(--text-main)] font-sans">
            <div className="font-bold text-sm">Sprint Highlights &amp; Tasks</div>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2 text-[var(--status-success-text)]">
                <span>☑</span>
                <span className="line-through text-[var(--text-muted)]">Fast real-time notes streaming</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--status-success-text)]">
                <span>☑</span>
                <span className="line-through text-[var(--text-muted)]">500MB multi-file uploads</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--accent-text)]">
                <span>☐</span>
                <span className="font-semibold text-[var(--text-main)]">Share link with teammates</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-[var(--accent-primary)]/15">typing...</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-[var(--text-muted)] flex items-center justify-between font-mono">
            <span>Auto-saved live</span>
            <span className="text-[var(--accent-text)]">● 2 collaborators typing</span>
          </div>
        </div>

        {/* Right: File Vault Pane (5 cols) */}
        <div className="md:col-span-5 p-4 bg-[var(--bg-surface)] flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-[var(--border-color)] text-[11px] font-mono">
              <span className="font-semibold text-[var(--text-main)] flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-[var(--accent-text)]" aria-hidden="true" />
                File Vault
              </span>
              <span className="text-[var(--text-muted)]">500MB limit</span>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
                  <span className="truncate font-semibold text-[var(--text-main)] text-xs">report.pdf</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySample}
                  aria-label="Copy sample file link"
                  className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--badge-bg)] text-[var(--accent-text)] hover:opacity-80 cursor-pointer min-h-[28px]"
                >
                  {copiedFile ? "Copied!" : "Link"}
                </button>
              </div>

              <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <FileArchive className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="truncate font-semibold text-[var(--text-main)] text-xs">assets.zip</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">38MB</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-center text-[var(--text-muted)]">
            Drop any file to share instantly
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecentSpacesModalProps {
  open: boolean;
  onClose: () => void;
  recentSpaces: RecentSpaceItem[];
  onNavigate: (slug: string) => void;
  onTogglePin: (slug: string) => void;
  onRemove: (slug: string) => void;
  onClear: () => void;
}

/** Isolated modal component to prevent re-rendering LandingPage on search keystrokes */
function RecentSpacesModal({
  open,
  onClose,
  recentSpaces,
  onNavigate,
  onTogglePin,
  onRemove,
  onClear,
}: RecentSpacesModalProps) {
  const [query, setQuery] = useState("");
  const [clientNow] = useState(() => Date.now());

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...recentSpaces]
      .filter((space) => (!q ? true : space.slug.toLowerCase().includes(q)))
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) {
          return a.pinned ? -1 : 1;
        }
        return b.lastVisited - a.lastVisited;
      });
  }, [recentSpaces, query]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Recent Workspaces (${recentSpaces.length})`}
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
            disabled={recentSpaces.length === 0}
            onClick={() => {
              onClear();
              setQuery("");
            }}
          >
            Clear
          </Button>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {recentSpaces.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search recent spaces"
              className="w-full bg-transparent text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="p-6 text-center text-xs text-[var(--text-muted)]">
            No recent spaces found.
          </div>
        ) : (
          <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
            {sorted.map((space) => (
              <li
                key={space.slug}
                className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate(space.slug);
                    }}
                    className="w-full text-left truncate font-mono font-medium text-[var(--text-main)] cursor-pointer hover:underline"
                  >
                    /projects/{space.slug}
                  </button>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {clientNow ? formatRelativeTime(space.lastVisited, clientNow) : ""}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onTogglePin(space.slug)}
                    title={space.pinned ? "Unpin space" : "Pin space"}
                    aria-label={space.pinned ? "Unpin space" : "Pin space"}
                    className={`min-h-[32px] min-w-[32px] flex items-center justify-center p-1 rounded transition-colors cursor-pointer ${
                      space.pinned
                        ? "text-[var(--accent-text)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    <Pin className={`w-3.5 h-3.5 ${space.pinned ? "fill-current" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(space.slug)}
                    title="Remove space"
                    aria-label="Remove space from history"
                    className="min-h-[32px] min-w-[32px] flex items-center justify-center p-1 text-[var(--text-muted)] hover:text-red-400 cursor-pointer rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

export function LandingPage({ defaultSlug }: LandingPageProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { recentSpaces, removeRecentSpace, togglePin, clearRecentSpaces } =
    useRecentSpaces();

  const [slugInput, setSlugInput] = useState<string>("");
  const [suggestedSlug, setSuggestedSlug] = useState<string>(defaultSlug);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isRecentModalOpen, setIsRecentModalOpen] = useState<boolean>(false);

  const effectivePreviewSlug = useMemo(() => {
    const cleaned = sanitizeSlug(slugInput);
    return cleaned || suggestedSlug || "team-notes";
  }, [slugInput, suggestedSlug]);

  const navigateToSpace = useCallback((rawSlug: string) => {
    const cleaned = sanitizeSlug(rawSlug) || generateSlug();
    router.push(`/projects/${cleaned}`);
  }, [router]);

  const handleOpenCustomSpace = useCallback(() => {
    const cleaned = sanitizeSlug(slugInput);
    navigateToSpace(cleaned || suggestedSlug);
  }, [slugInput, suggestedSlug, navigateToSpace]);

  const handleHeroFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleOpenCustomSpace();
  }, [handleOpenCustomSpace]);

  const handleRandomSpace = useCallback(() => {
    const fresh = generateSlug();
    router.push(`/projects/${fresh}`);
  }, [router]);

  const handleShufflePlaceholder = useCallback(() => {
    const fresh = generateSlug();
    setSuggestedSlug(fresh);
    setSlugInput(fresh);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col selection:bg-[var(--badge-bg)] selection:text-[var(--accent-text)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--header-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-13 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold tracking-tight text-[var(--text-main)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-primary)] text-white">
              <FolderOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>FileShare</span>
          </Link>

          <nav aria-label="Main" className="hidden sm:flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
            <a href="#features" className="hover:text-[var(--text-main)] transition-colors">Features</a>
            <a href="#compare" className="hover:text-[var(--text-main)] transition-colors">Compare</a>
            <Link href="/guide" className="hover:text-[var(--text-main)] transition-colors">Guide</Link>
            <a href="#faq" className="hover:text-[var(--text-main)] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            {recentSpaces.length > 0 && (
              <button
                type="button"
                onClick={() => setIsRecentModalOpen(true)}
                aria-label={`View ${recentSpaces.length} recent workspaces`}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer transition-colors"
              >
                <History className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Recent</span>
                <span className="rounded bg-[var(--badge-bg)] px-1.5 py-0.2 font-mono text-[10px] text-[var(--accent-text)]">
                  {recentSpaces.length}
                </span>
              </button>
            )}

            <ThemeToggle />

            <Button
              variant="primary"
              size="sm"
              icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />}
              onClick={handleRandomSpace}
            >
              New Space
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Debloated Hero Section */}
        <section className="pt-10 pb-12 sm:pt-16 sm:pb-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-main)] leading-[1.15] mb-3 text-balance">
            Live notes &amp; 500MB vault. <br />
            <span className="text-[var(--accent-text)]">No sign-up needed.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-6 text-pretty">
            Write collaborative Markdown notes and share files up to 500MB instantly through a single link. Free, fast, and open to anyone.
          </p>

          {/* Clean 1-Line URL Bar */}
          <form
            onSubmit={handleHeroFormSubmit}
            className="max-w-lg mx-auto p-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md focus-within:border-[var(--accent-primary)] transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3"
          >
            <div className="flex-1 flex items-center px-3 min-h-[42px] bg-[var(--bg-main)] rounded-lg border border-[var(--border-color)] sm:border-transparent">
              <span className="text-xs font-mono text-[var(--text-muted)] select-none shrink-0 pr-1">
                filesp.pages.dev/projects/
              </span>
              <input
                ref={inputRef}
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                placeholder={suggestedSlug}
                aria-label="Workspace name"
                className="w-full bg-transparent text-xs sm:text-sm font-mono text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleShufflePlaceholder}
                title="Shuffle name"
                aria-label="Shuffle workspace name"
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-2 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer rounded-md transition-colors"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="flex-1 sm:flex-initial !px-4 !py-2.5 min-h-[40px] !text-xs !font-semibold"
                iconRight={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
              >
                Start Space
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="!px-3 !py-2.5 min-h-[40px] !text-xs"
                onClick={handleRandomSpace}
                title="Create random room"
                aria-label="Create random room"
              >
                <Zap className="w-4 h-4 text-[var(--accent-text)]" aria-hidden="true" />
              </Button>
            </div>
          </form>

          {/* Quick Idea Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[var(--text-muted)] mb-8">
            <span className="text-[11px] uppercase tracking-wider">Try:</span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.slug}
                type="button"
                onClick={() => navigateToSpace(chip.slug)}
                className="px-2.5 py-1 min-h-[32px] inline-flex items-center rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-main)] hover:text-[var(--accent-text)] transition-colors cursor-pointer text-xs"
              >
                <span className="mr-1">{chip.emoji}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Clean, Lightweight Split Window Preview */}
          <WorkspacePreview previewSlug={effectivePreviewSlug} />
        </section>

        {/* 4 Clean Value Pillars */}
        <section id="features" className="py-12 border-t border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="p-4 sm:p-5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)]">
                      <Icon className="w-4 h-4 text-[var(--accent-text)]" aria-hidden="true" />
                      {feat.title}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Compact Comparison Table */}
        <section id="compare" className="py-12 border-b border-[var(--border-color)] bg-[var(--bg-main)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-main)] mb-6 text-center">
              Why Choose FileShare
            </h2>

            <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
              <table className="w-full min-w-[580px] text-left text-xs">
                <caption className="sr-only">
                  Feature comparison between FileShare, Google Drive, and Pastebin
                </caption>
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                    <th scope="col" className="p-3 font-semibold text-[var(--text-main)]">Feature</th>
                    <th scope="col" className="p-3 font-bold text-[var(--accent-text)]">FileShare</th>
                    <th scope="col" className="p-3 text-[var(--text-muted)]">Google Drive</th>
                    <th scope="col" className="p-3 text-[var(--text-muted)]">Pastebin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <th scope="row" className="p-3 font-medium text-[var(--text-main)] text-left font-normal">{row.feature}</th>
                      <td className="p-3 font-semibold text-[var(--status-success-text)]">
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{row.fileshare}</span>
                        </span>
                      </td>
                      <td className="p-3">{row.drive}</td>
                      <td className="p-3">{row.pastebin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Compact FAQ Accordion */}
        <section id="faq" className="py-12 max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-main)] mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-[var(--border-color)] rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    id={`faq-btn-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] cursor-pointer transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[var(--accent-text)]" : "text-[var(--text-muted)]"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-panel-${idx}`}
                      role="region"
                      aria-labelledby={`faq-btn-${idx}`}
                      className="px-3.5 pb-3.5 text-xs text-[var(--text-muted)] leading-relaxed"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Clean Bottom Banner */}
        <section className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-surface)] text-center">
          <div className="max-w-md mx-auto px-4 space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Ready to start?
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              No forms, no passwords to create, no fees. Just click and collaborate.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <Button
                variant="primary"
                size="md"
                icon={<Zap className="w-4 h-4" aria-hidden="true" />}
                onClick={handleRandomSpace}
              >
                Instant Space ⚡
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Recent Spaces Modal (Mounted only when open) */}
      {isRecentModalOpen && (
        <RecentSpacesModal
          open={isRecentModalOpen}
          onClose={() => setIsRecentModalOpen(false)}
          recentSpaces={recentSpaces}
          onNavigate={navigateToSpace}
          onTogglePin={togglePin}
          onRemove={removeRecentSpace}
          onClear={clearRecentSpaces}
        />
      )}
    </div>
  );
}
