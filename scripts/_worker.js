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

      // Allow cross-origin embedding specifically for public images & fonts
      const isPublicImage =
        pathname === "/og-image.png" ||
        pathname === "/logo.png" ||
        pathname === "/favicon.ico" ||
        pathname === "/favicon.png" ||
        pathname === "/icon.svg" ||
        pathname === "/manifest.json" ||
        contentType.startsWith("image/");

      if (isPublicImage) {
        newHeaders.set("Access-Control-Allow-Origin", "*");
        newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");
        newHeaders.set("Timing-Allow-Origin", "*");
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
