import { NextResponse } from "next/server";
import { z } from "zod";
import { publishProductForShop } from "@/services/publish/productPublisher";
import { getSessionUser } from "@/lib/auth";

const publishProductSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10).max(5000),
  bullets: z.array(z.string().max(200)).optional(),
  tags: z.array(z.string().max(50)).optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
      })
    )
    .optional(),
  variants: z
    .array(
      z.object({
        optionName: z.string().min(1),
        values: z.array(z.string().min(1)),
      })
    )
    .optional(),
  niche: z.string().optional(),
  publishMode: z.enum(["draft", "active"]).optional(),
  vendor: z.string().optional(),
});

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = publishProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    console.log(`[API] Publish product request from user ${user.id}`);

    const result = await publishProductForShop(user.id, parsed.data);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("[API] Publish error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to publish product",
      },
      { status: 500 }
    );
  }
}
