import { NextResponse } from "next/server";
import { z } from "zod";
import { discoverCompetitorStores } from "@/services/competitorDiscovery";
import { requireAuth, validateBody, apiErrorResponse } from "@/lib/api/apiUtils";
import prisma from "@/lib/db";

const addCompetitorSchema = z.object({
  niche: z.string().min(3).max(100),
});

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const validation = await validateBody(request, addCompetitorSchema);
    if (validation.response) return validation.response;

    const { niche } = validation.data;

    console.log(`[API] Discovering competitors for niche: ${niche}`);
    const discovered = await discoverCompetitorStores(niche);

    if (discovered.length === 0) {
      return NextResponse.json(
        { error: "No competitor stores found for this niche" },
        { status: 404 }
      );
    }

    for (const store of discovered) {
      try {
        await prisma.competitorSpy.create({
          data: {
            id: `discover_${store.domain}_${Date.now()}`,
            shopUrl: store.domain,
            productUrl: `https://${store.domain}`,
            summary: `Competitor: ${store.shopName}`,
            rawData: JSON.stringify({
              niche,
              isShopify: store.isShopify,
              discoveredAt: new Date().toISOString(),
            }),
          },
        });
      } catch (error) {
        console.warn(`Failed to save competitor ${store.domain}:`, error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        discovered: discovered.length,
        stores: discovered,
      },
      { status: 200 }
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to discover competitors");
  }
}
