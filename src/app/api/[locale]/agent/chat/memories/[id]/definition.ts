/**
 * Single Memory API Definition
 * Defines PATCH and DELETE endpoints for individual memory operations
 */

import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  deleteButton,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

/**
 * Memory tool aliases for AI tool calling
 */
import { MEMORY_DELETE_ALIAS, MEMORY_UPDATE_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * Delete Memory Endpoint (DELETE)
 * Removes a memory by ID
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["agent", "chat", "memories", "[id]"],
  aliases: [MEMORY_DELETE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  requiresConfirmation: true,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "brain" as const,
  category: "app.endpointCategories.chat",
  tags: ["tags.memories" as const],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient and memories list GET endpoint
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const memoriesDefinition = await import("../definition");

        // Optimistically remove the deleted memory from the list
        apiClient.updateEndpointData(
          memoriesDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return {
              success: true,
              data: {
                memories: oldData.data.memories.filter(
                  (mem) => mem.id !== data.pathParams.id,
                ),
              },
            };
          },
        );
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.container.title" as const,
    description: "delete.container.description" as const,
    layoutType: LayoutType.STACKED,
    noCard: true,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "delete.id.label" as const,
        description: "delete.id.description" as const,
        schema: z.coerce.number().int().min(0),
        hidden: true,
      }),

      // Back button
      backButton: backButton(scopedTranslation, {
        label: "delete.backButton.label" as const,
        usage: { request: "urlPathParams", response: true } as const,
        inline: true,
      }),

      // Delete button (submit)
      deleteButton: submitButton(scopedTranslation, {
        label: "delete.deleteButton.label" as const,
        icon: "trash",
        variant: "destructive",
        inline: true,
        usage: { request: "urlPathParams" },
      }),

      // === RESPONSE ===
      // Note: id (memoryNumber) is already known from the URL param, not repeated
      content: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      tags: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(z.string()),
      }),
      priority: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: dateSchema,
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  examples: {
    responses: {
      delete: {
        content:
          "Profession: Senior Software Engineer specializing in TypeScript",
        tags: ["profession", "skills"],
        priority: 80,
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
    },
    urlPathParams: {
      delete: { id: 0 },
    },
  },
});

/**
 * Update Memory Endpoint (PATCH)
 * Updates an existing memory by ID
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "memories", "[id]"],
  aliases: [MEMORY_UPDATE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "brain",
  category: "app.endpointCategories.chat",
  tags: ["tags.memories" as const],

  options: {
    mutationOptions: {
      onSuccess: async ({ logger, pathParams, requestData }) => {
        // Import apiClient and memories list GET endpoint
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const memoriesDefinition = await import("../definition");

        // Optimistically update the memory in the list
        apiClient.updateEndpointData(
          memoriesDefinition.default.GET,
          logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return {
              success: true,
              data: {
                memories: oldData.data.memories.map((mem) => {
                  if (mem.id !== pathParams.id) {
                    return mem;
                  }

                  // Update with new values from request, keeping existing if not provided
                  return {
                    ...mem,
                    content: requestData.content ?? mem.content,
                    tags: requestData.tags ?? mem.tags,
                    priority: requestData.priority ?? mem.priority,
                    isArchived: requestData.isArchived ?? mem.isArchived,
                    isShared: requestData.isShared ?? mem.isShared,
                  };
                }),
              },
            };
          },
        );
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.id.label" as const,
        description: "patch.id.description" as const,
        schema: z.coerce.number().int().min(0),
        hidden: true,
      }),

      title: widgetField(scopedTranslation, {
        type: WidgetType.TITLE,
        content: "patch.title" as const,
        usage: { request: "data&urlPathParams", response: true } as const,
        inline: true,
      }),

      // Delete button configuration
      deleteButton: deleteButton(scopedTranslation, {
        label: "patch.deleteButton.label" as const,
        targetEndpoint: DELETE,
        extractParams: (source) => ({
          urlPathParams: {
            id: (source.urlPathParams as { id: number }).id,
          },
        }),
        icon: "trash",
        variant: "destructive",
        className: "ml-auto",
        inline: true,
        popNavigationOnSuccess: 1,
        usage: { request: "data&urlPathParams", response: true } as const,
      }),

      // === REQUEST DATA ===
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.content.label" as const,
        description: "patch.content.description" as const,
        columns: 12,
        schema: z.string().max(5000).optional(),
      }),
      tags: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "patch.tags.label" as const,
        description: "patch.tags.description" as const,
        columns: 6,
        schema: z.array(z.string()).optional(),
      }),
      priority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.priority.label" as const,
        description: "patch.priority.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).max(100).optional(),
      }),
      isPublic: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.isPublic.label" as const,
        description: "patch.isPublic.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      isArchived: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.isArchived.label" as const,
        description: "patch.isArchived.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),
      isShared: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.isShared.label" as const,
        description: "patch.isShared.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),

      // Back button
      backButton: backButton(scopedTranslation, {
        label: "patch.backButton.label" as const,
        usage: { request: "data&urlPathParams", response: true } as const,
        className: "ml-auto",
        inline: true,
      }),

      // Submit button
      submitButton: submitButton(scopedTranslation, {
        label: "patch.submitButton.label" as const,
        usage: { request: "data&urlPathParams" },
        inline: true,
      }),

      // === RESPONSE ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
        hidden: true,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    requests: {
      update: {
        content:
          "Profession: Senior Software Engineer specializing in TypeScript and Python",
        tags: ["profession", "skills", "experience"],
      },
    },
    responses: {
      update: {
        success: true,
      },
    },
    urlPathParams: {
      update: { id: 0 },
    },
  },
});

// Type exports for PATCH endpoint
export type MemoryUpdateRequestInput = typeof PATCH.types.RequestInput;
export type MemoryUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type MemoryUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type MemoryUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

// Type exports for DELETE endpoint
export type MemoryDeleteRequestInput = typeof DELETE.types.RequestInput;
export type MemoryDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type MemoryDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type MemoryDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { PATCH, DELETE };
export default definitions;
