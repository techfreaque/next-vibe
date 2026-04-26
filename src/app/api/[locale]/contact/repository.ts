/**
 * Contact Repository
 * Handles data access and business logic for contact form submissions
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { contacts, type NewContact } from "./db";
import type { ContactRequest, ContactResponse } from "./definition";
import { ContactStatus } from "./enum";
import type { ContactT } from "./i18n";
import { sendAdminNotificationSms, sendConfirmationSms } from "./sms";

/**
 * Contact Repository Implementation
 * Handles contact form submissions
 */
export class ContactRepository {
  /**
   * Submit contact form
   */
  static async submitContactForm(
    data: ContactRequest,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ContactT,
  ): Promise<ResponseType<ContactResponse>> {
    try {
      // Get leadId from user prop (JWT payload) - always present
      const leadId = user.leadId;

      // Resolve email: use provided value, fall back to DB email for logged-in users
      let email = data.email;
      if (!email && !user.isPublic) {
        const userRecord = await UserRepository.getUserById(
          user.id,
          undefined,
          locale,
          logger,
        );
        if (userRecord.success) {
          email = userRecord.data.email ?? undefined;
        }
      }

      logger.debug(t("repository.create.start"), {
        email,
        subject: data.subject,
        userId: user && !user.isPublic ? user.id : null,
        leadId,
      });

      // Handle lead conversion using leadId from JWT
      try {
        logger.debug(t("repository.lead.conversion.start"), {
          leadId,
          email,
          name: data.name,
        });

        // Note: Lead conversion logic would go here if needed
        // For now, we'll just log that we have a lead ID
        logger.debug(t("repository.lead.provided"), {
          leadId,
        });
      } catch (error) {
        // Log error but don't fail the contact form submission
        logger.error(t("repository.lead.conversion.error"), parseError(error), {
          leadId,
          email,
        });
      }

      // Create contact record
      const contactResult = await db
        .insert(contacts)
        .values({
          name: data.name,
          email: email ?? null,
          subject: data.subject,
          message: data.message,
          status: ContactStatus.NEW,
          userId: user && !user.isPublic ? user.id : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      const contact = contactResult[0];

      if (!contact) {
        return fail({
          message: t("errors.repositoryCreateFailed"),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: { email: email ?? "unknown" },
        });
      }

      logger.debug(t("repository.create.success"), {
        contactId: contact.id,
        email,
        leadId,
      });

      // Send optional SMS notifications (non-blocking)
      const smsData = { ...data, email };
      sendAdminNotificationSms(smsData, user, locale, logger, t).catch(
        (smsError) => {
          logger.warn(t("route.sms.admin.failed"), {
            error:
              smsError instanceof Error ? smsError.message : String(smsError),
            contactEmail: email,
          });
        },
      );

      sendConfirmationSms(smsData, user, locale, logger, t).catch(
        (smsError) => {
          logger.warn(t("route.sms.confirmation.failed"), {
            error:
              smsError instanceof Error ? smsError.message : String(smsError),
            contactEmail: email,
            userId: user?.id,
          });
        },
      );

      return success({
        success: "response.success",
        messageId: contact.id,
        status: [ContactStatus.NEW],
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(t("repository.create.error"), parsedError);
      return fail({
        message: t("errors.repositoryCreateFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          error: parsedError.message,
          details: t("errors.repositoryCreateDetails"),
        },
      });
    }
  }

  /**
   * Create contact directly (for seeds)
   */
  static async create(
    data: NewContact,
    logger: EndpointLogger,
    t: ContactT,
  ): Promise<ResponseType<ContactResponse>> {
    try {
      logger.debug(t("repository.seed.create.start"), {
        email: data.email,
      });

      const contactResult = await db
        .insert(contacts)
        .values({
          name: data.name,
          email: data.email,
          company: data.company,
          subject: data.subject,
          message: data.message,
          status: data.status || ContactStatus.NEW,
          userId: data.userId || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      const contact = contactResult[0];

      if (!contact) {
        return fail({
          message: t("errors.repositoryCreateFailed"),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: {
            error: t("errors.noContactReturned"),
          },
        });
      }

      return success({
        success: "response.success",
        messageId: contact.id,
        status: [data.status || ContactStatus.NEW],
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(t("repository.seed.create.error"), parsedError);
      return fail({
        message: t("errors.repositoryCreateFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }
}
