#!/usr/bin/env bash
# Deploy filesp.pages.dev Edge Worker to Cloudflare Pages
set -e
DEPLOY_DIR=$(mktemp -d)
cp /tmp/filesp-deploy/_worker.js "$DEPLOY_DIR/" 2>/dev/null || cat << 'WORKER_EOF' > "$DEPLOY_DIR/_worker.js"
export default {
  async fetch(request, env) {
    const targetUrl = new URL(request.url);
    targetUrl.hostname = "fileshare-live.onrender.com";
    targetUrl.protocol = "https:";
    targetUrl.port = "";

    const headers = new Headers(request.headers);
    headers.set("Host", "fileshare-live.onrender.com");
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
      redirect: "manual"
    };

    if (request.method !== "GET" && request.method !== "HEAD" && request.body) {
      init.body = request.body;
      init.duplex = "half";
    }

    try {
      const response = await fetch(targetUrl.toString(), init);
      const location = response.headers.get("Location") || response.headers.get("location");
      if (location) {
        const newHeaders = new Headers(response.headers);
        const rewrittenLocation = location
          .replace("https://fileshare-live.onrender.com", "https://filesp.pages.dev")
          .replace("http://fileshare-live.onrender.com", "https://filesp.pages.dev")
          .replace("https://fileshare.shptechnology.online", "https://filesp.pages.dev")
          .replace("http://fileshare.shptechnology.online", "https://filesp.pages.dev");
        newHeaders.set("location", rewrittenLocation);

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      }
      return response;
    } catch (err) {
      return new Response("Service temporarily starting up. Please refresh in a moment.", {
        status: 503,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }
};
WORKER_EOF
touch "$DEPLOY_DIR/index.html"
wrangler pages deploy "$DEPLOY_DIR" --project-name filesp --branch main
rm -rf "$DEPLOY_DIR"
echo "Deployed successfully to filesp.pages.dev!"
