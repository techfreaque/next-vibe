/**
 * Memories API Definition
 * Defines endpoints for managing AI memories (persistent context)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  navigateButtonField,
  objectField,
  requestField,
  responseArrayField,
  responseField,
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
  category: "endpointCategories.memories",
  subCategory: "endpointCategories.memoriesManagement",
  tags: ["tags.memories" as const],

  fields: customWidgetObject({
    render: MemoriesListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      search: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.search.label" as const,
        description: "get.fields.search.description" as const,
        placeholder: "get.fields.search.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      tag: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.tag.label" as const,
        description: "get.fields.tag.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),

      // Top action buttons
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      title: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.container.title" as const,
        usage: { response: true },
      }),
      createButton: navigateButtonField(scopedTranslation, {
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
      memories: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layout: {
          type: LayoutType.GRID,
          columns: 1,
        },
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          title: "get.response.memories.memory.title" as const,
          layoutType: LayoutType.STACKED,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.memoryNumber.text" as const,
              schema: z.coerce.number().int(),
            }),
            content: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.memories.memory.content.content" as const,
              schema: z.string(),
            }),
            priority: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.priority.text" as const,
              schema: z.coerce.number(),
            }),
            isPublic: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.isPublic.text" as const,
              schema: z.boolean(),
            }),
            isArchived: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.isArchived.text" as const,
              schema: z.boolean(),
            }),
            isShared: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.memories.memory.isShared.text" as const,
              schema: z.boolean(),
            }),
            tags: responseArrayField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                schema: z.string(),
              }),
            }),
            createdAt: responseField(scopedTranslation, {
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

  // === WS EVENTS ===
  // Emitted by MemoriesRepository after every mutation — keeps all open tabs in sync.
  events: {
    "memory-created": {
      fields: {
        memories: [
          "id",
          "content",
          "tags",
          "priority",
          "isPublic",
          "isArchived",
          "isShared",
          "createdAt",
        ] as const,
      },
      operation: "merge" as const,
    },
    "memory-updated": {
      fields: {
        memories: [
          "id",
          "content",
          "tags",
          "priority",
          "isPublic",
          "isArchived",
          "isShared",
        ] as const,
      },
      operation: "merge" as const,
    },
    "memory-deleted": {
      fields: { memories: ["id"] as const },
      operation: "remove" as const,
    },
  },

  examples: {
    requests: {
      default: {},
      search: { search: "python" },
      tagFilter: { tag: "skills" },
    },
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
