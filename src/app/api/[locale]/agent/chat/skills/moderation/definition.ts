/**
 * Skill Moderation API Definition
 * GET  /agent/chat/skills/moderation — list skills with reports (admin only)
 * PATCH /agent/chat/skills/moderation — hide or clear reports on a skill (admin only)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SKILL_MODERATION_ALIAS } from "../constants";
import { SkillStatus, SkillStatusDB } from "../enum";
import { scopedTranslation } from "./i18n";
import { SkillModerationContainer } from "./widget";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["agent", "chat", "skills", "moderation"],
  aliases: [SKILL_MODERATION_ALIAS],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "shield",
  category: "app.endpointCategories.ai",
  tags: ["tags.moderation" as const],

  fields: customWidgetObject({
    render: SkillModerationContainer,
    usage: { request: "data", response: true } as const,
    children: {
      minReports: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.minReports.label" as const,
        description: "get.fields.minReports.description" as const,
        columns: 4,
        schema: z.number().int().min(0).optional(),
      }),
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.limit.label" as const,
        description: "get.fields.limit.description" as const,
        columns: 4,
        schema: z.number().int().min(1).max(200).optional(),
      }),
      offset: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.fields.offset.label" as const,
        description: "get.fields.offset.description" as const,
        columns: 4,
        schema: z.number().int().min(0).optional(),
      }),

      skills: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          noCard: true,
          usage: { response: true } as const,
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "base",
              emphasis: "bold",
              schema: z.string(),
            }),
            ownerAuthorId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().uuid(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.enum(SkillStatusDB).nullable(),
            }),
            reportCount: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.number().int().nonnegative(),
            }),
            voteCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              schema: z.number().int().nonnegative(),
            }),
            trustLevel: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().nullable(),
            }),
            publishedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().datetime().nullable(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().datetime(),
            }),
          },
        }),
      }),
      totalCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.number().int().nonnegative(),
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
      default: { minReports: 1, limit: 50, offset: 0 },
    },
    responses: {
      default: {
        skills: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Example Skill",
            ownerAuthorId: "660e8400-e29b-41d4-a716-446655440001",
            status: SkillStatus.PUBLISHED,
            reportCount: 3,
            voteCount: 12,
            trustLevel: null,
            publishedAt: "2026-03-10T10:00:00.000Z",
            updatedAt: "2026-03-15T12:00:00.000Z",
          },
        ],
        totalCount: 1,
      },
    },
  },
});

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["agent", "chat", "skills", "moderation"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "shield",
  category: "app.endpointCategories.ai",
  tags: ["tags.moderation" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    noCard: true,
    usage: { request: "data", response: true } as const,
    children: {
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "patch.fields.id.label" as const,
        description: "patch.fields.id.description" as const,
        columns: 12,
        schema: z.string().uuid(),
      }),
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.fields.action.label" as const,
        description: "patch.fields.action.description" as const,
        options: [
          { value: "hide", label: "patch.fields.action.label" as const },
          { value: "clear", label: "patch.fields.action.label" as const },
        ],
        columns: 6,
        schema: z.enum(["hide", "clear"]),
      }),

      patchId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().uuid(),
      }),
      patchStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.enum(SkillStatusDB).nullable(),
      }),
      patchReportCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number().int().nonnegative(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        action: "hide" as const,
      },
    },
    responses: {
      default: {
        patchId: "550e8400-e29b-41d4-a716-446655440000",
        patchStatus: SkillStatus.UNLISTED,
        patchReportCount: 3,
      },
    },
  },
});

export const endpoints = { GET, PATCH };

export type SkillModerationGetResponseOutput = typeof GET.types.ResponseOutput;
export type SkillModerationPatchResponseOutput =
  typeof PATCH.types.ResponseOutput;

export default endpoints;
