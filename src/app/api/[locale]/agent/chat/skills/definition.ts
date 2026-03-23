/**
 * Skills API Definition
 * Defines endpoint for listing skills
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
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

import { iconSchema } from "../../../shared/types/common.schema";
import { ModelId, TOTAL_MODEL_COUNT } from "../../models/models";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import createFavoriteDefinitions from "../favorites/create/definition";
import { NO_SKILL_ID, SKILLS_LIST_ALIAS } from "./constants";
import {
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillCategoryDB,
  SkillOwnershipTypeDB,
  SkillTrustLevelDB,
} from "./enum";
import { scopedTranslation } from "./i18n";
import { SkillsListContainer } from "./widget";

/**
 * Get Skills List Endpoint (GET)
 * Retrieves all skills (default + custom) for the current user
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "skills"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  dynamicTitle: ({ response }) => {
    if (response?.sections) {
      const count = response.sections.reduce(
        (sum, s) => sum + (s.skills?.length ?? 0),
        0,
      );
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { count },
      };
    }
    return undefined;
  },
  icon: "sparkles" as const,
  category: "app.endpointCategories.chatSkills",
  tags: ["tags.skills" as const],

  options: {},

  aliases: [SKILLS_LIST_ALIAS],

  cli: {
    firstCliArgKey: "query",
  },

  fields: customWidgetObject({
    render: SkillsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS (for AI/CLI filtering) ===
      query: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.query.label" as const,
        description: "get.fields.query.description" as const,
        placeholder: "get.fields.query.placeholder" as const,
        columns: 8,
        schema: z.string().optional(),
      }),
      skillId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.skillId.label" as const,
        description: "get.fields.skillId.description" as const,
        columns: 4,
        schema: z.string().optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.page.label" as const,
        description: "get.fields.page.description" as const,
        columns: 4,
        schema: z.number().int().min(1).optional(),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.pageSize.label" as const,
        description: "get.fields.pageSize.description" as const,
        columns: 4,
        schema: z.number().int().min(1).max(500).optional(),
      }),

      // Flattened top action buttons (no container wrapper)
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),

      // Flattened fields (no container wrapper)
      title: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "base",
        content: "get.browser.advancedModelAccess" as const,
        emphasis: "bold",
        inline: true,
        usage: { response: true },
      }),

      description: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        content: "get.browser.configureFiltersText" as const,
        className: "text-muted-foreground pb-4",
        usage: { response: true },
      }),
      // Flattened model fields (no container wrapper)
      icon: widgetField(scopedTranslation, {
        type: WidgetType.ICON,
        icon: "sparkles",
        containerSize: "lg",
        iconSize: "base",
        borderRadius: "xl",
        className: "text-primary bg-primary/15",
        usage: { response: true },
      }),
      name: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "base",
        content: "get.browser.configureAiModelsTitle" as const,
        emphasis: "bold",
        className: "text-primary",
        inline: true,
        usage: { response: true },
      }),
      modelDescription: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        content: "get.browser.advancedChooseText" as const,
        contentParams: { count: TOTAL_MODEL_COUNT },
        usage: { response: true },
      }),
      selectButton: navigateButtonField(scopedTranslation, {
        targetEndpoint: createFavoriteDefinitions.POST,
        extractParams: async () => {
          return {
            data: {
              skillId: NO_SKILL_ID,
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

      separator: widgetField(scopedTranslation, {
        type: WidgetType.SEPARATOR,
        label: "separator.or" as const,
        usage: { response: true },
      }),

      skillsTitle: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "base",
        content: "get.browser.skillPresets" as const,
        emphasis: "bold",
        inline: true,
        usage: { response: true },
      }),

      skillsDesc: widgetField(scopedTranslation, {
        type: WidgetType.TEXT,
        size: "xs",
        variant: "muted",
        content: "get.browser.pickSkillText" as const,
        className: "text-muted-foreground pb-4",
        usage: { response: true },
      }),

      // Pagination metadata (AI/MCP platform only - null for human callers)
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
      matchedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nullable(),
      }),
      hint: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),

      // Sections array
      sections: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "4",
          alignItems: "start",
          noCard: true,
          usage: { response: true },
          children: {
            // Flattened section header fields (no nested sectionHeader object)
            sectionIcon: responseField(scopedTranslation, {
              type: WidgetType.ICON,
              iconSize: "sm",
              noHover: true,
              schema: iconSchema,
            }),
            sectionTitle: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "lg",
              emphasis: "bold",
              schema: z.string(),
            }),
            sectionCount: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.number(),
            }),
            skills: responseArrayField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: objectField(scopedTranslation, {
                type: WidgetType.CONTAINER,
                layoutType: LayoutType.INLINE,
                gap: "4",
                alignItems: "start",
                noCard: true,
                usage: { response: true },
                children: {
                  id: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.string(),
                  }),
                  category: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(SkillCategoryDB),
                  }),
                  modelId: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(ModelId),
                  }),
                  icon: responseField(scopedTranslation, {
                    type: WidgetType.ICON,
                    containerSize: "lg",
                    iconSize: "base",
                    borderRadius: "lg",
                    schema: iconSchema,
                  }),

                  // Flattened content fields (no nested content object)
                  name: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "base",
                    emphasis: "bold",
                    inline: true,
                    schema: z.string(),
                  }),
                  tagline: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    inline: true,
                    schema: z.string(),
                  }),
                  description: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    schema: z.string(),
                  }),
                  modelIcon: responseField(scopedTranslation, {
                    type: WidgetType.ICON,
                    iconSize: "xs",
                    inline: true,
                    noHover: true,
                    schema: iconSchema,
                  }),
                  modelInfo: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    inline: true,
                    variant: "muted",
                    schema: z.string(),
                  }),
                  separator1: widgetField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    inline: true,
                    className: "hidden @sm:inline",
                    content:
                      "get.response.skills.skill.separator.content" as const,
                    usage: { response: true },
                  }),
                  modelProvider: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    className: "hidden @sm:inline",
                    inline: true,
                    schema: z.string(),
                  }),
                  ownershipType: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(SkillOwnershipTypeDB),
                  }),
                  trustLevel: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(SkillTrustLevelDB).nullable(),
                  }),
                  voteCount: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.number().int().nonnegative().nullable(),
                  }),
                  separator2: widgetField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    size: "xs",
                    variant: "muted",
                    inline: true,
                    content:
                      "get.response.skills.skill.separator.content" as const,
                    usage: { response: true },
                  }),

                  favoriteButton: widgetField(scopedTranslation, {
                    type: WidgetType.BUTTON,
                    icon: "star",
                    variant: "ghost",
                    size: "sm",
                    usage: { response: true },
                  }),
                  editButton: widgetField(scopedTranslation, {
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
    requests: {
      listAll: {},
      search: { query: "coding" },
      detail: { skillId: "research-agent" },
    },
    responses: {
      listAll: {
        totalCount: null,
        matchedCount: null,
        currentPage: null,
        totalPages: null,
        hint: null,
        sections: [
          {
            sectionIcon: "robot-face",
            sectionTitle: SkillCategory.ASSISTANT,
            sectionCount: 1,
            skills: [
              {
                id: "default",
                icon: "robot-face",
                modelId: ModelId.CLAUDE_SONNET_4_5,
                category: SkillCategory.ASSISTANT,
                name: "skills.thea.name",
                tagline: "skills.thea.tagline",
                description: "skills.thea.description",
                modelIcon: "sparkles",
                modelInfo: "Claude Sonnet 4.5",
                modelProvider: "Anthropic",
                ownershipType: SkillOwnershipTypeDB[0],
                trustLevel: null,
                voteCount: null,
              },
            ],
          },
          {
            sectionIcon: "code",
            sectionTitle: SkillCategory.CODING,
            sectionCount: 1,
            skills: [
              {
                id: "550e8400-e29b-41d4-a716-446655440000",
                icon: "direct-hit",
                modelId: ModelId.GPT_5,
                category: SkillCategory.CODING,
                name: "skills.hermes.name",
                tagline: "skills.hermes.tagline",
                description: "skills.hermes.description",
                modelIcon: "sparkles",
                modelInfo: "GPT-5",
                modelProvider: "OpenAI",
                ownershipType: SkillOwnershipTypeDB[2],
                trustLevel: SkillTrustLevelDB[1],
                voteCount: 42,
              },
            ],
          },
        ],
      },
    },
  },
});

// Type exports for GET endpoint
export type SkillListRequestInput = typeof GET.types.RequestInput;
export type SkillListRequestOutput = typeof GET.types.RequestOutput;
export type SkillListResponseInput = typeof GET.types.ResponseInput;
export type SkillListResponseOutput = typeof GET.types.ResponseOutput;

// Individual skill card type from list response
export type SkillListItem =
  SkillListResponseOutput["sections"][number]["skills"][number];
export type SkillListSections = SkillListResponseOutput["sections"];

const skillsDefinitions = { GET } as const;
export default skillsDefinitions;
