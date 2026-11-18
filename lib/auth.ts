import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error("SESSION_SECRET belum diatur di file .env");
}

const key = new TextEncoder().encode(secretKey);

// SESSION USER
export async function createSession(userId: number) {
  const token = await new SignJWT({ userId, role: "USER" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const cookieStore = await cookies();

  cookieStore.set("findit-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("findit-session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key);

    if (
      typeof payload.userId !== "number" ||
      payload.role !== "USER"
    ) {
      return null;
    }

    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// SESSION ADMIN
export async function createAdminSession(userId: number) {
  const token = await new SignJWT({ userId, role: "ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const cookieStore = await cookies();

  cookieStore.set("findit-admin-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("findit-admin-session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key);

    if (
      typeof payload.userId !== "number" ||
      payload.role !== "ADMIN"
    ) {
      return null;
    }

    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("findit-admin-session");
}

// LOGOUT USER
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("findit-session");
}