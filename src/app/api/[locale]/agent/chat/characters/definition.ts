/**
 * Characters API Definition
 * Defines endpoint for listing characters
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  navigateButtonField,
  widgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  objectField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { TranslationKey } from "@/i18n/core/static-types";

import { iconSchema } from "../../../shared/types/common.schema";
import { ModelId } from "../../models/models";
import characterSingleDefinitions from "./[id]/definition";
import createCharacterDefinitions from "./create/definition";
import { CharacterCategoryDB } from "./enum";

/**
 * Get Characters List Endpoint (GET)
 * Retrieves all characters (default + custom) for the current user
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["agent", "chat", "characters"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "app.api.agent.chat.characters.get.title" as const,
  description: "app.api.agent.chat.characters.get.description" as const,
  icon: "sparkles" as const,
  category: "app.api.agent.chat.category" as const,
  tags: ["app.api.agent.chat.tags.characters" as const],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
      noCard: true,
      gap: "2",
    },
    { response: true },
    {
      // Top action buttons container
      topActions: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "2",
          className: "p-6",
          noCard: true,
        },
        { response: true },
        {
          backButton: backButton({ usage: { response: true } }),
          createButton: navigateButtonField({
            targetEndpoint: createCharacterDefinitions.POST,
            extractParams: () => ({}),
            prefillFromGet: false,
            label:
              "app.api.agent.chat.characters.get.createButton.label" as const,
            icon: "plus",
            className: "ml-auto",
            usage: { response: true },
          }),
        },
      ),

      // Sections array
      sections: responseArrayField(
        {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          className: "border-t border-border p-6 overflow-y-auto max-h-[70dvh]",
          noCard: true,
          gap: "6",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.STACKED,
            gap: "4",
            noCard: true,
          },
          { response: true },
          {
            sectionHeader: objectField(
              {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.INLINE,
                gap: "2",
                noCard: true,
              },
              { response: true },
              {
                icon: responseField({
                  type: WidgetType.ICON,
                  iconSize: "sm",
                  noHover: true,
                  schema: iconSchema,
                }),
                title: responseField({
                  type: WidgetType.TEXT,
                  size: "lg",
                  emphasis: "bold",
                  schema: z.string() as z.ZodType<TranslationKey>,
                }),
                count: responseField({
                  type: WidgetType.BADGE,

                  schema: z.number(),
                }),
              },
            ),
            characters: responseArrayField(
              {
                type: WidgetType.DATA_CARDS,
                layoutType: LayoutType.STACKED,
                columns: 1,
                spacing: "normal",
                metadata: {
                  onCardClick: {
                    targetEndpoint: characterSingleDefinitions.GET,
                    extractParams: (character: { id: string }) => ({
                      urlPathParams: { id: character.id },
                    }),
                  },
                },
              },
              objectField(
                {
                  type: WidgetType.CONTAINER,
                  layoutType: LayoutType.INLINE,
                  gap: "4",
                  alignItems: "start",
                  noCard: true,
                  className: "group relative",
                },
                { response: true },
                {
                  id: responseField({
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.string(),
                  }),
                  category: responseField({
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(CharacterCategoryDB),
                  }),
                  modelId: responseField({
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(ModelId),
                  }),
                  icon: responseField({
                    type: WidgetType.ICON,
                    containerSize: "lg",
                    iconSize: "base",
                    borderRadius: "lg",
                    schema: iconSchema,
                  }),
                  content: objectField(
                    {
                      type: WidgetType.CONTAINER,
                      layoutType: LayoutType.STACKED,
                      gap: "1",
                      noCard: true,
                    },
                    { response: true },
                    {
                      name: responseField({
                        type: WidgetType.TEXT,
                        size: "base",
                        emphasis: "bold",
                        inline: true,
                        schema: z.string() as z.ZodType<TranslationKey>,
                      }),
                      tagline: responseField({
                        type: WidgetType.TEXT,
                        size: "xs",
                        variant: "muted",
                        inline: true,
                        schema: z.string() as z.ZodType<TranslationKey>,
                      }),
                      description: responseField({
                        type: WidgetType.TEXT,
                        size: "xs",
                        variant: "muted",
                        schema: z.string() as z.ZodType<TranslationKey>,
                      }),

                      modelIcon: responseField({
                        type: WidgetType.ICON,
                        iconSize: "xs",
                        inline: true,
                        noHover: true,
                        schema: iconSchema,
                      }),
                      modelInfo: responseField({
                        type: WidgetType.TEXT,
                        size: "xs",
                        inline: true,
                        variant: "muted",
                        schema: z.string(),
                      }),
                      separator1: widgetField({
                        type: WidgetType.TEXT,
                        size: "xs",
                        variant: "muted",
                        inline: true,
                        content:
                          "app.api.agent.chat.characters.get.response.characters.character.separator.content" as const,
                        usage: { response: true },
                      }),
                      modelProvider: responseField({
                        type: WidgetType.TEXT,
                        size: "xs",
                        variant: "muted",
                        inline: true,
                        schema: z.string(),
                      }),
                      separator2: widgetField({
                        type: WidgetType.TEXT,
                        size: "xs",
                        variant: "muted",
                        inline: true,
                        content:
                          "app.api.agent.chat.characters.get.response.characters.character.separator.content" as const,
                        usage: { response: true },
                      }),
                      creditCost: responseField({
                        type: WidgetType.TEXT,
                        size: "xs",
                        variant: "muted",
                        inline: true,
                        schema: z.string(),
                      }),
                    },
                  ),
                  actions: widgetObjectField(
                    {
                      type: WidgetType.CONTAINER,
                      layoutType: LayoutType.ACTIONS,
                      noCard: true,
                    },
                    { response: true },
                    {
                      editButton: navigateButtonField({
                        targetEndpoint: characterSingleDefinitions.PATCH,
                        extractParams: (source) => ({
                          urlPathParams: { id: String(source.itemData.id) },
                        }),
                        prefillFromGet: true,
                        getEndpoint: characterSingleDefinitions.GET,
                        icon: "pencil",
                        variant: "ghost",
                        size: "sm",
                        usage: { response: true },
                      }),
                      deleteButton: navigateButtonField({
                        targetEndpoint: characterSingleDefinitions.DELETE,
                        extractParams: (source) => ({
                          urlPathParams: { id: String(source.itemData.id) },
                        }),
                        prefillFromGet: false,
                        icon: "trash",
                        variant: "ghost",
                        size: "sm",
                        renderInModal: true,
                        usage: { response: true },
                      }),
                    },
                  ),
                },
              ),
            ),
          },
        ),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.agent.chat.characters.get.errors.validation.title" as const,
      description:
        "app.api.agent.chat.characters.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.characters.get.errors.network.title" as const,
      description:
        "app.api.agent.chat.characters.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.agent.chat.characters.get.errors.unauthorized.title" as const,
      description:
        "app.api.agent.chat.characters.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.agent.chat.characters.get.errors.forbidden.title" as const,
      description:
        "app.api.agent.chat.characters.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.characters.get.errors.notFound.title" as const,
      description:
        "app.api.agent.chat.characters.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.characters.get.errors.server.title" as const,
      description:
        "app.api.agent.chat.characters.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.characters.get.errors.unknown.title" as const,
      description:
        "app.api.agent.chat.characters.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.characters.get.errors.unsavedChanges.title" as const,
      description:
        "app.api.agent.chat.characters.get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.characters.get.errors.conflict.title" as const,
      description:
        "app.api.agent.chat.characters.get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "app.api.agent.chat.characters.get.success.title" as const,
    description:
      "app.api.agent.chat.characters.get.success.description" as const,
  },

  examples: {
    responses: {
      listAll: {
        sections: [
          {
            sectionHeader: {
              title: "app.api.agent.chat.characters.enums.category.assistant",
              icon: "robot-face",
              count: 1,
            },
            characters: [
              {
                id: "default",
                icon: "robot-face",
                modelId: ModelId.CLAUDE_SONNET_4_5,
                category:
                  "app.api.agent.chat.characters.enums.category.assistant",
                content: {
                  name: "app.api.agent.chat.characters.default.name",
                  tagline: "app.api.agent.chat.characters.default.tagline",
                  description:
                    "app.api.agent.chat.characters.default.description",
                  modelIcon: "sparkles",
                  modelInfo: "Claude Sonnet 4.5",
                  modelProvider: "Anthropic",
                  creditCost: "1.5 credits",
                },
              },
            ],
          },
          {
            sectionHeader: {
              title: "app.api.agent.chat.characters.enums.category.coding",
              icon: "code",
              count: 1,
            },
            characters: [
              {
                id: "550e8400-e29b-41d4-a716-446655440000",
                icon: "direct-hit",
                modelId: ModelId.GPT_5,
                category: "app.api.agent.chat.characters.enums.category.coding",
                content: {
                  name: "app.api.agent.chat.characters.custom.name",
                  tagline: "app.api.agent.chat.characters.custom.tagline",
                  description:
                    "app.api.agent.chat.characters.custom.description",
                  modelIcon: "sparkles",
                  modelInfo: "GPT-5",
                  modelProvider: "OpenAI",
                  creditCost: "3 credits",
                },
              },
            ],
          },
        ],
      },
    },
  },
});

// Type exports for GET endpoint
export type CharacterListRequestInput = typeof GET.types.RequestInput;
export type CharacterListRequestOutput = typeof GET.types.RequestOutput;
export type CharacterListResponseInput = typeof GET.types.ResponseInput;
export type CharacterListResponseOutput = typeof GET.types.ResponseOutput;

// Individual character card type from list response
export type CharacterListItem =
  CharacterListResponseOutput["sections"][number]["characters"][number];

const charactersDefinitions = { GET } as const;
export default charactersDefinitions;
