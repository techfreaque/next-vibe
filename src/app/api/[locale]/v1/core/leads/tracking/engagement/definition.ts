/**
 * Lead Engagement Tracking API Definition
 * Defines endpoints for lead engagement tracking operations and click tracking with redirects
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { Methods, EndpointErrorTypes } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { EmailCampaignStage, EngagementTypes, LeadSource } from "../../enum";

// Inline schemas to avoid deprecated schema.ts imports
const leadId = z.string().uuid();
const dateSchema = z.string().datetime();
const undefinedSchema = z.never();

/**
 * Metadata schema for engagement tracking
 * Properly typed metadata instead of generic Record
 */
const engagementMetadataSchema = z
  .object({
    // Browser/Client information
    userAgent: z.string().optional(),
    referrer: z.string().optional(),
    url: z.string().optional(),
    timestamp: z.string().optional(),

    // Email-specific metadata
    emailId: z.string().optional(),
    emailSubject: z.string().optional(),
    emailTemplate: z.string().optional(),

    // Campaign metadata
    campaignName: z.string().optional(),
    campaignStage: z.string().optional(),
    abTestVariant: z.string().optional(),

    // Form metadata
    formType: z.string().optional(),
    formId: z.string().optional(),
    source: z.string().optional(),

    // Custom tracking data
    customData: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
  })
  .optional();

/**
 * Record Lead Engagement Endpoint (POST)
 * Records a new engagement event for a lead
 */
const recordEngagementEndpoint = createEndpoint({
  description:
    "Record a new engagement event for a lead or create anonymous lead",
  method: Methods.POST,
  requestSchema: z.object({
    leadId: leadId.nullable().optional(), // Optional - will create anonymous lead if not provided
    engagementType: z.string(),
    campaignId: z.uuid().optional(),
    metadata: engagementMetadataSchema, // Use properly typed metadata schema
    userId: z.uuid().optional(), // For establishing lead-user relationships
  }),
  responseSchema: z.object({
    id: z.uuid(),
    leadId: leadId,
    engagementType: z.string(),
    campaignId: z.uuid().optional(),
    metadata: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
    timestamp: dateSchema,
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    createdAt: dateSchema,
    leadCreated: z.boolean().optional(), // Indicates if a new anonymous lead was created
    relationshipEstablished: z.boolean().optional(), // Indicates if lead-user relationship was established
  }),
  requestUrlSchema: undefinedSchema,
  apiQueryOptions: {
    queryKey: ["leads-engagement-record"],
    staleTime: 0, // Don't cache mutations
  },
  fieldDescriptions: {
    leadId:
      "UUID of the lead who engaged (optional - will create anonymous lead if missing)",
    engagementType:
      "Type of engagement (email_open, email_click, website_visit, form_submit)",
    campaignId: "Optional UUID of the related email campaign",
    metadata: "Additional metadata about the engagement",
    userId: "UUID of the user for establishing lead-user relationships",
  },
  allowedRoles: [UserRole.PUBLIC, UserRole.ADMIN], // Public for tracking pixels
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "leadsErrors.leadsEngagement.post.error.validation.title",
      description:
        "leadsErrors.leadsEngagement.post.error.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "leadsErrors.leadsEngagement.post.error.unauthorized.title",
      description:
        "leadsErrors.leadsEngagement.post.error.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "leadsErrors.leadsEngagement.post.error.server.title",
      description: "leadsErrors.leadsEngagement.post.error.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "leadsErrors.leadsEngagement.post.error.unknown.title",
      description: "leadsErrors.leadsEngagement.post.error.unknown.description",
    },
  },
  successTypes: {
    title: "leadsErrors.leadsEngagement.post.success.title",
    description: "leadsErrors.leadsEngagement.post.success.description",
  },
  path: ["v1", "leads", "tracking", "engagement"],
  examples: {
    responses: {
      default: {
        leadId: "123e4567-e89b-12d3-a456-426614174000",
        engagementType: EngagementTypes.EMAIL_OPEN,
        campaignId: "456e7890-e89b-12d3-a456-426614174001",
        metadata: {
          emailSubject: "Welcome to our service",
          emailTemplate: "welcome_email_v1",
        },
      },
      anonymous: {
        engagementType: EngagementTypes.WEBSITE_VISIT,
        metadata: {
          url: "/landing-page",
          referrer: "https://google.com",
          source: LeadSource.WEBSITE,
        },
      },
    },
    urlPathVariables: undefined,
    responses: {
      default: {
        id: "789e0123-e89b-12d3-a456-426614174002",
        leadId: "123e4567-e89b-12d3-a456-426614174000",
        engagementType: EngagementTypes.EMAIL_OPEN,
        campaignId: "456e7890-e89b-12d3-a456-426614174001",
        metadata: {
          emailSubject: "Welcome to our service",
          emailTemplate: "welcome_email_v1",
        },
        timestamp: new Date("2023-01-01T12:00:00.000Z"),
        ipAddress: "192.168.1.1",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: new Date("2023-01-01T12:00:00.000Z"),
        leadCreated: false,
      },
      anonymous: {
        id: "789e0123-e89b-12d3-a456-426614174003",
        leadId: "456e7890-e89b-12d3-a456-426614174004",
        engagementType: EngagementTypes.WEBSITE_VISIT,
        metadata: {
          page: "/landing-page",
          referrer: "https://google.com",
        },
        timestamp: new Date("2023-01-01T12:00:00.000Z"),
        ipAddress: "192.168.1.1",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: new Date("2023-01-01T12:00:00.000Z"),
        leadCreated: true,
      },
    },
  },
});

