import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { getAppUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = getAppUrl();
  const articles = getAllArticles();

  // Primary static images for Google Image Sitemap indexing
  const defaultImages = [`${appUrl}/og-image.png`, `${appUrl}/logo.png`];
  const brandImages = [`${appUrl}/logo.png`, `${appUrl}/icon.png`];

  const routes: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      images: defaultImages,
      alternates: {
        languages: {
          en: appUrl,
          "x-default": appUrl,
        },
      },
    },
    {
      url: `${appUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
      images: defaultImages,
      alternates: {
        languages: {
          en: `${appUrl}/projects`,
          "x-default": `${appUrl}/projects`,
        },
      },
    },
    {
      url: `${appUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images: defaultImages,
      alternates: {
        languages: {
          en: `${appUrl}/guide`,
          "x-default": `${appUrl}/guide`,
        },
      },
    },
    {
      url: `${appUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      images: defaultImages,
      alternates: {
        languages: {
          en: `${appUrl}/resources`,
          "x-default": `${appUrl}/resources`,
        },
      },
    },
    {
      url: `${appUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
      images: brandImages,
      alternates: {
        languages: {
          en: `${appUrl}/about`,
          "x-default": `${appUrl}/about`,
        },
      },
    },
    {
      url: `${appUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: brandImages,
      alternates: {
        languages: {
          en: `${appUrl}/contact`,
          "x-default": `${appUrl}/contact`,
        },
      },
    },
    {
      url: `${appUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${appUrl}/privacy`,
          "x-default": `${appUrl}/privacy`,
        },
      },
    },
    {
      url: `${appUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${appUrl}/terms`,
          "x-default": `${appUrl}/terms`,
        },
      },
    },
    {
      url: `${appUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${appUrl}/cookies`,
          "x-default": `${appUrl}/cookies`,
        },
      },
    },
    {
      url: `${appUrl}/refund`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${appUrl}/refund`,
          "x-default": `${appUrl}/refund`,
        },
      },
    },
  ];

  // Add all comprehensive high-value engineering resources and articles
  // with their real publish dates, image extensions, and language alternates.
  for (const article of articles) {
    const published = new Date(article.date);
    routes.push({
      url: `${appUrl}/resources/${article.slug}`,
      lastModified: Number.isNaN(published.getTime()) ? new Date() : published,
      changeFrequency: "weekly",
      priority: 0.85,
      images: defaultImages,
      alternates: {
        languages: {
          en: `${appUrl}/resources/${article.slug}`,
          "x-default": `${appUrl}/resources/${article.slug}`,
        },
      },
    });
  }

  return routes;
}
