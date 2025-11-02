/**

 * Results Journey - Reactivation Email Template
 */

import React from "react";

import { getPricingPlansArray } from "@/app/api/[locale]/v1/core/products/repository-client";
import { SubscriptionPlan } from "@/app/api/[locale]/v1/core/subscription/enum";
import { formatCurrencyNoDecimals } from "@/i18n/core/localization-utils";
import { getCountryFromLocale } from "@/i18n/core/translation-utils";
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
        "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.previewText",
      )}
      locale={locale}
    >
      <EmailHeader backgroundColor="#7c3aed" t={t} />
      <EmailContent>
        <Span
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#7c3aed",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
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
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
          )}
        </Span>

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
          <Span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#7c3aed",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.specialOfferTitle",
            )}
          </Span>

          <Span
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
            )}
          </Span>

          <Span
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#dc2626",
              margin: "0",
              textAlign: "center",
            }}
          >
            {formatCurrencyNoDecimals(starterPrice, starterCurrency, locale)}
          </Span>
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
          <Span
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#92400e",
              margin: "0 0 16px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.specialOfferTitle",
            )}
          </Span>
          <Span
            style={{
              fontSize: "18px",
              color: "#374151",
              margin: "0 0 20px 0",
              lineHeight: "1.6",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.discountOffer",
              {
                price: formatCurrencyNoDecimals(
                  starterPrice,
                  starterCurrency,
                  locale,
                ),
              },
            )}
          </Span>

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
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
            )}
          </div>
        </div>

        {/* Success Stories Since You Left */}
        <Span
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827",
            margin: "32px 0 16px 0",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
          )}
        </Span>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            margin: "0 0 16px 0",
          }}
        >
          <Span
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0 0 12px 0",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
            )}
          </Span>
          <Span
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0",
              textAlign: "right",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
            )}
          </Span>
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
          <Span
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0 0 12px 0",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
            )}
          </Span>
          <Span
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0",
              textAlign: "right",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
            )}
          </Span>
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
          <Span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#dc2626",
              margin: "0 0 12px 0",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
            )}
          </Span>
          <Span
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            {t(
              "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
            )}
          </Span>
        </div>

        {/* CTA Button */}
        <CTAButton
          href={trackingUrl}
          text={t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.ctaText",
          )}
          backgroundColor="#7c3aed"
          size="large"
          tracking={tracking}
        />

        {/* Final Message */}
        <Span
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
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
          )}
        </Span>

        {/* Closing */}
        <Span
          style={{
            fontSize: "16px",
            color: "#374151",
            margin: "0 0 24px 0",
            lineHeight: "1.6",
          }}
        >
          {t(
            "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
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
      "app.api.v1.core.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.subject",
    ),
    jsx: emailContent,
  };
};
