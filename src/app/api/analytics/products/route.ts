import { NextResponse } from "next/server";
import { requireAuth, requireShop, apiErrorResponse } from "@/lib/api/apiUtils";
import { generateProductAnalytics } from "@/services/analytics/analyticsEngine";

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const shopResult = await requireShop(auth.user.id);
    if (shopResult.response) return shopResult.response;

    const analytics = await generateProductAnalytics(
      auth.user.id,
      shopResult.shop.id
    );

    return NextResponse.json(
      { data: analytics },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Products error:", error);
    return apiErrorResponse(error, "Failed to fetch product analytics");
  }
}
