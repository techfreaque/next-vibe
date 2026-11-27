/**
 * Send the newsletter welcome email (with its double opt-in link) outside the
 * subscribe route, e.g. for an opt-in ticked at signup. The bonus credits
 * unlock only when that link is clicked (anti-farming, 2026-11-27).
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { configScopedTranslation } from "@/env/i18n";
import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import { EmailSendingRepository } from "@/messenger/providers/email/smtp-client/email-sending/repository";

import { newsletterWelcomeEmailTemplate } from "./email";
import { scopedTranslation } from "./i18n";
import { NewsletterSubscribeRepository } from "./repository";

/**
 * Mail the welcome email for a subscription that still waits for its
 * confirmation click. No-op once it is confirmed.
 * @returns true when the email went out
 */
export async function sendNewsletterWelcomeMail(
  {
    email,
    name,
    subscriptionId,
    leadId,
    userId,
  }: {
    email: string;
    name?: string;
    subscriptionId: string;
    leadId: string;
    userId: string;
  },
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<boolean> {
  try {
    const confirmationToken =
      await NewsletterSubscribeRepository.getPendingConfirmationToken(
        subscriptionId,
      );
    if (!confirmationToken) {
      return false;
    }
    const { t } = scopedTranslation.scopedT(locale);
    const { t: configT } = configScopedTranslation.scopedT(locale);
    const sent = await EmailSendingRepository.sendEmail(
      {
        toEmail: email,
        toName: name || email,
        leadId,
        locale,
        subject: t("emailTemplate.welcome.subject", {
          appName: configT("appName"),
        }),
        jsx: newsletterWelcomeEmailTemplate.component({
          props: { email, name, leadId, userId, confirmationToken },
          t,
          locale,
          recipientEmail: email,
          tracking: createTrackingContext(locale, leadId, userId),
        }),
      },
      logger,
      locale,
    );
    if (!sent.success) {
      logger.error("Newsletter welcome email failed", {
        subscriptionId,
        error: sent.message,
      });
      return false;
    }
    return true;
  } catch (error) {
    logger.error("Newsletter welcome email failed", parseError(error), {
      subscriptionId,
    });
    return false;
  }
}
