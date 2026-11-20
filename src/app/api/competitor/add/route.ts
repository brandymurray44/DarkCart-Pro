import { NextResponse } from "next/server";
import { z } from "zod";
import { discoverCompetitorStores } from "@/services/competitorDiscovery";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { logger } from "@/lib/logger";

const addCompetitorSchema = z.object({
  niche: z.string().min(3).max(100),
});

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const user = await getSessionUser();

    if (!user) {
      const duration = Date.now() - startTime;
      logger.api('/api/competitor/add', 'POST', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    const { verifyCSRF } = await import("@/lib/authServer");
    if (!csrfToken || !(await verifyCSRF(csrfToken))) {
      const duration = Date.now() - startTime;
      logger.security('CSRF verification failed', 'high', { userId: user.id, endpoint: '/api/competitor/add' });
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    // Rate limiting for competitor discovery
    const { checkRateLimit } = await import("@/lib/rateLimit");
    const rateLimitResult = await checkRateLimit(`competitor_discover:${user.id}`, {
      limit: 5,
      window: 60 * 60 * 1000, // 5 requests per hour
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many discovery requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = addCompetitorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { niche } = parsed.data;

    // Sanitize niche input
    const sanitizedNiche = niche.replace(/[<>{}[\]\\]/g, '').trim();

    logger.info('Discovering competitors', { userId: user.id, niche: sanitizedNiche });
    const discovered = await discoverCompetitorStores(sanitizedNiche);

    if (discovered.length === 0) {
      return NextResponse.json(
        { error: "No competitor stores found for this niche" },
        { status: 404 }
      );
    }

    // Save discovered competitors to database for future tracking
    for (const store of discovered) {
      try {
        await prisma.competitorSpy.create({
          data: {
            id: `discover_${store.domain}_${Date.now()}`,
            shopUrl: store.domain,
            productUrl: `https://${store.domain}`,
            summary: `Competitor: ${store.shopName}`,
            rawData: JSON.stringify({
              niche,
              isShopify: store.isShopify,
              discoveredAt: new Date().toISOString(),
            }),
          },
        });
      } catch (error) {
        console.warn(`Failed to save competitor ${store.domain}:`, error);
      }
    }

    const duration = Date.now() - startTime;
    logger.api('/api/competitor/add', 'POST', 200, duration, user.id);
    logger.info('Competitor discovery completed', { userId: user.id, discovered: discovered.length });
    return NextResponse.json(
      {
        success: true,
        discovered: discovered.length,
        stores: discovered,
      },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Competitor discovery error', error instanceof Error ? error : undefined, { duration });
    // Don't expose internal error details to client
    return NextResponse.json(
      {
        error: "Failed to discover competitors. Please try again.",
      },
      { status: 500 }
    );
  }
}
