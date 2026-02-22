/**
 * SSH Connection [id] Endpoint — GET / PATCH / DELETE
 * Stub: GET returns connection detail, PATCH/DELETE are placeholders
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
import { ConnectionDetailContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "connections", "[id]"],
  title: "connections.id.get.title",
  description: "connections.id.get.description",
  icon: "server",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: ConnectionDetailContainer,
    usage: { request: "data", response: true } as const,
    children: {
      id: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.id.title",
        schema: z.string(),
      }),
      label: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.label.title",
        schema: z.string(),
      }),
      host: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.host.title",
        schema: z.string(),
      }),
      port: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.port.title",
        schema: z.number(),
      }),
      username: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.username.title",
        schema: z.string(),
      }),
      authType: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.authType.title",
        schema: z.enum(SshAuthTypeDB),
      }),
      isDefault: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.isDefault.title",
        schema: z.boolean(),
      }),
      fingerprint: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.fingerprint.title",
        schema: z.string().nullable(),
      }),
      notes: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.notes.title",
        schema: z.string().nullable(),
      }),
      createdAt: responseField({
        type: WidgetType.TEXT,
        content: "connections.id.get.response.createdAt.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "connections.id.get.success.title",
    description: "connections.id.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "connections.id.get.errors.validation.title",
      description: "connections.id.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "connections.id.get.errors.unauthorized.title",
      description: "connections.id.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "connections.id.get.errors.forbidden.title",
      description: "connections.id.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "connections.id.get.errors.server.title",
      description: "connections.id.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "connections.id.get.errors.notFound.title",
      description: "connections.id.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "connections.id.get.errors.unknown.title",
      description: "connections.id.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "connections.id.get.errors.unsavedChanges.title",
      description: "connections.id.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "connections.id.get.errors.conflict.title",
      description: "connections.id.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "connections.id.get.errors.network.title",
      description: "connections.id.get.errors.network.description",
    },
  },

  examples: {
    requests: { default: {} },
    responses: {
      default: {
        id: "uuid",
        label: "prod",
        host: "1.2.3.4",
        port: 22,
        username: "deploy",
        authType: SshAuthType.PASSWORD,
        isDefault: false,
        fingerprint: null,
        notes: null,
        createdAt: "2026-01-01T00:00:00Z",
      },
    },
  },
});

export type ConnectionDetailRequestOutput = typeof GET.types.RequestOutput;
export type ConnectionDetailResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
