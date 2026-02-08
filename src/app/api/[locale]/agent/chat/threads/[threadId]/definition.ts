/**
 * Chat Thread by ID API Definition
 * Defines endpoints for getting, updating, and deleting individual threads
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole, UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";

import { DefaultFolderId } from "../../config";
import { ThreadStatus, ThreadStatusOptions } from "../../enum";

/**
 * Get Thread by ID Endpoint (GET)
 * Retrieves a specific thread by ID
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.threads.threadId.get.title" as const,
  description: "app.api.agent.chat.threads.threadId.get.description" as const,
  icon: "message-square",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.threads" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.threads.threadId.get.container.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.get.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.agent.chat.threads.threadId.get.id.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.get.id.description" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE ===
      thread: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.threads.threadId.get.response.thread.title" as const,
          description:
            "app.api.agent.chat.threads.threadId.get.response.thread.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          id: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.id.content" as const,
            schema: z.uuid(),
          }),
          userId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.userId.content" as const,
            schema: z.uuid().nullable(),
          }),
          title: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.threadTitle.content" as const,
            schema: z.string(),
          }),
          folderId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.folderId.content" as const,
            schema: z.uuid().nullable(),
          }),
          status: responseField({
            type: WidgetType.BADGE,
            text: "app.api.agent.chat.threads.threadId.get.response.thread.status.content" as const,
            schema: z.enum(ThreadStatus),
          }),
          defaultModel: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.defaultModel.content" as const,
            schema: z.string().nullable(),
          }),
          defaultCharacter: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.defaultTone.content" as const,
            schema: z.string().nullable(),
          }),
          systemPrompt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.systemPrompt.content" as const,
            schema: z.string().nullable(),
          }),
          pinned: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.pinned.content" as const,
            schema: z.boolean(),
          }),
          archived: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.archived.content" as const,
            schema: z.boolean(),
          }),
          tags: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.tags.content" as const,
            schema: z.array(z.string()),
          }),
          preview: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.preview.content" as const,
            schema: z.string().nullable(),
          }),
          metadata: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.metadata.content" as const,
            schema: z.record(z.string(), z.any()),
          }),
          createdAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.createdAt.content" as const,
            schema: dateSchema,
          }),
          updatedAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.updatedAt.content" as const,
            schema: dateSchema,
          }),
          leadId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.leadId.content" as const,
            schema: z.uuid().nullable(),
          }),
          rootFolderId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.rootFolderId.content" as const,
            schema: z.enum(Object.values(DefaultFolderId)),
          }),
          rolesView: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesEdit: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesPost: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesModerate: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesAdmin: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          published: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.published.content" as const,
            schema: z.boolean(),
          }),
          searchVector: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.get.response.thread.searchVector.content" as const,
            schema: z.string().nullable(),
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.threads.threadId.get.errors.validation.title",
      description:
        "app.api.agent.chat.threads.threadId.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.get.errors.unauthorized.title",
      description:
        "app.api.agent.chat.threads.threadId.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.threads.threadId.get.errors.forbidden.title",
      description:
        "app.api.agent.chat.threads.threadId.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.threads.threadId.get.errors.notFound.title",
      description:
        "app.api.agent.chat.threads.threadId.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.get.errors.server.title",
      description:
        "app.api.agent.chat.threads.threadId.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.get.errors.network.title",
      description:
        "app.api.agent.chat.threads.threadId.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.get.errors.unknown.title",
      description:
        "app.api.agent.chat.threads.threadId.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.get.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.threads.threadId.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.threads.threadId.get.errors.conflict.title",
      description:
        "app.api.agent.chat.threads.threadId.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.threads.threadId.get.success.title",
    description: "app.api.agent.chat.threads.threadId.get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        thread: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          userId: "660e8400-e29b-41d4-a716-446655440000",
          title: "My Chat Thread",
          folderId: null,
          status: ThreadStatus.ACTIVE,
          defaultModel: "gpt-4o",
          defaultCharacter: "professional",
          systemPrompt: null,
          pinned: false,
          archived: false,
          tags: [],
          preview: "Hello, how can I help you?",
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          leadId: null,
          rootFolderId: DefaultFolderId.PRIVATE,
          rolesView: null,
          rolesEdit: null,
          rolesPost: null,
          rolesModerate: null,
          rolesAdmin: null,
          published: false,
          searchVector: null,
        },
      },
    },
  },
});

/**
 * Update Thread Endpoint (PATCH)
 * Updates an existing thread
 */
