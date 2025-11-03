/**
 * Email Sending Repository
 * Core service for sending emails using React Email rendering
 */

import "server-only";

import { render } from "@react-email/render";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { Countries, CountryLanguage, Languages } from "@/i18n/core/config";

import { CampaignType } from "../enum";
import { smtpSendingRepository } from "../sending/repository";
import type { SmtpSelectionCriteria } from "../sending/types";
import type {
  SendEmailRequestTypeOutput,
  SendEmailResponseTypeOutput,
} from "./types";

// Type aliases for consistency
type SendEmailRequestOutput = SendEmailRequestTypeOutput;
type SendEmailResponseOutput = SendEmailResponseTypeOutput;

/**
 * Type guard to validate if a string is a valid Languages type
 */
function isLanguage(value: string): value is Languages {
  const validLanguages: string[] = ["en", "de", "pl"];
  return validLanguages.includes(value);
}

/**
 * Type guard to validate if a string is a valid Countries type
 */
function isCountry(value: string): value is Countries {
  const validCountries: string[] = ["GLOBAL", "US", "DE", "PL"];
  return validCountries.includes(value);
}

/**
 * Utility function to map locale to country and language for SMTP selection
 * Returns null on validation failure
 */
function mapLocaleToSelectionCriteria(locale: CountryLanguage): {
  country: Countries;
  language: Languages;
} | null {
  const parts: string[] = locale.split("-");
  if (parts.length !== 2) {
    return null;
  }

  const languagePart = parts[0];
  const countryPart = parts[1];

  if (!isLanguage(languagePart)) {
    return null;
  }

  if (!isCountry(countryPart)) {
    return null;
  }

  return { country: countryPart, language: languagePart };
}

/**
 * Email Sending Repository Interface
 */
export interface EmailSendingRepository {
  sendEmail(
    data: SendEmailRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SendEmailResponseOutput>>;
}

/**
 * Email Sending Repository Implementation
 */
export class EmailSendingRepositoryImpl implements EmailSendingRepository {
  /**
   * Comprehensive email sending function with automatic SMTP account selection
   * This is the single place where all email rendering happens
   */
  async sendEmail(
    data: SendEmailRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SendEmailResponseOutput>> {
    try {
      logger.debug("Enhanced email sending initiated", {
        toEmail: data.params.toEmail,
        subject: data.params.subject,
        locale: data.params.locale,
        campaignType: data.params.campaignType ?? undefined,
        emailJourneyVariant: data.params.emailJourneyVariant ?? undefined,
        emailCampaignStage: data.params.emailCampaignStage ?? undefined,
      });

      // 1) Render the React component to raw HTML
      // This is the SINGLE PLACE where all email rendering happens
      // Tracking is built into React components, no HTML manipulation needed
      const rawHtml: string = await render(data.params.jsx);

      // 2) Map locale to country and language for selection criteria
      const localeMapping = mapLocaleToSelectionCriteria(data.params.locale);
      if (!localeMapping) {
        logger.error("Invalid locale format", { locale: data.params.locale });
        return createErrorResponse(
          "app.api.v1.core.emails.smtpClient.emailSending.email.errors.sending_failed",
          ErrorResponseTypes.VALIDATION_ERROR,
          {
            recipient: data.params.toEmail,
            error: `Invalid locale format: ${data.params.locale}`,
          },
        );
      }

      const { country, language } = localeMapping;

      // 3) Build comprehensive selection criteria
      const selectionCriteria: SmtpSelectionCriteria = data.params
        .selectionCriteriaOverride || {
        campaignType: data.params.campaignType || CampaignType.SYSTEM,
        emailJourneyVariant: data.params.emailJourneyVariant ?? null,
        emailCampaignStage: data.params.emailCampaignStage ?? null,
        country,
        language,
      };

      // 4) Send email using enhanced SMTP client service with selection criteria
      const emailResponse = await smtpSendingRepository.sendEmail(
        {
          to: data.params.toEmail,
          toName: data.params.toName,
          subject: data.params.subject,
          html: rawHtml,
          replyTo:
            data.params.replyToName && data.params.replyToEmail
              ? `${data.params.replyToName} <${data.params.replyToEmail}>`
              : undefined,
          unsubscribeUrl: data.params.unsubscribeUrl,
          senderName: data.params.senderName || data.params.t("config.appName"), // Default to app name if not provided
          selectionCriteria,
          skipRateLimitCheck: data.params.skipRateLimitCheck,
          leadId: data.params.leadId,
          campaignId: data.params.campaignId,
        },
        user,
        locale,
        logger,
      );

      if (!emailResponse.success) {
        logger.error("Enhanced email sending failed", {
          toEmail: data.params.toEmail,
          subject: data.params.subject,
          error: emailResponse.message,
        });
        return createErrorResponse(
          emailResponse.message,
          emailResponse.errorType || ErrorResponseTypes.EMAIL_ERROR,
          emailResponse.messageParams,
        );
      }

      logger.debug("Enhanced email sent successfully", {
        toEmail: data.params.toEmail,
        subject: data.params.subject,
        messageId: emailResponse.data.messageId,
        accountUsed: emailResponse.data.accountName,
      });

      // Return the SMTP result with account information
      return createSuccessResponse({
        result: {
          messageId: emailResponse.data.messageId,
          accountId: emailResponse.data.accountId,
          accountName: emailResponse.data.accountName,
          accepted: emailResponse.data.accepted,
          rejected: emailResponse.data.rejected,
          response: emailResponse.data.response,
        },
      });
    } catch (error) {
      logger.error("Enhanced email sending error", parseError(error), {
        toEmail: data.params.toEmail,
        subject: data.params.subject,
        locale: data.params.locale,
        campaignType: data.params.campaignType,
      });
      return createErrorResponse(
        "app.api.v1.core.emails.smtpClient.emailSending.email.errors.sending_failed",
        ErrorResponseTypes.EMAIL_ERROR,
        {
          recipient: data.params.toEmail,
          error: parseError(error).message,
        },
      );
    }
  }
}

export const emailSendingRepository = new EmailSendingRepositoryImpl();
