import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Simple admin check — in production you'd check user.role or user.isAdmin
  const isAdmin = user.email?.includes("admin") || false;

  if (!isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        shop: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const data = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt.toISOString(),
      shopCount: u.shop?.id ? 1 : 0,
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[Admin] Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
