/**

 * Results Journey - Follow-up 2 Email Template
 */

import React from "react";

import { Span } from "next-vibe-ui/ui/span";

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
        "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.previewText",
      )}
      locale={locale}
    >
      <EmailHeader backgroundColor="#dc2626" t={t} />
      <EmailContent>
        <Span
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#dc2626",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.greeting",
          )}
        </Span>

        <Span
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#374151",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.intro",
          )}
        </Span>

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
          <Span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#dc2626",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorTitle",
            )}
          </Span>

          <Span
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 16px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorAnalysis",
            )}
          </Span>

          <div style={{ paddingLeft: "20px" }}>
            <Span
              style={{ fontSize: "14px", color: "#374151", margin: "8px 0" }}
            >
              •{" "}
              {t(
                "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorPoint1",
              )}
            </Span>
            <Span
              style={{ fontSize: "14px", color: "#374151", margin: "8px 0" }}
            >
              •{" "}
              {t(
                "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorPoint2",
              )}
            </Span>
            <Span
              style={{ fontSize: "14px", color: "#374151", margin: "8px 0" }}
            >
              •{" "}
              {t(
                "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.competitorPoint3",
              )}
            </Span>
          </div>
        </div>

        {/* Opportunity Cost */}
        <Span
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#111827",
            margin: "32px 0 16px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.opportunityCostTitle",
          )}
        </Span>

        <Span
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.opportunityCostText",
          )}
        </Span>

        <CTAButton
          href={trackingUrl}
          text={t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.ctaText",
          )}
          backgroundColor="#dc2626"
          size="large"
          tracking={tracking}
        />

        <Span
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
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.urgency",
          )}
        </Span>
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
      "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup2.subject",
    ),
    jsx: emailContent,
  };
};
