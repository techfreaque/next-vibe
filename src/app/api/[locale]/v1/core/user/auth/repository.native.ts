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

import { parseError } from "next-vibe/shared/utils";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { storage } from "next-vibe-ui/ui/storage";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CompleteUserType } from "@/app/api/[locale]/v1/core/user/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UserRoleValue } from "../user-roles/enum";
// Import the interface from the server implementation to ensure type compatibility
import type { AuthContext, AuthRepository, InferUserType } from "./repository";

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
  return createErrorResponse(
    "app.api.v1.core.user.auth.errors.native.unsupported",
    ErrorResponseTypes.INTERNAL_ERROR,
  );
}

/**
 * Native Auth Repository Implementation
 */
class AuthRepositoryNativeImpl implements AuthRepository {
  // JWT signing/verification are server-only operations (can't be done on native)
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

  getAuthMinimalUser<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
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

  getTypedAuthMinimalUser<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
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
    requiredRoles: readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<(typeof UserRoleValue)[keyof typeof UserRoleValue][]> {
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
      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error("Error storing auth token", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.native.storage_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: String(error) },
      );
    }
  }

  async clearAuthCookies(logger: EndpointLogger): Promise<ResponseType<void>> {
    try {
      logger.debug("Clearing auth token from native storage");

      await storage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      await storage.removeItem(AUTH_EXPIRES_AT_STORAGE_KEY);

      logger.debug("Auth token cleared successfully");
      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error("Error clearing auth token", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.native.clear_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: String(error) },
      );
    }
  }

  createCliToken(
    userId: string,
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
      return "";
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
}

/**
 * Singleton instance
 */
export const authRepository = new AuthRepositoryNativeImpl();
