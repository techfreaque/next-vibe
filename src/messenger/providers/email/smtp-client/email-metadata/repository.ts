/**
 * Email Metadata Repository
 * Stores email metadata in the database for tracking and analytics
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { emails } from "../../../../messages/db";
import type { MessageStatus, MessageType } from "../../../../messages/enum";
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
        message: t("emailMetadata.errors.server.detail_store", {
          recipient: params.recipientEmail,
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
