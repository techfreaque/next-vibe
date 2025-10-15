/**

 * Results Journey - Follow-up 1 Email Template
 * COMPLETELY REDESIGNED: Focus on proven results, case studies, and ROI
 */

import { Text } from "@react-email/components";
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
      previewText={t("resultsJourney.followup1.previewText")}
      locale={locale}
    >
      <EmailHeader backgroundColor="#2c82c9" t={t} />
      <EmailContent>
        {/* Main Headline */}
        <Text
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#2c82c9",
            margin: "0 0 16px 0",
            textAlign: "center",
            lineHeight: "1.1",
          }}
        >
          {t("resultsJourney.followup1.headline")}
        </Text>

        <Text
          style={{
            fontSize: "18px",
            color: "#374151",
            margin: "0 0 32px 0",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          {t("resultsJourney.followup1.subheadline")}
        </Text>

        {/* Case Study Section */}
        <Text
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 20px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.followup1.caseStudyTitle")}
        </Text>

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
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#0c4a6e",
              margin: "0 0 16px 0",
            }}
          >
            {t("resultsJourney.followup1.caseStudyCompany")}
          </Text>

          <Text
            style={{
              fontSize: "14px",
              color: "#0c4a6e",
              margin: "0 0 12px 0",
              fontWeight: "600",
            }}
          >
            {t("resultsJourney.followup1.caseStudyIndustry")}
          </Text>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 20px 0",
            }}
          >
            {t("resultsJourney.followup1.caseStudyResults")}
          </Text>

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
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0ea5e9",
                  margin: "0 0 4px 0",
                }}
              >
                {t("resultsJourney.followup1.metric1Value")}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0",
                }}
              >
                {t("resultsJourney.followup1.metric1Label")}
              </Text>
            </div>
            <div style={{ textAlign: "center" }}>
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0ea5e9",
                  margin: "0 0 4px 0",
                }}
              >
                {t("resultsJourney.followup1.metric2Value")}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0",
                }}
              >
                {t("resultsJourney.followup1.metric2Label")}
              </Text>
            </div>
          </div>

          <Text
            style={{
              fontSize: "14px",
              color: "#0c4a6e",
              margin: "0",
              fontStyle: "italic",
            }}
          >
            {t("resultsJourney.followup1.caseStudyTimeframe")}
          </Text>
        </div>

        {/* ROI Section */}
        <Text
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.followup1.roiTitle")}
        </Text>

        <Text
          style={{
            fontSize: "18px",
            color: "#374151",
            margin: "0 0 32px 0",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          {t("resultsJourney.followup1.roiExplanation")}
        </Text>

        {/* CTA Section */}
        <CTAButton
          href={trackingUrl}
          text={t("resultsJourney.followup1.ctaText")}
          backgroundColor="#2c82c9"
          size="large"
          tracking={tracking}
        />

        {/* Urgency */}
        <Text
          style={{
            fontSize: "16px",
            color: "#dc2626",
            margin: "24px 0 0 0",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {t("resultsJourney.followup1.urgency")}
        </Text>
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
    subject: t("resultsJourney.followup1.subject"),
    jsx: emailContent,
  };
};
