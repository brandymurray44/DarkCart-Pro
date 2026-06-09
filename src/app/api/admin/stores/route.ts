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
    const stores = await prisma.shop.findMany({
      select: {
        id: true,
        shopifyDomain: true,
        createdAt: true,
        user: {
          select: { email: true },
        },
        products: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const data = stores.map((s) => ({
      id: s.id,
      shopifyDomain: s.shopifyDomain,
      createdAt: s.createdAt.toISOString(),
      userEmail: s.user.email,
      productCount: s.products.length,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[Admin] Failed to fetch stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
