/**
 * Login repository implementation
 * Handles user authentication
 */
import "server-only";

import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { verifyPassword } from "next-vibe/shared/utils/password";

import { LeadAuthRepository } from "@/app/api/[locale]/leads/auth/repository";
import { LeadsRepository } from "@/app/api/[locale]/leads/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import { AuthRepository } from "../../auth/repository";
import type {
  JWTPublicPayloadType,
  JwtPrivatePayloadType,
} from "../../auth/types";
import { UserPermissionRole } from "../../user-roles/enum";
import { users } from "../../db";
import { UserDetailLevel } from "../../enum";
import { SessionRepository } from "../../private/session/repository";
import { UserRepository } from "../../repository";
import { UserRolesRepository } from "../../user-roles/repository";
import type {
  LoginPostRequestOutput,
  LoginPostResponseOutput,
} from "./definition";
import type {
  LoginOptionsGetRequestOutput,
  LoginOptionsGetResponseOutput,
} from "./options/definition";
import { SocialProviders } from "./options/enum";
import type { Platform } from "../../../system/unified-interface/shared/types/platform";
import { simpleT } from "@/i18n/core/shared";

export interface SocialProvidersOptions {
  enabled: boolean;
  name: TranslationKey;
  providers: (typeof SocialProviders)[keyof typeof SocialProviders][];
}

/**
 * Login options interface
 */
export interface LoginOptions {
  allowPasswordAuth: boolean;
  allowSocialAuth: boolean;
  maxAttempts?: number;
  requireTwoFactor?: boolean;
  socialProviders?: SocialProvidersOptions[];
}

/**
 * Login attempt tracking for security
 */
interface LoginAttempt {
  email: string;
  timestamp: Date;
  success: boolean;
  ipAddress?: string;
}

// In-memory login attempt tracking (in a real app, use Redis or database)
const loginAttempts = new Map<string, LoginAttempt[]>();

/**
 * Login repository implementation
 */
