/**
 * Memories API Definition
 * Defines endpoints for managing AI memories (persistent context)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  navigateButtonField,
  objectField,
  responseArrayField,
  responseField,
  widgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { dateSchema } from "../../../shared/types/common.schema";
import createDefinition from "./create/definition";
import { MemoriesListContainer } from "./widget";

/**
 * Memory tool aliases for AI tool calling
 */
export const MEMORY_LIST_ALIAS = "memories-list" as const;

/**
 * Get Memories List Endpoint (GET)
 * Retrieves all memories for the current user or lead
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "memories"],
  aliases: [MEMORY_LIST_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "app.api.agent.chat.memories.get.title" as const,
  description: "app.api.agent.chat.memories.get.description" as const,
  icon: "brain",
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.memories" as const],

  fields: customWidgetObject({
    render: MemoriesListContainer,
    usage: { response: true } as const,
    children: {
      // Top action buttons
      backButton: backButton({ usage: { response: true } }),
      title: widgetField({
        type: WidgetType.TEXT,
        content: "app.api.agent.chat.memories.get.container.title" as const,
        usage: { response: true },
      }),
      createButton: navigateButtonField({
        targetEndpoint: createDefinition.POST,
        extractParams: () => ({}),
        prefillFromGet: false,
        label: "app.api.agent.chat.memories.get.createButton.label" as const,
        icon: "plus",
        variant: "default",
        className: "ml-auto",
        popNavigationOnSuccess: 1,
        usage: { response: true },
      }),

      // === RESPONSE ===
      memories: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          layout: {
            type: LayoutType.GRID,
            columns: 1,
          },
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            title:
              "app.api.agent.chat.memories.get.response.memories.memory.title" as const,
            layoutType: LayoutType.STACKED,
            columns: 12,
          },
          { response: true },
          {
            memoryNumber: responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.memories.get.response.memories.memory.memoryNumber.text" as const,
              schema: z.coerce.number().int(),
            }),
            content: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.memories.get.response.memories.memory.content.content" as const,
              schema: z.string(),
            }),
            priority: responseField({
              type: WidgetType.BADGE,
              text: "app.api.agent.chat.memories.get.response.memories.memory.priority.text" as const,
              schema: z.coerce.number(),
            }),
            tags: responseArrayField(
              {
                type: WidgetType.CONTAINER,
              },
              responseField({
                type: WidgetType.BADGE,
                schema: z.string(),
              }),
            ),
            createdAt: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.memories.get.response.memories.memory.createdAt.content" as const,
              schema: dateSchema,
            }),
          },
        ),
      ),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.memories.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.memories.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.memories.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.memories.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.memories.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.memories.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.memories.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.memories.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.memories.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.memories.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.memories.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.memories.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.memories.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.memories.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.memories.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.memories.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.memories.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.memories.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.memories.get.success.title" as const,
    description: "app.api.agent.chat.memories.get.success.description" as const,
  },

  examples: {
    responses: {
      list: {
        memories: [
          {
            memoryNumber: 0,
            content: "Profession: Software engineer specializing in Python",
            tags: ["profession", "skills"],
            priority: 0,
            createdAt: new Date("2025-01-01T00:00:00Z"),
          },
          {
            memoryNumber: 1,
            content: "Preferences: Dark mode, coffee over tea",
            tags: ["preferences"],
            priority: 0,
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
