"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Pencil, Lock, Unlock, Copy, CheckCheck, QrCode, PanelRightClose, PanelRightOpen, MoreVertical } from "lucide-react";
import dynamic from "next/dynamic";
import { showToast } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { copyToClipboard } from "@/lib/clipboard";
import { FloatingMenu } from "@/components/ui/FloatingMenu";

const QRCodeModal = dynamic(() => import("@/components/QRCodeModal").then((m) => m.QRCodeModal), { ssr: false });
const RenameSlugModal = dynamic(() => import("@/components/RenameSlugModal").then((m) => m.RenameSlugModal), { ssr: false });

interface SlugBarProps {
  slug:        string;
  isProtected: boolean;
  token:       string | null;
  onLockClick: () => void;
  onToggleFilePanel?: () => void;
  filePanelOpen?: boolean;
}

export function SlugBar({ slug, isProtected, token, onLockClick, onToggleFilePanel, filePanelOpen }: SlugBarProps) {
  const [copied,          setCopied]          = useState(false);
  const [showQR,          setShowQR]          = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMoreMenu,    setShowMoreMenu]    = useState(false);
  const moreMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Dismiss the mobile More menu on Escape for keyboard users
  useEffect(() => {
    if (!showMoreMenu) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowMoreMenu(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showMoreMenu]);

  async function copyLink() {
    const prefix = typeof window !== "undefined" && window.location.pathname.startsWith("/projects") ? "/projects" : "/s";
    const url = `${window.location.origin}${prefix}/${slug}`;
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      showToast("Workspace link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Failed to copy link", "error");
    }
  }

  return (
    <nav aria-label="Workspace toolbar" className="flex items-center justify-between gap-1 sm:gap-2.5 w-full min-w-0 max-w-full h-full select-none overflow-visible flex-nowrap">
      {/* Workspace Brand & Interactive Workspace Pill */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink flex-1 overflow-hidden flex-nowrap">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="group flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-pointer no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded-lg touch-manipulation flex-nowrap"
          title="FileShare Home"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl overflow-hidden p-[1.5px] bg-[var(--accent-primary)] shadow-xs transition-opacity group-hover:opacity-90 shrink-0">
            <div className="w-full h-full rounded-[6px] sm:rounded-[9px] overflow-hidden bg-[var(--bg-surface)] flex items-center justify-center">
              <picture>
                <source srcSet="/logo.webp" type="image/webp" />
                <img
                  src="/logo.png"
                  alt="FileShare Logo"
                  width={32}
                  height={32}
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
          </div>
          <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--text-main)] hidden sm:inline group-hover:text-[var(--accent-primary)] transition-colors whitespace-nowrap">
            FileShare
          </span>
        </Link>

        {/* Interactive Workspace Slug Pill */}
        <button
          type="button"
          onClick={() => setShowRenameModal(true)}
          title={`Edit workspace: ${slug}`}
          aria-label={`Workspace slug: ${slug}. Click to rename or manage.`}
          className="group/pill flex items-center gap-1.5 h-9 sm:h-9 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 active:scale-95 transition-colors cursor-pointer min-w-0 shrink max-w-full touch-manipulation flex-nowrap"
        >
          <span className="text-xs sm:text-sm font-semibold text-[var(--text-main)] group-hover/pill:text-[var(--accent-primary)] truncate max-w-[65px] min-[360px]:max-w-[100px] min-[400px]:max-w-[140px] min-[440px]:max-w-[180px] sm:max-w-[260px] font-mono tracking-tight transition-colors min-w-0">
            {slug}
          </span>
          <Pencil size={12} className="text-[var(--text-muted)] group-hover/pill:text-[var(--accent-primary)] transition-colors shrink-0" aria-hidden="true" />
        </button>
      </div>

      {/* Header Actions Toolbar */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto flex-nowrap" role="toolbar" aria-label="Workspace actions">
        {/* Desktop QR Code Button */}
        <button
          type="button"
          onClick={() => setShowQR(true)}
          className="hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center shrink-0 rounded-lg sm:rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] active:scale-95 transition-colors cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex-nowrap"
          title="Show workspace QR code"
          aria-label="Show workspace QR code"
        >
          <QrCode size={17} aria-hidden="true" />
        </button>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={copyLink}
          className={`
            h-9 w-9 sm:h-10 sm:w-auto px-0 sm:px-3 flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium active:scale-95 transition-colors border cursor-pointer shrink-0 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex-nowrap
            ${copied
              ? "bg-[var(--status-success-bg)] text-[var(--status-success-text)] border-[var(--status-success-border)]"
              : "bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border-[var(--border-color)]"
            }
          `}
          title={copied ? "Link copied to clipboard" : "Copy workspace link"}
          aria-label={copied ? "Link copied to clipboard" : "Copy workspace link"}
        >
          {copied ? (
            <CheckCheck size={16} className="text-[var(--status-success-text)] shrink-0" aria-hidden="true" />
          ) : (
            <Copy size={16} className="text-[var(--text-muted)] shrink-0" aria-hidden="true" />
          )}
          <span className="hidden sm:inline whitespace-nowrap">{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        {/* Password Protection Button */}
        <button
          type="button"
          onClick={onLockClick}
          title={isProtected ? "Workspace is password protected (click to manage)" : "Set workspace password"}
          aria-label={isProtected ? "Workspace is password protected" : "Set workspace password"}
          className={`
            h-9 w-9 sm:h-10 sm:w-auto px-0 sm:px-3 flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors border cursor-pointer shrink-0 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex-nowrap
            ${isProtected
              ? "bg-[var(--badge-bg)] text-[var(--badge-text)] border-[var(--badge-border)] hover:brightness-105"
              : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border-[var(--border-color)]"
            }
          `}
        >
          {isProtected ? (
            <Lock size={16} className="text-[var(--badge-text)] shrink-0" aria-hidden="true" />
          ) : (
            <Unlock size={16} className="shrink-0" aria-hidden="true" />
          )}
          <span className="hidden sm:inline whitespace-nowrap">{isProtected ? "Protected" : "Protect"}</span>
        </button>

        {/* Desktop GitHub Link */}
        <a
          href="https://github.com/sandeshPatel06/file-share"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center shrink-0 rounded-lg sm:rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex-nowrap"
          title="View GitHub repository"
          aria-label="View GitHub repository"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/github-icon.svg" alt="" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
        </a>

        {/* Desktop Theme Toggle */}
        <div className="hidden sm:flex items-center shrink-0">
          <ThemeToggle />
        </div>

        {/* Mobile More Actions Menu */}
        <div className="relative sm:hidden flex items-center shrink-0">
          <button
            ref={moreMenuButtonRef}
            type="button"
            onClick={() => setShowMoreMenu((prev) => !prev)}
            aria-label="More workspace tools"
            aria-expanded={showMoreMenu}
            title="More workspace tools"
            className="h-9 w-9 flex items-center justify-center shrink-0 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] active:scale-95 transition-colors cursor-pointer min-h-[36px] min-w-[36px] touch-manipulation flex-nowrap"
          >
            <MoreVertical size={16} aria-hidden="true" />
          </button>
          {showMoreMenu && (
            <>
              <div
                className="fixed inset-0 z-[61]"
                onClick={() => setShowMoreMenu(false)}
                aria-hidden="true"
              />
              <FloatingMenu
                open={showMoreMenu}
                anchorRef={moreMenuButtonRef}
                placement="bottom-end"
                className="w-48 max-w-[calc(100vw-1rem)] rounded-xl bg-[var(--modal-bg)] border border-[var(--border-color)] shadow-xl p-1.5 flex flex-col gap-0.5 text-xs font-medium z-[62]"
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    setShowQR(true);
                  }}
                  aria-label="Show QR code"
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-card-hover)] flex items-center gap-2.5 text-[var(--text-main)] cursor-pointer min-h-[40px] transition-colors"
                >
                  <QrCode size={16} className="text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                  <span>Show QR Code</span>
                </button>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--bg-card-hover)] min-h-[40px] transition-colors">
                  <span className="text-[var(--text-main)]">Theme Mode</span>
                  <ThemeToggle />
                </div>
                <a
                  href="https://github.com/sandeshPatel06/file-share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-card-hover)] flex items-center gap-2.5 text-[var(--text-main)] cursor-pointer min-h-[40px] transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/github-icon.svg" alt="" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
                  <span>GitHub Project</span>
                </a>
              </FloatingMenu>
            </>
          )}
        </div>

        {/* File Panel Toggle */}
        {onToggleFilePanel && (
          <button
            type="button"
            onClick={onToggleFilePanel}
            aria-pressed={filePanelOpen}
            title={filePanelOpen ? "Close file vault" : "Open file vault"}
            aria-label={filePanelOpen ? "Close file vault" : "Open file vault"}
            className={`
              h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center shrink-0 rounded-lg sm:rounded-xl border transition-colors cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] touch-manipulation flex-nowrap
              ${filePanelOpen
                ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/25"
                : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border-[var(--border-color)] hover:bg-[var(--bg-card-hover)]"
              }
            `}
          >
            {filePanelOpen ? <PanelRightClose size={17} aria-hidden="true" /> : <PanelRightOpen size={17} aria-hidden="true" />}
          </button>
        )}
      </div>

      <QRCodeModal
        open={showQR}
        onClose={() => setShowQR(false)}
        slug={slug}
      />

      <RenameSlugModal
        key={showRenameModal ? `${slug}-open` : `${slug}-closed`}
        open={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        slug={slug}
        token={token}
      />
    </nav>
  );
}
