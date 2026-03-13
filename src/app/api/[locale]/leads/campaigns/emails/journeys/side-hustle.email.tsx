/**
 * Journey: Side Hustle
 * Persona: An affiliate marketer who is transparent about the affiliation but earns it.
 * Tone: Honest, story-driven, practical. "I only share what I actually use."
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
import { scopedTranslation } from "./side-hustle/i18n";

/**
 * Side Hustle - Initial Contact
 */
export const sideHustleInitialEmail: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("initial.opening")}</HumanText>

      <HumanText variant="body">{t("initial.myStory")}</HumanText>

      <HumanText variant="body">{t("initial.affiliateHonesty")}</HumanText>

      <HumanText variant="body">{t("initial.proof")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("initial.signature")}</HumanText>

      <HumanText variant="ps">{t("initial.postScript")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("initial.subject"),
    jsx: emailContent,
  };
};

/**
 * Side Hustle - Follow-up 1
 */
export const sideHustleFollowup1Email: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("followup1.thisWeek")}</HumanText>

      <HumanText variant="body">{t("followup1.clientWork")}</HumanText>

      <HumanText variant="body">{t("followup1.howYouCanToo")}</HumanText>

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
 * Side Hustle - Follow-up 2
 */
export const sideHustleFollowup2Email: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("followup2.anotherUseCase")}</HumanText>

      <HumanText variant="body">{t("followup2.passiveIncome")}</HumanText>

      <HumanText variant="body">{t("followup2.callToAction")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("followup2.signature")}</HumanText>

      <HumanText variant="ps">{t("followup2.postScript")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("followup2.subject"),
    jsx: emailContent,
  };
};

/**
 * Side Hustle - Follow-up 3
 */
export const sideHustleFollowup3Email: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("followup3.monthlyEarnings")}</HumanText>

      <HumanText variant="body">{t("followup3.noHardSell")}</HumanText>

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
 * Side Hustle - Nurture
 */
export const sideHustleNurtureEmail: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("nurture.tip")}</HumanText>

      <HumanText variant="body">{t("nurture.freeValue")}</HumanText>

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
 * Side Hustle - Reactivation
 */
export const sideHustleReactivationEmail: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("reactivation.update")}</HumanText>

      <HumanText variant="body">{t("reactivation.newOpportunity")}</HumanText>

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
 * Side Hustle Journey Template Map
 */
export const sideHustleJourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: sideHustleInitialEmail,
  [EmailCampaignStage.FOLLOWUP_1]: sideHustleFollowup1Email,
  [EmailCampaignStage.FOLLOWUP_2]: sideHustleFollowup2Email,
  [EmailCampaignStage.FOLLOWUP_3]: sideHustleFollowup3Email,
  [EmailCampaignStage.NURTURE]: sideHustleNurtureEmail,
  [EmailCampaignStage.REACTIVATION]: sideHustleReactivationEmail,
};
