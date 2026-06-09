import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

const PLAN_PRICES: Record<string, { priceId: string; amount: number }> = {
  STARTER: { priceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter", amount: 2900 },
  PRO: { priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro", amount: 7900 },
  BLACK: { priceId: process.env.STRIPE_BLACK_PRICE_ID || "price_black", amount: 19900 },
};

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");

  if (!plan || !PLAN_PRICES[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    // Stripe billing portal integration point
    if (process.env.STRIPE_SECRET_KEY) {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({ email: user.email });
        await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customer.id } });
        customerId = customer.id;
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Fallback: mock URL when Stripe is not configured
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settings?billing=mock`,
      message: `Upgrade to ${plan} — Stripe not configured, mock mode`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Billing error" },
      { status: 500 }
    );
  }
}