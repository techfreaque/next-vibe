/**
 * Remote Connection List API Definition
 * GET - list all remote connections for the current user
 * Admin users see all connections across all users
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { ConnectionHealthSchema } from "@/app/api/[locale]/user/remote-connection/db";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const RemoteConnectionsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.RemoteConnectionsListContainer,
  })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "remote-connection", "list"],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "link",
  category: "endpointCategories.remote",
  subCategory: "endpointCategories.remoteInstances",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  tags: ["tags.remoteConnection" as const],
  aliases: ["remote-connections", "list-connections"] as const,

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
            lastSyncedAt: z.string().nullable(),
            hasToken: z.boolean(),
            healthStatus: ConnectionHealthSchema,
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
            lastSyncedAt: "2026-03-01T12:00:00.000Z",
            hasToken: true,
            healthStatus: "healthy",
          },
        ],
        selfInstanceId: "hermes-dev",
        syncEnabled: false,
      },
    },
  },
});

export type RemoteConnectionsListResponseOutput =
  typeof GET.types.ResponseOutput;
export type RemoteConnection =
  RemoteConnectionsListResponseOutput["connections"][number];

const endpoints = { GET };
export default endpoints;
