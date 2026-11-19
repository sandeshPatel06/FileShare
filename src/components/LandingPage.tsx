"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Code2,
  Copy,
  Download,
  FileArchive,
  FileText,
  Film,
  FolderOpen,
  HardDrive,
  History,
  Lock,
  Pin,
  PinOff,
  Search,
  ShieldCheck,
  Shuffle,
  Smartphone,
  Trash2,
  Unlock,
  Upload,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "./ThemeToggle";
import { useRecentSpaces } from "@/hooks/useRecentSpaces";
import { generateSlug } from "@/lib/slugGenerator";
import { ARTICLES } from "@/lib/articles";

export interface LandingPageProps {
  defaultSlug: string;
}

type PreviewTabId = "notes" | "vault" | "phone" | "security";

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
  wetransfer: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const QUICK_CHIPS: QuickChip[] = [
  { emoji: "📝", label: "notes", slug: "meeting-notes" },
  { emoji: "📁", label: "file-drop", slug: "file-drop" },
  { emoji: "📱", label: "phone-transfer", slug: "phone-transfer" },
  { emoji: "⚡", label: "scratchpad", slug: "scratchpad" },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Account Required",
    fileshare: "None — 100% free & instant",
    drive: "Must create/sign in to Google",
    pastebin: "Required for large text",
    wetransfer: "Must verify email address",
  },
  {
    feature: "Live Real-Time Sync",
    fileshare: "Yes — instant updates as you type",
    drive: "Yes, but slow on big documents",
    pastebin: "No (static pages only)",
    wetransfer: "No (file transfer only)",
  },
  {
    feature: "File Size Limit",
    fileshare: "500 MB per file (Free)",
    drive: "Uses up limited cloud storage",
    pastebin: "Text only (no files)",
    wetransfer: "2 GB (expires in a few days)",
  },
  {
    feature: "Phone to PC Transfer",
    fileshare: "Scan QR code with camera (No app)",
    drive: "Must download mobile app",
    pastebin: "Manual copy-pasting",
    wetransfer: "Must email download link",
  },
  {
    feature: "Password Lock",
    fileshare: "1-click optional password",
    drive: "Complex permissions & sharing",
    pastebin: "Paid Pro account only",
    wetransfer: "Paid subscription only",
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

const INITIAL_PREVIEW_TASKS = [
  { id: "t1", text: "Meeting Agenda: Review Q4 product roadmap", done: true },
  { id: "t2", text: "Upload design mockups & presentation (PDF)", done: true },
  { id: "t3", text: "Send shareable link to team members", done: false },
];

const VAULT_PREVIEW_FILES = [
  {
    id: "f1",
    name: "quarterly-report-final.pdf",
    size: "4.2 MB",
    meta: "Ready to download",
    uploading: false,
    progress: 100,
    kind: "doc" as const,
  },
  {
    id: "f2",
    name: "project-design-assets.zip",
    size: "38.5 MB",
    meta: "Ready to download",
    uploading: false,
    progress: 100,
    kind: "archive" as const,
  },
  {
    id: "f3",
    name: "product-demo-video.mp4",
    size: "248 MB",
    meta: "Uploading • 14.2 MB/s",
    uploading: true,
    progress: 82,
    kind: "video" as const,
  },
];

const QR_MATRIX: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1],
  [0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
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

export function LandingPage({ defaultSlug }: LandingPageProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { recentSpaces, removeRecentSpace, togglePin, clearRecentSpaces } =
    useRecentSpaces();

  // URL input state
  const [slugInput, setSlugInput] = useState<string>("");
  const [suggestedSlug, setSuggestedSlug] = useState<string>(defaultSlug);

  // Preview interactive state
  const [activeTab, setActiveTab] = useState<PreviewTabId>("notes");
  const [previewTasks, setPreviewTasks] = useState(INITIAL_PREVIEW_TASKS);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const [isPreviewLocked, setIsPreviewLocked] = useState<boolean>(false);
  const [isFormattedFlash, setIsFormattedFlash] = useState<boolean>(false);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Recent Spaces Modal state
  const [isRecentModalOpen, setIsRecentModalOpen] = useState<boolean>(false);
  const [recentQuery, setRecentQuery] = useState<string>("");
  const [clientNow, setClientNow] = useState<number>(0);

  const handleOpenRecentModal = () => {
    setClientNow(Date.now());
    setIsRecentModalOpen(true);
  };

  const effectivePreviewSlug = useMemo(() => {
    const cleaned = sanitizeSlug(slugInput);
    return cleaned || suggestedSlug || "team-notes";
  }, [slugInput, suggestedSlug]);

  const sortedRecentSpaces = useMemo(() => {
    const q = recentQuery.trim().toLowerCase();
    return [...recentSpaces]
      .filter((space) => (!q ? true : space.slug.toLowerCase().includes(q)))
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) {
          return a.pinned ? -1 : 1;
        }
        return b.lastVisited - a.lastVisited;
      });
  }, [recentSpaces, recentQuery]);

  const navigateToSpace = (rawSlug: string) => {
    const cleaned = sanitizeSlug(rawSlug) || generateSlug();
    router.push(`/projects/${cleaned}`);
  };

  const handleOpenCustomSpace = () => {
    const cleaned = sanitizeSlug(slugInput);
    navigateToSpace(cleaned || suggestedSlug);
  };

  const handleHeroFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleOpenCustomSpace();
  };

  const handleRandomSpace = () => {
    const fresh = generateSlug();
    router.push(`/projects/${fresh}`);
  };

  const handleShufflePlaceholder = () => {
    const fresh = generateSlug();
    setSuggestedSlug(fresh);
    setSlugInput(fresh);
    inputRef.current?.focus();
  };

  const handleTogglePreviewTask = (id: string) => {
    setPreviewTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleCopyPreviewLink = (fileId: string) => {
    setCopiedFileId(fileId);
    window.setTimeout(() => {
      setCopiedFileId((curr) => (curr === fileId ? null : curr));
    }, 1600);
  };

  const handleTriggerFormatDemo = () => {
    setIsFormattedFlash(true);
    window.setTimeout(() => setIsFormattedFlash(false), 1400);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] selection:bg-[var(--badge-bg)] selection:text-[var(--accent-text)]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-[var(--text-main)]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--accent-text)]">
                <FolderOpen className="h-4 w-4" />
              </span>
              <span className="text-base font-bold">FileShare</span>
            </Link>

            <nav
              aria-label="Navigation"
              className="hidden items-center gap-5 text-xs font-medium text-[var(--text-muted)] md:flex"
            >
              <a href="#how-it-works" className="transition-colors hover:text-[var(--text-main)]">
                How It Works
              </a>
              <a href="#features" className="transition-colors hover:text-[var(--text-main)]">
                Features
              </a>
              <a href="#compare" className="transition-colors hover:text-[var(--text-main)]">
                Compare
              </a>
              <Link href="/guide" className="transition-colors hover:text-[var(--text-main)]">
                User Guide
              </Link>
              <a href="#faq" className="transition-colors hover:text-[var(--text-main)]">
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {recentSpaces.length > 0 && (
              <button
                type="button"
                onClick={handleOpenRecentModal}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--text-main)] cursor-pointer"
              >
                <History className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Recent</span>
                <span className="rounded bg-[var(--badge-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--accent-text)]">
                  {recentSpaces.length}
                </span>
              </button>
            )}

            <ThemeToggle />

            <Button
              variant="primary"
              size="sm"
              icon={<Zap className="h-3.5 w-3.5" />}
              onClick={handleRandomSpace}
            >
              Instant Space ⚡
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section — Clean, Friendly & Easy to Use */}
        <section className="relative border-b border-[var(--border-color)] bg-[var(--bg-main)] pt-10 pb-16 sm:pt-14 sm:pb-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
            {/* Value Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--badge-border)] bg-[var(--badge-bg)] px-3 py-1 text-xs font-medium text-[var(--accent-text)]">
              <span className="h-2 w-2 rounded-full bg-[var(--status-success-text)] animate-pulse" />
              <span>100% Free • No Sign-Up • Open Instantly</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text-main)] mb-4 leading-tight text-balance">
              Write notes. Share files. <br />
              <span className="text-[var(--accent-text)]">Zero registration required.</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-[var(--text-muted)] leading-relaxed mb-8 text-pretty">
              Create an instant workspace with a single link. Type together in real time, drop heavy files up to 500MB, or scan a QR code to transfer photos between your phone and computer.
            </p>

            {/* Easy-To-Use URL Creation Card */}
            <div className="mx-auto max-w-xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 sm:p-5 shadow-lg text-left">
              <form onSubmit={handleHeroFormSubmit} className="space-y-3">
                <div>
                  <label htmlFor="workspace-input" className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                    Choose your workspace link:
                  </label>
                  <div className="flex items-center rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2.5 focus-within:border-[var(--accent-primary)] transition-colors">
                    <span className="shrink-0 select-none font-mono text-xs text-[var(--text-muted)] pr-1">
                      filesp.pages.dev/projects/
                    </span>
                    <input
                      id="workspace-input"
                      ref={inputRef}
                      type="text"
                      value={slugInput}
                      onChange={(e) => setSlugInput(e.target.value)}
                      placeholder={suggestedSlug}
                      aria-label="Workspace room name"
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full bg-transparent font-mono text-xs sm:text-sm font-medium text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
                    />
                    {slugInput && (
                      <button
                        type="button"
                        onClick={() => setSlugInput("")}
                        aria-label="Clear room name"
                        className="ml-1 rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleShufflePlaceholder}
                      title="Suggest another random name"
                      aria-label="Suggest another random name"
                      className="ml-1 rounded p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full sm:flex-1 !py-3 !text-sm !font-semibold shadow-sm"
                    iconRight={<ArrowRight className="h-4 w-4" />}
                  >
                    Open Workspace
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="w-full sm:w-auto !py-3 !text-sm !font-medium"
                    icon={<Zap className="h-4 w-4 text-[var(--accent-text)]" />}
                    onClick={handleRandomSpace}
                  >
                    Random Space ⚡
                  </Button>
                </div>
              </form>

              {/* Quick ideas chips */}
              <div className="mt-3.5 pt-3 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5 text-[var(--text-muted)]">
                  <span>Quick ideas:</span>
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip.slug}
                      type="button"
                      onClick={() => navigateToSpace(chip.slug)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] text-[var(--text-main)] hover:text-[var(--accent-text)] transition-colors cursor-pointer text-xs"
                    >
                      <span>{chip.emoji}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>

                {recentSpaces.length > 0 && (
                  <button
                    type="button"
                    onClick={handleOpenRecentModal}
                    className="text-[var(--accent-text)] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>Recent ({recentSpaces.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Browser Window Mockup ("Show, Don't Tell") */}
            <div className="mt-12 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl text-left">
              {/* Window Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] bg-[var(--header-bg)] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>

                <div className="flex max-w-sm flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)]">
                  <Lock className="h-3 w-3 text-[var(--accent-text)]" />
                  <span className="truncate">filesp.pages.dev/projects/{effectivePreviewSlug}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--status-success-text)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--status-success-text)]" />
                  <span>Live Sync</span>
                </div>
              </div>

              {/* Mockup Tab Selector */}
              <div
                role="tablist"
                aria-label="Workspace preview tabs"
                className="flex items-center gap-1 overflow-x-auto border-b border-[var(--border-color)] bg-[var(--bg-main)] px-3 pt-2"
              >
                {(
                  [
                    { id: "notes", emoji: "📝", label: "Live Notes" },
                    { id: "vault", emoji: "📁", label: "500MB File Vault" },
                    { id: "phone", emoji: "📱", label: "Phone to PC" },
                    { id: "security", emoji: "🔒", label: "Password Lock" },
                  ] as const
                ).map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-t-lg border border-b-0 px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)]"
                          : "border-transparent bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Viewport content */}
              <div className="p-4 sm:p-6 min-h-[300px]">
                {/* TAB 1: LIVE NOTES */}
                {activeTab === "notes" && (
                  <div className="grid gap-4 md:grid-cols-12">
                    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 md:col-span-7 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)] text-xs">
                        <span className="font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                          <Code2 className="h-3.5 w-3.5 text-[var(--accent-text)]" />
                          meeting-agenda.md
                        </span>
                        <button
                          type="button"
                          onClick={handleTriggerFormatDemo}
                          className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                        >
                          <Wand2 className="h-3 w-3 text-[var(--accent-text)]" />
                          <span>{isFormattedFlash ? "Cleaned!" : "Tidy Text"}</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-bold text-[var(--text-main)]">
                          Sprint Planning &amp; Tasks
                        </div>
                        <div className="space-y-1.5">
                          {previewTasks.map((task) => (
                            <button
                              key={task.id}
                              type="button"
                              onClick={() => handleTogglePreviewTask(task.id)}
                              className="flex w-full items-center gap-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-left text-xs transition-colors hover:border-[var(--accent-primary)] cursor-pointer"
                            >
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                  task.done
                                    ? "border-[var(--status-success-text)] bg-[var(--status-success-bg)] text-[var(--status-success-text)]"
                                    : "border-[var(--border-color)] bg-[var(--input-bg)]"
                                }`}
                              >
                                {task.done && <Check className="h-3 w-3" />}
                              </span>
                              <span className={task.done ? "text-[var(--text-muted)] line-through" : "text-[var(--text-main)]"}>
                                {task.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                        <span>Click any checklist item above to toggle</span>
                        <span className="text-[var(--accent-text)]">● 3 collaborators editing</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 md:col-span-5 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                          How it works
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          Anyone with the link can write at the same time. There are no save buttons—every word syncs across all open screens automatically in milliseconds.
                        </p>
                        <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs space-y-1.5">
                          <div className="font-semibold text-[var(--text-main)]">What you can write:</div>
                          <div className="text-[var(--text-muted)]">• Bullet points &amp; checklists</div>
                          <div className="text-[var(--text-muted)]">• Code blocks &amp; tables</div>
                          <div className="text-[var(--text-muted)]">• Mermaid flowcharts</div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          size="xs"
                          className="w-full"
                          onClick={handleOpenCustomSpace}
                          iconRight={<ArrowRight className="h-3.5 w-3.5" />}
                        >
                          Try it live now
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: 500MB FILE VAULT */}
                {activeTab === "vault" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--badge-border)] bg-[var(--badge-bg)] text-[var(--accent-text)]">
                          <Upload className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[var(--text-main)]">
                            Drag &amp; drop any file up to 500MB
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)]">
                            Videos, ZIPs, PDFs, APKs, photos, and documents download directly in the browser.
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="xs"
                        icon={<ArrowRight className="h-3.5 w-3.5" />}
                        onClick={handleOpenCustomSpace}
                      >
                        Open Vault
                      </Button>
                    </div>

                    <div className="space-y-2.5">
                      {VAULT_PREVIEW_FILES.map((file) => (
                        <div
                          key={file.id}
                          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-3.5 flex flex-col gap-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--accent-text)]">
                                {file.kind === "video" && <Film className="h-4 w-4" />}
                                {file.kind === "archive" && <FileArchive className="h-4 w-4" />}
                                {file.kind === "doc" && <FileText className="h-4 w-4" />}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate font-semibold text-xs text-[var(--text-main)]">
                                  {file.name}
                                </div>
                                <div className="text-[11px] text-[var(--text-muted)]">
                                  {file.size} • {file.meta}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {file.uploading ? (
                                <span className="rounded-md bg-[var(--badge-bg)] px-2 py-1 font-mono text-[11px] font-medium text-[var(--accent-text)]">
                                  {file.progress}%
                                </span>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyPreviewLink(file.id)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                                  >
                                    {copiedFileId === file.id ? (
                                      <>
                                        <Check className="h-3.5 w-3.5 text-[var(--status-success-text)]" />
                                        <span>Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3.5 w-3.5" />
                                        <span>Copy Link</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleOpenCustomSpace}
                                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--badge-border)] bg-[var(--badge-bg)] px-2.5 py-1 text-xs font-medium text-[var(--accent-text)] hover:opacity-90 cursor-pointer"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Download</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {file.uploading && (
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-main)]">
                              <div
                                className="h-full rounded-full bg-[var(--accent-primary)] transition-all"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: PHONE TO PC */}
                {activeTab === "phone" && (
                  <div className="grid gap-4 md:grid-cols-2 items-center">
                    <div className="flex flex-col justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 space-y-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)] mb-1">
                          <Smartphone className="h-4 w-4 text-[var(--accent-text)]" />
                          Send Photos &amp; Files from Phone to PC
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          Tired of messaging yourself on WhatsApp or using cables? Just scan this QR code with your phone camera to open this exact workspace on your mobile.
                        </p>
                      </div>

                      <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-[var(--status-success-text)]" />
                          <span>No app download or Bluetooth pairing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-[var(--status-success-text)]" />
                          <span>Works on iPhone, iPad, and Android</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-[var(--status-success-text)]" />
                          <span>Drop photos straight onto your desktop</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-center space-y-2">
                      <div className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]">
                        <svg
                          viewBox="0 0 20 20"
                          className="h-28 w-28"
                          role="img"
                          aria-label="Workspace QR code"
                        >
                          {QR_MATRIX.map((row, rIdx) =>
                            row.map((cell, cIdx) =>
                              cell === 1 ? (
                                <rect
                                  key={`${rIdx}-${cIdx}`}
                                  x={cIdx}
                                  y={rIdx}
                                  width="1"
                                  height="1"
                                  fill="var(--text-main)"
                                />
                              ) : null
                            )
                          )}
                        </svg>
                      </div>
                      <div className="font-mono text-xs text-[var(--text-muted)]">
                        Point camera to scan
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: PASSWORD LOCK */}
                {activeTab === "security" && (
                  <div className="grid gap-4 md:grid-cols-2 items-center">
                    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 space-y-3">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-main)]">
                        <Lock className="h-4 w-4 text-[var(--status-success-text)]" />
                        Private Password Protection
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        Sharing sensitive work, client contracts, or private drafts? Set a password in one click. Only people who know the password will be able to view or edit notes and files.
                      </p>
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setIsPreviewLocked((v) => !v)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
                        >
                          {isPreviewLocked ? (
                            <>
                              <Lock className="h-4 w-4 text-[var(--status-success-text)]" />
                              <span>Password Lock: Enabled (Click to test unlock)</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4 text-[var(--text-muted)]" />
                              <span>Password Lock: Disabled (Click to enable)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--status-success-bg)] text-[var(--status-success-text)] mx-auto flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-bold text-[var(--text-main)]">
                        {isPreviewLocked ? "Room is Password-Locked" : "Public Room Mode"}
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {isPreviewLocked
                          ? "Visitors must type the correct password to unlock this room."
                          : "Anyone with the link can open and edit. Add a password whenever you need privacy."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — 3 Simple Steps */}
        <section id="how-it-works" className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2">
                How It Works
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                Start working in 5 seconds with three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 space-y-3">
                <span className="w-8 h-8 rounded-lg bg-[var(--badge-bg)] text-[var(--accent-text)] border border-[var(--badge-border)] flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <h3 className="font-bold text-base text-[var(--text-main)]">Pick Any Name</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Type a custom URL like <code className="px-1.5 py-0.5 rounded bg-[var(--bg-main)] text-[var(--accent-text)] font-mono">/projects/meeting</code> or click Random Space. Your workspace opens right away.
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 space-y-3">
                <span className="w-8 h-8 rounded-lg bg-[var(--badge-bg)] text-[var(--accent-text)] border border-[var(--badge-border)] flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <h3 className="font-bold text-base text-[var(--text-main)]">Type &amp; Drop Files</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Take notes together in real time and attach files up to 500MB. Everyone sees changes live without refreshing the page.
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 space-y-3">
                <span className="w-8 h-8 rounded-lg bg-[var(--badge-bg)] text-[var(--accent-text)] border border-[var(--badge-border)] flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <h3 className="font-bold text-base text-[var(--text-main)]">Share the Link</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Share the link with anyone, scan the QR code from your phone, or add an optional password for private collaboration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Everyday Use Cases */}
        <section id="features" className="border-b border-[var(--border-color)] bg-[var(--bg-main)] py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2">
                Built for Everyday Tasks
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                Fast, friction-free productivity between your devices and your team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-3 hover:border-[var(--accent-primary)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[var(--badge-bg)] text-[var(--accent-text)] flex items-center justify-center">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-[var(--text-main)]">Phone to PC Transfer</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Need to send a photo or document from your phone to your laptop? Scan the workspace QR code on your PC screen, upload the photo from your phone, and download it instantly on PC.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-3 hover:border-[var(--accent-primary)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[var(--badge-bg)] text-[var(--accent-text)] flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-[var(--text-main)]">Live Shared Meeting Notes</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Co-edit meeting minutes, study guides, or brainstorm lists with friends or coworkers. Zero sign-up, zero Google Drive access requests, and zero delay.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-3 hover:border-[var(--accent-primary)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[var(--badge-bg)] text-[var(--accent-text)] flex items-center justify-center">
                  <HardDrive className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-[var(--text-main)]">500MB Quick File Drop</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Email attachment capped at 25MB? Drop heavy videos, ZIP files, PDFs, or design assets up to 500MB and send a single link that downloads directly in the browser.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-3 hover:border-[var(--accent-primary)] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[var(--badge-bg)] text-[var(--accent-text)] flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-[var(--text-main)]">Password-Locked Sharing</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Sharing sensitive client work, credentials, or personal notes? Add an optional password so only authorized people with the passphrase can view the content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Comparison Matrix */}
        <section id="compare" className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2">
                Why People Prefer FileShare
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                See how FileShare compares to traditional cloud drives and paste tools.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs">
              <table className="w-full min-w-[640px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
                    <th className="px-4 py-3.5 font-bold text-[var(--text-main)]">Feature</th>
                    <th className="border-x border-[var(--badge-border)] bg-[var(--badge-bg)] px-4 py-3.5 font-bold text-[var(--accent-text)]">
                      FileShare
                    </th>
                    <th className="px-4 py-3.5 font-medium text-[var(--text-muted)]">Google Drive</th>
                    <th className="px-4 py-3.5 font-medium text-[var(--text-muted)]">Standard Pastebin</th>
                    <th className="px-4 py-3.5 font-medium text-[var(--text-muted)]">WeTransfer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)] text-xs text-[var(--text-muted)]">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-[var(--text-main)]">
                        {row.feature}
                      </td>
                      <td className="border-x border-[var(--badge-border)] bg-[var(--badge-bg)] px-4 py-3.5 font-semibold text-[var(--status-success-text)]">
                        <span className="flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 shrink-0" />
                          <span>{row.fileshare}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5">{row.drive}</td>
                      <td className="px-4 py-3.5">{row.pastebin}</td>
                      <td className="px-4 py-3.5">{row.wetransfer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Guides & Resources Section */}
        {ARTICLES.length > 0 && (
          <section id="guides" className="border-b border-[var(--border-color)] bg-[var(--bg-main)] py-14 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-1">
                    Helpful Guides &amp; Tips
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                    Quick tutorials on getting the most out of your workspaces.
                  </p>
                </div>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-text)] hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>View all guides</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ARTICLES.slice(0, 3).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/resources/${article.slug}`}
                    className="group rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 hover:border-[var(--accent-primary)] hover:bg-[var(--bg-card-hover)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] mb-2">
                        <span className="text-[var(--accent-text)] font-semibold">{article.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--accent-text)] transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed mb-4">
                        {article.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                      <span>{article.date}</span>
                      <span className="font-semibold text-[var(--accent-text)] flex items-center gap-1">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section id="faq" className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                Everything you need to know about FileShare.
              </p>
            </div>

            <div className="divide-y divide-[var(--border-color)] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={item.question}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--bg-card-hover)] cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-[var(--text-main)]">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[var(--accent-text)]" : "text-[var(--text-muted)]"
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-[var(--text-muted)]">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-[var(--bg-main)] py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              Start in 5 seconds. No account needed.
            </h2>
            <p className="text-xs sm:text-base text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
              Open a free workspace right now. Take live notes, send large files up to 500MB, and share with anyone through a single link.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={<Zap className="h-4 w-4" />}
                onClick={handleRandomSpace}
                className="w-full sm:w-auto !px-6 !py-3"
              >
                Create Instant Workspace ⚡
              </Button>
              <Button
                variant="secondary"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  inputRef.current?.focus();
                }}
                className="w-full sm:w-auto !px-6 !py-3"
              >
                Choose Custom Link
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Recent Spaces History Modal */}
      <Modal
        open={isRecentModalOpen}
        onClose={() => setIsRecentModalOpen(false)}
        title={`Recent Workspaces (${recentSpaces.length})`}
        footer={
          <div className="flex w-full items-center justify-between gap-2">
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              disabled={recentSpaces.length === 0}
              onClick={() => {
                clearRecentSpaces();
                setRecentQuery("");
              }}
            >
              Clear History
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsRecentModalOpen(false)}
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          {recentSpaces.length > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 focus-within:border-[var(--accent-primary)]">
              <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              <input
                type="text"
                value={recentQuery}
                onChange={(e) => setRecentQuery(e.target.value)}
                placeholder="Search your workspaces..."
                aria-label="Filter recent workspaces"
                className="w-full bg-transparent text-xs text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
              />
              {recentQuery && (
                <button
                  type="button"
                  onClick={() => setRecentQuery("")}
                  aria-label="Clear filter"
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {sortedRecentSpaces.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-8 text-center">
              <History className="mx-auto h-6 w-6 text-[var(--text-muted)] opacity-50" />
              <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                {recentSpaces.length === 0
                  ? "No recent spaces yet"
                  : "No matching workspaces found"}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {recentSpaces.length === 0
                  ? "Rooms you visit will appear here so you can easily return to them."
                  : "Try searching for a different room name."}
              </p>
            </div>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {sortedRecentSpaces.map((space) => (
                <li
                  key={space.slug}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2.5 transition-colors hover:border-[var(--accent-primary)]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecentModalOpen(false);
                      navigateToSpace(space.slug);
                    }}
                    className="flex min-w-0 flex-1 flex-col text-left cursor-pointer"
                  >
                    <span className="truncate font-mono text-xs font-semibold text-[var(--text-main)]">
                      /projects/{space.slug}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                      {space.pinned && (
                        <span className="rounded bg-[var(--badge-bg)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent-text)]">
                          Pinned
                        </span>
                      )}
                      <span>
                        {clientNow
                          ? formatRelativeTime(space.lastVisited, clientNow)
                          : "Visited recently"}
                      </span>
                    </span>
                  </button>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => togglePin(space.slug)}
                      title={space.pinned ? "Unpin space" : "Pin space"}
                      aria-label={
                        space.pinned
                          ? `Unpin ${space.slug}`
                          : `Pin ${space.slug}`
                      }
                      className={`rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-card-hover)] cursor-pointer ${
                        space.pinned
                          ? "text-[var(--accent-text)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      {space.pinned ? (
                        <PinOff className="h-3.5 w-3.5" />
                      ) : (
                        <Pin className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => removeRecentSpace(space.slug)}
                      title="Remove from history"
                      aria-label={`Remove ${space.slug} from history`}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--status-danger-text)] cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
}
