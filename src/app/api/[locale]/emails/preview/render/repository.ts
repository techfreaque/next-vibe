/**
 * Email Preview Render Repository
 * Server-side rendering of email templates for preview
 */

import "server-only";

import { render } from "@react-email/render";
import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Countries, Languages } from "@/i18n/core/config";
import { getLocaleFromLanguageAndCountry } from "@/i18n/core/language-utils";
import { simpleT } from "@/i18n/core/shared";

import { createTrackingContext } from "../../smtp-client/components/tracking_context.email";
import { getTemplate } from "../../registry/generated";

// Type definitions
export interface PreviewRenderRequestType {
  templateId: string;
  language: Languages;
  country: Countries;
  props: Record<string, string | number | boolean>;
}

interface PreviewRenderResponseType {
  html: string;
  subject: string;
  templateVersion: string;
}

/**
 * Email Preview Render Repository Interface
 */
interface EmailPreviewRenderRepository {
  renderPreview(
    data: PreviewRenderRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<PreviewRenderResponseType>>;
}

/**
 * Email Preview Render Repository Implementation
 */
class EmailPreviewRenderRepositoryImpl implements EmailPreviewRenderRepository {
  async renderPreview(
    data: PreviewRenderRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<PreviewRenderResponseType>> {
    try {
      logger.debug("Rendering email preview", {
        templateId: data.templateId,
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

      // Validate and render the email component
      // TypeScript can't verify the props match because EmailTemplateDefinition uses generics
      // But we know they match because we validate with template.schema
      let jsx;
      try {
        const validatedProps = template.schema.parse(data.props);
        // Extract email from props if available
        const recipientEmail =
          typeof data.props.email === "string"
            ? data.props.email
            : typeof data.props.recipientEmail === "string"
              ? data.props.recipientEmail
              : typeof data.props.toEmail === "string"
                ? data.props.toEmail
                : "preview@example.com";

        jsx = template.component({
          props: validatedProps as never,
          t,
          locale,
          recipientEmail,
          tracking: createTrackingContext(locale),
        });
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

      // Render to HTML
      const html = await render(jsx);

      // Get subject (handle both direct strings and functions)
      const subjectRaw = template.meta.defaultSubject;
      const subject =
        typeof subjectRaw === "function" ? subjectRaw(t) : subjectRaw;

      logger.info("Email preview rendered successfully", {
        templateId: data.templateId,
        version: template.meta.version,
        locale,
      });

      return success({
        html,
        subject,
        templateVersion: template.meta.version,
      });
    } catch (error) {
      const errorParsed = parseError(error);
      logger.error("Failed to render email preview", {
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

export const emailPreviewRenderRepository =
  new EmailPreviewRenderRepositoryImpl();
