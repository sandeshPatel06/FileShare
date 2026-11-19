"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie, Settings, Check, X } from "lucide-react";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const STORAGE_KEY = "fileshare_cookie_consent";

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
};

function applyGtagConsent(prefs: CookiePreferences) {
  if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === "function") {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("consent", "update", {
      analytics_storage: prefs.analytics ? "granted" : "denied",
      ad_storage: prefs.marketing ? "granted" : "denied",
      ad_user_data: prefs.marketing ? "granted" : "denied",
      ad_personalization: prefs.marketing ? "granted" : "denied",
    });
  }
}

function subscribeConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("cookie_preferences_changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cookie_preferences_changed", callback);
  };
}

function getConsentSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getConsentServerSnapshot(): string | null {
  return "";
}

export function CookieConsent() {
  const rawConsent = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getConsentServerSnapshot);
  const [manualOpen, setManualOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (rawConsent) {
      try {
        const parsed = JSON.parse(rawConsent) as CookiePreferences;
        applyGtagConsent(parsed);
      } catch {
        applyGtagConsent(DEFAULT_PREFERENCES);
      }
    } else if (rawConsent === null) {
      applyGtagConsent(DEFAULT_PREFERENCES);
    }
  }, [rawConsent]);

  useEffect(() => {
    const handleReopen = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setPreferences(JSON.parse(stored));
        }
      } catch {
        // use default
      }
      setIsCustomizeOpen(true);
      setManualOpen(true);
    };
    window.addEventListener("open_cookie_preferences", handleReopen);
    return () => window.removeEventListener("open_cookie_preferences", handleReopen);
  }, []);

  // Lock body scroll when the full-screen dialog is open
  useEffect(() => {
    if (rawConsent === "" || rawConsent !== null) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [rawConsent]);

  // Close customize modal on Escape key and lock body scroll
  useEffect(() => {
    if (!isCustomizeOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCustomizeOpen(false);
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCustomizeOpen]);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      window.dispatchEvent(new Event("cookie_preferences_changed"));
    } catch (e) {
      console.warn("Could not save cookie preferences", e);
    }
    setPreferences(prefs);
    applyGtagConsent(prefs);
    setManualOpen(false);
    setIsCustomizeOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    });
  };

  const handleSaveCustom = () => {
    saveConsent({
      ...preferences,
      timestamp: Date.now(),
    });
  };

  // During SSR / hydrating, do not render modal
  if (rawConsent === "") return null;

  const isOpen = manualOpen || rawConsent === null;
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full sm:max-w-md min-w-0 bg-[var(--modal-bg,var(--bg-surface))] border border-[var(--border-color)] sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden">
        {!isCustomizeOpen ? (
          /* ── Main consent panel ── */
          <div className="p-5 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[var(--badge-bg)] text-[var(--accent-primary)] shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="cookie-consent-title"
                  className="font-bold text-sm sm:text-base text-[var(--text-main)] leading-snug"
                >
                  We value your privacy
                </h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-0.5">
                  We use cookies to keep your workspace running and — with your permission — to understand how people use the site. Read our{" "}
                  <Link
                    href="/cookies"
                    className="text-[var(--accent-primary)] underline hover:text-[var(--text-main)] transition-colors"
                  >
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* What we use — quick summary */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-2 py-2.5 space-y-1">
                <div className="text-base">🔧</div>
                <div className="font-semibold text-[var(--text-main)]">Essential</div>
                <div className="text-[var(--text-muted)] leading-tight">Always on</div>
              </div>
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-2 py-2.5 space-y-1">
                <div className="text-base">📊</div>
                <div className="font-semibold text-[var(--text-main)]">Analytics</div>
                <div className="text-[var(--text-muted)] leading-tight">Optional</div>
              </div>
              <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-2 py-2.5 space-y-1">
                <div className="text-base">📢</div>
                <div className="font-semibold text-[var(--text-main)]">Ads</div>
                <div className="text-[var(--text-muted)] leading-tight">Optional</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full py-3 text-sm font-semibold rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Accept All
              </button>

              {/* Secondary row */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="flex-1 py-2.5 text-xs font-medium rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] cursor-pointer"
                >
                  Reject Optional
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomizeOpen(true)}
                  className="flex-1 py-2.5 text-xs font-medium rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] inline-flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Customize
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Customize preferences panel ── */
          <div className="p-5 sm:p-6 flex flex-col max-h-[85dvh] sm:max-h-[80dvh]">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Settings className="w-4.5 h-4.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                <h2 className="font-bold text-sm text-[var(--text-main)]">
                  Choose Your Preferences
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizeOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
                aria-label="Back to main consent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto space-y-2.5 text-xs pr-0.5">
              {/* Necessary */}
              <article className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--text-main)]">Strictly Necessary</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--badge-bg)] text-[var(--accent-primary)]">
                    Always On
                  </span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Required for core workspace features, keeping protected spaces unlocked during your session, and remembering your theme choice.
                </p>
              </article>

              {/* Analytics */}
              <article className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--text-main)]">Performance & Analytics</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                      aria-label="Toggle analytics cookies"
                    />
                    <div className="w-8 h-4 bg-[var(--border-color)] rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent-primary)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                  </label>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Anonymised visit counts and traffic sources via Google Analytics 4. Helps us improve the product.
                </p>
              </article>

              {/* Marketing */}
              <article className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--text-main)]">Advertising & Partner</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                      aria-label="Toggle advertising cookies"
                    />
                    <div className="w-8 h-4 bg-[var(--border-color)] rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent-primary)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                  </label>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Allows Google AdSense to show relevant ads on guide and article pages.
                </p>
              </article>
            </div>

            {/* Footer */}
            <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="flex-1 py-2.5 text-xs font-medium rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                <Check className="w-3.5 h-3.5" />
                Save My Choices
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Utility button for page footers to allow users to trigger
 * the cookie consent modal anytime (GDPR & DPDP requirement).
 */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("open_cookie_preferences"));
        }
      }}
      className="hover:text-[var(--text-main)] transition-colors underline cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] rounded"
    >
      Cookie Preferences
    </button>
  );
}
