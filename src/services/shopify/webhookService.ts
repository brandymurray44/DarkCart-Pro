import { createHmac } from "crypto";
import prisma from "@/lib/db";
import { getAppUrl } from "@/lib/env";

const SHOPIFY_API_VERSION = "2026-04";
const DEFAULT_WEBHOOK_TOPICS = [
  "app/uninstalled",
  "orders/create",
  "products/update",
] as const;

const webhookRequestSchema = {
  appUninstalled: { myshopify_domain: "string", domain: "string" },
};

function getShopifyWebhookAddress(): string {
  return `${getAppUrl()}/api/shopify/webhooks`;
}

export function validateShopifyWebhookHmac(
  rawBody: string,
  hmacHeader: string
): boolean {
  if (!process.env.SHOPIFY_API_SECRET) {
    throw new Error("Missing SHOPIFY_API_SECRET");
  }

  const hmac = createHmac("sha256", process.env.SHOPIFY_API_SECRET);
  hmac.update(rawBody, "utf8");
  const calculated = hmac.digest("base64");

  if (calculated.length !== hmacHeader.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < calculated.length; i += 1) {
    result |= calculated.charCodeAt(i) ^ hmacHeader.charCodeAt(i);
  }

  return result === 0;
}

export async function registerShopifyWebhooks(
  shopDomain: string,
  accessToken: string
): Promise<void> {
  const address = getShopifyWebhookAddress();

  await Promise.all(
    DEFAULT_WEBHOOK_TOPICS.map(async (topic) => {
      const response = await fetch(
        `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/webhooks.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
          },
          body: JSON.stringify({
            webhook: {
              topic,
              address,
              format: "json",
            },
          }),
        }
      );

      if (!response.ok) {
        const body = await response.text();
        const normalizedBody = body.toLowerCase();

        if (
          response.status === 422 &&
          (normalizedBody.includes("already exists") ||
            normalizedBody.includes("duplicate"))
        ) {
          return;
        }

        throw new Error(
          `Failed to register Shopify webhook ${topic}: ${response.status} ${body}`
        );
      }
    })
  );
}

interface ShopifyWebhookEvent {
  topic: string;
  shopDomain: string;
  payload: unknown;
}

function parseShopifyAppUninstalledPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Empty webhook payload");
  }

  const parsed = payload as Record<string, unknown>;
  const myshopifyDomain = typeof parsed.myshopify_domain === "string" ? parsed.myshopify_domain : undefined;
  const domain = typeof parsed.domain === "string" ? parsed.domain : undefined;

  return { myshopifyDomain, domain };
}

export async function processShopifyWebhookEvent(event: ShopifyWebhookEvent): Promise<void> {
  const normalizedTopic = event.topic.toLowerCase();
  const shopDomainHeader = event.shopDomain.trim().toLowerCase();

  if (normalizedTopic === "app/uninstalled") {
    const { myshopifyDomain, domain } = parseShopifyAppUninstalledPayload(event.payload);
    const shopDomain = shopDomainHeader || myshopifyDomain || domain;

    if (!shopDomain) {
      throw new Error("Unable to determine shop domain for app/uninstalled event");
    }

    await prisma.shop.updateMany({
      where: {
        shopifyDomain: shopDomain,
      },
      data: {
        accessToken: "",
        refreshToken: null,
        scopes: "",
      },
    });

    return;
  }

  if (normalizedTopic === "orders/create" || normalizedTopic === "products/update") {
    console.info(`[Shopify Webhook] Received ${event.topic} for ${shopDomainHeader}`);
    return;
  }

  console.info(`[Shopify Webhook] Ignoring unsupported topic: ${event.topic}`);
}
