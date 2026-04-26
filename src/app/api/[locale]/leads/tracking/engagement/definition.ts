/**
 * Lead Engagement Tracking API Definition
 * Defines endpoints for lead engagement tracking operations and click tracking with redirects
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../../../shared/types/common.schema";
import {
  EmailCampaignStage,
  EmailCampaignStageOptions,
  EngagementTypes,
  EngagementTypesDB,
  EngagementTypesOptions,
  LeadSource,
  LeadSourceOptions,
} from "../../enum";
import { scopedTranslation } from "./i18n";
import {
  LeadClickTrackingContainer,
  LeadEngagementTrackingContainer,
} from "./widget";

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
    campaignStage: z.enum(EmailCampaignStage).optional(),
    abTestVariant: z.string().optional(),

    // Form metadata
    formType: z.string().optional(),
    formId: z.string().optional(),
    source: z.string().optional(),

    // Custom tracking data
    customData: z
      .record(z.string(), z.string().or(z.coerce.number()).or(z.boolean()))
      .optional(),
  })
  .optional();

/**
 * Record Lead Engagement Endpoint (POST)
 * Records a new engagement event for a lead
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "tracking", "engagement"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsManagement",
  icon: "activity",
  tags: ["tags.tracking", "tags.engagement"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,
  aliases: ["record-engagement", "track-engagement"] as const,

  cli: {
    firstCliArgKey: "engagementType",
  },

  fields: customWidgetObject({
    render: LeadEngagementTrackingContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),

      // === REQUEST FIELDS ===
      leadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.leadId.label",
        description: "post.leadId.description",
        placeholder: "post.leadId.placeholder",
        helpText: "post.leadId.helpText",
        columns: 12,
        schema: z.uuid().nullable().optional(),
      }),
      engagementType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.engagementType.label",
        description: "post.engagementType.description",
        placeholder: "post.engagementType.placeholder",
        helpText: "post.engagementType.helpText",
        options: EngagementTypesOptions,
        columns: 6,
        schema: z.enum(EngagementTypesDB),
      }),
      campaignId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.campaignId.label",
        description: "post.campaignId.description",
        placeholder: "post.campaignId.placeholder",
        helpText: "post.campaignId.helpText",
        columns: 6,
        schema: z.uuid().optional(),
      }),
      metadata: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "post.metadata.label",
        description: "post.metadata.description",
        placeholder: "post.metadata.placeholder",
        helpText: "post.metadata.helpText",
        columns: 12,
        schema: engagementMetadataSchema,
      }),
      userId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.userId.label",
        description: "post.userId.description",
        placeholder: "post.userId.placeholder",
        helpText: "post.userId.helpText",
        columns: 12,
        schema: z.uuid().optional(),
      }),

      // === RESPONSE FIELDS ===
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id",
        schema: z.uuid(),
      }),
      responseLeadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadId",
        schema: z.uuid(),
      }),
      responseEngagementType: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.engagementType",
        schema: z.enum(EngagementTypesDB),
      }),
      responseCampaignId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.campaignId",
        schema: z.uuid().optional(),
      }),
      responseMetadata: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.metadata",
        schema: z
          .record(z.string(), z.string().or(z.coerce.number()).or(z.boolean()))
          .optional(),
      }),
      timestamp: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.timestamp",
        schema: dateSchema,
      }),
      ipAddress: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.ipAddress",
        schema: z.string().optional(),
      }),
      userAgent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.userAgent",
        schema: z.string().optional(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.createdAt",
        schema: dateSchema,
      }),
      leadCreated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.leadCreated",
        schema: z.boolean().optional(),
      }),
      relationshipEstablished: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.relationshipEstablished",
        schema: z.boolean().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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
  },
});

/**
 * Click Tracking Endpoint (GET)
 * Handles click tracking and redirects for leads
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "tracking", "engagement"],
  title: "get.title",
  description: "get.description",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsManagement",
  icon: "bar-chart",
  tags: ["tags.tracking", "tags.engagement"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,
  aliases: ["track-click", "click-tracking"] as const,

  cli: {
    firstCliArgKey: "id",
  },

  fields: customWidgetObject({
    render: LeadClickTrackingContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),

      // === REQUEST FIELDS (Query Parameters) ===
      leadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.id.label",
        description: "get.id.description",
        placeholder: "get.id.placeholder",
        helpText: "get.id.helpText",
        columns: 12,
        schema: z.uuid().optional(),
      }),
      campaignId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "post.campaignId.label",
        description: "post.campaignId.description",
        placeholder: "post.campaignId.placeholder",
        helpText: "post.campaignId.helpText",
        columns: 6,
        schema: z.uuid().optional(),
      }),
      stage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.stage.label",
        description: "get.stage.description",
        placeholder: "get.stage.placeholder",
        helpText: "get.stage.helpText",
        options: EmailCampaignStageOptions,
        columns: 6,
        schema: z.enum(EmailCampaignStage).optional(),
      }),
      source: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.source.label",
        description: "get.source.description",
        placeholder: "get.source.placeholder",
        helpText: "get.source.helpText",
        options: LeadSourceOptions,
        columns: 6,
        schema: z.enum(LeadSource).default(LeadSource.EMAIL_CAMPAIGN),
      }),
      url: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.url.label",
        description: "get.url.description",
        placeholder: "get.url.placeholder",
        helpText: "get.url.helpText",
        columns: 12,
        schema: z.string(),
      }),
      ref: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.ref.label",
        description: "get.ref.description",
        placeholder: "get.ref.placeholder",
        helpText: "get.ref.helpText",
        columns: 12,
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.success",
        schema: z.boolean(),
      }),
      redirectUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.redirectUrl",
        schema: z.string(),
      }),
      responseLeadId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.leadId",
        schema: z.string().optional(),
      }),
      responseCampaignId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.campaignId",
        schema: z.uuid().optional(),
      }),
      engagementRecorded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.engagementRecorded",
        schema: z.boolean(),
      }),
      leadStatusUpdated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.leadStatusUpdated",
        schema: z.boolean(),
      }),
      isLoggedIn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.isLoggedIn",
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    requests: {
      default: {
        leadId: "123e4567-e89b-12d3-a456-426614174000",
        campaignId: "456e7890-e89b-12d3-a456-426614174001",
        stage: EmailCampaignStage.NOT_STARTED,
        source: LeadSource.EMAIL_CAMPAIGN,
        url: "https://example.com/signup",
      },
    },
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
