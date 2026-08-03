/**
 * Contact Repository
 * Handles data access and business logic for contact form submissions
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRepository } from "next-vibe/identity/user/repository";
import type { EndpointLogger } from "next-vibe/logger/types";

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
          message: t("errors.repositoryCreateFailedForEmail", {
            email: email ?? "unknown",
          }),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
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
        success: t("response.success"),
        messageId: contact.id,
        status: [ContactStatus.NEW],
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(t("repository.create.error"), parsedError);
      return fail({
        message: t("errors.repositoryCreateFailedWithDetails", {
          error: parsedError.message,
          details: t("errors.repositoryCreateDetails"),
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
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
          message: t("errors.repositoryCreateFailed", {
            error: t("errors.noContactReturned"),
          }),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
        });
      }

      return success({
        success: t("response.success"),
        messageId: contact.id,
        status: [data.status || ContactStatus.NEW],
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(t("repository.seed.create.error"), parsedError);
      return fail({
        message: t("errors.repositoryCreateFailed", {
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }
}

export {
  adminContactFormEmailTemplate,
  contactFormEmailTemplate,
} from "./email";
