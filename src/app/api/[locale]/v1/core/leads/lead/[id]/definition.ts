/**
 * Individual Lead API Route Definition
 * Defines endpoints for specific lead operations
 */

import { z } from "zod";

import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { ExtractEndpointTypes } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { Countries, Languages } from "@/i18n/core/config";

import {
  EmailCampaignStage,
  EmailJourneyVariant,
  LeadSource,
  LeadStatus,
} from "../../enum";

// Add missing imports
const undefinedSchema = z.never();
enum EndpointPattern {
  CRUD = "CRUD",
}
enum ResponseDisplayLayout {
  DETAIL = "DETAIL",
}

// Inline schemas to avoid deprecated schema.ts imports
const leadUpdateSchema = z.object({
  id: z.uuid(),
  email: z.email().optional(),
  businessName: z.string().min(1).optional(),
  contactName: z.string().optional().nullable(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  country: z.string().optional(),
  language: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  currentCampaignStage: z.string().optional(),
  convertedUserId: z.uuid().nullable().optional(),
  metadata: z.record(z.any()).optional(),
}).partial();

const leadResponseSchema = z.object({
  id: z.uuid(),
  email: z.email().optional().nullable(),
  businessName: z.string(),
  contactName: z.string().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  country: z.string(),
  language: z.string(),
  status: z.string(),
  source: z.string().nullable(),
  notes: z.string().nullable(),
  convertedUserId: z.string().nullable(),
  convertedAt: z.date().nullable(),
  signedUpAt: z.date().nullable(),
  consultationBookedAt: z.date().nullable(),
  subscriptionConfirmedAt: z.date().nullable(),
  currentCampaignStage: z.string().nullable(),
  emailJourneyVariant: z.string().nullable(),
  emailsSent: z.number(),
  lastEmailSentAt: z.date().nullable(),
  unsubscribedAt: z.date().nullable(),
  emailsOpened: z.number(),
  emailsClicked: z.number(),
  lastEngagementAt: z.date().nullable(),
  metadata: z.record(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Get Lead by ID Endpoint (GET)
 * Retrieves a specific lead by ID
 */
const leadGetEndpoint = createEndpoint({
  path: ["v1", "leads", "lead", ":id"],
  method: Methods.GET,
  requestSchema: undefinedSchema,
  responseSchema: leadResponseSchema,
  requestUrlSchema: z.object({
    id: z.uuid(),
  }),
  allowedRoles: [UserRole.ADMIN],
  config: {
    pattern: EndpointPattern.CRUD,
    query: {
      queryKey: ["v1", "leads", "lead", "GET"],
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: true,
    },
  },
  ui: {
    title: "leads.admin.title",
    description: "leads.admin.description",
    category: "leads",
    version: "1.0",
    tags: ["leads", "get", "retrieve"],
    fields: {
      id: {
        label: "leads.edit.form.fields.id.label",
        description: "leads.edit.form.fields.id.description",
        type: FieldDataType.UUID,
        readonly: true,
        group: "lead-identity",
        order: 0,
      },
    },

    responseDisplay: {
      layout: ResponseDisplayLayout.DETAIL,
    },

    errorTypes: {
      [EndpointErrorTypes.VALIDATION_FAILED]: {
        title: "leadsErrors.leads.get.error.validation.title",
        description: "leadsErrors.leads.get.error.validation.description",
      },
      [EndpointErrorTypes.UNAUTHORIZED]: {
        title: "leadsErrors.leads.get.error.unauthorized.title",
        description: "leadsErrors.leads.get.error.unauthorized.description",
      },
      [EndpointErrorTypes.SERVER_ERROR]: {
        title: "leadsErrors.leads.get.error.server.title",
        description: "leadsErrors.leads.get.error.server.description",
      },
      [EndpointErrorTypes.UNKNOWN_ERROR]: {
        title: "leadsErrors.leads.get.error.unknown.title",
        description: "leadsErrors.leads.get.error.unknown.description",
      },
      [EndpointErrorTypes.NOT_FOUND]: {
        title: "leadsErrors.leads.get.error.not_found.title",
        description: "leadsErrors.leads.get.error.not_found.description",
      },
      [EndpointErrorTypes.FORBIDDEN]: {
        title: "leadsErrors.leads.get.error.forbidden.title",
        description: "leadsErrors.leads.get.error.forbidden.description",
      },
      [EndpointErrorTypes.NETWORK_ERROR]: {
        title: "leadsErrors.leads.get.error.network.title",
        description: "leadsErrors.leads.get.error.network.description",
      },
      [EndpointErrorTypes.UNSAVED_CHANGES]: {
        title: "leadsErrors.leads.get.error.unsaved_changes.title",
        description: "leadsErrors.leads.get.error.unsaved_changes.description",
      },
      [EndpointErrorTypes.CONFLICT]: {
        title: "leadsErrors.leads.get.error.conflict.title",
        description: "leadsErrors.leads.get.error.conflict.description",
      },
    },
    successTypes: {
      title: "leadsErrors.leads.get.success.title",
      description: "leadsErrors.leads.get.success.description",
    },

    examples: {
      payloads: undefined,
      urlPathVariables: {
        default: {
          id: "123e4567-e89b-12d3-a456-426614174000",
        },
      },
      responses: {
        default: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "john@example.com",
          businessName: "Example Corp",
          contactName: "John Doe",
          phone: "+1234567890",
          website: "https://example.com",
          country: Countries.GLOBAL,
          language: Languages.EN,
          status: LeadStatus.NEW,
          source: LeadSource.WEBSITE,
          notes: "Lead from contact form",
          convertedUserId: null,
          convertedAt: null,
          signedUpAt: null,
          consultationBookedAt: null,
          subscriptionConfirmedAt: null,
          currentCampaignStage: null,
          emailJourneyVariant: null,
          emailsSent: 0,
          lastEmailSentAt: null,
          unsubscribedAt: null,
          emailsOpened: 0,
          emailsClicked: 0,
          lastEngagementAt: null,
          metadata: {},
          createdAt: new Date("2023-01-01T12:00:00.000Z"),
          updatedAt: new Date("2023-01-01T12:00:00.000Z"),
        },
      },
    },
  },
});

/**
 * Update Lead Endpoint (PATCH)
 * Updates an existing lead
 */
const leadUpdateEndpoint = createEndpoint({
  path: ["v1", "leads", "lead", ":id"],
  method: Methods.PATCH,
  requestSchema: leadUpdateSchema,
  responseSchema: leadResponseSchema,
  requestUrlSchema: z.object({
    id: z.uuid(),
  }),
  allowedRoles: [UserRole.ADMIN],
  config: {
    pattern: EndpointPattern.CRUD,
    query: {
      queryKey: ["v1", "leads", "lead", "PATCH"],
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
    form: {
      persistForm: true,
      resetOnSuccess: true,
      optimisticUpdates: false,
    },
  },
  ui: {
    title: "leads.admin.title",
    description: "leads.admin.description",
    category: "leads",
    version: "1.0",
    tags: ["leads", "update"],
    fields: {
      id: {
        label: "leads.edit.form.fields.id.label",
        description: "leads.edit.form.fields.id.description",
        type: FieldDataType.UUID,
        readonly: true,
        group: "lead-identity",
        order: 0,
      },
      status: {
        label: "leads.edit.form.fields.status.label",
        description: "leads.edit.form.fields.status.description",
        type: FieldDataType.SELECT,
        required: false,
        group: "lead-status",
        order: 1,
        options: Object.values(LeadStatus).map((status) => ({
          value: status,
          label: `leads.edit.form.fields.status.options.${status}`,
        })),
      },
      currentCampaignStage: {
        label: "leads.edit.form.fields.currentCampaignStage.label",
        description: "leads.edit.form.fields.currentCampaignStage.description",
        type: FieldDataType.SELECT,
        required: false,
        group: "lead-status",
        order: 2,
        options: Object.values(EmailCampaignStage).map((stage) => ({
          value: stage,
          label: `leads.edit.form.fields.currentCampaignStage.options.${stage}`,
        })),
      },
      notes: {
        label: "leads.edit.form.fields.notes.label",
        description: "leads.edit.form.fields.notes.description",
        type: FieldDataType.TEXT,
        required: false,
        group: "lead-notes",
        order: 3,
      },
      metadata: {
        label: "leads.edit.form.fields.metadata.label",
        description: "leads.edit.form.fields.metadata.description",
        type: FieldDataType.JSON,
        required: false,
        group: "lead-metadata",
        order: 4,
      },
    },
    errorTypes: {
      [EndpointErrorTypes.VALIDATION_FAILED]: {
        title: "leadsErrors.leads.patch.error.validation.title",
        description: "leadsErrors.leads.patch.error.validation.description",
      },
      [EndpointErrorTypes.UNAUTHORIZED]: {
        title: "leadsErrors.leads.patch.error.unauthorized.title",
        description: "leadsErrors.leads.patch.error.unauthorized.description",
      },
      [EndpointErrorTypes.SERVER_ERROR]: {
        title: "leadsErrors.leads.patch.error.server.title",
        description: "leadsErrors.leads.patch.error.server.description",
      },
      [EndpointErrorTypes.UNKNOWN_ERROR]: {
        title: "leadsErrors.leads.patch.error.unknown.title",
        description: "leadsErrors.leads.patch.error.unknown.description",
      },
      [EndpointErrorTypes.NOT_FOUND]: {
        title: "leadsErrors.leads.patch.error.not_found.title",
        description: "leadsErrors.leads.patch.error.not_found.description",
      },
      [EndpointErrorTypes.FORBIDDEN]: {
        title: "leadsErrors.leads.patch.error.forbidden.title",
        description: "leadsErrors.leads.patch.error.forbidden.description",
      },
      [EndpointErrorTypes.NETWORK_ERROR]: {
        title: "leadsErrors.leads.patch.error.network.title",
        description: "leadsErrors.leads.patch.error.network.description",
      },
      [EndpointErrorTypes.UNSAVED_CHANGES]: {
        title: "leadsErrors.leads.patch.error.unsaved_changes.title",
        description:
          "leadsErrors.leads.patch.error.unsaved_changes.description",
      },
      [EndpointErrorTypes.CONFLICT]: {
        title: "leadsErrors.leads.patch.error.conflict.title",
        description: "leadsErrors.leads.patch.error.conflict.description",
      },
    },
    successTypes: {
      title: "leadsErrors.leads.patch.success.title",
      description: "leadsErrors.leads.patch.success.description",
    },
    examples: {
      requests: {
        default: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          status: LeadStatus.CAMPAIGN_RUNNING,
          notes: "Lead qualified after initial contact",
          metadata: {
            priority: "high",
            source_detail: "homepage contact form",
          },
        },
      },
      urlPathVariables: {
        default: {
          id: "123e4567-e89b-12d3-a456-426614174000",
        },
      },
      responses: {
        default: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          email: "john@example.com",
          businessName: "Example Corp",
          contactName: "John Doe",
          phone: "+1234567890",
          website: "https://example.com",
          country: Countries.GLOBAL,
          language: Languages.EN,
          status: LeadStatus.CAMPAIGN_RUNNING,
          source: LeadSource.WEBSITE,
          notes: "Lead qualified after initial contact",
          convertedUserId: null,
          convertedAt: null,
          signedUpAt: null,
          consultationBookedAt: null,
          subscriptionConfirmedAt: null,
          currentCampaignStage: null,
          emailJourneyVariant: EmailJourneyVariant.PERSONAL_APPROACH,
          emailsSent: 0,
          lastEmailSentAt: null,
          unsubscribedAt: null,
          emailsOpened: 0,
          emailsClicked: 0,
          lastEngagementAt: null,
          metadata: {
            priority: "high",
            source_detail: "homepage contact form",
          },
          createdAt: new Date("2023-01-01T12:00:00.000Z"),
          updatedAt: new Date("2023-01-01T12:30:00.000Z"),
        },
      },
    },
  },
});

/**
 * Export endpoint definitions
 */
const leadIdEndpoints = {
  GET: leadGetEndpoint.GET,
  PATCH: leadUpdateEndpoint.PATCH,
};

export default leadIdEndpoints;
export type LeadIdEndpointTypes = ExtractEndpointTypes<typeof leadIdEndpoints>;

// Export types for repository and other files to import
export type LeadGetRequestInput = typeof leadGetEndpoint.types.RequestInput;
export type LeadGetRequestOutput = typeof leadGetEndpoint.types.RequestOutput;
export type LeadGetResponseInput = typeof leadGetEndpoint.types.ResponseInput;
export type LeadGetResponseOutput = typeof leadGetEndpoint.types.ResponseOutput;

export type LeadUpdateRequestInput = typeof leadUpdateEndpoint.types.RequestInput;
export type LeadUpdateRequestOutput = typeof leadUpdateEndpoint.types.RequestOutput;
export type LeadUpdateResponseInput = typeof leadUpdateEndpoint.types.ResponseInput;
export type LeadUpdateResponseOutput = typeof leadUpdateEndpoint.types.ResponseOutput;

// Backward compatibility type exports (deprecated - use endpoint types above)
export type LeadUpdateType = z.infer<typeof leadUpdateSchema>;
export type LeadResponseType = z.infer<typeof leadResponseSchema>;
