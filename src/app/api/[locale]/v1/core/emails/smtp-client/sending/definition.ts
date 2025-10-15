/**
 * SMTP Sending Repository Definition
 * Types for SMTP email sending operations
 */

import "server-only";

import type { Countries, Languages } from "@/i18n/core/config";

import type { CampaignType } from "../enum";

/**
 * SMTP Selection Criteria
 * Uses singular field names to match the selection logic
 */
export interface SmtpSelectionCriteria {
  campaignType: (typeof CampaignType)[keyof typeof CampaignType];
  emailJourneyVariant: string | null;
  emailCampaignStage: string | null;
  country: Countries;
  language: Languages;
}

/**
 * SMTP Send Parameters
 */
export interface SmtpSendParams {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  unsubscribeUrl?: string;
  senderName: string; // Sender name from template
  selectionCriteria: SmtpSelectionCriteria;
  skipRateLimitCheck?: boolean; // Skip individual rate limit check for batch processing
  leadId?: string; // For lead tracking
  campaignId?: string; // For campaign tracking
}

/**
 * SMTP Send Result
 */
export interface SmtpSendResult {
  messageId: string;
  accountId: string;
  accountName: string;
  accepted: string[];
  rejected: string[];
  response: string;
}

/**
 * SMTP Send Request Type (unwrapped for service layer)
 */
export type SmtpSendRequestOutput = SmtpSendParams;

/**
 * SMTP Send Response Type (unwrapped for service layer)
 */
export type SmtpSendResponseOutput = SmtpSendResult;

/**
 * SMTP Capacity Request Type
 * No specific parameters needed
 */
export type SmtpCapacityRequestOutput = Record<string, never>;

/**
 * SMTP Capacity Response Type
 */
export interface SmtpCapacityResponseOutput {
  totalCapacity: number;
  remainingCapacity: number;
}
