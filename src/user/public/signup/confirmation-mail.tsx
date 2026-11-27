import "server-only";

import { Button } from "@react-email/button";
import { Text } from "@react-email/text";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";

import { configScopedTranslation } from "@/env/i18n";
import { EmailTemplate } from "@/messenger/providers/email/smtp-client/components/template.email";
import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import { EmailSendingRepository } from "@/messenger/providers/email/smtp-client/email-sending/repository";
import { SmtpRepository } from "@/messenger/providers/email/smtp-client/repository";
import { FREE_CREDIT_SIGNED_IN_TOTAL } from "@/products/constants";

import { scopedTranslation as verifyTranslation } from "../verify-email/i18n";
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
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  // The code leads the subject: after a resend, every earlier code and link
  // stops working, and identical subjects made people open the first email in
  // the thread (prod 2026-11-27: old code typed 33 s after a resend).
  const delivery = await deliverChallenge(
    pending,
    challenge,
    locale,
    logger,
    t("confirmation.subject", {
      code: challenge.code,
      appName: globalT("appName"),
    }),
    t("confirmation.hint"),
    null,
    t("confirmation.link"),
  );
  return delivery.messageId;
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
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const delivery = await deliverChallenge(
    pending,
    challenge,
    locale,
    logger,
    t("reminder.subject", { appName: globalT("appName") }),
    t("reminder.hint", { credits: FREE_CREDIT_SIGNED_IN_TOTAL }),
    t("reminder.ignore"),
    t("reminder.button"),
  );
  return delivery.messageId;
}

export async function sendAccountChallenge(
  recipient: Omit<ChallengeRecipient, "subscribeToNewsletter"> & { id: string },
  challenge: { code: string; token: string },
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<{ messageId: string | null; bounced: boolean }> {
  const { t } = verifyTranslation.scopedT(locale);
  const { NewsletterConfirmRepository } =
    await import("@/newsletter/confirm/repository");
  const subscribeToNewsletter =
    await NewsletterConfirmRepository.hasPendingForAccount(
      recipient.id,
      recipient.email,
    );
  return deliverChallenge(
    { ...recipient, subscribeToNewsletter },
    challenge,
    locale,
    logger,
    t("title"),
    t("accountChallenge.mail"),
    null,
    t("widget.confirmButton"),
    `${coreEnv.NEXT_PUBLIC_APP_URL}/${locale}/user/verify-email/${encodeURIComponent(challenge.token)}`,
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
  url = `${coreEnv.NEXT_PUBLIC_APP_URL}/${locale}/user/signup?confirm=1#${challenge.token}`,
): Promise<{ messageId: string | null; bounced: boolean }> {
  const { t } = scopedTranslation.scopedT(locale);
  const newsletterNotice = pending.subscribeToNewsletter
    ? t("confirmation.newsletter")
    : null;
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
  return sent.success
    ? { messageId: sent.data.result.messageId, bounced: false }
    : {
        messageId: null,
        bounced: SmtpRepository.isBadRecipientError(sent.message),
      };
}
