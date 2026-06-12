/**
 * Invoice Send Reminder Repository
 * Sends a payment reminder for an overdue OPEN invoice.
 * Checks invoice is OPEN status and past its due date.
 * Logs the reminder as a user note on the customer.
 */

import "server-only";

import { eq } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { z } from "zod";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { userNotes } from "@/app/api/[locale]/user/db";
import { UserNoteType } from "@/app/api/[locale]/user/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { defaultLocale } from "@/i18n/core/config";

import { paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import { scopedTranslation } from "./i18n";
import type {
  InvoiceSendReminderUrlPathParams,
  InvoiceSendReminderRequestOutput,
  InvoiceSendReminderResponseOutput,
} from "./definition";

export class InvoiceSendReminderRepository {
  static async sendReminder(
    userId: string,
    urlPathParams: InvoiceSendReminderUrlPathParams,
    data: InvoiceSendReminderRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<InvoiceSendReminderResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, urlPathParams.invoiceId))
        .limit(1);

      if (!invoice) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (invoice.userId !== userId) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Must be OPEN and past due date
      if (invoice.status !== InvoiceStatus.OPEN) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      if (!invoice.dueDate || invoice.dueDate > new Date()) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Extract customerId from metadata if available
      const metadataSchema = z.object({ customerId: z.string().optional() });
      const parsedMeta = metadataSchema.safeParse(invoice.metadata);
      const customerId = parsedMeta.success
        ? (parsedMeta.data.customerId ?? null)
        : null;

      // Log reminder as user note on the customer (best-effort)
      if (customerId) {
        try {
          const reminderContent = [
            `Payment reminder sent for invoice ${urlPathParams.invoiceId}.`,
            `Due date: ${invoice.dueDate.toISOString().split("T")[0]}.`,
            data.message ? `Message: ${data.message}` : null,
          ]
            .filter(Boolean)
            .join(" ");

          await db.insert(userNotes).values({
            userId: customerId,
            authorUserId: userId,
            type: UserNoteType.NOTE,
            content: reminderContent,
            isPrivate: false,
          });

          logger.debug("Reminder note logged on customer", {
            invoiceId: urlPathParams.invoiceId,
            customerId,
          });
        } catch (noteError) {
          logger.warn("Failed to log reminder note — reminder send continues", {
            invoiceId: urlPathParams.invoiceId,
            customerId,
            error: parseError(noteError).message,
          });
        }
      }

      logger.info("Payment reminder sent", {
        invoiceId: urlPathParams.invoiceId,
        userId,
        dueDate: invoice.dueDate,
        customerId,
      });

      return success({
        success: true,
        responseMessage: null,
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to send payment reminder", {
        error: parsed.message,
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
