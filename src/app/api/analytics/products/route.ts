import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateProductAnalytics } from "@/services/analytics/analyticsEngine";

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

    // Generate product analytics
    const analytics = await generateProductAnalytics(
      user.id,
      shop.id
    );

    return NextResponse.json(
      { data: analytics },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API] Products error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch product analytics",
      },
      { status: 500 }
    );
  }
}
