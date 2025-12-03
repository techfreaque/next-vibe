/**

 * Results Journey - Follow-up 2 Email Template
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
 * Results Journey - Follow-up 2 Email
 */
export const resultsFollowup2Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <EmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.previewText",
      )}
      locale={locale}
    >
      <EmailHeader backgroundColor="#dc2626" t={t} />
      <EmailContent>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#dc2626",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.greeting",
          )}
        </div>

        <div
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#374151",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.intro",
          )}
        </div>

        {/* Competitor Analysis Section */}
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "24px",
            borderRadius: "8px",
            margin: "0 0 24px 0",
            border: "1px solid #fecaca",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#dc2626",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorTitle",
            )}
          </div>

          <div
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 16px 0",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorAnalysis",
            )}
          </div>

          <div style={{ paddingLeft: "20px" }}>
            <div
              style={{ fontSize: "14px", color: "#374151", margin: "8px 0" }}
            >
              •{" "}
              {t(
                "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorPoint1",
              )}
            </div>
            <div
              style={{ fontSize: "14px", color: "#374151", margin: "8px 0" }}
            >
              •{" "}
              {t(
                "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorPoint2",
              )}
            </div>
            <div
              style={{ fontSize: "14px", color: "#374151", margin: "8px 0" }}
            >
              •{" "}
              {t(
                "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorPoint3",
              )}
            </div>
          </div>
        </div>

        {/* Opportunity Cost */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#111827",
            margin: "32px 0 16px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.opportunityCostTitle",
          )}
        </div>

        <div
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.opportunityCostText",
          )}
        </div>

        <CTAButton
          href={trackingUrl}
          text={t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.ctaText",
          )}
          backgroundColor="#dc2626"
          size="large"
          tracking={tracking}
        />

        <div
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
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.urgency",
          )}
        </div>
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
      "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.subject",
    ),
    jsx: emailContent,
  };
};
