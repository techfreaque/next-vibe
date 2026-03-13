/**
 * Email Preview Send Test Repository
 * Send test emails with custom template data
 */

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { EmailSendingRepository } from "@/app/api/[locale]/messenger/providers/email/smtp-client/email-sending/repository";
import { CampaignType } from "@/app/api/[locale]/messenger/accounts/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Countries, Languages } from "@/i18n/core/config";
import { getLocaleFromLanguageAndCountry } from "@/i18n/core/language-utils";

import type { scopedTranslation } from "../../i18n";
import { getTemplate } from "../../registry/generated";
import { createTrackingContext } from "../../providers/email/smtp-client/components/tracking_context.email";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

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
    t: ModuleT,
  ): Promise<BaseResponseType<SendTestResponseType>>;
}

/**
 * Email Preview Send Test Repository Implementation
 */
class EmailPreviewSendTestRepositoryImpl implements EmailPreviewSendTestRepository {
  async sendTest(
    data: SendTestRequestType,
    logger: EndpointLogger,
    t: ModuleT,
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
          message: t("preview.sendTest.error.templateNotFound"),
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

      // Get scoped t for this template's own module scope
      const { t: templateT } = template.scopedTranslation.scopedT(locale);

      // Validate and render the email component
      // TypeScript can't verify the props match because EmailTemplateDefinition uses generics
      // But we know they match because we validate with template.schema
      let jsx;
      try {
        const validatedProps = template.schema.parse(data.props);
        jsx = template.component({
          props: validatedProps as never,
          t: templateT as never,
          locale,
          recipientEmail: data.recipientEmail,
          tracking: createTrackingContext(locale),
        });
      } catch (error) {
        const errorParsed = parseError(error);
        logger.warn("Invalid props for template", {
          templateId: data.templateId,
          error: errorParsed,
        });
        return fail({
          message: t("preview.sendTest.error.invalidProps"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            error: errorParsed.message,
          },
        });
      }

      // Get subject
      const subject = templateT(template.meta.defaultSubject as never);

      // Send email using existing email sending infrastructure
      const sendResult = await EmailSendingRepository.sendEmail(
        {
          jsx,
          subject,
          toEmail: data.recipientEmail,
          toName: data.recipientEmail,
          locale,
          campaignType: CampaignType.SYSTEM,
          skipRateLimitCheck: true,
        },
        logger,
        locale,
      );

      if (!sendResult.success) {
        logger.error("Failed to send test email", {
          templateId: data.templateId,
          error: sendResult.message,
        });
        return fail({
          message: t("preview.sendTest.error.sendFailed"),
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
        message: t("preview.sendTest.success", {
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
        message: t("preview.sendTest.error.sendFailed"),
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
