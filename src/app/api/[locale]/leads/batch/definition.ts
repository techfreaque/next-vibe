/**
 * Batch Operations API Definition
 * Handles batch updates for leads based on filter criteria
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user/user-roles/enum";
import {
  BatchOperationScope,
  BatchOperationScopeOptions,
  EmailCampaignStage,
  EmailCampaignStageOptions,
  LeadSource,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusFilter,
  LeadStatusOptions,
} from "../enum";
import { leadsBatchFilterFields } from "../shared-filter-fields";
import { scopedTranslation } from "./i18n";
import { LeadsBatchDeleteContainer, LeadsBatchUpdateContainer } from "./widget";

/**
 * Batch Update Endpoint (PATCH)
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["leads", "batch"],
  allowedRoles: [UserRole.ADMIN],
  icon: "users",

  title: "patch.title",
  description: "patch.description",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsManagement",
  tags: ["tags.leads", "tags.batch"],

  fields: customWidgetObject({
    render: LeadsBatchUpdateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      // Filter criteria - hidden fields prefilled from list widget
      ...leadsBatchFilterFields,
      scope: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.scope.label",
        description: "patch.scope.description",
        options: BatchOperationScopeOptions,
        schema: z
          .enum(BatchOperationScope)
          .default(BatchOperationScope.ALL_PAGES),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.dryRun.label",
        description: "patch.dryRun.description",
        schema: z.boolean().optional().default(false),
      }),
      maxRecords: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.maxRecords.label",
        description: "patch.maxRecords.description",
        schema: z.coerce.number().min(1).max(10000).optional().default(1000),
      }),
      // Update data
      updates: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "patch.updates.title",
        description: "patch.updates.description",
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          status: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "patch.updates.status.label",
            description: "patch.updates.status.description",
            options: LeadStatusOptions,
            schema: z.enum(LeadStatus).optional(),
          }),
          currentCampaignStage: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "patch.updates.currentCampaignStage.label",
            description: "patch.updates.currentCampaignStage.description",
            options: EmailCampaignStageOptions,
            schema: z.enum(EmailCampaignStage).optional(),
          }),
          source: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "patch.updates.source.label",
            description: "patch.updates.source.description",
            options: LeadSourceOptions,
            schema: z.enum(LeadSource).optional(),
          }),
          notes: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.updates.notes.label",
            description: "patch.updates.notes.description",
            schema: z.string().optional(),
          }),
        },
      }),
      // Response fields
      response: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "patch.response.title",
        description: "patch.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          success: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "patch.response.success",
            schema: z.boolean(),
          }),
          totalMatched: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "patch.response.totalMatched",
            schema: z.coerce.number(),
          }),
          totalProcessed: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "patch.response.totalProcessed",
            schema: z.coerce.number(),
          }),
          totalUpdated: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "patch.response.totalUpdated",
            schema: z.coerce.number(),
          }),
          preview: responseArrayOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.preview",
            description: "patch.response.preview",
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "patch.response.preview",
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                id: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "patch.response.preview",
                  schema: z.string(),
                }),
                email: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "patch.response.preview",
                  schema: z.string().nullable(),
                }),
                businessName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "patch.response.preview",
                  schema: z.string(),
                }),
                currentStatus: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "patch.response.preview",
                  schema: z.enum(LeadStatus),
                }),
                currentCampaignStage: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "patch.response.preview",
                  schema: z.enum(EmailCampaignStage).nullable(),
                }),
              },
            }),
          }),
          errors: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "patch.response.errors",
            description: "patch.response.errors",
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "patch.response.errors",
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                leadId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "patch.response.errors",
                  schema: z.string(),
                }),
                error: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "patch.response.errors",
                  schema: z.string(),
                }),
              },
            }),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },
  examples: {
    requests: {
      default: {
        search: "",
        status: [],
        currentCampaignStage: [],
        source: [],
        scope: BatchOperationScope.ALL_PAGES,
        dryRun: true,
        maxRecords: 100,
        updates: {
          status: LeadStatus.PENDING,
          currentCampaignStage: EmailCampaignStage.INITIAL,
          source: LeadSource.WEBSITE,
          notes: "Batch update via admin panel",
        },
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          totalMatched: 50,
          totalProcessed: 45,
          totalUpdated: 45,
          preview: [],
          errors: [],
        },
      },
    },
  },
});

/**
 * Batch Delete Endpoint (DELETE)
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["leads", "batch"],
  allowedRoles: [UserRole.ADMIN],

  title: "delete.title",
  description: "delete.description",
  icon: "user-x",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsManagement",
  tags: ["tags.leads", "tags.batch"],

  fields: customWidgetObject({
    render: LeadsBatchDeleteContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      // Filter criteria - hidden fields prefilled from list widget
      ...leadsBatchFilterFields,
      confirmDelete: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "delete.confirmDelete.label",
        description: "delete.confirmDelete.description",
        schema: z.boolean().refine((val) => val === true, {
          message: "Delete confirmation required",
        }),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "delete.dryRun.label",
        description: "delete.dryRun.description",
        schema: z.boolean().optional().default(false),
      }),
      maxRecords: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "delete.maxRecords.label",
        description: "delete.maxRecords.description",
        schema: z.coerce.number().min(1).max(10000).optional().default(1000),
      }),
      // Response fields
      response: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "delete.response.title",
        description: "delete.response.description",
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          success: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "delete.response.success",
            schema: z.boolean(),
          }),
          totalMatched: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "delete.response.totalMatched",
            schema: z.coerce.number(),
          }),
          totalProcessed: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "delete.response.totalProcessed",
            schema: z.coerce.number(),
          }),
          totalDeleted: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "delete.response.totalDeleted",
            schema: z.coerce.number(),
          }),
          preview: responseArrayOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "delete.response.preview",
            description: "delete.response.preview",
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "delete.response.preview",
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                id: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "delete.response.preview",
                  schema: z.string(),
                }),
                email: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "delete.response.preview",
                  schema: z.string().nullable(),
                }),
                businessName: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "delete.response.preview",
                  schema: z.string(),
                }),
                currentStatus: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "delete.response.preview",
                  schema: z.enum(LeadStatus),
                }),
                currentCampaignStage: responseField(scopedTranslation, {
                  type: WidgetType.BADGE,
                  text: "delete.response.preview",
                  schema: z.enum(EmailCampaignStage).nullable(),
                }),
              },
            }),
          }),
          errors: responseArrayField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "delete.response.errors",
            description: "delete.response.errors",
            child: objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "delete.response.errors",
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { response: true },
              children: {
                leadId: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "delete.response.errors",
                  schema: z.string(),
                }),
                error: responseField(scopedTranslation, {
                  type: WidgetType.TEXT,
                  content: "delete.response.errors",
                  schema: z.string(),
                }),
              },
            }),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title",
      description: "delete.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title",
      description: "delete.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },
  examples: {
    requests: {
      default: {
        search: "",
        status: [LeadStatusFilter.INVALID],
        currentCampaignStage: [],
        source: [],
        confirmDelete: true,
        dryRun: true,
        maxRecords: 50,
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          totalMatched: 10,
          totalProcessed: 10,
          totalDeleted: 10,
          preview: [],
          errors: [],
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type BatchUpdateRequestInput = typeof PATCH.types.RequestInput;
export type BatchUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type BatchUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type BatchUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

export type BatchDeleteRequestInput = typeof DELETE.types.RequestInput;
export type BatchDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type BatchDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type BatchDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  PATCH,
  DELETE,
};

export { BatchOperationScope, DELETE, PATCH };
export default definitions;
