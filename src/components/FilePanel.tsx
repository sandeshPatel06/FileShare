"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UploadCloud, FolderOpen, FileUp, Search, LayoutGrid, LayoutList, X, Download, Loader2 } from "lucide-react";
import { useFileList, FileItem } from "@/hooks/useFileList";
import { FileCard } from "@/components/FileCard";
import { showToast } from "@/components/ui/Toast";

interface FilePanelProps {
  slug:  string;
  token: string | null;
}

interface UploadProgressItem {
  id: string;
  name: string;
  percent: number;
  loadedFormatted: string;
  totalFormatted: string;
  speedFormatted: string;
  etaFormatted?: string;
}

type FileCategory = "all" | "images" | "docs" | "code" | "media";

const CATEGORIES: { id: FileCategory; label: string }[] = [
  { id: "all",    label: "All" },
  { id: "images", label: "Images" },
  { id: "docs",   label: "Docs" },
  { id: "code",   label: "Code" },
  { id: "media",  label: "Media" },
];

const VIEW_MODES = [
  { id: "list", label: "List view", icon: LayoutList },
  { id: "grid", label: "Grid view", icon: LayoutGrid },
] as const;

const CATEGORY_RULES: Record<Exclude<FileCategory, "all">, { mime: (m: string) => boolean; exts: Set<string> }> = {
  images: {
    mime: (m) => m.startsWith("image/"),
    exts: new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "ico", "bmp"]),
  },
  media: {
    mime: (m) => m.startsWith("audio/") || m.startsWith("video/"),
    exts: new Set(["mp3", "wav", "ogg", "flac", "mp4", "webm", "mkv", "avi", "mov"]),
  },
  docs: {
    mime: (m) => m === "application/pdf" || /document|word|spreadsheet|presentation/.test(m),
    exts: new Set(["pdf", "doc", "docx", "txt", "rtf", "odt", "xls", "xlsx", "csv", "ppt", "pptx"]),
  },
  code: {
    mime: (m) => m.startsWith("text/") || /json|javascript|typescript|xml/.test(m),
    exts: new Set(["js", "ts", "tsx", "jsx", "py", "html", "css", "json", "sh", "c", "cpp", "go", "rs", "java", "php", "sql", "md", "yaml", "yml"]),
  },
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec <= 0) return "0 KB/s";
  if (bytesPerSec >= 1024 * 1024) {
    return (bytesPerSec / (1024 * 1024)).toFixed(1) + " MB/s";
  }
  return Math.round(bytesPerSec / 1024) + " KB/s";
}

function formatEta(seconds: number): string {
  if (seconds <= 0 || !isFinite(seconds)) return "";
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m left`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s left`;
  }
  return `${Math.ceil(seconds)}s left`;
}

function calcProgress(loaded: number, total: number, startTime: number) {
  const percent = Math.min(99, Math.round((loaded / total) * 100));
  const elapsed = (Date.now() - startTime) / 1000 || 0.1;
  const speedBytesSec = loaded / elapsed;
  const remainingBytes = Math.max(0, total - loaded);
  const remainingSeconds = speedBytesSec > 0 ? remainingBytes / speedBytesSec : 0;
  return {
    percent,
    loadedFormatted: formatBytes(loaded),
    totalFormatted: formatBytes(total),
    speedFormatted: formatSpeed(speedBytesSec),
    etaFormatted: formatEta(remainingSeconds),
  };
}

function matchCategory(file: FileItem, cat: FileCategory): boolean {
  if (cat === "all") return true;
  const rule = CATEGORY_RULES[cat];
  if (!rule) return true;
  const mime = file.mimetype.toLowerCase();
  const ext = file.originalName.includes(".")
    ? file.originalName.slice(file.originalName.lastIndexOf(".") + 1).toLowerCase()
    : "";
  return rule.mime(mime) || rule.exts.has(ext);
}

