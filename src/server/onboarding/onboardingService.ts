import prisma from "@/lib/db";

export async function upsertOnboarding(userId: string, niche: string, storeType: string, goals: string, completed = true) {
  return prisma.onboarding.upsert({
    where: { userId },
    update: {
      niche,
      storeType,
      goals,
      completed,
    },
    create: {
      userId,
      niche,
      storeType,
      goals,
      completed,
    },
  });
}

export async function getOnboarding(userId: string) {
  return prisma.onboarding.findUnique({ where: { userId } });
}
