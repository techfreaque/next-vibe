import "server-only";

import { Button } from "@react-email/button";
import { Text } from "@react-email/text";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";

import { EmailTemplate } from "@/messenger/providers/email/smtp-client/components/template.email";
import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import { EmailSendingRepository } from "@/messenger/providers/email/smtp-client/email-sending/repository";

import type { PendingSignup } from "./db";
import { scopedTranslation } from "./i18n";

export async function sendSignupChallenge(
  pending: Pick<
    PendingSignup,
    "email" | "privateName" | "leadId" | "subscribeToNewsletter"
  >,
  challenge: { code: string; token: string },
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<string | null> {
  const { t } = scopedTranslation.scopedT(locale);
  const subject = t("confirmation.link");
  const hint = t("confirmation.hint");
  const newsletterNotice = pending.subscribeToNewsletter
    ? t("confirmation.newsletter")
    : null;
  const url = `${coreEnv.NEXT_PUBLIC_APP_URL}/${locale}/user/signup?confirm=1#${challenge.token}`;
  const text = [hint, challenge.code, newsletterNotice, `${subject}\n${url}`]
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
        {subject}
      </Button>
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
