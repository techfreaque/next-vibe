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

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { iconSchema } from "../../../shared/types/common.schema";
import { allModelDefinitions } from "../../models/all-models";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import createFavoriteDefinitions from "../favorites/create/definition";
import { NO_SKILL_ID, SKILLS_LIST_ALIAS } from "./constants";
import {
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillCategoryDB,
  SkillOwnershipTypeDB,
  SkillSourceFilter,
  SkillSourceFilterDB,
  SkillTrustLevelDB,
} from "./enum";

import { scopedTranslation } from "./i18n";

const SkillsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillsListContainer })),
);

/**
 * Standalone skill item zod schema — shared between the sections[].skills
 * response field and the wsEvent discriminated union (to avoid circular type inference).
 */
const skillItemSchema = z.object({
  /** Skill ID in merged format: "skillSlug" or "skillSlug__variantId" for a specific variant */
  skillId: z.string(),
  category: z.enum(SkillCategoryDB),
  variantName: z.string().nullable(),
  isVariant: z.boolean(),
  isDefault: z.boolean(),
  modelId: z.enum(ChatModelId).nullable(),
  icon: iconSchema,
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  modelIcon: iconSchema,
  modelInfo: z.string(),
  modelProvider: z.string(),
  ownershipType: z.enum(SkillOwnershipTypeDB),
  trustLevel: z.enum(SkillTrustLevelDB).nullable(),
  voteCount: z.number().int().nonnegative().nullable(),
});

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
  category: "endpointCategories.skills",
  subCategory: "endpointCategories.skillsManagement",
  tags: ["tags.skills" as const],

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 250,
    },
  },

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
      sourceFilter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.fields.sourceFilter.label" as const,
        description: "get.fields.sourceFilter.description" as const,
        columns: 4,
        schema: z.enum(SkillSourceFilterDB).default(SkillSourceFilter.BUILT_IN),
        hidden: true,
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
        contentParams: {
          count: allModelDefinitions.filter((def) =>
            def.providers.some((p) => !p.adminOnly),
          ).length,
        },
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
              voiceId: DEFAULT_TTS_VOICE_ID,
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
      wsEvent: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z
          .discriminatedUnion("type", [
            z.object({
              type: z.literal("created"),
              item: skillItemSchema,
              category: z.enum(SkillCategoryDB),
            }),
            z.object({
              type: z.literal("updated"),
              skillId: z.string(),
              name: z.string().optional(),
              icon: iconSchema.optional(),
              tagline: z.string().optional(),
              ownershipType: z.enum(SkillOwnershipTypeDB).optional(),
              voteCount: z.number().int().nonnegative().nullable().optional(),
              trustLevel: z.enum(SkillTrustLevelDB).nullable().optional(),
            }),
            z.object({
              type: z.literal("deleted"),
              skillId: z.string(),
            }),
          ])
          .nullable(),
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
                  skillId: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.string(),
                  }),
                  category: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(SkillCategoryDB),
                  }),
                  variantName: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.string().nullable(),
                  }),
                  /** True for variant sub-rows; false/absent for standalone skill cards */
                  isVariant: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.boolean(),
                  }),
                  /** True if this variant is the default selection for the skill */
                  isDefault: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.boolean(),
                  }),
                  modelId: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    hidden: true,
                    schema: z.enum(ChatModelId).nullable(),
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

  // === WS EVENTS ===
  // Emitted by SkillsRepository after every mutation — keeps all open tabs in sync.
  // hint carries a JSON payload with the data needed to update the nested
  // sections[].skills[] cache directly without a round-trip to the server.
  events: {
    "skill-created": {
      fields: ["wsEvent"] as const,
      operation: "merge" as const,
      onEvent: async ({ partial, logger }) => {
        if (partial.wsEvent?.type !== "created") {
          return;
        }
        const { item: newSkill, category } = partial.wsEvent;
        const [{ apiClient }, def] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("./definition"),
        ]);
        apiClient.updateEndpointData(def.default.GET, logger, (old) => {
          if (!old?.success) {
            return old;
          }
          const found = old.data.sections.some(
            (s) => s.skills[0]?.category === category,
          );
          return {
            ...old,
            data: {
              ...old.data,
              wsEvent: null,
              sections: found
                ? old.data.sections.map((section) =>
                    section.skills[0]?.category === category
                      ? {
                          ...section,
                          sectionCount: section.sectionCount + 1,
                          skills: [newSkill, ...section.skills],
                        }
                      : section,
                  )
                : [
                    ...old.data.sections,
                    {
                      sectionIcon: newSkill.icon,
                      sectionTitle: newSkill.category,
                      sectionCount: 1,
                      skills: [newSkill],
                    },
                  ],
            },
          };
        });
      },
    },
    "skill-updated": {
      fields: ["wsEvent"] as const,
      operation: "merge" as const,
      onEvent: async ({ partial, logger }) => {
        if (partial.wsEvent?.type !== "updated") {
          return;
        }
        const update = partial.wsEvent;
        const [{ apiClient }, def] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("./definition"),
        ]);
        apiClient.updateEndpointData(def.default.GET, logger, (old) => {
          if (!old?.success) {
            return old;
          }
          return {
            ...old,
            data: {
              ...old.data,
              wsEvent: null,
              sections: old.data.sections.map((section) => ({
                ...section,
                skills: section.skills.map((skill) =>
                  skill.skillId === update.skillId
                    ? { ...skill, ...update }
                    : skill,
                ),
              })),
            },
          };
        });
      },
    },
    "skill-deleted": {
      fields: ["wsEvent"] as const,
      operation: "merge" as const,
      onEvent: async ({ partial, logger }) => {
        if (partial.wsEvent?.type !== "deleted") {
          return;
        }
        const { skillId } = partial.wsEvent;
        const [{ apiClient }, def] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("./definition"),
        ]);
        apiClient.updateEndpointData(def.default.GET, logger, (old) => {
          if (!old?.success) {
            return old;
          }
          return {
            ...old,
            data: {
              ...old.data,
              wsEvent: null,
              sections: old.data.sections
                .map((section) => ({
                  ...section,
                  sectionCount: section.skills.some(
                    (s) => s.skillId === skillId,
                  )
                    ? section.sectionCount - 1
                    : section.sectionCount,
                  skills: section.skills.filter((s) => s.skillId !== skillId),
                }))
                .filter((section) => section.skills.length > 0),
            },
          };
        });
      },
    },
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
        wsEvent: null,
        sections: [
          {
            sectionIcon: "robot-face",
            sectionTitle: SkillCategory.ASSISTANT,
            sectionCount: 1,
            skills: [
              {
                skillId: "default",
                icon: "robot-face",
                modelId: ChatModelId.CLAUDE_SONNET_4_5,
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
                variantName: null,
                isVariant: false,
                isDefault: false,
              },
            ],
          },
          {
            sectionIcon: "code",
            sectionTitle: SkillCategory.CODING,
            sectionCount: 1,
            skills: [
              {
                skillId: "hermes-code-reviewer",
                icon: "direct-hit",
                modelId: ChatModelId.GPT_5,
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
                variantName: null,
                isVariant: false,
                isDefault: false,
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
