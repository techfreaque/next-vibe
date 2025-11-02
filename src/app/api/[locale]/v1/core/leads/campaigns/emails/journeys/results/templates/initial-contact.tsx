/**

 * Results Journey - Initial Contact Email Template
 */

import React from "react";

import { getPricingPlansArray } from "@/app/api/[locale]/v1/core/products/repository-client";
import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import { SubscriptionPlan } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { getLocaleString } from "@/i18n/core/localization-utils";
import { Span } from "next-vibe-ui/ui/span";

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
  const allPlans = getPricingPlansArray(locale);
  const starterPlan = allPlans.find(
    (plan) => plan.id === SubscriptionPlan.SUBSCRIPTION,
  );
  const starterPrice = starterPlan?.priceByCountry[country].monthly || 0;
  const starterCurrency =
    starterPlan?.priceByCountry[country].currency || "EUR";

  const emailContent = (
    <EmailLayout
      previewText={t(
        "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.previewText",
      )}
      locale={locale}
    >
      <EmailHeader backgroundColor="#2c82c9" t={t} />
      <EmailContent>
        {/* Hero Section */}
        <Span
          style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "#2c82c9",
            margin: "0 0 16px 0",
            textAlign: "center",
            lineHeight: "1.1",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.heroTitle",
          )}
        </Span>

        <Span
          style={{
            fontSize: "30px",
            color: "#54acd2",
            margin: "0 0 24px 0",
            textAlign: "center",
            lineHeight: "1.2",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.heroSubtitle",
          )}
        </Span>

        <Span
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 32px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.priceText",
            {
              price: formatCurrencyNoDecimals(
                starterPrice,
                starterCurrency,
                locale,
              ),
            },
          )}
        </Span>

        {/* Process/Content Image */}
        <div
          style={{
            margin: "0 0 32px 0",
            textAlign: "center",
          }}
        >
          {await EmailImage({
            src: "/images/process/content.png",
            alt: t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.processImagePlaceholder",
            ),
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
        <Span
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#111827",
            margin: "32px 0 16px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.noContractTitle",
          )}
        </Span>

        <Span
          style={{
            fontSize: "36px",
            color: "#374151",
            margin: "0 0 32px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.monthlyCancellation",
          )}
        </Span>

        <CTAButton
          href={trackingUrl}
          text={t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.ctaText",
          )}
          backgroundColor="#2c82c9"
          size="large"
          tracking={tracking}
        />

        {/* Contact Information */}
        <Span
          style={{
            fontSize: "16px",
            color: "#374151",
            margin: "32px 0 8px 0",
            textAlign: "center",
          }}
        >
          <strong>
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.contactTitle",
            )}
          </strong>
        </Span>

        <Span
          style={{
            fontSize: "16px",
            color: "#2563eb",
            margin: "0 0 16px 0",
            textAlign: "center",
          }}
        >
          {contactClientRepository.getSupportEmail(locale)}
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
      "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.initial.subject",
    ),
    jsx: emailContent,
  };
};
