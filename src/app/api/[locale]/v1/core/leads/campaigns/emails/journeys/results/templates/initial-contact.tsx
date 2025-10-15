/**

 * Results Journey - Initial Contact Email Template
 */

import { Text } from "@react-email/components";
import React from "react";

import { getPricingPlansArray } from "@/app/[locale]/story/pricing/_components/pricing";
import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import { SubscriptionPlan } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { getLocaleString } from "@/i18n/core/localization-utils";

import {
  CTAButton,
  EmailContent,
  EmailFooter,
  EmailHeader,
  EmailImage,
  EmailLayout,
} from "../../../components";
import type { EmailRenderContext, EmailTemplateFunction } from "../../../types";
import { EmailPricingSection } from "../../components/pricing-section";

/**
 * Format currency without decimal places for leads pricing
 */
function formatCurrencyNoDecimals(
  amount: number,
  currency: string,
  locale: CountryLanguage,
): string {
  const localeString = getLocaleString(locale);
  const formatted = new Intl.NumberFormat(localeString, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // Remove spaces between currency symbol and amount
  return formatted.replace(/\s/g, "");
}

/**
 * Results Journey - Initial Contact Email
 */
export const resultsInitialEmail: EmailTemplateFunction = async ({
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
    (plan) => plan.id === SubscriptionPlan.STARTER,
  );
  const starterPrice = starterPlan?.priceByCountry[country].monthly || 0;
  const starterCurrency =
    starterPlan?.priceByCountry[country].currency || "EUR";

  const emailContent = (
    <EmailLayout
      previewText={t("resultsJourney.initial.previewText")}
      locale={locale}
    >
      <EmailHeader backgroundColor="#2c82c9" t={t} />
      <EmailContent>
        {/* Hero Section */}
        <Text
          style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "#2c82c9",
            margin: "0 0 16px 0",
            textAlign: "center",
            lineHeight: "1.1",
          }}
        >
          {t("resultsJourney.initial.heroTitle")}
        </Text>

        <Text
          style={{
            fontSize: "30px",
            color: "#54acd2",
            margin: "0 0 24px 0",
            textAlign: "center",
            lineHeight: "1.2",
          }}
        >
          {t("resultsJourney.initial.heroSubtitle")}
        </Text>

        <Text
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 32px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.initial.priceText", {
            price: formatCurrencyNoDecimals(
              starterPrice,
              starterCurrency,
              locale,
            ),
          })}
        </Text>

        {/* Process/Content Image */}
        <div
          style={{
            margin: "0 0 32px 0",
            textAlign: "center",
          }}
        >
          {await EmailImage({
            src: "/images/process/content.png",
            alt: t("resultsJourney.initial.processImagePlaceholder"),
            width: 600,
            style: {
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
          })}
        </div>

        {/* Pricing Section */}
        {await EmailPricingSection({ t, locale })}

        {/* No Contract Section */}
        <Text
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#111827",
            margin: "32px 0 16px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.initial.noContractTitle")}
        </Text>

        <Text
          style={{
            fontSize: "36px",
            color: "#374151",
            margin: "0 0 32px 0",
            textAlign: "center",
          }}
        >
          {t("resultsJourney.initial.monthlyCancellation")}
        </Text>

        <CTAButton
          href={trackingUrl}
          text={t("resultsJourney.initial.ctaText")}
          backgroundColor="#2c82c9"
          size="large"
          tracking={tracking}
        />

        {/* Contact Information */}
        <Text
          style={{
            fontSize: "16px",
            color: "#374151",
            margin: "32px 0 8px 0",
            textAlign: "center",
          }}
        >
          <strong>{t("resultsJourney.initial.contactTitle")}</strong>
        </Text>

        <Text
          style={{
            fontSize: "16px",
            color: "#2563eb",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          {contactClientRepository.getSupportEmail(locale)}
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
    subject: t("resultsJourney.initial.subject"),
    jsx: emailContent,
  };
};
