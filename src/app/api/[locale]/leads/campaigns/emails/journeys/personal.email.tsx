/**
 * Journey A: Personal Approach Email Templates
 * Emphasizes personal connection, human expertise, and relationship building
 */

import React from "react";

import { HumanCTAButton } from "@/app/api/[locale]/emails/smtp-client/components/human_cta_button.email";
import { HumanEmailLayout } from "@/app/api/[locale]/emails/smtp-client/components/human_email_layout.email";
import { HumanText } from "@/app/api/[locale]/emails/smtp-client/components/human_text.email";

import { EmailCampaignStage } from "../../../enum";
import type {
  EmailRenderContext,
  EmailTemplateFunction,
  JourneyTemplateMap,
} from "../types";

/**
 * Personal Journey - Initial Contact Email
 */
export const personalInitialEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.initial.previewText",
      )}
      locale={locale}
      companyName={companyName}
      companyEmail={companyEmail}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.initial.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.initial.intro",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.initial.serviceDescription",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.initial.convenience",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.initial.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.initial.signature",
        )}
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.components.defaults.signatureName",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.initial.postScript",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.initial.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Journey - Follow-up 1 Email
 */
export const personalFollowup1Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.previewText",
      )}
      locale={locale}
      companyName={companyName}
      companyEmail={companyEmail}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.intro",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.empathy",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.socialProof.quote",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.question",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.socialProof.author",
        )}
      </HumanText>

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.signature",
        )}
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.components.defaults.signatureName",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup1.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Journey - Follow-up 2 Email
 */
export const personalFollowup2Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.previewText",
      )}
      locale={locale}
      companyName={companyName}
      companyEmail={companyEmail}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.intro",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.story1",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.story2",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.mission",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.signature",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.closing",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup2.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Journey - Follow-up 3 Email
 */
export const personalFollowup3Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup3.previewText",
      )}
      locale={locale}
      companyName={companyName}
      companyEmail={companyEmail}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup3.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup3.intro",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup3.reflection",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup3.noPressure",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup3.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup3.signature",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup3.closing",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.followup3.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Journey - Nurture Email
 */
export const personalNurtureEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.nurture.previewText",
      )}
      locale={locale}
      companyName={companyName}
      companyEmail={companyEmail}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.nurture.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.nurture.intro",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.nurture.tip",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.nurture.value",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.nurture.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.nurture.signature",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.nurture.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Journey - Reactivation Email
 */
export const personalReactivationEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.reactivation.previewText",
      )}
      locale={locale}
      companyName={companyName}
      companyEmail={companyEmail}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.reactivation.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.reactivation.intro",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.reactivation.checkIn",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.reactivation.offer",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.reactivation.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.reactivation.signature",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.reactivation.closing",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personal.reactivation.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Journey Template Map
 */
export const personalJourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: personalInitialEmail,
  [EmailCampaignStage.FOLLOWUP_1]: personalFollowup1Email,
  [EmailCampaignStage.FOLLOWUP_2]: personalFollowup2Email,
  [EmailCampaignStage.FOLLOWUP_3]: personalFollowup3Email,
  [EmailCampaignStage.NURTURE]: personalNurtureEmail,
  [EmailCampaignStage.REACTIVATION]: personalReactivationEmail,
};
