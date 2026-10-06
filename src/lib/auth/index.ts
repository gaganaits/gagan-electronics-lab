import { cookies } from "next/headers";
import crypto from "crypto";
import { AdminProfile } from "@/types";

const SESSION_COOKIE_NAME = "gel_admin_token";
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || "gagan-electronics-lab-super-secure-key-2026";

interface SessionPayload {
  email: string;
  role: "ADMIN" | "STAFF";
  exp: number;
}

/**
 * Sign session data with HMAC-SHA256
 */
export function createSignedSessionToken(email: string, role: "ADMIN" | "STAFF" = "ADMIN"): string {
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload: SessionPayload = { email, role, exp };
  const raw = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(raw).digest("base64url");
  return `${raw}.${signature}`;
}

/**
 * Verify and decode session token
 */
export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [raw, signature] = parts;
  const expectedSig = crypto.createHmac("sha256", SECRET_KEY).update(raw).digest("base64url");

  // Constant time comparison to prevent timing attacks
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(raw, "base64url").toString("utf-8"));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Get current admin session from incoming cookie
 */
export function getCurrentAdminSession(): SessionPayload | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Verify admin credentials
 */
export function verifyAdminCredentials(email: string, pass: string): boolean {
  const configuredEmail = (process.env.ADMIN_EMAIL || "admin@gaganelectronicslab.com").toLowerCase().trim();
  const configuredPassword = process.env.ADMIN_PASSWORD || "gagan3dlab2026!";

  const inputEmail = email.toLowerCase().trim();

  if (inputEmail !== configuredEmail) {
    return false;
  }

  // Safe timing comparison on passwords
  const passBuf = Buffer.from(pass);
  const confBuf = Buffer.from(configuredPassword);
  if (passBuf.length !== confBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(passBuf, confBuf);
}

export { SESSION_COOKIE_NAME };
