import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = user.email?.includes("admin") || false;
  if (!isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    // In a real app you'd have an AdminLog model
    // For now, return mock data and use CompetitorSpy records as activity proxy
    const recentShops = await prisma.shop.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: { select: { email: true } },
      },
    });

    const logs = recentShops.map((shop) => ({
      id: shop.id,
      action: "SHOP_CONNECTED",
      target: shop.shopifyDomain,
      createdAt: shop.createdAt.toISOString(),
      details: `Store connected by ${shop.user.email}`,
    }));

    return NextResponse.json({ data: logs }, { status: 200 });
  } catch (error) {
    console.error("[Admin] Failed to fetch logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
