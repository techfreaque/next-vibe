import "server-only";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import {
  AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  AUTH_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { Environment, parseError } from "next-vibe/shared/utils";

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/v1/core/user/auth/types";
import {
  createPrivateUser,
  createPublicUser,
} from "@/app/api/[locale]/v1/core/user/auth/helpers";
import { leadAuthRepository } from "@/app/api/[locale]/v1/core/leads/auth/repository";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  type AuthContext,
  BaseAuthHandler,
} from "../../shared/server-only/auth/base-auth-handler";
import { authRepository } from "../../../../user/auth/repository";
import type { EndpointLogger } from "../../shared/logger/endpoint";

/**
 * Web Authentication Handler
 *
 * Authentication strategy:
 * 1. Read JWT from HTTP-only cookies
 * 2. Verify JWT signature
 * 3. Validate session against database
 * 4. Store JWT in HTTP-only cookies
 * 5. For public users, create lead ID from database
 */
export class WebAuthHandler extends BaseAuthHandler {
  private secretKey: Uint8Array;

  constructor() {
    super();
    this.secretKey = new TextEncoder().encode(env.JWT_SECRET_KEY);
  }

  /**
   * Authenticate user for web platforms
   */
  async authenticate(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPayloadType>> {
    // Get existingLeadId at the top level so it's available in catch block
    let existingLeadId: string | undefined;
    try {
      logger.debug("Web authentication started", {
        platform: context.platform,
        hasRequest: !!context.request,
      });

      // Get token from Authorization header first, then fall back to cookies
      let token: string | undefined;

      if (context.request) {
        const authHeader = context.request.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.substring(7); // Remove "Bearer " prefix
          logger.debug("Found auth token in Authorization header");
        }
      }

      // Fall back to cookies if no Authorization header
      const cookieStore = await cookies();
      if (!token) {
        token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
        if (token) {
          logger.debug("Found auth token in cookies");
        }
      }

      // Get leadId from cookies
      existingLeadId = cookieStore.get(LEAD_ID_COOKIE_NAME)?.value;

      if (!token) {
        logger.debug("No auth token found in Authorization header or cookies");
        const clientInfo = {
          userAgent: undefined,
          referer: undefined,
          ipAddress: undefined,
        };
        const { leadId } = await leadAuthRepository.ensurePublicLeadId(
          existingLeadId,
          clientInfo,
          context.locale,
          logger,
        );
        // Ensure leadId cookie is set for logged-out users
        if (leadId && leadId !== existingLeadId) {
          await this.setLeadIdCookie(leadId, logger);
        }
        return success(createPublicUser(leadId || ""));
      }

      // Verify token
      const verifyResult = await this.verifyToken(token, logger);
      if (!verifyResult.success) {
        logger.debug("Token verification failed - clearing invalid cookies");
        await this.clearAuthToken(logger);
        const clientInfo = {
          userAgent: undefined,
          referer: undefined,
          ipAddress: undefined,
        };
        const { leadId } = await leadAuthRepository.ensurePublicLeadId(
          existingLeadId,
          clientInfo,
          context.locale,
          logger,
        );
        // Ensure leadId cookie is set for logged-out users
        if (leadId && leadId !== existingLeadId) {
          await this.setLeadIdCookie(leadId, logger);
        }
        return success(createPublicUser(leadId || ""));
      }

      // Validate session
      const sessionValid = await this.validateSession(
        token,
        verifyResult.data.id,
        context.locale,
        logger,
      );

      if (!sessionValid) {
        logger.debug("Session validation failed - clearing invalid cookies");
        await this.clearAuthToken(logger);
        const clientInfo = {
          userAgent: undefined,
          referer: undefined,
          ipAddress: undefined,
        };
        const { leadId } = await leadAuthRepository.ensurePublicLeadId(
          existingLeadId,
          clientInfo,
          context.locale,
          logger,
        );
        // Ensure leadId cookie is set for logged-out users
        if (leadId && leadId !== existingLeadId) {
          await this.setLeadIdCookie(leadId, logger);
        }
        return success(createPublicUser(leadId || ""));
      }

      return success(verifyResult.data);
    } catch (error) {
      logger.error(
        "Web authentication failed - clearing cookies",
        parseError(error),
      );
      await this.clearAuthToken(logger);
      const leadId = await authRepository.getLeadIdFromDb(
        undefined,
        context.locale,
        logger,
      );
      // Ensure leadId cookie is set for logged-out users
      if (leadId && leadId !== existingLeadId) {
        await this.setLeadIdCookie(leadId, logger);
      }
      return success(createPublicUser(leadId || ""));
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      logger.debug("Verifying JWT token");

      const { payload } = await jwtVerify(token, this.secretKey);

      // Validate payload structure
      if (
        !payload.id ||
        typeof payload.id !== "string" ||
        !payload.leadId ||
        typeof payload.leadId !== "string"
      ) {
        return fail({
          message:
            "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.invalidTokenPayload",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      return success({
        isPublic: false,
        id: payload.id,
        leadId: payload.leadId,
      });
    } catch (error) {
      logger.error("JWT verification failed", parseError(error));
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.invalidToken",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Sign JWT token
   */
  async signToken(
    payload: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("Signing JWT token", { userId: payload.id });

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS}s`)
        .sign(this.secretKey);

      return success(token);
    } catch (error) {
      logger.error("JWT signing failed", parseError(error));
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.signingFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Validate session against database
   */
  async validateSession(
    token: string,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null> {
    try {
      // Import here to avoid circular dependencies
      const { sessionRepository } =
        await import("@/app/api/[locale]/v1/core/user/private/session/repository");

      const sessionResult = await sessionRepository.findByToken(token);
      if (!sessionResult.success) {
        return null;
      }

      const session = sessionResult.data;
      if (session.userId !== userId) {
        logger.error("Session user ID mismatch", {
          sessionUserId: session.userId,
          expectedUserId: userId,
        });
        return null;
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        logger.debug("Session expired", { expiresAt: session.expiresAt });
        return null;
      }

      const leadId = await authRepository.getLeadIdFromDb(
        userId,
        locale,
        logger,
      );
      return createPrivateUser(userId, leadId || "");
    } catch (error) {
      logger.error("Session validation failed", parseError(error));
      return null;
    }
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

  /**
   * Set lead ID cookie for public users
   * This ensures leadId is persisted across requests for logged-out users
   */
  async setLeadIdCookie(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Setting leadId cookie", { leadId });

      const cookieStore = await cookies();

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

      return success(undefined);
    } catch (error) {
      logger.error("Failed to set leadId cookie", parseError(error));
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.setLeadIdCookieFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get stored authentication token from cookies
   */
  async getStoredAuthToken(
    logger: EndpointLogger,
  ): Promise<string | undefined> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
    } catch (error) {
      logger.error("Error getting stored auth token", parseError(error));
      return undefined;
    }
  }
}

/**
 * Singleton instance
 */
export const webAuthHandler = new WebAuthHandler();
