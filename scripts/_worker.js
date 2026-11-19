export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Fast preflight for CORS requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const isImageOrAsset =
      pathname === "/og-image.png" ||
      pathname === "/logo.png" ||
      pathname === "/favicon.ico" ||
      pathname === "/icon.svg" ||
      pathname === "/manifest.json" ||
      pathname.startsWith("/_next/static/") ||
      /\.(png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot)$/i.test(pathname);

    // Try serving static assets directly from Cloudflare Pages dist bundle if available
    if (isImageOrAsset && env?.ASSETS) {
      try {
        const assetRes = await env.ASSETS.fetch(request);
        if (assetRes.status < 400) {
          const headers = new Headers(assetRes.headers);
          headers.set("Access-Control-Allow-Origin", "*");
          headers.set("Cross-Origin-Resource-Policy", "cross-origin");
          headers.set("Timing-Allow-Origin", "*");
          headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
          return new Response(assetRes.body, {
            status: assetRes.status,
            statusText: assetRes.statusText,
            headers,
          });
        }
      } catch (e) {
        // Fall back to backend on error
      }
    }

    const backendHost = env?.BACKEND_HOST || "fileshare-live.onrender.com";
    const targetUrl = new URL(request.url);
    targetUrl.hostname = backendHost;
    targetUrl.protocol = "https:";
    targetUrl.port = "";

    const headers = new Headers(request.headers);
    headers.set("Host", backendHost);
    headers.set("X-Forwarded-Host", "filesp.pages.dev");
    headers.set("X-Forwarded-Proto", "https");

    const clientIp = request.headers.get("CF-Connecting-IP");
    if (clientIp) {
      headers.set("X-Forwarded-For", clientIp);
      headers.set("X-Real-IP", clientIp);
    }

    const init = {
      method: request.method,
      headers: headers,
      redirect: "manual",
    };

    if (request.method !== "GET" && request.method !== "HEAD" && request.body) {
      init.body = request.body;
      init.duplex = "half";
    }

    try {
      const response = await fetch(targetUrl.toString(), init);
      const newHeaders = new Headers(response.headers);
      const contentType = response.headers.get("content-type") || "";

      // Allow cross-origin embedding for images, fonts, and static assets
      if (
        isImageOrAsset ||
        contentType.startsWith("image/") ||
        contentType.startsWith("font/")
      ) {
        newHeaders.set("Access-Control-Allow-Origin", "*");
        newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");
        newHeaders.set("Timing-Allow-Origin", "*");
        newHeaders.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
      }

      const location = response.headers.get("Location") || response.headers.get("location");
      if (location) {
        const rewrittenLocation = location
          .replace(`https://${backendHost}`, "https://filesp.pages.dev")
          .replace(`http://${backendHost}`, "https://filesp.pages.dev")
          .replace("https://fileshare.shptechnology.online", "https://filesp.pages.dev")
          .replace("http://fileshare.shptechnology.online", "https://filesp.pages.dev");
        newHeaders.set("location", rewrittenLocation);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      return new Response("Service temporarily starting up. Please refresh in a moment.", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};
