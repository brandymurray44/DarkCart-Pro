import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateOverview } from "@/services/analytics/analyticsEngine";

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    // Generate overview
    const overview = await generateOverview(user.id, shop.id);

    if (!overview) {
      return NextResponse.json(
        { error: "Failed to generate analytics" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: overview }, { status: 200 });
  } catch (error) {
    console.error("[API] Overview error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch overview",
      },
      { status: 500 }
    );
  }
}
