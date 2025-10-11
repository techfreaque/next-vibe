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

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { Countries, Languages } from "@/i18n/core/config";

import type {
  CountryLanguage,
  JwtPayloadType,
} from "../../../user/auth/definition";
import { CampaignType } from "../enum";
import type { SmtpSelectionCriteria } from "../sending/definition";
import { smtpSendingRepository } from "../sending/repository";
import type {
  SendEmailParams,
  SendEmailRequestTypeOutput,
  SendEmailResponseTypeOutput,
} from "./definition";

/**
 * Utility function to map locale to country and language for SMTP selection
 */
function mapLocaleToSelectionCriteria(locale: CountryLanguage): {
  country: Countries;
  language: Languages;
} {
  const [language, country] = locale.split("-") as [Languages, Countries];
  return { country, language };
}

/**
 * Email Sending Repository Interface
 */
export interface EmailSendingRepository {
  sendEmail(
    data: SendEmailRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SendEmailResponseTypeOutput>>;
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
    data: SendEmailRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SendEmailResponseTypeOutput>> {
    try {
      logger.debug("Enhanced email sending initiated", {
        toEmail: data.params.toEmail,
        subject: data.params.subject,
        locale: data.params.locale,
        campaignType: data.params.campaignType,
        emailJourneyVariant: data.params.emailJourneyVariant,
        emailCampaignStage: data.params.emailCampaignStage,
      });

      // 1) Render the React component to raw HTML
      // This is the SINGLE PLACE where all email rendering happens
      // Tracking is built into React components, no HTML manipulation needed
      const rawHtml: string = await render(data.params.jsx);

      // 2) Map locale to country and language for selection criteria
      const { country, language } = mapLocaleToSelectionCriteria(
        data.params.locale,
      );

      // 3) Build comprehensive selection criteria
      const selectionCriteria: SmtpSelectionCriteria = data.params
        .selectionCriteriaOverride || {
        campaignType: data.params.campaignType || CampaignType.SYSTEM,
        emailJourneyVariant: data.params.emailJourneyVariant || null,
        emailCampaignStage: data.params.emailCampaignStage || null,
        country,
        language,
      };

      // 4) Send email using enhanced SMTP client service with selection criteria
      const emailResponse = await smtpSendingRepository.sendEmail(
        {
          params: {
            to: data.params.toEmail,
            toName: data.params.toName,
            subject: data.params.subject,
            html: rawHtml,
            replyTo:
              data.params.replyToName && data.params.replyToEmail
                ? `${data.params.replyToName} <${data.params.replyToEmail}>`
                : undefined,
            unsubscribeUrl: data.params.unsubscribeUrl,
            senderName:
              data.params.senderName || data.params.t("common.appName"), // Default to app name if not provided
            selectionCriteria,
            skipRateLimitCheck: data.params.skipRateLimitCheck,
            leadId: data.params.leadId,
            campaignId: data.params.campaignId,
          },
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
          selectionCriteria,
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
        messageId: emailResponse.data.result.messageId,
        accountUsed: emailResponse.data.result.accountName,
      });

      // Return the SMTP result with account information
      return createSuccessResponse({
        result: {
          messageId: emailResponse.data.result.messageId,
          accountId: emailResponse.data.result.accountId,
          accountName: emailResponse.data.result.accountName,
          accepted: emailResponse.data.result.accepted,
          rejected: emailResponse.data.result.rejected,
          response: emailResponse.data.result.response,
        },
      });
    } catch (error) {
      logger.error("Enhanced email sending error", error, {
        toEmail: data.params.toEmail,
        subject: data.params.subject,
        locale: data.params.locale,
        campaignType: data.params.campaignType,
      });
      return createErrorResponse(
        "email.errors.sending_failed",
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
