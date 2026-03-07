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

import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import { scopedTranslation as leadsScopedTranslation } from "@/app/api/[locale]/leads/i18n";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";
import { scopedTranslation as signupScopedTranslation } from "./i18n";
import type { scopedTranslation } from "./i18n";

import { AuthRepository } from "../../auth/repository";
import type { JwtPayloadType, JwtPrivatePayloadType } from "../../auth/types";
import { UserDetailLevel } from "../../enum";
import { SessionRepository } from "../../private/session/repository";
import { UserRepository } from "../../repository";
import type { StandardUserType } from "../../types";
import {
  UserPermissionRole,
  UserRole,
  type UserRoleValue,
  isUserPermissionRole,
} from "../../user-roles/enum";
import { UserRolesRepository } from "../../user-roles/repository";
import type {
  SignupPostRequestOutput,
  SignupPostResponseOutput,
} from "./definition";
import type { NewUser } from "../../db";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

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
   * @param request - Next.js request object (optional for CLI context)
   * @param platform - Platform context (web, cli, ai-tool, etc.)
   * @param t - Scoped translation function
   * @returns Success or error result
   */
  registerUser(
    data: SignupPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    request: NextRequest | undefined,
    platform: Platform,
    t: ModuleT,
  ): Promise<ResponseType<SignupPostResponseOutput>>;
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
    request: NextRequest | undefined,
    platform: Platform,
    t: ModuleT,
  ): Promise<ResponseType<SignupPostResponseOutput>> {
    try {
      // Extract fields from flat structure
      const email = data.email;
      const password = data.password;
      const confirmPassword = data.confirmPassword;
      const privateName = data.privateName;
      const publicName = data.publicName;
      const subscribeToNewsletter = data.subscribeToNewsletter ?? false;
      const referralCode = data.referralCode;

      logger.debug("Registering new user", { email });

      // Validate password match
      if (password !== confirmPassword) {
        logger.debug("Registration failed: Passwords do not match", {
          email,
        });
        return fail({
          message: t("fields.confirmPassword.validation.mismatch"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            field: "confirmPassword",
            message: t("fields.confirmPassword.validation.mismatch"),
          },
        });
      }

      // Check if email already exists
      const emailCheckResponse = await this.checkEmailAvailabilityInternal(
        email,
        locale,
        logger,
      );
      if (!emailCheckResponse.success) {
        return emailCheckResponse;
      }
      if (emailCheckResponse.data) {
        return fail({
          message: t("errors.conflict.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            field: "email",
            message: t("errors.conflict.description"),
          },
        });
      }

      // Create the user account with extracted data
      const result = await this.createUserInternal(
        { email, password, privateName, publicName, subscribeToNewsletter },
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
        email,
        userId: userData.id,
        leadId: user.leadId,
      });

      // Auto-login: Create session and store auth token
      // Link leadId to user
      const { LeadAuthRepository } =
        await import("@/app/api/[locale]/leads/auth/repository");
      await LeadAuthRepository.linkLeadToUser(user.leadId, userData.id, logger);

      // Link referral code if provided manually in form
      const { ReferralRepository } =
        await import("../../../referral/repository");
      if (referralCode) {
        logger.debug("Linking manual referral code to lead", {
          referralCode,
          leadId: user.leadId,
        });
        await ReferralRepository.linkReferralToLead(
          user.leadId,
          referralCode,
          logger,
          locale,
        );
      }

      // Convert lead referral to user referral (Phase 2: make referral permanent)
      await ReferralRepository.convertLeadReferralToUser(
        userData.id,
        user.leadId,
        logger,
        locale,
      );

      // Merge lead wallet into user wallet immediately (not lazy)
      // This ensures user gets their pre-signup credits right away
      const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
      const { CreditRepository } =
        await import("@/app/api/[locale]/credits/repository");
      const mergeResult = await CreditRepository.mergePendingLeadWallets(
        userData.id,
        [user.leadId],
        logger,
        creditsT,
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
      const leadIdResult = await LeadAuthRepository.getAuthenticatedUserLeadId(
        userData.id,
        user.leadId,
        locale,
        logger,
      );

      // Fetch user roles from DB to include in JWT
      const rolesResult = await UserRolesRepository.getUserRoles(
        userData.id,
        logger,
        locale,
      );
      // Default to CUSTOMER role if roles fetch fails
      const roles = rolesResult.success
        ? rolesResult.data
        : [UserPermissionRole.CUSTOMER];

      if (!rolesResult.success) {
        logger.warn(
          "Failed to fetch user roles for JWT after signup, using default CUSTOMER role",
          {
            userId: userData.id,
          },
        );
      }

      // Create JWT payload with roles
      const tokenPayload: JwtPrivatePayloadType = {
        id: userData.id,
        leadId: leadIdResult.leadId,
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
        await SessionRepository.create(sessionData, locale);

        // Store auth token using platform-specific handler
        const storeResult = await AuthRepository.storeAuthTokenForPlatform(
          tokenResponse.data,
          userData.id,
          leadIdResult.leadId,
          platform,
          logger,
          locale,
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

      // Log warning if credit merge failed - user should contact support
      if (creditMergeFailed) {
        logger.warn(
          "User registered but credit merge failed - manual intervention may be needed",
          {
            userId: userData.id,
          },
        );
      }

      // Return simple message response
      return success<SignupPostResponseOutput>({
        message: "Registration successful",
      });
    } catch (error) {
      logger.error("Registration error", parseError(error));
      const parsedError = parseError(error);
      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          email: data.email ?? "unknown",
          error: parsedError.message,
        },
      });
    }
  }

  /**
   * Internal helper: Create a new user account
   * @param userInput - User registration data (extracted from form)
   * @param leadId - Lead ID from JWT payload
   * @param locale - User locale
   * @param logger - Logger instance
   * @param role - User role (default: CUSTOMER)
   * @returns Success or error result
   */
  private async createUserInternal(
    userInput: {
      email: string;
      password: string;
      privateName: string;
      publicName: string;
      subscribeToNewsletter: boolean;
    },
    leadId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
    role: UserRoleValue = UserRole.CUSTOMER,
  ): Promise<ResponseType<StandardUserType>> {
    try {
      const {
        email,
        password,
        privateName,
        publicName,
        subscribeToNewsletter,
      } = userInput;

      // Create user data object
      const userData: NewUser = {
        email,
        password,
        privateName,
        publicName,
        locale,
        marketingConsent: subscribeToNewsletter,
        isActive: true,
      };

      // Create new user with generated ID
      logger.debug("Creating new user", { email });

      const userResponse = await UserRepository.createWithHashedPassword(
        userData,
        logger,
        locale,
      );
      if (!userResponse.success) {
        return userResponse;
      }

      // Only assign permission roles to users, never platform markers
      // Platform markers (CLI_OFF, CLI_AUTH_BYPASS, etc.) are config-only markers
      if (isUserPermissionRole(role)) {
        await UserRolesRepository.addRole(
          {
            userId: userResponse.data.id,
            role,
          },
          logger,
          locale,
        );
      } else {
        logger.debug(
          "Skipping platform marker assignment - markers are never stored in database",
          {
            role,
          },
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

      // Fetch user roles for lead conversion tracking
      const userRolesResult = await UserRolesRepository.getUserRoles(
        userResponse.data.id,
        logger,
        locale,
      );
      const userRoles = userRolesResult.success
        ? userRolesResult.data
        : [UserPermissionRole.CUSTOMER];

      // Link leadId to user (always happens during signup)
      await this.handleLeadConversion(
        email,
        leadId,
        userResponse.data.id,
        { id: userResponse.data.id, isPublic: false, leadId, roles: userRoles },
        locale,
        logger,
      );

      return success(userResponse.data);
    } catch (error) {
      logger.error("User creation error", parseError(error));
      const { t: errT } = signupScopedTranslation.scopedT(locale);
      return fail({
        message: errT("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          email: userInput.email,
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
      const existingUserResponse = await UserRepository.getUserByEmail(
        email,
        UserDetailLevel.STANDARD,
        locale,
        logger,
      );
      return success(existingUserResponse.success); // true if email exists
    } catch (error) {
      logger.error("Error checking email registration", parseError(error));
      const { t: checkErrT } = signupScopedTranslation.scopedT(locale);
      return fail({
        message: checkErrT("emailCheck.errors.internal.title"),
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
      const { t: leadsT } = leadsScopedTranslation.scopedT(locale);
      const { LeadsRepository } =
        await import("@/app/api/[locale]/leads/repository");
      const convertResult = await LeadsRepository.convertLead(
        leadId,
        { email, userId },
        logger,
        leadsT,
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
