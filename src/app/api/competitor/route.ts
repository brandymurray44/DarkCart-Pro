import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getCompetitorIntelligence } from "@/services/competitorEngine";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user's niche
    const onboarding = await prisma.onboarding.findUnique({
      where: { userId: user.id },
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
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch competitor intelligence",
      },
      { status: 500 }
    );
  }
}
