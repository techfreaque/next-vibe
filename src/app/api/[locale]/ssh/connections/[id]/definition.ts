/**
 * SSH Connection [id] Endpoint — GET / PATCH / DELETE
 * Stub: GET returns connection detail, PATCH/DELETE are placeholders
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SshAuthType, SshAuthTypeDB } from "../../enum";
import { scopedTranslation } from "./i18n";
import { ConnectionDetailContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "connections", "[id]"],
  title: "get.title",
  description: "get.description",
  icon: "server",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: ConnectionDetailContainer,
    usage: { request: "data", response: true } as const,
    children: {
      id: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id.title",
        schema: z.string(),
      }),
      label: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.label.title",
        schema: z.string(),
      }),
      host: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.host.title",
        schema: z.string(),
      }),
      port: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.port.title",
        schema: z.number(),
      }),
      username: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.username.title",
        schema: z.string(),
      }),
      authType: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.authType.title",
        schema: z.enum(SshAuthTypeDB),
      }),
      isDefault: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.isDefault.title",
        schema: z.boolean(),
      }),
      fingerprint: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.fingerprint.title",
        schema: z.string().nullable(),
      }),
      notes: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.notes.title",
        schema: z.string().nullable(),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.createdAt.title",
        schema: z.string(),
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
      description: "get.errors.unknown.description",
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
