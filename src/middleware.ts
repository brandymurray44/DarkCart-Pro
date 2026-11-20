import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";

const SESSION_COOKIE_NAME = "session_id";

// Routes that require authentication
const protectedRoutes = [
  "/trends",
  "/editor",
  "/dashboard",
  "/black-access",
  "/publish",
  "/product-creation",
  "/create",
  "/competitors",
  "/settings",
  "/analytics",
];

/**
 * Edge-compatible middleware.
 *
 * Performs a lightweight cookie-existence check only — no Prisma
 * (Prisma does not run in the Edge runtime on Vercel).
 *
 * The real session validation happens in:
 *  - Server Components via `requireAuth()` from @/lib/authServer
 *  - API routes via `getSessionUser()` from @/lib/auth
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Security headers
  const cspResponse = NextResponse.next();
  
  // Apply Content-Security-Policy for Shopify admin embedding
  try {
    const appUrl = getAppUrl();
    const frameAncestors = [`'self'`, "https://admin.shopify.com", "https://*.myshopify.com", appUrl].join(" ");
    cspResponse.headers.set("Content-Security-Policy", `frame-ancestors ${frameAncestors}`);
  } catch {
    // getAppUrl may throw in dev without SHOPIFY_APP_URL — safe to ignore
  }

  // Additional security headers
  cspResponse.headers.set("X-Content-Type-Options", "nosniff");
  cspResponse.headers.set("X-Frame-Options", "DENY");
  cspResponse.headers.set("X-XSS-Protection", "1; mode=block");
  cspResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  cspResponse.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  
  // Only set HSTS in production
  if (process.env.NODE_ENV === "production") {
    cspResponse.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return cspResponse;
  }

  // Cookie-existence check (Edge-safe, no DB call)
  const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    const response = NextResponse.redirect(new URL("/", request.url));
    try {
      const appUrl = getAppUrl();
      const frameAncestors = [`'self'`, "https://admin.shopify.com", "https://*.myshopify.com", appUrl].join(" ");
      response.headers.set("Content-Security-Policy", `frame-ancestors ${frameAncestors}`);
    } catch {
      // ignore
    }
    return response;
  }

  return cspResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
