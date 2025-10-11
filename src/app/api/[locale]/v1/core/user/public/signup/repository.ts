/**
 * Signup Repository
 * Handles user registration and email checking with EndpointLogger pattern
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { leadsRepository } from "@/app/api/[locale]/v1/core/leads/repository";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

// import { newsletterSubscribeRepository } from "../../../../newsletter/subscribe/repository";
import type { JwtPayloadType } from "../../auth/definition";
import type { StandardUserType } from "../../definition";
import { UserDetailLevel } from "../../enum";
import { userRepository } from "../../repository";
import { UserRole, type UserRoleValue } from "../../user-roles/enum";
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
   * @returns Success or error result
   */
  registerUser(
    data: SignupPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
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
   * @returns Success or error result
   */
  async registerUser(
    data: SignupPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SignupPostResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      logger.debug("Registering new user", { email: data.personalInfo.email });

      // Validate password match
      if (data.security.password !== data.security.confirmPassword) {
        logger.debug("Registration failed: Passwords do not match", {
          email: data.personalInfo.email,
        });
        return createErrorResponse(
          "auth.errors.validation_failed",
          ErrorResponseTypes.VALIDATION_ERROR,
          {
            field: "confirmPassword",
            message: t(
              "app.api.v1.core.user.public.signup.fields.confirmPassword.validation.mismatch",
            ),
          },
        );
      }

      // Check if email already exists
      const emailCheckResponse = await this.checkEmailAvailabilityInternal(
        data.personalInfo.email,
        logger,
      );
      if (!emailCheckResponse.success) {
        return emailCheckResponse;
      }
      if (emailCheckResponse.data) {
        return createErrorResponse(
          "app.api.v1.core.user.public.signup.errors.conflict.title",
          ErrorResponseTypes.VALIDATION_ERROR,
          {
            field: "email",
            message: t("app.api.v1.core.user.errors.emailAlreadyInUse"),
          },
        );
      }

      // Create the user account
      const result = await this.createUserInternal(data, locale, logger);

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
      });

      return createSuccessResponse<SignupPostResponseOutput>({
        response: {
          success: true,
          message: "app.api.v1.core.user.public.signup.success.message",
          user: {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            imageUrl: userData.imageUrl || null,
            verificationRequired: false,
          },
          verificationInfo: {
            emailSent: false,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            checkSpamFolder: false,
          },
          nextSteps: [
            "app.api.v1.core.user.public.signup.success.nextSteps.profile",
            "app.api.v1.core.user.public.signup.success.nextSteps.explore",
          ],
        },
      });
    } catch (error) {
      logger.error("Registration error", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.user.public.signup.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { email: data.personalInfo.email, error: parsedError.message },
      );
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
        logger,
      );
      if (!isEmailTaken.success) {
        return isEmailTaken;
      }

      logger.debug("Email availability check completed", {
        email: data.email,
        available: !isEmailTaken.data,
      });

      return createSuccessResponse<SignupGetResponseOutput>({
        response: {
          available: !isEmailTaken.data, // false if taken, true if available
          message: isEmailTaken.data
            ? "app.api.v1.core.user.public.signup.emailCheck.taken"
            : "app.api.v1.core.user.public.signup.emailCheck.available",
        },
      });
    } catch (error) {
      logger.error("Error checking email availability", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.user.public.signup.emailCheck.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { email: data.email, error: parsedError.message },
      );
    }
  }

  /**
   * Internal helper: Create a new user account
   * @param userInput - User registration data
   * @param locale - User locale
   * @param logger - Logger instance
   * @param role - User role (default: CUSTOMER)
   * @returns Success or error result
   */
  private async createUserInternal(
    userInput: SignupPostRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
    role: typeof UserRoleValue = UserRole.CUSTOMER,
  ): Promise<ResponseType<StandardUserType>> {
    try {
      // Extract data from nested structure
      const email = userInput.personalInfo.email;
      const password = userInput.security.password;
      const firstName = userInput.personalInfo.firstName;
      const lastName = userInput.personalInfo.lastName;
      const imageUrl =
        (userInput.personalInfo as { imageUrl?: string })?.imageUrl || null;
      const confirmPassword = userInput.security.confirmPassword;
      const preferredContactMethod =
        userInput.preferences?.preferredContactMethod || [];
      const company = userInput.businessInfo?.company || null;
      const phone = userInput.businessInfo?.phone || null;
      const subscribeToNewsletter =
        (userInput.preferences as { subscribeToNewsletter?: boolean })
          ?.subscribeToNewsletter || false;

      // Check if email is already registered
      const emailCheckResult = await this.checkEmailAvailabilityInternal(
        email,
        logger,
      );

      if (!emailCheckResult.success) {
        return emailCheckResult;
      }

      if (emailCheckResult.data) {
        logger.debug("Registration failed: Email already registered", {
          email,
        });
        return createErrorResponse(
          "app.api.v1.core.user.public.signup.errors.conflict.title",
          ErrorResponseTypes.VALIDATION_ERROR,
          { email },
        );
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        logger.debug("Registration failed: Passwords do not match", { email });
        return createErrorResponse(
          "auth.errors.validation_failed",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Create user data object
      const userData = {
        email,
        password,
        firstName,
        lastName,
        imageUrl: imageUrl ?? undefined,
        preferredContactMethod,
        company,
        phone,
      };

      // Create new user with generated ID
      logger.debug("Creating new user", { email });

      const userResponse = await userRepository.createWithHashedPassword(
        {
          ...userData,
          company: userData.company || "",
        },
        logger,
      );
      if (!userResponse.success) {
        return userResponse;
      }

      // Add role
      await userRolesRepository.addRole(
        {
          userId: userResponse.data.id,
          role,
        },
        logger,
      );

      logger.debug("User created successfully", {
        email,
        userId: userResponse.data.id,
      });

      // Check for lead conversion (if user came from email campaign)
      const leadId = (userInput as { leadId?: string }).leadId;
      if (leadId) {
        await this.handleLeadConversion(
          email,
          leadId,
          userResponse.data.id,
          { id: userResponse.data.id, isPublic: false },
          locale,
          logger,
        );
      }

      // Handle newsletter subscription if user opted in
      if (subscribeToNewsletter) {
        // Newsletter subscription temporarily disabled during repository migration
        logger.debug(
          "Newsletter subscription requested but temporarily disabled",
          { email },
        );
      }

      return createSuccessResponse(userResponse.data);
    } catch (error) {
      logger.error("User creation error", error);
      return createErrorResponse(
        "app.api.v1.core.user.public.signup.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          email: userInput.personalInfo.email,
          error: parseError(error).message,
        },
      );
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
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      const existingUserResponse = await userRepository.getUserByEmail(
        email,
        UserDetailLevel.STANDARD,
        logger,
      );
      return createSuccessResponse(existingUserResponse.success); // true if email exists
    } catch (error) {
      logger.error("Error checking email registration", error);
      return createErrorResponse(
        "app.api.v1.core.user.public.signup.emailCheck.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message, email },
      );
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
