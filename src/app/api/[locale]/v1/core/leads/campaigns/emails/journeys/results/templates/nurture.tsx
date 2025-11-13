/**

 * Results Journey - Nurture Email Template
 */

import React from "react";

import {
  CTAButton,
  EmailContent,
  EmailFooter,
  EmailLayout,
} from "../../../components";
import type { EmailRenderContext, EmailTemplateFunction } from "../../../types";

/**
 * Results Journey - Nurture Email
 */
export const resultsNurtureEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  const emailContent = (
    <EmailLayout
      previewText={t(
        "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.previewText",
      )}
      locale={locale}
    >
      <EmailContent>
        {/* Header */}
        <span
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
            textAlign: "center",
            margin: "0 0 32px 0",
            lineHeight: "1.2",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.subject",
          )}
        </span>

        {/* Personal Greeting */}
        <span
          style={{
            fontSize: "18px",
            color: "#374151",
            margin: "0 0 24px 0",
            lineHeight: "1.6",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.greeting",
          )}
        </span>

        {/* Industry Insights */}
        <div
          style={{
            backgroundColor: "#f0fdf4",
            padding: "24px",
            borderRadius: "8px",
            margin: "0 0 24px 0",
            border: "1px solid #bbf7d0",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#059669",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.insightsTitle",
            )}
          </span>

          <span
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 16px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.insight1",
            )}
          </span>

          <span
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.insight2",
            )}
          </span>
        </div>

        {/* Free Resource Offer */}
        <span
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#111827",
            margin: "32px 0 16px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.freeResourceTitle",
          )}
        </span>

        <span
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.freeResourceDescription",
          )}
        </span>

        {/* Tip 1 */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #bae6fd",
            margin: "0 0 16px 0",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#0369a1",
              margin: "0 0 8px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.greeting",
            )}
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.intro",
            )}
          </span>
        </div>

        {/* Tip 2 */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #bae6fd",
            margin: "0 0 16px 0",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#0369a1",
              margin: "0 0 8px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.greeting",
            )}
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.intro",
            )}
          </span>
        </div>

        {/* Tip 3 */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #bae6fd",
            margin: "0 0 24px 0",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#0369a1",
              margin: "0 0 8px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.greeting",
            )}
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.intro",
            )}
          </span>
        </div>

        {/* Industry Insights */}
        <span
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827",
            margin: "32px 0 16px 0",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.insightsTitle",
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
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.insight1",
            )}
          </span>
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
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.insight2",
            )}
          </span>
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
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.intro",
            )}
          </span>
        </div>

        {/* Soft CTA */}
        <span
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827",
            textAlign: "center",
            margin: "0 0 16px 0",
            padding: "20px",
            backgroundColor: "#ecfdf5",
            borderRadius: "8px",
            border: "1px solid #a7f3d0",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.greeting",
          )}
        </span>

        {/* CTA Button */}
        <CTAButton
          href={trackingUrl}
          text={t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.ctaText",
          )}
          backgroundColor="#059669"
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
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.noObligationText",
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
      "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.nurture.subject",
    ),
    jsx: emailContent,
  };
};
