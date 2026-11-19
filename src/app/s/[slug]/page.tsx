import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { SharePage } from "@/components/SharePage";
import { slugSchema } from "@/lib/validators";
import { getAppUrl, getDefaultOgImages } from "@/lib/seo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

interface PageRow {
  slug: string;
  isProtected: number;
  content: string | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const appUrl = getAppUrl();
  const { slug } = await params;
  const canonicalUrl = `${appUrl}/s/${slug}`;

  return {
    title: `${slug} — Live Workspace`,
    description: `Collaborate live in real-time at /s/${slug}. Instant markdown editing and file sharing vault.`,
    robots: {
      index: false,
      follow: false,
      noimageindex: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${slug} — FileShare Live Space`,
      description: `Real-time collaborative text and file sharing workspace at /s/${slug}.`,
      url: canonicalUrl,
      siteName: "FileShare",
      locale: "en_US",
      type: "website",
      images: getDefaultOgImages(
        appUrl,
        `FileShare Workspace - ${slug}`
      ),
    },
    twitter: {
      card: "summary_large_image",
      site: "@SandeshPat007",
      creator: "@SandeshPat007",
      title: `${slug} — FileShare Live Space`,
      description: `Collaborate live in real-time at /s/${slug}.`,
      images: [`${appUrl}/og-image.png`],
    },
  };
}

function getDefaultStarterContent(slug: string): string {
  return `# /s/${slug}

Welcome to your live workspace. Type notes here in Markdown, or drag and drop files to share.
`;
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  // Validate slug format
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) {
    notFound();
  }

  const starterContent = getDefaultStarterContent(slug);

  // Get or auto-initialize page record
  let page = (await db.prepare("SELECT slug, isProtected, content FROM pages WHERE slug = ?").get(slug)) as PageRow | undefined;

  if (!page) {
    // Check if this slug was previously renamed to a new slug.
    // NOTE: redirect() works by throwing, so it must stay OUTSIDE the
    // try/catch below — catching it would swallow the redirect, resurrect
    // the old slug as a blank page, and return 200 instead of redirecting.
    let redirectRow: { newSlug?: string } | undefined;
    try {
      redirectRow = (await db.prepare("SELECT newSlug FROM redirects WHERE oldSlug = ?").get(slug)) as { newSlug?: string } | undefined;
    } catch {
      // redirects table not yet provisioned — fall through to provisioning
      redirectRow = undefined;
    }
    if (redirectRow?.newSlug) {
      redirect(`/s/${redirectRow.newSlug}`);
    }

    try {
      await db.prepare("INSERT INTO pages (slug, content, isProtected) VALUES (?, ?, 0)").run(slug, starterContent);
      page = { slug, isProtected: 0, content: starterContent };
    } catch {
      page = (await db.prepare("SELECT slug, isProtected, content FROM pages WHERE slug = ?").get(slug)) as PageRow | undefined;
      if (!page) notFound();
    }
  }

  // Ensure content is never an empty screen even on existing blank rows
  const effectiveContent = (page.content && page.content.trim().length > 0) ? page.content : starterContent;

  return (
    <SharePage
      pageData={{
        slug: page.slug,
        isProtected: Boolean(page.isProtected),
        content: effectiveContent,
      }}
    />
  );
}
