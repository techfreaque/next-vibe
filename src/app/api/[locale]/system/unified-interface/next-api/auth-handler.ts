import "server-only";

import { cookies } from "next/headers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { Environment, parseError } from "next-vibe/shared/utils";

import {
  AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  AUTH_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";
import { env } from "@/config/env";

import type { EndpointLogger } from "../shared/logger/endpoint";
import {
  type AuthContext,
  BaseAuthHandler,
} from "../shared/server-only/auth/base-auth-handler";

/**
 * Web Authentication Handler
 * Handles platform-specific storage for web (HTTP cookies)
 * All authentication business logic is in AuthRepository
 */
export class WebAuthHandler extends BaseAuthHandler {
  /**
   * Get authentication token from web storage
   * Checks: Authorization header → HTTP-only cookies
   */
  async getStoredAuthToken(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<string | undefined> {
    // Check Authorization header first
    if (context.request) {
      const authHeader = context.request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7); // Remove "Bearer " prefix
        logger.debug("Found auth token in Authorization header");
        return token;
      }
    }

    // Fall back to cookies
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
    if (token) {
      logger.debug("Found auth token in cookies");
    }
    return token;
  }

  /**
   * Store authentication token in HTTP-only cookies
   * @param rememberMe - If true, session cookie lasts 30 days; if false, session-only (browser session)
   */
  async storeAuthToken(
    token: string,
    userId: string,
    leadId: string,
    logger: EndpointLogger,
    rememberMe = true, // Default to true (30 days)
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Storing auth token in cookies", {
        userId,
        leadId,
        rememberMe,
      });

      const cookieStore = await cookies();

      // Session cookie: 30 days if rememberMe, otherwise session-only (no maxAge)
      const cookieOptions: {
        name: string;
        value: string;
        httpOnly: boolean;
        path: string;
        secure: boolean;
        sameSite: "lax";
        maxAge?: number;
      } = {
        name: AUTH_TOKEN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: "/",
        secure: env.NODE_ENV === Environment.PRODUCTION,
        sameSite: "lax" as const,
      };

      // Only set maxAge if rememberMe is true (30 days)
      // If false, cookie is session-only (deleted when browser closes)
      if (rememberMe) {
        cookieOptions.maxAge = AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS; // 30 days
      }

      cookieStore.set(cookieOptions);

      // Set lead ID cookie for client-side tracking
      // This cookie is readable by client (httpOnly: false) for analytics/tracking
      // IMPORTANT: Lead ID cookie NEVER expires - it persists across all sessions
      // This is critical for tracking user behavior across sessions and after DB resets
      cookieStore.set({
        name: LEAD_ID_COOKIE_NAME,
        value: leadId,
        httpOnly: false, // Needs to be readable by client
        path: "/",
        secure: env.NODE_ENV === Environment.PRODUCTION,
        sameSite: "lax" as const,
        maxAge: 365 * 24 * 60 * 60 * 10, // 10 years (effectively permanent)
      });

      logger.debug("Auth token and lead ID stored in cookies", {
        sessionType: rememberMe ? "persistent (30 days)" : "session-only",
      });
      return success();
    } catch (error) {
      logger.error("Error storing auth token", parseError(error));
      return fail({
        message: "app.api.system.unifiedInterface.cli.vibe.errors.storeFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Clear authentication token by deleting cookies
   * IMPORTANT: This should ONLY be called on explicit logout, NOT on session validation failures
   * Lead ID cookie is NEVER deleted - it persists across all sessions
   */
  async clearAuthToken(logger: EndpointLogger): Promise<ResponseType<void>> {
    try {
      logger.debug("Clearing auth token from cookies (logout)");
      try {
        const cookieStore = await cookies();
        cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
        // CRITICAL: We NEVER delete LEAD_ID_COOKIE_NAME
        // Lead ID persists across sessions for tracking purposes
        // Even after logout, the lead ID should remain for analytics
        logger.debug("Auth token cleared, lead ID preserved");
      } catch (error) {
        // fails on page.tsx
        logger.debug("Error clearing auth token", parseError(error));
      }

      logger.debug("Auth token cleared from cookies");
      return success();
    } catch (error) {
      logger.error("Error clearing auth token", parseError(error));
      return fail({
        message: "app.api.system.unifiedInterface.cli.vibe.errors.clearFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

/**
 * Singleton instance
 */
export const webAuthHandler = new WebAuthHandler();
