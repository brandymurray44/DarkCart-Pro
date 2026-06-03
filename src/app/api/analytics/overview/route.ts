import { NextResponse } from "next/server";
import { requireAuth, requireShop, apiErrorResponse } from "@/lib/api/apiUtils";
import { generateOverview } from "@/services/analytics/analyticsEngine";

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const shopResult = await requireShop(auth.user.id);
    if (shopResult.response) return shopResult.response;

    const overview = await generateOverview(auth.user.id, shopResult.shop.id);

    if (!overview) {
      return NextResponse.json(
        { error: "Failed to generate analytics" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: overview }, { status: 200 });
  } catch (error) {
    console.error("[API] Overview error:", error);
    return apiErrorResponse(error, "Failed to fetch overview");
  }
}
