/**
 * Newsletter enums
 * Defines the enums used in the newsletter module
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Newsletter Preferences Enum
 * Defines the possible newsletter preferences
 */
export const {
  enum: NewsletterPreference,
  options: NewsletterPreferenceOptions,
  Value: NewsletterPreferenceValue,
} = createEnumOptions({
  MARKETING: "app.api.newsletter.enum.preferences.marketing",
  PRODUCT_NEWS: "app.api.newsletter.enum.preferences.productNews",
  COMPANY_UPDATES: "app.api.newsletter.enum.preferences.companyUpdates",
  INDUSTRY_INSIGHTS: "app.api.newsletter.enum.preferences.industryInsights",
  EVENTS: "app.api.newsletter.enum.preferences.events",
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
} = createEnumOptions({
  SUBSCRIBED: "app.api.newsletter.enum.status.subscribed",
  UNSUBSCRIBED: "app.api.newsletter.enum.status.unsubscribed",
  PENDING: "app.api.newsletter.enum.status.pending",
  BOUNCED: "app.api.newsletter.enum.status.bounced",
  COMPLAINED: "app.api.newsletter.enum.status.complained",
});

export const NewsletterSubscriptionStatusDB = [
  NewsletterSubscriptionStatus.SUBSCRIBED,
  NewsletterSubscriptionStatus.UNSUBSCRIBED,
  NewsletterSubscriptionStatus.PENDING,
  NewsletterSubscriptionStatus.BOUNCED,
  NewsletterSubscriptionStatus.COMPLAINED,
] as const;
