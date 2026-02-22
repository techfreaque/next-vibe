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
import { scopedTranslation } from "../../i18n";
import { ConnectionCreateContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "connections", "create"],
  title: "connections.create.post.title",
  description: "connections.create.post.description",
  icon: "plus",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: ConnectionCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      label: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "connections.create.post.fields.label.label",
        description: "connections.create.post.fields.label.description",
        placeholder: "connections.create.post.fields.label.placeholder",
        schema: z.string().min(1).max(100),
      }),
      host: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "connections.create.post.fields.host.label",
        description: "connections.create.post.fields.host.description",
        placeholder: "connections.create.post.fields.host.placeholder",
        schema: z.string().min(1),
      }),
      port: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "connections.create.post.fields.port.label",
        description: "connections.create.post.fields.port.description",
        placeholder: "connections.create.post.fields.port.placeholder",
        schema: z.coerce.number().min(1).max(65535).default(22),
      }),
      username: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "connections.create.post.fields.username.label",
        description: "connections.create.post.fields.username.description",
        placeholder: "connections.create.post.fields.username.placeholder",
        schema: z.string().min(1),
      }),
      authType: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "connections.create.post.fields.authType.label",
        description: "connections.create.post.fields.authType.description",
        schema: z.enum(SshAuthTypeDB),
      }),
      secret: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "connections.create.post.fields.secret.label",
        description: "connections.create.post.fields.secret.description",
        schema: z.string().optional(),
      }),
      passphrase: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "connections.create.post.fields.passphrase.label",
        description: "connections.create.post.fields.passphrase.description",
        schema: z.string().optional(),
      }),
      isDefault: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "connections.create.post.fields.isDefault.label",
        description: "connections.create.post.fields.isDefault.description",
        schema: z.boolean().optional(),
      }),
      notes: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "connections.create.post.fields.notes.label",
        description: "connections.create.post.fields.notes.description",
        schema: z.string().optional(),
      }),
      id: responseField({
        type: WidgetType.TEXT,
        content: "connections.create.post.response.id.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "connections.create.post.success.title",
    description: "connections.create.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "connections.create.post.errors.validation.title",
      description: "connections.create.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "connections.create.post.errors.unauthorized.title",
      description: "connections.create.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "connections.create.post.errors.forbidden.title",
      description: "connections.create.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "connections.create.post.errors.server.title",
      description: "connections.create.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "connections.create.post.errors.notFound.title",
      description: "connections.create.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "connections.create.post.errors.unknown.title",
      description: "connections.create.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "connections.create.post.errors.unsavedChanges.title",
      description: "connections.create.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "connections.create.post.errors.conflict.title",
      description: "connections.create.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "connections.create.post.errors.network.title",
      description: "connections.create.post.errors.network.description",
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
