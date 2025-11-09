/**
 * Unified Auth Repository
 * Provides platform-aware authentication interface with type-safe user inference
 * Contains all authentication business logic in compliance with repository-first architecture
 */
import "server-only";

import { and, eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import {
  AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS,
  AUTH_TOKEN_COOKIE_NAME,
} from "@/config/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
  throwErrorResponse,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { leadAuthRepository } from "../../leads/auth/repository";
import { leads, userLeads } from "../../leads/db";
import { LeadSource, LeadStatus } from "../../leads/enum";
import { db } from "../../system/db";
import { detectPlatformFromRequest } from "../../system/unified-interface/shared/auth/platform-detection";
import {
  type AuthContext,
  type AuthPlatform,
} from "../../system/unified-interface/shared/server-only/auth/base-auth-handler";
import { getPlatformAuthHandler } from "../../system/unified-interface/shared/server-only/auth/factory";
import { users } from "../db";
import { UserDetailLevel } from "../enum";
import { sessionRepository } from "../private/session/repository";
import { userRepository } from "../repository";
import type { CompleteUserType } from "../types";
import type { UserRoleValue } from "../user-roles/enum";
import { UserRole } from "../user-roles/enum";
import { userRolesRepository } from "../user-roles/repository";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "./types";

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
 * Platform-agnostic authentication business logic
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
   * Store authentication token using platform-specific handler
   * Automatically detects platform from request context
   */
  storeAuthTokenForPlatform(
    token: string,
    userId: string,
    leadId: string,
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  /**
   * Clear authentication token using platform-specific handler
   * Automatically detects platform from request context
   */
  clearAuthTokenForPlatform(
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

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
 * Platform-agnostic - delegates to platform handlers for storage
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
   * Get leadId from database (platform-agnostic)
   * Note: This method should not access cookies directly - platform handlers manage storage
   */
  async getLeadIdFromDb(
    userId: string | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string | null> {
    if (userId) {
      return await this.getLeadIdForUser(userId, locale, logger);
    }

    // For public users, use the platform handler to check cookies first
    // This prevents creating duplicate leads on every page load
    const { cookies } = await import("next/headers");
    const { LEAD_ID_COOKIE_NAME } = await import("@/config/constants");
    const cookieStore = await cookies();
    const existingLeadId = cookieStore.get(LEAD_ID_COOKIE_NAME)?.value;

    // Use leadAuthRepository to validate and reuse existing leadId
    const { leadAuthRepository } = await import("../../leads/auth/repository");

    if (existingLeadId) {
      const isValid = await leadAuthRepository.validateLeadId(
        existingLeadId,
        locale,
        logger,
      );
      if (isValid) {
        logger.debug("Reusing existing leadId from cookie for public user", {
          leadId: existingLeadId,
        });
        return existingLeadId;
      }
      logger.debug("Invalid leadId in cookie, creating new one", {
        invalidLeadId: existingLeadId,
      });
    }

    // No valid leadId in cookie, create a new one
    return await this.getLeadIdForPublicUser(locale, logger);
  }

  async getPrimaryLeadId(userId: string): Promise<string | null> {
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

  async getAllLeadIds(userId: string): Promise<string[]> {
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

      const leadId = await this.getLeadIdFromDb(userId, locale, logger);
      if (!leadId) {
        logger.error("Failed to get or create lead for user", { userId });
        return null;
      }
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
   * Get leadId for authenticated user (platform-agnostic)
   * @param userId - User ID
   * @param locale - User locale for lead creation fallback
   * @param logger - Logger for debugging
   * @returns leadId
   */
  private async getLeadIdForUser(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      // Get primary lead for user
      const [primaryUserLead] = await db
        .select()
        .from(userLeads)
        .where(and(eq(userLeads.userId, userId), eq(userLeads.isPrimary, true)))
        .limit(1);

      if (primaryUserLead) {
        return primaryUserLead.leadId;
      }

      // Fallback to any lead for user
      const [anyUserLead] = await db
        .select()
        .from(userLeads)
        .where(eq(userLeads.userId, userId))
        .limit(1);

      if (anyUserLead) {
        return anyUserLead.leadId;
      }

      // Create new lead if none exists
      return await this.createLeadForUser(userId, locale, logger);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingLeadId",
        parseError(error),
      );
      // Try to create lead as fallback
      return await this.createLeadForUser(userId, locale, logger);
    }
  }

  private async createLeadForUser(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string | null> {
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      logger.error("User not found when creating lead", { userId });
      return null;
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
   * Get leadId for public user (platform-agnostic)
   * Creates a new anonymous lead in the database
   * @param locale - Locale for lead creation
   * @param logger - Logger for debugging
   * @returns leadId or null if creation fails
   */
  private async getLeadIdForPublicUser(
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string | null> {
    try {
      // Always create a new lead for public users
      // Platform handlers are responsible for checking/storing lead IDs
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
      return null;
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
    // Check if endpoint only allows PUBLIC role (no authenticated users allowed)
    const onlyPublicAllowed =
      requiredRoles.length === 1 && requiredRoles.includes(UserRole.PUBLIC);

    if (onlyPublicAllowed) {
      // Endpoint only allows public users - authenticated users should not access this
      logger.debug(
        "Endpoint only allows PUBLIC role, rejecting authenticated user",
        {
          userId,
          leadId,
          requiredRoles: [...requiredRoles] as string[],
        },
      );
      return createPublicUser<TRoles>(leadId);
    }

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
        // If we can't get user roles, but the user is authenticated,
        // treat them as a CUSTOMER (all authenticated users have CUSTOMER role)
        logger.warn("app.api.v1.core.user.auth.debug.failedToGetUserRoles", {
          userId,
          leadId,
        });
        // If CUSTOMER role is in required roles, return authenticated user
        if (requiredRoles.includes(UserRole.CUSTOMER)) {
          return createPrivateUser<TRoles>(userId, leadId);
        }
        // If PUBLIC role is in required roles (mixed with other roles), return authenticated user
        // (authenticated users can access PUBLIC endpoints when mixed with other roles)
        if (requiredRoles.includes(UserRole.PUBLIC)) {
          return createPrivateUser<TRoles>(userId, leadId);
        }
        // Otherwise, user doesn't have required roles
        logger.error(
          "app.api.v1.core.user.auth.debug.userDoesNotHaveRequiredRoles",
          {
            userId,
            leadId,
            requiredRoles: [...requiredRoles] as string[],
          },
        );
        return createPublicUser<TRoles>(leadId);
      }

      // Check for required roles
      const hasRequiredRole = userRolesResponse.data.some((r) =>
        requiredRoles.some((requiredRole) => r.role === requiredRole),
      );

      if (hasRequiredRole) {
        return createPrivateUser<TRoles>(userId, leadId);
      }

      // User doesn't have required roles
      // If CUSTOMER role is in required roles, we already handled it above
      // If PUBLIC role is in required roles (mixed with other roles), the user is still authenticated
      // so we should return the authenticated user, not downgrade to public
      if (requiredRoles.includes(UserRole.PUBLIC)) {
        // User is authenticated but doesn't have the specific role
        // However, since PUBLIC is allowed (mixed with other roles), we can return the authenticated user
        // as they have at least CUSTOMER role (all authenticated users have CUSTOMER)
        return createPrivateUser<TRoles>(userId, leadId);
      }

      // User doesn't have required roles and PUBLIC is not allowed
      logger.error(
        "app.api.v1.core.user.auth.debug.userDoesNotHaveRequiredRoles",
        {
          userId,
          leadId,
          requiredRoles: [...requiredRoles] as string[],
          userRoles: userRolesResponse.data.map((r) => r.role),
        },
      );
      return createPublicUser<TRoles>(leadId);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorCheckingUserAuth",
        parseError(error),
      );
      // If there's an error but PUBLIC is allowed (mixed with other roles), return authenticated user
      if (requiredRoles.includes(UserRole.PUBLIC)) {
        return createPrivateUser<TRoles>(userId, leadId);
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
      return success(token);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorSigningJwt",
        parseError(error),
      );
      return fail({
        message: "app.api.v1.core.user.auth.errors.jwt_signing_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
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
        logger.debug("app.api.v1.core.user.auth.debug.invalidTokenPayload");
        return fail({
          message: "app.api.v1.core.user.auth.errors.invalid_token_signature",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Validate leadId is present
      if (!payload.leadId || typeof payload.leadId !== "string") {
        logger.debug("app.api.v1.core.user.auth.debug.invalidTokenPayload");
        return fail({
          message: "app.api.v1.core.user.auth.errors.invalid_token_signature",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("app.api.v1.core.user.auth.debug.jwtVerifiedSuccessfully");

      return success({
        isPublic: false,
        id: payload.id,
        leadId: payload.leadId,
      });
    } catch (error) {
      logger.debug("app.api.v1.core.user.auth.debug.errorVerifyingJwt", {
        error: parseError(error),
      });
      return fail({
        message: "app.api.v1.core.user.auth.errors.invalid_token_signature",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: { error: parseError(error).message },
      });
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
   * Delegates to platform handlers for authentication
   */
  async getCurrentUser(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      // Locale is required
      if (!context.locale) {
        return fail({
          message: "app.api.v1.core.user.auth.errors.missing_locale",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Default to Next.js platform for backward compatibility
      const platform = context.platform || "next";

      // Get platform-specific auth handler
      const authHandler = getPlatformAuthHandler(platform);

      // Authenticate using platform handler
      const authResult = await authHandler.authenticate(context, logger);

      if (!authResult.success) {
        return fail({
          message: "app.api.v1.core.user.auth.errors.authentication_failed",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: { error: authResult.message },
          cause: authResult,
        });
      }

      const jwtPayload = authResult.data;

      // Ensure we have a private user (not public)
      if (jwtPayload.isPublic) {
        return fail({
          message: "app.api.v1.core.user.auth.errors.user_not_authenticated",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      return success(jwtPayload);
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorInUnifiedGetCurrentUser",
        parseError(error),
      );
      return fail({
        message: "app.api.v1.core.user.auth.errors.session_retrieval_failed",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: { error: parseError(error).message },
      });
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
      // Get platform-specific auth handler
      const authHandler = getPlatformAuthHandler(context.platform);

      // Authenticate using platform handler
      const authResult = await authHandler.authenticate(context, logger);

      if (!authResult.success) {
        logger.error("Platform authentication failed", {
          platform: context.platform,
          error: authResult.message,
        });
        const leadId = await authHandler.getLeadIdFromDb(
          undefined,
          context.locale,
          logger,
        );
        if (!leadId) {
          logger.error("Failed to get lead ID for public user");
          return throwErrorResponse(
            "app.api.v1.core.user.auth.errors.session_retrieval_failed",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }
        return createPublicUser<TRoles>(leadId);
      }

      const jwtPayload = authResult.data;

      // If public user, return immediately if PUBLIC role is allowed
      if (jwtPayload.isPublic) {
        if (roles.includes(UserRole.PUBLIC as TRoles[number])) {
          return jwtPayload as InferUserType<TRoles>;
        }
        logger.debug("Public user not allowed for this endpoint", {
          roles: JSON.stringify(roles),
        });
        return throwErrorResponse(
          "app.api.v1.core.user.auth.errors.publicUserNotAllowed",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Authenticate with payload for private users
      return await this.authenticateWithPayload<TRoles>(
        jwtPayload,
        roles,
        context.locale,
        logger,
      );
    } catch (error) {
      logger.debug(
        "app.api.v1.core.user.auth.debug.errorInUnifiedGetAuthMinimalUser",
        parseError(error),
      );
      const platform = context.platform || "next";
      const authHandler = getPlatformAuthHandler(platform);
      const leadId = await authHandler.getLeadIdFromDb(
        undefined,
        context.locale,
        logger,
      );
      if (!leadId) {
        logger.error("Failed to get lead ID for public user");
        return throwErrorResponse(
          "app.api.v1.core.user.auth.errors.session_retrieval_failed",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }
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

      // This method is only called for private users (isPublic: false)
      // If somehow a public user reaches here, it's an error
      if (jwtPayload.isPublic || !jwtPayload.id) {
        logger.error(
          "app.api.v1.core.user.auth.debug.publicUserInPrivateAuthMethod",
          {
            isPublic: jwtPayload.isPublic,
            hasId: !!jwtPayload.id,
          },
        );
        // Use leadId from payload (always present)
        return createPublicUser<TRoles>(jwtPayload.leadId);
      }

      // Use leadId from payload (always present)
      const leadId = jwtPayload.leadId;

      // TypeScript narrowing: we've already checked !jwtPayload.id above
      const userId = jwtPayload.id;
      if (!userId) {
        // This should never happen due to check above, but satisfies TypeScript
        return createPublicUser<TRoles>(leadId);
      }

      // Use internal method to check authentication with roles
      return await this.getAuthenticatedUserInternal(
        userId,
        leadId,
        roles,
        logger,
      );
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorAuthenticatingCliUserWithPayload",
        parseError(error),
      );
      const leadId = await this.getLeadIdForPublicUser(locale, logger);
      if (!leadId) {
        // Try to use leadId from payload as last resort
        if (jwtPayload.leadId) {
          logger.warn("Using leadId from JWT payload as fallback", {
            leadId: jwtPayload.leadId,
          });
          return createPublicUser<TRoles>(jwtPayload.leadId);
        }
        logger.error(
          "Failed to create public lead and no payload leadId available",
        );
        return throwErrorResponse(
          "app.api.v1.core.user.auth.errors.session_retrieval_failed",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }
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
    // Don't spread roles - preserve readonly tuple type for proper type inference
    const user = await this.getAuthMinimalUser(roles, context, logger);
    return user as InferUserType<TRoles> | null;
  }

  /**
   * Get user roles (platform-aware)
   * Delegates to platform handlers for authentication
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

      // Get user using platform handler
      const user = await this.getAuthMinimalUser(
        requiredRoles,
        context,
        logger,
      );

      // Return roles for authenticated users
      if (user && !user.isPublic) {
        return await this.getUserRolesInternal(user.id, requiredRoles, logger);
      }

      return [];
    } catch (error) {
      logger.error(
        "app.api.v1.core.user.auth.debug.errorGettingUserRoles",
        parseError(error),
      );
      return [];
    }
  }

  /**
   * Store authentication token using platform-specific handler
   * Automatically detects platform from request context
   */
  async storeAuthTokenForPlatform(
    token: string,
    userId: string,
    leadId: string,
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      // Determine platform from request
      const platform = detectPlatformFromRequest(request);
      logger.debug("Storing auth token for platform", { platform, userId });

      // Get platform-specific handler
      const handler = getPlatformAuthHandler(platform);

      // Delegate to platform handler
      return await handler.storeAuthToken(token, userId, leadId, logger);
    } catch (error) {
      logger.error("Error storing auth token for platform", parseError(error));
      return fail({
        message: "app.api.v1.core.user.auth.errors.cookie_set_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Clear authentication token using platform-specific handler
   * Automatically detects platform from request context
   */
  async clearAuthTokenForPlatform(
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      // Determine platform from request
      const platform = detectPlatformFromRequest(request);
      logger.debug("Clearing auth token for platform", { platform });

      // Get platform-specific handler
      const handler = getPlatformAuthHandler(platform);

      // Delegate to platform handler
      return await handler.clearAuthToken(logger);
    } catch (error) {
      logger.error("Error clearing auth token for platform", parseError(error));
      return fail({
        message: "app.api.v1.core.user.auth.errors.cookie_clear_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
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

      const leadIdResult = await leadAuthRepository.getAuthenticatedUserLeadId(
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
      return fail({
        message: "app.api.v1.core.user.auth.errors.jwt_signing_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
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
    if (
      !payload.isPublic &&
      "id" in payload &&
      typeof payload.id === "string"
    ) {
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
      locale,
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
