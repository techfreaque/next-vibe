/**
 * Journey: Quiet Recommendation
 * Persona: Low-key professional who tested the tool for weeks and is quietly passing it along.
 * Tone: Understated, high signal-to-noise, short emails. No hype, just specifics.
 */

import React from "react";

import { CampaignEmailLayout } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/campaign_email_layout.email";
import { HumanCTAButton } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/human_text.email";
import { simpleT } from "@/i18n/core/shared";

import { EmailCampaignStage } from "../../../enum";
import type {
  EmailRenderContext,
  EmailTemplateFunction,
  JourneyTemplateMap,
} from "../types";
import { scopedTranslation } from "./quiet-recommendation/i18n";

/**
 * Quiet Recommendation - Initial Contact
 */
export const quietRecommendationInitialEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = simpleT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("initial.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("initial.greeting")}</HumanText>

      <HumanText variant="body">{t("initial.howIFoundIt")}</HumanText>

      <HumanText variant="body">{t("initial.whatItDoesDifferently")}</HumanText>

      <HumanText variant="body">{t("initial.affiliateNote")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("initial.signature")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("initial.subject"),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Follow-up 1
 */
export const quietRecommendationFollowup1Email: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = simpleT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("followup1.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("followup1.greeting")}</HumanText>

      <HumanText variant="body">{t("followup1.specificThing")}</HumanText>

      <HumanText variant="body">{t("followup1.builtWith")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("followup1.signature")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("followup1.subject"),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Follow-up 2
 */
export const quietRecommendationFollowup2Email: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = simpleT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("followup2.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("followup2.greeting")}</HumanText>

      <HumanText variant="body">{t("followup2.comparison")}</HumanText>

      <HumanText variant="body">{t("followup2.honestTake")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("followup2.signature")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("followup2.subject"),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Follow-up 3
 */
export const quietRecommendationFollowup3Email: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = simpleT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("followup3.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("followup3.greeting")}</HumanText>

      <HumanText variant="body">{t("followup3.lastOne")}</HumanText>

      <HumanText variant="body">{t("followup3.stayInTouch")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("followup3.signature")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("followup3.subject"),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Nurture
 */
export const quietRecommendationNurtureEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = simpleT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("nurture.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("nurture.greeting")}</HumanText>

      <HumanText variant="body">{t("nurture.update")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("nurture.signature")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("nurture.subject"),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Reactivation
 */
export const quietRecommendationReactivationEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = simpleT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("reactivation.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("reactivation.greeting")}</HumanText>

      <HumanText variant="body">{t("reactivation.checkIn")}</HumanText>

      <HumanText variant="body">{t("reactivation.whatChanged")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("reactivation.signature")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("reactivation.subject"),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation Journey Template Map
 */
export const quietRecommendationJourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: quietRecommendationInitialEmail,
  [EmailCampaignStage.FOLLOWUP_1]: quietRecommendationFollowup1Email,
  [EmailCampaignStage.FOLLOWUP_2]: quietRecommendationFollowup2Email,
  [EmailCampaignStage.FOLLOWUP_3]: quietRecommendationFollowup3Email,
  [EmailCampaignStage.NURTURE]: quietRecommendationNurtureEmail,
  [EmailCampaignStage.REACTIVATION]: quietRecommendationReactivationEmail,
};
