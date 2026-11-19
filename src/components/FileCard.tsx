"use client";

import { useState } from "react";
import {
  Download, Trash2, File, FileText, Image as ImageIcon,
  FileArchive, FileAudio, FileVideo, Eye, Copy, Check,
  FileSpreadsheet, Presentation, FileCode,
} from "lucide-react";
import { FileItem } from "@/hooks/useFileList";
import { showToast } from "@/components/ui/Toast";
import { FilePreviewModal } from "@/components/FilePreviewModal";
import { copyToClipboard } from "@/lib/clipboard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface FileCardProps {
  file: FileItem;
  slug: string;
  token: string | null;
  layout?: "list" | "grid";
}

const EXT_IMAGE = /^(JPG|JPEG|PNG|GIF|WEBP|SVG|ICO|BMP|TIFF)$/;
const EXT_AUDIO = /^(MP3|WAV|OGG|FLAC|AAC|M4A|WMA)$/;
const EXT_VIDEO = /^(MP4|WEBM|MKV|AVI|MOV|WMV|FLV)$/;
const EXT_SHEET = /^(XLS|XLSX|CSV|TSV|ODS)$/;
const EXT_SLIDE = /^(PPT|PPTX|KEY|ODP)$/;
const EXT_DOC = /^(DOC|DOCX|ODT|RTF)$/;
const EXT_ARCHIVE = /^(ZIP|RAR|7Z|TAR|GZ|BZ2|XZ)$/;
const EXT_CODE = /^(JS|TS|TSX|JSX|PY|HTML|CSS|JSON|SH|C|CPP|GO|RS|JAVA|PHP|RB|SQL|MD|XML|YAML|YML)$/;

function getIconConfig(mimetype: string, ext: string) {
  if (mimetype.startsWith("image/") || EXT_IMAGE.test(ext))
    return { Icon: ImageIcon, color: "text-[var(--accent-sky)]" };
  if (mimetype.startsWith("audio/") || EXT_AUDIO.test(ext))
    return { Icon: FileAudio, color: "text-[var(--accent-indigo)]" };
  if (mimetype.startsWith("video/") || EXT_VIDEO.test(ext))
    return { Icon: FileVideo, color: "text-[var(--status-danger-text)]" };
  if (mimetype === "application/pdf" || ext === "PDF")
    return { Icon: FileText, color: "text-[var(--accent-primary)]" };
  if (EXT_SHEET.test(ext) || /spreadsheet|excel/i.test(mimetype) || mimetype === "text/csv")
    return { Icon: FileSpreadsheet, color: "text-[var(--status-success-text)]" };
  if (EXT_SLIDE.test(ext) || /presentation|powerpoint/i.test(mimetype))
    return { Icon: Presentation, color: "text-[var(--text-muted)]" };
  if (EXT_DOC.test(ext) || /wordprocessingml|msword/i.test(mimetype))
    return { Icon: FileText, color: "text-[var(--accent-sky)]" };
  if (EXT_ARCHIVE.test(ext) || /zip|compressed|archive/i.test(mimetype))
    return { Icon: FileArchive, color: "text-[var(--accent-indigo)]" };
  if (mimetype.startsWith("text/") || /json|javascript/i.test(mimetype) || EXT_CODE.test(ext))
    return { Icon: FileCode, color: "text-[var(--accent-indigo)]" };
  return null;
}

