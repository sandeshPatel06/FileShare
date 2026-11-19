"use client";

import { useEffect } from "react";

const GA_ID = "G-QJ7L4HP72G";

export function GoogleAnalytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let loaded = false;
    function loadGA() {
      if (loaded) return;
      loaded = true;
      cleanup();

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      const win = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
      win.dataLayer = win.dataLayer || [];
      function gtag(...args: unknown[]) {
        win.dataLayer.push(args);
      }
      win.gtag = gtag;
      gtag("js", new Date());
      gtag("config", GA_ID, { anonymize_ip: true });
    }

    const events = ["pointerdown", "scroll", "keydown", "touchstart"];
    const trigger = () => loadGA();

    function cleanup() {
      events.forEach((ev) => window.removeEventListener(ev, trigger, { capture: true } as EventListenerOptions));
    }

    events.forEach((ev) =>
      window.addEventListener(ev, trigger, { capture: true, once: true, passive: true } as AddEventListenerOptions)
    );

    // Fallback timer: load after 5s when page is idle
    const timer = setTimeout(loadGA, 5000);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  return null;
}
