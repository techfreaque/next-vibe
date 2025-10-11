/**
 * Email Service Repository Implementation
 * Provides centralized email sending functionality using SMTP repository
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { Countries, Languages } from "@/i18n/core/config";

import type { CampaignTypeValue } from "../smtp-client/enum";
import { CampaignType } from "../smtp-client/enum";
import { smtpRepository } from "../smtp-client/repository";
import type { SmtpSelectionCriteria } from "../smtp-client/sending/definition";
import type {
  EmailServiceSendPostRequestOutput,
  EmailServiceSendPostResponseOutput,
} from "./definition";

// Define the proper type for locale to match SMTP repository expectations
type CountryLanguage = `${Lowercase<Languages>}-${Countries}`;

/**
 * Email Service Repository Interface
 */
export interface EmailServiceRepository {
  sendEmail(
    data: EmailServiceSendPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailServiceSendPostResponseOutput>>;
}

/**
 * Email Service Repository Implementation
 * Integrates with existing SMTP repository for actual email sending
 */
export class EmailServiceRepositoryImpl implements EmailServiceRepository {
  async sendEmail(
    data: EmailServiceSendPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailServiceSendPostResponseOutput>> {
    try {
      logger.debug("Email service: Sending email", {
        to: data.recipientInfo.to,
        subject: data.emailContent.subject,
        campaignType: data.campaignSettings.campaignType,
        userId: user.isPublic ? "public" : user.id,
      });

      // Prepare selection criteria for SMTP account selection
      const localeString = String(locale);
      const [langPart, countryPart] = localeString.split("-");
      const selectionCriteria: SmtpSelectionCriteria = {
        campaignType:
          (data.campaignSettings.campaignType as CampaignTypeValue) ||
          CampaignType.NOTIFICATION,
        emailJourneyVariant: data.campaignSettings.emailJourneyVariant || null,
        emailCampaignStage: data.campaignSettings.emailCampaignStage || null,
        country: (countryPart?.toUpperCase() as Countries) || "GLOBAL",
        language: (langPart?.toLowerCase() as Languages) || "en",
      };

      // Use existing SMTP repository for email sending
      const smtpSendData = {
        params: {
          to: data.recipientInfo.to,
          toName: data.recipientInfo.toName,
          subject: data.emailContent.subject,
          html: data.emailContent.html,
          text: data.emailContent.text,
          replyTo: data.senderSettings.replyTo,
          unsubscribeUrl: data.campaignSettings.unsubscribeUrl,
          senderName: data.senderSettings.senderName,
          selectionCriteria,
          skipRateLimitCheck: data.advancedOptions.skipRateLimitCheck,
          leadId: data.campaignSettings.leadId,
          campaignId: data.campaignSettings.campaignId,
        },
      };

      const result = await smtpRepository.sendEmail(
        smtpSendData,
        user,
        (countryPart?.toUpperCase() as Countries) || "GLOBAL",
        logger,
      );

      if (!result.success) {
        logger.error("Email service: SMTP send failed", {
          error: result.message,
          to: data.recipientInfo.to,
          subject: data.emailContent.subject,
        });
        return result;
      }

      // Safe access to result data since we know result.success is true
      if (!result.data) {
        return createErrorResponse(
          "app.api.v1.core.emails.smtpClient.send.errors.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          {
            error:
              "app.api.v1.core.emails.emailService.send.errors.noData.description",
          },
        );
      }

      const smtpResult = result.data.result;

      logger.debug("Email service: Email sent successfully", {
        messageId: smtpResult.messageId,
        accountId: smtpResult.accountId,
        to: data.recipientInfo.to,
      });

      return createSuccessResponse({
        result: {
          success: true,
          messageId: smtpResult.messageId,
          accountId: smtpResult.accountId,
          accountName: smtpResult.accountName,
          response: smtpResult.response,
          sentAt: new Date().toISOString(),
        },
        deliveryStatus: {
          accepted: smtpResult.accepted,
          rejected: smtpResult.rejected,
        },
      });
    } catch (error) {
      logger.error("Email service: Send failed", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.emails.emailService.send.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

/**
 * Email Service Repository Singleton Instance
 */
export const emailServiceRepository = new EmailServiceRepositoryImpl();
