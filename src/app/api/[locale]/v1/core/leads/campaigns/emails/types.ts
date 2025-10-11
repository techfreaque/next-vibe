/**
 * Email System Types
 * Type definitions for the lead email system
 */

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { TrackingContext } from "../../../emails/smtp-client/components/tracking_context";
import type { EmailCampaignStage, EmailJourneyVariant, LeadStatus, LeadSource } from "../../enum";

// Local type definition to avoid deprecated schema.ts imports
interface LeadWithEmailType {
  id: string;
  email: string; // Guaranteed to be present
  businessName: string;
  contactName?: string | null;
  phone?: string | null;
  website?: string | null;
  country: string;
  language: string;
  status: LeadStatus;
  source: LeadSource | null;
  notes?: string | null;
  convertedUserId?: string | null;
  convertedAt?: Date | null;
  signedUpAt?: Date | null;
  consultationBookedAt?: Date | null;
  subscriptionConfirmedAt?: Date | null;
  currentCampaignStage?: string | null;
  emailJourneyVariant?: EmailJourneyVariant | null;
  emailsSent: number;
  lastEmailSentAt?: Date | null;
  unsubscribedAt?: Date | null;
  emailsOpened: number;
  emailsClicked: number;
  lastEngagementAt?: Date | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

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
    stage: EmailCampaignStage;
    journeyVariant: EmailJourneyVariant;
  };
}

/**
 * Email Render Context
 */
export interface EmailRenderContext {
  data: EmailTemplateData;
  t: TFunction;
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
 */
export interface JourneyTemplateMap {
  [EmailCampaignStage.INITIAL]: EmailTemplateFunction;
  [EmailCampaignStage.FOLLOWUP_1]?: EmailTemplateFunction;
  [EmailCampaignStage.FOLLOWUP_2]?: EmailTemplateFunction;
  [EmailCampaignStage.FOLLOWUP_3]?: EmailTemplateFunction;
  [EmailCampaignStage.NURTURE]?: EmailTemplateFunction;
  [EmailCampaignStage.REACTIVATION]?: EmailTemplateFunction;
}

/**
 * A/B Test Configuration
 */
export interface ABTestConfig {
  name: string;
  description: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  variants: {
    // [EmailJourneyVariant.PERSONAL_APPROACH]: {
    //   weight: number;
    //   description: string;
    // };
    [EmailJourneyVariant.RESULTS_FOCUSED]: {
      weight: number;
      description: string;
    };
    [EmailJourneyVariant.PERSONAL_RESULTS]: {
      weight: number;
      description: string;
    };
  };
  targetAudience?: {
    countries?: string[];
  };
}

/**
 * Email Performance Metrics
 */
export interface EmailPerformanceMetrics {
  journeyVariant: EmailJourneyVariant;
  stage: EmailCampaignStage;
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
  journeyVariant: EmailJourneyVariant;
  stage: EmailCampaignStage;
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
