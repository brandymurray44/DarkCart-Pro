import { NextResponse } from "next/server";

// This login endpoint has been disabled for security reasons.
// Please use Shopify OAuth for authentication instead.
export async function POST(request: Request) {
  return NextResponse.json(
    { 
      error: "Email-only login has been disabled for security. Please use Shopify OAuth to authenticate.",
      redirectTo: "/api/shopify/auth"
    },
    { status: 410 }
  );
}
