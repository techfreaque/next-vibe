/**
 * Journey: Quiet Recommendation
 * Persona: Low-key professional who tested the tool for weeks and is quietly passing it along.
 * Tone: Understated, high signal-to-noise, short emails. No hype, just specifics.
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
 * Quiet Recommendation - Initial Contact
 */
export const quietRecommendationInitialEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.initial.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.initial.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.initial.howIFoundIt",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.initial.whatItDoesDifferently",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.initial.affiliateNote",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.initial.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.initial.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.initial.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Follow-up 1
 */
export const quietRecommendationFollowup1Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup1.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup1.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup1.specificThing",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup1.builtWith",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup1.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup1.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup1.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Follow-up 2
 */
export const quietRecommendationFollowup2Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup2.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup2.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup2.comparison",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup2.honestTake",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup2.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup2.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup2.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Follow-up 3
 */
export const quietRecommendationFollowup3Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup3.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup3.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup3.lastOne",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup3.stayInTouch",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup3.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup3.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.followup3.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Nurture
 */
export const quietRecommendationNurtureEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.nurture.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.nurture.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.nurture.update",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.nurture.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.nurture.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.nurture.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Quiet Recommendation - Reactivation
 */
export const quietRecommendationReactivationEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.reactivation.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.reactivation.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.reactivation.checkIn",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.reactivation.whatChanged",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.reactivation.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.reactivation.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.quietRecommendation.reactivation.subject",
    ),
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
