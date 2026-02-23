/**
 * Newsletter enums
 * Defines the enums used in the newsletter module
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Newsletter Preferences Enum
 * Defines the possible newsletter preferences
 */
export const {
  enum: NewsletterPreference,
  options: NewsletterPreferenceOptions,
  Value: NewsletterPreferenceValue,
} = createEnumOptions(scopedTranslation, {
  MARKETING: "enum.preferences.marketing",
  PRODUCT_NEWS: "enum.preferences.productNews",
  COMPANY_UPDATES: "enum.preferences.companyUpdates",
  INDUSTRY_INSIGHTS: "enum.preferences.industryInsights",
  EVENTS: "enum.preferences.events",
});

export const NewsletterPreferenceDB = [
  NewsletterPreference.MARKETING,
  NewsletterPreference.PRODUCT_NEWS,
  NewsletterPreference.COMPANY_UPDATES,
  NewsletterPreference.INDUSTRY_INSIGHTS,
  NewsletterPreference.EVENTS,
] as const;

/**
 * Newsletter Subscription Status Enum
 * Defines the possible subscription statuses
 */
export const {
  enum: NewsletterSubscriptionStatus,
  options: NewsletterSubscriptionStatusOptions,
  Value: NewsletterSubscriptionStatusValue,
} = createEnumOptions(scopedTranslation, {
  SUBSCRIBED: "enum.status.subscribed",
  UNSUBSCRIBED: "enum.status.unsubscribed",
  PENDING: "enum.status.pending",
  BOUNCED: "enum.status.bounced",
  COMPLAINED: "enum.status.complained",
});

export const NewsletterSubscriptionStatusDB = [
  NewsletterSubscriptionStatus.SUBSCRIBED,
  NewsletterSubscriptionStatus.UNSUBSCRIBED,
  NewsletterSubscriptionStatus.PENDING,
  NewsletterSubscriptionStatus.BOUNCED,
  NewsletterSubscriptionStatus.COMPLAINED,
] as const;
