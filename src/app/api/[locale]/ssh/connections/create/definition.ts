/**
 * SSH Connections Create Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SshAuthType, SshAuthTypeDB } from "../../enum";
import { ConnectionCreateContainer } from "./widget";

export const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["ssh", "connections", "create"],
  title: "app.api.ssh.connections.create.post.title",
  description: "app.api.ssh.connections.create.post.description",
  icon: "plus",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: ConnectionCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      label: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.connections.create.post.fields.label.label",
        description:
          "app.api.ssh.connections.create.post.fields.label.description",
        placeholder:
          "app.api.ssh.connections.create.post.fields.label.placeholder",
        schema: z.string().min(1).max(100),
      }),
      host: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.connections.create.post.fields.host.label",
        description:
          "app.api.ssh.connections.create.post.fields.host.description",
        placeholder:
          "app.api.ssh.connections.create.post.fields.host.placeholder",
        schema: z.string().min(1),
      }),
      port: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "app.api.ssh.connections.create.post.fields.port.label",
        description:
          "app.api.ssh.connections.create.post.fields.port.description",
        placeholder:
          "app.api.ssh.connections.create.post.fields.port.placeholder",
        schema: z.coerce.number().min(1).max(65535).default(22),
      }),
      username: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.connections.create.post.fields.username.label",
        description:
          "app.api.ssh.connections.create.post.fields.username.description",
        placeholder:
          "app.api.ssh.connections.create.post.fields.username.placeholder",
        schema: z.string().min(1),
      }),
      authType: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.connections.create.post.fields.authType.label",
        description:
          "app.api.ssh.connections.create.post.fields.authType.description",
        schema: z.enum(SshAuthTypeDB),
      }),
      secret: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.connections.create.post.fields.secret.label",
        description:
          "app.api.ssh.connections.create.post.fields.secret.description",
        schema: z.string().optional(),
      }),
      passphrase: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.connections.create.post.fields.passphrase.label",
        description:
          "app.api.ssh.connections.create.post.fields.passphrase.description",
        schema: z.string().optional(),
      }),
      isDefault: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.ssh.connections.create.post.fields.isDefault.label",
        description:
          "app.api.ssh.connections.create.post.fields.isDefault.description",
        schema: z.boolean().optional(),
      }),
      notes: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.connections.create.post.fields.notes.label",
        description:
          "app.api.ssh.connections.create.post.fields.notes.description",
        schema: z.string().optional(),
      }),
      id: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.connections.create.post.response.id.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.connections.create.post.success.title",
    description: "app.api.ssh.connections.create.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.connections.create.post.errors.validation.title",
      description:
        "app.api.ssh.connections.create.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.connections.create.post.errors.unauthorized.title",
      description:
        "app.api.ssh.connections.create.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.connections.create.post.errors.forbidden.title",
      description:
        "app.api.ssh.connections.create.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.connections.create.post.errors.server.title",
      description:
        "app.api.ssh.connections.create.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.connections.create.post.errors.notFound.title",
      description:
        "app.api.ssh.connections.create.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.connections.create.post.errors.unknown.title",
      description:
        "app.api.ssh.connections.create.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.connections.create.post.errors.unsavedChanges.title",
      description:
        "app.api.ssh.connections.create.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.connections.create.post.errors.conflict.title",
      description:
        "app.api.ssh.connections.create.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.connections.create.post.errors.network.title",
      description:
        "app.api.ssh.connections.create.post.errors.network.description",
    },
  },

  examples: {
    requests: {
      default: {
        label: "prod",
        host: "192.168.1.1",
        port: 22,
        username: "deploy",
        authType: SshAuthType.PASSWORD,
        secret: "pass",
        isDefault: false,
      },
    },
    responses: { default: { id: "uuid-1" } },
  },
});

export type ConnectionCreateRequestOutput = typeof POST.types.RequestOutput;
export type ConnectionCreateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
