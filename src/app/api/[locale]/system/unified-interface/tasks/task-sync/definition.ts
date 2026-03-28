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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "unified-interface", "tasks", "task-sync"],
  title: "taskSync.post.title",
  description: "taskSync.post.description",
  icon: "refresh-cw",
  category: "endpointCategories.systemTasks",
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
      // ── Request: hashes local sends so remote can diff ──────────────────
      instanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        // The local instance's instanceId - used to look up the connection record on cloud
        schema: z.string().optional(),
      }),
      memoriesHash: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        // SHA256 of sorted "syncId:updatedAt" pairs for local shared memories
        schema: z.string().optional(),
      }),
      capabilitiesVersion: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        // Build version string (git SHA or package version) - changes only on deploy
        schema: z.string().optional(),
      }),
      capabilitiesJson: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        // Full capability snapshot - only sent when capabilitiesVersion changed
        schema: z.union([z.string(), z.array(z.any())]).optional(),
      }),
      taskCursor: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        columns: 12,
        // ISO timestamp - return REMOTE_TOOL_CALL tasks created after this
        schema: z.string().datetime().optional(),
      }),
      outboundTasks: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        columns: 12,
        // Tasks this local instance wants the remote to execute (JSON string or array).
        // The request parser auto-deserialises JSON-looking strings, so accept both.
        // Used for dev→cloud execution: dev creates a task targeting cloud's instanceId,
        // then sends it here so cloud's pulse can pick it up.
        schema: z.union([z.string(), z.array(z.any())]).optional(),
      }),

      // ── Response: remote returns only what local is missing ─────────────
      remoteMemoriesHash: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        // Remote's current hash - local stores for next diff
        schema: z.string(),
      }),
      memories: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        // Full memory records as JSON string - null if hashes matched
        schema: z.string().nullable(),
      }),
      remoteCapabilitiesVersion: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      capabilities: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        // Full capability snapshot as JSON string - null if versions matched
        schema: z.string().nullable(),
      }),
      tasks: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        // REMOTE_TOOL_CALL tasks newer than taskCursor, as JSON string
        schema: z.string(),
      }),
      memoriesSynced: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.number(),
      }),
      serverTime: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        // Remote server's DB time at sync - use as cursor to avoid JS/container timezone skew
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
        memoriesHash: "sha256:abc123",
        capabilitiesVersion: "519b91e8edbf",
        taskCursor: "2026-01-01T00:00:00.000Z",
      },
    },
    responses: {
      default: {
        remoteMemoriesHash: "sha256:xyz789",
        memories: null,
        remoteCapabilitiesVersion: "519b91e8edbf",
        capabilities: null,
        tasks: "[]",
        memoriesSynced: 0,
        serverTime: "2026-01-01T00:00:00.000Z",
      },
    },
  },
});

export const endpoints = { POST };

export type SyncRequestOutput = typeof POST.types.RequestOutput;
export type SyncResponseOutput = typeof POST.types.ResponseOutput;

export default endpoints;
