import { eq } from "drizzle-orm";
import { withTransaction } from "next-vibe/server/db/repository-helpers";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { consultationCreateRepository } from "../consultation/create/repository";
import { CheckoutMode } from "../payment/enum";
import { paymentRepository } from "../payment/repository";
import { type NewOnboarding, onboarding } from "./db";
import type {
  OnboardingGetResponseTypeOutput,
  OnboardingPostRequestTypeOutput,
  OnboardingPostResponseTypeOutput,
  OnboardingStatusResponseType,
  OnboardingType,
} from "./definition";

// Constants for onboarding steps
const BUSINESS_DATA_STEP = "business_data";
const PLAN_SELECTION_STEP = "plan_selection";

export interface OnboardingRepository {
  /**
   * Get onboarding data for a user
   */
  getOnboarding(
    userId: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<OnboardingGetResponseTypeOutput>>;

  /**
   * Update onboarding data for a user
   */
  updateOnboarding(
    userId: string,
    data: OnboardingPostRequestTypeOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<OnboardingPostResponseTypeOutput>>;

  /**
   * Complete onboarding process for a user
   */
  completeOnboarding(
    userId: string,
    user: JwtPayloadType,
    data: OnboardingPostRequestTypeOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<OnboardingPostResponseTypeOutput>>;

  /**
   * Get onboarding status for a user
   */
  getOnboardingStatus(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<OnboardingStatusResponseType>>;

  /**
   * Process a payment during onboarding
   */
  processOnboardingPayment(
    userId: string,
    data: OnboardingType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ paymentUrl: string }>>;

  /**
   * Request a consultation during onboarding
   */
  requestOnboardingConsultation(
    userId: string,
    data: {
      name: string;
      email: string;
      businessType: string;
      phone?: string;
      preferredDate?: string;
      preferredTime?: string;
      message?: string;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<{ consultationId: string }>>;
}

export class OnboardingRepositoryImpl implements OnboardingRepository {
  /**
   * Get onboarding status for a user
   */
  async getOnboardingStatus(
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<OnboardingStatusResponseType>> {
    try {
      if (!userId) {
        return createErrorResponse(
          "app.api.v1.core.onboarding.errors.authenticationRequired.title",
          ErrorResponseTypes.UNAUTHORIZED,
          { operation: "getOnboardingStatus" },
        );
      }

      const result = await db
        .select({
          userId: onboarding.userId,
          isCompleted: onboarding.isCompleted,
          currentStep: onboarding.currentStep,
          completedSteps: onboarding.completedSteps,
        })
        .from(onboarding)
        .where(eq(onboarding.userId, userId))
        .limit(1);

      const onboardingData = result[0];

      if (!onboardingData) {
        const defaultData: OnboardingStatusResponseType = {
          userId,
          isCompleted: false,
          currentStep: "profile",
          completedSteps: [],
        };

        await db.insert(onboarding).values({
          userId,
          isCompleted: defaultData.isCompleted,
          currentStep: defaultData.currentStep,
          completedSteps: defaultData.completedSteps,
        });

        return createSuccessResponse(defaultData);
      }

      return createSuccessResponse({
        userId: onboardingData.userId,
        isCompleted: onboardingData.isCompleted,
        currentStep: onboardingData.currentStep,
        completedSteps: onboardingData.completedSteps,
      });
    } catch (error) {
      logger.error("Failed to get onboarding status", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.onboarding.errors.dataFetchFailed.title",
        ErrorResponseTypes.DATABASE_ERROR,
        {
          operation: "getOnboardingStatus",
          userId,
          error: parsedError.message,
        },
      );
    }
  }

  /**
   * Get onboarding with business logic
   */
  async getOnboarding(
    userId: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<OnboardingGetResponseTypeOutput>> {
    try {
      // Check permissions - only allow access to own data
      const currentUserId = user.id;
      if (currentUserId !== userId) {
        return createErrorResponse(
          "app.api.v1.core.onboarding.errors.unauthorized.title",
          ErrorResponseTypes.UNAUTHORIZED,
          { userId },
        );
      }

      logger.debug({ userId });

      // Retrieve the onboarding data from database
      const result = await db
        .select()
        .from(onboarding)
        .where(eq(onboarding.userId, userId))
        .limit(1);

      const onboardingDataResult = result[0];

      if (!onboardingDataResult) {
        // Create default onboarding data
        const defaultData = {
          userId,
          isCompleted: false,
          currentStep: "profile" as const,
          completedSteps: [],
        };

        await db.insert(onboarding).values({
          userId,
          isCompleted: defaultData.isCompleted,
          currentStep: defaultData.currentStep,
          completedSteps: defaultData.completedSteps,
        });

        return createSuccessResponse(defaultData);
      }

      return createSuccessResponse(onboardingDataResult);
    } catch (error) {
      logger.error("Failed to get onboarding data", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.onboarding.errors.unexpected.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId, error: parsedError.message },
      );
    }
  }

  /**
   * Update onboarding with business logic
   */
  async updateOnboarding(
    userId: string,
    data: OnboardingPostRequestTypeOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<OnboardingPostResponseTypeOutput>> {
    try {
      return await withTransaction(async () => {
        // Check permissions - only allow access to own data
        const currentUserId = user.id;
        if (currentUserId !== userId) {
          return createErrorResponse(
            "app.api.v1.core.onboarding.errors.unauthorized.title",
            ErrorResponseTypes.UNAUTHORIZED,
            { userId },
          );
        }

        logger.debug({ userId, data });

        // Check if record exists
        const existingResult = await db
          .select()
          .from(onboarding)
          .where(eq(onboarding.userId, userId))
          .limit(1);

        const existingData = existingResult[0];

        if (!existingData) {
          // Create new record with only valid fields
          const insertResult = await db
            .insert(onboarding)
            .values({
              userId,
              currentStep: data.currentStep || "profile",
              completedSteps: data.completedSteps || [],
              isCompleted: data.isCompleted || false,
            })
            .returning();

          const newRecord = insertResult[0];
          if (!newRecord) {
            return createErrorResponse(
              "app.api.v1.core.onboarding.errors.unexpected.title",
              ErrorResponseTypes.DATABASE_ERROR,
              { userId },
            );
          }

          return createSuccessResponse({
            id: newRecord.id,
            userId: newRecord.userId,
            currentStep: newRecord.currentStep,
            completedSteps: newRecord.completedSteps,
            isCompleted: newRecord.isCompleted,
            createdAt: newRecord.createdAt,
            updatedAt: newRecord.updatedAt,
          });
        }

        // Update existing record with only valid fields
        const dataToUpdate: Partial<NewOnboarding> = {
          updatedAt: new Date(),
        };

        if (data.currentStep !== undefined) {
          dataToUpdate.currentStep = data.currentStep;
        }
        if (data.completedSteps !== undefined) {
          dataToUpdate.completedSteps = data.completedSteps;
        }
        if (data.isCompleted !== undefined) {
          dataToUpdate.isCompleted = data.isCompleted;
        }

        const updateResult = await db
          .update(onboarding)
          .set(dataToUpdate)
          .where(eq(onboarding.userId, userId))
          .returning();

        const updatedRecord = updateResult[0];
        if (!updatedRecord) {
          return createErrorResponse(
            "app.api.v1.core.onboarding.errors.unexpected.title",
            ErrorResponseTypes.DATABASE_ERROR,
            { userId },
          );
        }

        return createSuccessResponse({
          id: updatedRecord.id,
          userId: updatedRecord.userId,
          currentStep: updatedRecord.currentStep,
          completedSteps: updatedRecord.completedSteps,
          isCompleted: updatedRecord.isCompleted,
          createdAt: updatedRecord.createdAt,
          updatedAt: updatedRecord.updatedAt,
        });
      });
    } catch (error) {
      logger.error("Failed to update onboarding", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.onboarding.errors.unexpected.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId, error: parsedError.message },
      );
    }
  }

  /**
   * Process a payment during onboarding
   */
  async processOnboardingPayment(
    userId: string,
    data: OnboardingType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ paymentUrl: string }>> {
    try {
      logger.debug({ userId });

      // Create a payment request using the payment repository
      const paymentResponse = await paymentRepository.createPaymentSession(
        userId,
        {
          amount: 1000, // Default amount in cents (since data doesn't have amount)
          currency: data.currency,
          mode: CheckoutMode.PAYMENT,
          metadata: {
            planId: data.planId,
            name: data.name,
            email: data.email,
            address: data.address || "",
            city: data.city || "",
            postalCode: data.postalCode,
            country: data.country,
          },
        },
        locale,
      );

      if (!paymentResponse.success) {
        return createErrorResponse(
          paymentResponse.message ||
            "app.api.v1.core.onboarding.errors.paymentProcessingFailed.title",
          ErrorResponseTypes.PAYMENT_ERROR,
          {
            error: paymentResponse.message || "",
            planId: data.planId,
          },
        );
      }
      if (!paymentResponse.data?.checkoutUrl) {
        return createErrorResponse(
          "app.api.v1.core.onboarding.errors.paymentUrlMissing.title",
          ErrorResponseTypes.PAYMENT_ERROR,
          {
            planId: data.planId,
          },
        );
      }

      return createSuccessResponse({
        paymentUrl: paymentResponse.data.checkoutUrl,
      });
    } catch (error) {
      logger.error("Failed to process onboarding payment", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.onboarding.errors.paymentProcessingFailed.title",
        ErrorResponseTypes.PAYMENT_ERROR,
        {
          operation: "processOnboardingPayment",
          userId,
          error: parsedError.message,
        },
      );
    }
  }

  /**
   * Request a consultation during onboarding
   */
  async requestOnboardingConsultation(
    userId: string,
    data: {
      name: string;
      email: string;
      businessType: string;
      phone?: string;
      preferredDate?: string;
      preferredTime?: string;
      message?: string;
    },
    logger: EndpointLogger,
  ): Promise<ResponseType<{ consultationId: string }>> {
    try {
      logger.debug({ userId });

      // Create a consultation request using the consultation repository
      const consultationResponse =
        await consultationCreateRepository.createOnboardingConsultation(
          {
            preferredDate: data.preferredDate,
            preferredTime: data.preferredTime,
            message: data.message || "",
          },
          userId,
          logger,
        );

      if (
        !consultationResponse.success ||
        !consultationResponse.data?.consultationId
      ) {
        return createErrorResponse(
          consultationResponse.message ||
            "app.api.v1.core.onboarding.errors.consultationRequestFailed.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: consultationResponse.message || "" },
        );
      }

      return createSuccessResponse({
        consultationId: consultationResponse.data.consultationId,
      });
    } catch (error) {
      logger.error("Failed to request onboarding consultation", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.onboarding.errors.consultationRequestFailed.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          operation: "requestOnboardingConsultation",
          userId,
          error: parsedError.message,
        },
      );
    }
  }

  /**
   * Complete onboarding process for a user
   */
  async completeOnboarding(
    userId: string,
    user: JwtPayloadType,
    data: OnboardingPostRequestTypeOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<OnboardingPostResponseTypeOutput>> {
    try {
      return await withTransaction(async () => {
        const currentUserId = user.id;
        if (currentUserId !== userId) {
          return createErrorResponse(
            "app.api.v1.core.onboarding.errors.unauthorized.title",
            ErrorResponseTypes.UNAUTHORIZED,
            { userId },
          );
        }

        logger.debug({ userId });

        // Get current onboarding status
        const existingResult = await db
          .select()
          .from(onboarding)
          .where(eq(onboarding.userId, userId))
          .limit(1);

        const existingRecord = existingResult[0];

        if (!existingRecord) {
          return createErrorResponse(
            "app.api.v1.core.onboarding.errors.notFound.title",
            ErrorResponseTypes.NOT_FOUND,
            { userId },
          );
        }

        // Mark onboarding as completed
        const completionData: Partial<NewOnboarding> = {
          currentStep: "complete",
          isCompleted: true,
          completedSteps: [
            ...existingRecord.completedSteps,
            BUSINESS_DATA_STEP,
            PLAN_SELECTION_STEP,
          ].filter((step, index, arr) => arr.indexOf(step) === index), // Remove duplicates
          updatedAt: new Date(),
        };

        // Override with provided data if available
        if (data) {
          if (data.currentStep !== undefined) {
            completionData.currentStep = data.currentStep;
          }
          if (data.completedSteps !== undefined) {
            completionData.completedSteps = data.completedSteps;
          }
          if (data.isCompleted !== undefined) {
            completionData.isCompleted = data.isCompleted;
          }
        }

        const updateResult = await db
          .update(onboarding)
          .set(completionData)
          .where(eq(onboarding.userId, userId))
          .returning();

        const updatedRecord = updateResult[0];
        if (!updatedRecord) {
          return createErrorResponse(
            "app.api.v1.core.onboarding.errors.unexpected.title",
            ErrorResponseTypes.DATABASE_ERROR,
            { userId },
          );
        }

        logger.debug({
          userId,
          completedSteps: updatedRecord.completedSteps,
        });

        return createSuccessResponse({
          id: updatedRecord.id,
          userId: updatedRecord.userId,
          currentStep: updatedRecord.currentStep,
          completedSteps: updatedRecord.completedSteps,
          isCompleted: updatedRecord.isCompleted,
          createdAt: updatedRecord.createdAt,
          updatedAt: updatedRecord.updatedAt,
        });
      });
    } catch (error) {
      logger.error("Failed to complete onboarding", error);
      const parsedError = parseError(error);
      return createErrorResponse(
        "app.api.v1.core.onboarding.errors.unexpected.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { userId, error: parsedError.message },
      );
    }
  }
}

// Export a singleton instance of the repository
export const onboardingRepository = new OnboardingRepositoryImpl();
