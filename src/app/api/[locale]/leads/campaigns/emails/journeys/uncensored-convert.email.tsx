/**
 * Journey: Uncensored Convert
 * Persona: An enthusiast who stumbled onto unbottled.ai and can't stop raving about it.
 * Tone: Casual, slightly conspiratorial, genuine excitement. Contains affiliate link framing.
 */

import React from "react";

import { CampaignEmailLayout } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/campaign_email_layout.email";
import { HumanCTAButton } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/app/api/[locale]/messenger/providers/email/smtp-client/components/human_text.email";
import { configScopedTranslation } from "@/config/i18n";

import { EmailCampaignStage } from "../../../enum";
import type {
  EmailRenderContext,
  EmailTemplateFunction,
  JourneyTemplateMap,
} from "../types";
import { scopedTranslation } from "./uncensored-convert/i18n";

/**
 * Uncensored Convert - Initial Contact
 */
export const uncensoredConvertInitialEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("initial.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("initial.greeting")}</HumanText>

      <HumanText variant="body">{t("initial.opening")}</HumanText>

      <HumanText variant="body">{t("initial.discovery")}</HumanText>

      <HumanText variant="body">{t("initial.whatItDoes")}</HumanText>

      <HumanText variant="body">{t("initial.affiliateDisclosure")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("appName")}
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
 * Uncensored Convert - Follow-up 1
 */
export const uncensoredConvertFollowup1Email: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = configScopedTranslation.scopedT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t("followup1.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("followup1.greeting")}</HumanText>

      <HumanText variant="body">{t("followup1.recap")}</HumanText>

      <HumanText variant="body">{t("followup1.useCases")}</HumanText>

      <HumanText variant="body">{t("followup1.differentFromOthers")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">{t("followup1.signature")}</HumanText>

      <HumanText variant="ps">{t("followup1.postScript")}</HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("followup1.subject"),
    jsx: emailContent,
  };
};

/**
 * Uncensored Convert - Follow-up 2
 */
export const uncensoredConvertFollowup2Email: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = configScopedTranslation.scopedT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("followup2.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("followup2.greeting")}</HumanText>

      <HumanText variant="body">{t("followup2.specificExample")}</HumanText>

      <HumanText variant="body">{t("followup2.comparison")}</HumanText>

      <HumanText variant="body">{t("followup2.nudge")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("appName")}
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
 * Uncensored Convert - Follow-up 3
 */
export const uncensoredConvertFollowup3Email: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = configScopedTranslation.scopedT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("followup3.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("followup3.greeting")}</HumanText>

      <HumanText variant="body">{t("followup3.lastPitch")}</HumanText>

      <HumanText variant="body">{t("followup3.honesty")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("appName")}
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
 * Uncensored Convert - Nurture
 */
export const uncensoredConvertNurtureEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = configScopedTranslation.scopedT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("nurture.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("nurture.greeting")}</HumanText>

      <HumanText variant="body">{t("nurture.newFeature")}</HumanText>

      <HumanText variant="body">{t("nurture.stillRelevant")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("appName")}
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
 * Uncensored Convert - Reactivation
 */
export const uncensoredConvertReactivationEmail: EmailTemplateFunction = ({
  data,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;
  const t = scopedTranslation.scopedT(locale).t;
  const { t: globalT } = configScopedTranslation.scopedT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t("reactivation.previewText")}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">{t("reactivation.greeting")}</HumanText>

      <HumanText variant="body">{t("reactivation.checkIn")}</HumanText>

      <HumanText variant="body">{t("reactivation.update")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("appName")}
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
 * Uncensored Convert Journey Template Map
 */
export const uncensoredConvertJourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: uncensoredConvertInitialEmail,
  [EmailCampaignStage.FOLLOWUP_1]: uncensoredConvertFollowup1Email,
  [EmailCampaignStage.FOLLOWUP_2]: uncensoredConvertFollowup2Email,
  [EmailCampaignStage.FOLLOWUP_3]: uncensoredConvertFollowup3Email,
  [EmailCampaignStage.NURTURE]: uncensoredConvertNurtureEmail,
  [EmailCampaignStage.REACTIVATION]: uncensoredConvertReactivationEmail,
};
