/**
 * Email Agent Status API Route Definition
 * Defines endpoint for retrieving email agent processing status
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
  requestUrlParamsField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import {
  EmailAgentSortField,
  EmailAgentSortFieldOptions,
  EmailAgentStatusFilter,
  EmailAgentStatusFilterOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";

// Keep schemas simple for complex nested objects
const hardRulesResultSchema = z.record(z.unknown()).optional();
const aiProcessingResultSchema = z.record(z.unknown()).optional();

/**
 * Email Agent Status Endpoint (GET)
 * Retrieves processing status for emails
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "agent", "status"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.agent.status.get.title",
  description: "app.api.v1.core.agent.status.get.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.status",
    "app.api.v1.core.agent.tags.processing",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.status.get.form.title",
      description: "app.api.v1.core.agent.status.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "urlParams", response: true },
    {
      // === QUERY PARAMETERS ===
      page: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.status.get.page.label",
          description: "app.api.v1.core.agent.status.get.page.description",
          layout: { columns: 2 },
        },
        z.coerce.number().min(1).default(1),
      ),
      limit: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.status.get.limit.label",
          description: "app.api.v1.core.agent.status.get.limit.description",
          layout: { columns: 2 },
        },
        z.coerce.number().min(1).max(100).default(20),
      ),
      emailId: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.v1.core.agent.status.get.emailId.label",
          description: "app.api.v1.core.agent.status.get.emailId.description",
          layout: { columns: 6 },
        },
        z.uuid().optional(),
      ),
      accountId: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.v1.core.agent.status.get.accountId.label",
          description: "app.api.v1.core.agent.status.get.accountId.description",
          layout: { columns: 6 },
        },
        z.uuid().optional(),
      ),
      status: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.agent.status.get.status.label",
          description: "app.api.v1.core.agent.status.get.status.description",
          layout: { columns: 3 },
          options: EmailAgentStatusFilterOptions,
        },
        z
          .array(z.nativeEnum(EmailAgentStatusFilter))
          .default([EmailAgentStatusFilter.ALL]),
      ),
      actionType: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.status.get.actionType.label",
          description:
            "app.api.v1.core.agent.status.get.actionType.description",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),
      priority: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.agent.status.get.priority.label",
          description: "app.api.v1.core.agent.status.get.priority.description",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),
      sortBy: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.agent.status.get.sortBy.label",
          description: "app.api.v1.core.agent.status.get.sortBy.description",
          layout: { columns: 3 },
          options: EmailAgentSortFieldOptions,
        },
        z
          .array(z.nativeEnum(EmailAgentSortField))
          .default([EmailAgentSortField.CREATED_AT]),
      ),
      sortOrder: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.status.get.sortOrder.label",
          description: "app.api.v1.core.agent.status.get.sortOrder.description",
          layout: { columns: 3 },
          options: SortOrderOptions,
        },
        z.nativeEnum(SortOrder).default(SortOrder.DESC),
      ),
      dateFrom: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.agent.status.get.dateFrom.label",
          description: "app.api.v1.core.agent.status.get.dateFrom.description",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),
      dateTo: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label: "app.api.v1.core.agent.status.get.dateTo.label",
          description: "app.api.v1.core.agent.status.get.dateTo.description",
          layout: { columns: 3 },
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.status.get.response.title",
          description: "app.api.v1.core.agent.status.get.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          items: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              cardConfig: {
                title: "emailId",
                subtitle: "status",
                content: ["priority"],
                metadata: ["lastProcessedAt", "createdAt"],
              },
              layout: "list",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.v1.core.agent.status.response.items.item",
                description: "app.api.v1.core.agent.status.response.items.item",
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                emailId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.get.response.items.emailId",
                  },
                  z.uuid(),
                ),
                status: responseField(
                  {
                    type: WidgetType.BADGE,
                    content:
                      "app.api.v1.core.agent.status.get.response.items.status",
                  },
                  z.string(),
                ),
                lastProcessedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.get.response.items.lastProcessedAt",
                  },
                  z.string().nullable(),
                ),
                hardRulesResult: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.get.response.items.hardRulesResult",
                  },
                  hardRulesResultSchema.optional(),
                ),
                aiProcessingResult: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.get.response.items.aiProcessingResult",
                  },
                  aiProcessingResultSchema.optional(),
                ),
                confirmationRequests: responseArrayField(
                  {
                    type: WidgetType.DATA_CARDS,
                    cardConfig: {
                      title: "id",
                      subtitle: "actionType",
                      content: ["status", "reasoning"],
                      metadata: ["requestedAt", "expiresAt"],
                    },
                    layout: "list",
                  },
                  objectField(
                    {},
                    { response: true },
                    {
                      id: responseField({}, z.uuid()),
                      emailId: responseField({}, z.uuid()),
                      actionType: responseField({}, z.string()),
                      toolCall: responseField({}, z.record(z.unknown()).optional()),
                      reasoning: responseField({}, z.string()),
                      requestedAt: responseField({}, z.string()),
                      expiresAt: responseField({}, z.string()),
                      status: responseField({}, z.string()),
                      metadata: responseField({}, z.record(z.unknown()).optional()),
                    },
                  ),
                ),
                errors: responseArrayField(
                  {
                    type: WidgetType.DATA_CARDS,
                    cardConfig: {
                      title: "error",
                      content: [],
                    },
                    layout: "list",
                  },
                  objectField(
                    {},
                    { response: true },
                    {
                      error: responseField({}, z.string()),
                    },
                  ),
                ),
                priority: responseField(
                  {
                    type: WidgetType.BADGE,
                    content:
                      "app.api.v1.core.agent.status.get.response.items.priority",
                  },
                  z.string(),
                ),
                createdAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.get.response.items.createdAt",
                  },
                  z.string(),
                ),
                updatedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.get.response.items.updatedAt",
                  },
                  z.string(),
                ),
              },
            ),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.agent.status.get.response.total",
            },
            z.number(),
          ),
          page: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.agent.status.get.response.page",
            },
            z.number(),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.agent.status.get.response.limit",
            },
            z.number(),
          ),
          totalPages: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.agent.status.get.response.totalPages",
            },
            z.number(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.agent.status.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.status.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.status.get.errors.validation.title",
      description:
        "app.api.v1.core.agent.status.get.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.status.get.errors.server.title",
      description: "app.api.v1.core.agent.status.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.status.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.status.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.status.get.errors.network.title",
      description:
        "app.api.v1.core.agent.status.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.status.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.status.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.status.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.status.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.agent.status.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.status.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.status.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.status.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.status.get.success.title",
    description: "app.api.v1.core.agent.status.get.success.description",
  },

  examples: {
    requests: {
      default: {},
      filtered: {
        status: [EmailAgentStatusFilter.AWAITING_CONFIRMATION],
        page: 1,
        limit: 10,
        sortBy: [EmailAgentSortField.LAST_PROCESSED_AT],
        sortOrder: SortOrder.DESC,
      },
    },
    responses: {
      default: {
        response: {
          items: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      },
      filtered: {
        response: {
          items: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      },
    },
    urlPathVariables: undefined,
  },
});

/**
 * Email Agent Status Endpoint (POST)
 * CLI version of GET endpoint for retrieving processing status
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "status"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.agent.status.post.title",
  description: "app.api.v1.core.agent.status.post.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.status",
    "app.api.v1.core.agent.tags.processing",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.status.post.form.title",
      description: "app.api.v1.core.agent.status.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST BODY ===
      page: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.status.post.page.label",
          description: "app.api.v1.core.agent.status.post.page.description",
          layout: { columns: 2 },
        },
        z.coerce.number().min(1).default(1),
      ),
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.status.post.limit.label",
          description: "app.api.v1.core.agent.status.post.limit.description",
          layout: { columns: 2 },
        },
        z.coerce.number().min(1).max(100).default(20),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.status.post.response.title",
          description: "app.api.v1.core.agent.status.post.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          items: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              cardConfig: {
                title: "emailId",
                subtitle: "status",
                content: ["priority"],
                metadata: ["lastProcessedAt", "createdAt"],
              },
              layout: "list",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.v1.core.agent.status.response.items.item",
                description: "app.api.v1.core.agent.status.response.items.item",
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                emailId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.post.response.items.emailId",
                  },
                  z.uuid(),
                ),
                status: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.post.response.items.status",
                  },
                  z.string(),
                ),
                lastProcessedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.post.response.items.lastProcessedAt",
                  },
                  z.string().nullable(),
                ),
                hardRulesResult: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.post.response.items.hardRulesResult",
                  },
                  hardRulesResultSchema.optional(),
                ),
                aiProcessingResult: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.post.response.items.aiProcessingResult",
                  },
                  aiProcessingResultSchema.optional(),
                ),
                confirmationRequests: responseArrayField(
                  {
                    type: WidgetType.DATA_CARDS,
                    cardConfig: {
                      title: "id",
                      subtitle: "actionType",
                      content: ["status", "reasoning"],
                      metadata: ["requestedAt", "expiresAt"],
                    },
                    layout: "list",
                  },
                  objectField(
                    {},
                    { response: true },
                    {
                      id: responseField({}, z.uuid()),
                      emailId: responseField({}, z.uuid()),
                      actionType: responseField({}, z.string()),
                      toolCall: responseField({}, z.record(z.unknown()).optional()),
                      reasoning: responseField({}, z.string()),
                      requestedAt: responseField({}, z.string()),
                      expiresAt: responseField({}, z.string()),
                      status: responseField({}, z.string()),
                      metadata: responseField({}, z.record(z.unknown()).optional()),
                    },
                  ),
                ),
                errors: responseArrayField(
                  {
                    type: WidgetType.DATA_CARDS,
                    cardConfig: {
                      title: "error",
                      content: [],
                    },
                    layout: "list",
                  },
                  objectField(
                    {},
                    { response: true },
                    {
                      error: responseField({}, z.string()),
                    },
                  ),
                ),
                priority: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.post.response.items.priority",
                  },
                  z.string(),
                ),
                createdAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.post.response.items.createdAt",
                  },
                  z.string(),
                ),
                updatedAt: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.status.post.response.items.updatedAt",
                  },
                  z.string(),
                ),
              },
            ),
          ),
          total: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.agent.status.post.response.total",
            },
            z.number(),
          ),
          page: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.agent.status.post.response.page",
            },
            z.number(),
          ),
          limit: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.agent.status.post.response.limit",
            },
            z.number(),
          ),
          totalPages: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.agent.status.post.response.totalPages",
            },
            z.number(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.agent.status.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.status.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.status.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.status.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.status.post.errors.server.title",
      description:
        "app.api.v1.core.agent.status.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.status.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.status.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.status.post.errors.network.title",
      description:
        "app.api.v1.core.agent.status.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.status.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.status.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.status.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.status.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.agent.status.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.status.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.status.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.status.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.status.post.success.title",
    description: "app.api.v1.core.agent.status.post.success.description",
  },

  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        response: {
          items: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      },
    },
    urlPathVariables: undefined,
  },
});

// Extract types using the new enhanced system
export type EmailAgentStatusGetRequestTypeInput = typeof GET.types.RequestInput;
export type EmailAgentStatusGetRequestTypeOutput =
  typeof GET.types.RequestOutput;
export type EmailAgentStatusGetResponseTypeInput =
  typeof GET.types.ResponseInput;
export type EmailAgentStatusGetResponseTypeOutput =
  typeof GET.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
  POST,
};

export { GET, POST };
export default definitions;
