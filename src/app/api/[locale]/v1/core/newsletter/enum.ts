/**
 * Newsletter enums
 * Defines the enums used in the newsletter module
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Newsletter Preferences Enum
 * Defines the possible newsletter preferences
 */
export const {
  enum: NewsletterPreference,
  options: NewsletterPreferenceOptions,
  Value: NewsletterPreferenceValue,
} = createEnumOptions({
  MARKETING: "app.api.v1.core.newsletter.enum.preferences.marketing",
  PRODUCT_NEWS: "app.api.v1.core.newsletter.enum.preferences.productNews",
  COMPANY_UPDATES: "app.api.v1.core.newsletter.enum.preferences.companyUpdates",
  INDUSTRY_INSIGHTS:
    "app.api.v1.core.newsletter.enum.preferences.industryInsights",
  EVENTS: "app.api.v1.core.newsletter.enum.preferences.events",
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
  SUBSCRIBED: "app.api.v1.core.newsletter.enum.status.subscribed",
  UNSUBSCRIBED: "app.api.v1.core.newsletter.enum.status.unsubscribed",
  PENDING: "app.api.v1.core.newsletter.enum.status.pending",
  BOUNCED: "app.api.v1.core.newsletter.enum.status.bounced",
  COMPLAINED: "app.api.v1.core.newsletter.enum.status.complained",
});

export const NewsletterSubscriptionStatusDB = [
  NewsletterSubscriptionStatus.SUBSCRIBED,
  NewsletterSubscriptionStatus.UNSUBSCRIBED,
  NewsletterSubscriptionStatus.PENDING,
  NewsletterSubscriptionStatus.BOUNCED,
  NewsletterSubscriptionStatus.COMPLAINED,
] as const;
