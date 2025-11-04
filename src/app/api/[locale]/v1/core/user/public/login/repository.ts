/**
 * Login repository implementation
 * Handles user authentication
 */

import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { LEAD_ID_COOKIE_NAME } from "next-vibe/shared/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { verifyPassword } from "next-vibe/shared/utils/password";

import { leadAuthRepository } from "@/app/api/[locale]/v1/core/leads/auth/repository";
import { leadsRepository } from "@/app/api/[locale]/v1/core/leads/repository";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import { authRepository } from "../../auth/repository";
import type { JWTPublicPayloadType } from "../../auth/types";
import { users } from "../../db";
import { UserDetailLevel } from "../../enum";
import { sessionRepository } from "../../private/session/repository";
import { userRepository } from "../../repository";
import type {
  LoginPostRequestOutput,
  LoginPostResponseOutput,
} from "./definition";
import { SocialProviders } from "./options/enum";

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

/**
 * Login repository interface
 */
export interface LoginRepository {
  /**
   * Login a user with email and password
   * @param data - Login request data
   * @param user - JWT payload (public user)
   * @param locale - User locale
   * @param request - Next.js request object for platform detection
   * @param logger - Logger instance for debugging and monitoring
   * @returns Login response with boolean success
   */
  login(
    data: LoginPostRequestOutput,
    user: JWTPublicPayloadType,
    locale: CountryLanguage,
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<LoginPostResponseOutput>>;

  /**
   * Get login options with ResponseType wrapper
   * @param logger - Logger instance for debugging and monitoring
   * @param locale - User locale
   * @param email - Optional email to check user-specific options
   * @returns Login options wrapped in ResponseType
   */
  getLoginOptions(
    logger: EndpointLogger,
    locale: CountryLanguage,
    email?: string,
  ): Promise<ResponseType<LoginOptions>>;

  /**
   * Track login attempt for security monitoring
   * @param attempt - Login attempt details
   */
  trackLoginAttempt(attempt: LoginAttempt): void;
}

// In-memory login attempt tracking (in a real app, use Redis or database)
const loginAttempts = new Map<string, LoginAttempt[]>();

/**
 * Login repository implementation
 */
export class LoginRepositoryImpl implements LoginRepository {
  /**
   * Login a user with email and password
   * @param email - User email
   * @param password - User password
   * @param rememberMe - Whether to extend session duration
   * @param leadId - Lead ID for tracking conversion
   * @param logger - Logger instance for debugging and monitoring
   * @returns Login response with user session
   */
  async login(
    data: LoginPostRequestOutput,
    user: JWTPublicPayloadType,
    locale: CountryLanguage,
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<LoginPostResponseOutput>> {
    const headersList = await headers();

    // Extract data from request
    const { email, password } = data.credentials;
    const { rememberMe } = data.options;

    // Get leadId from user prop (JWT payload) - always present
    const leadId = user.leadId;

    // Get client IP for security monitoring
    const ipAddress =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      "unknown";
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

        return createErrorResponse(
          "app.api.v1.core.user.public.login.errors.account_locked",
          ErrorResponseTypes.FORBIDDEN,
        );
      }

      // Find user by email
      const userResponse = await userRepository.getUserByEmail(
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

        return createErrorResponse(
          "app.api.v1.core.user.public.login.errors.invalid_credentials",
          ErrorResponseTypes.UNAUTHORIZED,
        );
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

        return createErrorResponse(
          "app.api.v1.core.user.public.login.errors.invalid_credentials",
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Check if two-factor auth is required (if implemented)
      if (userResponse.data.requireTwoFactor) {
        logger.debug("Login requires 2FA", { email });
        // Here you would implement 2FA flow
        // This is a placeholder for the actual implementation
        return createErrorResponse(
          "app.api.v1.core.user.public.login.errors.two_factor_required",
          ErrorResponseTypes.TWO_FACTOR_REQUIRED,
        );
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
        logger,
      );
      if (!sessionResponse.success) {
        return sessionResponse;
      }

      // Link leadId to user (always happens during login)
      await this.handleLeadConversion(
        leadId,
        email,
        userResponse.data.id,
        user,
        locale,
        logger,
      );

      return sessionResponse;
    } catch (error) {
      return createErrorResponse(
        "app.api.v1.core.user.public.login.errors.auth_error",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          email,
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Create user session and return user data (private helper method)
   * @param userId - User ID
   * @param rememberMe - Whether to extend session duration
   * @param locale - Locale for lead tracking
   * @param request - Next.js request object for platform detection
   * @param logger - Logger instance
   * @returns Login response with user session
   */
  private async createSessionAndGetUser(
    userId: string,
    rememberMe = false,
    locale: CountryLanguage,
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<LoginPostResponseOutput>> {
    return await this.createOrRenewSession(
      userId,
      false,
      rememberMe,
      locale,
      request,
      logger,
    );
  }

  /**
   * Renew user session with fresh JWT token and update database session (private helper method)
   * @param userId - User ID
   * @param rememberMe - Whether to extend session duration
   * @param locale - Locale for lead tracking
   * @param request - Next.js request object for platform detection
   * @param logger - Logger instance
   * @returns Login response with renewed session
   */
  private async renewSession(
    userId: string,
    rememberMe = false,
    locale: CountryLanguage,
    request: NextRequest,
    logger: EndpointLogger,
  ): Promise<ResponseType<LoginPostResponseOutput>> {
    return await this.createOrRenewSession(
      userId,
      true, // isRenewal
      rememberMe,
      locale,
      request,
      logger,
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
   * @returns Login response with session data
   */
  private async createOrRenewSession(
    userId: string,
    isRenewal = false,
    rememberMe = false,
    locale: CountryLanguage,
    request: NextRequest,
    logger: EndpointLogger,
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
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.user.public.login.errors.user_not_found",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // Get leadId from cookie (the one the user had before logging in)
      const cookieStore = await cookies();
      const cookieLeadId = cookieStore.get(LEAD_ID_COOKIE_NAME)?.value;

      // Link the cookie leadId to the user if it exists
      // This ensures the userLeads table has the relationship for credit lookups
      if (cookieLeadId) {
        await leadAuthRepository.linkLeadToUser(
          cookieLeadId,
          userId,
          locale,
          logger,
        );
      }

      // Get primary leadId for user (now that we've linked the cookie leadId)
      const leadIdResult = await leadAuthRepository.getAuthenticatedUserLeadId(
        userId,
        cookieLeadId,
        locale,
        logger,
      );

      // Set session duration based on rememberMe flag
      // Remember me: 30 days, Regular session: 7 days
      const sessionDurationDays = rememberMe ? 30 : 7;
      const sessionDurationSeconds = sessionDurationDays * 24 * 60 * 60;

      // Create JWT payload with proper structure including leadId
      const tokenPayload = {
        id: userResponse.data.id,
        leadId: leadIdResult.leadId,
        isPublic: false as const,
      };

      // Sign JWT token
      const tokenResponse = await authRepository.signJwt(tokenPayload, logger);
      if (!tokenResponse.success) {
        return tokenResponse;
      }

      const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);

      if (isRenewal) {
        // For renewal, delete existing sessions and create a new one
        await sessionRepository.deleteByUserId(userId);
      }

      // Create a session in the database
      const sessionData = {
        userId,
        token: tokenResponse.data,
        expiresAt,
      };
      await sessionRepository.create(sessionData);

      // Create the response data - LoginPostResponseOutput
      const responseData: LoginPostResponseOutput = {
        success: true,
        message: "app.api.v1.core.user.public.login.success.message",
        user: {
          id: userResponse.data.id,
          email: userResponse.data.email,
          privateName: userResponse.data.privateName,
          publicName: userResponse.data.publicName,
        },
        sessionInfo: {
          expiresAt: expiresAt.toISOString(),
          rememberMeActive: rememberMe,
          loginLocation: "web",
        },
        nextSteps: [
          "app.api.v1.core.user.public.login.success.nextSteps.dashboard",
        ],
      };

      // Store auth token using platform-specific handler
      const storeResult = await authRepository.storeAuthTokenForPlatform(
        tokenResponse.data,
        userId,
        leadIdResult.leadId,
        request,
        logger,
      );
      if (storeResult.success) {
        logger.debug("Auth token stored successfully", {
          userId,
          isRenewal,
          rememberMe,
        });
      } else {
        logger.error("Error storing auth token", parseError(storeResult));
        // Continue even if token storage fails
      }

      // Return session data
      logger.debug("Login response data", { responseData });
      const finalResponse = createSuccessResponse(responseData);
      logger.debug("Login final response");
      return finalResponse;
    } catch (error) {
      logger.error("Session creation failed", {
        userId,
        error: parseError(error).message,
      });
      return createErrorResponse(
        "app.api.v1.core.user.public.login.errors.session_creation_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          userId,
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Get login options based on configuration and user state
   * @param logger - Logger instance for debugging and monitoring
   * @param email - Optional email to check user-specific options
   * @returns Login options
   */
  async getLoginOptions(
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
            name: "app.api.v1.core.user.public.login.enums.socialProviders.google",
            providers: [SocialProviders.GOOGLE],
          },
          {
            enabled: true,
            name: "app.api.v1.core.user.public.login.enums.socialProviders.github",
            providers: [SocialProviders.GITHUB],
          },
          {
            enabled: true,
            name: "app.api.v1.core.user.public.login.enums.socialProviders.facebook",
            providers: [SocialProviders.FACEBOOK],
          },
        ],
      };

      // If email provided, check user-specific settings
      if (email) {
        const user = await userRepository.getUserByEmail(
          email,
          UserDetailLevel.STANDARD,
          locale,
          logger,
        );
        if (!user.success) {
          return createErrorResponse(
            "app.api.v1.core.user.public.login.errors.user_not_found",
            ErrorResponseTypes.NOT_FOUND,
            { userId: email },
          );
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

      return createSuccessResponse(options);
    } catch (error) {
      return createErrorResponse(
        "app.api.v1.core.user.public.login.errors.auth_error",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          email: email || "unknown",
          error: parseError(error).message,
        },
      );
    }
  }

  /**
   * Track login attempt for security monitoring
   * @param attempt - Login attempt details
   */
  trackLoginAttempt(attempt: LoginAttempt): void {
    const attempts = loginAttempts.get(attempt.email) || [];
    attempts.push(attempt);
    loginAttempts.set(attempt.email, attempts);
  }

  /**
   * Check if an account is locked due to too many failed attempts
   * @param email - Email to check
   * @returns Whether the account is locked
   */
  private isAccountLocked(email: string): boolean {
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
   * @param publicUser - Public user from handler (for type safety)
   * @param logger - Logger instance
   */
  private async handleLeadConversion(
    leadId: string,
    email: string,
    userId: string,
    publicUser: JWTPublicPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("Converting lead during user login", {
        leadId,
        email,
        userId,
      });

      // Convert lead with both email (for anonymous leads) and userId (for user relationship)
      // Pass publicUser from handler to maintain type safety
      const convertResult = await leadsRepository.convertLead(
        leadId,
        {
          email,
          userId,
        },
        publicUser,
        locale,
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

// Export singleton instance of the repository
export const loginRepository = new LoginRepositoryImpl();
