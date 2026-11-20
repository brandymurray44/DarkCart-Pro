import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import prisma from "@/lib/db";

const SESSION_COOKIE_NAME = "session_id";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Server-side auth check for use in Server Components and layouts.
 * Returns the authenticated user or redirects to home.
 * Must be called at the top of a Server Component.
 */
export async function requireAuth(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    redirect("/");
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      redirect("/");
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch (error) {
    // If it's a redirect, re-throw it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    redirect("/");
  }
}

/**
 * Verify CSRF token for state-changing operations
 */
export async function verifyCSRF(token: string): Promise<boolean> {
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get("csrf_token")?.value;
  
  if (!csrfToken || !token) {
    return false;
  }

  return csrfToken === token;
}

/**
 * Generate and set CSRF token
 */
export async function generateCSRFToken(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const cookieStore = await cookies();
  
  cookieStore.set("csrf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  return token;
}

/**
 * Optional auth check — returns user if authenticated, null otherwise.
 * Does not redirect.
 */
export async function getOptionalAuth(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch {
    return null;
  }
}
