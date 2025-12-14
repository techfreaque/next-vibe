/**
 * Native Auth Repository
 * Implements AuthRepository interface for React Native
 *
 * POLYFILL PATTERN: This file makes the same repository interface work on native
 * by calling HTTP endpoints instead of direct JWT/cookie operations.
 *
 * IMPLEMENTATION STRATEGY:
 * - JWT operations: Return errors (server-only, can't sign/verify JWT on native)
 * - Storage operations: Use AsyncStorage (setAuthCookies/clearAuthCookies)
 * - Other methods: Return "not implemented" (not used in page.tsx)
 *
 * Storage methods (setAuthCookies/clearAuthCookies) use AsyncStorage on native.
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
  throwErrorResponse,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { storage } from "next-vibe-ui/lib/storage";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { AuthContext } from "@/app/api/[locale]/system/unified-interface/shared/server-only/auth/base-auth-handler";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CompleteUserType } from "@/app/api/[locale]/user/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UserRoleValue } from "../user-roles/enum";
import type { AuthRepository, InferUserType } from "./repository";

/**
 * Storage keys for auth tokens
 */
const AUTH_TOKEN_STORAGE_KEY = "@auth/token";
const AUTH_EXPIRES_AT_STORAGE_KEY = "@auth/expiresAt";

/**
 * Create a standard error for unsupported operations
 */
function createUnsupportedError<T>(
  operation: string,
  logger: EndpointLogger,
): ResponseType<T> {
  logger.error(`${operation} not available on native - use HTTP endpoints`);
  return fail({
    message: "app.api.user.auth.errors.native.unsupported",
    errorType: ErrorResponseTypes.INTERNAL_ERROR,
  });
}

class AuthRepositoryNativeImpl implements AuthRepository {
  signJwt(
    payload: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    // Parameters exist for interface consistency with server implementation
    logger.error("signJwt is server-only - JWT signing happens on server", {
      userId: payload.id,
    });
    return Promise.resolve(createUnsupportedError<string>("signJwt", logger));
  }

  verifyJwt(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    // Parameters exist for interface consistency with server implementation
    logger.error(
      "verifyJwt is server-only - JWT verification happens on server",
      { tokenLength: token?.length },
    );
    return Promise.resolve(
      createUnsupportedError<JwtPrivatePayloadType>("verifyJwt", logger),
    );
  }

  getCurrentUser(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    // Parameters exist for interface consistency with server implementation
    logger.warn(
      "getCurrentUser not implemented on native - not used in page.tsx",
      { contextType: typeof context },
    );
    return Promise.resolve(
      createUnsupportedError<JwtPrivatePayloadType>("getCurrentUser", logger),
    );
  }

