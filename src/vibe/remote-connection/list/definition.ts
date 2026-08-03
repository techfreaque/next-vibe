/**
 * Remote Connection List API Definition
 * GET - list all remote connections for the current user
 * Admin users see all connections across all users
 */

import { createEndpoint } from "../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../core/definition/enums";
import { UserRole } from "../../identity/roles/enum";
import { lazyWidget } from "../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "../../unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { ConnectionHealthSchema, TransportModeSchema } from "../db";
import { REMOTE_CONNECTIONS_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const RemoteConnectionsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.RemoteConnectionsListContainer,
  })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "remote-connection", "list"],
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "link",
  category: "devTools",
  subCategory: "remoteInstances",
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,
  tags: ["tags.remoteConnection" as const],
  aliases: [REMOTE_CONNECTIONS_ALIAS] as const,

  fields: customWidgetObject({
    render: RemoteConnectionsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      activeOnly: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "get.fields.activeOnly.label",
        description: "get.fields.activeOnly.description",
        hidden: true,
        schema: z.boolean().optional(),
      }),
      connections: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            instanceId: z.string(),
            remoteUrl: z.string(),
            /** Local instance URL - set on cloud-side records for direct embedding via vibe-frame */
            localUrl: z.string().nullable(),
            isActive: z.boolean(),
            isInferenceProvider: z.boolean(),
            lastSyncedAt: z.string().nullable(),
            hasToken: z.boolean(),
            healthStatus: ConnectionHealthSchema,
            /** True for incoming connections (cloud-side reverse entries) */
            isReverseEntry: z.boolean(),
            /** How WE reach the peer (our send leg). */
            transportMode: TransportModeSchema.nullable(),
            /** How the PEER reaches us (mirror of the peer's transportMode). */
            remoteTransportMode: TransportModeSchema.nullable(),
          }),
        ),
      }),
      selfInstanceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      syncEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean().nullable(),
      }),
      hasInferenceProvider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
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
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
  },

  examples: {
    requests: { default: {} },
    responses: {
      default: {
        connections: [
          {
            instanceId: "hermes",
            remoteUrl: "https://unbottled.ai",
            localUrl: null,
            isActive: true,
            isInferenceProvider: true,
            lastSyncedAt: "2026-03-01T12:00:00.000Z",
            hasToken: true,
            healthStatus: "healthy",
            isReverseEntry: true,
            transportMode: "reverse-ws",
            remoteTransportMode: "direct-http",
          },
        ],
        selfInstanceId: "atlas",
        syncEnabled: false,
        hasInferenceProvider: false,
      },
    },
  },
});

export type RemoteConnectionsListResponseOutput =
  typeof GET.types.ResponseOutput;
export type RemoteConnection =
  RemoteConnectionsListResponseOutput["connections"][number];

const endpoints = { GET } as const;
export default endpoints;
