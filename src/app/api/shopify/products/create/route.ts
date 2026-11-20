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
      logger.api('/api/shopify/products/create', 'POST', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    const { verifyCSRF } = await import("@/lib/authServer");
    if (!csrfToken || !(await verifyCSRF(csrfToken))) {
      const duration = Date.now() - startTime;
      logger.security('CSRF verification failed', 'high', { userId: user.id, endpoint: '/api/shopify/products/create' });
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    // Limit request body size to prevent DoS
    const body = await request.json();

    // Sanitize and validate input
    const title = String(body.title || "").replace(/[<>{}[\]\\]/g, '').trim();
    const bodyHtml = String(body.body_html || body.description || "").replace(/[<>{}[\]\\]/g, '').trim();
    const tags = Array.isArray(body.tags) ? body.tags.map((t: string) => String(t).replace(/[<>{}[\]\\]/g, '').trim()) : [];
    const seoTitle = body.seo_title ? String(body.seo_title).replace(/[<>{}[\]\\]/g, '').trim() : undefined;
    const seoDescription = body.seo_description ? String(body.seo_description).replace(/[<>{}[\]\\]/g, '').trim() : undefined;
    const status = ["active", "draft", "archived"].includes(body.status) ? body.status : "draft";
    const productType = body.product_type ? String(body.product_type).replace(/[<>{}[\]\\]/g, '').trim() : undefined;
    const vendor = body.vendor ? String(body.vendor).replace(/[<>{}[\]\\]/g, '').trim() : undefined;

    if (!title) {
      const duration = Date.now() - startTime;
      logger.api('/api/shopify/products/create', 'POST', 400, duration, user.id, 'Missing title');
      return NextResponse.json({ error: "Product title is required" }, { status: 400 });
    }

    // Get user's shop
    const shop = await prisma.shop.findUnique({
      where: { userId: user.id },
    });

    if (!shop || !shop.accessToken) {
      const duration = Date.now() - startTime;
      logger.api('/api/shopify/products/create', 'POST', 404, duration, user.id, 'No shop connected');
      return NextResponse.json({ error: "No Shopify shop connected" }, { status: 404 });
    }

    // Create Shopify Admin API client
    const client = createShopifyAdminClient(shop.shopifyDomain, shop.accessToken);

    // Create product in Shopify
    const shopifyProduct = await client.createProduct({
      title,
      body_html: bodyHtml || undefined,
      tags: tags.length > 0 ? tags : undefined,
      seo_title: seoTitle,
      seo_description: seoDescription,
      status: status as "active" | "draft" | "archived",
      product_type: productType,
      vendor: vendor,
    });

    const duration = Date.now() - startTime;
    logger.api('/api/shopify/products/create', 'POST', 200, duration, user.id);

    return NextResponse.json({
      success: true,
      data: shopifyProduct,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Product creation error', error instanceof Error ? error : undefined, { duration });
    return NextResponse.json(
      { error: "Failed to create product. Please try again." },
      { status: 500 }
    );
  }
}