/**
 * Consultation Create Repository
 * Handles database operations for consultation creation
 */

import "server-only";

import { withTransaction } from "next-vibe/server/db/repository-helpers";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { getDefaultTimezone } from "@/i18n/core/localization-utils";
import { simpleT } from "@/i18n/core/shared";

import { LeadTrackingRepository } from "../../leads/tracking/repository";
import type { JwtPrivatePayloadType } from "../../user/auth/definition";
import { UserDetailLevel } from "../../user/enum";
import { userRepository } from "../../user/repository";
import { consultations } from "../db";
import { ConsultationStatus } from "../enum";
import { consultationValidationRepository } from "../repository";
import type {
  ConsultationCreateRequestTypeOutput,
  ConsultationCreateResponseTypeOutput,
} from "./definition";
// Define the type locally since it's not exported from repository
interface OnboardingConsultationRequestType {
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}

/**
 * Consultation Create Repository Interface
 */
export interface ConsultationCreateRepository {
  createConsultation(
    data: ConsultationCreateRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationCreateResponseTypeOutput>>;

  /**
   * Create onboarding consultation (simpler version)
   */
  createOnboardingConsultation(
    data: OnboardingConsultationRequestType,
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ consultationId: string }>>;
}

/**
 * Consultation Create Repository Implementation
 */
export class ConsultationCreateRepositoryImpl
  implements ConsultationCreateRepository
{
  async createConsultation(
    data: ConsultationCreateRequestTypeOutput,
    user: JwtPrivatePayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ConsultationCreateResponseTypeOutput>> {
    const { t } = simpleT(locale);

    const userId = authRepository.requireUserId(user);

    try {
      return await withTransaction(logger, async () => {
        logger.debug("app.api.v1.core.consultation.create.debug.creating", {
          userId,
          data,
        });

        // Validate booking time if both date and time are provided
        if (data.preferredDate && data.preferredTime) {
          const validation =
            consultationValidationRepository.validateBookingTime(
              data.preferredDate,
              data.preferredTime,
              getDefaultTimezone(locale),
            );

          if (!validation.success) {
            logger.debug(
              "app.api.v1.core.consultation.create.debug.validationFailed",
              validation,
            );
            return validation;
          }
        }

        // Prepare the consultation data
        const consultationData = {
          userId,
          preferredDate: data.preferredDate
            ? new Date(data.preferredDate)
            : null,
          preferredTime: data.preferredTime || null,
          message: data.message,
          status: ConsultationStatus.PENDING,
        };

        logger.debug("Consultation data prepared", consultationData);

        // Store consultation in database
        const [consultation] = await db
          .insert(consultations)
          .values(consultationData)
          .returning();

        logger.debug("Consultation inserted", { consultation });

        if (!consultation) {
          logger.debug("No consultation returned from insert");
          return createErrorResponse(
            "app.api.v1.core.consultation.create.errors.database.title",
            ErrorResponseTypes.INTERNAL_ERROR,
          );
        }

        logger.debug("Consultation created successfully", {
          consultationId: consultation.id,
        });

        // Track consultation booking for lead conversion metrics
        await this.trackConsultationBooking(userId, logger);

        return createSuccessResponse({
          response: {
            consultationId: consultation.id,
            message: t("app.api.v1.core.consultation.create.success.message"),
          },
        });
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(
        "app.api.v1.core.consultation.create.errors.database.title",
        {
          error: parsedError.message,
        },
      );

      return createErrorResponse(
        "app.api.v1.core.consultation.create.errors.database.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parsedError.message },
      );
    }
  }

  /**
   * Track consultation booking for lead conversion metrics
   * @param userId - User ID who booked the consultation
   */
  private async trackConsultationBooking(
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      logger.debug("Tracking consultation booking for lead metrics", {
        userId,
      });

      // Get user details to find associated lead
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.STANDARD,
        logger,
      );
      if (!userResponse.success) {
        logger.debug("User not found for consultation tracking", { userId });
        return;
      }

      const user = userResponse.data;

      // Only track if user has a leadId
      const leadId = user.leadId;

      if (!leadId) {
        logger.debug("No lead ID available for consultation tracking", {
          userId,
        });
        return;
      }

      // Track consultation booking
      const trackingResult =
        await LeadTrackingRepository.trackConsultationBooking(leadId);

      if (trackingResult.success) {
        logger.debug("Consultation booking tracked successfully", {
          userId,
          leadId,
          email: user.email,
        });
      } else {
        logger.debug("Failed to track consultation booking", {
          userId,
          leadId,
          error: trackingResult.message,
        });
      }
    } catch (error) {
      // Don't fail consultation creation if tracking fails
      const trackingError = parseError(error);
      logger.error(
        "app.api.v1.core.consultation.create.errors.tracking.title",
        {
          userId,
          error: trackingError.message,
        },
      );
    }
  }

  /**
   * Create onboarding consultation (simpler version)
   */
  async createOnboardingConsultation(
    data: OnboardingConsultationRequestType,
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ consultationId: string }>> {
    try {
      logger.debug(
        "app.api.v1.core.consultation.create.debug.creatingOnboarding",
        {
          userId,
          data: JSON.stringify(data),
        },
      );

      // Validate user exists
      const userResponse = await userRepository.getUserById(
        userId,
        UserDetailLevel.STANDARD,
        logger,
      );
      if (!userResponse.success) {
        return createErrorResponse(
          "app.api.v1.core.consultation.create.errors.userNotFound.title",
          ErrorResponseTypes.NOT_FOUND,
          { userId },
        );
      }

      // Store consultation in database
      const [consultation] = await db
        .insert(consultations)
        .values({
          userId,
          preferredDate: data.preferredDate
            ? new Date(data.preferredDate)
            : null,
          preferredTime: data.preferredTime ?? null,
          message: data.message ?? "",
          status: ConsultationStatus.PENDING,
          isNotified: false,
        })
        .returning();

      if (!consultation) {
        return createErrorResponse(
          "app.api.v1.core.consultation.create.errors.database.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      return createSuccessResponse({
        consultationId: consultation.id,
      });
    } catch (error) {
      const onboardingError = parseError(error);
      logger.error(
        "app.api.v1.core.consultation.create.errors.database.title",
        {
          error: onboardingError.message,
        },
      );
      return createErrorResponse(
        "app.api.v1.core.consultation.create.errors.database.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: onboardingError.message },
      );
    }
  }
}

export const consultationCreateRepository =
  new ConsultationCreateRepositoryImpl();
