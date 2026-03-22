/**
 * Email System Types
 * Type definitions for the lead email system
 */

import type { JSX } from "react";

import type { CampaignTypeValue } from "@/app/api/[locale]/messenger/accounts/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { TrackingContext } from "../../../messenger/providers/email/smtp-client/components/tracking_context.email";
import type {
  EmailCampaignStageValue,
  EmailJourneyVariantValue,
} from "../../enum";
import type { LeadWithEmailType } from "../../types";

/**
 * Email Template Data Interface
 * Simplified data structure with just company name and email
 * Uses LeadWithEmailType to guarantee email is present
 */
export interface EmailTemplateData {
  lead: LeadWithEmailType;
  unsubscribeUrl: string;
  trackingUrl: string;
  companyName: string;
  companyEmail: string;
  campaign: {
    id: string;
    stage: typeof EmailCampaignStageValue;
    journeyVariant: typeof EmailJourneyVariantValue;
  };
}

export interface EmailRenderContext {
  data: EmailTemplateData;
  locale: CountryLanguage;
  tracking: TrackingContext;
}

/**
 * Email Template Result
 */
export interface EmailTemplateResult {
  to: string;
  subject: string;
  jsx: JSX.Element;
  text?: string;
}

/**
 * Email Template Function
 */
export type EmailTemplateFunction = (
  context: EmailRenderContext,
) => Promise<EmailTemplateResult> | EmailTemplateResult;

/**
 * Journey Template Map
 * Maps campaign stages to template functions for each journey
 * Uses Record<string, ...> to allow computed property keys from enum values
 */
export type JourneyTemplateMap = Record<string, EmailTemplateFunction>;

/**
 * A/B Test Configuration
 */
export interface ABTestConfig {
  name: string;
  description: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  variants: Partial<
    Record<
      typeof EmailJourneyVariantValue,
      {
        weight: number;
        description: string;
      }
    >
  >;
  targetAudience?: {
    countries?: string[];
  };
}

/**
 * Email Performance Metrics
 */
export interface EmailPerformanceMetrics {
  journeyVariant: typeof EmailJourneyVariantValue;
  stage: typeof EmailCampaignStageValue;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  bounced: number;
  converted: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  unsubscribeRate: number;
  bounceRate: number;
}

/**
 * Campaign Scheduling Options
 */
export interface CampaignSchedulingOptions {
  leadId: string;
  campaignType: typeof CampaignTypeValue;
  journeyVariant: typeof EmailJourneyVariantValue;
  stage: typeof EmailCampaignStageValue;
  scheduledAt: Date;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Email Tracking Data
 */
export interface EmailTrackingData {
  leadId: string;
  campaignId: string;
  eventType:
    | "sent"
    | "delivered"
    | "opened"
    | "clicked"
    | "unsubscribed"
    | "bounced";
  timestamp: Date;
  metadata?: Record<string, string | number | boolean>;
  userAgent?: string;
  ipAddress?: string;
}
