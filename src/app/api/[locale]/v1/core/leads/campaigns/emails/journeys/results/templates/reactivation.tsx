/**

 * Results Journey - Reactivation Email Template
 */

import { Text } from "@react-email/components";
import React from "react";

import { getPricingPlansArray } from "@/app/[locale]/story/pricing/_components/pricing";
import { SubscriptionPlan } from "@/app/api/[locale]/v1/core/subscription/enum";
import { formatCurrencyNoDecimals } from "@/i18n/core/localization-utils";
import { getCountryFromLocale } from "@/i18n/core/translation-utils";

import {
  CTAButton,
  EmailContent,
  EmailFooter,
  EmailHeader,
  EmailLayout,
} from "../../../components";
import type { EmailRenderContext, EmailTemplateFunction } from "../../../types";

/**
 * Results Journey - Reactivation Email
 */
export const resultsReactivationEmail: EmailTemplateFunction = ({
  data,
  t,
  locale,
  tracking,
}: EmailRenderContext) => {
  const { lead, unsubscribeUrl, trackingUrl, companyName, companyEmail } = data;

  // Get locale-specific pricing for starter plan
  const country = getCountryFromLocale(locale);
  const allPlans = getPricingPlansArray();
  const starterPlan = allPlans.find(
    (plan) => plan.id === SubscriptionPlan.SUBSCRIPTION,
  );
  const starterPrice = starterPlan?.priceByCountry[country].monthly || 0;
  const starterCurrency =
    starterPlan?.priceByCountry[country].currency || "EUR";

  const emailContent = (
    <EmailLayout
      previewText={t("resultsJourney.reactivation.previewText")}
      locale={locale}
    >
      <EmailHeader backgroundColor="#7c3aed" t={t} />
      <EmailContent>
        <Text
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#7c3aed",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.reactivation.greeting")}
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
          {t("resultsJourney.reactivation.intro")}
        </Text>

        {/* Special Offer Section */}
        <div
          style={{
            backgroundColor: "#faf5ff",
            padding: "24px",
            borderRadius: "8px",
            margin: "0 0 24px 0",
            border: "1px solid #e9d5ff",
          }}
        >
          <Text
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#7c3aed",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t("resultsJourney.reactivation.specialOfferTitle")}
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
            {t("resultsJourney.reactivation.intro")}
          </Text>

          <Text
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#dc2626",
              margin: "0",
              textAlign: "center",
            }}
          >
            {formatCurrencyNoDecimals(starterPrice, starterCurrency, locale)}
          </Text>
        </div>

        {/* Special Offer */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            padding: "24px",
            borderRadius: "12px",
            border: "2px solid #f59e0b",
            margin: "32px 0",
            textAlign: "center",
          }}
        >
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#92400e",
              margin: "0 0 16px 0",
            }}
          >
            {t("resultsJourney.reactivation.specialOfferTitle")}
          </Text>
          <Text
            style={{
              fontSize: "18px",
              color: "#374151",
              margin: "0 0 20px 0",
              lineHeight: "1.6",
            }}
          >
            {t("resultsJourney.reactivation.discountOffer", {
              price: formatCurrencyNoDecimals(
                starterPrice,
                starterCurrency,
                locale,
              ),
            })}
          </Text>

          {/* Discount Badge */}
          <div
            style={{
              backgroundColor: "#f59e0b",
              color: "#ffffff",
              padding: "16px",
              borderRadius: "8px",
              fontSize: "20px",
              fontWeight: "700",
              margin: "16px 0",
            }}
          >
            {t("resultsJourney.reactivation.greeting")}
          </div>
        </div>

        {/* Success Stories Since You Left */}
        <Text
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827",
            margin: "32px 0 16px 0",
          }}
        >
          {t("resultsJourney.reactivation.greeting")}
        </Text>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            margin: "0 0 16px 0",
          }}
        >
          <Text
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0 0 12px 0",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            {t("resultsJourney.reactivation.intro")}
          </Text>
          <Text
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0",
              textAlign: "right",
            }}
          >
            {t("resultsJourney.reactivation.greeting")}
          </Text>
        </div>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            margin: "0 0 24px 0",
          }}
        >
          <Text
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0 0 12px 0",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            {t("resultsJourney.reactivation.intro")}
          </Text>
          <Text
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0",
              textAlign: "right",
            }}
          >
            {t("resultsJourney.reactivation.greeting")}
          </Text>
        </div>

        {/* Limited Time Offer */}
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #dc2626",
            margin: "32px 0",
            textAlign: "center",
          }}
        >
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#dc2626",
              margin: "0 0 12px 0",
            }}
          >
            {t("resultsJourney.reactivation.greeting")}
          </Text>
          <Text
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            {t("resultsJourney.reactivation.intro")}
          </Text>
        </div>

        {/* CTA Button */}
        <CTAButton
          href={trackingUrl}
          text={t("resultsJourney.reactivation.ctaText")}
          backgroundColor="#7c3aed"
          size="large"
          tracking={tracking}
        />

        {/* Final Message */}
        <Text
          style={{
            fontSize: "16px",
            color: "#7c3aed",
            textAlign: "center",
            margin: "0 0 24px 0",
            fontWeight: "600",
            padding: "16px",
            backgroundColor: "#f3e8ff",
            borderRadius: "8px",
            border: "1px solid #c4b5fd",
          }}
        >
          {t("resultsJourney.reactivation.intro")}
        </Text>

        {/* Closing */}
        <Text
          style={{
            fontSize: "16px",
            color: "#374151",
            margin: "0 0 24px 0",
            lineHeight: "1.6",
          }}
        >
          {t("resultsJourney.reactivation.intro")}
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
    subject: t("resultsJourney.reactivation.subject"),
    jsx: emailContent,
  };
};
