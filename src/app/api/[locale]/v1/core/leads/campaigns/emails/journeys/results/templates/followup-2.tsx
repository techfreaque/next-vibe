/**

 * Results Journey - Follow-up 2 Email Template
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
      previewText={t("resultsJourney.followup2.previewText")}
      locale={locale}
    >
      <EmailHeader backgroundColor="#dc2626" t={t} />
      <EmailContent>
        <Text
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#dc2626",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.followup2.greeting")}
        </Text>

        <Text
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#374151",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.followup2.intro")}
        </Text>

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
          <Text
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#dc2626",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t("resultsJourney.followup2.competitorTitle")}
          </Text>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 16px 0",
            }}
          >
            {t("resultsJourney.followup2.competitorAnalysis")}
          </Text>

          <div style={{ paddingLeft: "20px" }}>
            <Text
              style={{ fontSize: "14px", color: "#374151", margin: "8px 0" }}
            >
              • {t("resultsJourney.followup2.competitorPoint1")}
            </Text>
            <Text
              style={{ fontSize: "14px", color: "#374151", margin: "8px 0" }}
            >
              • {t("resultsJourney.followup2.competitorPoint2")}
            </Text>
            <Text
              style={{ fontSize: "14px", color: "#374151", margin: "8px 0" }}
            >
              • {t("resultsJourney.followup2.competitorPoint3")}
            </Text>
          </div>
        </div>

        {/* Opportunity Cost */}
        <Text
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#111827",
            margin: "32px 0 16px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.followup2.opportunityCostTitle")}
        </Text>

        <Text
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#374151",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.followup2.opportunityCostText")}
        </Text>

        <CTAButton
          href={trackingUrl}
          text={t("resultsJourney.followup2.ctaText")}
          backgroundColor="#dc2626"
          size="large"
          tracking={tracking}
        />

        <Text
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#6b7280",
            margin: "24px 0 0 0",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {t("resultsJourney.followup2.urgency")}
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
    subject: t("resultsJourney.followup2.subject"),
    jsx: emailContent,
  };
};
