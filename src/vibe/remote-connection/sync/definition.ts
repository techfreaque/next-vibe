/**
 * Remote Sync API Definition
 * POST endpoint for cursor-based sync between instances.
 * Cursor-first protocol: local sends cursors → remote returns only newer records.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { REMOTE_SYNC_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "remote-connection", "sync"],
  title: "taskSync.post.title",
  titleShort: "taskSync.post.titleShort",
  description: "taskSync.post.description",
  icon: "refresh-cw",
  category: "devTools",
  subCategory: "tasksSync",
  tags: ["tags.remoteSync" as const],
  aliases: [REMOTE_SYNC_ALIAS] as const,
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // ── Request ────────────────────────────────────────────────────────
      instanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().optional(),
      }),
      // Per-domain sync cursors — { memories: { updatedAt: "..." }, threads: { threadsCursor: "...", messageCursors: {...} } }
      syncCursors: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z
          .union([z.string(), z.record(z.string(), WidgetDataSchema)])
          .optional(),
      }),
      capabilitiesVersion: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().optional(),
      }),
      senderCapabilitiesVersion: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().optional(),
      }),
      capabilitiesJson: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z
          .union([z.string(), z.array(z.record(z.string(), WidgetDataSchema))])
          .optional(),
      }),
      // Caller's records newer than its push cursors — applied before the
      // response is serialized (bidirectional push-pull in one round trip,
      // sync/spec.md → Connect-Time Push-Pull)
      pushPayloads: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z
          .union([z.string(), z.record(z.string(), z.string())])
          .optional(),
      }),

      // ── Response ───────────────────────────────────────────────────────
      // Provider payloads: { memories: "[...]", documents: "[...]" } — records newer than supplied cursor
      syncPayloads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.record(z.string(), z.string()),
      }),
      // Per-provider counts: { memories: 5, documents: 0 }
      syncCounts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.record(z.string(), z.number()),
      }),
      // Remote's current cursors — caller should store these to advance local syncCursors
      remoteCursors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.record(z.string(), WidgetDataSchema),
      }),
      remoteCapabilitiesVersion: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      capabilities: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      serverTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: dateSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "taskSync.post.errors.validation.title",
      description: "taskSync.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "taskSync.post.errors.unauthorized.title",
      description: "taskSync.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "taskSync.post.errors.internal.title",
      description: "taskSync.post.errors.internal.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "taskSync.post.errors.forbidden.title",
      description: "taskSync.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "taskSync.post.errors.notFound.title",
      description: "taskSync.post.errors.notFound.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "taskSync.post.errors.network.title",
      description: "taskSync.post.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "taskSync.post.errors.unknown.title",
      description: "taskSync.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "taskSync.post.errors.unsaved.title",
      description: "taskSync.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "taskSync.post.errors.conflict.title",
      description: "taskSync.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "taskSync.post.success.title",
    description: "taskSync.post.success.description",
  },

  examples: {
    requests: {
      default: {
        instanceId: "hermes",
        syncCursors: {
          memories: { updatedAt: "2026-01-01T00:00:00.000Z" },
          documents: { updatedAt: "2026-01-01T00:00:00.000Z" },
          skills: { updatedAt: "2026-01-01T00:00:00.000Z" },
        },
        capabilitiesVersion: "519b91e8edbf",
      },
    },
    responses: {
      default: {
        syncPayloads: {},
        syncCounts: {},
        remoteCursors: {
          memories: { updatedAt: "2026-01-02T00:00:00.000Z" },
          documents: { updatedAt: "2026-01-02T00:00:00.000Z" },
          skills: { updatedAt: "2026-01-02T00:00:00.000Z" },
        },
        remoteCapabilitiesVersion: "519b91e8edbf",
        capabilities: null,
        serverTime: "2026-01-01T00:00:00.000Z",
      },
    },
  },
});

export const endpoints = { POST } as const;

export type SyncRequestOutput = typeof POST.types.RequestOutput;
export type SyncResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
