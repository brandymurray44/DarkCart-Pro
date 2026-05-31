import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateOpportunities } from "@/services/analytics/analyticsEngine";

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "10"),
      50
    );

    // Get user's shop
    const shop = await prisma.shop.findFirst({
      where: { userId: user.id },
    });

    if (!shop) {
      return NextResponse.json(
        { error: "No shop connected" },
        { status: 404 }
      );
    }

    // Generate opportunities
    const opportunities = await generateOpportunities(
      user.id,
      shop.id,
      limit
    );

    return NextResponse.json(
      { data: opportunities },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Opportunities error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch opportunities",
      },
      { status: 500 }
    );
  }
}
