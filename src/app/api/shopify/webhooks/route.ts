import { NextResponse } from "next/server";
import { processShopifyWebhookEvent, validateShopifyWebhookHmac } from "@/services/shopify/webhookService";

export async function POST(request: Request) {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const topic = request.headers.get("x-shopify-topic") ?? "";
  const shopDomain = request.headers.get("x-shopify-shop-domain") ?? "";

  const rawBody = await request.text();

  if (!hmacHeader) {
    return NextResponse.json({ error: "Missing HMAC header" }, { status: 400 });
  }

  try {
    const valid = validateShopifyWebhookHmac(rawBody, hmacHeader);
    if (!valid) {
      return NextResponse.json({ error: "Invalid Shopify webhook signature" }, { status: 401 });
    }
  } catch (error) {
    console.error("[Shopify Webhook] HMAC validation error:", error);
    return NextResponse.json({ error: "Webhook validation failed" }, { status: 500 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    console.error("[Shopify Webhook] Invalid JSON payload:", error);
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  try {
    await processShopifyWebhookEvent({
      topic,
      shopDomain,
      payload,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Shopify Webhook] Processing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 500 }
    );
  }
}
