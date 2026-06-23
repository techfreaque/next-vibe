/**
 * Remote Connection by Instance ID
 * GET    - full connection detail (status + settings)
 * PATCH  - update settings (rename, behavior, sync scope, reauth, inference flags)
 * DELETE - disconnect (remove connection, close WS, archive subfolder)
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import remoteConnectionListDefinitions from "@/app/api/[locale]/remote-connection/list/definition";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SyncScopeSchema, TransportModeSchema } from "../db";
import { scopedTranslation } from "./i18n";

const RemoteConnectionByIdWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RemoteConnectionByIdWidget })),
);

const instanceIdField = requestUrlPathParamsField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.ENTITY_PICKER,
  listEndpoint: remoteConnectionListDefinitions.GET,
  labelField: "name",
  label: "get.instanceId.label" as const,
  description: "get.instanceId.description" as const,
  schema: z.string().min(1).max(32),
  hidden: true,
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["remote-connection", "[instanceId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "link" as const,
  category: "devTools",
  subCategory: "remoteInstances",
  tags: ["tags.remoteConnection" as const],
  aliases: ["remote-status", "connection-status"] as const,

  fields: customWidgetObject({
    render: RemoteConnectionByIdWidget,
    usage: { response: true, request: "urlPathParams" } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true },
      }),
      instanceId: instanceIdField,
      // ── Status ──────────────────────────────────────────────────────────
      isConnected: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
      remoteUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      isActive: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean().nullable(),
      }),
      lastSyncedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      wsConnectedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      remoteInstanceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      capabilitiesVersion: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      transportMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      // ── Behavior ────────────────────────────────────────────────────────
      loopLocation: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: LoopLocationSchema.nullable(),
      }),
      threadMirrorMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: ThreadMirrorModeSchema.nullable(),
      }),
      toolSource: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: ToolSourceSchema.nullable(),
      }),
      isInferenceProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean().nullable(),
      }),
      forceSystemProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean().nullable(),
      }),
      // ── Sync ────────────────────────────────────────────────────────────
      syncScope: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: SyncScopeSchema.nullable(),
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
      default: { instanceId: "hermes" },
    },
    responses: {
      connected: {
        isConnected: true,
        remoteUrl: "https://unbottled.ai",
        isActive: true,
        lastSyncedAt: "2026-03-01T12:00:00.000Z",
        wsConnectedAt: "2026-03-01T11:00:00.000Z",
        remoteInstanceId: "atlas",
        capabilitiesVersion: "abc123",
        transportMode: "reverse-ws",
        loopLocation: "server",
        threadMirrorMode: "both",
        toolSource: "local",
        isInferenceProvider: false,
        forceSystemProvider: false,
        syncScope: {
          memories: true,
          documents: true,
          skills: true,
          favorites: false,
          threads: false,
        },
      },
      notConnected: {
        isConnected: false,
        remoteUrl: null,
        isActive: null,
        lastSyncedAt: null,
        wsConnectedAt: null,
        remoteInstanceId: null,
        capabilitiesVersion: null,
        transportMode: null,
        loopLocation: null,
        threadMirrorMode: null,
        toolSource: null,
        isInferenceProvider: null,
        forceSystemProvider: null,
        syncScope: null,
      },
    },
  },
});

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["remote-connection", "[instanceId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "patch.title" as const,
  titleShort: "patch.titleShort" as const,
  description: "patch.description" as const,
  icon: "settings" as const,
  category: "devTools",
  subCategory: "remoteInstances",
  tags: ["tags.remoteConnection" as const],

  fields: customWidgetObject({
    render: RemoteConnectionByIdWidget,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      instanceId: instanceIdField,
      // ── Rename ──────────────────────────────────────────────────────────
      newInstanceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.newInstanceId.label" as const,
        description: "patch.newInstanceId.description" as const,
        schema: z.string().min(1).max(32).optional(),
      }),
      // ── Reauth ──────────────────────────────────────────────────────────
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "patch.email.label" as const,
        description: "patch.email.description" as const,
        schema: z.string().email().optional(),
      }),
      password: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "patch.password.label" as const,
        description: "patch.password.description" as const,
        schema: z.string().min(1).optional(),
      }),
      // transportMode is NOT a request field — it is auto-negotiated and
      // dispatch-driven (spec.md → Transport). The response exposes it
      // read-only for status display.
      // ── Behavior ────────────────────────────────────────────────────────
      isInferenceProvider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.isInferenceProvider.label" as const,
        description: "patch.isInferenceProvider.description" as const,
        schema: z.boolean().optional(),
      }),
      forceSystemProvider: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.forceSystemProvider.label" as const,
        description: "patch.forceSystemProvider.description" as const,
        schema: z.boolean().optional(),
      }),
      loopLocation: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.loopLocation.label" as const,
        description: "patch.loopLocation.description" as const,
        options: [
          { value: "client", label: "client" },
          { value: "server", label: "server" },
        ] as const,
        schema: LoopLocationSchema.optional(),
      }),
      threadMirrorMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.threadMirrorMode.label" as const,
        description: "patch.threadMirrorMode.description" as const,
        options: [
          { value: "cloud", label: "cloud" },
          { value: "local", label: "local" },
          { value: "both", label: "both" },
          { value: "none", label: "none" },
        ] as const,
        schema: ThreadMirrorModeSchema.optional(),
      }),
      toolSource: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.toolSource.label" as const,
        description: "patch.toolSource.description" as const,
        options: [
          { value: "local", label: "local" },
          { value: "remote", label: "remote" },
          { value: "both", label: "both" },
        ] as const,
        schema: ToolSourceSchema.optional(),
      }),
      // ── Sync scope ──────────────────────────────────────────────────────
      syncScope: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "patch.syncScope.label" as const,
        description: "patch.syncScope.description" as const,
        schema: SyncScopeSchema.optional(),
      }),
      // ── Reconnect ───────────────────────────────────────────────────────
      reconnectNow: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.reconnectNow.label" as const,
        description: "patch.reconnectNow.description" as const,
        schema: z.boolean().optional(),
        hidden: true,
      }),
      // ── Response ────────────────────────────────────────────────────────
      updated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {},

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    urlPathParams: { default: { instanceId: "hermes" } },
    requests: {
      rename: { newInstanceId: "hermes-work" },
      reauth: { email: "you@example.com", password: "new-password" },
      inferenceProvider: { isInferenceProvider: true },
      forceSystem: { forceSystemProvider: true },
      loopClient: { loopLocation: "client" as const },
      mirrorBoth: { threadMirrorMode: "both" as const },
      syncScope: {
        syncScope: {
          memories: true,
          documents: false,
          skills: true,
          favorites: false,
          threads: false,
        },
      },
      reconnectNow: { reconnectNow: true },
    },
    responses: { default: { updated: true } },
  },
});

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["remote-connection", "[instanceId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  titleShort: "delete.titleShort" as const,
  description: "delete.description" as const,
  icon: "trash" as const,
  category: "devTools",
  subCategory: "remoteInstances",
  tags: ["tags.remoteConnection" as const],

  fields: customWidgetObject({
    render: RemoteConnectionByIdWidget,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      instanceId: instanceIdField,
      disconnected: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {},

  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  examples: {
    urlPathParams: { default: { instanceId: "hermes" } },
    responses: { default: { disconnected: true } },
  },
});

export type RemoteConnectionByIdGetResponseOutput =
  typeof GET.types.ResponseOutput;
export type RemoteConnectionByIdPatchRequestOutput =
  typeof PATCH.types.RequestOutput;
export type RemoteConnectionByIdPatchResponseOutput =
  typeof PATCH.types.ResponseOutput;
export type RemoteConnectionByIdDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { GET, PATCH, DELETE };
export default definitions;
