/**
 * Leads Definition
 * Defines API types for leads functionality
 * Repository-first architecture: exports TypeOutput types for repositories and routes
 */

import type { LeadGetResponseOutput } from "@/app/api/[locale]/leads/[id]/definition";
import type { LeadListGetResponseTypeOutput } from "@/app/api/[locale]/leads/list/definition";

import type { EmailCampaignStage, LeadSource, LeadStatus } from "./enum";

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
  subscriptionConfirmedAt?: Date | null;
  convertedUserId?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface LeadWithEmailType extends LeadResponseType {
  email: string; // Non-nullable email
}
