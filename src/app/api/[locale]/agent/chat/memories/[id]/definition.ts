/**
 * Single Memory API Definition
 * Defines PATCH and DELETE endpoints for individual memory operations
 */

import { z } from "zod";

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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
export const MEMORY_UPDATE_ALIAS = "memories-update" as const;
export const MEMORY_DELETE_ALIAS = "memories-delete" as const;

/**
 * Delete Memory Endpoint (DELETE)
 * Removes a memory by ID
 */
const { DELETE } = createEndpoint({
  method: Methods.DELETE,
  path: ["agent", "chat", "memories", "[id]"],
  aliases: [MEMORY_DELETE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  requiresConfirmation: true,

  title: "app.api.agent.chat.memories.id.delete.title" as const,
  description: "app.api.agent.chat.memories.id.delete.description" as const,
  icon: "brain" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.memories" as const],

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
                  (mem) => mem.memoryNumber !== data.pathParams.id,
                ),
              },
            };
          },
          undefined,
        );
      },
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.agent.chat.memories.id.delete.container.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.container.description" as const,
      layoutType: LayoutType.STACKED,
      noCard: true,
    },
    { request: "urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.agent.chat.memories.id.delete.id.label" as const,
        description:
          "app.api.agent.chat.memories.id.delete.id.description" as const,
        schema: z.coerce.number().int().min(0),
        hidden: true,
      }),

      // Back button
      backButton: backButton({
        label:
          "app.api.agent.chat.memories.id.delete.backButton.label" as const,
        usage: { request: "urlPathParams", response: true } as const,
        inline: true,
      }),

      // Delete button (submit)
      deleteButton: submitButton({
        label:
          "app.api.agent.chat.memories.id.delete.deleteButton.label" as const,
        icon: "trash",
        variant: "destructive",
        inline: true,
        usage: { request: "urlPathParams" },
      }),

      // === RESPONSE ===
      success: responseField({
        type: WidgetType.TEXT,
        schema: z.boolean(),
        hidden: true,
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.memories.id.delete.errors.validation.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.memories.id.delete.errors.network.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.memories.id.delete.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.memories.id.delete.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.memories.id.delete.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.memories.id.delete.errors.server.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.memories.id.delete.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.memories.id.delete.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.memories.id.delete.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.memories.id.delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.memories.id.delete.success.title" as const,
    description:
      "app.api.agent.chat.memories.id.delete.success.description" as const,
  },

  examples: {
    responses: {
      delete: {
        success: true,
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
  method: Methods.PATCH,
  path: ["agent", "chat", "memories", "[id]"],
  aliases: [MEMORY_UPDATE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.memories.id.patch.title" as const,
  description: "app.api.agent.chat.memories.id.patch.description" as const,
  icon: "brain",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.memories" as const],

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
                  if (mem.memoryNumber !== pathParams.id) {
                    return mem;
                  }

                  // Update with new values from request, keeping existing if not provided
                  return {
                    ...mem,
                    content: requestData.content ?? mem.content,
                    tags: requestData.tags ?? mem.tags,
                    priority: requestData.priority ?? mem.priority,
                  };
                }),
              },
            };
          },
          undefined,
        );
      },
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { request: "data&urlPathParams", response: true },
    {
      // === REQUEST URL PARAMS ===
      id: requestUrlPathParamsField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.agent.chat.memories.id.patch.id.label" as const,
        description:
          "app.api.agent.chat.memories.id.patch.id.description" as const,
        schema: z.coerce.number().int().min(0),
        hidden: true,
      }),

      title: widgetField({
        type: WidgetType.TITLE,
        content: "app.api.agent.chat.memories.id.patch.title" as const,
        usage: { request: "data&urlPathParams", response: true } as const,
        inline: true,
      }),

      // Delete button configuration
      deleteButton: deleteButton({
        label:
          "app.api.agent.chat.memories.id.patch.deleteButton.label" as const,
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
      content: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.agent.chat.memories.id.patch.content.label" as const,
        description:
          "app.api.agent.chat.memories.id.patch.content.description" as const,
        columns: 12,
        schema: z.string().max(1000).optional(),
      }),
      tags: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "app.api.agent.chat.memories.id.patch.tags.label" as const,
        description:
          "app.api.agent.chat.memories.id.patch.tags.description" as const,
        columns: 6,
        schema: z.array(z.string()).optional(),
      }),
      priority: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.agent.chat.memories.id.patch.priority.label" as const,
        description:
          "app.api.agent.chat.memories.id.patch.priority.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).max(100).optional(),
      }),

      // Back button
      backButton: backButton({
        label: "app.api.agent.chat.memories.id.patch.backButton.label" as const,
        usage: { request: "data&urlPathParams", response: true } as const,
        className: "ml-auto",
        inline: true,
      }),

      // Submit button
      submitButton: submitButton({
        label:
          "app.api.agent.chat.memories.id.patch.submitButton.label" as const,
        usage: { request: "data&urlPathParams" },
        inline: true,
      }),

      // === RESPONSE ===
      success: responseField({
        type: WidgetType.TEXT,
        schema: z.boolean(),
        hidden: true,
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.memories.id.patch.errors.validation.title" as const,
      description:
        "app.api.agent.chat.memories.id.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.memories.id.patch.errors.network.title" as const,
      description:
        "app.api.agent.chat.memories.id.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.memories.id.patch.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.memories.id.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.memories.id.patch.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.memories.id.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.memories.id.patch.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.memories.id.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.memories.id.patch.errors.server.title" as const,
      description:
        "app.api.agent.chat.memories.id.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.memories.id.patch.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.memories.id.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.memories.id.patch.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.memories.id.patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.memories.id.patch.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.memories.id.patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.memories.id.patch.success.title" as const,
    description:
      "app.api.agent.chat.memories.id.patch.success.description" as const,
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
