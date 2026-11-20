import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { buildShopifyAuthUrl, validateShopifyShop } from "@/lib/shopify";
import { checkRateLimit } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";

// Shopify OAuth initiation endpoint (alias for /api/shopify/auth)
export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
      const duration = Date.now() - startTime;
      logger.api('/api/auth', 'GET', 400, duration, undefined, 'Missing shop parameter');
      return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
    }

    // Sanitize shop parameter
    const sanitizedShop = shop.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase();

    // Rate limiting: prevent OAuth initiation abuse
    const rateLimitResult = await checkRateLimit(`oauth_init:${sanitizedShop}`, {
      limit: 5,
      window: 60 * 1000, // 5 requests per minute per shop
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many authentication attempts. Please try again later." },
        { status: 429 }
      );
    }

    const validatedShop = validateShopifyShop(sanitizedShop);
    const state = uuid();
    const response = NextResponse.redirect(buildShopifyAuthUrl(validatedShop, state));
    response.cookies.set("shopify_oauth_state", state, {
      httpOnly: true,
      path: "/",
      maxAge: 600,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const duration = Date.now() - startTime;
    logger.auth('oauth_start', undefined, sanitizedShop);
    logger.api('/api/auth', 'GET', 302, duration);

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.api('/api/auth', 'GET', 400, duration, undefined, 'Invalid shop parameter');
    return NextResponse.json({ error: "Invalid shop parameter" }, { status: 400 });
  }
}
