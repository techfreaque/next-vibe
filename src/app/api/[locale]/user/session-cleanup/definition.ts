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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["user", "session-cleanup"],
  title: "app.api.user.sessionCleanup.post.title",
  description: "app.api.user.sessionCleanup.post.description",
  category: "app.api.user.category",
  icon: "trash",
  tags: ["app.api.user.sessionCleanup.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.sessionCleanup.post.container.title",
      description: "app.api.user.sessionCleanup.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      sessionRetentionDays: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.user.sessionCleanup.post.fields.sessionRetentionDays.label",
        description:
          "app.api.user.sessionCleanup.post.fields.sessionRetentionDays.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(365).default(30),
      }),

      tokenRetentionDays: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label:
          "app.api.user.sessionCleanup.post.fields.tokenRetentionDays.label",
        description:
          "app.api.user.sessionCleanup.post.fields.tokenRetentionDays.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(365).default(7),
      }),

      batchSize: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.user.sessionCleanup.post.fields.batchSize.label",
        description:
          "app.api.user.sessionCleanup.post.fields.batchSize.description",
        columns: 6,
        schema: z.coerce.number().min(1).max(1000).default(100),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.user.sessionCleanup.post.fields.dryRun.label",
        description:
          "app.api.user.sessionCleanup.post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      sessionsDeleted: responseField({
        type: WidgetType.TEXT,
        content: "app.api.user.sessionCleanup.post.response.sessionsDeleted",
        schema: z.number(),
      }),

      tokensDeleted: responseField({
        type: WidgetType.TEXT,
        content: "app.api.user.sessionCleanup.post.response.tokensDeleted",
        schema: z.number(),
      }),

      totalProcessed: responseField({
        type: WidgetType.TEXT,
        content: "app.api.user.sessionCleanup.post.response.totalProcessed",
        schema: z.number(),
      }),

      executionTimeMs: responseField({
        type: WidgetType.TEXT,
        content: "app.api.user.sessionCleanup.post.response.executionTimeMs",
        schema: z.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.user.sessionCleanup.post.errors.unauthorized.title",
      description:
        "app.api.user.sessionCleanup.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.user.sessionCleanup.post.errors.forbidden.title",
      description:
        "app.api.user.sessionCleanup.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.sessionCleanup.post.errors.server.title",
      description: "app.api.user.sessionCleanup.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.user.sessionCleanup.post.errors.unknown.title",
      description:
        "app.api.user.sessionCleanup.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.user.sessionCleanup.post.errors.validation.title",
      description:
        "app.api.user.sessionCleanup.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.user.sessionCleanup.post.errors.unknown.title",
      description:
        "app.api.user.sessionCleanup.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.user.sessionCleanup.post.errors.unknown.title",
      description:
        "app.api.user.sessionCleanup.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.user.sessionCleanup.post.errors.unknown.title",
      description:
        "app.api.user.sessionCleanup.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.user.sessionCleanup.post.errors.unknown.title",
      description:
        "app.api.user.sessionCleanup.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.user.sessionCleanup.post.success.title",
    description: "app.api.user.sessionCleanup.post.success.description",
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
