/**
 * Batch Operations API Definition
 * Handles batch updates for leads based on filter criteria
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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
  EmailCampaignStageFilter,
  EmailCampaignStageFilterOptions,
  EmailCampaignStageOptions,
  LeadSource,
  LeadSourceFilter,
  LeadSourceFilterOptions,
  LeadSourceOptions,
  LeadStatus,
  LeadStatusFilter,
  LeadStatusFilterOptions,
  LeadStatusOptions,
} from "../enum";

/**
 * Batch Update Endpoint (PATCH)
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["leads", "batch"],
  allowedRoles: [UserRole.ADMIN],
  icon: "users",

  title: "app.api.leads.batch.patch.title" as const,
  description: "app.api.leads.batch.patch.description" as const,
  category: "app.api.leads.category" as const,
  tags: ["app.api.leads.tags.leads" as const, "app.api.leads.tags.batch" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.batch.patch.form.title" as const,
      description: "app.api.leads.batch.patch.form.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // Filter criteria
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.leads.batch.patch.search.label" as const,
          description: "app.api.leads.batch.patch.search.description" as const,
          placeholder: "app.api.leads.batch.patch.search.placeholder" as const,
        },
        z.string().optional(),
      ),
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.leads.batch.patch.status.label" as const,
          description: "app.api.leads.batch.patch.status.description" as const,
          options: LeadStatusFilterOptions,
        },
        z.enum(LeadStatusFilter).optional().default(LeadStatusFilter.ALL),
      ),
      currentCampaignStage: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.leads.batch.patch.currentCampaignStage.label" as const,
          description: "app.api.leads.batch.patch.currentCampaignStage.description" as const,
          options: EmailCampaignStageFilterOptions,
        },
        z.nativeEnum(EmailCampaignStageFilter).optional().default(EmailCampaignStageFilter.ALL),
      ),
      source: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.leads.batch.patch.source.label" as const,
          description: "app.api.leads.batch.patch.source.description" as const,
          options: LeadSourceFilterOptions,
        },
        z.enum(LeadSourceFilter).optional().default(LeadSourceFilter.ALL),
      ),
      scope: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.leads.batch.patch.scope.label" as const,
          description: "app.api.leads.batch.patch.scope.description" as const,
          options: BatchOperationScopeOptions,
        },
        z.nativeEnum(BatchOperationScope).optional().default(BatchOperationScope.ALL_PAGES),
      ),
      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.leads.batch.patch.dryRun.label" as const,
          description: "app.api.leads.batch.patch.dryRun.description" as const,
        },
        z.boolean().optional().default(false),
      ),
      maxRecords: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.leads.batch.patch.maxRecords.label" as const,
          description: "app.api.leads.batch.patch.maxRecords.description" as const,
        },
        z.coerce.number().min(1).max(10000).optional().default(1000),
      ),
      // Update data
      updates: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.batch.patch.updates.title" as const,
          description: "app.api.leads.batch.patch.updates.description" as const,
          layoutType: LayoutType.GRID_2_COLUMNS,
        },
        { request: "data" },
        {
          status: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.leads.batch.patch.updates.status.label" as const,
              description: "app.api.leads.batch.patch.updates.status.description" as const,
              options: LeadStatusOptions,
            },
            z.enum(LeadStatus).optional(),
          ),
          currentCampaignStage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.leads.batch.patch.updates.currentCampaignStage.label" as const,
              description:
                "app.api.leads.batch.patch.updates.currentCampaignStage.description" as const,
              options: EmailCampaignStageOptions,
            },
            z.enum(EmailCampaignStage).optional(),
          ),
          source: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.leads.batch.patch.updates.source.label" as const,
              description: "app.api.leads.batch.patch.updates.source.description" as const,
              options: LeadSourceOptions,
            },
            z.enum(LeadSource).optional(),
          ),
          notes: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.leads.batch.patch.updates.notes.label" as const,
              description: "app.api.leads.batch.patch.updates.notes.description" as const,
            },
            z.string().optional(),
          ),
        },
      ),
      // Response fields
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.batch.patch.response.title" as const,
          description: "app.api.leads.batch.patch.response.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.batch.patch.response.success" as const,
            },
            z.boolean(),
          ),
          totalMatched: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.batch.patch.response.totalMatched" as const,
            },
            z.coerce.number(),
          ),
          totalProcessed: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.batch.patch.response.totalProcessed" as const,
            },
            z.coerce.number(),
          ),
          totalUpdated: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.batch.patch.response.totalUpdated" as const,
            },
            z.coerce.number(),
          ),
          preview: responseArrayOptionalField(
            {
              type: WidgetType.DATA_LIST,
              title: "app.api.leads.batch.patch.response.preview" as const,
              description: "app.api.leads.batch.patch.response.preview" as const,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.leads.batch.patch.response.preview" as const,
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.patch.response.preview" as const,
                  },
                  z.string(),
                ),
                email: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.patch.response.preview" as const,
                  },
                  z.string().nullable(),
                ),
                businessName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.patch.response.preview" as const,
                  },
                  z.string(),
                ),
                currentStatus: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.leads.batch.patch.response.preview" as const,
                  },
                  z.enum(LeadStatus),
                ),
                currentCampaignStage: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.leads.batch.patch.response.preview" as const,
                  },
                  z.enum(EmailCampaignStage).nullable(),
                ),
              },
            ),
          ),
          errors: responseArrayField(
            {
              type: WidgetType.DATA_LIST,
              title: "app.api.leads.batch.patch.response.errors" as const,
              description: "app.api.leads.batch.patch.response.errors" as const,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.leads.batch.patch.response.errors" as const,
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                leadId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.patch.response.errors" as const,
                  },
                  z.string(),
                ),
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.patch.response.errors" as const,
                  },
                  z.string(),
                ),
              },
            ),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.batch.patch.errors.validation.title" as const,
      description: "app.api.leads.batch.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.batch.patch.errors.unauthorized.title" as const,
      description: "app.api.leads.batch.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.batch.patch.errors.forbidden.title" as const,
      description: "app.api.leads.batch.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.batch.patch.errors.notFound.title" as const,
      description: "app.api.leads.batch.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.batch.patch.errors.conflict.title" as const,
      description: "app.api.leads.batch.patch.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.batch.patch.errors.server.title" as const,
      description: "app.api.leads.batch.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.batch.patch.errors.network.title" as const,
      description: "app.api.leads.batch.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.batch.patch.errors.unknown.title" as const,
      description: "app.api.leads.batch.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.batch.patch.errors.unsavedChanges.title" as const,
      description: "app.api.leads.batch.patch.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.leads.batch.patch.success.title" as const,
    description: "app.api.leads.batch.patch.success.description" as const,
  },
  examples: {
    urlPathParams: undefined,
    requests: {
      default: {
        search: "",
        status: LeadStatusFilter.ALL,
        currentCampaignStage: EmailCampaignStageFilter.ALL,
        source: LeadSourceFilter.ALL,
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
  method: Methods.DELETE,
  path: ["leads", "batch"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.leads.batch.delete.title" as const,
  description: "app.api.leads.batch.delete.description" as const,
  icon: "user-x" as const,
  category: "app.api.leads.category" as const,
  tags: ["app.api.leads.tags.leads" as const, "app.api.leads.tags.batch" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.leads.batch.delete.form.title" as const,
      description: "app.api.leads.batch.delete.form.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // Filter criteria (same as PATCH)
      search: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.leads.batch.delete.search.label" as const,
          description: "app.api.leads.batch.delete.search.description" as const,
        },
        z.string().optional(),
      ),
      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.leads.batch.delete.status.label" as const,
          description: "app.api.leads.batch.delete.status.description" as const,
          options: LeadStatusFilterOptions,
        },
        z.enum(LeadStatusFilter).optional().default(LeadStatusFilter.ALL),
      ),
      confirmDelete: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.leads.batch.delete.confirmDelete.label" as const,
          description: "app.api.leads.batch.delete.confirmDelete.description" as const,
        },
        z.boolean().refine((val) => val === true, {
          message: "Delete confirmation required",
        }),
      ),
      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.leads.batch.delete.dryRun.label" as const,
          description: "app.api.leads.batch.delete.dryRun.description" as const,
        },
        z.boolean().optional().default(false),
      ),
      maxRecords: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.leads.batch.delete.maxRecords.label" as const,
          description: "app.api.leads.batch.delete.maxRecords.description" as const,
        },
        z.coerce.number().min(1).max(10000).optional().default(1000),
      ),
      // Response fields
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.leads.batch.delete.response.title" as const,
          description: "app.api.leads.batch.delete.response.description" as const,
          layoutType: LayoutType.STACKED,
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.batch.delete.response.success" as const,
            },
            z.boolean(),
          ),
          totalMatched: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.batch.delete.response.totalMatched" as const,
            },
            z.coerce.number(),
          ),
          totalProcessed: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.batch.delete.response.totalProcessed" as const,
            },
            z.coerce.number(),
          ),
          totalDeleted: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.leads.batch.delete.response.totalDeleted" as const,
            },
            z.coerce.number(),
          ),
          preview: responseArrayOptionalField(
            {
              type: WidgetType.DATA_LIST,
              title: "app.api.leads.batch.delete.response.preview" as const,
              description: "app.api.leads.batch.delete.response.preview" as const,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.leads.batch.delete.response.preview" as const,
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.delete.response.preview" as const,
                  },
                  z.string(),
                ),
                email: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.delete.response.preview" as const,
                  },
                  z.string().nullable(),
                ),
                businessName: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.delete.response.preview" as const,
                  },
                  z.string(),
                ),
                currentStatus: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.leads.batch.delete.response.preview" as const,
                  },
                  z.enum(LeadStatus),
                ),
                currentCampaignStage: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.leads.batch.delete.response.preview" as const,
                  },
                  z.enum(EmailCampaignStage).nullable(),
                ),
              },
            ),
          ),
          errors: responseArrayField(
            {
              type: WidgetType.DATA_LIST,
              title: "app.api.leads.batch.delete.response.errors" as const,
              description: "app.api.leads.batch.delete.response.errors" as const,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.leads.batch.delete.response.errors" as const,
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                leadId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.delete.response.errors" as const,
                  },
                  z.string(),
                ),
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content: "app.api.leads.batch.delete.response.errors" as const,
                  },
                  z.string(),
                ),
              },
            ),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.leads.batch.delete.errors.validation.title" as const,
      description: "app.api.leads.batch.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.leads.batch.delete.errors.unauthorized.title" as const,
      description: "app.api.leads.batch.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.leads.batch.delete.errors.forbidden.title" as const,
      description: "app.api.leads.batch.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.leads.batch.delete.errors.notFound.title" as const,
      description: "app.api.leads.batch.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.leads.batch.delete.errors.conflict.title" as const,
      description: "app.api.leads.batch.delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.leads.batch.delete.errors.server.title" as const,
      description: "app.api.leads.batch.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.leads.batch.delete.errors.network.title" as const,
      description: "app.api.leads.batch.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.leads.batch.delete.errors.unknown.title" as const,
      description: "app.api.leads.batch.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.leads.batch.delete.errors.unsavedChanges.title" as const,
      description: "app.api.leads.batch.delete.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "app.api.leads.batch.delete.success.title" as const,
    description: "app.api.leads.batch.delete.success.description" as const,
  },
  examples: {
    urlPathParams: undefined,
    requests: {
      default: {
        search: "",
        status: LeadStatusFilter.INVALID,
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

// Extract nested response types for repository use (unwrapped from endpoint response structure)
export type BatchUpdateResponseData = BatchUpdateResponseOutput["response"];
export type BatchDeleteResponseData = BatchDeleteResponseOutput["response"];

/**
 * Export definitions
 */
const definitions = {
  PATCH,
  DELETE,
};

export { BatchOperationScope, DELETE, PATCH };
export default definitions;
