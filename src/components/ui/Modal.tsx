"use client";
import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const emptySubscribe = () => () => {};

export function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Keyboard navigation: Escape key and focus trap
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === dialogRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll, capture active element, and auto-focus dialog
  useEffect(() => {
    if (open) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        const input = dialogRef.current?.querySelector<HTMLElement>(
          'input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (input) {
          input.focus();
        } else {
          dialogRef.current?.focus();
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
        previousActiveElementRef.current?.focus?.();
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  if (!open || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 overflow-y-auto overscroll-contain animate-fade-in"
      onClick={onClose}
    >
      {/* Modal Dialog Box */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        className={`
          relative w-full ${maxWidth} max-w-[calc(100vw-1.5rem)] min-w-0 max-h-[88vh] bg-[var(--modal-bg)] text-[var(--text-main)]
          rounded-2xl p-4 sm:p-5 border border-[var(--border-color)]
          shadow-xl z-[10000] my-auto flex flex-col animate-scale-in outline-none overflow-hidden
        `}
      >
        {/* Header */}
        {title ? (
          <header className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[var(--border-color)] shrink-0 select-none">
            <h2 id="modal-title" className="text-base sm:text-lg font-bold text-[var(--text-main)] truncate pr-2 min-w-0 flex-1">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </header>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer z-10 min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        )}

        {/* Modal Scrollable Body - single scroll node inside dialog */}
        <section className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain">
          {children}
        </section>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export const Dialog = Modal;
