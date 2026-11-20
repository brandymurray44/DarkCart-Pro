export function getAppUrl(): string {
  const appUrl = process.env.SHOPIFY_APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing SHOPIFY_APP_URL environment variable");
  }

  return "http://localhost:3000";
}

export function getShopifyRedirectUri(): string {
  if (process.env.SHOPIFY_REDIRECT_URL) {
    return process.env.SHOPIFY_REDIRECT_URL;
  }
  if (process.env.SHOPIFY_REDIRECT_URI) {
    return process.env.SHOPIFY_REDIRECT_URI;
  }
  return `${getAppUrl()}/api/auth/shopify/callback`;
}

export function getShopifyAuthScopes(): string {
  return (
    process.env.SHOPIFY_SCOPES ??
    "read_products,write_products,read_orders,read_customers"
  );
}

export function getRequiredEnvVars(): string[] {
  return [
    "DATABASE_URL",
    "SHOPIFY_API_KEY",
    "SHOPIFY_API_SECRET",
    "SHOPIFY_APP_URL",
    "SHOPIFY_REDIRECT_URL",
  ];
}

export function validateRequiredEnvVars(): void {
  const missing = getRequiredEnvVars().filter(
    (name) => !process.env[name]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}
