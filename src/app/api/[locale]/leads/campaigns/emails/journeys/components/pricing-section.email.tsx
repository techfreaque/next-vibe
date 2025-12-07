/**
 * Email Pricing Section Component for Email Templates
 * Complete redesign based on provided HTML structure with pricing integration
 * 2x2 grid layout with tables for email compatibility
 */

import { Section } from "@react-email/components";
import type * as icons from "next-vibe-ui/ui/icons";
import React, { type JSX } from "react";

import {
  getPricingPlansArray,
  type PricingPlan,
} from "@/app/api/[locale]/products/repository-client";
import { SubscriptionPlan } from "@/app/api/[locale]/subscription/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { getLocaleString } from "@/i18n/core/localization-utils";
import type { TFunction } from "@/i18n/core/static-types";

import { LucideEmailIcon } from "../../components.email";

/**
 * Email-compatible plan icons matching the website pricing section
 */
async function getPlanIcon(
  planId: (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan],
): Promise<JSX.Element> {
  const iconSize = "24";
  const iconColor = "#ffffff";

  switch (planId) {
    case SubscriptionPlan.SUBSCRIPTION: {
      const starIcon = await LucideEmailIcon("Star", {
        width: iconSize,
        height: iconSize,
        color: iconColor,
        // eslint-disable-next-line i18next/no-literal-string
        alt: "⭐",
      });
      return (
        <table style={{ margin: "0 auto", marginBottom: "8px" }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                {starIcon}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
    default:
      return <div />;
  }
}

type IconName = keyof typeof icons;

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
 * Email Pricing Section Component (without Tailwind) - Redesigned to match main pricing section
 */
export async function EmailPricingSection({
  t,
  locale,
}: {
  t: TFunction;
  locale: CountryLanguage;
}): Promise<JSX.Element> {
  /**
   * Helper function to render features with async check icons
   */
  async function renderFeatures(
    features: string[],
    plan: {
      highlighted: boolean;
      id: (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];
    },
  ): Promise<JSX.Element[]> {
    return await Promise.all(
      features.map(async (feature, i) => {
        const checkIcon = await LucideEmailIcon("Check", {
          width: "12",
          height: "12",
          color: plan.highlighted
            ? "#0891b2" // cyan-600
            : "#4b5563", // gray-600
          // eslint-disable-next-line i18next/no-literal-string
          alt: "✓",
        });

        return (
          <table key={`feature_${i}`} style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    width: "20px",
                    verticalAlign: "top",
                    paddingRight: "8px",
                    paddingTop: "0px",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: plan.highlighted
                        ? "#cffafe" // cyan-100
                        : "#f3f4f6", // gray-100
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {checkIcon}
                  </div>
                </td>
                <td style={{ verticalAlign: "top", paddingTop: "0px" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      margin: "0",
                      lineHeight: "20px",
                      verticalAlign: "top",
                      display: "block",
                    }}
                  >
                    {feature}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        );
      }),
    );
  }

  /**
   * Helper function to render premium features with appropriate icons
   */
  async function renderPremiumFeatures(
    premiumFeatures: Array<{
      feature: string;
      className: string | undefined;
    }>,
  ): Promise<JSX.Element[]> {
    return await Promise.all(
      premiumFeatures.map(async (feature, i) => {
        // Determine the correct icon based on feature content and plan
        let iconName: IconName = "Star"; // default
        let iconColor = "#9333ea"; // purple-600 default

        if (
          feature.feature.toLowerCase().includes("reel") ||
          feature.feature.toLowerCase().includes("video")
        ) {
          iconName = "Video";
          iconColor = "#ec4899"; // pink-600
        } else if (feature.feature.toLowerCase().includes("post")) {
          iconName = "Star";
          iconColor = "#9333ea"; // purple-600
        } else if (feature.feature.toLowerCase().includes("production")) {
          iconName = "Building";
          iconColor = "#9333ea"; // purple-600
        } else if (
          feature.feature.toLowerCase().includes("team") ||
          feature.feature.toLowerCase().includes("creative")
        ) {
          iconName = "Users";
          iconColor = "#ec4899"; // pink-600
        }

        // Get Unicode equivalent for the icon
        let iconAlt = "•"; // Default bullet point
        if (iconName === "Video") {
          // eslint-disable-next-line i18next/no-literal-string
          iconAlt = "🎥";
        } else if (iconName === "Star") {
          // eslint-disable-next-line i18next/no-literal-string
          iconAlt = "⭐";
        } else if (iconName === "Building") {
          // eslint-disable-next-line i18next/no-literal-string
          iconAlt = "🏢";
        } else if (iconName === "Users") {
          // eslint-disable-next-line i18next/no-literal-string
          iconAlt = "👥";
        }

        const icon = await LucideEmailIcon(iconName, {
          width: "20",
          height: "20",
          color: iconColor,
          alt: iconAlt,
        });

        return (
          <table key={`premium_feature_${i}`} style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td>
                  <table
                    style={{
                      width: "100%",
                      padding: "6px",
                      borderRadius: "8px",
                      backgroundColor: feature.className?.includes("purple")
                        ? "#f3e8ff"
                        : feature.className?.includes("indigo")
                          ? "#eef2ff"
                          : feature.className?.includes("pink")
                            ? "#fdf2f8"
                            : "#f0f9ff",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: "28px",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          {icon}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#374151",
                              margin: "0",
                            }}
                          >
                            {feature.feature}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              {/* Add "or" separator between features - exclude Enterprise plans */}
              {i === 0 && premiumFeatures.length > 1 && (
                <tr>
                  <td style={{ padding: "4px 0" }}>
                    <table style={{ width: "100%" }}>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              width: "40%",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                borderBottom: "1px solid #e5e7eb",
                                position: "absolute",
                                top: "50%",
                                left: "0",
                                right: "0",
                              }}
                            />
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              width: "20%",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                margin: "0",
                                padding: "0 8px",
                                lineHeight: "1",
                                backgroundColor: "#ffffff",
                                position: "relative",
                                zIndex: "1",
                              }}
                            >
                              {t(
                                "app.api.leads.campaigns.emails.journeys.components.pricing.plans.orSeparator",
                              )}
                            </span>
                          </td>
                          <td
                            style={{
                              width: "40%",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                borderBottom: "1px solid #e5e7eb",
                                position: "absolute",
                                top: "50%",
                                left: "0",
                                right: "0",
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        );
      }),
    );
  }

  // Get country from locale using proper utility
  const country = getCountryFromLocale(locale);

  // Get all pricing plans using the same structure as main pricing section
  const allPlans: PricingPlan[] = getPricingPlansArray(locale);

  // Build plans array matching the main pricing section structure
  const plans = allPlans.map((plan) => ({
    id: plan.id,
    name: t(plan.name),
    description: t(plan.description),
    price: plan.priceByCountry[country].monthly,
    currency: plan.priceByCountry[country].currency,
    features: plan.features.map((feature) => t(feature)),
    premiumFeatures: plan.premiumFeatures?.map((pf) => ({
      feature: t(pf.feature),
      className: pf.className,
    })),
    highlighted: plan.highlighted,
    badge: plan.badge ? t(plan.badge) : undefined,
  }));

  // Pre-render all features, premium features, and icons for all plans
  const allPlansWithRenderedFeatures = await Promise.all(
    plans.map(async (plan) => ({
      ...plan,
      renderedFeatures: await renderFeatures(plan.features, {
        highlighted: plan.highlighted,
        id: plan.id,
      }),
      renderedPremiumFeatures: plan.premiumFeatures
        ? await renderPremiumFeatures(plan.premiumFeatures)
        : undefined,
      renderedIcon: await getPlanIcon(plan.id),
    })),
  );

  // Split plans into 2x2 grid structure
  const topRowPlans = allPlansWithRenderedFeatures.slice(0, 2);
  const bottomRowPlans = allPlansWithRenderedFeatures.slice(2, 4);

  // Helper function to render a single plan card as table
  const renderPlanCard = (
    plan: (typeof allPlansWithRenderedFeatures)[0],
  ): JSX.Element => (
    <table
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        border: plan.highlighted
          ? "2px solid #06b6d4" // cyan-500
          : "1px solid #e5e7eb", // gray-200
        borderRadius: "12px",
        borderCollapse: "separate",
        borderSpacing: "0",
      }}
    >
      <tbody>
        {/* Badge Row */}
        {plan.highlighted && plan.badge ? (
          <tr>
            <td
              style={{
                textAlign: "center",
                padding: "8px 16px 0 16px",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(to right, #06b6d4, #2563eb)",
                  color: "#ffffff",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  display: "inline-block",
                  marginBottom: "4px",
                }}
              >
                {plan.badge}
              </div>
            </td>
          </tr>
        ) : null}

        {/* Header Section */}
        <tr>
          <td
            style={{
              padding: plan.highlighted
                ? "16px 16px 12px 16px"
                : "12px 16px 12px 16px",
              textAlign: "center",
            }}
          >
            {/* Plan Name */}
            <span
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
                margin: "0 0 16px 0",
              }}
            >
              {plan.name}
            </span>

            {/* Price */}
            <table style={{ width: "100%", marginBottom: "12px" }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "48px",
                        fontWeight: "800",
                        color: "#111827",
                        margin: "0",
                        lineHeight: "1",
                        display: "inline",
                      }}
                    >
                      {formatCurrencyNoDecimals(
                        plan.price,
                        plan.currency,
                        locale,
                      )}
                      {
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#6b7280",
                            fontWeight: "400",
                            marginLeft: "8px",
                          }}
                        >
                          {t(
                            "app.api.leads.campaigns.emails.journeys.components.pricing.plans.perMonth",
                          )}
                        </span>
                      }
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Description */}
            <span
              style={{
                fontSize: "16px",
                color: "#6b7280",
                margin: "0 0 12px 0",
                textAlign: "center",
              }}
            >
              {plan.description}
            </span>

            {/* Premium Features */}
            {plan.renderedPremiumFeatures && (
              <table style={{ width: "100%", margin: "12px 0" }}>
                <tbody>
                  <tr>
                    <td>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          {plan.renderedPremiumFeatures.map((feature, idx) => (
                            <tr key={`premium-${idx}`}>
                              <td style={{ padding: "2px 0" }}>{feature}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </td>
        </tr>

        {/* Features List */}
        <tr>
          <td
            style={{
              padding: "0 16px 16px 16px",
              textAlign: "left",
              verticalAlign: "top",
            }}
          >
            <table style={{ width: "100%" }}>
              <tbody>
                {plan.renderedFeatures.map((feature, idx) => (
                  <tr key={`feature-${idx}`}>
                    <td style={{ padding: "4px 0", verticalAlign: "top" }}>
                      {feature}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>

        {/* Spacer row to push content to top */}
        <tr style={{ height: "100%" }}>
          <td style={{ height: "100%" }} />
        </tr>
      </tbody>
    </table>
  );

  return (
    <Section style={{ margin: "32px 0", padding: "0" }}>
      {/* 2x2 Table Layout for Email Compatibility */}
      <table
        style={{
          width: "100%",
          margin: "0",
          borderCollapse: "collapse",
          minHeight: "600px",
        }}
      >
        <tbody>
          {/* Top Row */}
          <tr style={{ height: "50%" }}>
            {topRowPlans.map((plan, index) => (
              <td
                key={`plan_top_${index}_${plan.id}`}
                style={{
                  width: "50%",
                  verticalAlign: "top",
                  padding: index === 0 ? "0 5px 10px 0" : "0 0 10px 5px",
                  height: "100%",
                }}
              >
                {renderPlanCard(plan)}
              </td>
            ))}
          </tr>
          {/* Bottom Row */}
          <tr style={{ height: "50%" }}>
            {bottomRowPlans.map((plan, index) => (
              <td
                key={`plan_bottom_${index}_${plan.id}`}
                style={{
                  width: "50%",
                  verticalAlign: "top",
                  padding: index === 0 ? "0 5px 0 0" : "0 0 0 5px",
                  height: "100%",
                }}
              >
                {renderPlanCard(plan)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Section>
  );
}
