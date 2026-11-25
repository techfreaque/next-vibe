/**
 * Character Card Import API Definition
 * POST /vibe/agent/skills/import/card
 *
 * Import a Character Card (V1, V2 or V3; JSON file or PNG with the card
 * embedded) from SillyTavern, Chub, RisuAI and other Tavern-format apps into a
 * new skill owned by the caller. Nothing in the card is executed. Idempotent
 * per user + card content: importing the same card again returns the
 * existing skill.
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

import { SKILL_IMPORT_CARD_ALIAS } from "../../constants";
import { SkillImportPlatform, SkillImportPlatformDB } from "../enum";
import {
  SkillCardImportVisibility,
  SkillCardImportVisibilityDB,
  SkillCardImportVisibilityOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";
import { CARD_MAX_INPUT_CHARS } from "./limits";

const SkillCardImportContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillCardImportContainer })),
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
  path: ["vibe", "agent", "skills", "import", "card"],
  aliases: [SKILL_IMPORT_CARD_ALIAS],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "upload",
  category: "ai",
  subCategory: "skillsManagement",
  tags: ["tags.skills" as const],

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const skillsDefinition = await import("../../definition");
        await apiClient.refetchEndpoint(
          skillsDefinition.default.GET,
          data.logger,
        );
      },
    },
  },

  fields: customWidgetObject({
    render: SkillCardImportContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      card: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.FILE,
        label: "post.card.label" as const,
        description: "post.card.description" as const,
        accept: ".json,.png,application/json,image/png",
        columns: 12,
        schema: z
          .string()
          .min(2, { message: "post.card.validation.required" as const })
          .max(CARD_MAX_INPUT_CHARS, {
            message: "post.card.validation.tooLarge" as const,
          }),
      }),
      visibility: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.visibility.label" as const,
        description: "post.visibility.description" as const,
        options: SkillCardImportVisibilityOptions,
        columns: 12,
        schema: z
          .enum(SkillCardImportVisibilityDB)
          .default(SkillCardImportVisibility.PRIVATE),
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
        hidden: true,
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
        hidden: true,
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
        icon: "upload",
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
      json: {
        card: '{"spec":"chara_card_v2","spec_version":"2.0","data":{"name":"Seraphina","description":"A guardian of the forest glade.","first_mes":"*You wake up in a clearing.* Easy now, you are safe here.","tags":["fantasy"],"creator":"Tavern Community"}}',
        visibility: SkillCardImportVisibility.PRIVATE,
      },
    },
    responses: {
      json: {
        id: "seraphina",
        name: "Seraphina",
        platform: SkillImportPlatform.CHARACTER_CARD,
        creatorName: "Tavern Community",
        sourceUrl: "",
        avatarUrl: null,
        alreadyImported: false,
        importedFields: ["name", "greeting", "description", "tags"],
      },
    },
  },
});

export type SkillCardImportPostRequestOutput = typeof POST.types.RequestOutput;
export type SkillCardImportPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
