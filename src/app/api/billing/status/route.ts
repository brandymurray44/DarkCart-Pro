import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { hasBlackAccess } from "@/services/billing/shopifyBilling";

/**
 * GET /api/billing/status
 * Returns whether the current user has Black Access premium.
 */
export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const premium = await hasBlackAccess(user.id);

  return NextResponse.json({
    premium,
    plan: premium ? "Black Access Premium" : null,
  });
}
