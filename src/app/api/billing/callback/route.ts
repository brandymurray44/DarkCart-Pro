import { NextResponse } from "next/server";
import { activateBlackAccessCharge } from "@/services/billing/shopifyBilling";
import { logger } from "@/lib/logger";

/**
 * GET /api/billing/callback
 * Shopify redirects here after the merchant approves/rejects the charge.
 * If approved, activate the charge and redirect to Black Access.
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const chargeId = url.searchParams.get("charge_id");

    if (!shop || !chargeId) {
      return NextResponse.json(
        { error: "Missing shop or charge_id parameter" },
        { status: 400 }
      );
    }

    // Sanitize and validate inputs
    const sanitizedShop = shop.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase();
    const parsedChargeId = parseInt(chargeId, 10);
    if (isNaN(parsedChargeId) || parsedChargeId <= 0) {
      return NextResponse.json({ error: "Invalid charge ID" }, { status: 400 });
    }

    await activateBlackAccessCharge(sanitizedShop, parsedChargeId);

    const duration = Date.now() - startTime;
    logger.billing('activation', undefined, sanitizedShop, { chargeId: parsedChargeId });
    logger.api('/api/billing/callback', 'GET', 200, duration);

    const appUrl = process.env.SHOPIFY_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${appUrl}/black-access?activated=true`
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.billing('subscription_failure', undefined, undefined, { error: errorMessage });
    logger.error('Billing activation error', error instanceof Error ? error : undefined, { duration });
    const appUrl = process.env.SHOPIFY_APP_URL || "http://localhost:3000";
    // Don't expose internal error details
    return NextResponse.redirect(
      `${appUrl}/black-access?error=${encodeURIComponent("Activation failed. Please try again.")}`
    );
  }
}
