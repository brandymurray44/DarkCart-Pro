import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { validateShopifyShop } from "@/lib/shopify";
import {
  validateShopifyHmac,
  exchangeCodeForToken,
  fetchShopMetadata,
  getShopProductCount,
} from "@/lib/shopifyOAuth";
import { getSessionUser, createSession } from "@/lib/auth";
import { registerShopifyWebhooks } from "@/services/shopify/webhookService";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateRequiredEnvVars } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    validateRequiredEnvVars();
  } catch (err) {
    const duration = Date.now() - startTime;
    logger.error('OAuth callback validation failed', err instanceof Error ? err : undefined);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Missing environment variables" }, { status: 500 });
  }
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams);

  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const hmac = url.searchParams.get("hmac");

  // Validate required parameters
  if (!shop || !code || !state || !hmac) {
    console.warn("[OAuth] Missing required callback parameters");
    return NextResponse.json(
      { error: "Missing Shopify callback data" },
      { status: 400 }
    );
  }

  // Rate limiting: prevent callback abuse
  const rateLimitResult = await checkRateLimit(`oauth_callback:${shop}`, {
    limit: 10,
    window: 60 * 1000, // 10 requests per minute per shop
  });

  if (!rateLimitResult.success) {
    const duration = Date.now() - startTime;
    logger.rateLimit(`oauth_callback:${shop}`, 10, 60 * 1000, false);
    logger.security('OAuth callback rate limit exceeded', 'medium', { shop });
    return NextResponse.json(
      { error: "Too many authentication attempts. Please try again later." },
      { status: 429 }
    );
  }

  // Get state from cookies
  const cookieStore = await cookies();
  const storedState = cookieStore.get("shopify_oauth_state")?.value;

  if (!storedState) {
    console.warn("[OAuth] No stored OAuth state found");
    return NextResponse.json(
      { error: "OAuth state not found" },
      { status: 400 }
    );
  }

  // Verify state matches
  if (state !== storedState) {
    console.warn("[OAuth] State mismatch");
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  }

  // Validate HMAC signature
  try {
    const isValid = validateShopifyHmac(queryParams, hmac);
    if (!isValid) {
      console.warn("[OAuth] HMAC validation failed");
      return NextResponse.json(
        { error: "Invalid HMAC signature" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("[OAuth] HMAC validation error:", error);
    return NextResponse.json(
      { error: "HMAC validation failed" },
      { status: 500 }
    );
  }

  // Validate shop format
  try {
    validateShopifyShop(shop);
  } catch {
    console.warn("[OAuth] Invalid shop domain format");
    return NextResponse.json(
      { error: "Invalid shop domain" },
      { status: 400 }
    );
  }

  try {
    // Exchange authorization code for offline access token
    const tokenResponse = await exchangeCodeForToken(shop, code);

    // Fetch shop metadata
    console.log(`[OAuth] Fetching shop metadata: ${shop}`);
    const metadata = await fetchShopMetadata(shop, tokenResponse.access_token);

    // Get or create user based on shop email
    let user = await getSessionUser();
    if (!user) {
      console.log(`[OAuth] No user session, creating user from shop email: ${metadata.email}`);

      // Check if user already exists with this email
      user = await prisma.user.findUnique({
        where: { email: metadata.email },
      });

      if (!user) {
        // Create new user from shop metadata
        user = await prisma.user.create({
          data: {
            email: metadata.email,
            name: metadata.name || shop.split(".")[0],
          },
        });
        console.log(`[OAuth] Created new user: ${user.id}`);
      }

      // Create session for the user
      await createSession(user.id);
      console.log(`[OAuth] Created session for user: ${user.id}`);
    }

    // Get product count
    const productCount = await getShopProductCount(
      shop,
      tokenResponse.access_token
    );

    // Create or update shop record with metadata
    console.log(`[OAuth] Saving shop record: ${shop}`);
    const shopRecord = await prisma.shop.upsert({
      where: { shopifyDomain: shop },
      update: {
        accessToken: tokenResponse.access_token,
        scopes: tokenResponse.scope,
        userId: user.id,
      },
      create: {
        shopifyDomain: shop,
        accessToken: tokenResponse.access_token,
        scopes: tokenResponse.scope,
        userId: user.id,
      },
    });

    try {
      await registerShopifyWebhooks(shop, tokenResponse.access_token);
      console.log(`[OAuth] Registered Shopify webhooks for ${shop}`);
    } catch (webhookError) {
      console.error(
        `[OAuth] Failed to register Shopify webhooks for ${shop}:`,
        webhookError
      );
    }

    console.log(
      `[OAuth] Successfully authenticated shop: ${shop} (${productCount} products)`
    );

    // Clear OAuth state cookie
    cookieStore.delete("shopify_oauth_state");

    // Redirect to dashboard with success
    const appUrl = process.env.SHOPIFY_APP_URL ?? "http://localhost:3000";
    const dashboardUrl = `${appUrl}/dashboard?shop=${encodeURIComponent(shop)}&success=true`;
    return NextResponse.redirect(dashboardUrl);
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.auth('oauth_failure', undefined, shop, { error: errorMessage, duration });
    logger.error('OAuth callback error', error instanceof Error ? error : undefined, { shop });

    // Clear OAuth state cookie on error
    cookieStore.delete("shopify_oauth_state");

    // Redirect to dashboard with sanitized error (don't expose internal details)
    const sanitizedError = "Authentication failed. Please try again.";
    const errorUrl = `${process.env.SHOPIFY_APP_URL ?? "http://localhost:3000"}/dashboard?error=${encodeURIComponent(sanitizedError)}`;
    return NextResponse.redirect(errorUrl);
  }
}