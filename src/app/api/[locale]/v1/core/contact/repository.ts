/**
 * Contact Repository
 * Handles data access and business logic for contact form submissions
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { contacts, type NewContact } from "./db";
import type { ContactRequestOutput, ContactResponseOutput } from "./definition";
import { ContactStatus } from "./enum";

/**
 * Contact Repository Implementation
 * Handles contact form submissions
 */
export class contactRepository {
  /**
   * Submit contact form
   */
  static async submitContactForm(
    data: ContactRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ContactResponseOutput>> {
    try {
      // Get leadId from user prop (JWT payload) - always present
      const leadId = user.leadId;

      logger.debug("app.api.v1.core.contact.repository.create.start", {
        email: data.email,
        subject: data.subject,
        userId: user && !user.isPublic ? user.id : null,
        leadId,
      });

      // Handle lead conversion using leadId from JWT
      try {
        logger.debug(
          "app.api.v1.core.contact.repository.lead.conversion.start",
          {
            leadId,
            email: data.email,
            name: data.name,
            company: data.company,
          },
        );

        // Note: Lead conversion logic would go here if needed
        // For now, we'll just log that we have a lead ID
        logger.debug("app.api.v1.core.contact.repository.lead.provided", {
          leadId,
        });
      } catch (error) {
        // Log error but don't fail the contact form submission
        logger.error(
          "app.api.v1.core.contact.repository.lead.conversion.error",
          parseError(error),
          {
            leadId,
            email: data.email,
          },
        );
      }

      // Create contact record
      const contactResult = await db
        .insert(contacts)
        .values({
          name: data.name,
          email: data.email,
          company: data.company,
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
          message: "app.api.v1.core.contact.errors.repositoryCreateFailed",
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: { email: data.email },
        });
      }

      logger.debug("app.api.v1.core.contact.repository.create.success", {
        contactId: contact.id,
        email: data.email,
        leadId,
      });

      return success({
        success: true,
        messageId: contact.id,
        status: [ContactStatus.NEW],
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(
        "app.api.v1.core.contact.repository.create.error",
        parsedError,
      );
      return fail({
        message: "app.api.v1.core.contact.errors.repositoryCreateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          email: data.email,
          error: parsedError.message,
          details: "app.api.v1.core.contact.errors.repositoryCreateDetails",
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
  ): Promise<ResponseType<ContactResponseOutput>> {
    try {
      logger.debug("app.api.v1.core.contact.repository.seed.create.start", {
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
          message: "app.api.v1.core.contact.errors.repositoryCreateFailed",
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: {
            email: data.email,
            error: "app.api.v1.core.contact.errors.noContactReturned",
          },
        });
      }

      return success({
        success: true,
        messageId: contact.id,
        status: [data.status || ContactStatus.NEW],
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(
        "app.api.v1.core.contact.repository.seed.create.error",
        parsedError,
      );
      return fail({
        message: "app.api.v1.core.contact.errors.repositoryCreateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: {
          email: data.email,
          error: parsedError.message,
        },
      });
    }
  }
}
