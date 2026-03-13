/**
 * Journey: Retention
 * Persona: A success manager checking in with an active subscriber.
 * Tone: Supportive, value-reinforcing. Focus on new features, tips, celebrating usage milestones, encouraging continued subscription.
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
import { scopedTranslation } from "./retention/i18n";

/**
 * Retention - Initial Contact
 */
export const retentionInitialEmail: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("initial.thankYou")}</HumanText>

      <HumanText variant="body">{t("initial.valueSummary")}</HumanText>

      <HumanText variant="body">{t("initial.whatIsNext")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
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
 * Retention - Follow-up 1
 */
export const retentionFollowup1Email: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("followup1.newFeature")}</HumanText>

      <HumanText variant="body">{t("followup1.howToUse")}</HumanText>

      <HumanText variant="body">{t("followup1.encouragement")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
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
 * Retention - Follow-up 2
 */
export const retentionFollowup2Email: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("followup2.milestone")}</HumanText>

      <HumanText variant="body">{t("followup2.insiderTip")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
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
 * Retention - Follow-up 3
 */
export const retentionFollowup3Email: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("followup3.roadmap")}</HumanText>

      <HumanText variant="body">{t("followup3.feedback")}</HumanText>

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
 * Retention - Nurture
 */
export const retentionNurtureEmail: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("nurture.appreciation")}</HumanText>

      <HumanText variant="body">{t("nurture.exclusiveContent")}</HumanText>

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
 * Retention - Reactivation
 */
export const retentionReactivationEmail: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("reactivation.loyalty")}</HumanText>

      <HumanText variant="body">{t("reactivation.bigUpdate")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
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
 * Retention Journey Template Map
 */
export const retentionJourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: retentionInitialEmail,
  [EmailCampaignStage.FOLLOWUP_1]: retentionFollowup1Email,
  [EmailCampaignStage.FOLLOWUP_2]: retentionFollowup2Email,
  [EmailCampaignStage.FOLLOWUP_3]: retentionFollowup3Email,
  [EmailCampaignStage.NURTURE]: retentionNurtureEmail,
  [EmailCampaignStage.REACTIVATION]: retentionReactivationEmail,
};