export function FilePanel({ slug, token }: FilePanelProps) {
  const { files, loading } = useFileList(slug, token);
  const [dragging,       setDragging]       = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [activeCategory, setActiveCategory] = useState<FileCategory>("all");
  const [viewLayout,     setViewLayout]     = useState<"list" | "grid">("list");
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressItem>>({});
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipStatus,      setZipStatus]      = useState("");
  const activeXhrs = useRef<Record<string, XMLHttpRequest>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

  const cleanupUpload = useCallback((id: string, abort = false) => {
    if (abort && activeXhrs.current[id]) {
      activeXhrs.current[id].abort();
    }
    delete activeXhrs.current[id];
    setUploadProgress((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const cancelUpload = useCallback((id: string) => {
    cleanupUpload(id, true);
    showToast("Upload cancelled", "info");
  }, [cleanupUpload]);

  // Abort pending uploads on component unmount
  useEffect(() => {
    const xhrs = activeXhrs.current;
    return () => {
      Object.values(xhrs).forEach((xhr) => xhr.abort());
    };
  }, []);

  const handleDownloadAllZip = useCallback(async () => {
    if (downloadingZip || files.length === 0) return;
    setDownloadingZip(true);
    try {
      const { exportFilesOnlyAsZip } = await import("@/lib/exportZip");
      await exportFilesOnlyAsZip({
        slug,
        files,
        token,
        onProgress: setZipStatus,
      });
    } catch {
      showToast("Failed to generate ZIP", "error");
    } finally {
      setDownloadingZip(false);
      setZipStatus("");
    }
  }, [downloadingZip, files, slug, token]);

  const uploadFile = useCallback(async (file: File) => {
    if (file.size > 500 * 1024 * 1024) {
      showToast(`File exceeds 500 MB limit: ${file.name}`, "error");
      return;
    }

    const uploadId = `${file.name}-${Date.now()}-${Math.random()}`;
    const startTime = Date.now();
    const formattedTotal = formatBytes(file.size);

    setUploadProgress((prev) => ({
      ...prev,
      [uploadId]: {
        id: uploadId,
        name: file.name,
        percent: 0,
        loadedFormatted: "0 Bytes",
        totalFormatted: formattedTotal,
        speedFormatted: "Starting...",
        etaFormatted: "",
      },
    }));

    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        activeXhrs.current[uploadId] = xhr;
        const formData = new FormData();
        formData.append("file", file);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const metrics = calcProgress(e.loaded, e.total, startTime);
            setUploadProgress((prev) => (prev[uploadId] ? {
              ...prev,
              [uploadId]: { ...prev[uploadId], ...metrics },
            } : prev));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress((prev) => (prev[uploadId] ? {
              ...prev,
              [uploadId]: {
                ...prev[uploadId],
                percent: 100,
                loadedFormatted: formattedTotal,
                speedFormatted: "Done",
                etaFormatted: "",
              },
            } : prev));
            showToast(`${file.name} uploaded successfully`, "success");
            setTimeout(() => cleanupUpload(uploadId), 1000);
            resolve();
          } else {
            let errorMsg = `Upload failed for ${file.name}`;
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.error) errorMsg = res.error;
            } catch {}
            showToast(errorMsg, "error");
            cleanupUpload(uploadId);
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () => {
          showToast(`Connection error during upload of ${file.name}`, "error");
          cleanupUpload(uploadId);
          reject(new Error("Connection error"));
        };

        xhr.open("POST", `/api/pages/${slug}/files/upload`, true);
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }
        xhr.send(formData);
      });
    } catch {
      // Handled in callbacks
    }
  }, [slug, token, cleanupUpload]);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach(uploadFile);
  }, [uploadFile]);

  useEffect(() => {
    const handleGlobalDrop = (e: Event) => {
      const customEvent = e as CustomEvent<FileList>;
      if (customEvent.detail) {
        handleFiles(customEvent.detail);
      }
    };
    window.addEventListener("fileshare:drop-upload", handleGlobalDrop);
    return () => window.removeEventListener("fileshare:drop-upload", handleGlobalDrop);
  }, [handleFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleKeyDownBrowse = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const filteredFiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return files.filter((f) => {
      const matchesSearch = !q || f.originalName.toLowerCase().includes(q) || f.mimetype.toLowerCase().includes(q);
      return matchesSearch && matchCategory(f, activeCategory);
    });
  }, [files, searchQuery, activeCategory]);

  const uploadItems = Object.values(uploadProgress);

  return (
    <aside
      aria-label="Vault files manager"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex flex-col flex-1 h-full min-h-0 min-w-0 overflow-hidden bg-[var(--bg-surface)] transition-colors select-none relative"
    >
      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        aria-label="Upload files to space vault"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Full-panel Drag Overlay when dragging files over active vault */}
      {dragging && files.length > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-30 bg-[var(--bg-surface)]/95 border-2 border-dashed border-[var(--accent-primary)] rounded-md m-2 flex flex-col items-center justify-center gap-2 pointer-events-none transition-all"
        >
          <div className="w-11 h-11 rounded-full bg-[var(--badge-bg)] text-[var(--accent-primary)] flex items-center justify-center">
            <UploadCloud size={22} className="animate-pulse" />
          </div>
          <p className="text-xs font-semibold text-[var(--accent-primary)]">
            Drop files to upload to vault
          </p>
          <p className="text-[11px] font-mono text-[var(--text-muted)]">
            ≤ 500 MB per file · Streamed direct
          </p>
        </div>
      )}

      {/* Header Toolbar */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-surface)] shrink-0 min-h-[44px] gap-2">
        <div className="flex items-center gap-1.5 text-[var(--text-main)] min-w-0 flex-1 truncate">
          <FolderOpen size={15} className="text-[var(--accent-primary)] shrink-0" />
          <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-main)]">
            Vault
          </h2>
          {files.length > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] ml-1 shrink-0 whitespace-nowrap">
              {files.length}
            </span>
          )}
        </div>

        {/* Actions: Download All as ZIP & View Layout */}
        <div className="flex items-center gap-1.5 shrink-0">
          {files.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadAllZip}
              disabled={downloadingZip}
              aria-label="Download all files as ZIP archive"
              className="flex items-center gap-1.5 px-2.5 py-1 min-h-[44px] sm:min-h-[30px] rounded-md bg-[var(--badge-bg)] hover:bg-[var(--accent-primary)]/15 border border-[var(--badge-border)] text-[var(--accent-primary)] transition-colors text-xs font-semibold cursor-pointer disabled:opacity-60"
              title="Download all files as ZIP archive"
            >
              {downloadingZip ? (
                <Loader2 size={13} className="animate-spin text-[var(--accent-primary)]" />
              ) : (
                <Download size={13} />
              )}
              <span className="hidden sm:inline">{downloadingZip ? (zipStatus || "Zipping…") : "ZIP All"}</span>
            </button>
          )}

          <div className="flex items-center p-0.5 rounded-md bg-[var(--input-bg)] border border-[var(--border-color)]">
            {VIEW_MODES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setViewLayout(id)}
                aria-label={label}
                aria-pressed={viewLayout === id}
                className={`min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] p-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                  viewLayout === id
                    ? "bg-[var(--accent-primary)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
                title={label}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Search Bar & Category Filter Pills */}
      {files.length > 0 && (
        <section aria-label="Search and category filters" className="px-3 pt-2 pb-2 shrink-0 space-y-2 border-b border-[var(--border-color)]">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-2.5 text-[var(--text-muted)] pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files…"
              className="w-full pl-8 pr-9 py-1.5 bg-[var(--input-bg)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] rounded-md text-xs font-mono text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-colors min-h-[44px] sm:min-h-[32px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-1 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center rounded"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className={`
                  px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap border min-h-[44px] sm:min-h-[28px] flex items-center
                  ${activeCategory === cat.id
                    ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
                    : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] border-[var(--border-color)]"
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Panel Scrollable Content: single scroll node */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-2.5 space-y-2.5 min-h-0 min-w-0 max-w-full"
      >
        {/* Compact drop zone container (only when files already exist in space) */}
        {files.length > 0 && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={handleKeyDownBrowse}
            aria-label="Upload files (drop files here or click to browse)"
            className={`
              relative flex items-center justify-between gap-2 px-3 py-2 min-h-[44px]
              rounded-md border border-dashed transition-colors cursor-pointer shrink-0
              ${dragging
                ? "border-[var(--accent-primary)] bg-[var(--badge-bg)]"
                : "border-[var(--border-color)] hover:border-[var(--accent-primary)] bg-[var(--input-bg)]/50 hover:bg-[var(--bg-card-hover)]"
              }
            `}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <UploadCloud size={15} className={dragging ? "text-[var(--accent-primary)] shrink-0" : "text-[var(--text-muted)] shrink-0"} />
              <span className="text-xs font-medium text-[var(--text-main)] truncate min-w-0">
                {dragging ? (
                  "Release to drop files"
                ) : (
                  <>
                    <span className="inline sm:hidden">Drop files or browse</span>
                    <span className="hidden sm:inline">Drop files to upload, or browse</span>
                  </>
                )}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0 whitespace-nowrap">
              ≤ 500 MB
            </span>
          </div>
        )}

        {/* Real-time Upload Progress Items */}
        {uploadItems.map((item) => (
          <article
            key={item.id}
            aria-label={`Uploading ${item.name}`}
            className="flex flex-col gap-2 p-2.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] min-w-0 max-w-full overflow-hidden shrink-0"
          >
            <div className="flex items-center justify-between gap-2 min-w-0 max-w-full">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {item.percent < 100 ? (
                  <Loader2 size={14} className="animate-spin text-[var(--accent-primary)] shrink-0" />
                ) : (
                  <FileUp size={14} className="text-[var(--accent-primary)] shrink-0" />
                )}
                <span className="text-xs font-mono font-medium text-[var(--text-main)] truncate min-w-0 flex-1">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
                  {item.percent}%
                </span>
                <button
                  type="button"
                  onClick={() => cancelUpload(item.id)}
                  title="Cancel upload"
                  aria-label={`Cancel upload for ${item.name}`}
                  className="p-1 min-h-[36px] min-w-[36px] sm:min-h-[26px] sm:min-w-[26px] flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--status-danger-text)] hover:bg-[var(--status-danger-bg)] transition-colors cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* Progress Bar Track and Indicator */}
            <div className="w-full h-1.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-150 ease-out"
                style={{ width: `${item.percent}%` }}
              />
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="truncate min-w-0">
                {item.loadedFormatted} / {item.totalFormatted}
              </span>
              <span className="font-semibold text-[var(--text-main)] shrink-0 whitespace-nowrap">
                {item.speedFormatted}
                {item.etaFormatted ? ` · ${item.etaFormatted}` : ""}
              </span>
            </div>
          </article>
        ))}

        {/* Files Display (List vs Grid) */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 skeleton rounded-md" />
            ))}
          </div>
        ) : filteredFiles.length === 0 && uploadItems.length === 0 ? (
          files.length === 0 ? (
            /* Single unified empty-state upload dropzone */
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={handleKeyDownBrowse}
              aria-label="Upload files (drag and drop here or click to browse)"
              className={`
                text-center p-6 sm:p-8 rounded-lg border border-dashed transition-colors cursor-pointer
                ${dragging
                  ? "border-[var(--accent-primary)] bg-[var(--badge-bg)] ring-1 ring-[var(--accent-primary)]/40"
                  : "border-[var(--border-color)] hover:border-[var(--accent-primary)] bg-[var(--input-bg)]/40 hover:bg-[var(--bg-card-hover)]/40"
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-md border flex items-center justify-center mx-auto mb-3 transition-colors
                ${dragging
                  ? "bg-[var(--badge-bg)] border-[var(--accent-primary)] text-[var(--accent-primary)]"
                  : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)]"
                }
              `}>
                <UploadCloud size={20} />
              </div>
              <p className={`text-sm font-semibold transition-colors ${dragging ? "text-[var(--accent-primary)]" : "text-[var(--text-main)]"}`}>
                {dragging ? "Release to drop files" : "Drop files to upload"}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                Max 500 MB per file · Streamed direct to vault
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[36px] px-4 py-2 rounded-md text-xs font-semibold bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white transition-colors">
                  Browse Files
                </span>
              </div>
            </div>
          ) : (
            /* Filter/Search empty state (files exist, but none match filter) */
            <div className="text-center py-8 px-4 border border-dashed border-[var(--border-color)] rounded-md bg-[var(--bg-card)]/40">
              <FolderOpen size={20} className="mx-auto text-[var(--text-muted)] mb-2" />
              <p className="text-xs font-semibold text-[var(--text-main)]">No matching files found</p>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                Try adjusting search query or category filter
              </p>
              {(searchQuery || activeCategory !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-3 inline-flex items-center px-2.5 py-1 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] text-xs font-mono transition-colors min-h-[44px] sm:min-h-[28px] cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
          )
        ) : (
          <div className={viewLayout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0 max-w-full" : "space-y-1.5 min-w-0 max-w-full"}>
            {filteredFiles.map((f) => (
              <FileCard key={f.fileId} file={f} slug={slug} token={token} layout={viewLayout} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