export class LoginRepository {
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
  ): Promise<ResponseType<LoginPostResponseOutput>> {
    // Extract data from request
    const { email, password, rememberMe } = data;

    // Get leadId from user prop (JWT payload) - always present
    const leadId = user.leadId;

    // Get client IP for security monitoring from request headers
    // In CLI context, request may be undefined
    const ipAddress = request
      ? request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown"
      : "cli";
    try {
      logger.debug("Login attempt", { email });

      // Check if account is locked due to too many failed attempts
      const isLocked = this.isAccountLocked(email);
      if (isLocked) {
        logger.debug("Login failed: Account locked", { email });

        // Track the failed attempt
        this.trackLoginAttempt({
          email,
          timestamp: new Date(),
          success: false,
          ipAddress: ipAddress,
        });

        return fail({
          message: "app.api.user.public.login.errors.account_locked",
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Find user by email
      const userResponse = await UserRepository.getUserByEmail(
        email,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );

      // Check if user exists
      if (!userResponse.success) {
        logger.debug("Login failed: User not found", { email });

        // Track the failed attempt
        this.trackLoginAttempt({
          email,
          timestamp: new Date(),
          success: false,
          ipAddress: ipAddress,
        });

        return fail({
          message: "app.api.user.public.login.errors.invalid_credentials",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          cause: userResponse,
        });
      }

      const currentPassword = await db
        .select({ password: users.password })
        .from(users)
        .where(eq(users.email, email))
        .then((results) => results[0]?.password);

      // Verify password
      const isPasswordValid = await verifyPassword(password, currentPassword);
      if (!isPasswordValid) {
        logger.debug("Login failed: Invalid password", { email });

        // Track the failed attempt
        this.trackLoginAttempt({
          email,
          timestamp: new Date(),
          success: false,
          ipAddress: ipAddress,
        });

        return fail({
          message: "app.api.user.public.login.errors.invalid_credentials",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Check if two-factor auth is required (if implemented)
      if (userResponse.data.requireTwoFactor) {
        logger.debug("Login requires 2FA", { email });
        // Here you would implement 2FA flow
        // This is a placeholder for the actual implementation
        return fail({
          message: "app.api.user.public.login.errors.two_factor_required",
          errorType: ErrorResponseTypes.TWO_FACTOR_REQUIRED,
        });
      }

      // Track successful login attempt
      this.trackLoginAttempt({
        email,
        timestamp: new Date(),
        success: true,
        ipAddress: ipAddress,
      });

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
      );

      return sessionResponse;
    } catch (error) {
      return fail({
        message: "app.api.user.public.login.errors.auth_error",
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
          message: "app.api.user.public.login.errors.user_not_found",
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
      await LeadAuthRepository.linkLeadToUser(leadId, userId, logger);

      // Merge lead wallet into user wallet immediately
      // This ensures user gets their pre-login credits
      const { CreditRepository } = await import("../../../credits/repository");
      const mergeResult = await CreditRepository.mergePendingLeadWallets(
        userId,
        [leadId],
        logger,
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
      const tokenResponse = await AuthRepository.signJwt(tokenPayload, logger);
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
      await SessionRepository.create(sessionData);

      // Create the response data - LoginPostResponseOutput
      const responseData: LoginPostResponseOutput = {
        message: "app.api.user.public.login.success.message",
      };

      // Store auth token using platform-specific handler
      // Pass rememberMe flag to control cookie expiration
      const storeResult = await AuthRepository.storeAuthTokenForPlatform(
        tokenResponse.data,
        userId,
        leadId,
        platform,
        logger,
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
        message: "app.api.user.public.login.errors.session_creation_failed",
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
    const email = data.email;
    const { t } = simpleT(locale);
    const optionsResult = await this.getLoginOptions(logger, locale, email);

    if (!optionsResult.success) {
      return optionsResult;
    }

    const options = optionsResult.data;

    return success({
      response: {
        success: true,
        message: t("app.api.user.public.login.options.messages.successMessage"),
        forUser: email,
        loginMethods: {
          password: {
            enabled: options.allowPasswordAuth,
            passwordDescription: t(
              "app.api.user.public.login.options.messages.passwordAuthDescription",
            ),
          },
          social: {
            enabled: options.allowSocialAuth,
            socialDescription: t(
              "app.api.user.public.login.options.messages.socialAuthDescription",
            ),
            providers:
              options.socialProviders?.map((provider) => ({
                name: provider.name,
                id: provider.providers[0] || "unknown",
                enabled: provider.enabled,
                description: t(
                  "app.api.user.public.login.options.messages.continueWithProvider",
                  {
                    provider: t(provider.name),
                  },
                ),
              })) || [],
          },
        },
        security: {
          maxAttempts: options.maxAttempts,
          requireTwoFactor: options.requireTwoFactor,
          securityDescription: options.requireTwoFactor
            ? t("app.api.user.public.login.options.messages.twoFactorRequired")
            : t("app.api.user.public.login.options.messages.standardSecurity"),
        },
        recommendations: [
          options.allowPasswordAuth
            ? t("app.api.user.public.login.options.messages.tryPasswordFirst")
            : t("app.api.user.public.login.options.messages.useSocialLogin"),
          t("app.api.user.public.login.options.messages.socialLoginFaster"),
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
            name: "app.api.user.public.login.enums.socialProviders.google",
            providers: [SocialProviders.GOOGLE],
          },
          {
            enabled: true,
            name: "app.api.user.public.login.enums.socialProviders.github",
            providers: [SocialProviders.GITHUB],
          },
          {
            enabled: true,
            name: "app.api.user.public.login.enums.socialProviders.facebook",
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
            message: "app.api.user.public.login.errors.user_not_found",
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { userId: email },
            cause: user,
          });
        }
        // Apply user-specific settings if they exist
        options.requireTwoFactor = user.data.requireTwoFactor === true;

        // Check if account is locked
        const isLocked = this.isAccountLocked(email);
        if (isLocked) {
          options.allowPasswordAuth = false;
          options.maxAttempts = 0; // Show that maximum attempts reached
        }
      }

      return success(options);
    } catch (error) {
      return fail({
        message: "app.api.user.public.login.errors.auth_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          email: email || "unknown",
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Track login attempt for security monitoring
   * @param attempt - Login attempt details
   */
  static trackLoginAttempt(attempt: LoginAttempt): void {
    const attempts = loginAttempts.get(attempt.email) || [];
    attempts.push(attempt);
    loginAttempts.set(attempt.email, attempts);
  }

  /**
   * Check if an account is locked due to too many failed attempts
   * @param email - Email to check
   * @returns Whether the account is locked
   */
  private static isAccountLocked(email: string): boolean {
    const attempts = loginAttempts.get(email) || [];
    const recentAttempts = attempts.filter(
      (attempt: LoginAttempt) =>
        attempt.timestamp > new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
    );
    const failedAttempts = recentAttempts.filter(
      (attempt: LoginAttempt) => !attempt.success,
    ).length;
    return failedAttempts >= 5;
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
  ): Promise<void> {
    try {
      logger.debug("Converting lead during user login", {
        leadId,
        email,
        userId,
      });

      // Convert lead with both email (for anonymous leads) and userId (for user relationship)
      const convertResult = await LeadsRepository.convertLead(
        leadId,
        {
          email,
          userId,
        },
        logger,
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
