/**
 * SSH Connections List Endpoint Definition
 */

import { z } from "zod";

import { ConnectionHealthSchema } from "@/app/api/[locale]/remote-connection/db";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SshAuthType, SshAuthTypeDB } from "../../enum";
import { SSH_CONNECTIONS_LIST_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const ConnectionTypeSchema = z.enum(["local", "ssh", "remote"]);
const AuthTypeWithRemoteDB = [...SshAuthTypeDB, "remote"] as const;

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

const ConnectionsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ConnectionsListContainer })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "connections", "list"],
  aliases: [SSH_CONNECTIONS_LIST_ALIAS] as const,
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "server",
  category: "ssh",
  subCategory: "Connections",
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: ConnectionsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connections: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.connections.title",
        schema: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
            host: z.string(),
            port: z.number(),
            username: z.string(),
            authType: z.enum(AuthTypeWithRemoteDB),
            isDefault: z.boolean(),
            fingerprint: z.string().nullable(),
            notes: z.string().nullable(),
            createdAt: z.string(),
            connectionType: ConnectionTypeSchema,
            health: ConnectionHealthSchema.nullable(),
            remoteInstanceId: z.string().nullable(),
            transportMode: z.string().nullable(),
          }),
        ),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.title",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
  },

  examples: {
    requests: undefined,
    responses: {
      default: {
        connections: [
          {
            id: "uuid-1",
            label: "Local Machine",
            host: "localhost",
            port: 0,
            username: "deploy",
            authType: SshAuthType.LOCAL,
            isDefault: true,
            fingerprint: null,
            notes: "Built-in local shell",
            createdAt: "2026-01-01T00:00:00Z",
            connectionType: "local" as const,
            health: null,
            remoteInstanceId: null,
            transportMode: null,
          },
          {
            id: "uuid-2",
            label: "prod-web-01",
            host: "192.168.1.1",
            port: 22,
            username: "deploy",
            authType: SshAuthType.PRIVATE_KEY,
            isDefault: false,
            fingerprint: null,
            notes: null,
            createdAt: "2026-01-01T00:00:00Z",
            connectionType: "ssh" as const,
            health: null,
            remoteInstanceId: null,
            transportMode: null,
          },
          {
            id: "uuid-3",
            label: "thea",
            host: "https://unbottled.ai",
            port: 0,
            username: "thea",
            authType: "remote" as const,
            isDefault: false,
            fingerprint: null,
            notes: null,
            createdAt: "2026-03-01T00:00:00Z",
            connectionType: "remote" as const,
            health: "healthy" as const,
            remoteInstanceId: "thea",
            transportMode: "reverse-ws",
          },
        ],
      },
    },
  },
});

export type ConnectionsListRequestOutput = typeof GET.types.RequestOutput;
export type ConnectionsListResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
