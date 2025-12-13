/**
 * Unified Auth Repository
 * Provides platform-aware authentication interface with type-safe user inference
 * Contains all authentication business logic in compliance with repository-first architecture
 */
import "server-only";

import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { redirect } from "next-vibe-ui/lib/redirect";
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

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { leadAuthRepository } from "../../leads/auth/repository";
import { leads, userLeadLinks } from "../../leads/db";
import { LeadSource, LeadStatus } from "../../leads/enum";
import { db } from "../../system/db";
import { type AuthContext } from "../../system/unified-interface/shared/server-only/auth/base-auth-handler";
import { getPlatformAuthHandler } from "../../system/unified-interface/shared/server-only/auth/factory";
import { Platform } from "../../system/unified-interface/shared/types/platform";
import { users } from "../db";
import { UserDetailLevel } from "../enum";
import { sessionRepository } from "../private/session/repository";
import { userRepository } from "../repository";
import type { CompleteUserType } from "../types";
import type { UserRoleValue } from "../user-roles/enum";
import {
  UserRole,
  UserPermissionRole,
  filterUserPermissionRoles,
} from "../user-roles/enum";
import { userRolesRepository } from "../user-roles/repository";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "./types";

export type InferUserType<TRoles extends readonly UserRoleValue[]> =
  Exclude<TRoles[number], "PUBLIC"> extends never
    ? JWTPublicPayloadType
    : Extract<TRoles[number], "PUBLIC"> extends never
      ? JwtPrivatePayloadType
      : JwtPayloadType;

/**
 * Helper to create public user payload
 */
function createPublicUser<TRoles extends readonly UserRoleValue[]>(
  leadId: string,
): InferUserType<TRoles> {
  return {
    isPublic: true,
    leadId,
    roles: [UserPermissionRole.PUBLIC],
  } as InferUserType<TRoles>;
}

/**
 * Helper to create private user payload
 * Note: This is a helper for creating payload structure - roles should be fetched from DB
 */
