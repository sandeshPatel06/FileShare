"use client";
import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glow" | "ghost" | "danger" | "success" | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  icon,
  iconRight,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none hover:scale-[1.015] active:scale-[0.97] disabled:hover:scale-100 disabled:active:scale-100 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]";

  const sizes = {
    xs: "px-2.5 py-1 min-h-[44px] sm:min-h-[32px] text-xs gap-1.5 rounded-lg font-semibold",
    sm: "px-3 py-1.5 min-h-[44px] sm:min-h-[36px] text-sm gap-1.5 rounded-lg font-bold",
    md: "px-3.5 py-2 min-h-[44px] sm:min-h-[40px] text-sm gap-2 rounded-xl font-bold",
    lg: "px-5 py-2.5 min-h-[44px] text-sm sm:text-base gap-2 rounded-xl font-bold",
    xl: "px-7 py-3 min-h-[48px] text-base sm:text-lg gap-2.5 rounded-2xl font-bold",
  };

  const variants = {
    primary:
      "bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-sm border border-[var(--badge-border)] focus-visible:ring-[var(--accent-primary)]",
    glow:
      "bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-md shadow-[0_0_16px_var(--border-glow)] border border-[var(--badge-border)] focus-visible:ring-[var(--accent-primary)]",
    secondary:
      "bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] active:bg-[var(--border-color)] border border-[var(--border-color)] shadow-xs focus-visible:ring-[var(--accent-primary)]",
    ghost:
      "bg-transparent text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10 border border-transparent focus-visible:ring-[var(--accent-primary)]",
    outline:
      "bg-transparent border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] focus-visible:ring-[var(--accent-primary)]",
    danger:
      "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border border-red-500/40 shadow-sm focus-visible:ring-red-500",
    success:
      "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white border border-emerald-500/40 shadow-sm focus-visible:ring-emerald-500",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2
          size={size === "xs" ? 13 : size === "sm" ? 14 : size === "xl" ? 20 : 16}
          className="animate-spin text-current shrink-0"
          aria-hidden="true"
        />
      ) : (
        icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>
      )}
      {children}
      {!loading && iconRight && <span className="shrink-0 flex items-center justify-center">{iconRight}</span>}
    </button>
  );
}
