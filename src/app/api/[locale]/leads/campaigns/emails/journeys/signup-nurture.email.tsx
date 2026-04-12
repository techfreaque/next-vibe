/**
 * Journey: Signup Nurture
 * Persona: A helpful onboarding guide welcoming the new user who just signed up.
 * Tone: Warm, helpful, practical. Focus on getting started, exploring models, setting preferences.
 */

import React from "react";

import { CampaignEmailLayout } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/campaign_email_layout.email";
import { HumanCTAButton } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/human_text.email";
import { getAvailableModelCount } from "@/app/api/[locale]/agent/models/all-models";
import { configScopedTranslation } from "@/config/i18n";

import { EmailCampaignStage } from "../../../enum";
import type {
  EmailRenderContext,
  EmailTemplateFunction,
  JourneyTemplateMap,
} from "../types";
import { scopedTranslation } from "./signup-nurture/i18n";

/**
 * Signup Nurture - Initial Contact
 */
export const signupNurtureInitialEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("initial.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("initial.greeting")}</HumanText>

      <HumanText variant="body">{t("initial.welcome")}</HumanText>

      <HumanText variant="body">{t("initial.firstSteps")}</HumanText>

      <HumanText variant="body">
        {t("initial.modelChoice", {
          modelCount: getAvailableModelCount(false),
        })}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={configT("appName")}
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
 * Signup Nurture - Follow-up 1
 */
export const signupNurtureFollowup1Email: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("followup1.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("followup1.greeting")}</HumanText>

      <HumanText variant="body">{t("followup1.checkIn")}</HumanText>

      <HumanText variant="body">{t("followup1.exploreModels")}</HumanText>

      <HumanText variant="body">{t("followup1.tip")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={configT("appName")}
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
 * Signup Nurture - Follow-up 2
 */
export const signupNurtureFollowup2Email: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: configT } = configScopedTranslation.scopedT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("followup2.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("followup2.greeting")}</HumanText>

      <HumanText variant="body">{t("followup2.preferences")}</HumanText>

      <HumanText variant="body">{t("followup2.filterControl")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={configT("appName")}
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
 * Signup Nurture - Follow-up 3
 */
export const signupNurtureFollowup3Email: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: configT } = configScopedTranslation.scopedT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("followup3.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("followup3.greeting")}</HumanText>

      <HumanText variant="body">{t("followup3.community")}</HumanText>

      <HumanText variant="body">{t("followup3.upgrade")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={configT("appName")}
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
 * Signup Nurture - Nurture
 */
export const signupNurtureNurtureEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: configT } = configScopedTranslation.scopedT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("nurture.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("nurture.greeting")}</HumanText>

      <HumanText variant="body">{t("nurture.newModels")}</HumanText>

      <HumanText variant="body">{t("nurture.advancedTip")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={configT("appName")}
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
 * Signup Nurture - Reactivation
 */
export const signupNurtureReactivationEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: configT } = configScopedTranslation.scopedT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("reactivation.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("reactivation.greeting")}</HumanText>

      <HumanText variant="body">{t("reactivation.stillHere")}</HumanText>

      <HumanText variant="body">{t("reactivation.whatChanged")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={configT("appName")}
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
 * Signup Nurture Journey Template Map
 */
export const signupNurtureJourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: signupNurtureInitialEmail,
  [EmailCampaignStage.FOLLOWUP_1]: signupNurtureFollowup1Email,
  [EmailCampaignStage.FOLLOWUP_2]: signupNurtureFollowup2Email,
  [EmailCampaignStage.FOLLOWUP_3]: signupNurtureFollowup3Email,
  [EmailCampaignStage.NURTURE]: signupNurtureNurtureEmail,
  [EmailCampaignStage.REACTIVATION]: signupNurtureReactivationEmail,
};
