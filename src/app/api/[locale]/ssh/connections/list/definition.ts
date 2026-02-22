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
import { scopedTranslation } from "../../i18n";
import { ConnectionsListContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "connections", "list"],
  title: "connections.list.get.title",
  description: "connections.list.get.description",
  icon: "server",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: ConnectionsListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      connections: responseField({
        type: WidgetType.TEXT,
        content: "connections.list.get.response.connections.title",
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
    title: "connections.list.get.success.title",
    description: "connections.list.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "connections.list.get.errors.validation.title",
      description: "connections.list.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "connections.list.get.errors.unauthorized.title",
      description: "connections.list.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "connections.list.get.errors.forbidden.title",
      description: "connections.list.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "connections.list.get.errors.server.title",
      description: "connections.list.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "connections.list.get.errors.notFound.title",
      description: "connections.list.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "connections.list.get.errors.unknown.title",
      description: "connections.list.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "connections.list.get.errors.unsavedChanges.title",
      description: "connections.list.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "connections.list.get.errors.conflict.title",
      description: "connections.list.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "connections.list.get.errors.network.title",
      description: "connections.list.get.errors.network.description",
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
