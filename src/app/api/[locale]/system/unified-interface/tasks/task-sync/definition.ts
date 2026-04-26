/**
 * Task Sync API Definition
 * POST endpoint for syncing tasks between remote and local Thea instances.
 * Hash-first protocol: local sends hashes → remote diffs → returns only changes.
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
import { WidgetDataSchema } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "task-sync"],
  title: "taskSync.post.title",
  description: "taskSync.post.description",
  icon: "refresh-cw",
  category: "endpointCategories.tasks",
  subCategory: "endpointCategories.tasksSync",
  tags: ["tags.tasks" as const],
  aliases: ["sync", "task-sync"] as const,
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
      // Unified per-provider hashes: { memories: "sha256...", documents: "sha256...", ... }
      syncHashes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z
          .union([z.string(), z.record(z.string(), z.string())])
          .optional(),
      }),
      capabilitiesVersion: requestField(scopedTranslation, {
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
      taskCursor: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        schema: z.string().datetime().optional(),
      }),
      outboundTasks: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        schema: z
          .union([z.string(), z.array(z.record(z.string(), WidgetDataSchema))])
          .optional(),
      }),

      // ── Response ───────────────────────────────────────────────────────
      // Unified per-provider hashes from remote
      remoteSyncHashes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.record(z.string(), z.string()),
      }),
      // Per-provider payloads: { memories: "[...]", documents: "[...]" } — only keys that differ
      syncPayloads: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.record(z.string(), z.string()),
      }),
      // Per-provider counts: { memories: 5, documents: 0 }
      syncCounts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.record(z.string(), z.number()),
      }),
      remoteCapabilitiesVersion: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      capabilities: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      tasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      serverTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
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
        syncHashes: {
          memories: "abc123",
          documents: "def456",
          skills: "789abc",
        },
        capabilitiesVersion: "519b91e8edbf",
        taskCursor: "2026-01-01T00:00:00.000Z",
      },
    },
    responses: {
      default: {
        remoteSyncHashes: {
          memories: "xyz789",
          documents: "abc123",
          skills: "def456",
        },
        syncPayloads: {},
        syncCounts: {},
        remoteCapabilitiesVersion: "519b91e8edbf",
        capabilities: null,
        tasks: "[]",
        serverTime: "2026-01-01T00:00:00.000Z",
      },
    },
  },
});

export const endpoints = { POST };

export type SyncRequestOutput = typeof POST.types.RequestOutput;
export type SyncResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
