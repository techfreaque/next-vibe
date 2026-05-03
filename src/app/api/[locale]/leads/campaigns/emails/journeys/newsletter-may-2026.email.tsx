/**
 * Journey: Newsletter May 2026
 * One-shot newsletter blast to all signed-up users.
 * Persona: Max (founder), honest and direct.
 * Theme: Your AI companion gets better the more you invest in it.
 * You stay the pilot — but now you have a crew.
 */

import React from "react";

import { CampaignEmailLayout } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/campaign_email_layout.email";
import { HumanCTAButton } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/human_text.email";

import { FEEDBACK_REWARD_CREDITS } from "@/app/api/[locale]/credits/constants";

import { EmailCampaignStage } from "../../../enum";
import type {
  EmailRenderContext,
  EmailTemplateFunction,
  JourneyTemplateMap,
} from "../types";
import { scopedTranslation } from "./newsletter-may-2026/i18n";

/**
 * Newsletter May 2026 - Initial (and only) email
 */
export const newsletterMay2026InitialEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const credits = { credits: String(FEEDBACK_REWARD_CREDITS) };

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("initial.previewText", credits)}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("initial.greeting")}</HumanText>

      <HumanText variant="body">{t("initial.honestIntro")}</HumanText>

      <HumanText variant="body">
        {t("initial.honestAdmission", credits)}
      </HumanText>

      <HumanText variant="heading">{t("initial.pilotTitle")}</HumanText>
      <HumanText variant="body">{t("initial.pilotBody")}</HumanText>

      <HumanText variant="heading">{t("initial.cortexTitle")}</HumanText>
      <HumanText variant="body">{t("initial.cortexBody")}</HumanText>

      <HumanText variant="heading">{t("initial.dreamerTitle")}</HumanText>
      <HumanText variant="body">{t("initial.dreamerBody")}</HumanText>

      <HumanText variant="heading">{t("initial.autopilotTitle")}</HumanText>
      <HumanText variant="body">{t("initial.autopilotBody")}</HumanText>

      <HumanText variant="heading">{t("initial.mediaTitle")}</HumanText>
      <HumanText variant="body">{t("initial.mediaBody")}</HumanText>

      <HumanText variant="heading">{t("initial.yourMoveTitle")}</HumanText>
      <HumanText variant="body">{t("initial.yourMoveBody")}</HumanText>

      <HumanText variant="body">{t("initial.feedbackAsk", credits)}</HumanText>

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
export const newsletterMay2026JourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: newsletterMay2026InitialEmail,
};
