/**
 * Email Metadata Repository Definition
 * Types for email metadata storage and tracking operations
 */

import "server-only";

import type {
  EmailProvider,
  EmailStatus,
  EmailType,
} from "../../messages/enum";

/**
 * Store Email Metadata Parameters
 */
export interface StoreEmailMetadataParams {
  subject: string;
  recipientEmail: string;
  recipientName: string | null;
  senderEmail: string;
  senderName: string | null;
  type: EmailType;
  templateName?: string | null;
  status: EmailStatus;
  sentAt?: Date | null;
  deliveredAt?: Date | null;
  openedAt?: Date | null;
  clickedAt?: Date | null;
  bouncedAt?: Date | null;
  unsubscribedAt?: Date | null;
  error?: string | null;
  retryCount?: string;
  emailProvider: EmailProvider | null;
  externalId?: string | null;
  userId?: string | null;
  leadId?: string | null;
  metadata?: Record<string, string | number | boolean | undefined>;
}

/**
 * Update Email Engagement Parameters
 */
export interface UpdateEmailEngagementParams {
  emailId: string;
  engagement: {
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    bouncedAt?: Date;
    unsubscribedAt?: Date;
    status?: EmailStatus;
  };
}

/**
 * Store Email Metadata Request Type
 */
export interface StoreEmailMetadataRequestTypeOutput {
  params: StoreEmailMetadataParams;
}

/**
 * Store Email Metadata Response Type
 */
export interface StoreEmailMetadataResponseTypeOutput {
  success: boolean;
}

/**
 * Update Email Engagement Request Type
 */
export interface UpdateEmailEngagementRequestTypeOutput {
  params: UpdateEmailEngagementParams;
}

/**
 * Update Email Engagement Response Type
 */
export interface UpdateEmailEngagementResponseTypeOutput {
  success: boolean;
}
