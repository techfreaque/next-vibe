/**
 * Skill Export API Definition
 * GET /vibe/agent/skills/[id]/export
 *
 * Export a skill as a Character Card V2 JSON file that SillyTavern, RisuAI,
 * Chub and other Tavern-format apps import. Works for any skill the caller
 * can open: their own, public community skills, public built-in skills.
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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { SKILL_EXPORT_ALIAS } from "../../constants";
import { scopedTranslation } from "./i18n";

const SkillExportContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillExportContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "skills", "[id]", "export"],
  aliases: [SKILL_EXPORT_ALIAS],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PUBLIC] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  dynamicTitle: ({ response }) => {
    if (response?.name && typeof response.name === "string") {
      return {
        message: "get.dynamicTitle" as const,
        messageParams: { name: response.name },
      };
    }
    return undefined;
  },
  icon: "download",
  category: "ai",
  subCategory: "skillsManagement",
  tags: ["tags.skills" as const],

  fields: customWidgetObject({
    render: SkillExportContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("../../definition")).default.GET,
        labelField: "name",
        label: "get.id.label" as const,
        description: "get.id.description" as const,
        schema: z.string(),
      }),

      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.name.content" as const,
        schema: z.string(),
      }),
      fileName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.fileName.content" as const,
        schema: z.string(),
      }),
      card: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.card.content" as const,
        schema: z.string(),
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
    urlPathParams: {
      default: { id: "storyteller" },
    },
    responses: {
      default: {
        name: "Storyteller",
        fileName: "storyteller.card.json",
        card: '{"spec":"chara_card_v2","spec_version":"2.0","data":{"name":"Storyteller"}}',
      },
    },
  },
});

export type SkillExportGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
