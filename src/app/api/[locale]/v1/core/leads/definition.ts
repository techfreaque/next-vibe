/**
 * Leads Definition
 * Defines API types for leads functionality
 * Repository-first architecture: exports TypeOutput types for repositories and routes
 */

import { z } from "zod";

import type { EmailCampaignStage, LeadSource, LeadStatus } from "./enum";
import type { LeadGetResponseOutput } from "./lead/[id]/definition";
import type { LeadListGetResponseTypeOutput } from "./list/definition";

// Define leadId here so it can be used by both server and client code
export const leadId = z.uuid();

// Re-export commonly used cross-repository types
export type { JwtPayloadType } from "../user/auth/definition";

// Import subdomain endpoint types for consolidation
export type { LeadCreatePostRequestOutput as LeadCreateType } from "./create/definition";
export type { LeadListGetRequestTypeOutput as LeadQueryType } from "./list/definition";

// Export the full list response type
export type LeadListResponseType = LeadListGetResponseTypeOutput;

// Import response types from specific subdomains
// LeadResponseType represents individual lead items (flat structure used in lists)
// Extract the lead array item type from the list response
type LeadArrayType = LeadListGetResponseTypeOutput extends {
  response: { leads: (infer T)[] };
}
  ? T
  : never;
export type LeadResponseType = LeadArrayType;

// LeadDetailResponseType represents the full nested detail response
export type LeadDetailResponse = LeadGetResponseOutput;

// LeadUpdateType for repository (flat structure)
export interface LeadUpdateType {
  email?: string;
  status?: (typeof LeadStatus)[keyof typeof LeadStatus];
  currentCampaignStage?: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
  source?: (typeof LeadSource)[keyof typeof LeadSource];
  notes?: string;
  businessName?: string;
  contactName?: string | null;
  phone?: string | null;
  website?: string | null;
  country?: string;
  language?: string;
  consultationBookedAt?: Date | null;
  subscriptionConfirmedAt?: Date | null;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface LeadWithEmailType extends LeadResponseType {
  email: string; // Non-nullable email
}

export interface UnsubscribeType {
  leadId?: string;
  email?: string;
}
