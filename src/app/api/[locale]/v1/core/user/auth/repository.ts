/**
 * Unified Auth Repository
 * Provides platform-aware authentication interface with type-safe user inference
 * Contains all authentication business logic in compliance with repository-first architecture
 */
import "server-only";

import { and, eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
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

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { leadAuthService } from "../../leads/auth-service";
import { leads, userLeads } from "../../leads/db";
import { LeadSource, LeadStatus } from "../../leads/enum";
import { db } from "../../system/db";
import { users } from "../db";
import {
  type AuthContext,
  type AuthPlatform,
  BaseAuthHandler,
} from "../../system/unified-backend/shared/auth/base-auth-handler";
import type { CompleteUserType } from "../definition";
import { UserDetailLevel } from "../enum";
import { sessionRepository } from "../private/session/repository";
import { userRepository } from "../repository";
import type { UserRoleValue } from "../user-roles/enum";
import { UserRole } from "../user-roles/enum";
import { userRolesRepository } from "../user-roles/repository";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "./definition";

export type { AuthContext, AuthPlatform };

export type InferUserType<
  TRoles extends readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
> =
  Exclude<TRoles[number], "PUBLIC"> extends never
    ? JWTPublicPayloadType
    : Extract<TRoles[number], "PUBLIC"> extends never
      ? JwtPrivatePayloadType
      : JwtPayloadType;

/**
 * Helper to create public user payload
 */
function createPublicUser<
  TRoles extends readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
>(leadId: string): InferUserType<TRoles> {
  return { isPublic: true, leadId } as InferUserType<TRoles>;
}

/**
 * Helper to create private user payload
 */
function createPrivateUser<
  TRoles extends readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
>(userId: string, leadId: string): InferUserType<TRoles> {
  return { isPublic: false, id: userId, leadId } as InferUserType<TRoles>;
}

/**
 * Unified Auth Repository Interface with type-safe authentication
 * Extends BaseAuthHandler for shared logic
 */
export interface AuthRepository extends BaseAuthHandler {
  /**
   * Sign a JWT token
   */
  signJwt(
    payload: JwtPrivatePayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>>;

  /**
   * Verify a JWT token
   * Implements BaseAuthHandler.verifyToken
   */
  verifyJwt(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>>;

  /**
   * Alias for verifyJwt to match BaseAuthHandler interface
   */
  verifyToken(
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
    locale: CountryLanguage,
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
 * Extends BaseAuthHandler for shared logic
 */
class AuthRepositoryImpl extends BaseAuthHandler implements AuthRepository {
  private readonly secretKey: Uint8Array;

  constructor() {
    super();
    if (!env.JWT_SECRET_KEY) {
      this.secretKey = new TextEncoder().encode("fallback-dev-key-only");
    } else {
      this.secretKey = new TextEncoder().encode(env.JWT_SECRET_KEY);
    }
  }

  async getLeadIdFromDb(
    userId: string | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
    skipCookies = false,
  ): Promise<string> {
    if (userId) {
      return await this.getLeadIdForUser(userId, locale, logger, skipCookies);
    }
    return await this.getLeadIdForPublicUser(locale, logger, skipCookies);
  }

  async getPrimaryLeadId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string | null> {
    const [primaryUserLead] = await db
      .select()
      .from(userLeads)
      .where(and(eq(userLeads.userId, userId), eq(userLeads.isPrimary, true)))
      .limit(1);

    if (primaryUserLead) {
      return primaryUserLead.leadId;
    }

    const [anyUserLead] = await db
      .select()
      .from(userLeads)
      .where(eq(userLeads.userId, userId))
      .limit(1);

    return anyUserLead?.leadId || null;
  }

  async getAllLeadIds(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string[]> {
    const userLeadRecords = await db
      .select({ leadId: userLeads.leadId })
      .from(userLeads)
      .where(eq(userLeads.userId, userId));
    return userLeadRecords.map((record) => record.leadId);
  }

  /**
   * Validate user exists and session is active
   * Implements BaseAuthHandler.validateSession
   */
  async validateSession(
    token: string,
    userId: string,
    locale: CountryLanguage,
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

      const leadId = await this.getLeadIdFromDb(userId, locale, logger, true);
      return { isPublic: false, id: userId, leadId };
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorValidatingUserSession",
        parseError(error),
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
        parseError(error),
      );
      return [];
    }
  }

  /**
   * Get leadId for authenticated user
   * @param userId - User ID
   * @param locale - User locale for lead creation fallback
   * @param logger - Logger for debugging
   * @param skipCookies - Skip cookie reading (for CLI context)
   * @returns leadId
   */
  private async getLeadIdForUser(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    skipCookies = false,
  ): Promise<string> {
    try {
      // Get leadId from cookie (skip for CLI)
      let cookieLeadId: string | undefined;
      if (!skipCookies) {
        try {
          const cookieStore = await cookies();
          cookieLeadId = cookieStore.get("leadId")?.value;
        } catch (error) {
          // Cookies not available (e.g., CLI context)
          logger.debug(
            "app.api.v1.core.user.auth.debug.cookiesNotAvailable",
            parseError(error),
          );
        }
      }

      const [primaryUserLead] = await db
        .select()
        .from(userLeads)
        .where(and(eq(userLeads.userId, userId), eq(userLeads.isPrimary, true)))
        .limit(1);

      if (primaryUserLead) {
        return primaryUserLead.leadId;
      }

      const [anyUserLead] = await db
        .select()
        .from(userLeads)
        .where(eq(userLeads.userId, userId))
        .limit(1);

      if (anyUserLead) {
        return anyUserLead.leadId;
      }

      return await this.createLeadForUser(userId, locale, logger);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingLeadId",
        parseError(error),
      );
      return await this.createLeadForUser(userId, locale, logger);
    }
  }

  private async createLeadForUser(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const { language, country } = getLanguageAndCountryFromLocale(locale);
    const [newLead] = await db
      .insert(leads)
      .values({
        email: user.email,
        businessName: "",
        status: LeadStatus.SIGNED_UP,
        source: LeadSource.WEBSITE,
        country,
        language,
      })
      .returning();

    await db.insert(userLeads).values({
      userId,
      leadId: newLead.id,
      isPrimary: true,
    });

    logger.debug("Created lead for user", { userId, leadId: newLead.id });
    return newLead.id;
  }

  /**
   * Get leadId for public user
   * @param locale - Locale for lead creation
   * @param logger - Logger for debugging
   * @param skipCookies - Skip cookie reading (for CLI context)
   * @returns leadId
   */
  private async getLeadIdForPublicUser(
    locale: CountryLanguage,
    logger: EndpointLogger,
    skipCookies = false,
  ): Promise<string> {
    try {
      // Get leadId from cookie (skip for CLI)
      let cookieLeadId: string | undefined;
      if (!skipCookies) {
        try {
          const cookieStore = await cookies();
          cookieLeadId = cookieStore.get("leadId")?.value;
        } catch (error) {
          // Cookies not available (e.g., CLI context)
          logger.debug(
            "app.api.v1.core.user.auth.debug.cookiesNotAvailable",
            parseError(error),
          );
        }
      }

      // Get client info from headers
      const clientInfo = {
        userAgent: undefined,
        ipAddress: undefined,
        referer: undefined,
      };

      if (cookieLeadId) {
        const [existingLead] = await db
          .select()
          .from(leads)
          .where(eq(leads.id, cookieLeadId))
          .limit(1);

        if (existingLead) {
          return existingLead.id;
        }
      }

      const { language, country } = getLanguageAndCountryFromLocale(locale);
      const [newLead] = await db
        .insert(leads)
        .values({
          email: null,
          businessName: "",
          status: LeadStatus.NEW,
          source: LeadSource.WEBSITE,
          country,
          language,
        })
        .returning();

      logger.debug("Created public lead", { leadId: newLead.id });
      return newLead.id;
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingPublicLeadId",
        parseError(error),
      );
      throw error;
    }
  }

  /**
   * Authenticate user with role checking
   * @param userId - User ID
   * @param leadId - Lead ID
   * @param requiredRoles - Required roles
   * @param logger - Logger for debugging
   * @returns Authenticated user or public user
   */
  private async getAuthenticatedUserInternal<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    userId: string,
    leadId: string,
    requiredRoles: TRoles,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    // Customer role is allowed for any authenticated user
    if (requiredRoles.includes(UserRole.CUSTOMER)) {
      return createPrivateUser<TRoles>(userId, leadId);
    }

    // For other roles (ADMIN, etc.), check the user's roles
    try {
      const userRolesResponse = await userRolesRepository.findByUserId(
        userId,
        logger,
      );
      if (!userRolesResponse.success) {
        // If we can't get user roles, but PUBLIC is allowed, return public user
        if (requiredRoles.includes(UserRole.PUBLIC)) {
          return createPublicUser<TRoles>(leadId);
        }
        // Otherwise, return public user (will be rejected by endpoint handler)
        return createPublicUser<TRoles>(leadId);
      }

      // Check for required roles
      const hasRequiredRole = userRolesResponse.data.some((r) =>
        requiredRoles.some((requiredRole) => r.role === requiredRole),
      );

      if (hasRequiredRole) {
        return createPrivateUser<TRoles>(userId, leadId);
      }

      // User doesn't have required roles - if PUBLIC is allowed, return public user
      if (requiredRoles.includes(UserRole.PUBLIC)) {
        return createPublicUser<TRoles>(leadId);
      }

      // Otherwise, return public user (will be rejected by endpoint handler)
      return createPublicUser<TRoles>(leadId);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorCheckingUserAuth",
        parseError(error),
      );
      // If there's an error but PUBLIC is allowed, return public user
      if (requiredRoles.includes(UserRole.PUBLIC)) {
        return createPublicUser<TRoles>(leadId);
      }
      // Otherwise, return public user (will be rejected by endpoint handler)
      return createPublicUser<TRoles>(leadId);
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
        parseError(error),
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
        parseError(error),
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
      logger.error(
        "app.api.v1.core.user.auth.debug.errorSigningJwt",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.jwt_signing_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Verify a JWT token
   * Implements BaseAuthHandler.verifyToken
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
          "app.api.v1.core.user.auth.errors.invalid_token_signature",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Validate leadId is present
      if (!payload.leadId || typeof payload.leadId !== "string") {
        logger.debug("app.api.v1.core.user.auth.debug.invalidTokenPayload", {
          payload,
          reason: "missing_leadId",
        });
        return createErrorResponse(
          "app.api.v1.core.user.auth.errors.invalid_token_signature",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      logger.debug("app.api.v1.core.user.auth.debug.jwtVerifiedSuccessfully", {
        payload,
      });

      return createSuccessResponse({
        isPublic: false,
        id: payload.id,
        leadId: payload.leadId,
      });
    } catch (error) {
      logger.debug("app.api.v1.core.user.auth.debug.errorVerifyingJwt", {
        error: parseError(error),
      });
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.invalid_token_signature",
        ErrorResponseTypes.UNAUTHORIZED,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Alias for verifyJwt to match BaseAuthHandler interface
   */
  async verifyToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    return await this.verifyJwt(token, logger);
  }

  /**
   * Authenticate user based on context
   * Implements BaseAuthHandler.authenticate
   */
  async authenticate(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPayloadType>> {
    return await this.getCurrentUser(context, logger);
  }

  /**
   * Get current user with platform-aware handling
   */
  async getCurrentUser(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      // Locale is required
      if (!context.locale) {
        return createErrorResponse(
          "app.api.v1.core.user.auth.errors.missing_locale",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      if (!context.platform) {
        // Default to Next.js behavior for backward compatibility
        return await this.getCurrentUserNext(context.locale, logger);
      }

      switch (context.platform) {
        case "next":
          return await this.getCurrentUserNext(context.locale, logger);

        case "trpc":
        case "web":
          if (!context.request) {
            return createErrorResponse(
              "app.api.v1.core.user.auth.errors.missing_request_context",
              ErrorResponseTypes.INTERNAL_ERROR,
            );
          }
          return await this.getCurrentUserTrpc(
            context.request,
            context.locale,
            logger,
          );

        case "cli":
        case "ai":
        case "mcp":
        case "mobile":
          if (!context.token) {
            return createErrorResponse(
              "app.api.v1.core.user.auth.errors.missing_token",
              ErrorResponseTypes.UNAUTHORIZED,
            );
          }
          return await this.getCurrentUserCli(
            context.token,
            context.locale,
            logger,
          );

        default: {
          // Exhaustiveness check - TypeScript will error if a new platform is added but not handled
          context.platform satisfies never;
          return createErrorResponse(
            "app.api.v1.core.user.auth.errors.unsupported_platform",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }
      }
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorInUnifiedGetCurrentUser",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.session_retrieval_failed",
        ErrorResponseTypes.UNAUTHORIZED,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get current user from Next.js cookies
   * @param locale - Current locale from route context
   * @param logger - Logger for debugging
   * @returns ResponseType with the current user
   */
  private async getCurrentUserNext(
    locale: CountryLanguage,
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
          "app.api.v1.core.user.auth.errors.missing_token",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Verify the token
      const verifyResult = await this.verifyJwt(token, logger);
      if (!verifyResult.success) {
        return verifyResult;
      }

      const user = await this.validateSession(
        token,
        verifyResult.data.id,
        locale,
        logger,
      );
      if (!user) {
        // Clear invalid cookies
        cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
        cookieStore.delete(AUTH_STATUS_COOKIE_NAME);

        return createErrorResponse(
          "app.api.v1.core.user.auth.errors.invalid_session",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      return createSuccessResponse(user);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForNextjs",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.session_retrieval_failed",
        ErrorResponseTypes.UNAUTHORIZED,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get current user from tRPC request context
   * @param request - NextRequest from tRPC context
   * @param locale - Current locale from route context
   * @param logger - Logger for debugging
   * @returns ResponseType with the current user
   */
  private async getCurrentUserTrpc(
    request: NextRequest,
    locale: CountryLanguage,
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
          "app.api.v1.core.user.auth.errors.missing_token",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Verify the token
      const verifyResult = await this.verifyJwt(token, logger);
      if (!verifyResult.success) {
        return verifyResult;
      }

      const user = await this.validateSession(
        token,
        verifyResult.data.id,
        locale,
        logger,
      );
      if (!user) {
        return createErrorResponse(
          "app.api.v1.core.user.auth.errors.invalid_session",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      return createSuccessResponse(user);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForTrpc",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.session_retrieval_failed",
        ErrorResponseTypes.UNAUTHORIZED,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get current user from JWT token (CLI)
   * @param token - JWT token provided by CLI
   * @param locale - Current locale from route context
   * @param logger - Logger for debugging
   * @returns ResponseType with the current user
   */
  private async getCurrentUserCli(
    token: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      logger.debug(
        "app.api.v1.core.user.auth.debug.gettingCurrentUserFromToken",
      );

      if (!token) {
        return createErrorResponse(
          "app.api.v1.core.user.auth.errors.missing_token",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Verify the token
      const verifyResult = await this.verifyJwt(token, logger);
      if (!verifyResult.success) {
        return verifyResult;
      }

      const user = await this.validateSession(
        token,
        verifyResult.data.id,
        locale,
        logger,
      );
      if (!user) {
        return createErrorResponse(
          "app.api.v1.core.user.auth.errors.invalid_session",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      return createSuccessResponse(user);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingCurrentUserFromCli",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.session_retrieval_failed",
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
      // Locale is required for lead creation
      if (!context.locale) {
        logger.error("app.api.v1.core.user.auth.debug.missingLocaleInContext");
        // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
        throw new Error("Locale is required in AuthContext for lead creation");
      }

      if (!context.platform) {
        // Default to Next.js behavior for backward compatibility
        return await this.getAuthMinimalUserNext<TRoles>(
          roles,
          context.locale,
          logger,
        );
      }

      switch (context.platform) {
        case "next":
          return await this.getAuthMinimalUserNext(
            roles,
            context.locale,
            logger,
          );

        case "trpc":
        case "web":
          if (!context.request) {
            logger.error(
              "app.api.v1.core.user.auth.debug.missingRequestContextForTrpc",
            );
            return { isPublic: true } as InferUserType<TRoles>;
          }
          return await this.getAuthMinimalUserTrpc(
            context.request,
            roles,
            context.locale,
            logger,
          );

        case "cli":
        case "ai":
        case "mcp":
        case "mobile":
          if (context.jwtPayload) {
            // Direct payload authentication
            // Ensure payload is private (has id and isPublic: false)
            if (context.jwtPayload.isPublic) {
              logger.error(
                "app.api.v1.core.user.auth.debug.publicPayloadNotSupportedForCli",
              );
              return throwErrorResponse(
                "app.api.v1.core.user.auth.errors.publicPayloadNotSupported",
                ErrorResponseTypes.UNAUTHORIZED,
              );
            }
            // TypeScript now knows this is JwtPrivatePayloadType after the check
            return await this.authenticateWithPayload<TRoles>(
              context.jwtPayload,
              roles,
              context.locale,
              logger,
            );
          } else if (context.token) {
            // Token-based authentication
            return await this.getAuthMinimalUserCli<TRoles>(
              context.token,
              roles,
              context.locale,
              logger,
            );
          } else {
            logger.error(
              "app.api.v1.core.user.auth.debug.missingTokenOrPayloadForCli",
            );
            const leadId = await this.getLeadIdForPublicUser(
              context.locale,
              logger,
            );
            return createPublicUser<TRoles>(leadId);
          }

        default: {
          const _exhaustiveCheck: never = context.platform;
          logger.error(
            "app.api.v1.core.user.auth.debug.unsupportedPlatformForAuth",
            {
              platform: _exhaustiveCheck,
            },
          );
          return { isPublic: true } as InferUserType<TRoles>;
        }
      }
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorInUnifiedGetAuthMinimalUser",
        parseError(error),
      );
      return { isPublic: true } as InferUserType<TRoles>;
    }
  }

  /**
   * Get authenticated user with role checking for Next.js
   * @param roles - Required roles
   * @param locale - Locale for lead creation
   * @param logger - Logger for debugging
   * @returns Authenticated user
   */
  private async getAuthMinimalUserNext<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    roles: TRoles,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      logger.info(
        "app.api.v1.core.user.auth.debug.getAuthMinimalUserNext.start",
      );

      // First, try to get authenticated user from cookies
      const userResult = await this.getCurrentUserNext(locale, logger);

      // If user is authenticated, proceed with authenticated user flow
      if (
        userResult.success &&
        userResult.data?.id &&
        !userResult.data.isPublic
      ) {
        logger.info(
          "app.api.v1.core.user.auth.debug.getAuthMinimalUserNext.authenticated",
        );

        // Get leadId for authenticated user
        const leadId = await this.getLeadIdForUser(
          userResult.data.id,
          locale,
          logger,
        );

        logger.info(
          "app.api.v1.core.user.auth.debug.getAuthMinimalUserNext.returningAuth",
          {
            userId: userResult.data.id,
            leadId,
          },
        );

        // Use internal method to check authentication with roles
        return await this.getAuthenticatedUserInternal<TRoles>(
          userResult.data.id,
          leadId,
          roles,
          logger,
        );
      }

      // User is not authenticated - check if PUBLIC role is allowed
      if (roles.includes(UserRole.PUBLIC)) {
        // Get leadId for public user
        const leadId = await this.getLeadIdForPublicUser(locale, logger);
        return createPublicUser<TRoles>(leadId);
      }

      // User not authenticated and PUBLIC role not allowed - return public user
      // (will be rejected by role check in getAuthenticatedUserInternal)
      const leadId = await this.getLeadIdForPublicUser(locale, logger);
      logger.info(
        "app.api.v1.core.user.auth.debug.getAuthMinimalUserNext.returningPublic",
        {
          leadId,
        },
      );
      return createPublicUser<TRoles>(leadId);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForNextjs",
        parseError(error),
      );
      // Fallback to public user with leadId if PUBLIC role is allowed
      if (roles.includes(UserRole.PUBLIC)) {
        const leadId = await this.getLeadIdForPublicUser(locale, logger);
        return createPublicUser<TRoles>(leadId);
      }
      // Otherwise, return public user (will be rejected by role check)
      const leadId = await this.getLeadIdForPublicUser(locale, logger);
      return createPublicUser<TRoles>(leadId);
    }
  }

  /**
   * Get authenticated user with role checking for tRPC
   * @param request - NextRequest from tRPC context
   * @param roles - Required roles
   * @param locale - Locale for lead creation
   * @param logger - Logger for debugging
   * @returns Authenticated user
   */
  private async getAuthMinimalUserTrpc<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    request: NextRequest,
    roles: TRoles,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      // First, try to get authenticated user from request
      const userResult = await this.getCurrentUserTrpc(request, locale, logger);

      // If user is authenticated, proceed with authenticated user flow
      if (
        userResult.success &&
        userResult.data?.id &&
        !userResult.data.isPublic
      ) {
        // Get leadId for authenticated user
        const leadId = await this.getLeadIdForUser(
          userResult.data.id,
          locale,
          logger,
        );

        // Use internal method to check authentication with roles
        return await this.getAuthenticatedUserInternal<TRoles>(
          userResult.data.id,
          leadId,
          roles,
          logger,
        );
      }

      // User is not authenticated - check if PUBLIC role is allowed
      if (roles.includes(UserRole.PUBLIC)) {
        // Get leadId for public user
        const leadId = await this.getLeadIdForPublicUser(locale, logger);
        return createPublicUser<TRoles>(leadId);
      }

      // User not authenticated and PUBLIC role not allowed - return public user
      // (will be rejected by role check in getAuthenticatedUserInternal)
      const leadId = await this.getLeadIdForPublicUser(locale, logger);
      return createPublicUser<TRoles>(leadId);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForTrpc",
        parseError(error),
      );
      // Fallback to public user with leadId if PUBLIC role is allowed
      if (roles.includes(UserRole.PUBLIC)) {
        const leadId = await this.getLeadIdForPublicUser(locale, logger);
        return createPublicUser<TRoles>(leadId);
      }
      // Otherwise, return public user (will be rejected by role check)
      const leadId = await this.getLeadIdForPublicUser(locale, logger);
      return createPublicUser<TRoles>(leadId);
    }
  }

  /**
   * Get authenticated user with role checking for CLI
   * @param token - JWT token provided by CLI
   * @param roles - Required roles
   * @param locale - Locale for lead creation
   * @param logger - Logger for debugging
   * @returns Authenticated user
   */
  private async getAuthMinimalUserCli<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    token: string,
    roles: TRoles,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      // First, try to get authenticated user from token
      const userResult = await this.getCurrentUserCli(token, locale, logger);

      // If user is authenticated, proceed with authenticated user flow
      if (
        userResult.success &&
        userResult.data?.id &&
        !userResult.data.isPublic
      ) {
        // Get leadId for authenticated user (skip cookies for CLI)
        const leadId = await this.getLeadIdForUser(
          userResult.data.id,
          locale,
          logger,
          true,
        );

        // Use internal method to check authentication with roles
        return await this.getAuthenticatedUserInternal(
          userResult.data.id,
          leadId,
          roles,
          logger,
        );
      }

      // User is not authenticated - check if PUBLIC role is allowed
      if (roles.includes(UserRole.PUBLIC) || roles.length === 0) {
        // Get leadId for public user (skip cookies for CLI)
        const leadId = await this.getLeadIdForPublicUser(locale, logger, true);
        return createPublicUser<TRoles>(leadId);
      }

      // User not authenticated and PUBLIC role not allowed - return public user
      // (will be rejected by role check in getAuthenticatedUserInternal)
      const leadId = await this.getLeadIdForPublicUser(locale, logger, true);
      return createPublicUser<TRoles>(leadId);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingAuthUserForCli",
        parseError(error),
      );
      // Fallback to public user with leadId if PUBLIC role is allowed
      if (roles.includes(UserRole.PUBLIC) || roles.length === 0) {
        const leadId = await this.getLeadIdForPublicUser(locale, logger, true);
        return createPublicUser<TRoles>(leadId);
      }
      // Otherwise, return public user (will be rejected by role check)
      const leadId = await this.getLeadIdForPublicUser(locale, logger, true);
      return createPublicUser<TRoles>(leadId);
    }
  }

  /**
   * Authenticate user with JWT payload directly
   * Used when CLI provides a pre-validated JWT payload
   * @param jwtPayload - Pre-validated JWT payload
   * @param roles - Required roles
   * @param locale - Locale for lead creation
   * @param logger - Logger for debugging
   * @returns Authenticated user
   */
  private async authenticateWithPayload<
    TRoles extends
      readonly (typeof UserRoleValue)[keyof typeof UserRoleValue][],
  >(
    jwtPayload: JwtPrivatePayloadType,
    roles: TRoles,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      logger.debug(
        "app.api.v1.core.user.auth.debug.authenticatingCliUserWithPayload",
        {
          userId: jwtPayload.id,
          isPublic: jwtPayload.isPublic,
          leadId: jwtPayload.leadId,
        },
      );

      // Public role is always allowed, or if no roles specified (empty array means public)
      if (roles.includes(UserRole.PUBLIC) || roles.length === 0) {
        // Use leadId from payload (always present)
        return createPublicUser<TRoles>(jwtPayload.leadId);
      }

      // Check if user is public
      if (jwtPayload.isPublic || !jwtPayload.id) {
        // Use leadId from payload (always present)
        return createPublicUser<TRoles>(jwtPayload.leadId);
      }

      // Use leadId from payload (always present)
      const leadId = jwtPayload.leadId;

      // Use internal method to check authentication with roles
      return await this.getAuthenticatedUserInternal(
        jwtPayload.id,
        leadId,
        roles,
        logger,
      );
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorAuthenticatingCliUserWithPayload",
        parseError(error),
      );
      const leadId = await this.getLeadIdForPublicUser(locale, logger, true);
      return createPublicUser<TRoles>(leadId);
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
      // Locale is required for lead creation
      if (!context.locale) {
        logger.error("app.api.v1.core.user.auth.debug.missingLocaleInContext");
        return [];
      }

      if (!context.platform) {
        // Default behavior - try to get user and return roles
        const user = await this.getAuthMinimalUserNext(
          requiredRoles,
          context.locale,
          logger,
        );
        return user && !user.isPublic
          ? await this.getUserRolesInternal(user.id, requiredRoles, logger)
          : [];
      }

      switch (context.platform) {
        case "next": {
          const nextUser = await this.getAuthMinimalUserNext(
            requiredRoles,
            context.locale,
            logger,
          );
          return nextUser && !nextUser.isPublic
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
        parseError(error),
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
      // Get user from request (locale not needed for role check only)
      const userResult = await this.getCurrentUserTrpc(
        request,
        "en-GLOBAL",
        logger,
      );
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
        parseError(error),
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
      // Get user from token (locale not needed for role check only)
      const userResult = await this.getCurrentUserCli(
        token,
        "en-GLOBAL",
        logger,
      );
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
        parseError(error),
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
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.cookie_set_failed",
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
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.cookie_clear_failed",
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
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    try {
      logger.debug("app.api.v1.core.user.auth.debug.creatingCliToken", {
        userId,
      });

      const leadIdResult = await leadAuthService.getAuthenticatedUserLeadId(
        userId,
        undefined,
        locale,
        logger,
      );

      const payload: JwtPrivatePayloadType = {
        isPublic: false,
        id: userId,
        leadId: leadIdResult.leadId,
      };

      return await this.signJwt(payload, logger);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorCreatingCliToken",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.user.auth.errors.jwt_signing_failed",
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
        parseError(error),
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
        "app.api.v1.core.user.auth.errors.jwt_payload_missing_id",
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
      redirect(`/${locale}/`);
    }

    return user;
  }
}

// Singleton instance
export const authRepository = new AuthRepositoryImpl();