function FileIcon({ filename, mimetype, size = 18 }: { filename: string; mimetype: string; size?: number }) {
  const dotIdx = filename.lastIndexOf(".");
  const ext = dotIdx !== -1 ? filename.slice(dotIdx + 1).toUpperCase() : "";
  const match = getIconConfig(mimetype, ext);

  if (match) {
    const { Icon, color } = match;
    return <Icon size={size} className={`shrink-0 ${color}`} />;
  }

  if (ext) {
    return (
      <span className="font-mono text-[11px] font-bold text-[var(--accent-indigo)] tracking-tighter uppercase select-none">
        {ext.slice(0, 3)}
      </span>
    );
  }

  return <File size={size} className="shrink-0 text-[var(--text-muted)]" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(seconds: number): string {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 15) return "just now";
  if (diff < 60) return `${Math.max(1, diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatUserLocalDateTime(seconds: number): string {
  return new Date(seconds * 1000).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
}

function withToken(url: string, token: string | null): string {
  if (!token || url.includes("token=")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
}

const BTN_BASE = "p-1 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center rounded transition-colors cursor-pointer";

export function FileCard({ file, slug, token, layout = "list" }: FileCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isImage = file.mimetype.startsWith("image/");
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const rawPath = file.downloadURL.startsWith("http") ? file.downloadURL : `${origin}${file.downloadURL}`;
  const fullDownloadUrl = withToken(rawPath, token);
  const previewUrl = withToken(file.downloadURL, token);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/pages/${slug}/files/${file.fileId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) { showToast("Failed to delete file", "error"); return; }
      showToast("File deleted", "info");
    } catch { showToast("Connection error", "error"); }
    finally { setDeleting(false); setShowConfirmDelete(false); }
  }

  async function handleCopyUrl() {
    const ok = await copyToClipboard(fullDownloadUrl);
    if (ok) {
      setCopiedUrl(true);
      showToast("Direct file download link copied!", "success");
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      showToast("Failed to copy link", "error");
    }
  }

  const renderThumbnail = (size?: number) => (
    isImage && !imgError ? (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={previewUrl}
        alt={file.originalName}
        onError={() => setImgError(true)}
        decoding="async"
        loading="lazy"
        className="w-full h-full object-cover"
      />
    ) : (
      <FileIcon filename={file.originalName} mimetype={file.mimetype} size={size} />
    )
  );

  const renderFileInfo = (extraClass = "") => (
    <div className={`min-w-0 max-w-full cursor-pointer ${extraClass}`} onClick={() => setShowPreview(true)}>
      <p className="text-xs font-semibold text-[var(--text-main)] truncate max-w-full group-hover:text-[var(--accent-primary)] transition-colors">
        {file.originalName}
      </p>
      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono truncate max-w-full">
        {formatBytes(file.size)}
        {file.uploadedAt && (
          <span title={formatUserLocalDateTime(file.uploadedAt.seconds)}>
            {" · "}{timeAgo(file.uploadedAt.seconds)}
          </span>
        )}
      </p>
    </div>
  );

  const isList = layout === "list";
  const hiddenOnMobileList = isList ? "hidden sm:flex" : "";

  const previewButton = (
    <button
      type="button"
      onClick={() => setShowPreview(true)}
      title="Preview"
      aria-label={`Preview ${file.originalName}`}
      className={`${BTN_BASE} ${hiddenOnMobileList} text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]`}
    >
      <Eye size={13} />
    </button>
  );

  const copyButton = (
    <button
      type="button"
      onClick={handleCopyUrl}
      title="Copy link"
      aria-label={copiedUrl ? "Copied download link" : "Copy download link"}
      className={`${BTN_BASE} ${hiddenOnMobileList} border ${
        copiedUrl
          ? "bg-[var(--status-success-bg)] text-[var(--status-success-text)] border-[var(--status-success-border)]"
          : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
      }`}
    >
      {copiedUrl ? <Check size={13} className="text-[var(--status-success-text)]" /> : <Copy size={13} />}
    </button>
  );

  const downloadButton = (
    <a
      href={fullDownloadUrl}
      download={file.originalName}
      target="_blank"
      rel="noopener noreferrer"
      title="Download"
      aria-label={`Download ${file.originalName}`}
      className={`${BTN_BASE} bg-[var(--badge-bg)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white border border-[var(--badge-border)]`}
    >
      <Download size={13} />
    </a>
  );

  const deleteButton = (
    <button
      type="button"
      onClick={() => setShowConfirmDelete(true)}
      title="Delete"
      aria-label={`Delete ${file.originalName}`}
      className={`${BTN_BASE} text-[var(--status-danger-text)] hover:bg-[var(--status-danger-bg)] border border-transparent hover:border-[var(--status-danger-border)]`}
    >
      <Trash2 size={13} />
    </button>
  );

  return (
    <>
      {layout === "grid" ? (
        <article className="group flex flex-col justify-between p-2.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors min-w-0 max-w-full overflow-hidden h-full select-none">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            aria-label={`Preview ${file.originalName}`}
            className="w-full h-24 rounded bg-[var(--input-bg)] border border-[var(--border-color)] group-hover:border-[var(--accent-primary)]/40 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer transition-colors relative"
          >
            {renderThumbnail(28)}
          </button>

          {renderFileInfo("mt-2")}

          <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-[var(--border-color)] shrink-0">
            <div className="flex items-center gap-1">
              {previewButton}
              {copyButton}
            </div>
            <div className="flex items-center gap-1">
              {downloadButton}
              {deleteButton}
            </div>
          </div>
        </article>
      ) : (
        <article className="group flex items-center justify-between gap-2.5 px-3 py-2 rounded-md min-h-[48px] bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              aria-label={`Preview ${file.originalName}`}
              className="w-9 h-9 min-h-[36px] min-w-[36px] rounded bg-[var(--input-bg)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] flex items-center justify-center shrink-0 transition-colors cursor-pointer overflow-hidden"
              title="Click to preview file"
            >
              {renderThumbnail()}
            </button>
            {renderFileInfo("flex-1")}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {previewButton}
            {copyButton}
            {downloadButton}
            {deleteButton}
          </div>
        </article>
      )}

      <FilePreviewModal
        file={file}
        token={token}
        open={showPreview}
        onClose={() => setShowPreview(false)}
      />

      <ConfirmModal
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete File?"
        description={`Are you sure you want to permanently delete "${file.originalName}"?`}
        confirmText="Delete File"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
