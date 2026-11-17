/**
 * Lifecycle emails - one component for every journey step.
 *
 * Plain, personal layout: greeting, a short intro, an optional list (prompts,
 * what changed), one paragraph, ONE primary call to action (secondaryCta is
 * there for steps that need a second), sign-off, optional P.S., and the legal unsubscribe
 * footer from the campaign layout.
 *
 * Every number comes from config at render time: free-credit tiers
 * (products/constants), prices (getPricingParams, per locale/currency), model
 * counts (live model catalog), referral rate (referral/config).
 */

import "server-only";

import { render } from "@react-email/render";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  getAvailableChatModelCount,
  getAvailableChatModelCountsByContentLevel,
} from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";
import React from "react";

import { configScopedTranslation } from "@/env/i18n";
import { CampaignEmailLayout } from "@/messenger/providers/email/smtp-client/components/campaign_email_layout.email";
import { HumanCTAButton } from "@/messenger/providers/email/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/messenger/providers/email/smtp-client/components/human_text.email";
import type { TrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import { getPricingParams } from "@/products/repository-client";
import { REFERRAL_CONFIG } from "@/referral/config";

import type { LifecycleTemplateValue } from "./enum";
import { LifecycleTemplate } from "./enum";
import type { LifecycleT } from "./i18n";
import { scopedTranslation } from "./i18n";

/** Where each CTA points (path after /{locale}). */
const PATH = {
  chat: "/threads",
  buy: "/subscription/buy",
  signup: "/user/signup",
  models: "/models",
} as const;

/** Live model counts. Passed in as props so the preview tool can render them too. */
export interface LifecycleModelCounts {
  modelCount: number;
  mainstreamCount: number;
  openCount: number;
  uncensoredCount: number;
}

export async function loadModelCounts(): Promise<LifecycleModelCounts> {
  const availability = await getEnvAvailability();
  const byLevel = getAvailableChatModelCountsByContentLevel(
    false,
    availability,
  );
  return {
    modelCount: getAvailableChatModelCount(false, availability),
    mainstreamCount: byLevel.mainstream,
    openCount: byLevel.open,
    uncensoredCount: byLevel.uncensored,
  };
}

type CopyParams = Record<string, string | number>;

function copyParams(
  locale: CountryLanguage,
  counts: LifecycleModelCounts,
): CopyParams {
  const { t: configT } = configScopedTranslation.scopedT(locale);
  return {
    ...getPricingParams(locale),
    freeCreditsGuest: FREE_CREDIT_ALLOWANCE.guest,
    freeCreditsSignedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
    freeCreditsNewsletterBonus: FREE_CREDIT_ALLOWANCE.newsletterBonus,
    freeCreditsMax: FREE_CREDIT_MAX_TOTAL,
    referralPercent: Math.round(REFERRAL_CONFIG.DIRECT_PERCENTAGE * 100),
    appName: configT("appName"),
    ...counts,
  };
}

interface CopyItem {
  title: string;
  body: string;
}

interface CopyCta {
  text: string;
  path: string;
}

export interface LifecycleCopy {
  subject: string;
  preview: string;
  intro: string;
  items: CopyItem[];
  body: string;
  cta: CopyCta;
  secondaryCta: CopyCta | null;
  ps: string | null;
}

function buildCopy(
  t: LifecycleT,
  template: typeof LifecycleTemplateValue,
  p: CopyParams,
): LifecycleCopy {
  switch (template) {
    case LifecycleTemplate.FIRST_CHAT_PROMPTS:
      return {
        subject: t("emails.firstChatPrompts.subject", p),
        preview: t("emails.firstChatPrompts.preview", p),
        intro: t("emails.firstChatPrompts.intro", p),
        items: [
          {
            title: t("emails.firstChatPrompts.uncensoredTitle", p),
            body: t("emails.firstChatPrompts.uncensoredPrompt", p),
          },
          {
            title: t("emails.firstChatPrompts.mainstreamTitle", p),
            body: t("emails.firstChatPrompts.mainstreamPrompt", p),
          },
          {
            title: t("emails.firstChatPrompts.mediaTitle", p),
            body: t("emails.firstChatPrompts.mediaPrompt", p),
          },
        ],
        body: t("emails.firstChatPrompts.body", p),
        cta: { text: t("emails.firstChatPrompts.cta", p), path: PATH.chat },
        secondaryCta: null,
        ps: t("emails.firstChatPrompts.ps", p),
      };
    case LifecycleTemplate.OUT_OF_CREDITS:
      return {
        subject: t("emails.outOfCredits.subject", p),
        preview: t("emails.outOfCredits.preview", p),
        intro: t("emails.outOfCredits.intro", p),
        items: [
          {
            title: t("emails.outOfCredits.starterTitle", p),
            body: t("emails.outOfCredits.starterBody", p),
          },
          {
            title: t("emails.outOfCredits.moreTitle", p),
            body: t("emails.outOfCredits.moreBody", p),
          },
        ],
        body: t("emails.outOfCredits.body", p),
        cta: { text: t("emails.outOfCredits.cta", p), path: PATH.buy },
        secondaryCta: null,
        ps: t("emails.outOfCredits.ps", p),
      };
    case LifecycleTemplate.WHATS_NEW:
      return {
        subject: t("emails.whatsNew.subject", p),
        preview: t("emails.whatsNew.preview", p),
        intro: t("emails.whatsNew.intro", p),
        items: [
          {
            title: t("emails.whatsNew.modelsTitle", p),
            body: t("emails.whatsNew.modelsBody", p),
          },
          {
            title: t("emails.whatsNew.mediaTitle", p),
            body: t("emails.whatsNew.mediaBody", p),
          },
          {
            title: t("emails.whatsNew.languagesTitle", p),
            body: t("emails.whatsNew.languagesBody", p),
          },
        ],
        body: t("emails.whatsNew.body", p),
        cta: { text: t("emails.whatsNew.cta", p), path: PATH.models },
        secondaryCta: null,
        ps: t("emails.whatsNew.ps", p),
      };
    case LifecycleTemplate.WIN_BACK:
      return {
        subject: t("emails.winBack.subject", p),
        preview: t("emails.winBack.preview", p),
        intro: t("emails.winBack.intro", p),
        items: [],
        body: t("emails.winBack.body", p),
        cta: { text: t("emails.winBack.cta", p), path: PATH.chat },
        secondaryCta: null,
        ps: t("emails.winBack.ps", p),
      };
    case LifecycleTemplate.INVITE_SIGNUP:
      return {
        subject: t("emails.inviteSignup.subject", p),
        preview: t("emails.inviteSignup.preview", p),
        intro: t("emails.inviteSignup.intro", p),
        items: [
          {
            title: t("emails.inviteSignup.guestTitle", p),
            body: t("emails.inviteSignup.guestBody", p),
          },
          {
            title: t("emails.inviteSignup.accountTitle", p),
            body: t("emails.inviteSignup.accountBody", p),
          },
          {
            title: t("emails.inviteSignup.newsletterTitle", p),
            body: t("emails.inviteSignup.newsletterBody", p),
          },
        ],
        body: t("emails.inviteSignup.body", p),
        cta: { text: t("emails.inviteSignup.cta", p), path: PATH.signup },
        secondaryCta: null,
        ps: null,
      };
    case LifecycleTemplate.INVITE_REMINDER:
      return {
        subject: t("emails.inviteReminder.subject", p),
        preview: t("emails.inviteReminder.preview", p),
        intro: t("emails.inviteReminder.intro", p),
        items: [],
        body: t("emails.inviteReminder.body", p),
        cta: { text: t("emails.inviteReminder.cta", p), path: PATH.signup },
        secondaryCta: null,
        ps: t("emails.inviteReminder.ps", p),
      };
  }
}

export function getLifecycleCopy(
  template: typeof LifecycleTemplateValue,
  locale: CountryLanguage,
  counts: LifecycleModelCounts,
): LifecycleCopy {
  const { t } = scopedTranslation.scopedT(locale);
  return buildCopy(t, template, copyParams(locale, counts));
}

export function buildUnsubscribeUrl(
  baseUrl: string,
  locale: CountryLanguage,
  email: string,
  leadId: string | null,
): string {
  const query = leadId ? `?id=${encodeURIComponent(leadId)}` : "";
  return `${baseUrl}/${locale}/story/newsletter/unsubscribe/${encodeURIComponent(email)}${query}`;
}

const itemTitleStyle = {
  fontSize: "16px",
  color: "#111827",
  fontWeight: "bold" as const,
  margin: "0 0 4px 0",
};
const itemBodyStyle = {
  fontSize: "16px",
  color: "#374151",
  margin: "0",
  lineHeight: "1.6",
};
/** Inherit the signature block's look; one line per element, no gap. */
const signatureLineStyle = {
  margin: "0",
  fontSize: "inherit",
  lineHeight: "inherit",
  color: "inherit",
};
const itemStyle = {
  borderLeft: "3px solid #e5e7eb",
  padding: "2px 0 2px 14px",
  margin: "0 0 16px 0",
};

export interface LifecycleEmailProps {
  template: typeof LifecycleTemplateValue;
  locale: CountryLanguage;
  recipientEmail: string;
  leadId: string | null;
  name: string | null;
  counts: LifecycleModelCounts;
  tracking: TrackingContext;
}

/** The whole email body. Shared by the sender and the email preview registry (email.tsx). */
export function LifecycleEmail({
  template,
  locale,
  recipientEmail,
  leadId,
  name,
  counts,
  tracking,
}: LifecycleEmailProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const copy = getLifecycleCopy(template, locale, counts);
  const unsubscribeUrl = buildUnsubscribeUrl(
    tracking.baseUrl,
    locale,
    recipientEmail,
    leadId,
  );
  return (
    <CampaignEmailLayout
      previewText={copy.preview}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {name ? t("emails.greetingNamed", { name }) : t("emails.greeting")}
      </HumanText>
      <HumanText variant="body">{copy.intro}</HumanText>
      {copy.items.map((item) => (
        <Section key={item.title} style={itemStyle}>
          <Text style={itemTitleStyle}>{item.title}</Text>
          <Text style={itemBodyStyle}>{item.body}</Text>
        </Section>
      ))}
      <HumanText variant="body">{copy.body}</HumanText>
      <HumanCTAButton
        href={`/${locale}${copy.cta.path}`}
        text={copy.cta.text}
        variant="primary"
        tracking={tracking}
      />
      {copy.secondaryCta && (
        <HumanCTAButton
          href={`/${locale}${copy.secondaryCta.path}`}
          text={copy.secondaryCta.text}
          variant="secondary"
          tracking={tracking}
        />
      )}
      <HumanText variant="signature">
        <Text style={signatureLineStyle}>{t("emails.signoff")}</Text>
        <Text style={signatureLineStyle}>{t("emails.signature")}</Text>
      </HumanText>
      {copy.ps && <HumanText variant="ps">{copy.ps}</HumanText>}
    </CampaignEmailLayout>
  );
}

export interface RenderLifecycleEmailInput {
  template: typeof LifecycleTemplateValue;
  locale: CountryLanguage;
  email: string;
  leadId: string | null;
  userId: string | null;
  name: string | null;
  baseUrl: string;
  /** Optional: reuse counts across a run. Loaded live when absent. */
  counts?: LifecycleModelCounts;
}

export interface RenderedLifecycleEmail {
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl: string;
  ctaUrl: string;
  senderName: string;
}

export async function renderLifecycleEmail(
  input: RenderLifecycleEmailInput,
): Promise<RenderedLifecycleEmail> {
  const { t } = scopedTranslation.scopedT(input.locale);
  const counts = input.counts ?? (await loadModelCounts());
  const copy = getLifecycleCopy(input.template, input.locale, counts);
  const tracking = createTrackingContext(
    input.locale,
    input.leadId ?? undefined,
    input.userId ?? undefined,
    undefined,
    input.baseUrl,
  );
  const unsubscribeUrl = buildUnsubscribeUrl(
    input.baseUrl,
    input.locale,
    input.email,
    input.leadId,
  );
  const ctaUrl = `${input.baseUrl}/${input.locale}${copy.cta.path}`;

  const html = await render(
    <LifecycleEmail
      template={input.template}
      locale={input.locale}
      recipientEmail={input.email}
      leadId={input.leadId}
      name={input.name}
      counts={counts}
      tracking={tracking}
    />,
  );

  const greeting = input.name
    ? t("emails.greetingNamed", { name: input.name })
    : t("emails.greeting");
  const text = [
    greeting,
    copy.intro,
    ...copy.items.map((item) => `${item.title}\n${item.body}`),
    copy.body,
    `${copy.cta.text}: ${ctaUrl}`,
    ...(copy.secondaryCta
      ? [
          `${copy.secondaryCta.text}: ${input.baseUrl}/${input.locale}${copy.secondaryCta.path}`,
        ]
      : []),
    `${t("emails.signoff")}\n${t("emails.signature")}`,
    ...(copy.ps ? [copy.ps] : []),
    `${t("emails.unsubscribeText")} ${unsubscribeUrl}`,
  ].join("\n\n");

  return {
    subject: copy.subject,
    html,
    text,
    unsubscribeUrl,
    ctaUrl,
    senderName: t("emails.senderName"),
  };
}
