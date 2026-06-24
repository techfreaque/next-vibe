/**
 * Create Skill API Definition
 * Defines endpoint for creating a new custom skill
 */

import { lazy } from "react";
import { z } from "zod";

import type { ChatModelSelection } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  audioVisionModelSelectionSchema,
  imageVisionModelSelectionSchema,
  videoVisionModelSelectionSchema,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { imageGenModelSelectionSchema } from "@/app/api/[locale]/agent/image-generation/models";
import { musicGenModelSelectionSchema } from "@/app/api/[locale]/agent/music-generation/models";
import { skillVariantsSchema } from "@/app/api/[locale]/agent/skills/db";
import { sttModelSelectionSchema } from "@/app/api/[locale]/agent/speech-to-text/models";
import { voiceModelSelectionSchema } from "@/app/api/[locale]/agent/text-to-speech/models";
import { videoGenModelSelectionSchema } from "@/app/api/[locale]/agent/video-generation/models";
import { apiClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { iconSchema } from "../../../shared/types/common.schema";
import { ChatModelId, getBestChatModel } from "../../ai-stream/models";
import { SKILL_CREATE_ALIAS } from "../constants";
import skillsDefinitions from "../definition";
import {
  CATEGORY_CONFIG,
  CategoryOptions,
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  PriceLevel,
  SkillCategory,
  SkillCategoryDB,
  SkillOwnershipType,
} from "../enum";
import { scopedTranslation } from "../i18n";

const SkillCreateContainer = lazy(() =>
  import("./widget").then((m) => ({ default: m.SkillCreateContainer })),
);

/**
 * Create Skill Endpoint (POST)
 * Creates a new custom skill
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "skills", "create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.name && typeof request.name === "string") {
      return {
        message: "post.dynamicTitle" as const,
        messageParams: { name: request.name },
      };
    }
    return undefined;
  },
  icon: "sparkle" as const,
  category: "ai",
  subCategory: "skillsManagement",
  tags: ["tags.skills" as const],

  aliases: [SKILL_CREATE_ALIAS],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const skillsDefinition = await import("../definition");

        // Optimistically add the new skill to the list
        const { availability } = data;
        apiClient.updateEndpointData(
          skillsDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            type SkillSection = (typeof oldData.data.sections)[number];
            type SkillListItem = SkillSection["skills"][number];

            // Find the section matching the skill's category
            const targetSection = oldData.data.sections.find((section) => {
              // Get category from first skill in section to match
              const firstChar = section.skills[0];
              return firstChar?.category === data.requestData.category;
            });

            // Get best model from the default variant
            const defaultVariant =
              data.requestData.variants?.find((v) => v.isDefault) ??
              data.requestData.variants?.[0];
            const bestModel = defaultVariant?.modelSelection
              ? getBestChatModel(
                  defaultVariant.modelSelection,
                  data.user,
                  availability,
                )
              : null;

            // Create the new skill card (only if we have a model)
            if (!bestModel) {
              return oldData;
            }

            const newSkill: SkillListItem = {
              skillId: data.responseData.id,
              icon: data.requestData.icon,
              category: data.requestData.category,
              modelId: bestModel.id,
              name: data.requestData.name,
              tagline: data.requestData.tagline,
              description: data.requestData.description,
              modelIcon: bestModel.icon,
              modelInfo: bestModel.name,
              modelProvider: bestModel.provider,
              ownershipType: SkillOwnershipType.USER,
              trustLevel: null,
              voteCount: null,
              variantName: null,
              isVariant: false,
              isDefault: false,
            };

            // Add to existing section or create new section for this category
            if (targetSection) {
              return {
                success: true,
                data: {
                  ...oldData.data,
                  sections: oldData.data.sections.map(
                    (section): SkillSection =>
                      section === targetSection
                        ? {
                            ...section,
                            skills: [newSkill, ...section.skills],
                            sectionCount: section.skills.length + 1,
                          }
                        : section,
                  ),
                },
              };
            } else {
              // Create new section for this category
              const categoryConfig = CATEGORY_CONFIG[data.requestData.category];

              const newSection: SkillSection = {
                sectionIcon: categoryConfig.icon,
                sectionTitle: categoryConfig.category,
                sectionCount: 1,
                skills: [newSkill],
              };

              return {
                success: true,
                data: {
                  ...oldData.data,
                  sections: [...oldData.data.sections, newSection],
                },
              };
            }
          },
        );
      },
    },
  },

  fields: customWidgetObject({
    render: SkillCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === RESPONSE ===
      success: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        schema: z.string(),
      }),

      name: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(2, {
            message: "post.name.validation.minLength" as const,
          })
          .max(100, {
            message: "post.name.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.name.label" as const,
        description: "post.name.description" as const,
        placeholder: "post.name.placeholder" as const,
        columns: 6,
        order: 0,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      tagline: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(2, {
            message: "post.tagline.validation.minLength" as const,
          })
          .max(500, {
            message: "post.tagline.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.tagline.label" as const,
        description: "post.tagline.description" as const,
        placeholder: "post.tagline.placeholder" as const,
        columns: 6,
        order: 1,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      icon: requestField(scopedTranslation, {
        schema: iconSchema.default("sparkles"),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ICON,
        label: "post.icon.label" as const,
        description: "post.icon.description" as const,
        columns: 6,
        order: 2,
        theme: {
          descriptionStyle: "inline",
        } as const,
      }),
      description: requestField(scopedTranslation, {
        schema: z
          .string()
          .min(10, {
            message: "post.skillDescription.validation.minLength" as const,
          })
          .max(500, {
            message: "post.skillDescription.validation.maxLength" as const,
          }),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.skillDescription.label" as const,
        description: "post.skillDescription.description" as const,
        placeholder: "post.skillDescription.placeholder" as const,
        columns: 6,
        order: 3,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      category: requestField(scopedTranslation, {
        schema: z.enum(SkillCategoryDB),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.category.label" as const,
        description: "post.category.description" as const,
        options: CategoryOptions,
        columns: 6,
        order: 4,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      isPublic: requestField(scopedTranslation, {
        schema: z.boolean(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.isPublic.label" as const,
        description: "post.isPublic.description" as const,
        columns: 6,
        order: 5,
        theme: {
          descriptionStyle: "inline",
        },
      }),

      voiceModelSelection: requestField(scopedTranslation, {
        schema: voiceModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.voice.label" as const,
        description: "post.voice.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      sttModelSelection: requestField(scopedTranslation, {
        schema: sttModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.sttModel.label" as const,
        description: "post.sttModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      imageVisionModelSelection: requestField(scopedTranslation, {
        schema: imageVisionModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.imageVisionModel.label" as const,
        description: "post.imageVisionModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      videoVisionModelSelection: requestField(scopedTranslation, {
        schema: videoVisionModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.videoVisionModel.label" as const,
        description: "post.videoVisionModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      audioVisionModelSelection: requestField(scopedTranslation, {
        schema: audioVisionModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.audioVisionModel.label" as const,
        description: "post.audioVisionModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      imageGenModelSelection: requestField(scopedTranslation, {
        schema: imageGenModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.imageGenModel.label" as const,
        description: "post.imageGenModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      musicGenModelSelection: requestField(scopedTranslation, {
        schema: musicGenModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.musicGenModel.label" as const,
        description: "post.musicGenModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      videoGenModelSelection: requestField(scopedTranslation, {
        schema: videoGenModelSelectionSchema.nullable().optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.videoGenModel.label" as const,
        description: "post.videoGenModel.description" as const,
        columns: 6,
        theme: {
          descriptionStyle: "inline",
          optionalColor: "transparent",
        },
      }),
      systemPrompt: requestField(scopedTranslation, {
        schema: z.string().nullable(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.systemPrompt.label" as const,
        description: "post.systemPrompt.description" as const,
        placeholder: "post.systemPrompt.placeholder" as const,
        columns: 12,
        order: 7,
        theme: {
          descriptionStyle: "inline",
        },
      }),
      // Named variants with per-variant model selections (optional - single default variant created automatically)
      variants: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.variants.label" as const,
        description: "post.variants.description" as const,
        hidden: true,
        schema: skillVariantsSchema.optional(),
      }),

      // Tool configuration - which tools this skill can use (null = use global settings default)
      availableTools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.availableTools.label" as const,
        description: "post.availableTools.description" as const,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable()
          .optional(),
      }),

      // Pinned tools - tools that are always shown in the toolbar for this skill
      pinnedTools: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.pinnedTools.label" as const,
        description: "post.pinnedTools.description" as const,
        schema: z
          .array(
            z.object({
              toolId: z.string(),
              requiresConfirmation: z.boolean().default(false),
            }),
          )
          .nullable()
          .optional(),
      }),

      // Auto-compacting token threshold (null = use global/settings default)
      compactTrigger: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.compactTrigger.label" as const,
        description: "post.compactTrigger.description" as const,
        columns: 6,
        schema: z.number().int().min(1000).max(200000).nullable().optional(),
      }),

      // === RESPONSE ===
      id: responseField(scopedTranslation, {
        schema: z.string(),
        type: WidgetType.TEXT,
        label: "post.response.id.content" as const,
        hidden: true,
      }),

      // === BUTTONS ===
      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.text" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "plus",
        variant: "primary",
        className: "ml-auto",
        usage: { request: "data" },
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

  // This op owns its `skill-created` event. `requestFields` carries the skill the
  // user submitted; `fields: ["id"]` adds the new id. The client onEvent rebuilds
  // the list card from the request payload and inserts it into the skills list
  // (grouped by category); remoteEvent relays the same request cross-instance,
  // where the route's onRemoteEvent re-runs create.
  events: {
    "skill-created": {
      remoteEvent: true as const,
      syncDomain: "skills" as const,
      operation: "merge" as const,
      allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
      responseFields: ["id"] as const,
      requestFields: [
        "name",
        "tagline",
        "icon",
        "description",
        "category",
        "isPublic",
        "systemPrompt",
        "variants",
        "availableTools",
        "pinnedTools",
        "compactTrigger",
      ] as const,
      onEvent: async ({ responseData, requestData, logger, locale, user }) => {
        const category = requestData.category;

        const [
          { apiClient: client },
          skillsDefinition,
          { SkillsRepositoryClient },
          { getEnvAvailability },
          { scopedTranslation: skillsScopedTranslation },
        ] = await Promise.all([
          import("@/app/api/[locale]/system/unified-interface/react/hooks/store"),
          import("../definition"),
          import("../repository-client"),
          import("../../env-availability"),
          import("../i18n"),
        ]);
        const { t } = skillsScopedTranslation.scopedT(locale);
        const defaultVariant =
          requestData.variants?.find((v) => v.isDefault) ??
          requestData.variants?.[0];
        const card = SkillsRepositoryClient.mapSkillToListItem(
          responseData.id,
          {
            icon: requestData.icon ?? null,
            name: requestData.name ?? null,
            tagline: requestData.tagline ?? null,
            description: requestData.description ?? null,
            category,
            modelSelection: defaultVariant?.modelSelection ?? null,
            ownershipType: SkillOwnershipType.USER,
            voteCount: 0,
            trustLevel: null,
          },
          t,
          user,
          getEnvAvailability(),
        );
        client.updateEndpointData(
          skillsDefinition.default.GET,
          logger,
          (old) => {
            if (!old?.success) {
              return old;
            }
            if (
              old.data.sections.some((s) =>
                s.skills.some((sk) => sk.skillId === card.skillId),
              )
            ) {
              return old;
            }
            const found = old.data.sections.some(
              (s) => s.skills[0]?.category === card.category,
            );
            return {
              ...old,
              data: {
                ...old.data,
                sections: found
                  ? old.data.sections.map((section) =>
                      section.skills[0]?.category === card.category
                        ? {
                            ...section,
                            sectionCount: section.sectionCount + 1,
                            skills: [card, ...section.skills],
                          }
                        : section,
                    )
                  : [
                      ...old.data.sections,
                      {
                        sectionIcon: card.icon,
                        sectionTitle: card.category,
                        sectionCount: 1,
                        skills: [card],
                      },
                    ],
              },
            };
          },
        );
      },
    },
  },

  examples: {
    requests: {
      // Pin a specific model: use MANUAL when you need exact model behavior
      createManual: {
        name: "Code Reviewer",
        tagline: "Expert code review and suggestions",
        description:
          "Reviews code for bugs, performance issues, and best practices",
        icon: "technologist",
        systemPrompt:
          "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",
        category: SkillCategory.CODING,
        isPublic: false,
        variants: [
          {
            id: "default",
            isDefault: true,
            modelSelection: {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: ChatModelId.GPT_5,
            },
          },
        ],
        availableTools: [
          { toolId: "execute-tool", requiresConfirmation: false },
        ],
      },
      // Filter-based: system picks best available model matching constraints
      createFilters: {
        name: "Creative Writer",
        tagline: "Compelling stories and narratives",
        description:
          "Helps with creative writing, storytelling, and imaginative content",
        icon: "pen-tool",
        systemPrompt:
          "You are a creative writing assistant. Help users craft compelling stories and narratives.",
        category: SkillCategory.CREATIVE,
        isPublic: false,
        variants: [
          {
            id: "default",
            isDefault: true,
            modelSelection: {
              selectionType: ModelSelectionType.FILTERS,
              intelligenceRange: {
                min: IntelligenceLevel.SMART,
                max: IntelligenceLevel.BRILLIANT,
              },
              priceRange: {
                min: PriceLevel.CHEAP,
                max: PriceLevel.STANDARD,
              },
              contentRange: {
                min: ContentLevel.OPEN,
                max: ContentLevel.UNCENSORED,
              },
            },
          },
        ],
      },
    },
    responses: {
      createManual: {
        success: "post.success.title",
        id: "code-reviewer",
      },
      createFilters: {
        success: "post.success.title",
        id: "research-agent",
      },
    },
  },
});

// Type exports
export type SkillCreateRequestInput = typeof POST.types.RequestInput;
export type SkillCreateRequestOutput = typeof POST.types.RequestOutput;
export type SkillCreateResponseInput = typeof POST.types.ResponseInput;
export type SkillCreateResponseOutput = typeof POST.types.ResponseOutput;

/** Inferred payload of the `skill-created` event (id from responseFields). */
export type SkillCreatedEventPayload =
  (typeof POST.types.EventResponsePayloads)["skill-created"];

// Type for filter-based model selection
export type FiltersModelSelection = Extract<
  ChatModelSelection,
  { selectionType: typeof ModelSelectionType.FILTERS }
>;
export type ManualModelSelection = Extract<
  ChatModelSelection,
  { selectionType: typeof ModelSelectionType.MANUAL }
>;

export function isFiltersSelection(
  sel: ChatModelSelection,
): sel is FiltersModelSelection {
  return sel !== null && sel.selectionType === ModelSelectionType.FILTERS;
}

export function isManualSelection(
  sel: ChatModelSelection,
): sel is ManualModelSelection {
  return sel !== null && sel.selectionType === ModelSelectionType.MANUAL;
}

const definitions = { POST } as const;
export default definitions;
