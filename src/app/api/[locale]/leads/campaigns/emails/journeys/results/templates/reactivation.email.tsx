/**

 * Results Journey - Reactivation Email Template
 */

import React from "react";

import { getPricingPlansArray } from "@/app/api/[locale]/products/repository-client";
import { SubscriptionPlan } from "@/app/api/[locale]/subscription/enum";
import { formatCurrencyNoDecimals } from "@/i18n/core/localization-utils";
import { getCountryFromLocale } from "@/i18n/core/translation-utils";

import type { EmailRenderContext, EmailTemplateFunction } from "../../../types";
import {
  CTAButton,
  EmailContent,
  EmailFooter,
  EmailHeader,
  EmailLayout,
} from "../../../components.email";

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
      previewText={t(
        "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.previewText",
      )}
      locale={locale}
    >
      <EmailHeader backgroundColor="#7c3aed" t={t} />
      <EmailContent>
        <span
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#7c3aed",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
          )}
        </span>

        <span
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#374151",
            margin: "0 0 24px 0",
            textAlign: "center",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
          )}
        </span>

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
          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#7c3aed",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.specialOfferTitle",
            )}
          </span>

          <span
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
            )}
          </span>

          <span
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#dc2626",
              margin: "0",
              textAlign: "center",
            }}
          >
            {formatCurrencyNoDecimals(starterPrice, starterCurrency, locale)}
          </span>
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
          <span
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#92400e",
              margin: "0 0 16px 0",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.specialOfferTitle",
            )}
          </span>
          <span
            style={{
              fontSize: "18px",
              color: "#374151",
              margin: "0 0 20px 0",
              lineHeight: "1.6",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.discountOffer",
              {
                price: formatCurrencyNoDecimals(
                  starterPrice,
                  starterCurrency,
                  locale,
                ),
              },
            )}
          </span>

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
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
            )}
          </div>
        </div>

        {/* Success Stories Since You Left */}
        <span
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827",
            margin: "32px 0 16px 0",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
          )}
        </span>

        <div
          style={{
            backgroundColor: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            margin: "0 0 16px 0",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0 0 12px 0",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
            )}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0",
              textAlign: "right",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
            )}
          </span>
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
          <span
            style={{
              fontSize: "16px",
              color: "#374151",
              margin: "0 0 12px 0",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
            )}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "0",
              textAlign: "right",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
            )}
          </span>
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
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#dc2626",
              margin: "0 0 12px 0",
            }}
          >
            {t(
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.greeting",
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
              "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
            )}
          </span>
        </div>

        {/* CTA button */}
        <CTAButton
          href={trackingUrl}
          text={t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.ctaText",
          )}
          backgroundColor="#7c3aed"
          size="large"
          tracking={tracking}
        />

        {/* Final Message */}
        <span
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
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
          )}
        </span>

        {/* Closing */}
        <span
          style={{
            fontSize: "16px",
            color: "#374151",
            margin: "0 0 24px 0",
            lineHeight: "1.6",
          }}
        >
          {t(
            "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.intro",
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
      "app.api.leads.campaigns.emails.journeys.results.templates.resultsJourney.reactivation.subject",
    ),
    jsx: emailContent,
  };
};
