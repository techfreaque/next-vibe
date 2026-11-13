/**
 * Lifecycle mail transport. The engine talks to this interface only, so tests
 * inject a recording mock and never touch SMTP.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";

import { contactClientRepository } from "@/contact/repository-client";
import { configScopedTranslation } from "@/env/i18n";
import { CampaignType } from "@/messenger/accounts/enum";
import { scopedTranslation as smtpScopedTranslation } from "@/messenger/providers/email/smtp-client/i18n";
import { SmtpSendingRepository } from "@/messenger/providers/email/smtp-client/sending/repository";

export interface LifecycleMail {
  to: string;
  subject: string;
  html: string;
  text: string;
  locale: CountryLanguage;
  /** Newsletter-only contact (no account) vs registered user. */
  newsletterOnly: boolean;
  leadId: string | null;
  /** Human unsubscribe page; its presence adds the RFC 8058 one-click headers. */
  unsubscribeUrl: string;
}

export interface LifecycleTransport {
  send(
    mail: LifecycleMail,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ messageId: string }>>;
}

/** Production transport: the same SMTP account selection the campaigns use. */
export const smtpLifecycleTransport: LifecycleTransport = {
  async send(mail, logger) {
    const { language, country } = getLanguageAndCountryFromLocale(mail.locale);
    const { t: configT } = configScopedTranslation.scopedT(mail.locale);
    const smtpT = smtpScopedTranslation.scopedT(mail.locale).t;
    const sent = await SmtpSendingRepository.sendEmail(
      {
        to: mail.to,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        senderName: configT("appName"),
        unsubscribeUrl: mail.unsubscribeUrl,
        replyTo: contactClientRepository.getSupportEmail(mail.locale),
        selectionCriteria: {
          campaignType: mail.newsletterOnly
            ? CampaignType.NEWSLETTER
            : CampaignType.SIGNUP_NURTURE,
          emailJourneyVariant: null,
          emailCampaignStage: null,
          country,
          language,
        },
        leadId: mail.leadId ?? undefined,
      },
      logger,
      smtpT,
    );
    if (!sent.success) {
      return fail({
        message: sent.message,
        errorType: ErrorResponseTypes.EMAIL_ERROR,
        cause: sent,
      });
    }
    return success({ messageId: sent.data.messageId });
  },
};