const { PATCH } = createEndpoint({
  method: Methods.PATCH,
  path: ["agent", "chat", "threads", "[threadId]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.threads.threadId.patch.title" as const,
  description: "app.api.agent.chat.threads.threadId.patch.description" as const,
  icon: "message-square",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.threads" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.threads.threadId.patch.container.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.patch.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.agent.chat.threads.threadId.patch.id.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.patch.id.description" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      // === UPDATE FIELDS ===
      updates: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.threads.threadId.patch.sections.updates.title" as const,
          description:
            "app.api.agent.chat.threads.threadId.patch.sections.updates.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { request: "data" },
        {
          title: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.threads.threadId.patch.threadTitle.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.threadTitle.description" as const,
            columns: 12,
            schema: z.string().min(1).max(255).optional(),
          }),
          folderId: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.UUID,
            label:
              "app.api.agent.chat.threads.threadId.patch.folderId.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.folderId.description" as const,
            columns: 6,
            schema: z.uuid().optional().nullable(),
          }),
          status: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label:
              "app.api.agent.chat.threads.threadId.patch.status.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.status.description" as const,
            columns: 6,
            options: ThreadStatusOptions,
            schema: z.enum(ThreadStatus).optional(),
          }),
          defaultModel: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.threads.threadId.patch.defaultModel.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.defaultModel.description" as const,
            columns: 6,
            schema: z.enum(ModelId).nullable().optional(),
          }),
          defaultCharacter: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.threads.threadId.patch.defaultTone.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.defaultTone.description" as const,
            columns: 6,
            schema: z.string().nullable().optional(),
          }),
          systemPrompt: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXTAREA,
            label:
              "app.api.agent.chat.threads.threadId.patch.systemPrompt.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.systemPrompt.description" as const,
            columns: 12,
            schema: z.string().optional(),
          }),
          pinned: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label:
              "app.api.agent.chat.threads.threadId.patch.pinned.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.pinned.description" as const,
            columns: 6,
            schema: z.boolean().optional(),
          }),
          archived: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label:
              "app.api.agent.chat.threads.threadId.patch.archived.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.archived.description" as const,
            columns: 6,
            schema: z.boolean().optional(),
          }),
          tags: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label:
              "app.api.agent.chat.threads.threadId.patch.tags.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.tags.description" as const,
            columns: 12,
            schema: z.array(z.string()).optional(),
          }),
          published: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label:
              "app.api.agent.chat.threads.threadId.patch.published.label" as const,
            description:
              "app.api.agent.chat.threads.threadId.patch.published.description" as const,
            columns: 6,
            schema: z.boolean().optional(),
          }),
        },
      ),

      // === RESPONSE (same as GET) ===
      thread: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.agent.chat.threads.threadId.patch.response.thread.title" as const,
          description:
            "app.api.agent.chat.threads.threadId.patch.response.thread.description" as const,
          layoutType: LayoutType.GRID,
          columns: 2,
        },
        { response: true },
        {
          id: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.id.content" as const,
            schema: z.uuid(),
          }),
          userId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.userId.content" as const,
            schema: z.uuid().nullable(),
          }),
          title: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.threadTitle.content" as const,
            schema: z.string(),
          }),
          folderId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.folderId.content" as const,
            schema: z.uuid().nullable(),
          }),
          status: responseField({
            type: WidgetType.BADGE,
            text: "app.api.agent.chat.threads.threadId.patch.response.thread.status.content" as const,
            schema: z.enum(ThreadStatus),
          }),
          defaultModel: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.defaultModel.content" as const,
            schema: z.string().nullable(),
          }),
          defaultCharacter: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.defaultTone.content" as const,
            schema: z.string().nullable(),
          }),
          systemPrompt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.systemPrompt.content" as const,
            schema: z.string().nullable(),
          }),
          pinned: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.pinned.content" as const,
            schema: z.boolean(),
          }),
          archived: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.archived.content" as const,
            schema: z.boolean(),
          }),
          tags: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.tags.content" as const,
            schema: z.array(z.string()),
          }),
          published: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.published.content" as const,
            schema: z.boolean(),
          }),
          preview: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.preview.content" as const,
            schema: z.string().nullable(),
          }),
          metadata: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.metadata.content" as const,
            schema: z.record(z.string(), z.any()),
          }),
          createdAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.createdAt.content" as const,
            schema: dateSchema,
          }),
          updatedAt: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.updatedAt.content" as const,
            schema: dateSchema,
          }),
          leadId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.leadId.content" as const,
            schema: z.uuid().nullable(),
          }),
          rootFolderId: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.rootFolderId.content" as const,
            schema: z.enum(Object.values(DefaultFolderId)),
          }),
          rolesView: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesEdit: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesPost: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesModerate: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          rolesAdmin: responseArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
            },
            responseField({
              type: WidgetType.TEXT,
              schema: z.enum(UserRoleDB),
            }),
          ),
          searchVector: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.agent.chat.threads.threadId.patch.response.thread.searchVector.content" as const,
            schema: z.string().nullable(),
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.patch.errors.validation.title",
      description:
        "app.api.agent.chat.threads.threadId.patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.patch.errors.unauthorized.title",
      description:
        "app.api.agent.chat.threads.threadId.patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.threads.threadId.patch.errors.forbidden.title",
      description:
        "app.api.agent.chat.threads.threadId.patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.threads.threadId.patch.errors.notFound.title",
      description:
        "app.api.agent.chat.threads.threadId.patch.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.patch.errors.server.title",
      description:
        "app.api.agent.chat.threads.threadId.patch.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.patch.errors.network.title",
      description:
        "app.api.agent.chat.threads.threadId.patch.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.patch.errors.unknown.title",
      description:
        "app.api.agent.chat.threads.threadId.patch.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.patch.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.threads.threadId.patch.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.threads.threadId.patch.errors.conflict.title",
      description:
        "app.api.agent.chat.threads.threadId.patch.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.threads.threadId.patch.success.title",
    description:
      "app.api.agent.chat.threads.threadId.patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        updates: {
          title: "Updated Thread Title",
          pinned: true,
        },
      },
    },
    responses: {
      default: {
        thread: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          userId: "660e8400-e29b-41d4-a716-446655440000",
          title: "Updated Thread Title",
          folderId: null,
          status: ThreadStatus.ACTIVE,
          defaultModel: "gpt-4o",
          defaultCharacter: "professional",
          systemPrompt: null,
          pinned: true,
          archived: false,
          tags: [],
          published: false,
          preview: "Hello, how can I help you?",
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          leadId: null,
          rootFolderId: DefaultFolderId.PRIVATE,
          rolesView: null,
          rolesEdit: null,
          rolesPost: null,
          rolesModerate: null,
          rolesAdmin: null,
          searchVector: null,
        },
      },
    },
  },
});

