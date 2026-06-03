import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

type SessionUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;

type AuthSuccess = { user: SessionUser; response?: never };
type AuthFailure = { user?: never; response: NextResponse };
type AuthResult = AuthSuccess | AuthFailure;

export async function requireAuth(): Promise<AuthResult> {
  const user = await getSessionUser();
  if (!user) {
    return {
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }
  return { user };
}

type ShopRecord = NonNullable<
  Awaited<ReturnType<typeof prisma.shop.findFirst>>
>;
type ShopSuccess = { shop: ShopRecord; response?: never };
type ShopFailure = { shop?: never; response: NextResponse };
type ShopResult = ShopSuccess | ShopFailure;

export async function requireShop(userId: string): Promise<ShopResult> {
  const shop = await prisma.shop.findFirst({
    where: { userId },
  });
  if (!shop) {
    return {
      response: NextResponse.json(
        { error: "No shop connected" },
        { status: 404 }
      ),
    };
  }
  return { shop };
}

export function apiErrorResponse(
  error: unknown,
  fallbackMessage: string
): NextResponse {
  return NextResponse.json(
    {
      error:
        error instanceof Error ? error.message : fallbackMessage,
    },
    { status: 500 }
  );
}

type ValidationSuccess<T> = { data: T; response?: never };
type ValidationFailure = { data?: never; response: NextResponse };
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      response: NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      ),
    };
  }
  return { data: parsed.data };
}
