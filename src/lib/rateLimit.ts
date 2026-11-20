import { headers } from "next/headers";
import prisma from "@/lib/db";
import { logger } from "@/lib/logger";

/**
 * DB-backed rate limiter for serverless environments.
 * Uses the RateLimitEntry model to persist counters across cold starts.
 */

interface RateLimitOptions {
  limit?: number;
  window?: number; // milliseconds
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
}

/**
 * Rate limit based on the caller's IP address.
 * Uses the DB-backed store so it works across serverless instances.
 */
export async function rateLimit(
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const { limit = 10, window = 60 * 1000 } = options;
  const headersList = headers();
  const ip =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    "unknown";

  return checkRateLimit(ip, { limit, window });
}

/**
 * Rate limit based on an arbitrary identifier (shop domain, user ID, etc.)
 */
export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const { limit = 10, window = 60 * 1000 } = options;
  const key = `rl:${identifier}`;
  const now = new Date();

  try {
    // Try to find existing entry
    const entry = await prisma.rateLimitEntry.findUnique({ where: { key } });

    if (!entry || entry.resetAt < now) {
      // No entry or expired — create/reset
      await prisma.rateLimitEntry.upsert({
        where: { key },
        update: {
          count: 1,
          resetAt: new Date(now.getTime() + window),
        },
        create: {
          key,
          count: 1,
          resetAt: new Date(now.getTime() + window),
        },
      });
      return { success: true, remaining: limit - 1 };
    }

    if (entry.count >= limit) {
      logger.rateLimit(identifier, limit, window, false);
      logger.security('Rate limit exceeded', 'medium', { identifier, limit, window });
      return { success: false, remaining: 0 };
    }

    // Increment counter
    await prisma.rateLimitEntry.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    logger.rateLimit(identifier, limit, window, true);
    return { success: true, remaining: limit - entry.count - 1 };
  } catch (error) {
    // If DB is unavailable, allow the request (fail open)
    console.error("[RateLimit] DB error, failing open:", error);
    return { success: true, remaining: limit - 1 };
  }
}

/**
 * Clean up expired rate limit entries. Call this periodically (e.g., from a cron job).
 */
export async function cleanupExpiredRateLimits(): Promise<number> {
  try {
    const result = await prisma.rateLimitEntry.deleteMany({
      where: { resetAt: { lt: new Date() } },
    });
    return result.count;
  } catch (error) {
    console.error("[RateLimit] Cleanup error:", error);
    return 0;
  }
}
