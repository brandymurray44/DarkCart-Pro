import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createBlackAccessCharge } from "@/services/billing/shopifyBilling";
import { logger } from "@/lib/logger";

/**
 * POST /api/billing/subscribe
 * Initiates a Shopify recurring charge for Black Access premium.
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const user = await getSessionUser();

    if (!user) {
      const duration = Date.now() - startTime;
      logger.api('/api/billing/subscribe', 'POST', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    const { verifyCSRF } = await import("@/lib/authServer");
    if (!csrfToken || !(await verifyCSRF(csrfToken))) {
      const duration = Date.now() - startTime;
      logger.security('CSRF verification failed', 'high', { userId: user.id, endpoint: '/api/billing/subscribe' });
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    const { confirmationUrl } = await createBlackAccessCharge(user);
    const duration = Date.now() - startTime;
    logger.billing('subscription_start', user.id, undefined, { confirmationUrl });
    logger.api('/api/billing/subscribe', 'POST', 200, duration, user.id);
    return NextResponse.json({ confirmationUrl });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.billing('subscription_failure', undefined, undefined, { error: errorMessage, duration });
    logger.error('Billing subscription error', error instanceof Error ? error : undefined, { duration });
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: "Failed to create subscription. Please try again." },
      { status: 500 }
    );
  }
}
