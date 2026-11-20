import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const user = await getSessionUser();

    if (!user) {
      const duration = Date.now() - startTime;
      logger.api('/api/competitor/clone', 'POST', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { competitorId } = body;

    if (!competitorId || typeof competitorId !== 'string') {
      return NextResponse.json(
        { error: "Competitor ID is required" },
        { status: 400 }
      );
    }

    // Stub implementation - in production, this would clone the competitor's product
    const productName = "Cloned Product from Competitor";

    const duration = Date.now() - startTime;
    logger.api('/api/competitor/clone', 'POST', 200, duration, user.id);
    logger.info('Product cloned', { userId: user.id, competitorId });

    return NextResponse.json(
      {
        productName,
        message: "Product cloned successfully. Redirecting to generator..."
      },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.api('/api/competitor/clone', 'POST', 500, duration, undefined, errorMessage);
    return NextResponse.json(
      { error: "Failed to clone product. Please try again." },
      { status: 500 }
    );
  }
}