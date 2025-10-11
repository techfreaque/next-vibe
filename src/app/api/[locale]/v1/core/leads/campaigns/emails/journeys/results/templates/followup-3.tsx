/**
 * Results Journey - Follow-up 3 Email Template (Final Opportunity)
 */

import { Text } from "@react-email/components";

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
      previewText={t("resultsJourney.followup3.previewText")}
      locale={locale}
    >
      <EmailHeader backgroundColor="#ea580c" t={t} />
      <EmailContent>
        <Text
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#ea580c",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.followup3.greeting")}
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
          {t("resultsJourney.followup3.intro")}
        </Text>

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
          <Text
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#ea580c",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t("resultsJourney.followup3.finalOpportunityTitle")}
          </Text>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t("resultsJourney.followup3.finalOpportunityText")}
          </Text>

          <Text
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#dc2626",
              margin: "0",
              textAlign: "center",
            }}
          >
            {t("resultsJourney.followup3.limitedTimeOffer")}
          </Text>
        </div>

        {/* What You're Missing */}
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#dc2626",
            textAlign: "center",
            margin: "32px 0 16px 0",
          }}
        >
          {t("resultsJourney.followup3.whatYoureMissingTitle")}
        </Text>

        <div style={{ paddingLeft: "20px", margin: "0 0 24px 0" }}>
          <Text
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0 0 12px 0",
              lineHeight: "1.6",
            }}
          >
            • {t("resultsJourney.followup3.missingPoint1")}
          </Text>
          <Text style={{ fontSize: "16px", color: "#374151", margin: "8px 0" }}>
            • {t("resultsJourney.followup3.missingPoint2")}
          </Text>
          <Text style={{ fontSize: "16px", color: "#374151", margin: "8px 0" }}>
            • {t("resultsJourney.followup3.missingPoint3")}
          </Text>
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
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#dc2626",
              margin: "0 0 16px 0",
            }}
          >
            {t("resultsJourney.followup3.lastChance")}
          </Text>
        </div>

        {/* CTA Button */}
        <CTAButton
          href={trackingUrl}
          text={t("resultsJourney.followup3.ctaText")}
          backgroundColor="#ea580c"
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
          {t("resultsJourney.followup3.lastChance")}
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
    subject: t("resultsJourney.followup3.subject"),
    jsx: emailContent,
  };
};
