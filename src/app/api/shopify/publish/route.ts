import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { publishProductForShop } from "@/services/publish/productPublisher";
import type { AiProductInput } from "@/services/publish/mappers";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const user = await getSessionUser();
    if (!user) {
      const duration = Date.now() - startTime;
      logger.api('/api/shopify/publish', 'POST', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    const { verifyCSRF } = await import("@/lib/authServer");
    if (!csrfToken || !(await verifyCSRF(csrfToken))) {
      const duration = Date.now() - startTime;
      logger.security('CSRF verification failed', 'high', { userId: user.id, endpoint: '/api/shopify/publish' });
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    // Limit request body size to prevent DoS
    const body = await request.json();
    
    // Sanitize and validate input
    const productPayload: AiProductInput = {
      title: String(body.title || "").replace(/[<>{}[\]\\]/g, '').trim(),
      description: String(body.description || "").replace(/[<>{}[\]\\]/g, '').trim(),
      tags: Array.isArray(body.tags) ? body.tags.map((t: string) => String(t).replace(/[<>{}[\]\\]/g, '').trim()) : [],
      bullets: Array.isArray(body.bullets) ? body.bullets.map((b: string) => String(b).replace(/[<>{}[\]\\]/g, '').trim()) : [],
      price: typeof body.price === 'number' ? body.price : 0,
      compareAtPrice: typeof body.compareAtPrice === 'number' ? body.compareAtPrice : undefined,
      images: Array.isArray(body.images) ? body.images.map((img: { url: string; alt?: string }) => ({
        url: String(img.url).replace(/[<>{}[\]\\]/g, '').trim(),
        alt: img.alt ? String(img.alt).replace(/[<>{}[\]\\]/g, '').trim() : undefined
      })) : [],
      variants: Array.isArray(body.variants) ? body.variants.map((v: { optionName: string; values: string[] }) => ({
        optionName: String(v.optionName).replace(/[<>{}[\]\\]/g, '').trim(),
        values: Array.isArray(v.values) ? v.values.map((val: string) => String(val).replace(/[<>{}[\]\\]/g, '').trim()) : []
      })) : [],
      niche: body.niche ? String(body.niche).replace(/[<>{}[\]\\]/g, '').trim() : undefined,
      publishMode: ["draft", "active"].includes(body.publishMode) ? body.publishMode : "draft",
      vendor: body.vendor ? String(body.vendor).replace(/[<>{}[\]\\]/g, '').trim() : undefined,
    };

    const result = await publishProductForShop(user.id, productPayload);

    const duration = Date.now() - startTime;
    if (!result.success) {
      logger.api('/api/shopify/publish', 'POST', 400, duration, user.id, result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    logger.api('/api/shopify/publish', 'POST', 200, duration, user.id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Shopify publish error', error instanceof Error ? error : undefined, { duration });
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: "Failed to publish product. Please try again." },
      { status: 500 }
    );
  }
}
