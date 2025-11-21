/**
 * Signup Repository
 * Handles user registration and email checking with EndpointLogger pattern
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { creditRepository } from "@/app/api/[locale]/v1/core/credits/repository";
import { leadAuthRepository } from "@/app/api/[locale]/v1/core/leads/auth/repository";
import { leadsRepository } from "@/app/api/[locale]/v1/core/leads/repository";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { authRepository } from "../../auth/repository";
import type { JwtPayloadType } from "../../auth/types";
import { UserDetailLevel } from "../../enum";
import { sessionRepository } from "../../private/session/repository";
import { userRepository } from "../../repository";
import type { StandardUserType } from "../../types";
import {
  UserRole,
  type UserRoleValue,
  isUserPermissionRole,
} from "../../user-roles/enum";
import { userRolesRepository } from "../../user-roles/repository";
import type {
  SignupGetRequestOutput,
  SignupGetResponseOutput,
  SignupPostRequestOutput,
  SignupPostResponseOutput,
} from "./definition";

/**
 * Signup repository interface
 */
export interface SignupRepository {
  /**
   * Register a new user
   * @param data - User registration data
   * @param user - User from JWT (public user for signup)
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @param request - Next.js request object for platform detection
   * @returns Success or error result
   */
  registerUser(
    data: SignupPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    request: NextRequest,
  ): Promise<ResponseType<SignupPostResponseOutput>>;

  /**
   * Check if email is already registered
   * @param data - Email check data
   * @param user - User from JWT (public user)
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns Success or error result
   */
  checkEmailAvailability(
    data: SignupGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SignupGetResponseOutput>>;
}

/**
 * Signup repository implementation
 */
export class SignupRepositoryImpl implements SignupRepository {
  /**
   * Register a new user
   * @param data - User registration data
   * @param user - User from JWT (public user for signup)
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @param request - Next.js request object for platform detection
   * @returns Success or error result
   */
  async registerUser(
    data: SignupPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    request: NextRequest,
  ): Promise<ResponseType<SignupPostResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      logger.debug("Registering new user", { email: data.personalInfo.email });

      // Validate password match
      if (data.security.password !== data.security.confirmPassword) {
        logger.debug("Registration failed: Passwords do not match", {
          email: data.personalInfo.email,
        });
        return fail({
          message: "app.api.v1.core.user.auth.errors.validation_failed",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            field: "confirmPassword",
            message: t(
              "app.api.v1.core.user.public.signup.fields.confirmPassword.validation.mismatch",
            ),
          },
        });
      }

