import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { randomBytes } from "crypto";

const SESSION_COOKIE_NAME = "session_id";
const SESSION_EXPIRY_DAYS = 7;

export async function createSession(userId: string) {
  const sessionId = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
  });

  return sessionId;
}

export async function getSessionUser() {
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
      await destroySession(sessionId);
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("[Auth] Failed to retrieve session user:", error);
    return null;
  }
}

export async function destroySession(sessionId?: string) {
  const cookieStore = await cookies();
  
  if (!sessionId) {
    sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  }

  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch((error) => {
      console.warn("[Auth] Failed to delete session from database:", error);
    });
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}
