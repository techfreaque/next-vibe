/**
 * Chat Thread by ID API Definition
 * Defines endpoints for getting, updating, and deleting individual threads
 */

import { z } from "zod";

import { ModelId } from "@/app/api/[locale]/agent/models/models";
import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  responseArrayOptionalField,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedRequestUrlPathParamsField,
  scopedResponseField,
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
import { scopedTranslation } from "./i18n";

/**
 * Get Thread by ID Endpoint (GET)
 * Retrieves a specific thread by ID
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.REMOTE_SKILL,
  ] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "message-square",
  category: "category" as const,
  tags: ["tags.threads" as const],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === URL PARAMETERS ===
      threadId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.id.label" as const,
        description: "get.id.description" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE ===
      // Note: threadId is already known from the URL param, not repeated here
      userId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.userId.content" as const,
        schema: z.uuid().nullable(),
      }),
      title: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.threadTitle.content" as const,
        schema: z.string(),
      }),
      folderId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.folderId.content" as const,
        schema: z.uuid().nullable(),
      }),
      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.thread.status.content" as const,
        schema: z.enum(ThreadStatus),
      }),
      defaultModel: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.defaultModel.content" as const,
        schema: z.string().nullable(),
      }),
      defaultCharacter: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.defaultTone.content" as const,
        schema: z.string().nullable(),
      }),
      systemPrompt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.systemPrompt.content" as const,
        schema: z.string().nullable(),
      }),
      pinned: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.pinned.content" as const,
        schema: z.boolean(),
      }),
      archived: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.archived.content" as const,
        schema: z.boolean(),
      }),
      tags: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.tags.content" as const,
        schema: z.array(z.string()),
      }),
      preview: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.preview.content" as const,
        schema: z.string().nullable(),
      }),
      metadata: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.metadata.content" as const,
        schema: z.record(z.string(), z.any()),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.updatedAt.content" as const,
        schema: dateSchema,
      }),
      leadId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.leadId.content" as const,
        schema: z.uuid().nullable(),
      }),
      rootFolderId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.rootFolderId.content" as const,
        schema: z.enum(Object.values(DefaultFolderId)),
      }),
      rolesView: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesEdit: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesPost: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesModerate: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      rolesAdmin: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
        },
        scopedResponseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.enum(UserRoleDB),
        }),
      ),
      published: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.thread.published.content" as const,
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
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
      },
    },
  },
});

/**
 * Update Thread Endpoint (PATCH)
 * Updates an existing thread
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "threads", "[threadId]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "message-square",
  category: "category" as const,
  tags: ["tags.threads" as const],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.container.title" as const,
    description: "patch.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMETERS ===
      threadId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.id.label" as const,
        description: "patch.id.description" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      // === UPDATE FIELDS ===
      title: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.threadTitle.label" as const,
        description: "patch.threadTitle.description" as const,
        columns: 12,
        schema: z.string().min(1).max(255).optional(),
      }),
      folderId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.folderId.label" as const,
        description: "patch.folderId.description" as const,
        columns: 6,
        schema: z.string().uuid().nullish(),
      }),
      status: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.status.label" as const,
        description: "patch.status.description" as const,
        columns: 6,
        options: ThreadStatusOptions,
        schema: z.enum(ThreadStatus).optional(),
      }),
      defaultModel: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.defaultModel.label" as const,
        description: "patch.defaultModel.description" as const,
        columns: 6,
        schema: z.enum(ModelId).nullable().optional(),
      }),
      defaultCharacter: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.defaultTone.label" as const,
        description: "patch.defaultTone.description" as const,
        columns: 6,
        schema: z.string().nullable().optional(),
      }),
      systemPrompt: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.systemPrompt.label" as const,
        description: "patch.systemPrompt.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      pinned: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.pinned.label" as const,
        description: "patch.pinned.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      archived: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.archived.label" as const,
        description: "patch.archived.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      tags: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.tags.label" as const,
        description: "patch.tags.description" as const,
        columns: 12,
        schema: z.array(z.string()).optional(),
      }),
      published: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.published.label" as const,
        description: "patch.published.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),

      // === RESPONSE ===
      // Note: threadId already known from URL param, not repeated
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.thread.updatedAt.content" as const,
        schema: dateSchema,
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    requests: {
      default: {
        title: "Updated Thread Title",
        pinned: true,
      },
    },
    responses: {
      default: {
        updatedAt: new Date().toISOString(),
      },
    },
  },
});

/**
 * Delete Thread Endpoint (DELETE)
 * Deletes a thread by ID
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "chat", "threads", "[threadId]"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "message-square",
  category: "category" as const,
  tags: ["tags.threads" as const],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.container.title" as const,
    description: "delete.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === URL PARAMETERS ===
      threadId: scopedRequestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.id.label" as const,
        description: "delete.id.description" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      // === RESPONSE ===
      // Note: threadId already known from URL param, not repeated
      userId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.userId.content" as const,
        schema: z.uuid().nullable(),
      }),
      title: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.title.content" as const,
        schema: z.string(),
      }),
      rootFolderId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.rootFolderId.content" as const,
        schema: z.enum(Object.values(DefaultFolderId)),
      }),
      folderId: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.folderId.content" as const,
        schema: z.uuid().nullable(),
      }),
      status: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.status.content" as const,
        schema: z.enum(ThreadStatus),
      }),
      preview: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.preview.content" as const,
        schema: z.string().nullable(),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.updatedAt.content" as const,
        schema: dateSchema,
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
  },

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },

  examples: {
    urlPathParams: {
      default: { threadId: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        userId: "660e8400-e29b-41d4-a716-446655440000",
        title: "My Chat Thread",
        rootFolderId: DefaultFolderId.PRIVATE,
        folderId: null,
        status: ThreadStatus.ACTIVE,
        preview: "Hello, how can I help you?",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
