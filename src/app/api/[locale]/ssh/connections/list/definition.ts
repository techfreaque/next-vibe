/**
 * SSH Connections List Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SshAuthType, SshAuthTypeDB } from "../../enum";
import { ConnectionsListContainer } from "./widget";

export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["ssh", "connections", "list"],
  title: "app.api.ssh.connections.list.get.title",
  description: "app.api.ssh.connections.list.get.description",
  icon: "server",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: ConnectionsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connections: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.connections.list.get.response.connections.title",
        schema: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
            host: z.string(),
            port: z.number(),
            username: z.string(),
            authType: z.enum(SshAuthTypeDB),
            isDefault: z.boolean(),
            fingerprint: z.string().nullable(),
            notes: z.string().nullable(),
            createdAt: z.string(),
          }),
        ),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.connections.list.get.success.title",
    description: "app.api.ssh.connections.list.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.connections.list.get.errors.validation.title",
      description:
        "app.api.ssh.connections.list.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.connections.list.get.errors.unauthorized.title",
      description:
        "app.api.ssh.connections.list.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.connections.list.get.errors.forbidden.title",
      description:
        "app.api.ssh.connections.list.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.connections.list.get.errors.server.title",
      description: "app.api.ssh.connections.list.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.connections.list.get.errors.notFound.title",
      description:
        "app.api.ssh.connections.list.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.connections.list.get.errors.unknown.title",
      description:
        "app.api.ssh.connections.list.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.connections.list.get.errors.unsavedChanges.title",
      description:
        "app.api.ssh.connections.list.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.connections.list.get.errors.conflict.title",
      description:
        "app.api.ssh.connections.list.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.connections.list.get.errors.network.title",
      description:
        "app.api.ssh.connections.list.get.errors.network.description",
    },
  },

  examples: {
    requests: { default: {} },
    responses: {
      default: {
        connections: [
          {
            id: "uuid-1",
            label: "prod-web-01",
            host: "192.168.1.1",
            port: 22,
            username: "deploy",
            authType: SshAuthType.PRIVATE_KEY,
            isDefault: true,
            fingerprint: null,
            notes: null,
            createdAt: "2026-01-01T00:00:00Z",
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
