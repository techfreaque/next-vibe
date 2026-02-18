/**
 * Journey: Side Hustle
 * Persona: An affiliate marketer who is transparent about the affiliation but earns it.
 * Tone: Honest, story-driven, practical. "I only share what I actually use."
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
 * Side Hustle - Initial Contact
 */
export const sideHustleInitialEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.opening",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.myStory",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.affiliateHonesty",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.proof",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.signature",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.postScript",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.initial.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Side Hustle - Follow-up 1
 */
export const sideHustleFollowup1Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup1.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup1.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup1.thisWeek",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup1.clientWork",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup1.howYouCanToo",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup1.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup1.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup1.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Side Hustle - Follow-up 2
 */
export const sideHustleFollowup2Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup2.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup2.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup2.anotherUseCase",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup2.passiveIncome",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup2.callToAction",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup2.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup2.signature",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup2.postScript",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup2.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Side Hustle - Follow-up 3
 */
export const sideHustleFollowup3Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup3.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup3.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup3.monthlyEarnings",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup3.noHardSell",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup3.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup3.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.followup3.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Side Hustle - Nurture
 */
export const sideHustleNurtureEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.nurture.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.nurture.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.nurture.tip",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.nurture.freeValue",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.nurture.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.nurture.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.nurture.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Side Hustle - Reactivation
 */
export const sideHustleReactivationEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl } = data;

  const emailContent = (
    <CampaignEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.reactivation.previewText",
      )}
      locale={locale}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.reactivation.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.reactivation.update",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.reactivation.newOpportunity",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.reactivation.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.reactivation.signature",
        )}
      </HumanText>
    </CampaignEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.sideHustle.reactivation.subject",
    ),
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
