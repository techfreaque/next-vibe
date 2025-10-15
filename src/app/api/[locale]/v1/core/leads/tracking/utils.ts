/**
 * Lead Tracking Utilities
 * Provides utility functions for lead tracking URL generation
 */

import type { CountryLanguage } from "@/i18n/core/config";

import { leadTrackingRepository } from "./repository";

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
  return leadTrackingRepository.generateTrackingPixelUrl(
    leadId,
    userId,
    campaignId,
    baseUrl,
    locale,
  );
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
  return leadTrackingRepository.generateTrackingLinkUrl(
    originalUrl,
    leadId,
    userId,
    campaignId,
    baseUrl,
    locale,
    source,
  );
}

/**
 * Generate campaign tracking URL for email campaigns
 */
export function generateCampaignTrackingUrl(
  baseUrl: string,
  leadId: string,
  campaignId: string,
  stage: string,
  destinationUrl?: string,
  locale: CountryLanguage = "en-GLOBAL",
): string {
  return leadTrackingRepository.generateCampaignTrackingUrl(
    baseUrl,
    leadId,
    campaignId,
    stage,
    destinationUrl,
    locale,
  );
}

/**
 * Check if URL is already a tracking URL
 */
export function isTrackingUrl(url: string, locale?: CountryLanguage): boolean {
  return leadTrackingRepository.isTrackingUrl(url, locale);
}

/**
 * Ensure URL has proper base URL
 */
export function ensureFullUrl(url: string, baseUrl: string): string {
  return leadTrackingRepository.ensureFullUrl(url, baseUrl);
}

/**
 * Generate engagement tracking API URL
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
  return leadTrackingRepository.generateEngagementTrackingApiUrl(
    baseUrl,
    locale,
    params,
  );
}
