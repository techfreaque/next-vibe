/**
 * SSH Connections Create Endpoint Definition
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { SshAuthType, SshAuthTypeDB, SshAuthTypeOptions } from "../../enum";
import { scopedTranslation } from "./i18n";
import { ConnectionCreateContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "connections", "create"],
  title: "post.title",
  description: "post.description",
  icon: "plus",
  category: "endpointCategories.ssh",
  subCategory: "endpointCategories.sshConnections",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: ConnectionCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      label: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.label.label",
        description: "post.fields.label.description",
        placeholder: "post.fields.label.placeholder",
        schema: z.string().min(1).max(100),
      }),
      host: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.host.label",
        description: "post.fields.host.description",
        placeholder: "post.fields.host.placeholder",
        schema: z.string().optional(),
      }),
      port: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.port.label",
        description: "post.fields.port.description",
        placeholder: "post.fields.port.placeholder",
        schema: z.coerce.number().min(1).max(65535).default(22),
      }),
      username: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.username.label",
        description: "post.fields.username.description",
        placeholder: "post.fields.username.placeholder",
        schema: z.string().min(1),
      }),
      authType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.authType.label",
        description: "post.fields.authType.description",
        options: SshAuthTypeOptions,
        schema: z.enum(SshAuthTypeDB),
      }),
      secret: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.secret.label",
        description: "post.fields.secret.description",
        schema: z.string().optional(),
      }),
      passphrase: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.passphrase.label",
        description: "post.fields.passphrase.description",
        schema: z.string().optional(),
      }),
      isDefault: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.isDefault.label",
        description: "post.fields.isDefault.description",
        schema: z.boolean().optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.notes.label",
        description: "post.fields.notes.description",
        schema: z.string().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id.title",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.title",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
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
