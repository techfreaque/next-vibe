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
  fail,
  success,
  ErrorResponseTypes,
  throwErrorResponse,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { storage } from "next-vibe-ui/lib/storage";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CompleteUserType } from "@/app/api/[locale]/user/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UserRoleValue } from "../user-roles/enum";
import type { AuthRepository, InferUserType } from "./repository";
import type { AuthContext } from "../../system/unified-interface/shared/server-only/auth/base-auth-handler";

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
    logger.error("signJwt is server-only - JWT signing happens on server");
    return Promise.resolve(createUnsupportedError<string>("signJwt", logger));
  }

  verifyJwt(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    logger.error(
      "verifyJwt is server-only - JWT verification happens on server",
    );
    return Promise.resolve(
      createUnsupportedError<JwtPrivatePayloadType>("verifyJwt", logger),
    );
  }

  verifyToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    return this.verifyJwt(token, logger);
  }

  getLeadIdFromDb(): Promise<string | null> {
    // Native implementation should use AsyncStorage or similar
    // For now, return null to indicate not implemented
    return Promise.resolve(null);
  }

  getPrimaryLeadId(): Promise<string | null> {
    // Native implementation should use AsyncStorage or similar
    // For now, return null to indicate not implemented
    return Promise.resolve(null);
  }

  getAllLeadIds(): Promise<string[]> {
    // Native implementation should use AsyncStorage or similar
    // For now, return empty array to indicate not implemented
    return Promise.resolve([]);
  }

  getCurrentUser(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    logger.warn(
      "getCurrentUser not implemented on native - not used in page.tsx",
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
    logger.error(
      "getAuthMinimalUser not implemented on native - not used in page.tsx",
    );
    const error = createUnsupportedError<InferUserType<TRoles>>(
      "getAuthMinimalUser",
      logger,
    );
    return Promise.reject(new Error(JSON.stringify(error)));
  }

  getTypedAuthMinimalUser<TRoles extends readonly UserRoleValue[]>(
    roles: TRoles,
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles> | null> {
    logger.warn(
      "getTypedAuthMinimalUser not implemented on native - not used in page.tsx",
    );
    return Promise.resolve(null);
  }

  getUserRoles(
    requiredRoles: readonly UserRoleValue[],
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<UserRoleValue[]> {
    logger.warn(
      "getUserRoles not implemented on native - not used in page.tsx",
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
    userId: string,
    leadId: string,
    _platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    // On native, we always use AsyncStorage (no platform detection needed)
    // Default to rememberMe=true for native (30 days)
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
    return await this.clearAuthCookies(logger);
  }

  createCliToken(
    userId: string,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    return Promise.resolve(
      createUnsupportedError<string>("createCliToken", logger),
    );
  }

  validateCliToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null> {
    logger.error("validateCliToken not available on native");
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
    callbackUrl: string,
    logger: EndpointLogger,
  ): Promise<CompleteUserType> {
    logger.error("requireAdminUser not available on native");
    const error = createUnsupportedError<CompleteUserType>(
      "requireAdminUser",
      logger,
    );
    return Promise.reject(new Error(JSON.stringify(error)));
  }

  authenticateUserByEmail(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    logger.error("authenticateUserByEmail not available on native");
    void email;
    void locale;
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
