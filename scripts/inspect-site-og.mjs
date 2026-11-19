const urls = [
  "https://filesp.pages.dev/",
  "https://filesp.pages.dev/about",
  "https://filesp.pages.dev/guide",
  "https://filesp.pages.dev/privacy",
  "https://filesp.pages.dev/terms",
  "https://filesp.pages.dev/contact",
  "https://filesp.pages.dev/refund",
  "https://filesp.pages.dev/blog",
  "https://filesp.pages.dev/resources",
  "https://filesp.pages.dev/cookies",
];

async function fetchOG(rawUrl) {
  let normalizedUrl = rawUrl;
  if (!normalizedUrl.startsWith("http")) normalizedUrl = `https://${normalizedUrl}`;
  const response = await fetch(normalizedUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; OpenGraphBot/1.0; +https://opengraph.to)",
      "Accept": "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();

  // Extract <title>...</title>
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const htmlTitle = titleMatch ? titleMatch[1].trim() : "";

  // Extract all <meta> tags
  const metaRegex = /<meta\s+([^>]+)>/gi;
  let match;
  const allMeta = [];
  while ((match = metaRegex.exec(html)) !== null) {
    const metaAttrs = match[1];
    const propMatch = metaAttrs.match(/property=["']([^"']+)["']/i);
    const nameMatch = metaAttrs.match(/name=["']([^"']+)["']/i);
    const contentMatch = metaAttrs.match(/content=["']([^"']*)["']/i);

    const property = propMatch ? propMatch[1] : undefined;
    const name = nameMatch ? nameMatch[1] : undefined;
    const content = contentMatch ? contentMatch[1] : "";

    if ((property || name) && content) {
      allMeta.push({ property, name, content });
    }
  }

  const getMeta = (keyType, keyValue) => {
    const found = allMeta.find((m) => m[keyType]?.toLowerCase() === keyValue.toLowerCase());
    return found ? found.content : "";
  };

  const ogImage = getMeta("property", "og:image");
  const resolveUrl = (relative) => {
    if (!relative) return "";
    if (relative.startsWith("http")) return relative;
    if (relative.startsWith("//")) return `https:${relative}`;
    try {
      return new URL(relative, normalizedUrl).href;
    } catch {
      return relative;
    }
  };

  let image = null;
  if (ogImage) {
    const w = getMeta("property", "og:image:width");
    const h = getMeta("property", "og:image:height");
    image = {
      url: resolveUrl(ogImage),
      width: w ? parseInt(w) : null,
      height: h ? parseInt(h) : null,
      alt: getMeta("property", "og:image:alt"),
    };
  }

  return {
    url: normalizedUrl,
    title: getMeta("property", "og:title") || htmlTitle,
    description: getMeta("property", "og:description") || getMeta("name", "description"),
    siteName: getMeta("property", "og:site_name"),
    type: getMeta("property", "og:type") || "website",
    image,
    twitter: {
      card: getMeta("name", "twitter:card"),
      site: getMeta("name", "twitter:site"),
      title: getMeta("name", "twitter:title"),
      description: getMeta("name", "twitter:description"),
      image: resolveUrl(getMeta("name", "twitter:image")),
    },
    meta: allMeta,
  };
}

function analyze(data) {
  const issues = [];
  let deductions = 0;
  if (!data.title) {
    issues.push("❌ Missing og:title");
    deductions += 15;
  } else if (data.title.length > 60) {
    issues.push(`⚠️ Title too long (${data.title.length} chars, max 60)`);
    deductions += 8;
  }
  if (!data.description) {
    issues.push("❌ Missing og:description");
    deductions += 15;
  } else if (data.description.length > 160) {
    issues.push(`⚠️ Description too long (${data.description.length} chars, max 160)`);
    deductions += 8;
  } else if (data.description.length < 50) {
    issues.push(`ℹ️ Description is short (${data.description.length} chars)`);
    deductions += 3;
  }
  if (!data.image) {
    issues.push("❌ Missing og:image — posts without images get less engagement");
    deductions += 15;
  } else {
    if (!data.image.width || !data.image.height) {
      issues.push("⚠️ Missing og:image:width and og:image:height");
      deductions += 8;
    }
    if (!data.image.alt) {
      issues.push("ℹ️ Missing og:image:alt for accessibility");
      deductions += 3;
    }
  }
  if (!data.twitter.card) {
    issues.push("⚠️ Missing twitter:card");
    deductions += 8;
  }
  if (!data.siteName) {
    issues.push("ℹ️ Missing og:site_name");
    deductions += 3;
  }
  const hasOgUrl = data.meta.some((m) => m.property === "og:url");
  if (!hasOgUrl) {
    issues.push("⚠️ Missing og:url");
    deductions += 8;
  }
  return { score: Math.max(0, 100 - deductions), issues };
}

for (const url of urls) {
  try {
    const data = await fetchOG(url);
    const result = analyze(data);
    console.log(`\n========================================`);
    console.log(`URL: ${url}`);
    console.log(`Score: ${result.score}/100`);
    console.log(`Title: "${data.title}" (${data.title?.length || 0} chars)`);
    console.log(`Description: "${data.description}" (${data.description?.length || 0} chars)`);
    console.log(`Site Name: "${data.siteName}"`);
    console.log(`Image:`, data.image);
    console.log(`Twitter Card: "${data.twitter.card}"`);
    if (result.issues.length > 0) {
      console.log(`Issues:`);
      result.issues.forEach((issue) => console.log(`  ${issue}`));
    } else {
      console.log(`✅ Perfect OpenGraph implementation (100/100)!`);
    }
  } catch (err) {
    console.error(`Error inspecting ${url}:`, err.message);
  }
}
