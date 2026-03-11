/**
 * Session Cleanup API Definition
 * POST endpoint to clean up expired sessions and tokens (called by cron)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
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

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "session-cleanup"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.userAuth",
  icon: "trash",
  tags: ["post.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      sessionRetentionDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.sessionRetentionDays.label",
        description: "post.fields.sessionRetentionDays.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(365).default(30),
      }),

      tokenRetentionDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.tokenRetentionDays.label",
        description: "post.fields.tokenRetentionDays.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(365).default(7),
      }),

      batchSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.batchSize.label",
        description: "post.fields.batchSize.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(1000).default(100),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      sessionsDeleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.sessionsDeleted",
        schema: z.number(),
      }),

      tokensDeleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.tokensDeleted",
        schema: z.number(),
      }),

      totalProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.totalProcessed",
        schema: z.number(),
      }),

      executionTimeMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.executionTimeMs",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        sessionRetentionDays: 30,
        tokenRetentionDays: 7,
        batchSize: 100,
        dryRun: false,
      },
    },
    responses: {
      default: {
        sessionsDeleted: 0,
        tokensDeleted: 0,
        totalProcessed: 0,
        executionTimeMs: 0,
      },
    },
  },
});

export type SessionCleanupPostRequestOutput = typeof POST.types.RequestOutput;
export type SessionCleanupPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
