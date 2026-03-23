/**
 * Login repository implementation
 * Handles user authentication
 */
import "server-only";

import { and, count, eq, gt, isNull, or } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { verifyPassword } from "next-vibe/shared/utils/password";
import type { NextRequest } from "next-vibe-ui/lib/request";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { type CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as creditsScopedTranslation } from "../../../credits/i18n";
import type { LeadsT } from "../../../leads/i18n";
import { scopedTranslation as leadsScopedTranslation } from "../../../leads/i18n";
import type { Platform } from "../../../system/unified-interface/shared/types/platform";
import { AuthRepository } from "../../auth/repository";
import type {
  JWTPublicPayloadType,
  JwtPrivatePayloadType,
} from "../../auth/types";
import { loginAttempts, users } from "../../db";
import { UserDetailLevel } from "../../enum";
import { SessionRepository } from "../../private/session/repository";
import { UserRepository } from "../../repository";
import { UserPermissionRole } from "../../user-roles/enum";
import { UserRolesRepository } from "../../user-roles/repository";
import type {
  LoginPostRequestOutput,
  LoginPostResponseOutput,
} from "./definition";
import type { LoginT, LoginTranslationKey } from "./i18n";
import { scopedTranslation } from "./i18n";
import type {
  LoginOptionsGetRequestOutput,
  LoginOptionsGetResponseOutput,
} from "./options/definition";
import { SocialProviders } from "./options/enum";

export interface LoginOptions {
  allowPasswordAuth: boolean;
  allowSocialAuth: boolean;
  maxAttempts: number;
  requireTwoFactor: boolean;
  socialProviders: Array<{
    enabled: boolean;
    name: LoginTranslationKey;
    providers: string[];
  }>;
}

/**
 * Login repository implementation
 */
