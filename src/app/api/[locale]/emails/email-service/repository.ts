/**
 * Email Service Repository Implementation
 * Provides centralized email sending functionality using SMTP repository
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import {
  type EmailCampaignStageValues,
  type EmailJourneyVariantValues,
} from "@/app/api/[locale]/leads/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { CampaignType } from "../smtp-client/enum";
import { SmtpRepository } from "../smtp-client/repository";
import type { SmtpSelectionCriteria, SmtpSendParams } from "../smtp-client/sending/types";

/**
 * Email Service Send Request Type
 */
export interface EmailServiceSendProps {
  recipientInfo: {
    to: string;
    toName?: string;
  };
  emailContent: {
    subject: string;
    html: string;
    text?: string;
  };
  senderSettings: {
    senderName: string;
    replyTo?: string;
  };
  campaignSettings: {
    campaignType?: (typeof CampaignType)[keyof typeof CampaignType];
    unsubscribeUrl?: string;
    emailJourneyVariant?: typeof EmailJourneyVariantValues | null;
    emailCampaignStage?: typeof EmailCampaignStageValues | null;
    leadId?: string;
    campaignId?: string;
  };
  advancedOptions: {
    skipRateLimitCheck?: boolean;
  };
}

/**
 * Email Service Send Response Type
 */
export interface EmailServiceSendResponse {
  result: {
    success: boolean;
    messageId: string;
    accountId: string;
    accountName: string;
    response: string;
    sentAt: string;
  };
  deliveryStatus: {
    accepted: string[];
    rejected: string[];
  };
}

/**
 * Email Service Repository
 * Integrates with existing SMTP repository for actual email sending
 */
export class EmailServiceRepository {
  static async sendEmail(
    data: EmailServiceSendProps,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailServiceSendResponse>> {
    try {
      logger.debug("Email service: Sending email", {
        to: data.recipientInfo.to,
        subject: data.emailContent.subject,
        campaignType: data.campaignSettings.campaignType,
        userId: user.isPublic ? "public" : user.id,
      });

      // Prepare selection criteria - data is already validated
      const { language, country } = getLanguageAndCountryFromLocale(locale);

      const selectionCriteria: SmtpSelectionCriteria = {
        campaignType: data.campaignSettings.campaignType || CampaignType.NOTIFICATION,
        emailJourneyVariant: data.campaignSettings.emailJourneyVariant || null,
        emailCampaignStage: data.campaignSettings.emailCampaignStage || null,
        country,
        language,
      };

      const smtpSendData: SmtpSendParams = {
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
      };

      const result = await SmtpRepository.sendEmail(smtpSendData, user, locale, logger);

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
        return fail({
          message: "app.api.emails.emailService.send.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: "app.api.emails.emailService.send.errors.noData.description",
          },
        });
      }

      logger.debug("Email service: Email sent successfully", {
        messageId: result.data.messageId,
        accountId: result.data.accountId,
        to: data.recipientInfo.to,
      });

      return success({
        result: {
          success: true,
          messageId: result.data.messageId,
          accountId: result.data.accountId,
          accountName: result.data.accountName,
          response: result.data.response,
          sentAt: new Date().toISOString(),
        },
        deliveryStatus: {
          accepted: result.data.accepted,
          rejected: result.data.rejected,
        },
      });
    } catch (error) {
      logger.error("Email service: Send failed", parseError(error));
      return fail({
        message: "app.api.emails.emailService.send.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
