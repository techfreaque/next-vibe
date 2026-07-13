/**
 * Tracking Context and Utilities
 * Shared types and utilities for email tracking
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { envClient } from "@/_old/config/env-client";

/**
 * Tracking context for email components
 */
export interface TrackingContext {
  leadId: string | undefined;
  userId: string | undefined;
  campaignId: string | undefined;
  locale: CountryLanguage;
  baseUrl: string;
}

/**
 * Create tracking context from email parameters
 * This allows email components to automatically include tracking
 */
export function createTrackingContext(
  locale: CountryLanguage,
  leadId?: string,
  userId?: string,
  campaignId?: string,
  baseUrl?: string,
): TrackingContext {
  return {
    leadId,
    userId,
    campaignId,
    locale,
    baseUrl: baseUrl || envClient.NEXT_PUBLIC_APP_URL,
  };
}
