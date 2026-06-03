import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shop = await prisma.shop.findFirst({
    where: { userId: user.id },
  });

  if (!shop) {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  return NextResponse.json(
    {
      data: {
        id: shop.id,
        shopifyDomain: shop.shopifyDomain,
        connected: !!shop.accessToken,
        createdAt: shop.createdAt,
      },
    },
    { status: 200 }
  );
}
