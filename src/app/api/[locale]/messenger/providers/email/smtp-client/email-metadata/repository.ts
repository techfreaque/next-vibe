/**
 * Email Metadata Repository
 * Stores email metadata in the database for tracking and analytics
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { emails } from "../../../../messages/db";
import type { MessageStatus, MessageType } from "../../../../messages/enum";
import { MessageStatus as MS } from "../../../../messages/enum";
import type { SmtpClientT } from "../i18n";

interface StoreEmailMetadataParams {
  subject: string;
  recipientEmail: string;
  recipientName: string | null;
  senderEmail: string;
  senderName: string | null;
  type: (typeof MessageType)[keyof typeof MessageType];
  templateName?: string | null;
  status: (typeof MessageStatus)[keyof typeof MessageStatus];
  sentAt?: Date | null;
  deliveredAt?: Date | null;
  openedAt?: Date | null;
  clickedAt?: Date | null;
  bouncedAt?: Date | null;
  unsubscribedAt?: Date | null;
  error?: string | null;
  retryCount?: string;
  emailProvider?: string | null;
  externalId?: string | null;
  userId?: string | null;
  leadId?: string | null;
  metadata?: Record<string, string | number | boolean | undefined>;
}

interface UpdateEmailEngagementParams {
  emailId: string;
  engagement: {
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    unsubscribedAt?: Date;
    status?: (typeof MessageStatus)[keyof typeof MessageStatus];
  };
}

interface EmailMetadataOperationResult {
  success: boolean;
}

export class EmailMetadataRepository {
  static async storeEmailMetadata(
    params: StoreEmailMetadataParams,
    logger: EndpointLogger,
    t: SmtpClientT,
  ): Promise<ResponseType<EmailMetadataOperationResult>> {
    try {
      logger.debug("Storing email metadata", {
        recipient: params.recipientEmail,
        subject: params.subject,
        type: params.type,
        status: params.status,
      });

      const cleanMetadata: Record<string, string | number | boolean> = {};
      if (params.metadata) {
        for (const [key, value] of Object.entries(params.metadata)) {
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
        subject: params.subject,
        recipientEmail: params.recipientEmail,
        recipientName: params.recipientName,
        senderEmail: params.senderEmail,
        senderName: params.senderName,
        type: params.type,
        templateName: params.templateName,
        status: params.status,
        sentAt: params.sentAt,
        deliveredAt: params.deliveredAt,
        openedAt: params.openedAt,
        clickedAt: params.clickedAt,
        bouncedAt: params.bouncedAt,
        unsubscribedAt: params.unsubscribedAt,
        error: params.error,
        retryCount: params.retryCount ?? "0",
        userId: params.userId,
        leadId: params.leadId,
        metadata: cleanMetadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      logger.debug("Email metadata stored successfully", {
        recipient: params.recipientEmail,
        subject: params.subject,
      });

      return success({ success: true });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to store email metadata", parsedError.message, {
        recipient: params.recipientEmail,
        subject: params.subject,
        error: parsedError.message,
      });

      return fail({
        message: t("emailMetadata.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          recipient: params.recipientEmail,
          error: parsedError.message,
        },
      });
    }
  }

  static async updateEmailEngagement(
    params: UpdateEmailEngagementParams,
    logger: EndpointLogger,
    t: SmtpClientT,
  ): Promise<ResponseType<EmailMetadataOperationResult>> {
    try {
      logger.debug("Updating email engagement", {
        emailId: params.emailId,
      });

      const updateData: {
        deliveredAt?: Date;
        openedAt?: Date;
        clickedAt?: Date;
        bouncedAt?: Date;
        unsubscribedAt?: Date;
        status?:
          | typeof MS.BOUNCED
          | typeof MS.UNSUBSCRIBED
          | typeof MS.FAILED
          | typeof MS.SENT
          | typeof MS.DELIVERED;
        updatedAt: Date;
      } = {
        updatedAt: new Date(),
      };

      if (params.engagement.deliveredAt) {
        updateData.deliveredAt = params.engagement.deliveredAt;
      }
      if (params.engagement.openedAt) {
        updateData.openedAt = params.engagement.openedAt;
      }
      if (params.engagement.clickedAt) {
        updateData.clickedAt = params.engagement.clickedAt;
      }
      if (params.engagement.bouncedAt) {
        updateData.bouncedAt = params.engagement.bouncedAt;
        updateData.status = MS.BOUNCED;
      }
      if (params.engagement.unsubscribedAt) {
        updateData.unsubscribedAt = params.engagement.unsubscribedAt;
        updateData.status = MS.UNSUBSCRIBED;
      }

      if (
        params.engagement.status &&
        (params.engagement.status === MS.BOUNCED ||
          params.engagement.status === MS.UNSUBSCRIBED ||
          params.engagement.status === MS.FAILED)
      ) {
        updateData.status = params.engagement.status;
      }

      await db
        .update(emails)
        .set(updateData)
        .where(eq(emails.id, params.emailId));

      logger.debug("Email engagement updated successfully", {
        emailId: params.emailId,
      });

      return success({ success: true });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update email engagement", parsedError.message, {
        emailId: params.emailId,
        error: parsedError.message,
      });

      return fail({
        message: t("emailMetadata.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          emailId: params.emailId,
          error: parsedError.message,
        },
      });
    }
  }
}
