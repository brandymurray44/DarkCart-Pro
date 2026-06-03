import prisma from "@/lib/db";
import { mapAiProductToShopifyProduct, type AiProductInput } from "./mappers";
import { createShopifyProduct, ShopifyClientError } from "./shopifyClient";

export interface PublishResult {
  success: boolean;
  productId?: string;
  shopifyProductId?: string;
  productUrl?: string;
  status?: string;
  error?: string;
}

/**
 * Publish a product for a user's shop
 */
export async function publishProductForShop(
  userId: string,
  payload: AiProductInput
): Promise<PublishResult> {
  try {
    // Look up user's shop
    const shop = await prisma.shop.findFirst({
      where: { userId },
    });

    if (!shop) {
      return {
        success: false,
        error: "No shop connected. Please connect your Shopify store first.",
      };
    }

    if (!shop.accessToken) {
      return {
        success: false,
        error: "Shop access token missing. Please reconnect your store.",
      };
    }

    // Map AI payload to Shopify format
    const shopifyPayload = mapAiProductToShopifyProduct(payload);

    // Create product via Shopify Admin API
    console.log(`[Publisher] Creating product in shop: ${shop.shopifyDomain}`);
    const shopifyResponse = await createShopifyProduct(
      shop.shopifyDomain,
      shop.accessToken,
      shopifyPayload
    );

    const shopifyProductId = shopifyResponse.product.id.toString();
    const productHandle = shopifyResponse.product.handle;
    const productUrl = `https://${shop.shopifyDomain}/products/${productHandle}`;

    console.log(
      `[Publisher] Product created: ${shopifyProductId} at ${productUrl}`
    );

    // Persist product metadata in DB
    const dbProduct = await prisma.product.create({
      data: {
        shopId: shop.id,
        title: payload.title,
        description: payload.description,
        tags: payload.tags || [],
        seoTitle: payload.title.substring(0, 70),
        seoDescription: payload.description.substring(0, 160),
        shopifyProductId,
        published: payload.publishMode === "active",
        aiPrompt: JSON.stringify(payload),
      },
    });

    console.log(`[Publisher] Product persisted in DB: ${dbProduct.id}`);

    return {
      success: true,
      productId: dbProduct.id,
      shopifyProductId,
      productUrl,
      status: payload.publishMode || "draft",
    };
  } catch (error) {
    const errorMessage =
      error instanceof ShopifyClientError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unknown error";

    console.error(`[Publisher] Error publishing product:`, errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Update product publish status in DB
 */
export async function updateProductPublishStatus(
  productId: string,
  published: boolean,
  lastSyncedAt?: Date
): Promise<boolean> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        published,
        updatedAt: lastSyncedAt || new Date(),
      },
    });
    return true;
  } catch (error) {
    console.error(`[Publisher] Failed to update product ${productId}:`, error);
    throw error;
  }
}

/**
 * Get product by internal ID or Shopify ID
 */
export async function getProduct(
  productId: string | null,
  shopifyProductId?: string
) {
  if (productId) {
    return prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });
  }

  if (shopifyProductId) {
    return prisma.product.findFirst({
      where: { shopifyProductId },
      include: { shop: true },
    });
  }

  return null;
}
