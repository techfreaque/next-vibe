/**
 * Journey: Retention
 * Persona: A success manager checking in with an active subscriber.
 * Tone: Supportive, value-reinforcing. Focus on new features, tips, celebrating usage milestones, encouraging continued subscription.
 */

import React from "react";

import { CampaignEmailLayout } from "@/app/api/[locale]/emails/smtp-client/components/campaign_email_layout.email";
import { HumanCTAButton } from "@/app/api/[locale]/emails/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/app/api/[locale]/emails/smtp-client/components/human_text.email";
import { simpleT } from "@/i18n/core/shared";

import { EmailCampaignStage } from "../../../enum";
import type {
  EmailRenderContext,
  EmailTemplateFunction,
  JourneyTemplateMap,
} from "../types";
import { scopedTranslation } from "./i18n";

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
      previewText={t(
        "emailJourneys.leads.journeys.retention.initial.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.retention.initial.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.initial.thankYou")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.initial.valueSummary")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.initial.whatIsNext")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.retention.initial.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.retention.initial.subject"),
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
      previewText={t(
        "emailJourneys.leads.journeys.retention.followup1.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.retention.followup1.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.followup1.newFeature")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.followup1.howToUse")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.followup1.encouragement")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.retention.followup1.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.retention.followup1.subject"),
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
      previewText={t(
        "emailJourneys.leads.journeys.retention.followup2.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.retention.followup2.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.followup2.milestone")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.followup2.insiderTip")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.retention.followup2.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.retention.followup2.subject"),
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
      previewText={t(
        "emailJourneys.leads.journeys.retention.followup3.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.retention.followup3.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.followup3.roadmap")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.followup3.feedback")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.retention.followup3.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.retention.followup3.subject"),
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
      previewText={t(
        "emailJourneys.leads.journeys.retention.nurture.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.retention.nurture.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.nurture.appreciation")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.nurture.exclusiveContent")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.retention.nurture.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.retention.nurture.subject"),
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
      previewText={t(
        "emailJourneys.leads.journeys.retention.reactivation.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.retention.reactivation.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.reactivation.loyalty")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.retention.reactivation.bigUpdate")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.retention.reactivation.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.retention.reactivation.subject"),
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
