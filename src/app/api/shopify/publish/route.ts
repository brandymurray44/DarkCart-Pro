import { NextResponse } from "next/server";
import { shopifyPublishSchema } from "@/lib/validators";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = shopifyPublishSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const { title, description, tags, seoTitle, seoDescription } = parseResult.data;

  const mockProduct = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    description,
    tags,
    seoTitle,
    seoDescription,
    createdAt: new Date().toISOString(),
    published: true,
  };

  return NextResponse.json({ success: true, product: mockProduct });
}
