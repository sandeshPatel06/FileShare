import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  Code2,
  Sparkles,
  Shield,
  HardDrive,
  QrCode,
  Zap,
  Lock,
  Workflow,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Layers,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Footer } from "@/components/Footer";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";
import { ADSENSE_SLOTS } from "@/lib/ads";

const AdSenseScript = dynamic(() => import("@/components/ads/AdSenseScript").then((m) => m.AdSenseScript));
const AdBanner = dynamic(() => import("@/components/ads/AdBanner").then((m) => m.AdBanner));

const appUrl = getAppUrl();

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "User Guide & Documentation | FileShare",
  description: "Learn how to use FileShare: real-time notes, one-click formatting, simple diagrams, file sharing up to 500 MB, and password protection without creating an account.",
  keywords: [
    "FileShare user guide",
    "FileShare documentation",
    "collaborative markdown tutorial",
    "real-time notes documentation",
    "how to use online notepad without login",
    "mermaid diagrams tutorial",
    "file vault manual",
    "private temporary workspace guide",
  ],
  alternates: {
    canonical: `${appUrl}/guide`,
  },
  openGraph: {
    title: "User Guide & Documentation | FileShare",
    description: "Learn how to use FileShare: real-time notes, one-click formatting, simple diagrams, file sharing up to 500 MB, and password protection without creating an account.",
    url: `${appUrl}/guide`,
    siteName: "FileShare",
    locale: "en_US",
    type: "website",
    images: getDefaultOgImages(
      appUrl,
      "FileShare Documentation & User Guide"
    ),
  },
  twitter: {
    card: "summary_large_image",
    site: "@SandeshPat007",
    creator: "@SandeshPat007",
    title: "User Guide & Documentation | FileShare",
    description: "Learn how to use FileShare: real-time notes, one-click formatting, simple diagrams, file sharing up to 500 MB, and password protection without creating an account.",
    images: [`${appUrl}/og-image.png`],
  },
};

