/**
 * Leads Definition
 * Defines API types for leads functionality
 * Repository-first architecture: exports TypeOutput types for repositories and routes
 */

import { z } from "zod";

import type { LeadResponseType as ImportedLeadResponseType } from "./lead/[id]/definition";

// Define leadId here so it can be used by both server and client code
export const leadId = z.uuid();

// Re-export commonly used cross-repository types
export type { JwtPayloadType } from "../user/auth/definition";

// Import subdomain endpoint types for consolidation
export type { LeadCreateRequestTypeOutput as LeadCreateType } from "./create/definition";
export type { LeadListGetRequestTypeOutput as LeadQueryType } from "./list/definition";
export type { LeadListGetResponseTypeOutput as LeadListResponseType } from "./list/definition";

// Import response types from specific subdomains
export type LeadResponseType = ImportedLeadResponseType;

// Placeholder interfaces for types that need to be implemented when needed
export interface LeadUpdateType {
  status?: string;
  currentCampaignStage?: string;
  source?: string;
  notes?: string;
  businessName?: string;
  contactName?: string | null;
  phone?: string | null;
  website?: string | null;
  country?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface LeadWithEmailType extends LeadResponseType {
  email: string; // Non-nullable email
}

export interface UnsubscribeType {
  leadId?: string;
  email?: string;
}
