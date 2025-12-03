/**
 * Lead Tracking Utilities
 * Provides utility functions for lead tracking URL generation
 * Client-safe utilities that don't require server-only imports
 */

import type { CountryLanguage } from "@/i18n/core/config";

/**
 * Generate tracking pixel URL for email opens
 */
export function generateTrackingPixelUrl(
  leadId: string | undefined,
  userId: string | undefined,
  campaignId: string | undefined,
  baseUrl: string,
  locale: CountryLanguage,
): string {
  const url = new URL(`/api/${locale}/v1/leads/tracking/pixel`, baseUrl);

  if (leadId) {
    url.searchParams.set("leadId", leadId);
  }
  if (userId) {
    url.searchParams.set("userId", userId);
  }
  if (campaignId) {
    url.searchParams.set("campaignId", campaignId);
  }

  // Add timestamp to prevent caching
  url.searchParams.set("t", Date.now().toString());

  return url.toString();
}

/**
 * Generate tracking link URL for click tracking
 */
export function generateTrackingLinkUrl(
  originalUrl: string,
  leadId: string | undefined,
  userId: string | undefined,
  campaignId: string | undefined,
  baseUrl: string,
  locale: CountryLanguage,
  source = "email",
): string {
  // Prevent nested tracking URLs
  if (
    originalUrl.includes("/track?") ||
    originalUrl.includes(`/api/${locale}/v1/leads/tracking/`) ||
    (originalUrl.includes("/api/") && originalUrl.includes("/tracking/"))
  ) {
    return originalUrl;
  }

  const url = new URL(`/${locale}/track`, baseUrl);
  url.searchParams.set("url", originalUrl);

  if (leadId) {
    url.searchParams.set("id", leadId);
  }
  if (campaignId) {
    url.searchParams.set("campaignId", campaignId);
  }

  url.searchParams.set("source", source);

  return url.toString();
}

/**
 * Check if URL is already a tracking URL
 */
export function isTrackingUrl(url: string, locale: CountryLanguage): boolean {
  if (url.includes("/track?")) {
    return true;
  }

  if (locale && url.includes(`/api/${locale}/v1/leads/tracking/`)) {
    return true;
  }

  if (url.includes("/api/") && url.includes("/tracking/")) {
    return true;
  }

  return false;
}

/**
 * Ensure URL has proper base URL
 */
export function ensureFullUrl(url: string, baseUrl: string): string {
  // Skip mailto, tel, and anchor links
  const mailtoPrefix = "mailto:";
  const telPrefix = "tel:";
  const anchorPrefix = "#";

  if (
    url.startsWith(mailtoPrefix) ||
    url.startsWith(telPrefix) ||
    url.startsWith(anchorPrefix)
  ) {
    return url;
  }

  // If already a full URL, return as is
  const httpPrefix = "http://";
  const httpsPrefix = "https://";
  const slashPrefix = "/";

  if (url.startsWith(httpPrefix) || url.startsWith(httpsPrefix)) {
    return url;
  }

  // If relative URL, prepend base URL
  if (url.startsWith(slashPrefix)) {
    return `${baseUrl}${url}`;
  }

  return url;
}

/**
 * Generate engagement tracking API URL
 * Client-safe implementation
 */
export function generateEngagementTrackingApiUrl(
  baseUrl: string,
  locale: CountryLanguage,
  params: {
    id: string;
    campaignId?: string;
    stage?: string;
    source?: string;
    url: string;
  },
): string {
  const apiUrl = new URL(
    `/api/${locale}/v1/leads/tracking/engagement`,
    baseUrl,
  );

  apiUrl.searchParams.set("id", params.id);
  if (params.campaignId) {
    apiUrl.searchParams.set("campaignId", params.campaignId);
  }
  if (params.stage) {
    apiUrl.searchParams.set("stage", params.stage);
  }
  apiUrl.searchParams.set("source", params.source || "email");
  apiUrl.searchParams.set("url", params.url);

  return apiUrl.toString();
}
