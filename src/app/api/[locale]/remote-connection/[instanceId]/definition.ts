/**
 * Remote Connection by Instance ID
 * GET    - full connection detail (status + settings)
 * PATCH  - update settings (rename, behavior, sync scope, reauth, inference flags)
 * DELETE - disconnect (remove connection, close WS, archive subfolder)
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  backButton,
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { SyncScopeSchema, TransportModeSchema } from "../db";
import { scopedTranslation } from "./i18n";

const RemoteConnectionByIdWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RemoteConnectionByIdWidget })),
);

const instanceIdField = requestUrlPathParamsField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.ENTITY_PICKER,
  listEndpoint: async () =>
    (await import("@/app/api/[locale]/remote-connection/list/definition"))
      .default.GET,
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
      remoteTransportMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string().nullable(),
      }),
      // ── Behavior ────────────────────────────────────────────────────────
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
        capabilitiesVersion: "abc123",
        transportMode: "reverse-ws",
        remoteTransportMode: "direct-http",
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
        capabilitiesVersion: null,
        transportMode: null,
        remoteTransportMode: null,
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
        schema: z
          .string()
          .optional()
          .transform((v) => (v === "" ? undefined : v))
          .pipe(z.string().min(1).max(32).optional()),
      }),
      // ── Reauth ──────────────────────────────────────────────────────────
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "patch.email.label" as const,
        description: "patch.email.description" as const,
        schema: z
          .string()
          .optional()
          .transform((v) => (v === "" ? undefined : v))
          .pipe(z.string().email().optional()),
      }),
      password: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "patch.password.label" as const,
        description: "patch.password.description" as const,
        schema: z
          .string()
          .optional()
          .transform((v) => (v === "" ? undefined : v))
          .pipe(z.string().min(1).optional()),
      }),
      // ── Transport ───────────────────────────────────────────────────────
      transportMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.transportMode.label" as const,
        description: "patch.transportMode.description" as const,
        options: [
          {
            value: "reverse-ws",
            label: "patch.transportMode.options.reverseWs" as const,
          },
          {
            value: "direct-http",
            label: "patch.transportMode.options.directHttp" as const,
          },
        ],
        schema: TransportModeSchema.optional(),
        hidden: true,
      }),
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
      threadMirrorMode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.threadMirrorMode.label" as const,
        description: "patch.threadMirrorMode.description" as const,
        options: [
          {
            value: "both",
            label: "patch.threadMirrorMode.options.both" as const,
          },
          {
            value: "off",
            label: "patch.threadMirrorMode.options.off" as const,
          },
        ],
        schema: z.enum(["both", "off"]).optional(),
      }),
      loopLocation: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "patch.loopLocation.label" as const,
        description: "patch.loopLocation.description" as const,
        options: [
          {
            value: "target",
            label: "patch.loopLocation.options.target" as const,
          },
          {
            value: "caller",
            label: "patch.loopLocation.options.caller" as const,
          },
        ],
        schema: z.enum(["target", "caller"]).optional(),
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
    urlPathParams: { default: { instanceId: "hermes" } },
    requests: {
      rename: { newInstanceId: "hermes-work" },
      reauth: { email: "you@example.com", password: "new-password" },
      inferenceProvider: { isInferenceProvider: true },
      forceSystem: { forceSystemProvider: true },
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
      transportMode: { transportMode: "reverse-ws" as const },
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

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } =
          await import("next-vibe/platforms/react/hooks/store");
        const listDefinition =
          await import("@/app/api/[locale]/remote-connection/list/definition");
        const instanceId = data.pathParams.instanceId;
        apiClient.updateEndpointData(
          listDefinition.GET,
          data.logger,
          (prev) => {
            if (!prev?.success) {
              return undefined;
            }
            return {
              success: true,
              data: {
                ...prev.data,
                connections: prev.data.connections.filter(
                  (c) => c.instanceId !== instanceId,
                ),
              },
            };
          },
        );
      },
    },
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

const definitions = { GET, PATCH, DELETE } as const;
export default definitions;
