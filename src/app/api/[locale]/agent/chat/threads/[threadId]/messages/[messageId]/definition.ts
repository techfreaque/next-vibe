/**
 * Chat Message by ID API Definition
 * Defines endpoints for getting, updating, and deleting individual messages
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { DefaultFolderId } from "../../../../config";
import { ChatMessageRole, ChatMessageRoleOptions } from "../../../../enum";
import { scopedTranslation } from "./i18n";
import { DeleteMessageWidget } from "./widget";

/**
 * Get Message by ID Endpoint (GET)
 * Retrieves a specific message by ID
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "threads", "[threadId]", "messages", "[messageId]"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "message-circle",
  category: "app.endpointCategories.chatMessages",
  tags: ["tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
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

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.threadId.label" as const,
        description: "get.threadId.description" as const,
        schema: z.uuid(),
      }),
      messageId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "get.messageId.label" as const,
        description: "get.messageId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "get.rootFolderId.label" as const,
        description: "get.rootFolderId.description" as const,
        columns: 6,
        schema: z.enum(DefaultFolderId),
      }),

      // === RESPONSE ===
      role: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.message.role.content" as const,
        schema: z.enum(ChatMessageRole),
      }),
      content: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.message.content.content" as const,
        schema: z.string().nullable(),
      }),
      parentId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.message.parentId.content" as const,
        schema: z.uuid().nullable(),
      }),
      authorId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.message.authorId.content" as const,
        schema: z.string().nullable(),
      }),
      isAI: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.message.isAI.content" as const,
        schema: z.boolean(),
      }),
      model: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.message.model.content" as const,
        schema: z.string().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.message.createdAt.content" as const,
        schema: dateSchema,
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.message.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  // Route to client (localStorage) for incognito threads — caller passes rootFolderId
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,

  examples: {
    urlPathParams: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440000",
      },
    },
    requests: {
      default: { rootFolderId: DefaultFolderId.PRIVATE },
    },
    responses: {
      default: {
        role: ChatMessageRole.USER,
        content: "Hello, how can you help me?",
        parentId: null,
        authorId: "770e8400-e29b-41d4-a716-446655440000",
        isAI: false,
        model: null,
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

/**
 * Update Message Endpoint (PATCH)
 * Updates a specific message's content
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "threads", "[threadId]", "messages", "[messageId]"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "message-circle",
  category: "app.endpointCategories.chatMessages",
  tags: ["tags.messages" as const],

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
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

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.container.title" as const,
    description: "patch.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.threadId.label" as const,
        description: "patch.threadId.description" as const,
        schema: z.uuid(),
      }),
      messageId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.messageId.label" as const,
        description: "patch.messageId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.rootFolderId.label" as const,
        description: "patch.rootFolderId.description" as const,
        columns: 6,
        schema: z.enum(DefaultFolderId),
      }),
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.content.label" as const,
        description: "patch.content.description" as const,
        schema: z.string().min(1),
      }),
      role: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.role.label" as const,
        description: "patch.role.description" as const,
        options: ChatMessageRoleOptions,
        schema: z.enum(ChatMessageRole).optional(),
      }),

      // === RESPONSE ===
      updatedContent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.message.content.content" as const,
        schema: z.string().nullable(),
      }),
      updatedRole: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.message.role.content" as const,
        schema: z.enum(ChatMessageRole),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.message.updatedAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  // Route to client (localStorage) for incognito threads — caller passes rootFolderId
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,

  examples: {
    urlPathParams: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440000",
      },
    },
    requests: {
      default: {
        rootFolderId: DefaultFolderId.PRIVATE,
        content: "Updated message content",
        role: ChatMessageRole.USER,
      },
    },
    responses: {
      default: {
        updatedContent: "Updated message content",
        updatedRole: ChatMessageRole.USER,
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

/**
 * Delete Message Endpoint (DELETE)
 * Deletes a specific message
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "chat", "threads", "[threadId]", "messages", "[messageId]"],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "message-circle",
  category: "app.endpointCategories.chatMessages",
  tags: ["tags.messages" as const],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const messagesDefinition = await import("../definition");

        apiClient.updateEndpointData(
          messagesDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }
            return {
              success: true,
              data: {
                messages: oldData.data.messages.filter(
                  (msg) => msg.id !== data.pathParams.messageId,
                ),
              },
            };
          },
          {
            urlPathParams: { threadId: data.pathParams.threadId },
            requestData: { rootFolderId: data.requestData.rootFolderId },
          },
        );
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
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

  fields: customWidgetObject({
    render: DeleteMessageWidget,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      // === URL PARAMS ===
      threadId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.threadId.label" as const,
        description: "delete.threadId.description" as const,
        schema: z.uuid(),
      }),
      messageId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "delete.messageId.label" as const,
        description: "delete.messageId.description" as const,
        schema: z.uuid(),
      }),

      // === REQUEST DATA ===
      rootFolderId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "delete.rootFolderId.label" as const,
        description: "delete.rootFolderId.description" as const,
        columns: 6,
        options: [
          { value: DefaultFolderId.PRIVATE, label: "Private" },
          { value: DefaultFolderId.SHARED, label: "Shared" },
          { value: DefaultFolderId.PUBLIC, label: "Public" },
          { value: DefaultFolderId.INCOGNITO, label: "Incognito" },
        ],
        schema: z.enum(DefaultFolderId),
      }),

      // === RESPONSE ===
      role: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.role.content" as const,
        schema: z.enum(ChatMessageRole),
      }),
      content: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.content.content" as const,
        schema: z.string().nullable(),
      }),
      parentId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.parentId.content" as const,
        schema: z.uuid().nullable(),
      }),
      authorId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.authorId.content" as const,
        schema: z.string().nullable(),
      }),
      isAI: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.isAI.content" as const,
        schema: z.boolean(),
      }),
      model: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.model.content" as const,
        schema: z.string().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.createdAt.content" as const,
        schema: dateSchema,
      }),
    },
  }),

  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },

  // Route to client (localStorage) for incognito threads — caller passes rootFolderId
  useClientRoute: ({ data }) => data.rootFolderId === DefaultFolderId.INCOGNITO,

  examples: {
    urlPathParams: {
      default: {
        threadId: "550e8400-e29b-41d4-a716-446655440000",
        messageId: "660e8400-e29b-41d4-a716-446655440000",
      },
    },
    requests: {
      default: { rootFolderId: DefaultFolderId.PRIVATE },
    },
    responses: {
      default: {
        role: ChatMessageRole.USER,
        content: "Hello, how can you help me?",
        parentId: null,
        authorId: "770e8400-e29b-41d4-a716-446655440000",
        isAI: false,
        model: null,
        createdAt: "2024-01-15T10:00:00.000Z",
      },
    },
  },
});

/**
 * Export type definitions
 */
export type MessageGetRequestOutput = typeof GET.types.RequestOutput;
export type MessageGetResponseOutput = typeof GET.types.ResponseOutput;
export type MessageGetUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;

export type MessagePatchRequestOutput = typeof PATCH.types.RequestOutput;
export type MessagePatchResponseOutput = typeof PATCH.types.ResponseOutput;
export type MessagePatchUrlVariablesOutput =
  typeof PATCH.types.UrlVariablesOutput;

export type MessageDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type MessageDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
export type MessageDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;

/**
 * Export definitions
 */
export default { GET, PATCH, DELETE };
