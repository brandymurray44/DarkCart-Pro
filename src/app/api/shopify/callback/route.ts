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
import { getSessionUser } from "@/lib/auth";
import { registerShopifyWebhooks } from "@/services/shopify/webhookService";

export async function GET(request: Request) {
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

  // Get authenticated user
  const user = await getSessionUser();
  if (!user) {
    console.warn("[OAuth] User not authenticated");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Exchange authorization code for offline access token
    console.log(`[OAuth] Exchanging code for token: ${shop}`);
    const tokenResponse = await exchangeCodeForToken(shop, code);

    // Fetch shop metadata
    console.log(`[OAuth] Fetching shop metadata: ${shop}`);
    const metadata = await fetchShopMetadata(shop, tokenResponse.access_token);

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
    const dashboardUrl = `${process.env.SHOPIFY_APP_URL ?? "http://localhost:3000"}/dashboard?shop=${encodeURIComponent(shop)}&success=true`;
    return NextResponse.redirect(dashboardUrl);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[OAuth] Callback error:", errorMessage);

    // Clear OAuth state cookie on error
    cookieStore.delete("shopify_oauth_state");

    // Redirect to dashboard with error
    const errorUrl = `${process.env.SHOPIFY_APP_URL ?? "http://localhost:3000"}/dashboard?error=${encodeURIComponent(errorMessage)}`;
    return NextResponse.redirect(errorUrl);
  }
}

