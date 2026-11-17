/**
 * Skill Import API Definition
 * POST /vibe/agent/skills/import
 *
 * Import a character from a public Character.AI or Talkie link into a new
 * skill owned by the caller. Credits the original creator and links back to
 * the source. Idempotent per user + source: a second import of the same
 * character returns the existing skill.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  backButton,
  requestField,
  responseField,
  submitButton,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { z } from "zod";

import { SKILL_IMPORT_ALIAS } from "../constants";
import {
  SkillImportPlatform,
  SkillImportPlatformDB,
  SkillImportVisibility,
  SkillImportVisibilityDB,
  SkillImportVisibilityOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

const SkillImportContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillImportContainer })),
);

const importedFieldSchema = z.enum([
  "name",
  "avatar",
  "greeting",
  "description",
  "definition",
  "tags",
]);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "skills", "import"],
  aliases: [SKILL_IMPORT_ALIAS],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.url && typeof request.url === "string") {
      return {
        message: "post.dynamicTitle" as const,
        messageParams: { url: request.url },
      };
    }
    return undefined;
  },
  icon: "download",
  category: "ai",
  subCategory: "skillsManagement",
  tags: ["tags.skills" as const],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const skillsDefinition = await import("../definition");
        await apiClient.refetchEndpoint(
          skillsDefinition.default.GET,
          data.logger,
        );
      },
    },
  },

  fields: customWidgetObject({
    render: SkillImportContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      url: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "post.url.label" as const,
        description: "post.url.description" as const,
        placeholder: "post.url.placeholder" as const,
        columns: 12,
        schema: z
          .string()
          .trim()
          .min(5, { message: "post.url.validation.invalid" as const })
          .max(2000, { message: "post.url.validation.invalid" as const }),
      }),
      visibility: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.visibility.label" as const,
        description: "post.visibility.description" as const,
        options: SkillImportVisibilityOptions,
        columns: 12,
        schema: z
          .enum(SkillImportVisibilityDB)
          .default(SkillImportVisibility.PRIVATE),
      }),

      // === RESPONSE ===
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.id.content" as const,
        schema: z.string(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.name.content" as const,
        schema: z.string(),
      }),
      platform: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.platform.content" as const,
        schema: z.enum(SkillImportPlatformDB),
      }),
      creatorName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.creatorName.content" as const,
        schema: z.string().nullable(),
      }),
      sourceUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.sourceUrl.content" as const,
        schema: z.string(),
      }),
      avatarUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.avatarUrl.content" as const,
        hidden: true,
        schema: z.string().nullable(),
      }),
      alreadyImported: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.alreadyImported.content" as const,
        schema: z.boolean(),
      }),
      importedFields: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.importedFields.content" as const,
        hidden: true,
        schema: z.array(importedFieldSchema),
      }),

      // === BUTTONS ===
      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "download",
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

  examples: {
    requests: {
      characterAi: {
        url: "https://character.ai/character/GgU-v9j5/il-dottore",
        visibility: SkillImportVisibility.PRIVATE,
      },
      talkie: {
        url: "https://www.talkie-ai.com/chat/adrian-248871183229041",
        visibility: SkillImportVisibility.PUBLIC,
      },
    },
    responses: {
      characterAi: {
        id: "il-dottore",
        name: "Il Dottore",
        platform: SkillImportPlatform.CHARACTER_AI,
        creatorName: "L41nn",
        sourceUrl: "https://character.ai/character/GgU-v9j5",
        avatarUrl:
          "/api/en-GLOBAL/vibe/agent/chat/threads/files/00000000-0000-4000-8000-00000000a7a1/5b0c7e4a-9d2f-4c1e-8a6b-3f0d2e1c9b7a.webp",
        alreadyImported: false,
        importedFields: ["name", "avatar", "description", "definition"],
      },
      talkie: {
        id: "adrian",
        name: "Adrian 💸",
        platform: SkillImportPlatform.TALKIE,
        creatorName: "•°Elenh°•",
        sourceUrl: "https://www.talkie-ai.com/chat/adrian-248871183229041",
        avatarUrl: null,
        alreadyImported: true,
        importedFields: ["name", "avatar", "greeting", "description"],
      },
    },
  },
});

export type SkillImportPostRequestOutput = typeof POST.types.RequestOutput;
export type SkillImportPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
