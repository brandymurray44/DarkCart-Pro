import { NextResponse } from "next/server";
import { requireAuth, apiErrorResponse } from "@/lib/api/apiUtils";
import prisma from "@/lib/db";

export async function DELETE() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    await prisma.shop.deleteMany({ where: { userId: auth.user.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Shopify disconnect error:", error);
    return apiErrorResponse(error, "Failed to disconnect Shopify store");
  }
}
