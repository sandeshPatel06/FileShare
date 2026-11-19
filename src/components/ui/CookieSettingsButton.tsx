"use client";

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
