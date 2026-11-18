import { SignJWT, jwtVerify } from "jose";

const secretValue = process.env.JWT_SECRET;

// Fail closed in production runtime: dev keeps the fallback for zero-config local runs.
// During static build collection (NEXT_PHASE=phase-production-build or npm build),
// allow compilation without requiring build-time runtime secrets.
const isBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.npm_lifecycle_event === "build";

if (!secretValue && process.env.NODE_ENV === "production" && !isBuildPhase) {
  throw new Error(
    "JWT_SECRET is not set. Refusing to start with a publicly-known signing key."
  );
}

const secret = new TextEncoder().encode(
  secretValue ?? "fallback-dev-secret-change-in-production"
);

export interface PageSessionPayload {
  slug: string;
  iat?: number;
  exp?: number;
}

/** Issue a 24-hour JWT scoped to a specific page slug */
export async function signPageToken(slug: string): Promise<string> {
  return new SignJWT({ slug })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

/** Verify a page token — returns payload or null if invalid/expired */
export async function verifyPageToken(
  token: string
): Promise<PageSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    if (typeof (payload as Record<string, unknown>).slug !== "string") {
      return null;
    }
    return payload as unknown as PageSessionPayload;
  } catch {
    return null;
  }
}
