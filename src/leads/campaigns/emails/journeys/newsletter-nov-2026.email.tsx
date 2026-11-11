/**
 * Journey: Newsletter November 2026
 * One-shot re-activation newsletter to consented newsletter opt-ins.
 * Persona: Max (founder), honest and direct. Audience: beginners, conversion goal.
 * Theme: An AI companion genuinely on your side - your filter, your call, and a
 * default model that just got much cheaper. Editorial pass by Thea.
 */

import { EmailCampaignStage } from "next-vibe/identity/lead/enum";
import React from "react";

import { CampaignEmailLayout } from "@/messenger/providers/email/smtp-client/components/campaign_email_layout.email";
import { HumanCTAButton } from "@/messenger/providers/email/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/messenger/providers/email/smtp-client/components/human_text.email";

import type {
  EmailRenderContext,
  EmailTemplateFunction,
  JourneyTemplateMap,
} from "../types";
import { scopedTranslation } from "./newsletter-nov-2026/i18n";

/**
 * Newsletter November 2026 - Initial (and only) email
 */
export const newsletterNov2026InitialEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("initial.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("initial.greeting")}</HumanText>

      <HumanText variant="body">{t("initial.openingBody")}</HumanText>

      <HumanText variant="heading">{t("initial.companionTitle")}</HumanText>
      <HumanText variant="body">{t("initial.companionBody")}</HumanText>

      <HumanText variant="heading">{t("initial.controlTitle")}</HumanText>
      <HumanText variant="body">{t("initial.controlBody")}</HumanText>

      <HumanText variant="heading">{t("initial.valueTitle")}</HumanText>
      <HumanText variant="body">{t("initial.valueBody")}</HumanText>

      <HumanText variant="body">{t("initial.askBody")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t("initial.ctaText")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("initial.signature")}</HumanText>

      <HumanText variant="ps">{t("initial.ps")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("initial.subject"),
    jsx: emailContent,
  };
};

/**
 * Journey template map - single stage only (one-shot newsletter)
 */
export const newsletterNov2026JourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: newsletterNov2026InitialEmail,
};
