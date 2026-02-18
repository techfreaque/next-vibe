/**
 * Journey: Uncensored Convert
 * Persona: An enthusiast who stumbled onto unbottled.ai and can't stop raving about it.
 * Tone: Casual, slightly conspiratorial, genuine excitement. Contains affiliate link framing.
 */

import React from "react";

import { CampaignEmailLayout } from "@/app/api/[locale]/emails/smtp-client/components/campaign_email_layout.email";
import { HumanCTAButton } from "@/app/api/[locale]/emails/smtp-client/components/human_cta_button.email";
import { HumanText } from "@/app/api/[locale]/emails/smtp-client/components/human_text.email";

import { EmailCampaignStage } from "../../../enum";
import type {
  EmailRenderContext,
  EmailTemplateFunction,
  JourneyTemplateMap,
} from "../types";

/**
 * Uncensored Convert - Initial Contact
 */
export const uncensoredConvertInitialEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.opening",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.discovery",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.whatItDoes",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.affiliateDisclosure",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.signature",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.postScript",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.initial.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Uncensored Convert - Follow-up 1
 */
export const uncensoredConvertFollowup1Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup1.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup1.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup1.recap",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup1.useCases",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup1.differentFromOthers",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup1.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup1.signature",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup1.postScript",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup1.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Uncensored Convert - Follow-up 2
 */
export const uncensoredConvertFollowup2Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup2.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup2.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup2.specificExample",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup2.comparison",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup2.nudge",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup2.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup2.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup2.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Uncensored Convert - Follow-up 3
 */
export const uncensoredConvertFollowup3Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup3.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup3.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup3.lastPitch",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup3.honesty",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup3.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup3.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.followup3.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Uncensored Convert - Nurture
 */
export const uncensoredConvertNurtureEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.nurture.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.nurture.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.nurture.newFeature",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.nurture.stillRelevant",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.nurture.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.nurture.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.nurture.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Uncensored Convert - Reactivation
 */
export const uncensoredConvertReactivationEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.reactivation.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.reactivation.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.reactivation.checkIn",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.reactivation.update",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.reactivation.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.reactivation.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.uncensoredConvert.reactivation.subject",
    ),
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
