/**
 * Email Sending Repository Definition
 * Types for email sending operations using React Email
 */

import "server-only";

import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type {
  EmailCampaignStageValues,
  EmailJourneyVariantValues,
} from "../../../leads/enum";
import type { CampaignType } from "../enum";
import type { SmtpSelectionCriteria, SmtpSendResult } from "../sending/types";

/**
 * Email sending parameters with comprehensive SMTP selection criteria
 */
export interface SendEmailParams {
  // Core email content
  jsx: JSX.Element;
  subject: string;
  toEmail: string;
  toName: string;

  // Localization and context
  locale: CountryLanguage;
  t: TFunction;

  // Sender information
  senderName?: string; // Sender name from template, defaults to app name

  // Campaign context for SMTP selection
  campaignType?: (typeof CampaignType)[keyof typeof CampaignType];
  emailJourneyVariant?: typeof EmailJourneyVariantValues | null;
  emailCampaignStage?: typeof EmailCampaignStageValues | null;

  // Email metadata
  replyToEmail?: string;
  replyToName?: string;
  unsubscribeUrl?: string;
  leadId?: string;
  campaignId?: string;

  // Override automatic selection criteria
  selectionCriteriaOverride?: SmtpSelectionCriteria;

  // Batch processing optimization
  skipRateLimitCheck?: boolean; // Skip individual rate limit check for batch processing
}

/**
 * Send Email Request Type
 */
export interface SendEmailRequestTypeOutput {
  params: SendEmailParams;
}

/**
 * Send Email Response Type
 */
export interface SendEmailResponseTypeOutput {
  result: SmtpSendResult;
}
