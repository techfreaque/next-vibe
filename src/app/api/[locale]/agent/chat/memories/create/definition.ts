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
 * Memory tool alias for AI tool calling
 */
import { MEMORY_ADD_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

/**
 * Add Memory Endpoint (POST)
 * Creates a new memory for the current user or lead
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "memories", "create"],
  aliases: [MEMORY_ADD_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.content) {
      const content =
        request.content.length > 40
          ? `${request.content.slice(0, 40)}...`
          : request.content;
      return {
        message: "post.dynamicTitle" as const,
        messageParams: { content },
      };
    }
    return undefined;
  },
  icon: "brain",
  category: "endpointCategories.memories",
  subCategory: "endpointCategories.memoriesManagement",
  tags: ["post.tags.memories" as const],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        // Import apiClient and memories list GET endpoint
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const memoriesDefinition = await import("../definition");

        // Create new memory object for optimistic update
        const newMemory = {
          id: data.responseData.id,
          content: data.requestData.content,
          tags: data.requestData.tags ?? [],
          priority: data.requestData.priority ?? 0,
          isPublic: data.requestData.isPublic ?? false,
          isShared: data.requestData.isShared ?? false,
          isArchived: false,
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
        );
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title" as const,
    description: "post.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST ===
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.content.label" as const,
        description: "post.content.description" as const,
        columns: 12,
        schema: z.string().min(1).max(5000),
      }),
      tags: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TAGS,
        label: "post.tags.label" as const,
        description: "post.tags.description" as const,
        columns: 6,
        schema: z.array(z.string()).optional(),
      }),
      priority: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.priority.label" as const,
        description: "post.priority.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).max(100).optional(),
      }),
      isPublic: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.isPublic.label" as const,
        description: "post.isPublic.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),
      isShared: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.isShared.label" as const,
        description: "post.isShared.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // Back button
      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        className: "ml-auto",
        inline: true,
        usage: { request: "data", response: true } as const,
      }),

      // Submit button
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        inline: true,
        usage: { request: "data" },
      }),

      // === RESPONSE ===
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.coerce.number().int(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
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
        id: 42,
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
