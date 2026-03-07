/**
 * Memories API Definition
 * Defines endpoints for managing AI memories (persistent context)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedBackButton,
  scopedNavigateButtonField,
  scopedObjectFieldNew,
  scopedResponseArrayFieldNew,
  scopedResponseField,
  scopedWidgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../../../shared/types/common.schema";
/**
 * Memory tool aliases for AI tool calling
 */
import { MEMORY_LIST_ALIAS } from "./constants";
import createDefinition from "./create/definition";
import { scopedTranslation } from "./i18n";
import { MemoriesListContainer } from "./widget";

/**
 * Get Memories List Endpoint (GET)
 * Retrieves all memories for the current user or lead
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "memories"],
  aliases: [MEMORY_LIST_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  dynamicTitle: ({ response }) => {
    if (response?.memories) {
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { count: response.memories.length },
      };
    }
    return undefined;
  },
  icon: "brain",
  category: "app.endpointCategories.chat",
  tags: ["tags.memories" as const],

  fields: customWidgetObject({
    render: MemoriesListContainer,
    usage: { response: true } as const,
    children: {
      // Top action buttons
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.container.title" as const,
        usage: { response: true },
      }),
      createButton: scopedNavigateButtonField(scopedTranslation, {
        targetEndpoint: createDefinition.POST,
        extractParams: () => ({}),
        prefillFromGet: false,
        label: "get.createButton.label" as const,
        icon: "plus",
        variant: "default",
        className: "ml-auto",
        popNavigationOnSuccess: 1,
        usage: { response: true },
      }),

      // === RESPONSE ===
      memories: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layout: {
          type: LayoutType.GRID,
          columns: 1,
        },
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.memories.memory.title" as const,
          layoutType: LayoutType.STACKED,
          columns: 12,
          usage: { response: true },
          children: {
            id: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.memoryNumber.text" as const,
              schema: z.coerce.number().int(),
            }),
            content: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.memories.memory.content.content" as const,
              schema: z.string(),
            }),
            priority: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.priority.text" as const,
              schema: z.coerce.number(),
            }),
            isPublic: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.isPublic.text" as const,
              schema: z.boolean(),
            }),
            isArchived: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.isArchived.text" as const,
              schema: z.boolean(),
            }),
            isShared: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.isShared.text" as const,
              schema: z.boolean(),
            }),
            tags: scopedResponseArrayFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: scopedResponseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.string(),
              }),
            }),
            createdAt: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.memories.memory.createdAt.content" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    responses: {
      list: {
        memories: [
          {
            id: 0,
            content: "Profession: Software engineer specializing in Python",
            tags: ["profession", "skills"],
            priority: 0,
            isPublic: false,
            isArchived: false,
            isShared: false,
            createdAt: new Date("2025-01-01T00:00:00Z"),
          },
          {
            id: 1,
            content: "Preferences: Dark mode, coffee over tea",
            tags: ["preferences"],
            priority: 0,
            isPublic: false,
            isArchived: false,
            isShared: false,
            createdAt: new Date("2025-01-01T00:00:00Z"),
          },
        ],
      },
    },
  },
});

// Type exports for GET endpoint
export type MemoriesListRequestInput = typeof GET.types.RequestInput;
export type MemoriesListRequestOutput = typeof GET.types.RequestOutput;
export type MemoriesListResponseInput = typeof GET.types.ResponseInput;
export type MemoriesListResponseOutput = typeof GET.types.ResponseOutput;
export type MemoriesList = MemoriesListResponseOutput["memories"];

const definitions = { GET };
export default definitions;
