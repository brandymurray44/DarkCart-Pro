import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { logger } from "@/lib/logger";

export async function DELETE(request: Request) {
  const startTime = Date.now();
  try {
    const user = await getSessionUser();

    if (!user) {
      const duration = Date.now() - startTime;
      logger.api('/api/shopify/disconnect', 'DELETE', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    const { verifyCSRF } = await import("@/lib/authServer");
    if (!csrfToken || !(await verifyCSRF(csrfToken))) {
      const duration = Date.now() - startTime;
      logger.security('CSRF verification failed', 'high', { userId: user.id, endpoint: '/api/shopify/disconnect' });
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    const shop = await prisma.shop.findUnique({ where: { userId: user.id } });

    if (!shop) {
      return NextResponse.json({ error: "No connected store found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.trendSnapshot.deleteMany({ where: { shopId: shop.id } }),
      prisma.product.deleteMany({ where: { shopId: shop.id } }),
      prisma.shop.delete({ where: { id: shop.id } }),
    ]);

    const duration = Date.now() - startTime;
    logger.api('/api/shopify/disconnect', 'DELETE', 200, duration, user.id);
    logger.info('Shopify store disconnected', { userId: user.id, shopId: shop.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Shopify disconnect error', error instanceof Error ? error : undefined, { duration });
    return NextResponse.json({ error: "Failed to disconnect Shopify store" }, { status: 500 });
  }
}
