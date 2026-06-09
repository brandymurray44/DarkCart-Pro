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
    const [userCount, storeCount, productCount, trendCount] = await Promise.all([
      prisma.user.count(),
      prisma.shop.count(),
      prisma.product.count(),
      prisma.trendSnapshot.count(),
    ]);

    return NextResponse.json(
      {
        stats: {
          users: userCount,
          stores: storeCount,
          products: productCount,
          trends: trendCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Admin] Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
