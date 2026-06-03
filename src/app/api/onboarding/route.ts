import { NextResponse } from "next/server";
import { z } from "zod";
import { getOnboarding, upsertOnboarding } from "@/server/onboarding/onboardingService";
import { getSessionUser } from "@/lib/auth";

const onboardingSchema = z.object({
  userId: z.string().uuid(),
  niche: z.string().min(3),
  storeType: z.string().min(3),
  goals: z.string().min(10),
  completed: z.boolean().optional().default(true),
});

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const onboarding = await getOnboarding(user.id);
  return NextResponse.json({ data: onboarding });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = onboardingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Ensure user can only update their own onboarding
  if (parsed.data.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const onboarding = await upsertOnboarding(
    parsed.data.userId,
    parsed.data.niche,
    parsed.data.storeType,
    parsed.data.goals,
    parsed.data.completed
  );

  return NextResponse.json({ data: onboarding });
}
