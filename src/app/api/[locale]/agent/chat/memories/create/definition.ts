/**
 * Create Memory API Definition
 * Defines POST endpoint for creating new memories
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  objectField,
  requestField,
  responseField,
  submitButton,
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
 * Memory tool alias for AI tool calling
 */
export const MEMORY_ADD_ALIAS = "memories-add" as const;

/**
 * Add Memory Endpoint (POST)
 * Creates a new memory for the current user or lead
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["agent", "chat", "memories", "create"],
  aliases: [MEMORY_ADD_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.memories.create.post.title" as const,
  description: "app.api.agent.chat.memories.create.post.description" as const,
  icon: "brain",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.memories" as const],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient and memories list GET endpoint
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const memoriesDefinition = await import("../definition");

        // Create new memory object for optimistic update
        const newMemory = {
          memoryNumber: data.responseData.id,
          content: data.requestData.content,
          tags: data.requestData.tags ?? [],
          priority: data.requestData.priority ?? 0,
          createdAt: new Date(),
        };

        // Optimistically add the new memory to the list
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
                memories: [...oldData.data.memories, newMemory],
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
      title: "app.api.agent.chat.memories.create.post.container.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.container.description" as const,
      layoutType: LayoutType.STACKED,
    },
    { request: "data", response: true },
    {
      // === REQUEST ===
      content: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "app.api.agent.chat.memories.create.post.content.label" as const,
        description:
          "app.api.agent.chat.memories.create.post.content.description" as const,
        columns: 12,
        schema: z.string().min(1).max(1000),
      }),
      tags: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "app.api.agent.chat.memories.create.post.tags.label" as const,
        description:
          "app.api.agent.chat.memories.create.post.tags.description" as const,
        columns: 6,
        schema: z.array(z.string()).optional(),
      }),
      priority: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.agent.chat.memories.create.post.priority.label" as const,
        description:
          "app.api.agent.chat.memories.create.post.priority.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).max(100).optional(),
      }),

      // Back button
      backButton: backButton({
        label:
          "app.api.agent.chat.memories.create.post.backButton.label" as const,
        className: "ml-auto",
        inline: true,
        usage: { request: "data", response: true } as const,
      }),

      // Submit button
      submitButton: submitButton({
        label:
          "app.api.agent.chat.memories.create.post.submitButton.label" as const,
        inline: true,
        usage: { request: "data" },
      }),

      // === RESPONSE ===
      id: responseField({
        type: WidgetType.TEXT,
        schema: z.coerce.number().int(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.memories.create.post.errors.validation.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.agent.chat.memories.create.post.errors.network.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.memories.create.post.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.memories.create.post.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.agent.chat.memories.create.post.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.agent.chat.memories.create.post.errors.server.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.agent.chat.memories.create.post.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.memories.create.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.agent.chat.memories.create.post.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.memories.create.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.memories.create.post.success.title" as const,
    description:
      "app.api.agent.chat.memories.create.post.success.description" as const,
  },

  examples: {
    requests: {
      add: {
        content: "Allergies: Peanuts",
        tags: ["health", "allergies"],
        priority: 10,
      },
    },
    responses: {
      add: {
        id: 0,
      },
    },
  },
});

// Type exports for POST endpoint
export type MemoryAddRequestInput = typeof POST.types.RequestInput;
export type MemoryAddRequestOutput = typeof POST.types.RequestOutput;
export type MemoryAddResponseInput = typeof POST.types.ResponseInput;
export type MemoryAddResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
