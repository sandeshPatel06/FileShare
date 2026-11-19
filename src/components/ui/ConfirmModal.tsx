"use client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open:         boolean;
  onClose:      () => void;
  onConfirm:    () => void;
  title:        string;
  description:  string;
  confirmText?: string;
  cancelText?:  string;
  variant?:     "danger" | "primary" | "secondary" | "ghost" | "outline";
  loading?:     boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText  = "Cancel",
  variant     = "danger",
  loading     = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-xs sm:max-w-sm"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2.5 w-full">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={loading}
            className="font-bold w-full sm:w-auto min-h-[44px]"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            size="md"
            loading={loading}
            className="font-bold w-full sm:w-auto min-h-[44px]"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col text-center pt-1 min-w-0 max-w-full overflow-x-hidden">
        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-[var(--status-danger-bg)] border border-[var(--status-danger-border)] flex items-center justify-center text-[var(--status-danger-text)] mx-auto shadow-sm shrink-0">
          <AlertTriangle size={22} />
        </div>

        {/* Message */}
        <div className="mt-3 min-w-0 max-w-full">
          <h3 className="text-base font-extrabold text-[var(--text-main)] mb-1.5 break-all leading-snug max-w-full">{title}</h3>
          <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed break-words min-w-0 max-w-full">{description}</p>
        </div>
      </div>
    </Modal>
  );
}
