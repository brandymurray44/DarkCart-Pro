import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { buildShopifyAuthUrl, validateShopifyShop } from "@/lib/shopify";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateRequiredEnvVars } from "@/lib/env";

export async function GET(request: Request) {
  // Ensure critical environment variables are present before starting OAuth
  try {
    validateRequiredEnvVars();
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Missing environment variables" }, { status: 500 });
  }
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
  }

  // Rate limiting: prevent OAuth initiation abuse
  const rateLimitResult = await checkRateLimit(`oauth_init:${shop}`, {
    limit: 5,
    window: 60 * 1000, // 5 requests per minute per shop
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many authentication attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const validatedShop = validateShopifyShop(shop);
    const state = uuid();
    const response = NextResponse.redirect(buildShopifyAuthUrl(validatedShop, state));
    response.cookies.set("shopify_oauth_state", state, {
      httpOnly: true,
      path: "/",
      maxAge: 600,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid shop" }, { status: 400 });
  }
}
