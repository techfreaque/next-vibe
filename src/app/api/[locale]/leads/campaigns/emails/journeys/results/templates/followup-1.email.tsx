/**

 * Results Journey - Follow-up 1 Email Template
 * COMPLETELY REDESIGNED: Focus on proven results, case studies, and ROI
 */

import React from "react";
import type { EmailRenderContext, EmailTemplateFunction } from "../../../types";
import {
  CTAButton,
  EmailContent,
  EmailFooter,
  EmailHeader,
  EmailLayout,
} from "../../../components.email";

/**
 * Results Journey - Follow-up 1 Email (REDESIGNED)
 * Focus: Real client results, case studies, and proven ROI
 */
export const resultsFollowup1Email: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <EmailLayout
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.previewText",
      )}
      locale={locale}
    >
      <EmailHeader backgroundColor="#2c82c9" t={t} />
      <EmailContent>
        {/* Main Headline */}
        <span
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#2c82c9",
            margin: "0 0 16px 0",
            textAlign: "center",
            lineHeight: "1.1",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.headline",
          )}
        </span>

        <span
          style={{
            fontSize: "18px",
            color: "#374151",
            margin: "0 0 32px 0",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.subheadline",
          )}
        </span>

        {/* Case Study Section */}
        <span
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 20px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyTitle",
          )}
        </span>

        {/* Case Study Box */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            border: "2px solid #0ea5e9",
            borderRadius: "12px",
            padding: "24px",
            margin: "0 0 32px 0",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#0c4a6e",
              margin: "0 0 16px 0",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyCompany",
            )}
          </span>

          <span
            style={{
              fontSize: "14px",
              color: "#0c4a6e",
              margin: "0 0 12px 0",
              fontWeight: "600",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyIndustry",
            )}
          </span>

          <span
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 20px 0",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyResults",
            )}
          </span>

          {/* Results Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              margin: "0 0 20px 0",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0ea5e9",
                  margin: "0 0 4px 0",
                }}
              >
                {t(
                  "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.metric1Value",
                )}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0",
                }}
              >
                {t(
                  "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.metric1Label",
                )}
              </span>
            </div>
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0ea5e9",
                  margin: "0 0 4px 0",
                }}
              >
                {t(
                  "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.metric2Value",
                )}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0",
                }}
              >
                {t(
                  "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.metric2Label",
                )}
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: "14px",
              color: "#0c4a6e",
              margin: "0",
              fontStyle: "italic",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyTimeframe",
            )}
          </span>
        </div>

        {/* ROI Section */}
        <span
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.roiTitle",
          )}
        </span>

        <span
          style={{
            fontSize: "18px",
            color: "#374151",
            margin: "0 0 32px 0",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.roiExplanation",
          )}
        </span>

        {/* CTA Section */}
        <CTAButton
          href={trackingUrl}
          text={t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.ctaText",
          )}
          backgroundColor="#2c82c9"
          size="large"
          tracking={tracking}
        />

        {/* Urgency */}
        <span
          style={{
            fontSize: "16px",
            color: "#dc2626",
            margin: "24px 0 0 0",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.urgency",
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
      "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.subject",
    ),
    jsx: emailContent,
  };
};
