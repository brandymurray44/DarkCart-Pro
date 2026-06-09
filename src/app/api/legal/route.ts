import { NextResponse } from "next/server";

const POLICIES = {
  terms: {
    id: "terms",
    title: "Terms of Service",
    lastUpdated: "2025-01-01",
    route: "/legal/terms",
    description: "Governs the use of DarkCart-Pro, including account terms, acceptable use, subscriptions, and liability.",
  },
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    lastUpdated: "2025-01-01",
    route: "/legal/privacy",
    description: "Describes how DarkCart-Pro collects, uses, and protects your personal data, including GDPR and CCPA rights.",
  },
  refund: {
    id: "refund",
    title: "Refund Policy",
    lastUpdated: "2025-01-01",
    route: "/legal/refund",
    description: "Outlines subscription terms, cancellation procedures, and refund eligibility criteria.",
  },
  dpa: {
    id: "dpa",
    title: "Data Processing Addendum",
    lastUpdated: "2025-01-01",
    route: "/legal/dpa",
    description: "GDPR-compliant data processing terms between DarkCart-Pro (Data Processor) and the Customer (Data Controller).",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const policyId = searchParams.get("policy");

  if (policyId && policyId in POLICIES) {
    return NextResponse.json(POLICIES[policyId as keyof typeof POLICIES]);
  }

  return NextResponse.json({
    policies: Object.values(POLICIES),
    company: {
      name: "DarkCart-Pro",
      email: "legal@darkcart.pro",
      address: "123 Commerce Ave, Suite 100, Dover, DE 19901, USA",
    },
  });
}