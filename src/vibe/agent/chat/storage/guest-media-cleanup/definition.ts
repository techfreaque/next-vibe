/**
 * Guest Media Cleanup Endpoint Definition
 * Deletes media of guests (leads never linked to an account) from incognito
 * threads and standalone tool runs once older than the retention window.
 * Run daily by cron.
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import {
  GUEST_MEDIA_BATCH_SIZE,
  GUEST_MEDIA_RETENTION_DAYS,
} from "./constants";
import { scopedTranslation } from "./i18n";

const serverError = {
  title: "errors.server.title",
  description: "errors.server.description",
} as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "chat", "storage", "guest-media-cleanup"],
  aliases: ["guest-media-cleanup"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "tasksCron",
  icon: "trash",
  tags: ["tags.maintenance"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    description: "post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      retentionDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.retentionDays.label",
        description: "post.fields.retentionDays.description",
        columns: 4,
        schema: z.coerce
          .number()
          .int()
          .min(1)
          .max(3650)
          .default(GUEST_MEDIA_RETENTION_DAYS),
      }),
      batchSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.batchSize.label",
        description: "post.fields.batchSize.description",
        columns: 4,
        schema: z.coerce
          .number()
          .int()
          .min(1)
          .max(10000)
          .default(GUEST_MEDIA_BATCH_SIZE),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 4,
        schema: z.boolean().default(false),
      }),

      cutoff: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.cutoff",
        columns: 4,
        schema: z.string(),
      }),
      namespacesScanned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.namespacesScanned",
        columns: 4,
        schema: z.number(),
      }),
      storedThreadNamespaces: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.storedThreadNamespaces",
        columns: 4,
        schema: z.number(),
      }),
      filesScanned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.filesScanned",
        columns: 4,
        schema: z.number(),
      }),
      filesDeleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.filesDeleted",
        columns: 4,
        schema: z.number(),
      }),
      bytesDeleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.bytesDeleted",
        columns: 4,
        schema: z.number(),
      }),
      skippedTooNew: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.skippedTooNew",
        columns: 4,
        schema: z.number(),
      }),
      skippedUserOwned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.skippedUserOwned",
        columns: 4,
        schema: z.number(),
      }),
      skippedUnowned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.skippedUnowned",
        columns: 4,
        schema: z.number(),
      }),
      skippedAccountLead: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.skippedAccountLead",
        columns: 4,
        schema: z.number(),
      }),
      deferred: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.deferred",
        columns: 4,
        schema: z.number(),
      }),
      failed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.failed",
        columns: 4,
        schema: z.number(),
      }),
      executionTimeMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.executionTimeMs",
        columns: 4,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: serverError,
    [EndpointErrorTypes.FORBIDDEN]: serverError,
    [EndpointErrorTypes.SERVER_ERROR]: serverError,
    [EndpointErrorTypes.UNKNOWN_ERROR]: serverError,
    [EndpointErrorTypes.VALIDATION_FAILED]: serverError,
    [EndpointErrorTypes.NOT_FOUND]: serverError,
    [EndpointErrorTypes.CONFLICT]: serverError,
    [EndpointErrorTypes.NETWORK_ERROR]: serverError,
    [EndpointErrorTypes.UNSAVED_CHANGES]: serverError,
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        retentionDays: GUEST_MEDIA_RETENTION_DAYS,
        batchSize: GUEST_MEDIA_BATCH_SIZE,
        dryRun: true,
      },
    },
    responses: {
      default: {
        cutoff: "2026-07-16T06:00:00.000Z",
        namespacesScanned: 50,
        storedThreadNamespaces: 30,
        filesScanned: 40,
        filesDeleted: 12,
        bytesDeleted: 8_400_000,
        skippedTooNew: 6,
        skippedUserOwned: 0,
        skippedUnowned: 22,
        skippedAccountLead: 5,
        deferred: 0,
        failed: 0,
        executionTimeMs: 140,
      },
    },
  },
});

export type GuestMediaCleanupPostRequestOutput =
  typeof POST.types.RequestOutput;
export type GuestMediaCleanupPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
