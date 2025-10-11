/**
 * Email Metadata Repository
 * Stores email metadata in the database for tracking and analytics
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { db } from "@/app/api/[locale]/v1/core/system/db";

import type {
  JwtPayloadType,
} from "../../../user/auth/definition";
import { emails } from "../../messages/db";
import { EmailStatus } from "../../messages/enum";
import type {
  StoreEmailMetadataParams,
  StoreEmailMetadataRequestTypeOutput,
  StoreEmailMetadataResponseTypeOutput,
  UpdateEmailEngagementParams,
  UpdateEmailEngagementRequestTypeOutput,
  UpdateEmailEngagementResponseTypeOutput,
} from "./definition";
import { CountryLanguage } from "@/i18n/core/config";

/**
 * Email Metadata Repository Interface
 */
export interface EmailMetadataRepository {
  storeEmailMetadata(
    data: StoreEmailMetadataRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<StoreEmailMetadataResponseTypeOutput>>;

  updateEmailEngagement(
    data: UpdateEmailEngagementRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UpdateEmailEngagementResponseTypeOutput>>;
}

/**
 * Email Metadata Repository Implementation
 */
export class EmailMetadataRepositoryImpl implements EmailMetadataRepository {
  /**
   * Store email metadata in the database
   */
  async storeEmailMetadata(
    data: StoreEmailMetadataRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<StoreEmailMetadataResponseTypeOutput>> {
    try {
      logger.debug("Storing email metadata", {
        recipient: data.params.recipientEmail,
        subject: data.params.subject,
        type: data.params.type,
        status: data.params.status,
      });

      // Clean metadata to remove undefined values
      const cleanMetadata: Record<string, string | number | boolean> = data
        .params.metadata
        ? (Object.fromEntries(
            Object.entries(data.params.metadata).filter(
              ([, value]) => value !== undefined,
            ),
          ) as Record<string, string | number | boolean>)
        : {};

      await db.insert(emails).values({
        subject: data.params.subject,
        recipientEmail: data.params.recipientEmail,
        recipientName: data.params.recipientName,
        senderEmail: data.params.senderEmail,
        senderName: data.params.senderName,
        type: data.params.type,
        templateName: data.params.templateName,
        status: data.params.status,
        sentAt: data.params.sentAt,
        deliveredAt: data.params.deliveredAt,
        openedAt: data.params.openedAt,
        clickedAt: data.params.clickedAt,
        bouncedAt: data.params.bouncedAt,
        unsubscribedAt: data.params.unsubscribedAt,
        error: data.params.error,
        retryCount: data.params.retryCount || "0",
        emailProvider: data.params.emailProvider,
        externalId: data.params.externalId,
        userId: data.params.userId,
        leadId: data.params.leadId,
        metadata: cleanMetadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      logger.debug("Email metadata stored successfully", {
        recipient: data.params.recipientEmail,
        subject: data.params.subject,
      });

      return createSuccessResponse({ success: true });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to store email metadata", parsedError.message, {
        recipient: data.params.recipientEmail,
        subject: data.params.subject,
        error: parsedError.message,
      });

      return createErrorResponse(
        "email.metadata.store.failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          recipient: data.params.recipientEmail,
          error: parsedError.message,
        },
      );
    }
  }

  /**
   * Update email engagement status (opened, clicked, etc.)
   */
  async updateEmailEngagement(
    data: UpdateEmailEngagementRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UpdateEmailEngagementResponseTypeOutput>> {
    try {
      logger.debug("Updating email engagement", {
        emailId: data.params.emailId,
        engagement: data.params.engagement,
      });

      const updateData: {
        deliveredAt?: Date;
        openedAt?: Date;
        clickedAt?: Date;
        bouncedAt?: Date;
        unsubscribedAt?: Date;
        status?: EmailStatus;
        updatedAt: Date;
      } = {
        updatedAt: new Date(),
      };

      if (data.params.engagement.deliveredAt) {
        updateData.deliveredAt = data.params.engagement.deliveredAt;
        // Only update status to DELIVERED if it's currently PENDING
        // Don't overwrite SENT status
      }

      if (data.params.engagement.openedAt) {
        updateData.openedAt = data.params.engagement.openedAt;
        // Don't change status - opened emails should remain SENT
      }

      if (data.params.engagement.clickedAt) {
        updateData.clickedAt = data.params.engagement.clickedAt;
        // Don't change status - clicked emails should remain SENT
      }

      if (data.params.engagement.bouncedAt) {
        updateData.bouncedAt = data.params.engagement.bouncedAt;
        updateData.status = EmailStatus.BOUNCED; // This is a failure state
      }

      if (data.params.engagement.unsubscribedAt) {
        updateData.unsubscribedAt = data.params.engagement.unsubscribedAt;
        updateData.status = EmailStatus.UNSUBSCRIBED; // This is a final state
      }

      // Only allow status updates for failure/final states
      // Don't overwrite SENT status with engagement statuses
      if (
        data.params.engagement.status &&
        (data.params.engagement.status === EmailStatus.BOUNCED ||
          data.params.engagement.status === EmailStatus.UNSUBSCRIBED ||
          data.params.engagement.status === EmailStatus.FAILED)
      ) {
        updateData.status = data.params.engagement.status;
      }

      await db
        .update(emails)
        .set(updateData)
        .where(eq(emails.id, data.params.emailId));

      logger.debug("Email engagement updated successfully", {
        emailId: data.params.emailId,
      });

      return createSuccessResponse({ success: true });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update email engagement", parsedError.message, {
        emailId: data.params.emailId,
        error: parsedError.message,
      });

      return createErrorResponse(
        "email.engagement.update.failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          emailId: data.params.emailId,
          error: parsedError.message,
        },
      );
    }
  }
}

export const emailMetadataRepository = new EmailMetadataRepositoryImpl();
