/**
 * Plan Move Notice Email
 * One-time mail to card subscribers once the new payment provider is live:
 * what happened, what to do by when and what happens otherwise, then the
 * button, reassurance, crypto as an inline alternative link, reply for help.
 * Sent only by the subscription-provider-switch-notify run.
 */

import { Button } from "@react-email/button";
import { Link } from "@react-email/link";
import { Section } from "@react-email/section";
import { Text as Span } from "@react-email/text";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { success } from "next-vibe/core/route/response.schema";
import type { UserRole } from "next-vibe/identity/roles/enum";
import type { ReactElement } from "react";
import { z } from "zod";

import { configScopedTranslation } from "@/env/i18n";
import type { EmailTemplateDefinition } from "@/messenger/registry/template";

import { EmailTemplate } from "../../../messenger/providers/email/smtp-client/components/template.email";
import type { TrackingContext } from "../../../messenger/providers/email/smtp-client/components/tracking_context.email";
import {
  scopedTranslation as notifyScopedTranslation,
  type SubscriptionProviderSwitchNotifyT,
} from "./i18n";

const planMoveNoticePropsSchema = z.object({
  privateName: z.string(),
  planName: z.string(),
  /** Already formatted in the recipient's locale. */
  deadline: z.string(),
  pastDue: z.boolean(),
  switchUrl: z.string(),
  cryptoUrl: z.string(),
});

export type PlanMoveNoticeProps = z.infer<typeof planMoveNoticePropsSchema>;

const text = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#374151",
  margin: "0 0 16px 0",
  display: "block",
} as const;

/** Past due and undated plans get their own wording (no empty date). */
export function planMoveNoticeIntroKey(
  props: Pick<PlanMoveNoticeProps, "pastDue" | "deadline">,
): "email.intro" | "email.introPastDue" | "email.introNoDate" {
  if (props.pastDue) {
    return "email.introPastDue";
  }
  return props.deadline ? "email.intro" : "email.introNoDate";
}

export function planMoveNoticeSubjectKey(
  props: Pick<PlanMoveNoticeProps, "pastDue" | "deadline">,
): "email.subject" | "email.subjectPastDue" | "email.subjectNoDate" {
  if (props.pastDue) {
    return "email.subjectPastDue";
  }
  return props.deadline ? "email.subject" : "email.subjectNoDate";
}

function PlanMoveNoticeEmail({
  props,
  t,
  locale,
  recipientEmail,
  tracking,
}: {
  props: PlanMoveNoticeProps;
  t: SubscriptionProviderSwitchNotifyT;
  locale: CountryLanguage;
  recipientEmail: string;
  tracking: TrackingContext;
}): ReactElement {
  const appName = configScopedTranslation.scopedT(locale).t("appName");
  const params = {
    appName,
    privateName: props.privateName,
    planName: props.planName,
    deadline: props.deadline,
  };

  return (
    <EmailTemplate
      locale={locale}
      title={t("email.headline")}
      previewText={t("email.previewText", params)}
      recipientEmail={recipientEmail}
      tracking={tracking}
    >
      <Span style={text}>{t("email.greeting", params)}</Span>
      <Span style={{ ...text, fontWeight: "700", color: "#111827" }}>
        {t(planMoveNoticeIntroKey(props), params)}
      </Span>

      <Section style={{ margin: "4px 0 24px 0" }}>
        <Button
          href={props.switchUrl}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "14px 24px",
            fontSize: "16px",
            fontWeight: "700",
          }}
        >
          {t("email.cta")}
        </Button>
      </Section>

      <Span style={text}>{t("email.reassurance")}</Span>
      <Span style={text}>{t("email.stance")}</Span>

      <Span style={text}>
        {t("email.crypto")}{" "}
        <Link
          href={props.cryptoUrl}
          style={{ color: "#2563eb", fontWeight: "600" }}
        >
          {t("email.cryptoCta")}
        </Link>
      </Span>

      <Span style={text}>{t("email.help")}</Span>
      <Span style={{ ...text, whiteSpace: "pre-line" }}>
        {t("email.signoff", params)}
      </Span>
    </EmailTemplate>
  );
}

export const planMoveNoticeEmailTemplate: EmailTemplateDefinition<
  PlanMoveNoticeProps,
  typeof notifyScopedTranslation,
  never,
  never,
  never,
  readonly [typeof UserRole.ADMIN]
> = {
  scopedTranslation: notifyScopedTranslation,
  meta: {
    id: "subscription-plan-move-notice",
    version: "1.0.0",
    name: "emailTemplate.name",
    description: "emailTemplate.description",
    category: "emailTemplate.category",
    path: "/subscription/provider-switch/notify/email.tsx",
    defaultSubject: "email.subject",
    previewFields: {
      privateName: {
        type: "text",
        label: "emailTemplate.preview.privateName.label",
        description: "emailTemplate.preview.privateName.description",
        defaultValue: "Max",
        required: true,
      },
      planName: {
        type: "text",
        label: "emailTemplate.preview.planName.label",
        description: "emailTemplate.preview.planName.description",
        defaultValue: "Plus",
        required: true,
      },
      deadline: {
        type: "text",
        label: "emailTemplate.preview.deadline.label",
        description: "emailTemplate.preview.deadline.description",
        defaultValue: "15.12.2026",
        required: true,
      },
    },
  },
  schema: planMoveNoticePropsSchema,
  component: PlanMoveNoticeEmail,
  exampleProps: {
    privateName: "Max",
    planName: "Plus",
    deadline: "15.12.2026",
    pastDue: false,
    switchUrl: "https://unbottled.ai/en-GLOBAL/subscription/overview#move-plan",
    cryptoUrl: "https://unbottled.ai/en-GLOBAL/subscription/buy",
  },
  // Never sent from an endpoint hook: the notify run renders and sends it.
  render: () =>
    success({
      skip: true as const,
      reason: "sent only by subscription-provider-switch-notify",
    }),
};
