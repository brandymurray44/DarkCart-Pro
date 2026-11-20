import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createShopifyAdminClient } from "@/lib/shopifyAdminClient";
import prisma from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const user = await getSessionUser();
    if (!user) {
      const duration = Date.now() - startTime;
      logger.api('/api/shopify/products/sync', 'POST', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    const { verifyCSRF } = await import("@/lib/authServer");
    if (!csrfToken || !(await verifyCSRF(csrfToken))) {
      const duration = Date.now() - startTime;
      logger.security('CSRF verification failed', 'high', { userId: user.id, endpoint: '/api/shopify/products/sync' });
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    // Get user's shop
    const shop = await prisma.shop.findUnique({
      where: { userId: user.id },
      include: {
        products: true,
      },
    });

    if (!shop || !shop.accessToken) {
      const duration = Date.now() - startTime;
      logger.api('/api/shopify/products/sync', 'POST', 404, duration, user.id, 'No shop connected');
      return NextResponse.json({ error: "No Shopify shop connected" }, { status: 404 });
    }

    // Create Shopify Admin API client
    const client = createShopifyAdminClient(shop.shopifyDomain, shop.accessToken);

    // Fetch all products from Shopify
    const allProducts: Array<{
      id: number;
      title: string;
      body_html?: string;
      tags?: string;
      status?: string;
      product_type?: string;
      vendor?: string;
      created_at?: string;
      updated_at?: string;
    }> = [];

    let pageInfo: string | undefined;
    let hasMore = true;

    // Paginate through all products
    while (hasMore) {
      const queryParams = new URLSearchParams();
      queryParams.set("limit", "250"); // Max per page
      if (pageInfo) {
        queryParams.set("page_info", pageInfo);
      }

      const response = await client.get<{
        products: typeof allProducts;
      }>(`/products.json?${queryParams.toString()}`);

      const products = response.products || [];
      allProducts.push(...products);

      // Check for next page (Shopify uses Link header for pagination)
      // For simplicity, we'll fetch up to 250 products in this implementation
      // In production, you'd parse the Link header for full pagination
      hasMore = false;
    }

    // Sync products to database
    const syncedProducts = [];
    const errors = [];

    for (const shopifyProduct of allProducts) {
      try {
        // Extract tags from comma-separated string
        const tags = shopifyProduct.tags
          ? shopifyProduct.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [];

        // Extract SEO metafields if present
        let seoTitle: string | undefined;
        let seoDescription: string | undefined;

        // Note: In a full implementation, you'd fetch metafields separately
        // For now, we'll store basic product data

        // Check if product already exists
        const existingProduct = await prisma.product.findFirst({
          where: {
            shopId: shop.id,
            shopifyProductId: shopifyProduct.id.toString(),
          },
        });

        let product;
        if (existingProduct) {
          // Update existing product
          product = await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              title: shopifyProduct.title,
              description: shopifyProduct.body_html || "",
              tags,
              published: shopifyProduct.status === "active",
              updatedAt: new Date(),
            },
          });
        } else {
          // Create new product
          product = await prisma.product.create({
            data: {
              shopId: shop.id,
              title: shopifyProduct.title,
              description: shopifyProduct.body_html || "",
              tags,
              shopifyProductId: shopifyProduct.id.toString(),
              published: shopifyProduct.status === "active",
            },
          });
        }

        syncedProducts.push(product);
      } catch (error) {
        errors.push({
          productId: shopifyProduct.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const duration = Date.now() - startTime;
    logger.api('/api/shopify/products/sync', 'POST', 200, duration, user.id, `Synced ${syncedProducts.length} products`);

    return NextResponse.json({
      success: true,
      data: {
        synced: syncedProducts.length,
        total: allProducts.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Product sync error', error instanceof Error ? error : undefined, { duration });
    return NextResponse.json(
      { error: "Failed to sync products. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const user = await getSessionUser();
    if (!user) {
      const duration = Date.now() - startTime;
      logger.api('/api/shopify/products/sync', 'GET', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's shop
    const shop = await prisma.shop.findUnique({
      where: { userId: user.id },
      include: {
        products: {
          orderBy: {
            updatedAt: "desc",
          },
          take: 100,
        },
      },
    });

    if (!shop) {
      const duration = Date.now() - startTime;
      logger.api('/api/shopify/products/sync', 'GET', 404, duration, user.id, 'No shop connected');
      return NextResponse.json({ error: "No Shopify shop connected" }, { status: 404 });
    }

    const duration = Date.now() - startTime;
    logger.api('/api/shopify/products/sync', 'GET', 200, duration, user.id);

    return NextResponse.json({
      success: true,
      data: {
        shop: {
          domain: shop.shopifyDomain,
          productCount: shop.products.length,
        },
        products: shop.products,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Product sync GET error', error instanceof Error ? error : undefined, { duration });
    return NextResponse.json(
      { error: "Failed to fetch synced products." },
      { status: 500 }
    );
  }
}