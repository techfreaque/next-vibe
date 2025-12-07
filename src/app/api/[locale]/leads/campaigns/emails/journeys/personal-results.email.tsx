/**
 * Personal Practical Journey Email Templates
 * Combines authentic personal connection with practical business information
 * Focuses on relationship building while providing concrete pricing and service details
 */

import { Section } from "@react-email/components";
import React from "react";

import { EmailCampaignStage } from "../../../enum";
import type {
  EmailRenderContext,
  EmailTemplateFunction,
  JourneyTemplateMap,
} from "../types";
import { EmailPricingSection } from "./components/pricing-section.email";
import { HumanEmailLayout } from "@/app/api/[locale]/emails/smtp-client/components/human_email_layout.email";
import { HumanText } from "@/app/api/[locale]/emails/smtp-client/components/human_text.email";
import { HumanCTAButton } from "@/app/api/[locale]/emails/smtp-client/components/human_cta_button.email";

/**
 * Personal Practical Journey - Initial Contact Email
 * REDESIGNED: Combines personal touch with visual pricing plans
 */
export const personalPracticalInitialEmail: EmailTemplateFunction = async ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.previewText",
      )}
      locale={locale}
      companyName={companyName}
      companyEmail={companyEmail}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      {/* Personal Touch Section */}
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.personalIntro",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.connectionValue",
        )}
      </HumanText>

      {/* Transition to Plans */}
      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.practicalTransition",
        )}
      </HumanText>

      {/* Visual Pricing Section */}
      <Section style={{ margin: "24px 0" }}>
        {await EmailPricingSection({ t, locale })}
      </Section>

      {/* Bridge to CTA */}
      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.plansBridge",
        )}
      </HumanText>

      {/* Call to Action */}
      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      {/* Personal Signature */}
      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.signature",
        )}
        <br />
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.signatureClosing",
        )}
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.components.defaults.signatureName",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.postScript",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.initial.subject",
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Practical Journey - Follow-up 1 Email
 * COMPLETELY REDESIGNED: Personal touch + implementation roadmap
 */
export const personalPracticalFollowup1Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;
  const businessName =
    lead.businessName ||
    t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.defaultBusinessName",
    );

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.previewText",
        {
          businessName,
        },
      )}
      locale={locale}
      companyName={companyName}
      companyEmail={companyEmail}
      unsubscribeUrl={unsubscribeUrl}
      t={t}
      tracking={tracking}
    >
      {/* Personal Opening */}
      <HumanText variant="greeting">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.personalReflection",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.thoughtProcess",
        )}
      </HumanText>

      {/* Implementation Roadmap */}
      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.roadmapIntro",
          {
            businessName,
          },
        )}
      </HumanText>

      {/* Visual Timeline Section */}
      <Section
        style={{
          margin: "24px 0",
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#2c82c9",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.timelineTitle",
          )}
        </span>

        {/* Week 1-2 */}
        <div
          style={{
            marginBottom: "16px",
            paddingLeft: "16px",
            borderLeft: "3px solid #2c82c9",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#2c82c9",
              margin: "0 0 4px 0",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.week1Title",
            )}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#374151",
              margin: "0",
              lineHeight: "1.4",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.week1Content",
            )}
          </span>
        </div>

        {/* Week 3-4 */}
        <div
          style={{
            marginBottom: "16px",
            paddingLeft: "16px",
            borderLeft: "3px solid #059669",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#059669",
              margin: "0 0 4px 0",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.week3Title",
            )}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#374151",
              margin: "0",
              lineHeight: "1.4",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.week3Content",
            )}
          </span>
        </div>

        {/* Month 2-3 */}
        <div style={{ paddingLeft: "16px", borderLeft: "3px solid #dc2626" }}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#dc2626",
              margin: "0 0 4px 0",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.month2Title",
            )}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#374151",
              margin: "0",
              lineHeight: "1.4",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.month2Content",
            )}
          </span>
        </div>
      </Section>

      {/* Personal Touch Continuation */}
      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.personalCommitment",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.nextSteps",
          {
            businessName,
          },
        )}
      </HumanText>

      {/* Call to Action */}
      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      {/* Personal Signature */}
      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.signature",
        )}
        <br />
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.signatureClosing",
        )}
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.components.defaults.signatureName",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.postScript",
          {
            businessName,
          },
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup1.subject",
      {
        businessName,
      },
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Practical Journey - Follow-up 2 Email
 */
export const personalPracticalFollowup2Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;
  const businessName =
    lead.businessName ||
    t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.defaultBusinessName",
    );

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.previewText",
        {
          businessName,
        },
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
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.personalContext",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.caseStudyIntro",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.realResults",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.methodExplanation",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.applicationTo",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.practicalNext",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.flexibleOptions",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.ctaText",
          {
            businessName,
          },
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.signature",
        )}
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.components.defaults.signatureName",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.postScript",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup2.subject",
      {
        businessName,
      },
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Practical Journey - Follow-up 3 Email
 */
export const personalPracticalFollowup3Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;
  const businessName =
    lead.businessName ||
    t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.defaultBusinessName",
    );

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.previewText",
        {
          businessName,
        },
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
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.finalReflection",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.marketTiming",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.personalCommitment",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.practicalOffer",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.noHighPressure",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.finalCTA",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.signature",
        )}
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.components.defaults.signatureName",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.postScript",
          {
            businessName,
          },
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.followup3.subject",
      {
        businessName,
      },
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Practical Journey - Nurture Email
 */
export const personalPracticalNurtureEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;
  const businessName =
    lead.businessName ||
    t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.defaultBusinessName",
    );

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.previewText",
        {
          businessName,
        },
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
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.friendlyCheckIn",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.practicalInsight",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.specificSuggestion",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.genuineCare",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.helpfulResource",
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.ctaText",
        )}
        variant="secondary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.signature",
        )}
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.components.defaults.signatureName",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.postScript",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.nurture.subject",
      {
        businessName,
      },
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Practical Journey - Reactivation Email
 */
export const personalPracticalReactivationEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;
  const businessName =
    lead.businessName ||
    t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.defaultBusinessName",
    );

  const emailContent = (
    <HumanEmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.previewText",
        {
          businessName,
        },
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
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.greeting",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.reconnection",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.newDevelopments",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.updatedResults",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.practicalEvolution",
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.specificOffer",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.investmentUpdate",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanText variant="body">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.personalInvitation",
          {
            businessName,
          },
        )}
      </HumanText>

      <HumanCTAButton
        href={trackingUrl}
        text={t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.ctaText",
        )}
        variant="primary"
        tracking={tracking}
      />

      <HumanText variant="signature">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.signature",
        )}
        <br />
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.components.defaults.signatureName",
        )}
      </HumanText>

      <HumanText variant="ps">
        {t(
          "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.postScript",
        )}
      </HumanText>
    </HumanEmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.leads.campaigns.emails.journeys.emailJourneys.leads.journeys.personalPractical.reactivation.subject",
      {
        businessName,
      },
    ),
    jsx: emailContent,
  };
};

/**
 * Personal Practical Journey Template Map
 */
export const personalPracticalJourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: personalPracticalInitialEmail,
  // [EmailCampaignStage.FOLLOWUP_1]: personalPracticalFollowup1Email,
  // [EmailCampaignStage.FOLLOWUP_2]: personalPracticalFollowup2Email,
  // [EmailCampaignStage.FOLLOWUP_3]: personalPracticalFollowup3Email,
  // [EmailCampaignStage.NURTURE]: personalPracticalNurtureEmail,
  // [EmailCampaignStage.REACTIVATION]: personalPracticalReactivationEmail,
};
