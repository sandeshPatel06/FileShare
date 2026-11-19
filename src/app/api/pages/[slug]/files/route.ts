import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { rateLimit } from "@/lib/rateLimiter";
import { verifyPageToken } from "@/lib/jwt";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

interface FileRow {
  fileId: string;
  originalName: string;
  storedName: string;
  mimetype: string;
  size: number;
  downloadURL: string;
  uploadedAt: string | null;
}

interface PageRow {
  isProtected: number;
}

function parseUtcSeconds(uploadedAt: unknown): number {
  if (!uploadedAt) return Math.floor(Date.now() / 1000);
  if (uploadedAt instanceof Date) {
    return Math.floor(uploadedAt.getTime() / 1000);
  }
  if (typeof uploadedAt === "number") {
    return uploadedAt > 1e11 ? Math.floor(uploadedAt / 1000) : Math.floor(uploadedAt);
  }
  const str = String(uploadedAt).trim();
  if (!str) return Math.floor(Date.now() / 1000);

  // If already contains timezone indicator (Z or +/-offset at the end, e.g. +05:30)
  if (str.endsWith("Z") || /[+-]\d{2}(:?\d{2})?$/.test(str)) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
  }

  // SQLite CURRENT_TIMESTAMP format "YYYY-MM-DD HH:MM:SS" is always stored in UTC.
  // Converting it to ISO format with trailing "Z" ensures JavaScript parses it as UTC
  // regardless of what timezone the server's Node.js environment is set to (e.g. IST +05:30).
  const iso = str.includes("T") ? `${str}Z` : `${str.replace(" ", "T")}Z`;
  const d = new Date(iso);
  if (!isNaN(d.getTime())) {
    return Math.floor(d.getTime() / 1000);
  }

  const directDate = new Date(str);
  return isNaN(directDate.getTime()) ? Math.floor(Date.now() / 1000) : Math.floor(directDate.getTime() / 1000);
}

// GET /api/pages/[slug]/files — list all files for a page (verifies auth if protected)
export async function GET(req: NextRequest, ctx: RouteContext) {
  const limited = await rateLimit(req, "general");
  if (limited) return limited;

  const { slug } = await ctx.params;

  const page = (await db.prepare("SELECT isProtected FROM pages WHERE slug = ?").get(slug)) as PageRow | undefined;
  if (page?.isProtected) {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const payload = await verifyPageToken(token);
    if (payload?.slug !== slug) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const files = (await db.prepare(`
      SELECT fileId, originalName, storedName, mimetype, size, downloadURL, uploadedAt
      FROM files
      WHERE slug = ?
      ORDER BY uploadedAt DESC
    `).all(slug)) as FileRow[];

    const formattedFiles = files.map((f) => ({
      fileId: f.fileId,
      originalName: f.originalName,
      mimetype: f.mimetype,
      size: f.size,
      downloadURL: f.downloadURL,
      uploadedAt: f.uploadedAt ? { seconds: parseUtcSeconds(f.uploadedAt) } : null,
    }));

    return NextResponse.json(formattedFiles);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch files";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
