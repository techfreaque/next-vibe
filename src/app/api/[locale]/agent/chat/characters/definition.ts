/**
 * Characters API Definition
 * Defines endpoint for listing characters
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  navigateButtonField,
  widgetField,
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
import { ModelId, TOTAL_MODEL_COUNT } from "../../models/models";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import createFavoriteDefinitions from "../favorites/create/definition";
import { NO_CHARACTER_ID } from "./config";
import {
  CharacterCategoryDB,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "./enum";
import { CharactersListContainer } from "./widget";

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

  options: {},

  fields: customWidgetObject({
    render: CharactersListContainer,
    usage: { response: true },
    children: {
      // Flattened top action buttons (no container wrapper)
      backButton: backButton({
        usage: { response: true },
      }),

      // Flattened fields (no container wrapper)
      title: widgetField({
        type: WidgetType.TEXT,
        size: "base",
        content:
          "app.api.agent.chat.characters.get.browser.advancedModelAccess" as const,
        emphasis: "bold",
        inline: true,
        usage: { response: true },
      }),

      description: widgetField({
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        content:
          "app.api.agent.chat.characters.get.browser.configureFiltersText" as const,
        className: "text-muted-foreground pb-4",
        usage: { response: true },
      }),
      // Flattened model fields (no container wrapper)
      icon: widgetField({
        type: WidgetType.ICON,
        icon: "sparkles",
        containerSize: "lg",
        iconSize: "base",
        borderRadius: "xl",
        className: "text-primary bg-primary/15",
        usage: { response: true },
      }),
      name: widgetField({
        type: WidgetType.TEXT,
        size: "base",
        content:
          "app.api.agent.chat.characters.get.browser.configureAiModelsTitle" as const,
        emphasis: "bold",
        className: "text-primary",
        inline: true,
        usage: { response: true },
      }),
      modelDescription: widgetField({
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        content:
          "app.api.agent.chat.characters.get.browser.advancedChooseText" as const,
        contentParams: { count: TOTAL_MODEL_COUNT },
        usage: { response: true },
      }),
      selectButton: navigateButtonField({
        targetEndpoint: createFavoriteDefinitions.POST,
        extractParams: async () => {
          return {
            data: {
              characterId: NO_CHARACTER_ID,
              icon: undefined,
              name: undefined,
              tagline: undefined,
              description: undefined,
              voice: DEFAULT_TTS_VOICE,
              modelSelection: {
                selectionType: ModelSelectionType.FILTERS,
                sortBy: ModelSortField.CONTENT,
                sortDirection: ModelSortDirection.DESC,
              },
            },
          };
        },
        popNavigationOnSuccess: 1,
        label:
          "app.api.agent.chat.characters.get.browser.selectButton.label" as const,
        icon: "flame",
        variant: "default",
        size: "sm",
        usage: { response: true },
      }),

      separator: widgetField({
        type: WidgetType.SEPARATOR,
        label: "app.api.agent.chat.characters.separator.or" as const,
        usage: { response: true },
      }),

      charactersTitle: widgetField({
        type: WidgetType.TEXT,
        size: "base",
        content:
          "app.api.agent.chat.characters.get.browser.characterPresets" as const,
        emphasis: "bold",
        inline: true,
        usage: { response: true },
      }),

      charactersDesc: widgetField({
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        content:
          "app.api.agent.chat.characters.get.browser.pickCharacterText" as const,
        className: "text-muted-foreground pb-4",
        usage: { response: true },
      }),

      // Sections array
      sections: responseArrayField(
        { type: WidgetType.CONTAINER },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.INLINE,
            gap: "4",
            alignItems: "start",
            noCard: true,
          },
          { response: true },
          {
            // Flattened section header fields (no nested sectionHeader object)
            sectionIcon: responseField({
              type: WidgetType.ICON,
              iconSize: "sm",
              noHover: true,
              schema: iconSchema,
            }),
            sectionTitle: responseField({
              type: WidgetType.TEXT,
              size: "lg",
              emphasis: "bold",
              schema: z.string() as z.ZodType<TranslationKey>,
            }),
            sectionCount: responseField({
              type: WidgetType.BADGE,
              schema: z.number(),
            }),
            characters: responseArrayField(
              { type: WidgetType.CONTAINER },
              objectField(
                {
                  type: WidgetType.CONTAINER,
                  layoutType: LayoutType.INLINE,
                  gap: "4",
                  alignItems: "start",
                  noCard: true,
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

                  // Flattened content fields (no nested content object)
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
                    className: "hidden @sm:inline",
                    content:
                      "app.api.agent.chat.characters.get.response.characters.character.separator.content" as const,
                    usage: { response: true },
                  }),
                  modelProvider: responseField({
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    className: "hidden @sm:inline",
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

                  favoriteButton: widgetField({
                    type: WidgetType.BUTTON,
                    icon: "star",
                    variant: "ghost",
                    size: "sm",
                    usage: { response: true },
                  }),
                  editButton: widgetField({
                    type: WidgetType.BUTTON,
                    icon: "pencil",
                    variant: "ghost",
                    size: "sm",
                    usage: { response: true },
                  }),
                },
              ),
            ),
          },
        ),
      ),
    },
  }),

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
            sectionIcon: "robot-face",
            sectionTitle:
              "app.api.agent.chat.characters.enums.category.assistant",
            sectionCount: 1,
            characters: [
              {
                id: "default",
                icon: "robot-face",
                modelId: ModelId.CLAUDE_SONNET_4_5,
                category:
                  "app.api.agent.chat.characters.enums.category.assistant",
                name: "app.api.agent.chat.characters.default.name",
                tagline: "app.api.agent.chat.characters.default.tagline",
                description:
                  "app.api.agent.chat.characters.default.description",
                modelIcon: "sparkles",
                modelInfo: "Claude Sonnet 4.5",
                modelProvider: "Anthropic",
              },
            ],
          },
          {
            sectionIcon: "code",
            sectionTitle: "app.api.agent.chat.characters.enums.category.coding",
            sectionCount: 1,
            characters: [
              {
                id: "550e8400-e29b-41d4-a716-446655440000",
                icon: "direct-hit",
                modelId: ModelId.GPT_5,
                category: "app.api.agent.chat.characters.enums.category.coding",
                name: "app.api.agent.chat.characters.custom.name",
                tagline: "app.api.agent.chat.characters.custom.tagline",
                description: "app.api.agent.chat.characters.custom.description",
                modelIcon: "sparkles",
                modelInfo: "GPT-5",
                modelProvider: "OpenAI",
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
