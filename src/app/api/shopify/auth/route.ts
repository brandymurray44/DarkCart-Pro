import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { buildShopifyAuthUrl, validateShopifyShop } from "@/lib/shopify";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
  }

  try {
    const validatedShop = validateShopifyShop(shop);
    const state = uuid();
    const response = NextResponse.redirect(buildShopifyAuthUrl(validatedShop, state));
    response.cookies.set("shopify_oauth_state", state, {
      httpOnly: true,
      path: "/",
      maxAge: 600,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid shop" }, { status: 400 });
  }
}
