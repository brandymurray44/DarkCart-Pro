import { NextResponse } from "next/server";
import { z } from "zod";
import { getOnboarding, upsertOnboarding } from "@/server/onboarding/onboardingService";
import { requireAuth, validateBody } from "@/lib/api/apiUtils";

const onboardingSchema = z.object({
  userId: z.string().uuid(),
  niche: z.string().min(3),
  storeType: z.string().min(3),
  goals: z.string().min(10),
  completed: z.boolean().optional().default(true),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") ?? "";

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const onboarding = await getOnboarding(userId);
  return NextResponse.json({ data: onboarding });
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const validation = await validateBody(request, onboardingSchema);
  if (validation.response) return validation.response;

  if (validation.data.userId !== auth.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const onboarding = await upsertOnboarding(
    validation.data.userId,
    validation.data.niche,
    validation.data.storeType,
    validation.data.goals,
    validation.data.completed
  );

  return NextResponse.json({ data: onboarding });
}
