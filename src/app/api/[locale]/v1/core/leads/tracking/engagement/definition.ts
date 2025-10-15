/**
 * Lead Engagement Tracking API Definition
 * Defines endpoints for lead engagement tracking operations and click tracking with redirects
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  EngagementTypes,
  EngagementTypesOptions,
  LeadSource,
  LeadSourceOptions,
} from "../../enum";

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
    campaignStage: z.nativeEnum(EmailCampaignStage).optional(),
    abTestVariant: z.string().optional(),

    // Form metadata
    formType: z.string().optional(),
    formId: z.string().optional(),
    source: z.string().optional(),

    // Custom tracking data
    customData: z
      .record(z.string(), z.string().or(z.number()).or(z.boolean()))
      .optional(),
  })
  .optional();

/**
 * Record Lead Engagement Endpoint (POST)
 * Records a new engagement event for a lead
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "leads", "tracking", "engagement"],
  title: "app.api.v1.core.leads.tracking.engagement.post.title" as const,
  description:
    "app.api.v1.core.leads.tracking.engagement.post.description" as const,
  category: "app.api.v1.core.leads.tracking.engagement.category" as const,
  tags: [
    "app.api.v1.core.leads.tracking.engagement.tags.tracking" as const,
    "app.api.v1.core.leads.tracking.engagement.tags.engagement" as const,
  ],
  allowedRoles: [UserRole.PUBLIC, UserRole.ADMIN] as const,
  aliases: ["record-engagement", "track-engagement"] as const,

  cli: {
    firstCliArgKey: "engagementType",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.leads.tracking.engagement.post.form.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      leadId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.leads.tracking.engagement.post.leadId.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.post.leadId.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.post.leadId.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.post.leadId.helpText" as const,
          layout: { columns: 12 },
        },
        z.string().uuid().nullable().optional(),
      ),
      engagementType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.leads.tracking.engagement.post.engagementType.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.post.engagementType.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.post.engagementType.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.post.engagementType.helpText" as const,
          options: EngagementTypesOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(EngagementTypes),
      ),
      campaignId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.leads.tracking.engagement.post.campaignId.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.post.campaignId.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.post.campaignId.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.post.campaignId.helpText" as const,
          layout: { columns: 6 },
        },
        z.string().uuid().optional(),
      ),
      metadata: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label:
            "app.api.v1.core.leads.tracking.engagement.post.metadata.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.post.metadata.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.post.metadata.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.post.metadata.helpText" as const,
          layout: { columns: 12 },
        },
        engagementMetadataSchema,
      ),
      userId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.leads.tracking.engagement.post.userId.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.post.userId.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.post.userId.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.post.userId.helpText" as const,
          layout: { columns: 12 },
        },
        z.string().uuid().optional(),
      ),

      // === RESPONSE FIELDS ===
      id: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.id" as const,
        },
        z.string().uuid(),
      ),
      responseLeadId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.leadId" as const,
        },
        z.string().uuid(),
      ),
      responseEngagementType: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.engagementType" as const,
        },
        z.nativeEnum(EngagementTypes),
      ),
      responseCampaignId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.campaignId" as const,
        },
        z.string().uuid().optional(),
      ),
      responseMetadata: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.metadata" as const,
        },
        z
          .record(z.string(), z.string().or(z.number()).or(z.boolean()))
          .optional(),
      ),
      timestamp: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.timestamp" as const,
        },
        z.string().datetime(),
      ),
      ipAddress: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.ipAddress" as const,
        },
        z.string().optional(),
      ),
      userAgent: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.userAgent" as const,
        },
        z.string().optional(),
      ),
      createdAt: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.createdAt" as const,
        },
        z.string().datetime(),
      ),
      leadCreated: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.leadCreated" as const,
        },
        z.boolean().optional(),
      ),
      relationshipEstablished: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.post.response.relationshipEstablished" as const,
        },
        z.boolean().optional(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.post.errors.validation.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.post.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.post.errors.notFound.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.post.errors.conflict.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.post.errors.server.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.post.errors.unknown.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.post.errors.network.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.leads.tracking.engagement.post.success.title" as const,
    description:
      "app.api.v1.core.leads.tracking.engagement.post.success.description" as const,
  },

  examples: {
    requests: {
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
        leadId: null,
        engagementType: EngagementTypes.WEBSITE_VISIT,
        metadata: {
          url: "/landing-page",
          referrer: "https://google.com",
          source: LeadSource.WEBSITE,
        },
      },
    },
    responses: {
      default: {
        id: "789e0123-e89b-12d3-a456-426614174002",
        responseLeadId: "123e4567-e89b-12d3-a456-426614174000",
        responseEngagementType: EngagementTypes.EMAIL_OPEN,
        responseCampaignId: "456e7890-e89b-12d3-a456-426614174001",
        responseMetadata: {
          emailSubject: "Welcome to our service",
          emailTemplate: "welcome_email_v1",
        },
        timestamp: "2023-01-01T12:00:00.000Z",
        ipAddress: "192.168.1.1",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: "2023-01-01T12:00:00.000Z",
        leadCreated: false,
      },
      anonymous: {
        id: "789e0123-e89b-12d3-a456-426614174003",
        responseLeadId: "456e7890-e89b-12d3-a456-426614174004",
        responseEngagementType: EngagementTypes.WEBSITE_VISIT,
        responseMetadata: {
          page: "/landing-page",
          referrer: "https://google.com",
        },
        timestamp: "2023-01-01T12:00:00.000Z",
        ipAddress: "192.168.1.1",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        createdAt: "2023-01-01T12:00:00.000Z",
        leadCreated: true,
      },
    },
    urlPathVariables: undefined,
  },
});

/**
 * Click Tracking Endpoint (GET)
 * Handles click tracking and redirects for leads
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "leads", "tracking", "engagement"],
  title: "app.api.v1.core.leads.tracking.engagement.get.title" as const,
  description:
    "app.api.v1.core.leads.tracking.engagement.get.description" as const,
  category: "app.api.v1.core.leads.tracking.engagement.category" as const,
  tags: [
    "app.api.v1.core.leads.tracking.engagement.tags.tracking" as const,
    "app.api.v1.core.leads.tracking.engagement.tags.engagement" as const,
  ],
  allowedRoles: [UserRole.PUBLIC, UserRole.ADMIN] as const,
  aliases: ["track-click", "click-tracking"] as const,

  cli: {
    firstCliArgKey: "id",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.leads.tracking.engagement.get.form.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.form.description" as const,
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "urlParams", response: true },
    {
      // === REQUEST FIELDS (Query Parameters) ===
      id: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.leads.tracking.engagement.get.id.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.get.id.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.get.id.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.get.id.helpText" as const,
          layout: { columns: 12 },
        },
        z.string().uuid(),
      ),
      campaignId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.leads.tracking.engagement.post.campaignId.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.post.campaignId.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.post.campaignId.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.post.campaignId.helpText" as const,
          layout: { columns: 6 },
        },
        z.string().uuid().optional(),
      ),
      stage: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.leads.tracking.engagement.get.stage.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.get.stage.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.get.stage.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.get.stage.helpText" as const,
          options: EmailCampaignStageOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(EmailCampaignStage).optional(),
      ),
      source: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.leads.tracking.engagement.get.source.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.get.source.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.get.source.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.get.source.helpText" as const,
          options: LeadSourceOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(LeadSource).default(LeadSource.EMAIL_CAMPAIGN),
      ),
      url: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label:
            "app.api.v1.core.leads.tracking.engagement.get.url.label" as const,
          description:
            "app.api.v1.core.leads.tracking.engagement.get.url.description" as const,
          placeholder:
            "app.api.v1.core.leads.tracking.engagement.get.url.placeholder" as const,
          helpText:
            "app.api.v1.core.leads.tracking.engagement.get.url.helpText" as const,
          layout: { columns: 12 },
        },
        z.string().url(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.get.response.success" as const,
        },
        z.boolean(),
      ),
      redirectUrl: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.get.response.redirectUrl" as const,
        },
        z.string().url(),
      ),
      responseLeadId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.get.response.leadId" as const,
        },
        z.string().uuid(),
      ),
      responseCampaignId: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.get.response.campaignId" as const,
        },
        z.string().uuid().optional(),
      ),
      engagementRecorded: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.get.response.engagementRecorded" as const,
        },
        z.boolean(),
      ),
      leadStatusUpdated: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.get.response.leadStatusUpdated" as const,
        },
        z.boolean(),
      ),
      isLoggedIn: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.leads.tracking.engagement.get.response.isLoggedIn" as const,
        },
        z.boolean(),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.get.errors.validation.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.get.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.get.errors.forbidden.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.get.errors.notFound.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.get.errors.conflict.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.get.errors.server.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.get.errors.unknown.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.get.errors.network.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.leads.tracking.engagement.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.v1.core.leads.tracking.engagement.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title:
      "app.api.v1.core.leads.tracking.engagement.get.success.title" as const,
    description:
      "app.api.v1.core.leads.tracking.engagement.get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      default: {
        success: true,
        redirectUrl: "https://example.com/signup",
        responseLeadId: "123e4567-e89b-12d3-a456-426614174000",
        responseCampaignId: "456e7890-e89b-12d3-a456-426614174001",
        engagementRecorded: true,
        leadStatusUpdated: false,
        isLoggedIn: false,
      },
    },
    urlPathVariables: { default: {} },
  },
});

// Export proper Output types using endpoint.types pattern
export type LeadEngagementRequestInput = typeof POST.types.RequestInput;
export type LeadEngagementRequestOutput = typeof POST.types.RequestOutput;
export type LeadEngagementResponseInput = typeof POST.types.ResponseInput;
export type LeadEngagementResponseOutput = typeof POST.types.ResponseOutput;

export type ClickTrackingRequestInput = typeof GET.types.RequestInput;
export type ClickTrackingRequestOutput = typeof GET.types.RequestOutput;
export type ClickTrackingResponseInput = typeof GET.types.ResponseInput;
export type ClickTrackingResponseOutput = typeof GET.types.ResponseOutput;

// Export metadata type for use in other files
export type EngagementMetadataInput = z.infer<typeof engagementMetadataSchema>;
export type EngagementMetadataOutput = z.output<
  typeof engagementMetadataSchema
>;

// Export combined endpoints for route handlers and hooks
const engagementEndpoints = {
  POST,
  GET,
};

export default engagementEndpoints;
