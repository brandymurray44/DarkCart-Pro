import { requireAuth, type AuthUser } from "@/lib/authServer";
import prisma from "@/lib/db";

const SHOPIFY_API_VERSION = "2024-10";

const BLACK_ACCESS_PLAN = {
  name: "Black Access Premium",
  price: 29.99,
  interval: "EVERY_30_DAYS" as const,
  test: process.env.NODE_ENV !== "production",
};

interface RecurringChargeResponse {
  recurring_application_charge: {
    id: number;
    name: string;
    price: string;
    confirmation_url: string;
    status: string;
    return_url?: string;
  };
}

/**
 * Create a Shopify recurring application charge for Black Access.
 * Returns the confirmation URL the merchant must visit to approve.
 */
export async function createBlackAccessCharge(
  user: AuthUser
): Promise<{ confirmationUrl: string; chargeId: number }> {
  const shop = await prisma.shop.findFirst({
    where: { userId: user.id },
  });

  if (!shop) {
    throw new Error("No Shopify store connected. Connect your store first.");
  }

  const returnUrl = `${process.env.SHOPIFY_APP_URL || "http://localhost:3000"}/api/billing/callback?shop=${encodeURIComponent(shop.shopifyDomain)}`;

  const response = await fetch(
    `https://${shop.shopifyDomain}/admin/api/${SHOPIFY_API_VERSION}/recurring_application_charges.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shop.accessToken,
      },
      body: JSON.stringify({
        recurring_application_charge: {
          name: BLACK_ACCESS_PLAN.name,
          price: BLACK_ACCESS_PLAN.price,
          return_url: returnUrl,
          test: BLACK_ACCESS_PLAN.test,
        },
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to create charge: ${response.status} ${body}`);
  }

  const data = (await response.json()) as RecurringChargeResponse;
  const charge = data.recurring_application_charge;

  return {
    confirmationUrl: charge.confirmation_url,
    chargeId: charge.id,
  };
}

/**
 * Activate an approved recurring charge after merchant accepts.
 */
export async function activateBlackAccessCharge(
  shopDomain: string,
  chargeId: number
): Promise<boolean> {
  const shop = await prisma.shop.findUnique({
    where: { shopifyDomain: shopDomain },
  });

  if (!shop) {
    throw new Error(`Shop not found: ${shopDomain}`);
  }

  const response = await fetch(
    `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/recurring_application_charges/${chargeId}/activate.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shop.accessToken,
      },
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to activate charge: ${response.status} ${body}`);
  }

  // Update the shop record with Black Access status
  await prisma.shop.update({
    where: { shopifyDomain: shopDomain },
    data: {
      blackAccessActive: true,
    },
  });

  return true;
}

/**
 * Check if a user has Black Access (premium subscription).
 */
export async function hasBlackAccess(userId: string): Promise<boolean> {
  const shop = await prisma.shop.findFirst({
    where: { userId },
  });

  if (!shop) return false;

  return shop.blackAccessActive;
}
