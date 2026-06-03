import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/apiUtils";
import prisma from "@/lib/db";

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const shop = await prisma.shop.findFirst({
    where: { userId: auth.user.id },
  });

  if (!shop) {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  return NextResponse.json(
    {
      data: {
        id: shop.id,
        shopifyDomain: shop.shopifyDomain,
        accessToken: shop.accessToken,
        createdAt: shop.createdAt,
      },
    },
    { status: 200 }
  );
}
