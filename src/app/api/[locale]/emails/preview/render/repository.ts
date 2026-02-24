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
import type { ReactElement } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Countries, Languages } from "@/i18n/core/config";
import { getLocaleFromLanguageAndCountry } from "@/i18n/core/language-utils";

import type { scopedTranslation } from "../../i18n";
import { getTemplate } from "../../registry/generated";
import {
  getTemplateSubject,
  renderTemplateComponent,
} from "../../registry/types";
import { createTrackingContext } from "../../smtp-client/components/tracking_context.email";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

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
    t: ModuleT,
  ): Promise<BaseResponseType<PreviewRenderResponseType>>;
}

/**
 * Email Preview Render Repository Implementation
 */
class EmailPreviewRenderRepositoryImpl implements EmailPreviewRenderRepository {
  async renderPreview(
    data: PreviewRenderRequestType,
    logger: EndpointLogger,
    t: ModuleT,
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

      // Extract email from props if available
      const recipientEmail =
        typeof data.props.email === "string"
          ? data.props.email
          : typeof data.props.recipientEmail === "string"
            ? data.props.recipientEmail
            : typeof data.props.toEmail === "string"
              ? data.props.toEmail
              : "preview@example.com";

      // Validate and render the email component.
      // renderTemplateComponent seals schema.parse + component call together so
      // TypeScript never has to match a union-inferred props type to a union-inferred component.
      let jsx: ReactElement;
      try {
        jsx = renderTemplateComponent(template, {
          rawProps: data.props,
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
          message: t("preview.sendTest.error.invalidProps"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            error: errorParsed.message,
          },
        });
      }

      // Render to HTML
      const html = await render(jsx);

      const subject = getTemplateSubject(template, locale);

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
        message: t("preview.sendTest.error.sendFailed"),
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
