import "server-only";

import { cookies } from "next/headers";
import {
  AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  AUTH_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  fail,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { Environment, parseError } from "next-vibe/shared/utils";

import { env } from "@/config/env";

import {
  type AuthContext,
  BaseAuthHandler,
} from "../shared/server-only/auth/base-auth-handler";
import type { EndpointLogger } from "../shared/logger/endpoint";

/**
 * Web Authentication Handler
 * Handles platform-specific storage for web (HTTP cookies)
 * All authentication business logic is in authRepository
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
        const token = authHeader.substring(7); // Remove "Bearer " prefix
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
   */
  async storeAuthToken(
    token: string,
    userId: string,
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Storing auth token in cookies", { userId, leadId });

      const cookieStore = await cookies();

      const cookieOptions = {
        name: AUTH_TOKEN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: "/",
        secure: env.NODE_ENV === Environment.PRODUCTION,
        sameSite: "lax" as const,
        maxAge: AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS,
      };

      cookieStore.set(cookieOptions);

      // Set lead ID cookie for client-side tracking
      // This cookie is readable by client (httpOnly: false) for analytics/tracking
      // No maxAge - cookie never expires (persists indefinitely for tracking)
      cookieStore.set({
        name: LEAD_ID_COOKIE_NAME,
        value: leadId,
        httpOnly: false, // Needs to be readable by client
        path: "/",
        secure: env.NODE_ENV === Environment.PRODUCTION,
        sameSite: "lax" as const,
        // No maxAge - cookie persists indefinitely
      });

      logger.debug("Auth token and lead ID stored in cookies");
      return success(undefined);
    } catch (error) {
      logger.error("Error storing auth token", parseError(error));
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.storeFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Clear authentication token by deleting cookies
   */
  async clearAuthToken(logger: EndpointLogger): Promise<ResponseType<void>> {
    try {
      logger.debug("Clearing auth token from cookies");
      try {
        const cookieStore = await cookies();
        cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
        // Note: We don't delete LEAD_ID_COOKIE_NAME on logout
        // Lead ID persists across sessions for tracking purposes
      } catch (error) {
        // fails on page.tsx
        logger.debug("Error clearing auth token", parseError(error));
      }

      logger.debug("Auth token cleared from cookies");
      return success(undefined);
    } catch (error) {
      logger.error("Error clearing auth token", parseError(error));
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.clearFailed",
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
