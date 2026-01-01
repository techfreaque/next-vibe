/**
 * Email Preview Send Test Repository
 * Send test emails with custom template data
 */

import "server-only";

import type React from "react";
import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { EmailSendingRepository } from "@/app/api/[locale]/emails/smtp-client/email-sending/repository";
import { CampaignType } from "@/app/api/[locale]/emails/smtp-client/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Countries, Languages } from "@/i18n/core/config";
import { getLocaleFromLanguageAndCountry } from "@/i18n/core/language-utils";
import { simpleT } from "@/i18n/core/shared";

import { getTemplate } from "../../registry/generated";

// Type definitions
export interface SendTestRequestType {
  templateId: string;
  recipientEmail: string;
  language: Languages;
  country: Countries;
  props: Record<string, string | number | boolean>;
}

interface SendTestResponseType {
  success: boolean;
  message: string;
}

/**
 * Email Preview Send Test Repository Interface
 */
interface EmailPreviewSendTestRepository {
  sendTest(
    data: SendTestRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<SendTestResponseType>>;
}

/**
 * Email Preview Send Test Repository Implementation
 */
class EmailPreviewSendTestRepositoryImpl
  implements EmailPreviewSendTestRepository
{
  async sendTest(
    data: SendTestRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<SendTestResponseType>> {
    try {
      logger.debug("Sending test email", {
        templateId: data.templateId,
        recipientEmail: data.recipientEmail,
        language: data.language,
        country: data.country,
      });

      // Get template from registry (lazy loaded with await)
      const template = await getTemplate(data.templateId);

      if (!template) {
        logger.warn("Template not found", { templateId: data.templateId });
        return fail({
          message: "app.api.emails.preview.sendTest.error.templateNotFound",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            templateId: data.templateId,
          },
        });
      }

      // Construct locale from language + country
      const locale = getLocaleFromLanguageAndCountry(
        data.language,
        data.country,
      );

      // Get translation function
      const { t } = simpleT(locale);

      // Validate and render
      let jsx: React.JSX.Element;
      let validatedProps;
      try {
        validatedProps = template.schema.parse(data.props);
      } catch (error) {
        const errorParsed = parseError(error);
        logger.warn("Invalid props for template", {
          templateId: data.templateId,
          error: errorParsed,
        });
        return fail({
          message: "app.api.emails.preview.sendTest.error.invalidProps",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            error: errorParsed.message,
          },
        });
      }

      jsx = template.component({ props: validatedProps, t, locale });

      // Get subject
      const subjectRaw = template.meta.defaultSubject;
      const subject =
        typeof subjectRaw === "function" ? subjectRaw(t) : subjectRaw;

      // Send email using existing email sending infrastructure
      const sendResult = await EmailSendingRepository.sendEmail(
        {
          params: {
            jsx,
            subject,
            toEmail: data.recipientEmail,
            toName: data.recipientEmail,
            locale,
            t,
            campaignType: CampaignType.SYSTEM, // Test emails are system emails
            skipRateLimitCheck: true, // Skip rate limiting for test emails
          },
        },
        logger,
      );

      if (!sendResult.success) {
        logger.error("Failed to send test email", {
          templateId: data.templateId,
          error: sendResult.message,
        });
        return fail({
          message: "app.api.emails.preview.sendTest.error.sendFailed",
          errorType: ErrorResponseTypes.EMAIL_ERROR,
          messageParams: {
            error: sendResult.message,
          },
        });
      }

      logger.info("Test email sent successfully", {
        templateId: data.templateId,
        recipientEmail: data.recipientEmail,
        version: template.meta.version,
        locale,
      });

      return success({
        success: true,
        message: t("app.api.emails.preview.sendTest.success", {
          email: data.recipientEmail,
        }),
      });
    } catch (error) {
      const errorParsed = parseError(error);
      logger.error("Failed to send test email", {
        error: errorParsed,
        templateId: data.templateId,
      });
      return fail({
        message: "app.api.emails.preview.sendTest.error.sendFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: errorParsed.message,
        },
      });
    }
  }
}

export const emailPreviewSendTestRepository =
  new EmailPreviewSendTestRepositoryImpl();
