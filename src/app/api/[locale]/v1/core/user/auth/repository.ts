/**
 * Unified Auth Repository
 * Provides platform-aware authentication interface with type-safe user inference
 * Contains all authentication business logic in compliance with repository-first architecture
 */
import "server-only";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { env } from "next-vibe/server/env";
import {
  AUTH_STATUS_COOKIE_NAME,
  AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  AUTH_TOKEN_COOKIE_NAME,
} from "next-vibe/shared/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  throwErrorResponse,
} from "next-vibe/shared/types/response.schema";
import { Environment, parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CompleteUserType } from "../definition";
import { UserDetailLevel } from "../enum";
import { sessionRepository } from "../private/session/repository";
import { userRepository } from "../repository";
import { UserRole, type UserRoleValue } from "../user-roles/enum";
import { userRolesRepository } from "../user-roles/repository";
import type { JwtPrivatePayloadType, JWTPublicPayloadType } from "./definition";

/**
 * Platform context for authentication
 */
export interface AuthContext {
  platform: "next" | "trpc" | "cli";
  request?: NextRequest; // Required for tRPC
  token?: string; // Required for CLI
  jwtPayload?: JwtPrivatePayloadType; // Optional for CLI direct payload auth
}

/**
 * Type helper to infer user type based on roles
 */
export type InferUserType<
  TRoles extends readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
> = TRoles["length"] extends 1
  ? TRoles[0] extends typeof UserRole.PUBLIC
    ? JWTPublicPayloadType
    : JwtPrivatePayloadType
  : TRoles[number] extends typeof UserRole.PUBLIC
    ? JwtPrivatePayloadType
    : JwtPrivatePayloadType;

/**
 * Unified Auth Repository Interface with type-safe authentication
 */
