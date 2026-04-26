/**
 * Skill Report API Definition
 * POST /agent/chat/skills/[id]/report
 *
 * Report a community skill for moderation. Idempotent:
 *  - One report per user per skill (unique constraint)
 *  - Increments report_count on custom_skills
 *  - Auto-hides skill (status = UNLISTED) when report_count >= threshold
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
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

import { SKILL_REPORT_ALIAS } from "../../constants";
import { scopedTranslation } from "./i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const SkillReportContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SkillReportContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "skills", "[id]", "report"],
  aliases: [SKILL_REPORT_ALIAS],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "alert-triangle",
  category: "endpointCategories.skills",
  subCategory: "endpointCategories.skillsCommunity",
  tags: ["tags.skills"],

  fields: customWidgetObject({
    render: SkillReportContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.title" as const,
        description: "post.description" as const,
        hidden: true,
        schema: z.string(),
      }),

      reason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.reason.label" as const,
        description: "post.reason.description" as const,
        placeholder: "post.reason.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(500),
      }),

      reported: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.reported" as const,
        schema: z.boolean(),
      }),

      reportCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.reportCount" as const,
        schema: z.number().int().nonnegative(),
      }),

      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data&urlPathParams" },
      }),

      submitButton: submitButton(scopedTranslation, {
        label: "post.button.submit" as const,
        loadingText: "post.button.loading" as const,
        icon: "alert-triangle",
        variant: "destructive",
        className: "ml-auto",
        usage: { request: "data&urlPathParams" },
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
    urlPathParams: {
      default: { id: "code-reviewer" },
    },
    requests: {
      default: { reason: "Harmful content" },
    },
    responses: {
      default: { reported: true, reportCount: 1 },
    },
  },
});

export const endpoints = { POST };

export type SkillReportPostResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
