import { NextResponse } from "next/server";
import { processShopifyWebhookEvent, validateShopifyWebhookHmac } from "@/services/shopify/webhookService";

export async function POST(request: Request) {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const topic = request.headers.get("x-shopify-topic") ?? "";
  const shopDomain = request.headers.get("x-shopify-shop-domain") ?? "";

  // Limit webhook payload size to prevent DoS (max 1MB)
  const rawBody = await request.text();
  if (rawBody.length > 1024 * 1024) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

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
    // Validate topic to prevent injection
    const validTopics = ["app/uninstalled", "orders/create", "products/update"];
    if (!validTopics.includes(topic)) {
      console.warn(`[Shopify Webhook] Unsupported topic: ${topic}`);
      return NextResponse.json({ error: "Unsupported webhook topic" }, { status: 400 });
    }

    // Sanitize shop domain
    const sanitizedShopDomain = shopDomain.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase();

    await processShopifyWebhookEvent({
      topic,
      shopDomain: sanitizedShopDomain,
      payload,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Shopify Webhook] Processing error:", error);
    // Don't expose internal error details
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