function createPrivateUser<TRoles extends readonly UserRoleValue[]>(
  userId: string,
  leadId: string,
  roles: (typeof UserPermissionRole)[keyof typeof UserPermissionRole][],
): InferUserType<TRoles> {
  return {
    isPublic: false,
    id: userId,
    leadId,
    roles,
  } as InferUserType<TRoles>;
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
  getAuthMinimalUser<TRoles extends readonly UserRoleValue[]>(
    roles: TRoles,
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>>;

  /**
   * Get user roles (platform-aware)
   */
  getUserRoles(
    requiredRoles: readonly UserRoleValue[],
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<UserRoleValue[]>;

  /**
   * Store authentication token using platform-specific handler
   * Automatically detects platform from request context
   */
  storeAuthTokenForPlatform(
    token: string,
    userId: string,
    leadId: string,
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  /**
   * Clear authentication token using platform-specific handler
   */
  clearAuthTokenForPlatform(
    platform: Platform,
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

  /**
   * Authenticate user by email (for CLI authentication)
   * Returns JWT payload for authenticated user
   */
  authenticateUserByEmail(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>>;
}

/**
 * Unified Auth Repository Implementation
 * Contains all authentication business logic consolidated from handlers and core
 * Platform-agnostic - delegates to platform handlers for storage
 */
class AuthRepositoryImpl implements AuthRepository {
  private readonly secretKey: Uint8Array = new TextEncoder().encode(
    env.JWT_SECRET_KEY,
  );

  /**
   * Get leadId from database (platform-agnostic)
   * Note: This method should not access cookies directly - platform handlers manage storage
   */
  private async getLeadIdFromDb(
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
    const [userLeadLink] = await db
      .select()
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, userId))
      .limit(1);

    return userLeadLink?.leadId || null;
  }

  async getAllLeadIds(userId: string): Promise<string[]> {
    const userLeadRecords = await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, userId));
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
        logger.debug("app.api.user.auth.debug.userIdNotExistsInDb", {
          userId,
        });
        return null;
      }

      // Validate that the session exists in the database
      const sessionResponse = await sessionRepository.findByToken(token);
      if (!sessionResponse.success) {
        logger.debug("app.api.user.auth.debug.sessionNotFound", {
          userId,
          tokenExists: false,
        });
        return null;
      }

      // Check if session is expired
      const session = sessionResponse.data;
      if (session.expiresAt < new Date()) {
        logger.debug("app.api.user.auth.debug.sessionExpired", {
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

      // Fetch user roles
      const userRolesResponse = await userRolesRepository.findByUserId(
        userId,
        logger,
      );
      const roles = userRolesResponse.success
        ? userRolesResponse.data.map((r) => r.role)
        : [];

      return { isPublic: false, id: userId, leadId, roles };
    } catch (error) {
      logger.error(
        "app.api.user.auth.debug.errorValidatingUserSession",
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
    requiredRoles: readonly UserRoleValue[],
    logger: EndpointLogger,
  ): Promise<UserRoleValue[]> {
    try {
      const roles: UserRoleValue[] = [];

      // Customer role is allowed for any authenticated user
      if (requiredRoles.includes(UserRole.CUSTOMER)) {
        roles.push(UserRole.CUSTOMER);
      }

      // Check for other roles in database (e.g., ADMIN, MODERATOR)
      const userRolesResponse = await userRolesRepository.findByUserId(
        userId,
        logger,
      );
      if (userRolesResponse.success) {
        const dbRoles = userRolesResponse.data
          .map((r) => r.role)
          .filter((role) => requiredRoles.includes(role)) as UserRoleValue[];
        for (const role of dbRoles) {
          // Avoid duplicates
          if (!roles.includes(role)) {
            roles.push(role);
          }
        }
      }

      // If user has actual roles, return them (even if PUBLIC is in requiredRoles)
      // This ensures admin users get their ADMIN role, not PUBLIC
      if (roles.length > 0) {
        logger.debug("Returning user's actual roles", {
          userId,
          roles: roles as string[],
          requiredRoles: [...requiredRoles] as string[],
        });
        return roles;
      }

      // Only return PUBLIC role if user has no other roles
      // (This shouldn't happen for authenticated users, but handle gracefully)
      if (requiredRoles.includes(UserRole.PUBLIC)) {
        logger.debug(
          "User has no roles in database, returning PUBLIC as fallback",
          {
            userId,
            requiredRoles: [...requiredRoles] as string[],
          },
        );
        return [UserRole.PUBLIC];
      }

      return roles;
    } catch (error) {
      logger.error(
        "app.api.user.auth.debug.errorGettingUserRoles",
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
      // With wallet-based system, no isPrimary - just get any linked lead
      const [userLeadLink] = await db
        .select()
        .from(userLeadLinks)
        .where(eq(userLeadLinks.userId, userId))
        .limit(1);

      if (userLeadLink) {
        return userLeadLink.leadId;
      }

      // Create new lead if none exists
      return await this.createLeadForUser(userId, locale, logger);
    } catch (error) {
      logger.error(
        "app.api.user.auth.debug.errorGettingLeadId",
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

    // Check if a lead already exists with this email
    const [existingLead] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.email, user.email))
      .limit(1);

    if (existingLead) {
      logger.debug("Lead already exists for user email, linking it", {
        userId,
        leadId: existingLead.id,
        email: user.email,
      });

      // Link existing lead to user (use onConflictDoNothing to handle race conditions)
      await db
        .insert(userLeadLinks)
        .values({
          userId,
          leadId: existingLead.id,
          linkReason: "login",
        })
        .onConflictDoNothing();

      return existingLead.id;
    }

    // Create new lead with user email
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

    await db
      .insert(userLeadLinks)
      .values({
        userId,
        leadId: newLead.id,
        linkReason: "signup",
      })
      .onConflictDoNothing();

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
  ): Promise<string> {
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
        "app.api.user.auth.debug.errorGettingPublicLeadId",
        parseError(error),
      );
      throwErrorResponse(
        "app.api.user.auth.errors.failed_to_create_lead",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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
    TRoles extends readonly UserRoleValue[],
  >(
    userId: string,
    leadId: string,
    requiredRoles: TRoles,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    // Filter to get only actual permission roles (not platform markers)
    const permissionRoles = filterUserPermissionRoles(requiredRoles);

    // If no permission roles after filtering, allow any authenticated user
    if (permissionRoles.length === 0) {
      logger.debug(
        "No permission roles required (only platform markers), allowing authenticated user",
        {
          userId,
          leadId,
          originalRoles: [...requiredRoles] as string[],
        },
      );
      const userRoles = await this.getUserRolesInternal(
        userId,
        requiredRoles,
        logger,
      );
      return createPrivateUser(
        userId,
        leadId,
        filterUserPermissionRoles(userRoles),
      ) as InferUserType<TRoles>;
    }

    // Check if endpoint only allows PUBLIC role (no authenticated users allowed)
    const onlyPublicAllowed =
      permissionRoles.length === 1 &&
      permissionRoles.includes(UserPermissionRole.PUBLIC);

    if (onlyPublicAllowed) {
      // Endpoint only allows public users - authenticated users should not access this
      logger.debug(
        "Endpoint only allows PUBLIC role, rejecting authenticated user",
        {
          userId,
          leadId,
          requiredRoles: [...permissionRoles] as string[],
        },
      );
      return createPublicUser<TRoles>(leadId);
    }

    // Get user roles from database
    const userRoles = await this.getUserRolesInternal(
      userId,
      requiredRoles,
      logger,
    );

    // Customer role is allowed for any authenticated user
    if (permissionRoles.includes(UserPermissionRole.CUSTOMER)) {
      return createPrivateUser(
        userId,
        leadId,
        filterUserPermissionRoles(userRoles),
      ) as InferUserType<TRoles>;
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
        logger.warn("app.api.user.auth.debug.failedToGetUserRoles", {
          userId,
          leadId,
        });
        // If CUSTOMER role is in permission roles, return authenticated user
        if (permissionRoles.includes(UserPermissionRole.CUSTOMER)) {
          return createPrivateUser(
            userId,
            leadId,
            filterUserPermissionRoles(userRoles),
          ) as InferUserType<TRoles>;
        }
        // If PUBLIC role is in permission roles (mixed with other roles), return authenticated user
        // (authenticated users can access PUBLIC endpoints when mixed with other roles)
        if (permissionRoles.includes(UserPermissionRole.PUBLIC)) {
          return createPrivateUser(
            userId,
            leadId,
            filterUserPermissionRoles(userRoles),
          ) as InferUserType<TRoles>;
        }
        // Otherwise, user doesn't have required roles
        logger.warn("User does not have required permission roles", {
          translationKey:
            "app.api.user.auth.debug.userDoesNotHaveRequiredRoles",
          userId,
          leadId,
          requiredRoles: permissionRoles.join(", "),
        });
        return createPublicUser<TRoles>(leadId);
      }

      // Check for required roles
      const hasRequiredRole = userRolesResponse.data.some((r) =>
        permissionRoles.some((requiredRole) => r.role === requiredRole),
      );

      if (hasRequiredRole) {
        return createPrivateUser(
          userId,
          leadId,
          filterUserPermissionRoles(userRoles),
        ) as InferUserType<TRoles>;
      }

      // User doesn't have required roles
      // If CUSTOMER role is in permission roles, we already handled it above
      // If PUBLIC role is in permission roles (mixed with other roles), the user is still authenticated
      // so we should return the authenticated user, not downgrade to public
      if (permissionRoles.includes(UserPermissionRole.PUBLIC)) {
        // User is authenticated but doesn't have the specific role
        // However, since PUBLIC is allowed (mixed with other roles), we can return the authenticated user
        // as they have at least CUSTOMER role (all authenticated users have CUSTOMER)
        return createPrivateUser(
          userId,
          leadId,
          filterUserPermissionRoles(userRoles),
        ) as InferUserType<TRoles>;
      }

      // User doesn't have required roles and PUBLIC is not allowed
      logger.warn("User does not have required permission roles", {
        translationKey: "app.api.user.auth.debug.userDoesNotHaveRequiredRoles",
        userId,
        leadId,
        requiredRoles: permissionRoles.join(", "),
        userRoles: userRolesResponse.data.map((r) => r.role).join(", "),
      });
      return createPublicUser<TRoles>(leadId);
    } catch (error) {
      logger.error("Error checking user authentication", {
        translationKey: "app.api.user.auth.debug.errorCheckingUserAuth",
        error: parseError(error).message,
        userId,
        leadId,
      });
      // If there's an error but PUBLIC is allowed (mixed with other roles), return authenticated user
      if (permissionRoles.includes(UserPermissionRole.PUBLIC)) {
        // Fetch roles for error case
        const errorUserRoles = await this.getUserRolesInternal(
          userId,
          requiredRoles,
          logger,
        );
        return createPrivateUser(
          userId,
          leadId,
          filterUserPermissionRoles(errorUserRoles),
        ) as InferUserType<TRoles>;
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
          logger.debug("app.api.user.auth.debug.tokenFromAuthHeader");
          return headerToken;
        }
      }

      // Then check for cookies (for browser requests)
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = this.parseCookies(cookieHeader, logger);
        const cookieToken = cookies[AUTH_TOKEN_COOKIE_NAME];
        if (cookieToken) {
          logger.debug("app.api.user.auth.debug.tokenFromCookie");
          return cookieToken;
        }
      }

      logger.debug("app.api.user.auth.debug.noTokenFound");
      return null;
    } catch (error) {
      logger.error(
        "app.api.user.auth.debug.errorExtractingToken",
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
        "app.api.user.auth.debug.errorParsingCookies",
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
      logger.debug("app.api.user.auth.debug.signingJwt", {
        userId: payload.id,
      });

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${AUTH_TOKEN_COOKIE_MAX_AGE_SECONDS}s`)
        .sign(this.secretKey);

      logger.debug("app.api.user.auth.debug.jwtSignedSuccessfully", {
        userId: payload.id,
      });
      return success(token);
    } catch (error) {
      logger.error(
        "app.api.user.auth.debug.errorSigningJwt",
        parseError(error),
      );
      return fail({
        message: "app.api.user.auth.errors.jwt_signing_failed",
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
      logger.debug("app.api.user.auth.debug.verifyingJwt");

      // Verify the token
      const { payload } = await jwtVerify<JwtPrivatePayloadType>(
        token,
        this.secretKey,
      );

      // Validate the payload structure
      if (!payload.id || typeof payload.id !== "string") {
        logger.debug("app.api.user.auth.debug.invalidTokenPayload");
        return fail({
          message: "app.api.user.auth.errors.invalid_token_signature",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Validate leadId is present
      if (!payload.leadId || typeof payload.leadId !== "string") {
        logger.debug("app.api.user.auth.debug.invalidTokenPayload");
        return fail({
          message: "app.api.user.auth.errors.invalid_token_signature",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Validate roles are present
      if (!payload.roles || !Array.isArray(payload.roles)) {
        logger.debug("app.api.user.auth.debug.invalidTokenPayload");
        return fail({
          message: "app.api.user.auth.errors.invalid_token_signature",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("app.api.user.auth.debug.jwtVerifiedSuccessfully");

      return success({
        isPublic: false,
        id: payload.id,
        leadId: payload.leadId,
        roles: payload.roles,
      });
    } catch (error) {
      logger.debug("app.api.user.auth.debug.errorVerifyingJwt", {
        error: parseError(error),
      });
      return fail({
        message: "app.api.user.auth.errors.invalid_token_signature",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Authenticate user from context
   * Contains all authentication business logic
   * Platform handlers only provide storage access
   */
  async authenticate(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPayloadType>> {
    try {
      // Get platform-specific storage handler
      const authHandler = getPlatformAuthHandler(context.platform);

      // If JWT payload provided directly (e.g., from CLI), use it
      if (context.jwtPayload) {
        logger.debug("Using provided JWT payload");
        return success(context.jwtPayload);
      }

      // Get token from platform-specific storage
      const token = await authHandler.getStoredAuthToken(context, logger);

      if (!token) {
        logger.debug("No auth token found");
        if (context.platform === Platform.CLI) {
          // Try CLI email auth if no token
          const cliEmail = env.VIBE_CLI_USER_EMAIL;
          if (cliEmail) {
            logger.debug("Attempting CLI email authentication");
            return await this.authenticateUserByEmail(
              cliEmail,
              context.locale,
              logger,
            );
          }
        }

        // Fall back to public user
        const leadId = await this.getLeadIdFromDb(
          undefined,
          context.locale,
          logger,
        );
        return success(createPublicUser(leadId || ""));
      }

      // Verify token
      const verifyResult = await this.verifyJwt(token, logger);
      if (!verifyResult.success) {
        logger.debug("Token verification failed");
        await authHandler.clearAuthToken(logger);
        const leadId = await this.getLeadIdFromDb(
          undefined,
          context.locale,
          logger,
        );
        return success(createPublicUser(leadId || ""));
      }

      // For Next.js platforms (both page and API), validate session against database
      if (
        context.platform === Platform.NEXT_PAGE ||
        context.platform === Platform.NEXT_API
      ) {
        const sessionValid = await this.validateWebSession(
          token,
          verifyResult.data.id,
          logger,
        );
        if (!sessionValid) {
          logger.debug("Session validation failed");
          await authHandler.clearAuthToken(logger);
          const leadId = await this.getLeadIdFromDb(
            undefined,
            context.locale,
            logger,
          );
          return success(createPublicUser(leadId || ""));
        }
      }

      // For public users, return directly (no roles to fetch)
      if (verifyResult.data.isPublic) {
        return success(verifyResult.data);
      }

      // For authenticated users, always refetch roles from database
      // Never trust roles from JWT/cookies - they may be stale
      const userRolesResponse = await userRolesRepository.findByUserId(
        verifyResult.data.id,
        logger,
      );
      const roles = userRolesResponse.success
        ? userRolesResponse.data.map((r) => r.role)
        : [UserPermissionRole.CUSTOMER];

      // Construct JWT payload with fresh roles from database
      const payload: JwtPrivatePayloadType = {
        isPublic: false,
        id: verifyResult.data.id,
        leadId: verifyResult.data.leadId,
        roles,
      };

      return success(payload);
    } catch (error) {
      logger.error("Authentication failed", parseError(error));
      const leadId = await this.getLeadIdFromDb(
        undefined,
        context.locale,
        logger,
      );
      return success(createPublicUser(leadId || ""));
    }
  }

  /**
   * Validate web session against database
   */
  private async validateWebSession(
    token: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<boolean> {
    try {
      const sessionResult = await sessionRepository.findByToken(token);
      if (!sessionResult.success) {
        return false;
      }

      const session = sessionResult.data;
      if (session.userId !== userId) {
        logger.error("Session user ID mismatch", {
          sessionUserId: session.userId,
          expectedUserId: userId,
        });
        return false;
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        logger.debug("Session expired", { expiresAt: session.expiresAt });
        return false;
      }

      return true;
    } catch (error) {
      logger.error("Session validation failed", parseError(error));
      return false;
    }
  }

  /**
   * Get current user with platform-aware handling
   */
  async getCurrentUser(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    const authResult = await this.authenticate(context, logger);

    if (!authResult.success || authResult.data.isPublic) {
      return fail({
        message: "app.api.user.auth.errors.user_not_authenticated",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    return success(authResult.data);
  }

  /**
   * Get authenticated user with role checking (platform-aware) - generic return type
   */
  async getAuthMinimalUser<TRoles extends readonly UserRoleValue[]>(
    roles: TRoles,
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      const authResult = await this.authenticate(context, logger);

      if (!authResult.success) {
        logger.error("Platform authentication failed", {
          platform: context.platform,
          error: authResult.message,
        });
        const leadId = await this.getLeadIdFromDb(
          undefined,
          context.locale,
          logger,
        );
        if (!leadId) {
          logger.error("Failed to get lead ID for public user");
          return throwErrorResponse(
            "app.api.user.auth.errors.session_retrieval_failed",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }
        return createPublicUser<TRoles>(leadId);
      }

      const jwtPayload = authResult.data;

      // If public user, return immediately if PUBLIC role is allowed
      if (jwtPayload.isPublic) {
        if (roles.includes(UserRole.PUBLIC)) {
          return jwtPayload as InferUserType<TRoles>;
        }
        logger.debug("Public user not allowed for this endpoint", {
          roles: JSON.stringify(roles),
        });
        return throwErrorResponse(
          "app.api.user.auth.errors.publicUserNotAllowed",
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
        "app.api.user.auth.debug.errorInUnifiedGetAuthMinimalUser",
        parseError(error),
      );
      const leadId = await this.getLeadIdFromDb(
        undefined,
        context.locale,
        logger,
      );
      if (!leadId) {
        logger.error("Failed to get lead ID for public user");
        return throwErrorResponse(
          "app.api.user.auth.errors.session_retrieval_failed",
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
    TRoles extends readonly UserRoleValue[],
  >(
    jwtPayload: JwtPrivatePayloadType,
    roles: TRoles,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<InferUserType<TRoles>> {
    try {
      logger.debug("app.api.user.auth.debug.authenticatingCliUserWithPayload", {
        userId: jwtPayload.id,
        isPublic: jwtPayload.isPublic,
        leadId: jwtPayload.leadId,
      });

      // This method is only called for private users (isPublic: false)
      // If somehow a public user reaches here, it's an error
      if (jwtPayload.isPublic || !jwtPayload.id) {
        logger.error("app.api.user.auth.debug.publicUserInPrivateAuthMethod", {
          isPublic: jwtPayload.isPublic,
          hasId: !!jwtPayload.id,
        });
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
        "app.api.user.auth.debug.errorAuthenticatingCliUserWithPayload",
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
          "app.api.user.auth.errors.session_retrieval_failed",
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
  async getTypedAuthMinimalUser<TRoles extends readonly UserRoleValue[]>(
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
    requiredRoles: readonly UserRoleValue[],
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<UserRoleValue[]> {
    try {
      // Locale is required for lead creation
      if (!context.locale) {
        logger.error("app.api.user.auth.debug.missingLocaleInContext");
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
        "app.api.user.auth.debug.errorGettingUserRoles",
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
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Storing auth token for platform", { platform, userId });

      // Get platform-specific handler
      const handler = getPlatformAuthHandler(platform);

      // Delegate to platform handler
      return await handler.storeAuthToken(token, userId, leadId, logger);
    } catch (error) {
      logger.error("Error storing auth token for platform", parseError(error));
      return fail({
        message: "app.api.user.auth.errors.cookie_set_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Clear authentication token using platform-specific handler
   */
  async clearAuthTokenForPlatform(
    platform: Platform,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Clearing auth token for platform", { platform });

      // Get platform-specific handler
      const handler = getPlatformAuthHandler(platform);

      // Delegate to platform handler
      return await handler.clearAuthToken(logger);
    } catch (error) {
      logger.error("Error clearing auth token for platform", parseError(error));
      return fail({
        message: "app.api.user.auth.errors.cookie_clear_failed",
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
      logger.debug("app.api.user.auth.debug.creatingCliToken", {
        userId,
      });

      const leadIdResult = await leadAuthRepository.getAuthenticatedUserLeadId(
        userId,
        undefined,
        locale,
        logger,
      );

      // Fetch user roles from DB to include in JWT
      const rolesResult = await userRolesRepository.getUserRoles(
        userId,
        logger,
      );

      // Default to CUSTOMER role if roles fetch fails
      const roles = rolesResult.success
        ? rolesResult.data
        : [UserPermissionRole.CUSTOMER];

      if (!rolesResult.success) {
        logger.warn(
          "Failed to fetch user roles for CLI token, using default CUSTOMER role",
          { userId },
        );
      }

      const payload: JwtPrivatePayloadType = {
        isPublic: false,
        id: userId,
        leadId: leadIdResult.leadId,
        roles,
      };

      return await this.signJwt(payload, logger);
    } catch (error) {
      logger.error(
        "app.api.user.auth.debug.errorCreatingCliToken",
        parseError(error),
      );
      return fail({
        message: "app.api.user.auth.errors.jwt_signing_failed",
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
      logger.debug("app.api.user.auth.debug.validatingCliToken");

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
        "app.api.user.auth.debug.errorValidatingCliToken",
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
        "app.api.user.auth.errors.jwt_payload_missing_id",
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

  /**
   * Authenticate user by email (for CLI authentication)
   * Moved from CLI handler to enforce repository-first architecture
   */
  async authenticateUserByEmail(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>> {
    try {
      logger.debug("Authenticating user by email", { email });

      const userResult = await userRepository.getUserByEmail(
        email,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );

      if (!userResult.success || !userResult.data) {
        logger.debug("User not found in database", { email });
        return fail({
          message: "app.api.user.auth.errors.user_not_authenticated",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { email },
        });
      }

      const user = userResult.data;
      const leadId = await this.getLeadIdFromDb(user.id, locale, logger);

      if (!leadId) {
        logger.error("Failed to get lead ID for user", { userId: user.id });
        return fail({
          message: "app.api.user.auth.errors.session_retrieval_failed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Fetch user roles
      const userRolesResponse = await userRolesRepository.findByUserId(
        user.id,
        logger,
      );
      const roles = userRolesResponse.success
        ? userRolesResponse.data.map((r) => r.role)
        : [UserPermissionRole.CUSTOMER];

      return success({
        isPublic: false,
        id: user.id,
        leadId,
        roles,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Error authenticating by email", parsedError);
      return fail({
        message: "app.api.user.auth.errors.authentication_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

// Singleton instance
export const authRepository = new AuthRepositoryImpl();
