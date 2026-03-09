/**
 * Journey: Signup Nurture
 * Persona: A helpful onboarding guide welcoming the new user who just signed up.
 * Tone: Warm, helpful, practical. Focus on getting started, exploring models, setting preferences.
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
 * Signup Nurture - Initial Contact
 */
export const signupNurtureInitialEmail: EmailTemplateFunction = ({
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
        "emailJourneys.leads.journeys.signupNurture.initial.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.signupNurture.initial.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.initial.welcome")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.initial.firstSteps")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.initial.modelChoice")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.signupNurture.initial.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.signupNurture.initial.subject"),
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
  const { t: globalT } = simpleT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.signupNurture.followup1.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.signupNurture.followup1.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.followup1.checkIn")}
      </HumanText>

      <HumanText variant="body">
        {t(
          "emailJourneys.leads.journeys.signupNurture.followup1.exploreModels",
        )}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.followup1.tip")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.signupNurture.followup1.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.signupNurture.followup1.subject"),
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
  const { t: globalT } = simpleT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.signupNurture.followup2.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.signupNurture.followup2.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.followup2.preferences")}
      </HumanText>

      <HumanText variant="body">
        {t(
          "emailJourneys.leads.journeys.signupNurture.followup2.filterControl",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.signupNurture.followup2.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.signupNurture.followup2.subject"),
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
  const { t: globalT } = simpleT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.signupNurture.followup3.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.signupNurture.followup3.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.followup3.community")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.followup3.upgrade")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.signupNurture.followup3.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.signupNurture.followup3.subject"),
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
  const { t: globalT } = simpleT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.signupNurture.nurture.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.signupNurture.nurture.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.nurture.newModels")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.nurture.advancedTip")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.signupNurture.nurture.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.signupNurture.nurture.subject"),
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
  const { t: globalT } = simpleT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.signupNurture.reactivation.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.signupNurture.reactivation.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.signupNurture.reactivation.stillHere")}
      </HumanText>

      <HumanText variant="body">
        {t(
          "emailJourneys.leads.journeys.signupNurture.reactivation.whatChanged",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.signupNurture.reactivation.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "emailJourneys.leads.journeys.signupNurture.reactivation.subject",
    ),
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
