import { NextResponse } from "next/server";
import { destroySession, getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await destroySession();

    return NextResponse.json(
      { success: true, message: "Logged out" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
