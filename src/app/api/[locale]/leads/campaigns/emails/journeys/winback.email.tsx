/**
 * Journey: Winback
 * Persona: Someone who noticed the user left and genuinely wants them back.
 * Tone: Honest, no pressure, offering value. Focus on what has changed/improved since they left, special offer to return.
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
 * Winback - Initial Contact
 */
export const winbackInitialEmail: EmailTemplateFunction = ({
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
        "emailJourneys.leads.journeys.winback.initial.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.winback.initial.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.initial.noticed")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.initial.whatChanged")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.initial.noHardFeelings")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.winback.initial.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.winback.initial.subject"),
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
  const { t: globalT } = simpleT(locale);
  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.winback.followup1.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.winback.followup1.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.followup1.improvements")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.followup1.specificChange")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.followup1.openDoor")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.winback.followup1.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.winback.followup1.subject"),
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
  const { t: globalT } = simpleT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.winback.followup2.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.winback.followup2.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.followup2.specialOffer")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.followup2.offerDetails")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.winback.followup2.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.winback.followup2.subject"),
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
  const { t: globalT } = simpleT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.winback.followup3.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.winback.followup3.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.followup3.lastAttempt")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.followup3.honesty")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.winback.followup3.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.winback.followup3.subject"),
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
  const { t: globalT } = simpleT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.winback.nurture.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.winback.nurture.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.nurture.majorUpdate")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.nurture.gentleInvite")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.winback.nurture.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.winback.nurture.subject"),
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
  const { t: globalT } = simpleT(locale);

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "emailJourneys.leads.journeys.winback.reactivation.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t("emailJourneys.leads.journeys.winback.reactivation.greeting")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.reactivation.longTime")}
      </HumanText>

      <HumanText variant="body">
        {t("emailJourneys.leads.journeys.winback.reactivation.finalOffer")}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={globalT("config.appName")}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t("emailJourneys.leads.journeys.winback.reactivation.signature")}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t("emailJourneys.leads.journeys.winback.reactivation.subject"),
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
