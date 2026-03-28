/**
 * Journey: Winback
 * Persona: Someone who noticed the user left and genuinely wants them back.
 * Tone: Honest, no pressure, offering value. Focus on what has changed/improved since they left, special offer to return.
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
import { scopedTranslation } from "./winback/i18n";

/**
 * Winback - Initial Contact
 */
export const winbackInitialEmail: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("initial.noticed")}</HumanText>

      <HumanText variant="body">{t("initial.whatChanged")}</HumanText>

      <HumanText variant="body">{t("initial.noHardFeelings")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("appName")}
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
 * Winback - Follow-up 1
 */
export const winbackFollowup1Email: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("followup1.improvements")}</HumanText>

      <HumanText variant="body">{t("followup1.specificChange")}</HumanText>

      <HumanText variant="body">{t("followup1.openDoor")}</HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("appName")}
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
 * Winback - Follow-up 2
 */
export const winbackFollowup2Email: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("followup2.specialOffer")}</HumanText>

      <HumanText variant="body">{t("followup2.offerDetails")}</HumanText>

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
 * Winback - Follow-up 3
 */
export const winbackFollowup3Email: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("followup3.lastAttempt")}</HumanText>

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
 * Winback - Nurture
 */
export const winbackNurtureEmail: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("nurture.majorUpdate")}</HumanText>

      <HumanText variant="body">{t("nurture.gentleInvite")}</HumanText>

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
 * Winback - Reactivation
 */
export const winbackReactivationEmail: EmailTemplateFunction = ({
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

      <HumanText variant="body">{t("reactivation.longTime")}</HumanText>

      <HumanText variant="body">{t("reactivation.finalOffer")}</HumanText>

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
 * Winback Journey Template Map
 */
export const winbackJourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: winbackInitialEmail,
  [EmailCampaignStage.FOLLOWUP_1]: winbackFollowup1Email,
  [EmailCampaignStage.FOLLOWUP_2]: winbackFollowup2Email,
  [EmailCampaignStage.FOLLOWUP_3]: winbackFollowup3Email,
  [EmailCampaignStage.NURTURE]: winbackNurtureEmail,
  [EmailCampaignStage.REACTIVATION]: winbackReactivationEmail,
};
