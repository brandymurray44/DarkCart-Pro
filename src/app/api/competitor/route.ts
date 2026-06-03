import { NextResponse } from "next/server";
import { requireAuth, apiErrorResponse } from "@/lib/api/apiUtils";
import { getCompetitorIntelligence } from "@/services/competitorEngine";
import prisma from "@/lib/db";

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const onboarding = await prisma.onboarding.findUnique({
      where: { userId: auth.user.id },
    });

    if (!onboarding) {
      return NextResponse.json(
        { message: "Complete onboarding first", data: [] },
        { status: 200 }
      );
    }

    const intelligence = await getCompetitorIntelligence(onboarding.niche);

    return NextResponse.json(
      {
        niche: onboarding.niche,
        competitors: intelligence,
      },
      { status: 200 }
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to fetch competitor intelligence");
  }
}