export interface AuthRepository {
  /**
   * Sign a JWT token
   */
  signJwt(
    payload: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;

  /**
   * Verify a JWT token
   */
  verifyJwt(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>>;

  /**
   * Get current user (platform-aware)
   */
  getCurrentUser(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>>;

  /**
   * Get authenticated user with role checking (platform-aware) - returns generic type
   */
  getAuthMinimalUser<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    roles: TRoles,
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>>;

  /**
   * Get user roles (platform-aware)
   */
  getUserRoles(
    requiredRoles: readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<(typeof UserRoleValue)[keyof typeof UserRoleValue][]>;

  /**
   * Set authentication cookies (Next.js only)
   */
  setAuthCookies(
    token: string,
    rememberMe: boolean,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  /**
   * Clear authentication cookies (Next.js only)
   */
  clearAuthCookies(logger: EndpointLogger): Promise<ResponseType<void>>;

  /**
   * Create CLI token
   */
  createCliToken(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;

  /**
   * Validate CLI token (stateless)
   */
  validateCliToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null>;

  /**
   * Safely extract user ID from JWT payload
   */
  extractUserId(payload: JwtPrivatePayloadType): string | null;

  /**
   * Safely extract user ID from JWT payload or throw error
   */
  requireUserId(payload: JwtPrivatePayloadType): string;

  /**
   * Require admin user authentication and redirect to login if not authenticated or not admin
   */
  requireAdminUser(
    locale: CountryLanguage,
    callbackUrl: string,
    logger: EndpointLogger,
  ): Promise<CompleteUserType>;
}

/**
 * Unified Auth Repository Implementation
 * Contains all authentication business logic consolidated from handlers and core
 */
class AuthRepositoryImpl implements AuthRepository {
  private readonly secretKey: Uint8Array;

  constructor() {
    if (!env.JWT_SECRET_KEY) {
      this.secretKey = new TextEncoder().encode("fallback-dev-key-only");
    } else {
      this.secretKey = new TextEncoder().encode(env.JWT_SECRET_KEY);
    }
  }

  /**
   * Validate user exists and session is active
   * @param token - JWT token
   * @param userId - User ID from token
   * @param logger - Logger for debugging
   * @returns Validated user or null
   */
  private async validateUserAndSession(
    token: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null> {
    try {
      // Validate that the user ID from the JWT token still exists in the database
      const userExistsResponse = await userRepository.exists(userId, logger);
      if (!userExistsResponse.success || !userExistsResponse.data) {
        logger.debug("app.api.v1.core.user.auth.debug.userIdNotExistsInDb", {
          userId,
        });
        return null;
      }

      // Validate that the session exists in the database
      const sessionResponse = await sessionRepository.findByToken(token);
      if (!sessionResponse.success) {
        logger.debug("app.api.v1.core.user.auth.debug.sessionNotFound", {
          userId,
          tokenExists: false,
        });
        return null;
      }

      // Check if session is expired
      const session = sessionResponse.data;
      if (session.expiresAt < new Date()) {
        logger.debug("app.api.v1.core.user.auth.debug.sessionExpired", {
          userId,
          expiresAt: session.expiresAt,
        });
        // Delete expired session from database
        await sessionRepository.deleteByUserId(userId);
        return null;
      }

      return { isPublic: false, id: userId };
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorValidatingUserSession",
        error,
      );
      return null;
    }
  }

  /**
   * Get user roles for authenticated user
   * @param userId - User ID
   * @param requiredRoles - Roles to check for
   * @param logger - Logger for debugging
   * @returns User roles or empty array
   */
  private async getUserRolesInternal(
    userId: string,
    requiredRoles: readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
    logger: EndpointLogger,
  ): Promise<(typeof UserRoleValue)[keyof typeof UserRoleValue][]> {
    try {
      // Public role is always allowed
      if (requiredRoles.includes(UserRole.PUBLIC)) {
        return [UserRole.PUBLIC];
      }

      // Customer role is allowed for any authenticated user
      const roles: (typeof UserRoleValue)[keyof typeof UserRoleValue][] = [];
      if (requiredRoles.includes(UserRole.CUSTOMER)) {
        roles.push(UserRole.CUSTOMER);
      }

      // Check for other roles in database
      const userRolesResponse = await userRolesRepository.findByUserId(
        userId,
        logger,
      );
      if (userRolesResponse.success) {
        const dbRoles = userRolesResponse.data
          .map((r) => r.role)
          .filter((role) =>
            requiredRoles.includes(role),
          ) as (typeof UserRoleValue)[keyof typeof UserRoleValue][];
        for (const role of dbRoles) {
          roles.push(role);
        }
      }

      return roles;
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingUserRoles",
        error,
      );
      return [];
    }
  }

  /**
   * Authenticate user with role checking
   * @param userId - User ID
   * @param requiredRoles - Required roles
   * @param logger - Logger for debugging
   * @returns Authenticated user or public user
   */
  private async getAuthenticatedUserInternal<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    userId: string,
    requiredRoles: TRoles,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      // Public role is always allowed
      if (requiredRoles.includes(UserRole.PUBLIC)) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Customer role is allowed for any authenticated user
      if (requiredRoles.includes(UserRole.CUSTOMER)) {
        return { isPublic: false, id: userId } as InferUserType<TRoles>;
      }

      // For other roles, check the user's roles
      const userRolesResponse = await userRolesRepository.findByUserId(
        userId,
        logger,
      );
      if (!userRolesResponse.success) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Check for required roles
      const hasRequiredRole = userRolesResponse.data.some((r) => {
        const roleValue =
          r.role as (typeof UserRoleValue)[keyof typeof UserRoleValue];
        return requiredRoles.includes(roleValue);
      });

      if (hasRequiredRole) {
        return { isPublic: false, id: userId } as InferUserType<TRoles>;
      }

      return { isPublic: true } as InferUserType<TRoles>;
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorCheckingUserAuth",
        error,
      );
      return { isPublic: true } as InferUserType<TRoles>;
    }
  }

  /**
   * Extract JWT token from NextRequest
   * Checks both Authorization header and cookies
   * @param request - NextRequest from tRPC context
   * @param logger - Logger for debugging
   * @returns JWT token or null
   */
  private extractTokenFromRequest(
    request: NextRequest,
    logger: EndpointLogger,
  ): string | null {
    try {
      // First check for Authorization header (for API clients)
      // eslint-disable-next-line i18next/no-literal-string
      const authHeader = request.headers.get("Authorization");
      // eslint-disable-next-line i18next/no-literal-string
      if (authHeader?.startsWith("Bearer ")) {
        const headerToken = authHeader.substring(7);
        if (headerToken) {
          logger.debug("app.api.v1.core.user.auth.debug.tokenFromAuthHeader");
          return headerToken;
        }
      }

      // Then check for cookies (for browser requests)
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = this.parseCookies(cookieHeader, logger);
        const cookieToken = cookies[AUTH_TOKEN_COOKIE_NAME];
        if (cookieToken) {
          logger.debug("app.api.v1.core.user.auth.debug.tokenFromCookie");
          return cookieToken;
        }
      }

      logger.debug("app.api.v1.core.user.auth.debug.noTokenFound");
      return null;
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorExtractingToken",
        error,
      );
      return null;
    }
  }