/**
 * Delete Thread Endpoint (DELETE)
 * Deletes a thread by ID
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["agent", "chat", "threads", "[threadId]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.threads.threadId.delete.title" as const,
  description:
    "app.api.agent.chat.threads.threadId.delete.description" as const,
  icon: "message-square",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.threads" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.agent.chat.threads.threadId.delete.container.title" as const,
      description:
        "app.api.agent.chat.threads.threadId.delete.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "urlPathParams", response: true },
    {
      // === URL PARAMETERS ===
      threadId: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "app.api.agent.chat.threads.threadId.delete.id.label" as const,
        description:
          "app.api.agent.chat.threads.threadId.delete.id.description" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.threads.threadId.delete.response.success.content" as const,
        schema: z.boolean(),
      }),
      deletedId: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.agent.chat.threads.threadId.delete.response.deletedId.content" as const,
        schema: z.uuid(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.threads.threadId.delete.errors.validation.title",
      description:
        "app.api.agent.chat.threads.threadId.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.threads.threadId.delete.errors.unauthorized.title",
      description:
        "app.api.agent.chat.threads.threadId.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.threads.threadId.delete.errors.forbidden.title",
      description:
        "app.api.agent.chat.threads.threadId.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.threads.threadId.delete.errors.notFound.title",
      description:
        "app.api.agent.chat.threads.threadId.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.delete.errors.server.title",
      description:
        "app.api.agent.chat.threads.threadId.delete.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.delete.errors.network.title",
      description:
        "app.api.agent.chat.threads.threadId.delete.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.threads.threadId.delete.errors.unknown.title",
      description:
        "app.api.agent.chat.threads.threadId.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.threads.threadId.delete.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.threads.threadId.delete.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.threads.threadId.delete.errors.conflict.title",
      description:
        "app.api.agent.chat.threads.threadId.delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.agent.chat.threads.threadId.delete.success.title",
    description:
      "app.api.agent.chat.threads.threadId.delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        success: true,
        deletedId: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
  },
});

// Extract types
export type ThreadGetRequestInput = typeof GET.types.RequestInput;
export type ThreadGetRequestOutput = typeof GET.types.RequestOutput;
export type ThreadGetResponseInput = typeof GET.types.ResponseInput;
export type ThreadGetResponseOutput = typeof GET.types.ResponseOutput;
export type ThreadGetUrlParamsTypeOutput = typeof GET.types.UrlVariablesOutput;

export type ThreadPatchRequestInput = typeof PATCH.types.RequestInput;
export type ThreadPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type ThreadPatchResponseInput = typeof PATCH.types.ResponseInput;
export type ThreadPatchResponseOutput = typeof PATCH.types.ResponseOutput;
export type ThreadPatchUrlParamsTypeOutput =
  typeof PATCH.types.UrlVariablesOutput;

export type ThreadDeleteRequestInput = typeof DELETE.types.UrlVariablesInput;
export type ThreadDeleteRequestOutput = typeof DELETE.types.UrlVariablesOutput;
export type ThreadDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type ThreadDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
export type ThreadDeleteUrlParamsTypeOutput =
  typeof DELETE.types.UrlVariablesOutput;

const definitions = { GET, PATCH, DELETE };
export default definitions;