export class LoginRepository {
  /**
   * DB-backed rate limiting constants.
   * An account is locked when MAX_FAILED_ATTEMPTS failures exist within WINDOW_MS.
   */
  private static readonly MAX_FAILED_ATTEMPTS = 5;
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  /**
   * A pre-computed Argon2id hash of a random placeholder used to normalise
   * timing for non-existent email lookups (prevents user-enumeration via timing).
   * Generated once; value is never compared to real user data.
   */
  private static dummyHash: string | null = null;
  private static async getDummyHash(): Promise<string> {
    if (!LoginRepository.dummyHash) {
      const { hashPassword } =
        await import("@/app/api/[locale]/shared/utils/password");
      LoginRepository.dummyHash = await hashPassword(
        "__dummy_constant_time_placeholder__",
      );
    }
    return LoginRepository.dummyHash;
  }
  /**
   * Login a user with email and password
   * @param email - User email
   * @param password - User password
   * @param rememberMe - Whether to extend session duration
   * @param leadId - Lead ID for tracking conversion
   * @param logger - Logger instance for debugging and monitoring
   * @returns Login response with user session
   */
  static async login(
    data: LoginPostRequestOutput,
    user: JWTPublicPayloadType,
    locale: CountryLanguage,
    request: NextRequest | undefined,
    logger: EndpointLogger,
    platform: Platform,
    t: LoginT,
  ): Promise<ResponseType<LoginPostResponseOutput>> {
    // Extract data from request
    const { email, password, rememberMe } = data;
    const leadsT = leadsScopedTranslation.scopedT(locale).t;

    // Get leadId from user prop (JWT payload) - must be present
    const leadId = user.leadId;
    if (!leadId) {
      return fail({
        message: t("errors.invalid_credentials"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Get client IP for security monitoring from request headers
    // In CLI context, request may be undefined
    const ipAddress = request
      ? request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown"
      : "cli";
    try {
      logger.debug("Login attempt", { email });

      // DB-backed rate limiting — safe across restarts and load-balanced instances
      const isLocked = await this.isAccountLockedDb(email, ipAddress);
      if (isLocked) {
        logger.debug("Login failed: Account locked", { email });
        await this.recordAttemptDb(email, ipAddress, false, true);
        return fail({
          message: t("errors.account_locked"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Fetch user + password hash in one query.
      // We intentionally do this BEFORE checking user existence so that
      // the Argon2 verification below always runs — preventing timing-based
      // user enumeration (non-existent users get a dummy hash and take the
      // same ~500ms as real users with a wrong password).
      const userRow = await db
        .select({ password: users.password, id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .then((rows) => rows[0]);

      const storedHash =
        userRow?.password ?? (await LoginRepository.getDummyHash());

      // Always run Argon2 — constant-time regardless of whether user exists
      const isPasswordValid = await verifyPassword(password, storedHash);

      if (!userRow || !isPasswordValid) {
        logger.debug("Login failed: Invalid credentials", { email });
        await this.recordAttemptDb(email, ipAddress, false, false);
        return fail({
          message: t("errors.invalid_credentials"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Re-fetch full user object (needed downstream)
      const userResponse = await UserRepository.getUserByEmail(
        email,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: t("errors.invalid_credentials"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          cause: userResponse,
        });
      }

      // Check if two-factor auth is required (if implemented)
      if (userResponse.data.requireTwoFactor) {
        logger.debug("Login requires 2FA", { email });
        // Here you would implement 2FA flow
        // This is a placeholder for the actual implementation
        return fail({
          message: t("errors.two_factor_required"),
          errorType: ErrorResponseTypes.TWO_FACTOR_REQUIRED,
        });
      }

      // Record successful attempt (clears lock for this email)
      await this.recordAttemptDb(email, ipAddress, true, false);

      // Create session and return user data
      logger.debug("Login successful", {
        userId: userResponse.data.id,
        email,
        rememberMe,
      });
      const sessionResponse = await this.createSessionAndGetUser(
        userResponse.data.id,
        rememberMe,
        locale,
        request,
        platform,
        logger,
        user, // Pass entire user object from route handler
        t,
      );
      if (!sessionResponse.success) {
        return sessionResponse;
      }

      // Link leadId to user (always happens during login)
      await this.handleLeadConversion(
        leadId,
        email,
        userResponse.data.id,
        logger,
        locale,
        leadsT,
      );

      return sessionResponse;
    } catch (error) {
      return fail({
        message: t("errors.auth_error"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          email,
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Create user session and return user data (private helper method)
   * @param userId - User ID
   * @param rememberMe - Whether to extend session duration
   * @param locale - Locale for lead tracking
   * @param request - Next.js request object for platform detection
   * @param logger - Logger instance
   * @param handlerUser - User object from route handler containing leadId
   * @returns Login response with user session
   */
  private static async createSessionAndGetUser(
    userId: string,
    rememberMe = false,
    locale: CountryLanguage,
    request: NextRequest | undefined,
    platform: Platform,
    logger: EndpointLogger,
    handlerUser: JWTPublicPayloadType,
    t: LoginT,
  ): Promise<ResponseType<LoginPostResponseOutput>> {
    return await this.createOrRenewSession(
      userId,
      false,
      rememberMe,
      locale,
      request,
      platform,
      logger,
      handlerUser,
      t,
    );
  }

  /**
   * Renew user session with fresh JWT token and update database session (private helper method)
   * @param userId - User ID
   * @param rememberMe - Whether to extend session duration
   * @param locale - Locale for lead tracking
   * @param request - Next.js request object for platform detection
   * @param logger - Logger instance
   * @param handlerUser - User object from route handler containing leadId
   * @returns Login response with renewed session
   */
  private static async renewSession(
    userId: string,
    rememberMe = false,
    locale: CountryLanguage,
    request: NextRequest | undefined,
    platform: Platform,
    logger: EndpointLogger,
    handlerUser: JWTPublicPayloadType,
    t: LoginT,
  ): Promise<ResponseType<LoginPostResponseOutput>> {
    return await this.createOrRenewSession(
      userId,
      true, // isRenewal
      rememberMe,
      locale,
      request,
      platform,
      logger,
      handlerUser,
      t,
    );
  }

  /**
   * Internal method to create or renew session with shared logic
   * @param userId - User ID
   * @param setCookies - Whether to set auth cookies
   * @param isRenewal - Whether this is a session renewal
   * @param rememberMe - Whether to extend session duration
   * @param locale - Locale for lead tracking
   * @param request - Next.js request object for platform detection
   * @param handlerUser - User object from route handler containing leadId
   * @returns Login response with session data
   */
  private static async createOrRenewSession(
    userId: string,
    isRenewal = false,
    rememberMe = false,
    locale: CountryLanguage,
    request: NextRequest | undefined,
    platform: Platform,
    logger: EndpointLogger,
    handlerUser: JWTPublicPayloadType,
    t: LoginT,
  ): Promise<ResponseType<LoginPostResponseOutput>> {
    try {
      // Create session and get user data
      logger.debug(
        isRenewal ? "Renewing session for user" : "Creating session for user",
        {
          userId,
          isRenewal,
          rememberMe,
        },
      );

      // Get full user data
      const userResponse = await UserRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return fail({
          message: t("errors.user_not_found"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { userId },
          cause: userResponse,
        });
      }

      // Use leadId directly from handler user object
      const leadId = handlerUser.leadId;
      logger.debug("Using leadId from route handler", { leadId });

      // Link the leadId to the user
      // This ensures the userLeads table has the relationship for credit lookups
      const { LeadAuthRepository } =
        await import("@/app/api/[locale]/leads/auth/repository");
      await LeadAuthRepository.linkLeadToUser(leadId, userId, logger);

      // Merge lead wallet into user wallet immediately
      // This ensures user gets their pre-login credits.
      // Also include all IP-linked leads so their shared pool collapses into the user.
      const { CreditRepository } = await import("../../../credits/repository");
      const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
      const linkedLeadIds = await LeadAuthRepository.getLinkedLeadIds(
        leadId,
        logger,
      );
      const mergeResult = await CreditRepository.mergePendingLeadWallets(
        userId,
        [leadId, ...linkedLeadIds],
        logger,
        creditsT,
        locale,
      );
      if (!mergeResult.success) {
        logger.error("Failed to merge lead wallet during login", {
          userId,
          leadId,
          error: mergeResult.message,
        });
      }

      // Set session duration based on rememberMe flag
      // Remember me: 30 days, Regular session: 7 days
      const sessionDurationDays = rememberMe ? 30 : 7;
      const sessionDurationSeconds = sessionDurationDays * 24 * 60 * 60;

      // Fetch user roles from DB to include in JWT
      const rolesResult = await UserRolesRepository.getUserRoles(
        userResponse.data.id,
        logger,
        locale,
      );
      // Default to CUSTOMER role if roles fetch fails
      const roles = rolesResult.success
        ? rolesResult.data
        : [UserPermissionRole.CUSTOMER];

      if (!rolesResult.success) {
        logger.warn(
          "Failed to fetch user roles for JWT, using default CUSTOMER role",
          {
            userId: userResponse.data.id,
          },
        );
      }

      // Create JWT payload with proper structure including leadId and roles
      const tokenPayload: JwtPrivatePayloadType = {
        id: userResponse.data.id,
        leadId: leadId,
        isPublic: false as const,
        roles,
      };

      // Sign JWT token
      const tokenResponse = await AuthRepository.signJwt(
        tokenPayload,
        logger,
        locale,
      );
      if (!tokenResponse.success) {
        return tokenResponse;
      }

      const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);

      // Create a session in the database
      const sessionData = {
        userId,
        token: tokenResponse.data,
        expiresAt,
      };
      await SessionRepository.create(sessionData, locale);

      // Create the response data - LoginPostResponseOutput
      // Always include the token in the response body so cross-origin clients
      // (e.g. local instance connecting to cloud via the remote-connect widget)
      // can extract it without needing to read httpOnly Set-Cookie headers,
      // which browsers block for cross-origin responses.
      const responseData: LoginPostResponseOutput = {
        message: "Welcome back! You have successfully logged in.",
        token: tokenResponse.data,
        leadId: leadId,
      };

      // Store auth token using platform-specific handler
      // Pass rememberMe flag to control cookie expiration
      const storeResult = await AuthRepository.storeAuthTokenForPlatform(
        tokenResponse.data,
        userId,
        leadId,
        platform,
        logger,
        locale,
        rememberMe, // Pass rememberMe to control session duration
      );
      if (storeResult.success) {
        logger.debug("Auth token stored successfully", {
          userId,
          isRenewal,
          rememberMe,
          sessionType: rememberMe ? "persistent (30 days)" : "session-only",
        });
      } else {
        logger.error("Error storing auth token", parseError(storeResult));
        // Continue even if token storage fails
      }

      // Return session data
      logger.debug("Login response data", { responseData });
      const finalResponse = success(responseData);
      logger.debug("Login final response");
      return finalResponse;
    } catch (error) {
      logger.error("Session creation failed", {
        userId,
        error: parseError(error).message,
      });
      return fail({
        message: t("errors.session_creation_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          userId,
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Get formatted login options matching definition response type
   * @param data - Request data with optional email
   * @param locale - Locale for translations
   * @param logger - Logger instance
   * @returns Login options formatted per definition
   */
  static async getLoginOptionsFormatted(
    data: LoginOptionsGetRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<LoginOptionsGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const email = data.email;
    const optionsResult = await this.getLoginOptions(logger, locale, t, email);

    if (!optionsResult.success) {
      return optionsResult;
    }

    const options = optionsResult.data;

    return success({
      response: {
        success: true,
        message: t("options.messages.successMessage"),
        forUser: email,
        loginMethods: {
          password: {
            enabled: options.allowPasswordAuth,
            passwordDescription: t("options.messages.passwordAuthDescription"),
          },
          social: {
            enabled: options.allowSocialAuth,
            socialDescription: t("options.messages.socialAuthDescription"),
            providers:
              options.socialProviders?.map((provider) => ({
                name: provider.name,
                id: provider.providers[0] || "unknown",
                enabled: provider.enabled,
                description: t("options.messages.continueWithProvider", {
                  provider: t(provider.name),
                }),
              })) || [],
          },
        },
        security: {
          maxAttempts: options.maxAttempts,
          requireTwoFactor: options.requireTwoFactor,
          securityDescription: options.requireTwoFactor
            ? t("options.messages.twoFactorRequired")
            : t("options.messages.standardSecurity"),
        },
        recommendations: [
          options.allowPasswordAuth
            ? t("options.messages.tryPasswordFirst")
            : t("options.messages.useSocialLogin"),
          t("options.messages.socialLoginFaster"),
        ],
      },
    });
  }

  /**
   * Get login options based on configuration and user state
   * @param logger - Logger instance for debugging and monitoring
   * @param email - Optional email to check user-specific options
   * @returns Login options
   */
  static async getLoginOptions(
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: LoginT,
    email?: string,
  ): Promise<ResponseType<LoginOptions>> {
    try {
      logger.debug("Getting login options", { email });

      // Default options
      const options: LoginOptions = {
        allowPasswordAuth: true,
        allowSocialAuth: false,
        maxAttempts: 5,
        requireTwoFactor: false,
        socialProviders: [
          {
            enabled: true,
            name: "enums.socialProviders.google",
            providers: [SocialProviders.GOOGLE],
          },
          {
            enabled: true,
            name: "enums.socialProviders.github",
            providers: [SocialProviders.GITHUB],
          },
          {
            enabled: true,
            name: "enums.socialProviders.facebook",
            providers: [SocialProviders.FACEBOOK],
          },
        ],
      };

      // If email provided, check user-specific settings
      if (email) {
        const user = await UserRepository.getUserByEmail(
          email,
          UserDetailLevel.STANDARD,
          locale,
          logger,
        );
        if (!user.success) {
          return fail({
            message: t("errors.user_not_found"),
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { userId: email },
            cause: user,
          });
        }
        // Apply user-specific settings if they exist
        options.requireTwoFactor = user.data.requireTwoFactor === true;

        // Check if account is locked (DB-backed, cross-instance)
        const isLocked = await this.isAccountLockedDb(email, "unknown");
        if (isLocked) {
          options.allowPasswordAuth = false;
          options.maxAttempts = 0; // Show that maximum attempts reached
        }
      }

      return success(options);
    } catch (error) {
      return fail({
        message: t("errors.auth_error"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          email: email || "unknown",
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Record a login attempt in the database.
   * On success, also clears recent failures for this email so the lock resets.
   */
  static async recordAttemptDb(
    email: string,
    ipAddress: string,
    success: boolean,
    isBlocked: boolean,
  ): Promise<void> {
    try {
      await db.insert(loginAttempts).values({
        email: email.toLowerCase(),
        ipAddress,
        success,
        isBlocked,
        failureCount: success ? 0 : 1,
      });
    } catch {
      // Non-critical — don't fail login if attempt recording fails
    }
  }

  /**
   * Check if an account is locked due to too many recent failed attempts.
   * Uses the database so the count survives restarts and spans all instances.
   */
  private static async isAccountLockedDb(
    email: string,
    ipAddress: string,
  ): Promise<boolean> {
    try {
      const windowStart = new Date(Date.now() - LoginRepository.WINDOW_MS);
      const [row] = await db
        .select({ cnt: count() })
        .from(loginAttempts)
        .where(
          and(
            or(
              eq(loginAttempts.email, email.toLowerCase()),
              ipAddress !== "unknown" && ipAddress !== "cli"
                ? eq(loginAttempts.ipAddress, ipAddress)
                : isNull(loginAttempts.ipAddress),
            ),
            eq(loginAttempts.success, false),
            eq(loginAttempts.isBlocked, false),
            gt(loginAttempts.createdAt, windowStart),
          ),
        );
      return (row?.cnt ?? 0) >= LoginRepository.MAX_FAILED_ATTEMPTS;
    } catch {
      // If DB is unreachable, fail open (don't lock out all users)
      return false;
    }
  }

  /**
   * Handle lead conversion when user logs in
   * @param leadId - Lead ID from tracking if available
   * @param email - User email
   * @param userId - User ID
   * @param locale - User locale
   * @param logger - Logger instance
   * @param user - JWT payload for authorization
   */
  private static async handleLeadConversion(
    leadId: string,
    email: string,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
    leadsT: LeadsT,
  ): Promise<void> {
    try {
      logger.debug("Converting lead during user login", {
        leadId,
        email,
        userId,
      });

      // Convert lead with both email (for anonymous leads) and userId (for user relationship)
      const { LeadsRepository } =
        await import("@/app/api/[locale]/leads/repository");
      const convertResult = await LeadsRepository.convertLead(
        leadId,
        {
          email,
          userId,
        },
        logger,
        leadsT,
      );

      if (convertResult.success) {
        logger.debug("Lead conversion completed successfully during login", {
          leadId,
          email,
          userId,
          convertedLead: convertResult.data,
        });
      } else {
        // Check if it's a duplicate error (409) - this is expected if the lead is already linked
        if (convertResult.errorType.errorCode === 409) {
          logger.debug("Lead already linked to user during login", {
            leadId,
            email,
            userId,
          });
        } else {
          logger.error("Lead conversion failed during login", {
            leadId,
            email,
            userId,
            error: convertResult.message,
            errorType: convertResult.errorType,
          });
        }
      }
    } catch (error) {
      // Don't fail user login if lead conversion fails
      logger.error("Lead conversion failed during login", {
        email,
        userId,
        leadId,
        error: parseError(error).message,
      });
    }
  }
}
