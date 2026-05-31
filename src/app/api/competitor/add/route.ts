import { NextResponse } from "next/server";
import { z } from "zod";
import { discoverCompetitorStores } from "@/services/competitorDiscovery";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

const addCompetitorSchema = z.object({
  niche: z.string().min(3).max(100),
});

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = addCompetitorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { niche } = parsed.data;

    console.log(`[API] Discovering competitors for niche: ${niche}`);
    const discovered = await discoverCompetitorStores(niche);

    if (discovered.length === 0) {
      return NextResponse.json(
        { error: "No competitor stores found for this niche" },
        { status: 404 }
      );
    }

    // Save discovered competitors to database for future tracking
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
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to discover competitors",
      },
      { status: 500 }
    );
  }
}