  getAuthMinimalUser<TRoles extends readonly UserRoleValue[]>(
    roles: TRoles,
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    // Parameters exist for interface consistency with server implementation
    logger.error(
      "getAuthMinimalUser not implemented on native - not used in page.tsx",
      { rolesCount: roles.length, contextType: typeof context },
    );
    const error = createUnsupportedError<InferUserType<TRoles>>(
      "getAuthMinimalUser",
      logger,
    );
    return Promise.reject(new Error(JSON.stringify(error)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Parameters exist for interface consistency
  getUserRoles(
    requiredRoles: readonly UserRoleValue[],
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<UserRoleValue[]> {
    // Parameters exist for interface consistency with server implementation
    logger.warn(
      "getUserRoles not implemented on native - not used in page.tsx",
      { requiredRolesCount: requiredRoles.length, contextType: typeof context },
    );
    return Promise.resolve([]);
  }

  async setAuthCookies(
    token: string,
    rememberMe: boolean,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      // Store token in native storage instead of cookies
      const expirationDays = rememberMe ? 30 : 7;
      const expiresAt = new Date(
        Date.now() + expirationDays * 24 * 60 * 60 * 1000,
      );

      logger.debug("Storing auth token in native storage", {
        expiresAt: expiresAt.toISOString(),
      });

      await storage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
      await storage.setItem(
        AUTH_EXPIRES_AT_STORAGE_KEY,
        expiresAt.toISOString(),
      );

      logger.debug("Auth token stored successfully");
      return success(undefined);
    } catch (error) {
      logger.error("Error storing auth token", parseError(error));
      return fail({
        message: "app.api.user.auth.errors.native.storage_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  async clearAuthCookies(logger: EndpointLogger): Promise<ResponseType<void>> {
    try {
      logger.debug("Clearing auth token from native storage");

      await storage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      await storage.removeItem(AUTH_EXPIRES_AT_STORAGE_KEY);

      logger.debug("Auth token cleared successfully");
      return success(undefined);
    } catch (error) {
      logger.error("Error clearing auth token", parseError(error));
      return fail({
        message: "app.api.user.auth.errors.native.clear_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Store authentication token using platform-specific handler
   * For native, this delegates to setAuthCookies which uses AsyncStorage
   */
  async storeAuthTokenForPlatform(
    token: string,
    _userId: string,
    _leadId: string,
    _platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // On native, we always use AsyncStorage (no platform detection needed)
    // Default to rememberMe=true for native (30 days)
    // Parameters prefixed with _ exist for interface consistency with server implementation
    logger.debug("Storing auth token for platform (native)", {
      userId: _userId,
      leadId: _leadId,
      platform: _platform,
    });
    return await this.setAuthCookies(token, true, logger);
  }

  /**
   * Clear authentication token using platform-specific handler
   * For native, this delegates to clearAuthCookies which uses AsyncStorage
   */
  async clearAuthTokenForPlatform(
    _platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // On native, we always use AsyncStorage (no platform detection needed)
    // Parameter prefixed with _ exists for interface consistency with server implementation
    logger.debug("Clearing auth token for platform (native)", {
      platform: _platform,
    });
    return await this.clearAuthCookies(logger);
  }

  createCliToken(
    _userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    // Parameters exist for interface consistency with server implementation
    logger.debug("createCliToken not available on native", {
      userId: _userId,
      locale,
    });
    return Promise.resolve(
      createUnsupportedError<string>("createCliToken", logger),
    );
  }

  validateCliToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null> {
    // Parameters exist for interface consistency with server implementation
    logger.error("validateCliToken not available on native", {
      tokenLength: token?.length,
    });
    return Promise.resolve(null);
  }

  extractUserId(payload: JwtPrivatePayloadType): string | null {
    return payload.id || null;
  }

  requireUserId(payload: JwtPrivatePayloadType): string {
    const userId = this.extractUserId(payload);
    if (!userId) {
      throwErrorResponse(
        "app.api.user.auth.errors.jwt_payload_missing_id",
        ErrorResponseTypes.UNAUTHORIZED,
      );
    }
    return userId;
  }

  requireAdminUser(
    locale: CountryLanguage,
    _callbackUrl: string,
    logger: EndpointLogger,
  ): Promise<CompleteUserType> {
    // Parameters exist for interface consistency with server implementation
    logger.error("requireAdminUser not available on native", {
      locale,
      callbackUrl: _callbackUrl,
    });
    const error = createUnsupportedError<CompleteUserType>(
      "requireAdminUser",
      logger,
    );
    return Promise.reject(new Error(JSON.stringify(error)));
  }

  authenticateUserByEmail(
    _email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    // Parameters exist for interface consistency with server implementation
    logger.error("authenticateUserByEmail not available on native", {
      email: _email,
      locale,
    });
    return Promise.resolve(
      createUnsupportedError<JwtPrivatePayloadType>(
        "authenticateUserByEmail",
        logger,
      ),
    );
  }
}

/**
 * Singleton instance
 */
export const authRepository = new AuthRepositoryNativeImpl();
