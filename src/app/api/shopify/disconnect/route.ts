import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function DELETE() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const shop = await prisma.shop.findUnique({ where: { userId: user.id } });

    if (!shop) {
      return NextResponse.json({ error: "No connected store found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.trendSnapshot.deleteMany({ where: { shopId: shop.id } }),
      prisma.product.deleteMany({ where: { shopId: shop.id } }),
      prisma.shop.delete({ where: { id: shop.id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Shopify disconnect error:", error);
    return NextResponse.json({ error: "Failed to disconnect Shopify store" }, { status: 500 });
  }
}
