import "server-only";

import { Button } from "@react-email/button";
import { Text } from "@react-email/text";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";

import { EmailTemplate } from "@/messenger/providers/email/smtp-client/components/template.email";
import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import { EmailSendingRepository } from "@/messenger/providers/email/smtp-client/email-sending/repository";
import { FREE_CREDIT_SIGNED_IN_TOTAL } from "@/products/constants";

import type { PendingSignup } from "./db";
import { scopedTranslation } from "./i18n";

type ChallengeRecipient = Pick<
  PendingSignup,
  "email" | "privateName" | "leadId" | "subscribeToNewsletter"
>;

export async function sendSignupChallenge(
  pending: ChallengeRecipient,
  challenge: { code: string; token: string },
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<string | null> {
  const { t } = scopedTranslation.scopedT(locale);
  return deliverChallenge(
    pending,
    challenge,
    locale,
    logger,
    t("confirmation.link"),
    t("confirmation.hint"),
  );
}

/**
 * One follow-up for a signup that was never confirmed: a fresh code and a link
 * that stays valid for a day (the first one lasts 30 minutes). Transactional:
 * the person asked for this account, and it is sent at most once.
 */
export async function sendSignupReminder(
  pending: ChallengeRecipient,
  challenge: { code: string; token: string },
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<string | null> {
  const { t } = scopedTranslation.scopedT(locale);
  return deliverChallenge(
    pending,
    challenge,
    locale,
    logger,
    t("reminder.subject"),
    t("reminder.hint", { credits: FREE_CREDIT_SIGNED_IN_TOTAL }),
    t("reminder.ignore"),
    t("reminder.button"),
  );
}

async function deliverChallenge(
  pending: ChallengeRecipient,
  challenge: { code: string; token: string },
  locale: CountryLanguage,
  logger: EndpointLogger,
  subject: string,
  hint: string,
  footer: string | null = null,
  buttonText: string = subject,
): Promise<string | null> {
  const { t } = scopedTranslation.scopedT(locale);
  const newsletterNotice = pending.subscribeToNewsletter
    ? t("confirmation.newsletter")
    : null;
  const url = `${coreEnv.NEXT_PUBLIC_APP_URL}/${locale}/user/signup?confirm=1#${challenge.token}`;
  const text = [
    hint,
    challenge.code,
    newsletterNotice,
    `${buttonText}\n${url}`,
    footer,
  ]
    .filter(Boolean)
    .join("\n\n");
  const jsx = (
    <EmailTemplate
      locale={locale}
      title={subject}
      previewText={subject}
      tracking={createTrackingContext(locale)}
      recipientEmail={pending.email}
    >
      <Text>{hint}</Text>
      <Text style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "5px" }}>
        {challenge.code}
      </Text>
      {newsletterNotice && <Text>{newsletterNotice}</Text>}
      <Button
        href={url}
        style={{
          backgroundColor: "#2563eb",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "12px 20px",
        }}
      >
        {buttonText}
      </Button>
      {footer && <Text style={{ color: "#6b7280" }}>{footer}</Text>}
    </EmailTemplate>
  );
  const sent = await EmailSendingRepository.sendEmail(
    {
      toEmail: pending.email,
      toName: pending.privateName,
      leadId: pending.leadId,
      locale,
      subject,
      text,
      jsx,
    },
    logger,
    locale,
  );
  return sent.success ? sent.data.result.messageId : null;
}
