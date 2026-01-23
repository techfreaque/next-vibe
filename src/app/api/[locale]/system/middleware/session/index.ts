/**
 * Session Validation Middleware
 *
 * This middleware ensures that session tokens are valid.
 * Invalid or expired sessions are cleared to prevent stale tokens.
 */

import type { NextRequest, NextResponse } from "next/server";
import { NextResponse as NextResponseClass } from "next/server";

import { AUTH_TOKEN_COOKIE_NAME } from "@/config/constants";

import { SessionRepository } from "../../../user/private/session/repository";

enum SessionCheckResult {
  VALID = "valid",
  INVALID = "invalid",
  MISSING = "missing",
  SKIP = "skip",
}

/**
 * Get the current session token from the request cookie
 * @param request The incoming request
 * @returns The token value or undefined if not present
 */
export function getSessionTokenFromRequest(
  request: NextRequest,
): string | undefined {
  return request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
}

/**
 * Check if session token is valid by validating against database
 * @param token The session token to check
 * @returns true if session exists and hasn't expired
 */
export async function isSessionTokenValid(token: string): Promise<boolean> {
  try {
    const result = await SessionRepository.findByToken(token);
    if (!result.success) {
      return false;
    }

    const session = result.data;
    // Check if session is expired
    if (session.expiresAt < new Date()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if session is valid
 * @param request The incoming request
 * @returns Result of session validation
 */
export async function checkSession(
  request: NextRequest,
): Promise<SessionCheckResult> {
  const path = request.nextUrl.pathname;

  // Skip for static files (these shouldn't need session validation)
  // This check is already done in main middleware, but we add it here for safety
  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.endsWith(".json")
  ) {
    return SessionCheckResult.SKIP;
  }

  // Check if session token exists
  const existingToken = getSessionTokenFromRequest(request);

  if (!existingToken) {
    return SessionCheckResult.MISSING;
  }

  // Check if token is valid in database
  const isValid = await isSessionTokenValid(existingToken);
  if (!isValid) {
    return SessionCheckResult.INVALID;
  }

  return SessionCheckResult.VALID;
}

/**
 * Clear the session token cookie
 * @param request The incoming request
 * @returns Response with cleared session cookie
 */
export function clearSessionToken(request: NextRequest): NextResponse {
  // Create a response that continues to next handler but clears the auth token cookie
  const response = NextResponseClass.next({ request });

  // Delete the session token cookie using the proper cookies API
  response.cookies.set(AUTH_TOKEN_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}

export { SessionCheckResult };
