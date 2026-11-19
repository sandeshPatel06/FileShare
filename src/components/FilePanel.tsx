"use client";
import { useCallback, useRef, useState } from "react";
import { UploadCloud, FolderOpen, FileUp, Search, LayoutGrid, LayoutList, X, Download, Loader2 } from "lucide-react";
import { useFileList, FileItem } from "@/hooks/useFileList";
import { FileCard } from "@/components/FileCard";
import { showToast } from "@/components/ui/Toast";
import { exportFilesOnlyAsZip } from "@/lib/exportZip";

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

function matchCategory(file: FileItem, cat: FileCategory): boolean {
  if (cat === "all") return true;
  const mime = file.mimetype.toLowerCase();
  const ext = (file.originalName.includes(".") ? file.originalName.split(".").pop() : "")?.toLowerCase() || "";

  if (cat === "images") {
    return mime.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "svg", "ico", "bmp"].includes(ext);
  }
  if (cat === "media") {
    return mime.startsWith("audio/") || mime.startsWith("video/") || ["mp3", "wav", "ogg", "flac", "mp4", "webm", "mkv", "avi", "mov"].includes(ext);
  }
  if (cat === "docs") {
    return (
      mime === "application/pdf" ||
      mime.includes("document") ||
      mime.includes("word") ||
      mime.includes("spreadsheet") ||
      mime.includes("presentation") ||
      ["pdf", "doc", "docx", "txt", "rtf", "odt", "xls", "xlsx", "csv", "ppt", "pptx"].includes(ext)
    );
  }
  if (cat === "code") {
    return (
      mime.startsWith("text/") ||
      mime.includes("json") ||
      mime.includes("javascript") ||
      mime.includes("typescript") ||
      mime.includes("xml") ||
      ["js", "ts", "tsx", "jsx", "py", "html", "css", "json", "sh", "c", "cpp", "go", "rs", "java", "php", "sql", "md", "yaml", "yml"].includes(ext)
    );
  }
  return true;
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

  const cancelUpload = useCallback((id: string) => {
    if (activeXhrs.current[id]) {
      activeXhrs.current[id].abort();
      delete activeXhrs.current[id];
    }
    setUploadProgress((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    showToast("Upload cancelled", "info");
  }, []);

  const handleDownloadAllZip = useCallback(async () => {
    if (downloadingZip || files.length === 0) return;
    setDownloadingZip(true);
    try {
      await exportFilesOnlyAsZip({
        slug,
        files,
        token,
        onProgress: setZipStatus,
      });
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

    setUploadProgress((prev) => ({
      ...prev,
      [uploadId]: {
        id: uploadId,
        name: file.name,
        percent: 0,
        loadedFormatted: "0 Bytes",
        totalFormatted: formatBytes(file.size),
        speedFormatted: "Starting...",
        etaFormatted: "",
      },
    }));

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        activeXhrs.current[uploadId] = xhr;
        const formData = new FormData();
        formData.append("file", file);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.min(99, Math.round((e.loaded / e.total) * 100));
            const elapsed = (Date.now() - startTime) / 1000 || 0.1;
            const speedBytesSec = e.loaded / elapsed;
            const remainingBytes = Math.max(0, e.total - e.loaded);
            const remainingSeconds = speedBytesSec > 0 ? remainingBytes / speedBytesSec : 0;

            setUploadProgress((prev) => ({
              ...prev,
              [uploadId]: {
                id: uploadId,
                name: file.name,
                percent,
                loadedFormatted: formatBytes(e.loaded),
                totalFormatted: formatBytes(e.total),
                speedFormatted: formatSpeed(speedBytesSec),
                etaFormatted: formatEta(remainingSeconds),
              },
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress((prev) => ({
              ...prev,
              [uploadId]: {
                id: uploadId,
                name: file.name,
                percent: 100,
                loadedFormatted: formatBytes(file.size),
                totalFormatted: formatBytes(file.size),
                speedFormatted: "Done",
                etaFormatted: "",
              },
            }));
            showToast(`${file.name} uploaded successfully`, "success");
            setTimeout(() => {
              setUploadProgress((prev) => {
                const next = { ...prev };
                delete next[uploadId];
                return next;
              });
              delete activeXhrs.current[uploadId];
            }, 1000);
            resolve();
          } else {
            let errorMsg = `Upload failed for ${file.name}`;
            try {
              const res = JSON.parse(xhr.responseText);
              if (res.error) errorMsg = res.error;
            } catch {}
            showToast(errorMsg, "error");
            delete activeXhrs.current[uploadId];
            setUploadProgress((prev) => {
              const next = { ...prev };
              delete next[uploadId];
              return next;
            });
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () => {
          showToast(`Connection error during upload of ${file.name}`, "error");
          delete activeXhrs.current[uploadId];
          setUploadProgress((prev) => {
            const next = { ...prev };
            delete next[uploadId];
            return next;
          });
          reject(new Error("Connection error"));
        };

        xhr.open("POST", `/api/pages/${slug}/files/upload`, true);
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }
        xhr.send(formData);
      });
    } catch {
      // Error handled
    }
  }, [slug, token]);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    Array.from(fileList).forEach(uploadFile);
  }

  function onDragOver(e: React.DragEvent) { e.preventDefault(); setDragging(true); }
  function onDragLeave()                  { setDragging(false); }
  function onDrop(e: React.DragEvent)     { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.originalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = matchCategory(f, activeCategory);
    return matchesSearch && matchesCat;
  });

  const categories: { id: FileCategory; label: string }[] = [
    { id: "all",    label: "All" },
    { id: "images", label: "Images" },
    { id: "docs",   label: "Docs" },
    { id: "code",   label: "Code" },
    { id: "media",  label: "Media" },
  ];

  return (
    <aside aria-label="Vault files manager" className="flex flex-col h-full min-h-0 min-w-0 overflow-hidden bg-[var(--bg-surface)] transition-colors select-none">
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
            <button
              type="button"
              onClick={() => setViewLayout("list")}
              aria-label="List view"
              aria-pressed={viewLayout === "list"}
              className={`min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] p-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                viewLayout === "list"
                  ? "bg-[var(--accent-primary)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
              title="List View"
            >
              <LayoutList size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewLayout("grid")}
              aria-label="Grid view"
              aria-pressed={viewLayout === "grid"}
              className={`min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] p-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                viewLayout === "grid"
                  ? "bg-[var(--accent-primary)] text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
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
            {categories.map((cat) => (
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-2.5 space-y-2.5 min-h-0 min-w-0 max-w-full">
        {/* Compact drop zone container (only when files already exist in space) */}
        {files.length > 0 && (
          <div
            role="button"
            tabIndex={0}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            aria-label="Upload files (drop files here or click to browse)"
            className={`
              relative flex items-center justify-between gap-3 px-3 py-2 min-h-[44px]
              rounded-md border border-dashed transition-colors cursor-pointer
              ${dragging
                ? "border-[var(--accent-primary)] bg-[var(--badge-bg)]"
                : "border-[var(--border-color)] hover:border-[var(--accent-primary)] bg-[var(--input-bg)]/50 hover:bg-[var(--bg-card-hover)]"
              }
            `}
          >
            <div className="flex items-center gap-2 min-w-0">
              <UploadCloud size={15} className={dragging ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"} />
              <span className="text-xs font-medium text-[var(--text-main)] truncate">
                {dragging ? "Release to drop files" : "Drop files to upload, or browse"}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0">
              ≤ 500 MB
            </span>
          </div>
        )}

        {/* Real-time Upload Progress Items */}
        {Object.values(uploadProgress).map((item) => (
          <article
            key={item.id}
            aria-label={`Uploading ${item.name}`}
            className="flex flex-col gap-2 p-2.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] min-w-0 max-w-full overflow-hidden"
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
                  className="p-1 min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] flex items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--status-danger-text)] hover:bg-[var(--status-danger-bg)] transition-colors cursor-pointer"
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
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[var(--text-muted)]">
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
        ) : filteredFiles.length === 0 && Object.keys(uploadProgress).length === 0 ? (
          files.length === 0 ? (
            /* Single unified empty-state upload dropzone */
            <div
              role="button"
              tabIndex={0}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              aria-label="Upload files (drag and drop here or click to browse)"
              className={`
                text-center p-6 sm:p-8 rounded-lg border border-dashed transition-colors cursor-pointer
                ${dragging
                  ? "border-[var(--accent-primary)] bg-[var(--badge-bg)]"
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
          <div className={viewLayout === "grid" ? "grid grid-cols-1 min-[420px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 min-w-0 max-w-full" : "space-y-1.5 min-w-0 max-w-full"}>
            {filteredFiles.map((f) => (
              <FileCard key={f.fileId} file={f} slug={slug} token={token} layout={viewLayout} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
