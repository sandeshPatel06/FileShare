"use client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Copy, CheckCheck, ExternalLink } from "lucide-react";
import { useState } from "react";
import { showToast } from "@/components/ui/Toast";
import { copyToClipboard } from "@/lib/clipboard";

interface QRCodeModalProps {
  open:    boolean;
  onClose: () => void;
  slug:    string;
}

export function QRCodeModal({ open, onClose, slug }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const prefix = typeof window !== "undefined" && window.location.pathname.startsWith("/projects") ? "/projects" : "/s";
  const url = typeof window !== "undefined" ? `${window.location.origin}${prefix}/${slug}` : `${prefix}/${slug}`;

  async function handleCopy() {
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      showToast("Share link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Failed to copy link", "error");
    }
  }

  // 400x400 high-DPI QR Code ensures crisp sharpness on Retina and mobile screens
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}&color=0f172a&bgcolor=ffffff&margin=10`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Scan QR Code to Open Space"
      maxWidth="max-w-xs sm:max-w-sm"
      footer={
        <div className="flex flex-col gap-2.5 w-full">
          <a href={url} target="_blank" rel="noopener noreferrer" className="w-full min-w-0 max-w-full shrink-0 block">
            <Button variant="outline" size="md" icon={<ExternalLink size={15} />} className="w-full text-xs sm:text-sm font-bold min-h-[44px]">
              Open in new tab
            </Button>
          </a>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center pt-0.5 text-center w-full min-w-0 max-w-full overflow-x-hidden">
        {/* QR Code Card Frame — bg-white kept intentionally for QR scanner contrast */}
        <div className="p-3 rounded-2xl bg-white border border-[var(--border-color)] shadow-md mb-3.5 shrink-0 max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt={`QR code for ${url}`}
            width={180}
            height={180}
            className="rounded-xl max-w-full h-auto select-none"
            style={{ imageRendering: "auto" }}
          />
        </div>

        <p className="text-xs text-[var(--text-muted)] font-medium mb-3.5 w-full min-w-0 max-w-full leading-relaxed break-words px-1">
          Scan this QR code using your phone camera to open <span className="text-[var(--accent-indigo)] font-extrabold font-mono break-all">/s/{slug}</span> instantly.
        </p>

        {/* URL Copy Bar */}
        <div className="w-full min-w-0 max-w-full flex items-center bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl p-1 mb-1 shrink-0">
          <input
            readOnly
            value={url}
            aria-label="Share link"
            className="flex-1 min-w-0 w-full px-2.5 py-1.5 text-xs text-[var(--text-main)] bg-transparent outline-none font-mono truncate select-all font-bold"
          />
          <Button
            size="md"
            variant={copied ? "success" : "secondary"}
            icon={copied ? <CheckCheck size={14} className="text-white" /> : <Copy size={14} />}
            onClick={handleCopy}
            className="shrink-0 text-xs sm:text-sm font-bold min-h-[40px] px-3"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
