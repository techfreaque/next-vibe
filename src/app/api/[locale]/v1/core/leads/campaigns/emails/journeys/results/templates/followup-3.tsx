/**

 * Results Journey - Follow-up 3 Email Template (Final Opportunity)
 */

import React from "react";

import {
  CTAButton,
  EmailContent,
  EmailFooter,
  EmailHeader,
  EmailLayout,
} from "../../../components";
import type { EmailRenderContext, EmailTemplateFunction } from "../../../types";

/**
 * Results Journey - Follow-up 3 Email (Final Opportunity)
 */
export const resultsFollowup3Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <EmailLayout
      previewText={t(
        "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.previewText",
      )}
      locale={locale}
    >
      <EmailHeader backgroundColor="#ea580c" t={t} />
      <EmailContent>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#ea580c",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.greeting",
          )}
        </span>

        <span
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#374151",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.intro",
          )}
        </span>

        {/* Final Opportunity Section */}
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "24px",
            borderRadius: "8px",
            margin: "0 0 24px 0",
            border: "1px solid #fecaca",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#ea580c",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.finalOpportunityTitle",
            )}
          </span>

          <span
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.finalOpportunityText",
            )}
          </span>

          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#dc2626",
              margin: "0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.limitedTimeOffer",
            )}
          </span>
        </div>

        {/* What You're Missing */}
        <span
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#dc2626",
            textAlign: "center",
            margin: "32px 0 16px 0",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.whatYoureMissingTitle",
          )}
        </span>

        <div style={{ paddingLeft: "20px", margin: "0 0 24px 0" }}>
          <span
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0 0 12px 0",
              lineHeight: "1.6",
            }}
          >
            •{" "}
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.missingPoint1",
            )}
          </span>
          <span style={{ fontSize: "16px", color: "#374151", margin: "8px 0" }}>
            •{" "}
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.missingPoint2",
            )}
          </span>
          <span style={{ fontSize: "16px", color: "#374151", margin: "8px 0" }}>
            •{" "}
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.missingPoint3",
            )}
          </span>
        </div>

        {/* Last Chance Offer */}
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "24px",
            borderRadius: "12px",
            border: "2px solid #dc2626",
            margin: "32px 0",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#dc2626",
              margin: "0 0 16px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.lastChance",
            )}
          </span>
        </div>

        {/* CTA Button */}
        <CTAButton
          href={trackingUrl}
          text={t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.ctaText",
          )}
          backgroundColor="#ea580c"
          size="large"
          tracking={tracking}
        />

        <span
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#6b7280",
            margin: "24px 0 0 0",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.lastChance",
          )}
        </span>
      </EmailContent>
      <EmailFooter
        companyName={companyName}
        companyEmail={companyEmail}
        unsubscribeUrl={unsubscribeUrl}
        t={t}
        tracking={tracking}
      />
    </EmailLayout>
  );

  return {
    to: lead.email,
    subject: t(
      "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup3.subject",
    ),
    jsx: emailContent,
  };
};
