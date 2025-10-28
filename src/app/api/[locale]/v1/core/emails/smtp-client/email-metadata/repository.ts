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

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../user/auth/types";
import { emails } from "../../messages/db";
import { EmailStatus } from "../../messages/enum";
import type {
  StoreEmailMetadataRequestOutput,
  StoreEmailMetadataResponseOutput,
  UpdateEmailEngagementRequestOutput,
  UpdateEmailEngagementResponseOutput,
} from "./types";

/**
 * Email Metadata Repository Interface
 */
export interface EmailMetadataRepository {
  storeEmailMetadata(
    data: StoreEmailMetadataRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<StoreEmailMetadataResponseOutput>>;

  updateEmailEngagement(
    data: UpdateEmailEngagementRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UpdateEmailEngagementResponseOutput>>;
}

/**
 * Email Metadata Repository Implementation
 */
export class EmailMetadataRepositoryImpl implements EmailMetadataRepository {
  /**
   * Store email metadata in the database
   */
  async storeEmailMetadata(
    data: StoreEmailMetadataRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<StoreEmailMetadataResponseOutput>> {
    try {
      logger.debug("Storing email metadata", {
        recipient: data.params.recipientEmail,
        subject: data.params.subject,
        type: data.params.type,
        status: data.params.status,
      });

      // Clean metadata to remove undefined values
      const cleanMetadata: Record<string, string | number | boolean> = {};
      if (data.params.metadata) {
        for (const [key, value] of Object.entries(data.params.metadata)) {
          if (
            value !== undefined &&
            (typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean")
          ) {
            cleanMetadata[key] = value;
          }
        }
      }

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
        "app.api.v1.core.emails.smtpClient.emailMetadata.errors.server.title",
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
    data: UpdateEmailEngagementRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<UpdateEmailEngagementResponseOutput>> {
    try {
      logger.debug("Updating email engagement", {
        emailId: data.params.emailId,
      });

      const updateData: {
        deliveredAt?: Date;
        openedAt?: Date;
        clickedAt?: Date;
        bouncedAt?: Date;
        unsubscribedAt?: Date;
        status?:
          | typeof EmailStatus.BOUNCED
          | typeof EmailStatus.UNSUBSCRIBED
          | typeof EmailStatus.FAILED
          | typeof EmailStatus.SENT
          | typeof EmailStatus.DELIVERED;
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
        "app.api.v1.core.emails.smtpClient.emailMetadata.errors.server.title",
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
