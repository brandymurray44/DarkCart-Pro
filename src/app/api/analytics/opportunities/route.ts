import { NextResponse } from "next/server";
import { requireAuth, requireShop, apiErrorResponse } from "@/lib/api/apiUtils";
import { generateOpportunities } from "@/services/analytics/analyticsEngine";

export async function GET(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const url = new URL(request.url);
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "10"),
      50
    );

    const shopResult = await requireShop(auth.user.id);
    if (shopResult.response) return shopResult.response;

    const opportunities = await generateOpportunities(
      auth.user.id,
      shopResult.shop.id,
      limit
    );

    return NextResponse.json(
      { data: opportunities },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Opportunities error:", error);
    return apiErrorResponse(error, "Failed to fetch opportunities");
  }
}
