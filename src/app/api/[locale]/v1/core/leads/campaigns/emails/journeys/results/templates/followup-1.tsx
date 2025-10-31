/**

 * Results Journey - Follow-up 1 Email Template
 * COMPLETELY REDESIGNED: Focus on proven results, case studies, and ROI
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
        "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.previewText",
      )}
      locale={locale}
    >
      <EmailHeader backgroundColor="#2c82c9" t={t} />
      <EmailContent>
        {/* Main Headline */}
        <Span
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
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.headline",
          )}
        </Span>

        <Span
          style={{
            fontSize: "18px",
            color: "#374151",
            margin: "0 0 32px 0",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.subheadline",
          )}
        </Span>

        {/* Case Study Section */}
        <Span
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 20px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyTitle",
          )}
        </Span>

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
          <Span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#0c4a6e",
              margin: "0 0 16px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyCompany",
            )}
          </Span>

          <Span
            style={{
              fontSize: "14px",
              color: "#0c4a6e",
              margin: "0 0 12px 0",
              fontWeight: "600",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyIndustry",
            )}
          </Span>

          <Span
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 20px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyResults",
            )}
          </Span>

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
              <Span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0ea5e9",
                  margin: "0 0 4px 0",
                }}
              >
                {t(
                  "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.metric1Value",
                )}
              </Span>
              <Span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0",
                }}
              >
                {t(
                  "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.metric1Label",
                )}
              </Span>
            </div>
            <div style={{ textAlign: "center" }}>
              <Span
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0ea5e9",
                  margin: "0 0 4px 0",
                }}
              >
                {t(
                  "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.metric2Value",
                )}
              </Span>
              <Span
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0",
                }}
              >
                {t(
                  "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.metric2Label",
                )}
              </Span>
            </div>
          </div>

          <Span
            style={{
              fontSize: "14px",
              color: "#0c4a6e",
              margin: "0",
              fontStyle: "italic",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.caseStudyTimeframe",
            )}
          </Span>
        </div>

        {/* ROI Section */}
        <Span
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.roiTitle",
          )}
        </Span>

        <Span
          style={{
            fontSize: "18px",
            color: "#374151",
            margin: "0 0 32px 0",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.roiExplanation",
          )}
        </Span>

        {/* CTA Section */}
        <CTAButton
          href={trackingUrl}
          text={t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.ctaText",
          )}
          backgroundColor="#2c82c9"
          size="large"
          tracking={tracking}
        />

        {/* Urgency */}
        <Span
          style={{
            fontSize: "16px",
            color: "#dc2626",
            margin: "24px 0 0 0",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.urgency",
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
      "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.followup1.subject",
    ),
    jsx: emailContent,
  };
};
