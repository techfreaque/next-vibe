/**
 * Characters API Definition
 * Defines endpoint for listing characters
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

import { iconSchema } from "../../../shared/types/common.schema";
import { ModelId, TOTAL_MODEL_COUNT } from "../../models/models";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import createFavoriteDefinitions from "../favorites/create/definition";
import { NO_CHARACTER_ID } from "./config";
import {
  CharacterCategory,
  CharacterCategoryDB,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "./enum";
import { scopedTranslation } from "./i18n";
import { CharactersListContainer } from "./widget";

/**
 * Get Characters List Endpoint (GET)
 * Retrieves all characters (default + custom) for the current user
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "characters"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "sparkles" as const,
  category: "app.endpointCategories.chat",
  tags: ["tags.characters" as const],

  options: {},

  fields: customWidgetObject({
    render: CharactersListContainer,
    usage: { response: true },
    children: {
      // Flattened top action buttons (no container wrapper)
      backButton: scopedBackButton(scopedTranslation, {
        usage: { response: true },
      }),

      // Flattened fields (no container wrapper)
      title: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "base",
        content: "get.browser.advancedModelAccess" as const,
        emphasis: "bold",
        inline: true,
        usage: { response: true },
      }),

      description: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        content: "get.browser.configureFiltersText" as const,
        className: "text-muted-foreground pb-4",
        usage: { response: true },
      }),
      // Flattened model fields (no container wrapper)
      icon: scopedWidgetField(scopedTranslation, {
        type: WidgetType.ICON,
        icon: "sparkles",
        containerSize: "lg",
        iconSize: "base",
        borderRadius: "xl",
        className: "text-primary bg-primary/15",
        usage: { response: true },
      }),
      name: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "base",
        content: "get.browser.configureAiModelsTitle" as const,
        emphasis: "bold",
        className: "text-primary",
        inline: true,
        usage: { response: true },
      }),
      modelDescription: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        content: "get.browser.advancedChooseText" as const,
        contentParams: { count: TOTAL_MODEL_COUNT },
        usage: { response: true },
      }),
      selectButton: scopedNavigateButtonField(scopedTranslation, {
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
        label: "get.browser.selectButton.label" as const,
        icon: "flame",
        variant: "default",
        size: "sm",
        usage: { response: true },
      }),

      separator: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SEPARATOR,
        label: "separator.or" as const,
        usage: { response: true },
      }),

      charactersTitle: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "base",
        content: "get.browser.characterPresets" as const,
        emphasis: "bold",
        inline: true,
        usage: { response: true },
      }),

      charactersDesc: scopedWidgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        content: "get.browser.pickCharacterText" as const,
        className: "text-muted-foreground pb-4",
        usage: { response: true },
      }),

      // Sections array
      sections: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: scopedObjectFieldNew(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "4",
          alignItems: "start",
          noCard: true,
          usage: { response: true },
          children: {
            // Flattened section header fields (no nested sectionHeader object)
            sectionIcon: scopedResponseField(scopedTranslation, {
              type: WidgetType.ICON,
              iconSize: "sm",
              noHover: true,
              schema: iconSchema,
            }),
            sectionTitle: scopedResponseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "lg",
              emphasis: "bold",
              schema: z.string(),
            }),
            sectionCount: scopedResponseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.number(),
            }),
            characters: scopedResponseArrayFieldNew(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: scopedObjectFieldNew(scopedTranslation, {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.INLINE,
                gap: "4",
                alignItems: "start",
                noCard: true,
                usage: { response: true },
                children: {
                  id: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.string(),
                  }),
                  category: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(CharacterCategoryDB),
                  }),
                  modelId: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(ModelId),
                  }),
                  icon: scopedResponseField(scopedTranslation, {
                    type: WidgetType.ICON,
                    containerSize: "lg",
                    iconSize: "base",
                    borderRadius: "lg",
                    schema: iconSchema,
                  }),

                  // Flattened content fields (no nested content object)
                  name: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "base",
                    emphasis: "bold",
                    inline: true,
                    schema: z.string(),
                  }),
                  tagline: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    inline: true,
                    schema: z.string(),
                  }),
                  description: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    schema: z.string(),
                  }),
                  modelIcon: scopedResponseField(scopedTranslation, {
                    type: WidgetType.ICON,
                    iconSize: "xs",
                    inline: true,
                    noHover: true,
                    schema: iconSchema,
                  }),
                  modelInfo: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    inline: true,
                    variant: "muted",
                    schema: z.string(),
                  }),
                  separator1: scopedWidgetField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    inline: true,
                    className: "hidden @sm:inline",
                    content:
                      "get.response.characters.character.separator.content" as const,
                    usage: { response: true },
                  }),
                  modelProvider: scopedResponseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    className: "hidden @sm:inline",
                    inline: true,
                    schema: z.string(),
                  }),
                  separator2: scopedWidgetField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    inline: true,
                    content:
                      "get.response.characters.character.separator.content" as const,
                    usage: { response: true },
                  }),

                  favoriteButton: scopedWidgetField(scopedTranslation, {
                    type: WidgetType.BUTTON,
                    icon: "star",
                    variant: "ghost",
                    size: "sm",
                    usage: { response: true },
                  }),
                  editButton: scopedWidgetField(scopedTranslation, {
                    type: WidgetType.BUTTON,
                    icon: "pencil",
                    variant: "ghost",
                    size: "sm",
                    usage: { response: true },
                  }),
                },
              }),
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
      listAll: {
        sections: [
          {
            sectionIcon: "robot-face",
            sectionTitle: CharacterCategory.ASSISTANT,
            sectionCount: 1,
            characters: [
              {
                id: "default",
                icon: "robot-face",
                modelId: ModelId.CLAUDE_SONNET_4_5,
                category: CharacterCategory.ASSISTANT,
                name: "characters.thea.name",
                tagline: "characters.thea.tagline",
                description: "characters.thea.description",
                modelIcon: "sparkles",
                modelInfo: "Claude Sonnet 4.5",
                modelProvider: "Anthropic",
              },
            ],
          },
          {
            sectionIcon: "code",
            sectionTitle: CharacterCategory.CODING,
            sectionCount: 1,
            characters: [
              {
                id: "550e8400-e29b-41d4-a716-446655440000",
                icon: "direct-hit",
                modelId: ModelId.GPT_5,
                category: CharacterCategory.CODING,
                name: "characters.hermes.name",
                tagline: "characters.hermes.tagline",
                description: "characters.hermes.description",
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