  /**
   * Parse cookie header string into key-value pairs
   * @param cookieHeader - Raw cookie header string
   * @param logger - Logger for debugging
   * @returns Parsed cookies object
   */
  private parseCookies(
    cookieHeader: string,
    logger: EndpointLogger,
  ): Record<string, string> {
    const cookies: Record<string, string> = {};

    try {
      cookieHeader.split(";").forEach((cookie) => {
        // eslint-disable-next-line i18next/no-literal-string
        const [name, ...rest] = cookie.trim().split("=");
        if (name && rest.length > 0) {
          // eslint-disable-next-line i18next/no-literal-string
          cookies[name] = rest.join("=");
        }
      });
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorParsingCookies",
        error,
      );
    }

    return cookies;
  }

  /**
   * Sign a JWT token
   * @param payload - The payload to sign
   * @param logger - Logger for debugging
   * @returns ResponseType with the signed token
   */
  async signJwt(
    payload: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("app.api.v1.core.user.auth.debug.signingJwt", {
        userId: payload.id,
      });

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS}s`)
        .sign(this.secretKey);

      logger.debug("app.api.v1.core.user.auth.debug.jwtSignedSuccessfully", {
        userId: payload.id,
      });
      return createSuccessResponse(token);
    } catch (error) {
      logger.error("app.api.v1.core.user.auth.debug.errorSigningJwt", error);
      return createErrorResponse(
        "auth.errors.jwt_signing_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Verify a JWT token
   * @param token - The token to verify
   * @param logger - Logger for debugging
   * @returns ResponseType with the verification result
   */
  async verifyJwt(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      logger.debug("app.api.v1.core.user.auth.debug.verifyingJwt");

      // Verify the token
      const { payload } = await jwtVerify<JwtPrivatePayloadType>(
        token,
        this.secretKey,
      );

      // Validate the payload structure
      if (!payload.id || typeof payload.id !== "string") {
        logger.debug("app.api.v1.core.user.auth.debug.invalidTokenPayload", {
          payload,
        });
        return createErrorResponse(
          "auth.errors.invalid_token_signature",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }
      logger.debug("app.api.v1.core.user.auth.debug.jwtVerifiedSuccessfully", {
        payload,
      });

      return createSuccessResponse({
        isPublic: false,
        id: payload.id,
      });
    } catch (error) {
      logger.debug("app.api.v1.core.user.auth.debug.errorVerifyingJwt", {
        error: parseError(error).message,
      });
      return createErrorResponse(
        "auth.errors.invalid_token_signature",
        ErrorResponseTypes.UNAUTHORIZED,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get current user with platform-aware handling
   */
  async getCurrentUser(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      if (!context.platform) {
        // Default to Next.js behavior for backward compatibility
        return await this.getCurrentUserNext(logger);
      }

      switch (context.platform) {
        case "next":
          return await this.getCurrentUserNext(logger);

        case "trpc":
          if (!context.request) {
            return createErrorResponse(
              "auth.errors.missing_request_context",
              ErrorResponseTypes.INTERNAL_ERROR,
            );
          }
          return await this.getCurrentUserTrpc(context.request, logger);

        case "cli":
          if (!context.token) {
            return createErrorResponse(
              "auth.errors.missing_token",
              ErrorResponseTypes.UNAUTHORIZED,
            );
          }
          return await this.getCurrentUserCli(context.token, logger);

        default:
          return createErrorResponse(
            "auth.errors.unsupported_platform",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
      }
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorInUnifiedGetCurrentUser",
        error,
      );
      return createErrorResponse(
        "auth.errors.session_retrieval_failed",
        ErrorResponseTypes.UNAUTHORIZED,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get current user from Next.js cookies
   * @param logger - Logger for debugging
   * @returns ResponseType with the current user
   */
  private async getCurrentUserNext(
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      logger.debug(
        "app.api.v1.core.user.auth.debug.gettingCurrentUserFromNextjs",
      );

      // Get the token from cookies
      const cookieStore = await cookies();
      const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;

      if (!token) {
        return createErrorResponse(
          "auth.errors.missing_token",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Verify the token
      const verifyResult = await this.verifyJwt(token, logger);
      if (!verifyResult.success) {
        return verifyResult;
      }

      // Validate user and session
      const user = await this.validateUserAndSession(
        token,
        verifyResult.data.id,
        logger,
      );
      if (!user) {
        // Clear invalid cookies
        cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
        cookieStore.delete(AUTH_STATUS_COOKIE_NAME);

        return createErrorResponse(
          "auth.errors.invalid_session",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      return createSuccessResponse(user);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForNextjs",
        error,
      );
      return createErrorResponse(
        "auth.errors.session_retrieval_failed",
        ErrorResponseTypes.UNAUTHORIZED,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get current user from tRPC request context
   * @param request - NextRequest from tRPC context
   * @param logger - Logger for debugging
   * @returns ResponseType with the current user
   */
  private async getCurrentUserTrpc(
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      logger.debug(
        "app.api.v1.core.user.auth.debug.gettingCurrentUserFromTrpc",
      );

      // Extract token from request
      const token = this.extractTokenFromRequest(request, logger);

      if (!token) {
        return createErrorResponse(
          "auth.errors.missing_token",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Verify the token
      const verifyResult = await this.verifyJwt(token, logger);
      if (!verifyResult.success) {
        return verifyResult;
      }

      // Validate user and session
      const user = await this.validateUserAndSession(
        token,
        verifyResult.data.id,
        logger,
      );
      if (!user) {
        return createErrorResponse(
          "auth.errors.invalid_session",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      return createSuccessResponse(user);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForTrpc",
        error,
      );
      return createErrorResponse(
        "auth.errors.session_retrieval_failed",
        ErrorResponseTypes.UNAUTHORIZED,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get current user from JWT token (CLI)
   * @param token - JWT token provided by CLI
   * @param logger - Logger for debugging
   * @returns ResponseType with the current user
   */
  private async getCurrentUserCli(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      logger.debug(
        "app.api.v1.core.user.auth.debug.gettingCurrentUserFromToken",
      );

      if (!token) {
        return createErrorResponse(
          "auth.errors.missing_token",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Verify the token
      const verifyResult = await this.verifyJwt(token, logger);
      if (!verifyResult.success) {
        return verifyResult;
      }

      // Validate user and session
      const user = await this.validateUserAndSession(
        token,
        verifyResult.data.id,
        logger,
      );
      if (!user) {
        return createErrorResponse(
          "auth.errors.invalid_session",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      return createSuccessResponse(user);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingCurrentUserFromCli",
        error,
      );
      return createErrorResponse(
        "auth.errors.session_retrieval_failed",
        ErrorResponseTypes.UNAUTHORIZED,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get authenticated user with role checking (platform-aware) - generic return type
   */
  async getAuthMinimalUser<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    roles: TRoles,
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      if (!context.platform) {
        // Default to Next.js behavior for backward compatibility
        return await this.getAuthMinimalUserNext<TRoles>(roles, logger);
      }

      switch (context.platform) {
        case "next":
          return await this.getAuthMinimalUserNext(roles, logger);

        case "trpc":
          if (!context.request) {
            logger.error(
              "app.api.v1.core.user.auth.debug.missingRequestContextForTrpc",
            );
            return { isPublic: true } as InferUserType<TRoles>;
          }
          return await this.getAuthMinimalUserTrpc(
            context.request,
            roles,
            logger,
          );

        case "cli":
          if (context.jwtPayload) {
            // Direct payload authentication
            return await this.authenticateWithPayload<TRoles>(
              context.jwtPayload,
              roles,
              logger,
            );
          } else if (context.token) {
            // Token-based authentication
            return await this.getAuthMinimalUserCli<TRoles>(
              context.token,
              roles,
              logger,
            );
          } else {
            logger.error(
              "app.api.v1.core.user.auth.debug.missingTokenOrPayloadForCli",
            );
            return { isPublic: true } as InferUserType<TRoles>;
          }

        default:
          logger.error(
            "app.api.v1.core.user.auth.debug.unsupportedPlatformForAuth",
            {
              platform: context.platform,
            },
          );
          return { isPublic: true } as InferUserType<TRoles>;
      }
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorInUnifiedGetAuthMinimalUser",
        error,
      );
      return { isPublic: true } as InferUserType<TRoles>;
    }
  }

  /**
   * Get authenticated user with role checking for Next.js
   * @param roles - Required roles
   * @param logger - Logger for debugging
   * @returns Authenticated user
   */
  private async getAuthMinimalUserNext<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(roles: TRoles, logger: EndpointLogger): Promise<InferUserType<TRoles>> {
    try {
      // Public role is always allowed
      if (roles.includes(UserRole.PUBLIC)) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Get user from cookies
      const userResult = await this.getCurrentUserNext(logger);
      if (
        !userResult.success ||
        !userResult.data?.id ||
        userResult.data.isPublic
      ) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Use internal method to check authentication with roles
      return await this.getAuthenticatedUserInternal<TRoles>(
        userResult.data.id,
        roles,
        logger,
      );
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForNextjs",
        error,
      );
      return { isPublic: true } as InferUserType<TRoles>;
    }
  }

  /**
   * Get authenticated user with role checking for tRPC
   * @param request - NextRequest from tRPC context
   * @param roles - Required roles
   * @param logger - Logger for debugging
   * @returns Authenticated user
   */
  private async getAuthMinimalUserTrpc<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    request: NextRequest,
    roles: TRoles,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      // Public role is always allowed
      if (roles.includes(UserRole.PUBLIC)) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Get user from request
      const userResult = await this.getCurrentUserTrpc(request, logger);
      if (
        !userResult.success ||
        !userResult.data?.id ||
        userResult.data.isPublic
      ) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Use internal method to check authentication with roles
      return await this.getAuthenticatedUserInternal<TRoles>(
        userResult.data.id,
        roles,
        logger,
      );
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForTrpc",
        error,
      );
      return { isPublic: true } as InferUserType<TRoles>;
    }
  }

  /**
   * Get authenticated user with role checking for CLI
   * @param token - JWT token provided by CLI
   * @param roles - Required roles
   * @param logger - Logger for debugging
   * @returns Authenticated user
   */
  private async getAuthMinimalUserCli<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    token: string,
    roles: TRoles,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      // Public role is always allowed, or if no roles specified (empty array means public)
      if (roles.includes(UserRole.PUBLIC) || roles.length === 0) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Get user from token
      const userResult = await this.getCurrentUserCli(token, logger);
      if (
        !userResult.success ||
        !userResult.data?.id ||
        userResult.data.isPublic
      ) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Use internal method to check authentication with roles
      return await this.getAuthenticatedUserInternal(
        userResult.data.id,
        roles,
        logger,
      );
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForCli",
        error,
      );
      return { isPublic: true } as InferUserType<TRoles>;
    }
  }

  /**
   * Authenticate user with JWT payload directly
   * Used when CLI provides a pre-validated JWT payload
   * @param jwtPayload - Pre-validated JWT payload
   * @param roles - Required roles
   * @param logger - Logger for debugging
   * @returns Authenticated user
   */
  private async authenticateWithPayload<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    jwtPayload: JwtPrivatePayloadType,
    roles: TRoles,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      logger.debug(
        "app.api.v1.core.user.auth.debug.authenticatingCliUserWithPayload",
        {
          userId: jwtPayload.id,
          isPublic: jwtPayload.isPublic,
        },
      );

      // Public role is always allowed, or if no roles specified (empty array means public)
      if (roles.includes(UserRole.PUBLIC) || roles.length === 0) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Check if user is public
      if (jwtPayload.isPublic || !jwtPayload.id) {
        return { isPublic: true } as InferUserType<TRoles>;
      }

      // Use internal method to check authentication with roles
      return await this.getAuthenticatedUserInternal(
        jwtPayload.id,
        roles,
        logger,
      );
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorAuthenticatingCliUserWithPayload",
        error,
      );
      return { isPublic: true } as InferUserType<TRoles>;
    }
  }

  /**
   * Type-safe authentication based on endpoint roles
   * Returns the correct user type based on the allowed roles
   */
  async getTypedAuthMinimalUser<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    roles: TRoles,
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles> | null> {
    const user = await this.getAuthMinimalUser([...roles], context, logger);
    return user as InferUserType<TRoles> | null;
  }

  /**
   * Get user roles (platform-aware)
   */
  async getUserRoles(
    requiredRoles: readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<(typeof UserRoleValue)[keyof typeof UserRoleValue][]> {
    try {
      if (!context.platform) {
        // Default behavior - try to get user and return roles
        const user = await this.getAuthMinimalUserNext(requiredRoles, logger);
        return user?.id
          ? await this.getUserRolesInternal(user.id, requiredRoles, logger)
          : [];
      }

      switch (context.platform) {
        case "next": {
          const nextUser = await this.getAuthMinimalUserNext(
            requiredRoles,
            logger,
          );
          return nextUser?.id
            ? await this.getUserRolesInternal(
                nextUser.id,
                requiredRoles,
                logger,
              )
            : [];
        }

        case "trpc":
          if (!context.request) {
            return [];
          }
          return await this.getUserRolesTrpc(
            context.request,
            requiredRoles,
            logger,
          );

        case "cli":
          if (context.token) {
            return await this.getUserRolesCli(
              context.token,
              requiredRoles,
              logger,
            );
          }
          return [];

        default:
          return [];
      }
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingUserRoles",
        error,
      );
      return [];
    }
  }

  /**
   * Get user roles for tRPC context
   * @param request - NextRequest from tRPC context
   * @param requiredRoles - Roles to check for
   * @param logger - Logger for debugging
   * @returns User roles array
   */
  private async getUserRolesTrpc(
    request: NextRequest,
    requiredRoles: readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
    logger: EndpointLogger,
  ): Promise<(typeof UserRoleValue)[keyof typeof UserRoleValue][]> {
    try {
      // Get user from request
      const userResult = await this.getCurrentUserTrpc(request, logger);
      if (
        !userResult.success ||
        !userResult.data?.id ||
        userResult.data.isPublic
      ) {
        return [];
      }

      // Use internal method to get user roles
      return await this.getUserRolesInternal(
        userResult.data.id,
        requiredRoles,
        logger,
      );
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingUserRolesForTrpc",
        error,
      );
      return [];
    }
  }

  /**
   * Get user roles for CLI context
   * @param token - JWT token provided by CLI
   * @param requiredRoles - Roles to check for
   * @param logger - Logger for debugging
   * @returns User roles array
   */
  private async getUserRolesCli(
    token: string,
    requiredRoles: readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
    logger: EndpointLogger,
  ): Promise<(typeof UserRoleValue)[keyof typeof UserRoleValue][]> {
    try {
      // Get user from token
      const userResult = await this.getCurrentUserCli(token, logger);
      if (
        !userResult.success ||
        !userResult.data?.id ||
        userResult.data.isPublic
      ) {
        return [];
      }

      // Use internal method to get user roles
      return await this.getUserRolesInternal(
        userResult.data.id,
        requiredRoles,
        logger,
      );
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingUserRolesForCli",
        error,
      );
      return [];
    }
  }

  /**
   * Set authentication cookies (Next.js only)
   */
  async setAuthCookies(
    token: string,
    rememberMe = false,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("app.api.v1.core.user.auth.debug.settingNextjsAuthCookies", {
        rememberMe,
      });

      const cookiesStore = await cookies();

      const cookieOptions = {
        name: AUTH_TOKEN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: "/",
        secure: env.NODE_ENV === Environment.PRODUCTION,
        sameSite: "lax" as const,
        // If rememberMe is true, set maxAge for persistent cookie
        // If rememberMe is false, omit maxAge for session cookie
        ...(rememberMe && { maxAge: 30 * 24 * 60 * 60 }), // 30 days
      };

      // Set the main httpOnly token cookie for server-side security
      cookiesStore.set(cookieOptions);

      logger.debug("app.api.v1.core.user.auth.debug.settingNextjsAuthCookies", {
        rememberMe,
        cookieType: rememberMe ? "persistent" : "session",
      });
      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorSettingAuthCookies",
        error,
      );
      return createErrorResponse(
        "auth.errors.cookie_set_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Clear authentication cookies (Next.js only)
   */
  async clearAuthCookies(logger: EndpointLogger): Promise<ResponseType<void>> {
    try {
      logger.debug("app.api.v1.core.user.auth.debug.clearingNextjsAuthCookies");

      const cookiesStore = await cookies();

      // Delete the main httpOnly token cookie
      cookiesStore.delete(AUTH_TOKEN_COOKIE_NAME);
      // Delete the auth status cookie
      cookiesStore.delete(AUTH_STATUS_COOKIE_NAME);

      logger.debug("app.api.v1.core.user.auth.debug.clearingNextjsAuthCookies");
      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorClearingAuthCookies",
        error,
      );
      return createErrorResponse(
        "auth.errors.cookie_clear_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Create CLI token
   */
  async createCliToken(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("app.api.v1.core.user.auth.debug.creatingCliToken", {
        userId,
      });

      const payload: JwtPrivatePayloadType = {
        isPublic: false,
        id: userId,
      };

      return await this.signJwt(payload, logger);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorCreatingCliToken",
        error,
      );
      return createErrorResponse(
        "auth.errors.jwt_signing_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Validate CLI token (stateless)
   */
  async validateCliToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null> {
    try {
      logger.debug("app.api.v1.core.user.auth.debug.validatingCliToken");

      // Verify the token
      const verifyResult = await this.verifyJwt(token, logger);
      if (!verifyResult.success) {
        return null;
      }

      // For CLI, we might want to skip session validation for stateless operations
      // Just verify the user exists
      const user = verifyResult.data;
      if (!user.id || user.isPublic) {
        return null;
      }

      return user;
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorValidatingCliToken",
        error,
      );
      return null;
    }
  }

  /**
   * Safely extract user ID from JWT payload
   * @param payload - The JWT payload to check
   * @returns The user ID if available, null otherwise
   */
  extractUserId(payload: JwtPrivatePayloadType): string | null {
    const isPrivatePayload = (
      payload: JwtPrivatePayloadType,
    ): payload is JwtPrivatePayloadType => {
      return (
        !payload.isPublic && "id" in payload && typeof payload.id === "string"
      );
    };

    if (isPrivatePayload(payload)) {
      return payload.id;
    }
    return null;
  }

  /**
   * Safely extract user ID from JWT payload or throw error
   * @param payload - The JWT payload
   * @returns The user ID
   * @throws Error if user ID is not available
   */
  requireUserId(payload: JwtPrivatePayloadType): string {
    const userId = this.extractUserId(payload);
    if (!userId) {
      throwErrorResponse(
        "auth.errors.jwt_payload_missing_id",
        ErrorResponseTypes.UNAUTHORIZED,
      );
    }
    return userId;
  }

  /**
   * Require admin user authentication and redirect to login if not authenticated or not admin
   * @param locale - The current locale for redirect URLs
   * @param callbackUrl - The URL to redirect back to after successful login
   * @param logger - Logger for debugging
   * @returns Promise that resolves to the authenticated admin user or redirects
   */
  async requireAdminUser(
    locale: CountryLanguage,
    callbackUrl: string,
    logger: EndpointLogger,
  ): Promise<CompleteUserType> {
    // Check authentication
    const userResponse = await userRepository.getUserByAuth(
      {
        detailLevel: UserDetailLevel.COMPLETE,
      },
      logger,
    );

    if (!userResponse.success) {
      redirect(
        `/${locale}/user/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
    }

    const user = userResponse.data;

    // Check if user has admin role
    const hasAdminRole = await userRolesRepository.hasRole(
      user.id,
      UserRole.ADMIN,
      logger,
    );

    if (!hasAdminRole.success || !hasAdminRole.data) {
      redirect(`/${locale}/app/onboarding`);
    }

    return user;
  }
}

// Singleton instance
export const authRepository = new AuthRepositoryImpl();