/**
 * Click Tracking Endpoint (GET)
 * Handles click tracking and redirects for leads
 */
const clickTrackingEndpoint = createEndpoint({
  description: "Track lead click and redirect to destination URL",
  method: Methods.GET,
  requestSchema: z.object({
    id: z.uuid(), // Use lead.id instead of leadId
    campaignId: z.uuid().optional(),
    stage: z.string().optional(),
    source: z.string().default("email"),
    url: z.string().url(), // Destination URL (required for redirects)
  }),
  responseSchema: z.object({
    success: z.boolean(),
    redirectUrl: z.string().url(),
    leadId: leadId,
    campaignId: z.uuid().optional(),
    engagementRecorded: z.boolean(),
    leadStatusUpdated: z.boolean(),
    isLoggedIn: z.boolean(),
  }),
  requestUrlSchema: undefinedSchema,
  apiQueryOptions: {
    queryKey: ["leads-tracking-click"],
    staleTime: 0, // Don't cache tracking requests
  },
  fieldDescriptions: {
    id: "UUID of the lead who clicked",
    campaignId: "Optional UUID of the related email campaign",
    stage: "Optional campaign stage identifier",
    source: "Source of the click (email, social, website, referral)",
    url: "Destination URL to redirect to after tracking",
  },
  allowedRoles: [UserRole.PUBLIC, UserRole.ADMIN], // Public for tracking links
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "leadsErrors.leadsTracking.get.error.validation.title",
      description: "leadsErrors.leadsTracking.get.error.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "leadsErrors.leadsTracking.get.error.unauthorized.title",
      description:
        "leadsErrors.leadsTracking.get.error.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "leadsErrors.leadsTracking.get.error.server.title",
      description: "leadsErrors.leadsTracking.get.error.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "leadsErrors.leadsTracking.get.error.unknown.title",
      description: "leadsErrors.leadsTracking.get.error.unknown.description",
    },
  },
  successTypes: {
    title: "leadsErrors.leadsTracking.get.success.title",
    description: "leadsErrors.leadsTracking.get.success.description",
  },
  path: ["v1", "leads", "tracking", "engagement"],
  examples: {
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        campaignId: "456e7890-e89b-12d3-a456-426614174001",
        stage: "initial",
        source: "email",
        url: "https://example.com/signup",
      },
    },
    urlPathVariables: undefined,
    responses: {
      default: {
        success: true,
        redirectUrl: "https://example.com/signup",
        leadId: "123e4567-e89b-12d3-a456-426614174000",
        campaignId: "456e7890-e89b-12d3-a456-426614174001",
        engagementRecorded: true,
        leadStatusUpdated: false,
        isLoggedIn: false,
      },
    },
  },
});

export type LeadEngagementRequestType = z.infer<
  typeof recordEngagementEndpoint.POST.requestSchema
>;
export type LeadEngagementResponseType = z.infer<
  typeof recordEngagementEndpoint.POST.responseSchema
>;

export type ClickTrackingRequestType = z.infer<
  typeof clickTrackingEndpoint.GET.requestSchema
>;
export type ClickTrackingResponseType = z.infer<
  typeof clickTrackingEndpoint.GET.responseSchema
>;

// Export metadata type for use in other files
export type EngagementMetadataType = z.infer<typeof engagementMetadataSchema>;

// Export combined endpoints for route handlers and hooks
const engagementEndpoints = {
  POST: recordEngagementEndpoint.POST,
  GET: clickTrackingEndpoint.GET,
};

export default engagementEndpoints;