      // Check if email already exists
      const emailCheckResponse = await this.checkEmailAvailabilityInternal(
        data.personalInfo.email,
        locale,
        logger,
      );
      if (!emailCheckResponse.success) {
        return emailCheckResponse;
      }
      if (emailCheckResponse.data) {
        return fail({
          message: "app.api.v1.core.user.public.signup.errors.conflict.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            field: "email",
            message: t("app.api.v1.core.user.errors.emailAlreadyInUse"),
          },
        });
      }

      // Create the user account
      const result = await this.createUserInternal(
        data,
        user.leadId,
        locale,
        logger,
      );

      if (!result.success) {
        logger.debug("User registration failed", {
          message: result.message,
          errorType: result.errorType,
        });
        return result;
      }

      const userData = result.data;
      logger.debug("User registration completed successfully", {
        email: data.personalInfo.email,
        userId: userData.id,
        leadId: user.leadId,
      });

      // Auto-login: Create session and store auth token
      // Link leadId to user
      await leadAuthRepository.linkLeadToUser(
        user.leadId,
        userData.id,
        locale,
        logger,
      );

      // Link referral code if provided manually in form
      const { referralRepository } =
        await import("../../../referral/repository");
      if (data.referralCode) {
        logger.debug("Linking manual referral code to lead", {
          referralCode: data.referralCode,
          leadId: user.leadId,
        });
        await referralRepository.linkReferralToLead(
          user.leadId,
          data.referralCode,
          locale,
          logger,
        );
      }

      // Convert lead referral to user referral (Phase 2: make referral permanent)
      await referralRepository.convertLeadReferralToUser(
        userData.id,
        user.leadId,
        locale,
        logger,
      );

      // Merge lead wallet into user wallet immediately (not lazy)
      // This ensures user gets their pre-signup credits right away
      const mergeResult = await creditRepository.mergePendingLeadWallets(
        userData.id,
        [user.leadId],
        logger,
      );
      let creditMergeFailed = false;
      if (!mergeResult.success) {
        // CRITICAL: Log as error but track failure so we can inform user
        // User will still be registered, but may not have their pre-signup credits
        creditMergeFailed = true;
        logger.error("CRITICAL: Failed to merge lead wallet during signup", {
          userId: userData.id,
          leadId: user.leadId,
          error: mergeResult.message,
          action:
            "User registered but credits may be missing - requires manual intervention",
        });
      }

      // Get primary leadId for user
      const leadIdResult = await leadAuthRepository.getAuthenticatedUserLeadId(
        userData.id,
        user.leadId,
        locale,
        logger,
      );

      // Create JWT payload
      const tokenPayload = {
        id: userData.id,
        leadId: leadIdResult.leadId,
        isPublic: false as const,
      };

      // Sign JWT token
      const tokenResponse = await authRepository.signJwt(tokenPayload, logger);
      if (!tokenResponse.success) {
        logger.error("Failed to sign JWT token after signup", {
          userId: userData.id,
        });
        // Continue without auto-login - user can manually log in
      } else {
        // Create session in database (7 days default)
        const sessionDurationSeconds = 7 * 24 * 60 * 60;
        const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);
        const sessionData = {
          userId: userData.id,
          token: tokenResponse.data,
          expiresAt,
        };
        await sessionRepository.create(sessionData);

        // Store auth token using platform-specific handler
        const storeResult = await authRepository.storeAuthTokenForPlatform(
          tokenResponse.data,
          userData.id,
          leadIdResult.leadId,
          request,
          logger,
        );
        if (storeResult.success) {
          logger.debug("Auth token stored successfully after signup", {
            userId: userData.id,
          });
        } else {
          logger.error(
            "Error storing auth token after signup",
            parseError(storeResult),
          );
          // Continue even if token storage fails
        }
      }

      const nextSteps = [
        "app.api.v1.core.user.public.signup.success.nextSteps.profile",
        "app.api.v1.core.user.public.signup.success.nextSteps.explore",
      ];

      // Add warning if credit merge failed - user should contact support
      if (creditMergeFailed) {
        nextSteps.unshift(
          "app.api.v1.core.user.public.signup.success.nextSteps.creditMergeWarning",
        );
      }

      return success<SignupPostResponseOutput>({
        response: {
          success: true,
          message: "app.api.v1.core.user.public.signup.success.message",
          user: {
            id: userData.id,
            email: userData.email,
            privateName: userData.privateName,
            publicName: userData.publicName,
            verificationRequired: false,
          },
          verificationInfo: {
            emailSent: false,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            checkSpamFolder: false,
          },
          nextSteps,
        },
      });
    } catch (error) {
      logger.error("Registration error", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: "app.api.v1.core.user.public.signup.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          email: data.personalInfo.email,
          error: parsedError.message,
        },
      });
    }
  }

  /**
   * Check if email is already registered
   * @param data - Email check data
   * @param user - User from JWT (public user)
   * @param locale - User locale
   * @param logger - Logger instance for debugging and monitoring
   * @returns Success or error result
   */
  async checkEmailAvailability(
    data: SignupGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SignupGetResponseOutput>> {
    try {
      logger.debug("Checking email availability", { email: data.email });

      const isEmailTaken = await this.checkEmailAvailabilityInternal(
        data.email,
        locale,
        logger,
      );
      if (!isEmailTaken.success) {
        return isEmailTaken;
      }

      logger.debug("Email availability check completed", {
        email: data.email,
        available: !isEmailTaken.data,
      });

      return success<SignupGetResponseOutput>({
        response: {
          available: !isEmailTaken.data, // false if taken, true if available
          message: isEmailTaken.data
            ? "app.api.v1.core.user.public.signup.emailCheck.taken"
            : "app.api.v1.core.user.public.signup.emailCheck.available",
        },
      });
    } catch (error) {
      logger.error("Error checking email availability", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.v1.core.user.public.signup.emailCheck.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { email: data.email, error: parsedError.message },
      });
    }
  }

  /**
   * Internal helper: Create a new user account
   * @param userInput - User registration data
   * @param leadId - Lead ID from JWT payload
   * @param locale - User locale
   * @param logger - Logger instance
   * @param role - User role (default: CUSTOMER)
   * @returns Success or error result
   */
  private async createUserInternal(
    userInput: SignupPostRequestOutput,
    leadId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    role: UserRoleValue = UserRole.CUSTOMER,
  ): Promise<ResponseType<StandardUserType>> {
    try {
      // Extract data from nested structure
      const email = userInput.personalInfo.email;
      const password = userInput.security.password;
      const privateName = userInput.personalInfo.privateName;
      const publicName = userInput.personalInfo.publicName;
      const confirmPassword = userInput.security.confirmPassword;
      const subscribeToNewsletter =
        userInput.consent.subscribeToNewsletter || false;

      // Check if email is already registered
      const emailCheckResult = await this.checkEmailAvailabilityInternal(
        email,
        locale,
        logger,
      );

      if (!emailCheckResult.success) {
        return emailCheckResult;
      }

      if (emailCheckResult.data) {
        logger.debug("Registration failed: Email already registered", {
          email,
        });
        return fail({
          message: "app.api.v1.core.user.public.signup.errors.conflict.title",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { email },
        });
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        logger.debug("Registration failed: Passwords do not match", { email });
        return fail({
          message: "app.api.v1.core.user.auth.errors.validation_failed",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Create user data object
      const userData = {
        email,
        password,
        privateName,
        publicName,
        locale,
      };

      // Create new user with generated ID
      logger.debug("Creating new user", { email });

      const userResponse = await userRepository.createWithHashedPassword(
        userData,
        logger,
      );
      if (!userResponse.success) {
        return userResponse;
      }

      // Only assign permission roles to users, never platform markers
      // Platform markers (CLI_OFF, CLI_AUTH_BYPASS, etc.) are config-only markers
      if (isUserPermissionRole(role)) {
        await userRolesRepository.addRole(
          {
            userId: userResponse.data.id,
            role,
          },
          logger,
        );
      } else {
        logger.debug(
          "Skipping platform marker assignment - markers are never stored in database",
          { role },
        );
      }

      // Note: Free credits are automatically created for the lead when it's first accessed
      // No need to manually add credits here - the lead already has 20 free credits
      // from when it was created (in getOrCreateLeadByIp or getLeadBalance)

      logger.debug("User created successfully", {
        email,
        userId: userResponse.data.id,
        leadId,
      });

      // Link leadId to user (always happens during signup)
      await this.handleLeadConversion(
        email,
        leadId,
        userResponse.data.id,
        { id: userResponse.data.id, isPublic: false, leadId },
        locale,
        logger,
      );

      // Handle newsletter subscription if user opted in
      if (subscribeToNewsletter) {
        // Newsletter subscription temporarily disabled during repository migration
        logger.debug(
          "Newsletter subscription requested but temporarily disabled",
          { email },
        );
      }

      return success(userResponse.data);
    } catch (error) {
      logger.error("User creation error", parseError(error));
      return fail({
        message: "app.api.v1.core.user.public.signup.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          email: userInput.personalInfo.email,
          error: parseError(error).message,
        },
      });
    }
  }

  /**
   * Internal helper: Check if email is already registered
   * @param email - Email to check
   * @param logger - Logger instance
   * @returns Success or error result with boolean indicating if email exists
   */
  private async checkEmailAvailabilityInternal(
    email: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      const existingUserResponse = await userRepository.getUserByEmail(
        email,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      return success(existingUserResponse.success); // true if email exists
    } catch (error) {
      logger.error("Error checking email registration", parseError(error));
      return fail({
        message:
          "app.api.v1.core.user.public.signup.emailCheck.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message, email },
      });
    }
  }

  /**
   * Handle lead conversion when user signs up
   * @param email - User email
   * @param leadId - Lead ID from tracking if available
   * @param userId - Created user ID
   * @param logger - Logger instance
   */
  private async handleLeadConversion(
    email: string,
    leadId: string,
    userId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("Converting lead during user signup", {
        leadId,
        email,
        userId,
      });

      // Convert lead with both email (for anonymous leads) and userId (for user relationship)
      const convertResult = await leadsRepository.convertLead(
        leadId,
        { email, userId },
        user,
        locale,
        logger,
      );

      if (convertResult.success) {
        logger.debug("Lead conversion completed successfully", {
          leadId,
          email,
          userId,
          convertedLead: convertResult.data,
        });
      } else {
        logger.error("Lead conversion failed", {
          leadId,
          email,
          userId,
          error: convertResult.message,
          errorType: convertResult.errorType,
        });
      }
    } catch (error) {
      // Don't fail user registration if lead conversion fails
      logger.error("Lead conversion failed", {
        email,
        userId,
        leadId,
        error: parseError(error).message,
      });
    }
  }
}

// Export singleton instance of the repository
export const signupRepository = new SignupRepositoryImpl();
