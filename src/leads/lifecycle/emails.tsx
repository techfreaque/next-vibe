/**
 * Lifecycle emails - one renderer for every journey step.
 * Each email: greeting, two short paragraphs, ONE call to action, the legal
 * unsubscribe footer from the campaign layout.
 */

import "server-only";

import { render } from "@react-email/render";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import React from "react";

import { CampaignEmailLayout } from "@/messenger/providers/email/smtp-client/components/campaign_email_layout.email";
import { HumanCTAButton } from "@/messenger/providers/email/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/messenger/providers/email/smtp-client/components/human_text.email";
import { createTrackingContext } from "@/messenger/providers/email/smtp-client/components/tracking_context.email";

import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";

import type { LifecycleTemplateValue } from "./enum";
import { LifecycleTemplate } from "./enum";
import { scopedTranslation } from "./i18n";
import { TEMPLATE_CTA_PATH } from "./journeys";

type LifecycleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/** Free-credit tiers for invite copy, always read from config */
const freeTiers = {
  freeCreditsGuest: FREE_CREDIT_ALLOWANCE.guest,
  freeCreditsSignedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
  freeCreditsMax: FREE_CREDIT_MAX_TOTAL,
};

interface TemplateCopy {
  subject: string;
  preview: string;
  body1: string;
  body2: string;
  cta: string;
}

function copyFor(
  t: LifecycleT,
  template: typeof LifecycleTemplateValue,
  modelCount: number,
): TemplateCopy {
  switch (template) {
    case LifecycleTemplate.INACTIVE_NUDGE:
      return {
        subject: t("emails.inactiveNudge.subject"),
        preview: t("emails.inactiveNudge.preview"),
        body1: t("emails.inactiveNudge.body1"),
        body2: t("emails.inactiveNudge.body2"),
        cta: t("emails.inactiveNudge.cta"),
      };
    case LifecycleTemplate.INACTIVE_MODELS:
      return {
        subject: t("emails.inactiveModels.subject", { modelCount }),
        preview: t("emails.inactiveModels.preview"),
        body1: t("emails.inactiveModels.body1"),
        body2: t("emails.inactiveModels.body2"),
        cta: t("emails.inactiveModels.cta"),
      };
    case LifecycleTemplate.INACTIVE_UPGRADE:
      return {
        subject: t("emails.inactiveUpgrade.subject"),
        preview: t("emails.inactiveUpgrade.preview"),
        body1: t("emails.inactiveUpgrade.body1"),
        body2: t("emails.inactiveUpgrade.body2"),
        cta: t("emails.inactiveUpgrade.cta"),
      };
    case LifecycleTemplate.ENGAGED_VALUE:
      return {
        subject: t("emails.engagedValue.subject"),
        preview: t("emails.engagedValue.preview"),
        body1: t("emails.engagedValue.body1"),
        body2: t("emails.engagedValue.body2"),
        cta: t("emails.engagedValue.cta"),
      };
    case LifecycleTemplate.ENGAGED_UPGRADE:
      return {
        subject: t("emails.engagedUpgrade.subject"),
        preview: t("emails.engagedUpgrade.preview"),
        body1: t("emails.engagedUpgrade.body1"),
        body2: t("emails.engagedUpgrade.body2"),
        cta: t("emails.engagedUpgrade.cta"),
      };
    case LifecycleTemplate.ENGAGED_LAST:
      return {
        subject: t("emails.engagedLast.subject"),
        preview: t("emails.engagedLast.preview"),
        body1: t("emails.engagedLast.body1"),
        body2: t("emails.engagedLast.body2"),
        cta: t("emails.engagedLast.cta"),
      };
    case LifecycleTemplate.INVITE_SIGNUP:
      return {
        subject: t("emails.inviteSignup.subject"),
        preview: t("emails.inviteSignup.preview", freeTiers),
        body1: t("emails.inviteSignup.body1", { ...freeTiers, modelCount }),
        body2: t("emails.inviteSignup.body2", freeTiers),
        cta: t("emails.inviteSignup.cta"),
      };
    case LifecycleTemplate.INVITE_REMINDER:
      return {
        subject: t("emails.inviteReminder.subject"),
        preview: t("emails.inviteReminder.preview"),
        body1: t("emails.inviteReminder.body1"),
        body2: t("emails.inviteReminder.body2", freeTiers),
        cta: t("emails.inviteReminder.cta"),
      };
  }
}

export interface RenderLifecycleEmailInput {
  template: typeof LifecycleTemplateValue;
  locale: CountryLanguage;
  email: string;
  leadId: string | null;
  userId: string | null;
  baseUrl: string;
}

export interface RenderedLifecycleEmail {
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl: string;
  ctaUrl: string;
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

export async function renderLifecycleEmail(
  input: RenderLifecycleEmailInput,
): Promise<RenderedLifecycleEmail> {
  const { t } = scopedTranslation.scopedT(input.locale);
  const modelCount = getAvailableChatModelCount(
    false,
    await getEnvAvailability(),
  );
  const copy = copyFor(t, input.template, modelCount);
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
  const ctaUrl = `${input.baseUrl}/${input.locale}${TEMPLATE_CTA_PATH[input.template]}`;

  const jsx = (
    <CampaignEmailLayout
      previewText={copy.preview}
      locale={input.locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("emails.greeting")}</HumanText>
      <HumanText variant="body">{copy.body1}</HumanText>
      <HumanText variant="body">{copy.body2}</HumanText>
      <HumanCTAButton
        href={ctaUrl}
        text={copy.cta}
        variant="primary"
        tracking={tracking}
      />
      <HumanText variant="signature">{t("emails.signature")}</HumanText>
    </CampaignEmailLayout>
  );

  const html = await render(jsx);
  const text = [
    t("emails.greeting"),
    copy.body1,
    copy.body2,
    `${copy.cta}: ${ctaUrl}`,
    t("emails.signature"),
    `${t("emails.unsubscribeText")} ${unsubscribeUrl}`,
  ].join("\n\n");

  return { subject: copy.subject, html, text, unsubscribeUrl, ctaUrl };
}
