/**
 * Email Sending Repository
 * Core service for sending emails using React Email rendering
 */

import "server-only";

import type { JSX } from "react";

import { render } from "@react-email/render";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Countries, CountryLanguage, Languages } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type {
  EmailCampaignStageValues,
  EmailJourneyVariantValues,
} from "@/app/api/[locale]/leads/enum";
import { CampaignType } from "../../../../accounts/enum";
import type { CampaignTypeValue } from "../../../../accounts/enum";
import { scopedTranslation } from "../i18n";
import type { SmtpSelectionCriteria, SmtpSendResult } from "../repository";
import { SmtpSendingRepository } from "../sending/repository";

interface SendEmailParams {
  jsx: JSX.Element;
  subject: string;
  toEmail: string;
  toName: string;
  locale: CountryLanguage;
  senderName?: string;
  campaignType?: typeof CampaignTypeValue;
  emailJourneyVariant?: typeof EmailJourneyVariantValues | null;
  emailCampaignStage?: typeof EmailCampaignStageValues | null;
  replyToEmail?: string;
  replyToName?: string;
  unsubscribeUrl?: string;
  leadId?: string;
  campaignId?: string;
  selectionCriteriaOverride?: SmtpSelectionCriteria;
  skipRateLimitCheck?: boolean;
}

interface SendEmailResult {
  result: SmtpSendResult;
}

export class EmailSendingRepository {
  private static isLanguage(value: string): value is Languages {
    return ["en", "de", "pl"].includes(value);
  }

  private static isCountry(value: string): value is Countries {
    return ["GLOBAL", "US", "DE", "PL"].includes(value);
  }

  private static mapLocaleToSelectionCriteria(locale: CountryLanguage): {
    country: Countries;
    language: Languages;
  } | null {
    const parts = locale.split("-");
    if (parts.length !== 2) {
      return null;
    }
    const [languagePart, countryPart] = parts;
    if (
      !EmailSendingRepository.isLanguage(languagePart) ||
      !EmailSendingRepository.isCountry(countryPart)
    ) {
      return null;
    }
    return { country: countryPart, language: languagePart };
  }

  static async sendEmail(
    params: SendEmailParams,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SendEmailResult>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Email sending initiated", {
        toEmail: params.toEmail,
        subject: params.subject,
        locale: params.locale,
      });

      const rawHtml: string = await render(params.jsx);

      const localeMapping = EmailSendingRepository.mapLocaleToSelectionCriteria(
        params.locale,
      );
      if (!localeMapping) {
        logger.error("Invalid locale format", { locale: params.locale });
        return fail({
          message: t("emailSending.email.errors.sending_failed"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            recipient: params.toEmail,
            error: `Invalid locale format: ${params.locale}`,
          },
        });
      }

      const { country, language } = localeMapping;
      const selectionCriteria: SmtpSelectionCriteria =
        params.selectionCriteriaOverride ?? {
          campaignType: params.campaignType ?? CampaignType.SYSTEM,
          emailJourneyVariant: params.emailJourneyVariant ?? null,
          emailCampaignStage: params.emailCampaignStage ?? null,
          country,
          language,
        };

      const { t: globalT } = simpleT(params.locale);

      const emailResponse = await SmtpSendingRepository.sendEmail(
        {
          to: params.toEmail,
          toName: params.toName,
          subject: params.subject,
          html: rawHtml,
          replyTo:
            params.replyToName && params.replyToEmail
              ? `${params.replyToName} <${params.replyToEmail}>`
              : undefined,
          unsubscribeUrl: params.unsubscribeUrl,
          senderName: params.senderName ?? globalT("config.appName"),
          selectionCriteria,
          skipRateLimitCheck: params.skipRateLimitCheck,
          leadId: params.leadId,
          campaignId: params.campaignId,
        },
        logger,
        t,
      );

      if (!emailResponse.success) {
        logger.error("Email sending failed", {
          toEmail: params.toEmail,
          subject: params.subject,
          error: emailResponse.message,
        });
        return fail({
          message: emailResponse.message,
          errorType: emailResponse.errorType ?? ErrorResponseTypes.EMAIL_ERROR,
          messageParams: emailResponse.messageParams,
          cause: emailResponse,
        });
      }

      logger.debug("Email sent successfully", {
        toEmail: params.toEmail,
        subject: params.subject,
        messageId: emailResponse.data.messageId,
        accountUsed: emailResponse.data.accountName,
      });

      return success({
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
      logger.error("Email sending error", parseError(error), {
        toEmail: params.toEmail,
        subject: params.subject,
      });
      return fail({
        message: t("emailSending.email.errors.sending_failed"),
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        messageParams: {
          recipient: params.toEmail,
          error: parseError(error).message,
        },
      });
    }
  }
}
