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
  type: (typeof EmailType)[keyof typeof EmailType];
  templateName?: string | null;
  status: (typeof EmailStatus)[keyof typeof EmailStatus];
  sentAt?: Date | null;
  deliveredAt?: Date | null;
  openedAt?: Date | null;
  clickedAt?: Date | null;
  bouncedAt?: Date | null;
  unsubscribedAt?: Date | null;
  error?: string | null;
  retryCount?: string;
  emailProvider: (typeof EmailProvider)[keyof typeof EmailProvider] | null;
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
    status?: (typeof EmailStatus)[keyof typeof EmailStatus];
  };
}

/**
 * Store Email Metadata Request Type
 */
export interface StoreEmailMetadataRequestOutput {
  params: StoreEmailMetadataParams;
}

/**
 * Store Email Metadata Response Type
 */
export interface StoreEmailMetadataResponseOutput {
  success: boolean;
}

/**
 * Update Email Engagement Request Type
 */
export interface UpdateEmailEngagementRequestOutput {
  params: UpdateEmailEngagementParams;
}

/**
 * Update Email Engagement Response Type
 */
export interface UpdateEmailEngagementResponseOutput {
  success: boolean;
}