export default function GuidePage() {
  // NOTE: must match the visible Section-10 FAQ copy exactly.
  const guideFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${appUrl}/guide#faq`,
    "url": `${appUrl}/guide`,
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long are files and notes stored on FileShare?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Workspaces stay active as long as you use them. Spaces inactive for more than 30 days may be cleaned up automatically to free storage. Always export important notes or files to your own device if you need to keep them permanently."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if two people edit the same workspace simultaneously?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Edits sync in real time across all open tabs. If multiple people are writing at once, we recommend editing under different headings to avoid overwriting each other's changes."
        }
      },
      {
        "@type": "Question",
        "name": "Can I rename my workspace link?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Click the workspace name in the header to rename it. Any files you already uploaded will automatically stay linked to the new workspace name."
        }
      },
      {
        "@type": "Question",
        "name": "Are there any file type restrictions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can upload almost any standard file up to 500 MB, including PDFs, images, videos, audio, and ZIP archives. Malware, illegal material, and harmful scripts are strictly prohibited."
        }
      }
    ]
  };

  const guideHowToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${appUrl}/guide#howto`,
    "name": "How to Use FileShare: Fast Notes and Easy File Sharing",
    "description": "Simple step-by-step instructions for creating a workspace, taking notes, sharing files up to 500MB, and protecting your work on FileShare.",
    "url": `${appUrl}/guide`,
    "image": `${appUrl}/logo.png`,
    "totalTime": "PT5M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Create or Open a Workspace",
        "text": "Go to FileShare and click 'New Space' or type any address like /s/my-notes in your browser. The space opens instantly with no login or sign-up needed.",
        "url": `${appUrl}/guide#section-1`
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Write Notes and Make Lists",
        "text": "Type in the editor on the left using simple Markdown. The right side shows a clean live preview with clickable to-do checkboxes.",
        "url": `${appUrl}/guide#section-2`
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Draw Simple Visual Diagrams",
        "text": "Add ```mermaid code blocks to turn simple text lists into clean flowcharts and diagrams automatically.",
        "url": `${appUrl}/guide#section-4`
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Upload Files and Photos",
        "text": "Drag and drop any files, photos, or documents up to 500MB into the file vault. Preview pictures and play audio or video right in your browser.",
        "url": `${appUrl}/guide#section-6`
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Lock with a Password and Open on Your Phone",
        "text": "Set a quick password to keep your notes private, or click the QR code icon to scan and open your workspace on your phone instantly.",
        "url": `${appUrl}/guide#section-7`
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${appUrl}/guide#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": appUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "User Guide",
        "item": `${appUrl}/guide`
      }
    ]
  };

  return (
    <div className="min-h-dvh bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideHowToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Conditionally load AdSense on this guide */}
      <AdSenseScript />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--header-bg)] border-b border-[var(--border-color)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight">
            <div className="w-7 h-7 rounded-md bg-[var(--accent-primary)] flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <span>FileShare</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
            <Link href="/resources" className="hover:text-[var(--text-main)] transition-colors">Resources</Link>
            <Link href="/about" className="hover:text-[var(--text-main)] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[var(--text-main)] transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Guide Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Title & Introduction */}
        <div className="mb-10 border-b border-[var(--border-color)] pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>User Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            How to Use FileShare
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            A simple, step-by-step guide to writing notes, sharing files up to 500&nbsp;MB, and working together in real time: no account or sign-up needed.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-[var(--text-subtle)]">
            <span>Updated 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>~4 min read</span>
          </div>
        </div>

        {/* Quick Table of Contents */}
        <nav aria-label="Table of Contents" className="mb-10 p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <h2 className="text-xs uppercase font-mono tracking-wider text-[var(--text-subtle)] dark:text-[var(--text-muted)] mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--accent-primary)]" />
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-[var(--text-muted)]">
            <a href="#section-1" className="hover:text-[var(--text-main)] hover:underline">1. Create or Open a Space</a>
            <a href="#section-2" className="hover:text-[var(--text-main)] hover:underline">2. Write Notes &amp; To-Do Lists</a>
            <a href="#section-3" className="hover:text-[var(--text-main)] hover:underline">3. Tidy Notes in One Click</a>
            <a href="#section-4" className="hover:text-[var(--text-main)] hover:underline">4. Draw Simple Diagrams</a>
            <a href="#section-5" className="hover:text-[var(--text-main)] hover:underline">5. Work Together in Real Time</a>
            <a href="#section-6" className="hover:text-[var(--text-main)] hover:underline">6. Share Files (Up to 500 MB)</a>
            <a href="#section-7" className="hover:text-[var(--text-main)] hover:underline">7. Protect with a Password</a>
            <a href="#section-8" className="hover:text-[var(--text-main)] hover:underline">8. Open on Phone via QR Code</a>
            <a href="#section-9" className="hover:text-[var(--text-main)] hover:underline">9. Keyboard Shortcuts</a>
            <a href="#section-10" className="hover:text-[var(--text-main)] hover:underline">10. Frequently Asked Questions</a>
          </div>
        </nav>

        {/* SECTION 1 */}
        <section id="section-1" className="my-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              1
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Create or Open a Space
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Every space on FileShare has its own web address starting with <code className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] font-mono text-xs text-[var(--accent-primary)]">/s/[name]</code>. You never have to create an account, remember a username, or check your email. Just open a link and start writing immediately.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <h3 className="font-semibold text-sm mb-1 text-[var(--text-main)]">Pick Your Own Name</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Choose any easy-to-remember name you want, like <code className="font-mono text-[var(--accent-primary)]">/s/class-notes</code> or <code className="font-mono text-[var(--accent-primary)]">/s/project-ideas</code>. You can use lowercase letters, numbers, and dashes (up to 48 characters).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <h3 className="font-semibold text-sm mb-1 text-[var(--text-main)]">Get a Random Private Name</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Click <strong>&quot;New Space&quot;</strong> on the home page to get a randomly generated name (like <code className="font-mono text-[var(--accent-primary)]">/s/swift-falcon-7492</code>). Random names are hard for strangers to guess, making them great for private notes or quick file transfers.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Whenever you or a friend open a new workspace link, FileShare creates it automatically. If it already exists, your saved notes and files load right away.
          </p>
        </section>

        {/* SECTION 2 */}
        <section id="section-2" className="my-10 space-y-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              2
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Write Notes &amp; To-Do Lists
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            The screen is split into two panels: type your text on the left, and see your clean formatted notes appear on the right. You can use simple symbols to add headings, bold text, bullet points, and to-do lists.
          </p>
          <div className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-color)] space-y-3">
            <h3 className="font-semibold text-sm text-[var(--text-main)]">Quick Formatting Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                <div className="text-[var(--accent-primary)] font-bold mb-1">Headings &amp; Styles</div>
                <div className="text-[var(--text-muted)]"># Big Heading</div>
                <div className="text-[var(--text-muted)]">## Medium Heading</div>
                <div className="text-[var(--text-muted)]">### Small Heading</div>
                <div className="text-[var(--text-muted)]">**Bold text** | *Italic text*</div>
              </div>
              <div className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-color)]">
                <div className="text-[var(--accent-primary)] font-bold mb-1">Lists &amp; Checkboxes</div>
                <div className="text-[var(--text-muted)]">- [ ] To-do item</div>
                <div className="text-[var(--text-muted)]">- [x] Completed item</div>
                <div className="text-[var(--text-muted)]">1. Numbered list</div>
                <div className="text-[var(--text-muted)]">&gt; Quote or note</div>
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            <strong>Interactive Checklists:</strong> You can click any checkbox directly in the preview on the right to check off tasks. Your notes update automatically and the checked box updates on all connected screens right away.
          </p>
        </section>

        {/* SECTION 3 */}
        <section id="section-3" className="my-10 space-y-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              3
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Tidy Notes in One Click
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            If your notes get messy while typing quickly during a meeting or class, use the built-in formatter. Click the <strong>Format</strong> button (<Sparkles className="w-3.5 h-3.5 inline text-[var(--accent-primary)]" />) in the editor toolbar or press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-xs">Cmd/Ctrl + Shift + F</kbd> to clean up headings, task lists, and spacing automatically.
          </p>
          <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-main)]">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              What the Cleaner Tidies Up:
            </div>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[var(--text-muted)]">
              <li><strong>Headings:</strong> Fixes missing spaces after <code className="font-mono">#</code> symbols (turns <code className="font-mono">##Heading</code> into <code className="font-mono">## Heading</code>).</li>
              <li><strong>Bullet Lists:</strong> Converts messy asterisks and plus signs into neat, consistent dash bullets (<code className="font-mono">-</code>).</li>
              <li><strong>Code Snippets:</strong> Keeps your code blocks and spacing intact without altering your text.</li>
              <li><strong>Extra Spacing:</strong> Removes unnecessary blank lines so your notes look tidy and readable.</li>
            </ul>
          </div>
        </section>

        {/* Safe In-Content Ad Unit 1: Placed after 3 complete editorial sections */}
        <AdBanner slot={ADSENSE_SLOTS.guideSection1} className="max-w-3xl mx-auto" />

        {/* SECTION 4 */}
        <section id="section-4" className="my-10 space-y-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              4
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Draw Simple Diagrams
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            You can turn simple text into visual flowcharts and charts right inside your notes without drawing tools or separate apps. Just type a <code className="font-mono text-xs">```mermaid</code> block, and FileShare renders it as a clean visual graphic in the preview.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <h3 className="font-semibold text-xs sm:text-sm mb-2 text-[var(--text-main)] flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-[var(--accent-primary)]" />
                Flowchart Example
              </h3>
              <pre className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] dark:text-[var(--text-main)] overflow-x-auto">
{`\`\`\`mermaid
flowchart TD
    Start[Open workspace link] --> Notes[Type notes together]
    Start --> Files[Drop in photos or files]
    Notes --> Done[All saved instantly]
    Files --> Done
\`\`\``}
              </pre>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <h3 className="font-semibold text-xs sm:text-sm mb-2 text-[var(--text-main)] flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[var(--accent-primary)]" />
                Step-by-Step Sequence Example
              </h3>
              <pre className="p-3 rounded bg-[var(--bg-main)] border border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)] dark:text-[var(--text-main)] overflow-x-auto">
{`\`\`\`mermaid
sequenceDiagram
    You->>Screen: Type a note
    Screen->>FileShare: Saves automatically
    FileShare-->>Friend: Appears on their screen
\`\`\``}
              </pre>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Because your diagrams are written in plain text, you can edit, copy, or update them in seconds just like regular words.
          </p>
        </section>

        {/* SECTION 5 */}
        <section id="section-5" className="my-10 space-y-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              5
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Work Together in Real Time
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Share your workspace link with anyone to work together instantly. Whatever you type appears immediately on all open screens without refreshing.
          </p>
          <div className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-color)] space-y-3">
            <h3 className="font-semibold text-sm text-[var(--text-main)] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
              How Live Sync Works:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[var(--text-muted)]">
              <li><strong>Automatic Saving:</strong> Every change saves automatically as you type. You never have to look for a save button.</li>
              <li><strong>Smooth Typing Protection:</strong> If someone else types while you are actively writing, FileShare protects your current paragraph so your cursor never jumps.</li>
              <li><strong>Helpful Tip:</strong> When working with others at the same time, write under different headings so you do not type over each other.</li>
            </ul>
          </div>
        </section>

        {/* SECTION 6 */}
        <section id="section-6" className="my-10 space-y-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              6
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Share Files (Up to 500 MB)
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Every workspace includes a file vault on the right side of the screen. You can upload and share files up to 500&nbsp;MB each.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <HardDrive className="w-5 h-5 text-[var(--accent-primary)] mb-2" />
              <h3 className="font-semibold text-sm mb-1 text-[var(--text-main)]">Large File Vault</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Upload photos, videos, PDFs, ZIP folders, audio tracks, or documents with simple drag-and-drop.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <Sparkles className="w-5 h-5 text-[var(--accent-primary)] mb-2" />
              <h3 className="font-semibold text-sm mb-1 text-[var(--text-main)]">Instant Previews</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Click any file to view pictures, play music or videos, or read PDFs directly in your browser.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <Shield className="w-5 h-5 text-[var(--accent-primary)] mb-2" />
              <h3 className="font-semibold text-sm mb-1 text-[var(--text-main)]">Fast Downloads</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Download files at full speed anytime, or share direct download links with friends and coworkers.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7 */}
        <section id="section-7" className="my-10 space-y-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              7
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Protect with a Password
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Workspaces are open to anyone with the link by default. If you want privacy for personal notes or sensitive files, you can lock your workspace with a password in seconds.
          </p>
          <div className="bg-[var(--bg-surface)] p-5 rounded-xl border border-[var(--border-color)] space-y-4">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text-main)]">
              <Lock className="w-4 h-4 text-[var(--accent-primary)]" />
              How Password Protection Works:
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              <p>
                <strong>Setting a Password:</strong> Click the <strong>Lock</strong> icon at the top of the screen, type a password, and click save. Anyone who visits the link will need to enter this password before they can see notes or download files.
              </p>
              <p>
                <strong>Temporary Session:</strong> Once you enter the password, your browser tab stays unlocked while you work. When you close the tab, the workspace locks again. Your password is protected using secure one-way hashing on the server.
              </p>
              <p>
                <strong>Changing or Removing:</strong> Anyone who knows the password can change it or remove it at any time from the same lock menu.
              </p>
            </div>
          </div>
        </section>

        {/* Safe In-Content Ad Unit 2: Placed deep in editorial reading flow */}
        <AdBanner slot={ADSENSE_SLOTS.guideSection2} className="max-w-3xl mx-auto" />

        {/* SECTION 8 */}
        <section id="section-8" className="my-10 space-y-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              8
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Open on Phone via QR Code
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Need to open your notes on your phone or upload photos quickly? You do not need to email links to yourself or type long web addresses.
          </p>
          <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center shrink-0">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              <p className="mb-2">
                Click the <strong>QR Code icon</strong> in the top menu of your workspace to show a QR code on your computer screen.
              </p>
              <p>
                Point your phone camera at the screen and tap the notification link to open the space immediately. It is the easiest way to take photos directly into the file vault or read notes on the go.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 9 */}
        <section id="section-9" className="my-10 space-y-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              9
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Keyboard Shortcuts
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Speed up your writing with these handy keyboard shortcuts:
          </p>
          <div className="overflow-x-auto max-w-full">
            <table className="w-full min-w-[640px] text-left text-xs border border-[var(--border-color)] rounded-xl overflow-hidden">
              <thead className="bg-[var(--bg-surface)] font-mono text-[var(--text-subtle)] dark:text-[var(--text-muted)] border-b border-[var(--border-color)]">
                <tr>
                  <th className="p-3">Action</th>
                  <th className="p-3">Mac</th>
                  <th className="p-3">Windows / Linux</th>
                  <th className="p-3">What it does</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-muted)]">
                <tr>
                  <td className="p-3 font-semibold text-[var(--text-main)]">Format Document</td>
                  <td className="p-3 font-mono whitespace-nowrap">Cmd + Shift + F</td>
                  <td className="p-3 font-mono whitespace-nowrap">Ctrl + Shift + F</td>
                  <td className="p-3">Cleans headings, lists, and spacing in one click</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[var(--text-main)]">Force Save Notes</td>
                  <td className="p-3 font-mono whitespace-nowrap">Cmd + S</td>
                  <td className="p-3 font-mono whitespace-nowrap">Ctrl + S</td>
                  <td className="p-3">Instantly saves notes to server without waiting for debounce</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[var(--text-main)]">Command Palette</td>
                  <td className="p-3 font-mono whitespace-nowrap">/ (Slash)</td>
                  <td className="p-3 font-mono whitespace-nowrap">/ (Slash)</td>
                  <td className="p-3">Opens insert menu for headings, tables, checklists, and diagrams</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-[var(--text-main)]">Dismiss / Exit Zen</td>
                  <td className="p-3 font-mono whitespace-nowrap">Esc</td>
                  <td className="p-3 font-mono whitespace-nowrap">Esc</td>
                  <td className="p-3">Exits full-screen Zen mode and closes open popups</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 10 */}
        <section id="section-10" className="my-10 space-y-4 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] text-white font-bold flex shrink-0 items-center justify-center text-sm">
              10
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)] min-w-0">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <h3 className="font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[var(--accent-primary)]" />
                How long are files and notes stored on FileShare?
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Workspaces stay active as long as you use them. Spaces inactive for more than 30 days may be cleaned up automatically to free storage. Always export important notes or files to your own device if you need to keep them permanently.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <h3 className="font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[var(--accent-primary)]" />
                What happens if two people edit the same workspace simultaneously?
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Edits sync in real time across all open tabs. If multiple people are writing at once, we recommend editing under different headings to avoid overwriting each other&apos;s changes.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <h3 className="font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[var(--accent-primary)]" />
                Can I rename my workspace link?
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Yes. Click the workspace name in the header to rename it. Any files you already uploaded will automatically stay linked to the new workspace name.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
              <h3 className="font-bold text-[var(--text-main)] mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[var(--accent-primary)]" />
                Are there any file type restrictions?
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                You can upload almost any standard file up to 500 MB, including PDFs, images, videos, audio, and ZIP archives. Malware, illegal material, and harmful scripts are strictly prohibited.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Footer Box */}
        <div className="my-8 sm:my-12 p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center max-w-2xl mx-auto">
          <CheckCircle2 className="w-8 h-8 text-[var(--status-success-text)] mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Ready to Get Started?</h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-5 leading-relaxed">
            Create your first workspace in seconds. No registration or setup needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Open a Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/resources"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-xs sm:text-sm font-semibold hover:bg-[var(--bg-surface)] transition-colors inline-flex items-center justify-center"
            >
              Browse Resources
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}